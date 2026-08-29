import { z } from "zod";

export const questionSchemas = {
  "ownership-transfer": z.object({
    vehicle: z
      .string()
      .trim()
      .min(5, "Enter a valid vehicle registration number (e.g. DL 01 AB 1234)."),
    chassis: z
      .string()
      .trim()
      .min(4, "Enter at least 5 characters of the chassis number."),
    state: z
      .string()
      .min(1, "Select the vehicle registration state & RTO."),
    transferType: z
      .string()
      .min(1, "Select the type of ownership transfer."),
    jurisdiction: z
      .string()
      .min(1, "Select the transfer jurisdiction."),
    buyerName: z
      .string()
      .trim()
      .min(3, "Enter the buyer's full legal name."),
    buyerFather: z
      .string()
      .trim()
      .min(3, "Enter the buyer's father's or husband's name."),
    buyerAddress: z
      .string()
      .trim()
      .min(10, "Enter the complete residential address with PIN code."),
    saleAmount: z
      .string()
      .trim()
      .min(1, "Enter the agreed sale consideration value in ₹."),
    loan: z
      .string()
      .min(1, "Select the loan / hypothecation status."),
  }),
  "license-renewal": z.object({
    licence: z
      .string()
      .trim()
      .min(5, "Enter a valid driving licence number (e.g. DL-0420110012345)."),
    dob: z
      .string()
      .trim()
      .min(8, "Enter a valid date of birth (YYYY-MM-DD)."),
    state: z
      .string()
      .min(1, "Select the issuing state and RTO."),
    vehicleClass: z
      .string()
      .min(1, "Select the vehicle class / category."),
    expiryStatus: z
      .string()
      .min(1, "Select the licence validity status."),
    ageCategory: z
      .string()
      .min(1, "Select your age category."),
    medicalDeclaration: z
      .string()
      .min(1, "Please confirm the physical fitness declaration."),
    bloodGroup: z
      .string()
      .min(1, "Select your blood group."),
    organDonor: z
      .string()
      .min(1, "Please indicate your organ donation choice."),
    addressChange: z
      .string()
      .min(1, "Select your address preference."),
  }),
};

export type IntentKey = keyof typeof questionSchemas;

export function requirementFor(intent: IntentKey, field: string) {
  const schema = (questionSchemas[intent].shape as Record<string, z.ZodTypeAny>)[field];
  return schema && !schema.isOptional() ? "Required" : "Optional";
}

export function validateAnswer(intent: IntentKey, field: string, value: string) {
  const fieldSchema = (questionSchemas[intent].shape as Record<string, z.ZodTypeAny>)[field];
  if (!fieldSchema) return z.string().safeParse(value);
  return fieldSchema.safeParse(value);
}
