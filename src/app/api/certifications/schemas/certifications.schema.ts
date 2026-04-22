import { z } from "zod";

export const addCertificationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  fileUrl: z.string().url(),
  productId: z.string().cuid().optional().nullable(),
});

export type AddCertificationInput = z.infer<typeof addCertificationSchema>;

export const setCertificationStatusSchema = z.object({
  certificationId: z.string().cuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
  rejectionReason: z.string().max(500).optional().nullable(),
});

export type SetCertificationStatusInput = z.infer<typeof setCertificationStatusSchema>;

// —— Row / API response types ——

export type CertificationRow = {
  id: string;
  organizationId: string;
  productId: string | null;
  name: string;
  fileUrl: string;
  status: string;
  rejectionReason: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CertificationWithProductRow = CertificationRow & {
  product: { id: string; name: string } | null;
  organization: { name: string };
};
