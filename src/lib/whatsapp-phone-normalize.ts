/**
 * Normalize a raw phone string to digits only, Morocco mobile in E.164 form without + (e.g. 212612345678).
 * Used for wa.me links and server-side WhatsApp sends.
 */
export function normalizePhoneForWhatsAppDigits(phoneRaw: string): string | null {
  const rawDigits = phoneRaw.replace(/\D/g, "");
  if (!rawDigits) return null;

  let digits = rawDigits;
  if (digits.startsWith("00")) digits = digits.slice(2);

  let national = digits;
  if (digits.startsWith("212")) {
    national = digits.slice(3);
    if (national.startsWith("0")) national = national.slice(1);
  } else if (digits.startsWith("0")) {
    national = digits.slice(1);
  }

  if (!/^[67]\d{8}$/.test(national)) return null;
  return `212${national}`;
}
