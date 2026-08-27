import { z } from "zod";

export const questionSchemas = {
  "ownership-transfer": z.object({
    vehicle: z.string().trim().min(5, "Enter a valid vehicle registration number."),
    state: z.string().min(1, "Select the registration state."),
    loan: z.string().min(1, "Select the loan status."),
  }),
  "license-renewal": z.object({
    licence: z.string().trim().min(5, "Enter a valid driving licence number."),
    state: z.string().min(1, "Select the issuing state."),
    expired: z.string().min(1, "Select the expiry status."),
  }),
};

export type IntentKey = keyof typeof questionSchemas;
export function requirementFor(intent: IntentKey, field: string) {
  const schema = (questionSchemas[intent].shape as Record<string, z.ZodTypeAny>)[field];
  return schema && !schema.isOptional() ? "Required" : "Optional";
}

export function validateAnswer(intent: IntentKey, field: string, value: string) {
  const fieldSchema = (questionSchemas[intent].shape as Record<string, z.ZodTypeAny>)[field];
  return fieldSchema.safeParse(value);
}
