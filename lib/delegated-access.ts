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
 * Mark a delegation token as used and commit the delegated application to the database
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

  // 2. Upsert/Update the application record in the applications collection
  const delegateHelper = record.delegateName || "a trusted helper";
  
  const appDoc = {
    id: record.applicationId,
    userId: record.createdBy,
    serviceType: record.intent,
    status: "document-verification",
    currentStep: "Delegated submission completed",
    nextAction: "Official verification pending",
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
          step: "Delegated proxy completion",
          timestamp: completedAt.toISOString(),
          note: `Completed by ${delegateHelper} via secure proxy link`,
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
