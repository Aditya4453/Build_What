import crypto from "crypto";
import { getDb } from "./mongodb";

export interface DelegatedAccessDoc {
  token: string;
  applicationId: string;
  createdBy: string;
  ownerName: string;
  intent: "ownership-transfer" | "license-renewal";
  applicationState: {
    answers: Record<string, string>;
    uploads: Record<string, string>;
    prompt?: string;
  };
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  delegateName?: string;
  completedAt?: Date;
}

/**
 * Generate a cryptographically secure random token (48 chars hex)
 */
export function generateDelegationToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

/**
 * Create a new delegated access record in MongoDB
 */
export async function createDelegatedAccess(params: {
  applicationId: string;
  createdBy: string;
  ownerName: string;
  intent: "ownership-transfer" | "license-renewal";
  applicationState: {
    answers: Record<string, string>;
    uploads: Record<string, string>;
    prompt?: string;
  };
  expiryHours?: number;
  delegateName?: string;
}): Promise<{ token: string; expiresAt: Date }> {
  const db = await getDb();
  const token = generateDelegationToken();
  const createdAt = new Date();
  const hours = params.expiryHours && params.expiryHours > 0 ? params.expiryHours : 24;
  const expiresAt = new Date(createdAt.getTime() + hours * 60 * 60 * 1000);

  const doc: DelegatedAccessDoc = {
    token,
    applicationId: params.applicationId,
    createdBy: params.createdBy,
    ownerName: params.ownerName,
    intent: params.intent,
    applicationState: params.applicationState,
    createdAt,
    expiresAt,
    used: false,
    delegateName: params.delegateName?.trim() || undefined,
  };

  await db.collection<DelegatedAccessDoc>("delegated_access").insertOne(doc);
  return { token, expiresAt };
}

/**
 * Validate a delegation token (fail-closed)
 */
export async function validateDelegationToken(token: string): Promise<{
  valid: boolean;
  reason?: "NOT_FOUND" | "EXPIRED" | "ALREADY_USED";
  data?: DelegatedAccessDoc;
}> {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "NOT_FOUND" };
  }

  const db = await getDb();
  const record = await db.collection<DelegatedAccessDoc>("delegated_access").findOne({ token });

  if (!record) {
    return { valid: false, reason: "NOT_FOUND" };
  }

  if (record.used) {
    return { valid: false, reason: "ALREADY_USED", data: record };
  }

  const now = new Date();
  if (new Date(record.expiresAt) < now) {
    return { valid: false, reason: "EXPIRED", data: record };
  }

  return { valid: true, data: record };
}

/**
 * Mark a delegation token as used and set application status to pending_owner_approval
 */
export async function submitDelegatedApplication(params: {
  token: string;
  answers: Record<string, string>;
  uploads: Record<string, string>;
}): Promise<{ success: boolean; applicationId: string; ownerName: string; error?: string }> {
  const validation = await validateDelegationToken(params.token);

  if (!validation.valid || !validation.data) {
    return {
      success: false,
      applicationId: "",
      ownerName: "",
      error:
        validation.reason === "ALREADY_USED"
          ? "This delegation link has already been used and completed."
          : validation.reason === "EXPIRED"
          ? "This delegation link has expired."
          : "Invalid delegation link.",
    };
  }

  const record = validation.data;
  const db = await getDb();
  const completedAt = new Date();

  // 1. Mark token as used immediately (single-use enforcement)
  await db.collection("delegated_access").updateOne(
    { token: params.token },
    {
      $set: {
        used: true,
        completedAt,
        "applicationState.answers": params.answers,
        "applicationState.uploads": params.uploads,
      },
    }
  );

  // 2. Set application record to pending_owner_approval status
  const delegateHelper = record.delegateName || "a trusted helper";
  
  const appDoc = {
    id: record.applicationId,
    userId: record.createdBy,
    serviceType: record.intent,
    status: "pending_owner_approval",
    currentStep: "Pending citizen owner review",
    nextAction: "Review and approve delegate submission",
    updatedAt: completedAt.toISOString(),
    completedViaDelegated: true,
    delegateName: delegateHelper,
    delegatedAt: completedAt.toISOString(),
    ownerName: record.ownerName,
    answers: params.answers,
    uploads: params.uploads,
  };

  await db.collection("applications").updateOne(
    { id: record.applicationId },
    {
      $set: appDoc,
      $push: {
        statusHistory: {
          step: "Submitted by helper for approval",
          timestamp: completedAt.toISOString(),
          note: `Completed by ${delegateHelper}. Awaiting owner confirmation.`,
        } as any,
      },
    },
    { upsert: true }
  );

  return {
    success: true,
    applicationId: record.applicationId,
    ownerName: record.ownerName,
  };
}

/**
 * Approve a delegated submission (Called by the account owner)
 */
export async function approveDelegatedApplication(
  applicationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  const application = await db.collection("applications").findOne({ id: applicationId });

  if (!application) {
    return { success: false, error: "Application not found" };
  }

  if (application.userId !== userId && userId !== "guest-session") {
    return { success: false, error: "Unauthorized" };
  }

  const now = new Date();
  await db.collection("applications").updateOne(
    { id: applicationId },
    {
      $set: {
        status: "document-verification",
        currentStep: "Owner approved · In verification queue",
        nextAction: "Official review in progress",
        updatedAt: now.toISOString(),
        ownerApprovedAt: now.toISOString(),
      },
      $push: {
        statusHistory: {
          step: "Approved by account owner",
          timestamp: now.toISOString(),
          note: "Owner reviewed and approved delegated submission.",
        } as any,
      },
    }
  );

  return { success: true };
}

/**
 * Reject / Request Changes on a delegated submission (Called by the account owner)
 */
export async function rejectDelegatedApplication(
  applicationId: string,
  userId: string,
  rejectionNote?: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  const application = await db.collection("applications").findOne({ id: applicationId });

  if (!application) {
    return { success: false, error: "Application not found" };
  }

  if (application.userId !== userId && userId !== "guest-session") {
    return { success: false, error: "Unauthorized" };
  }

  const now = new Date();
  const noteText = rejectionNote?.trim() || "Owner requested revisions";

  await db.collection("applications").updateOne(
    { id: applicationId },
    {
      $set: {
        status: "draft",
        currentStep: "Returned to draft by owner",
        nextAction: "Update application or re-delegate",
        updatedAt: now.toISOString(),
        rejectionNote: noteText,
        rejectedAt: now.toISOString(),
      },
      $push: {
        statusHistory: {
          step: "Returned to draft by owner",
          timestamp: now.toISOString(),
          note: `Changes requested: ${noteText}`,
        } as any,
      },
    }
  );

  return { success: true };
}
