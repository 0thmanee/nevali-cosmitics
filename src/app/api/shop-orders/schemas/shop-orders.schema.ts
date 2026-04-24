import { z } from "zod";

export const submitShopOrderSchema = z.object({
  buyerName: z.string().trim().min(1, "Name is required").max(200),
  buyerEmail: z.string().trim().email("Valid email required"),
  buyerPhone: z.string().trim().max(40).optional().nullable(),
  addressLine1: z.string().trim().min(1, "Address line 1 is required").max(200),
  addressLine2: z.string().trim().max(200).optional().nullable(),
  city: z.string().trim().min(1, "City is required").max(100),
  postalCode: z.string().trim().min(1, "Postal code is required").max(30),
  country: z.string().trim().min(1, "Country is required").max(100),
  paymentMethod: z.literal("COD"),
  notes: z.string().trim().max(2000).optional().nullable(),
  lines: z
    .array(
      z.object({
        productId: z.string().min(1),
        productVariantId: z.string().min(1),
        quantity: z.number().int().min(1).max(999),
      }),
    )
    .min(1, "Add at least one product"),
});

export type SubmitShopOrderInput = z.infer<typeof submitShopOrderSchema>;
