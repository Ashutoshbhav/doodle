import { env } from "@/env";

/* WhatsApp click-to-chat. The default commerce/support channel for the
   audience — but a wa.me link with no number behind it is a dead end, so
   everything here is gated on NEXT_PUBLIC_WHATSAPP_NUMBER being set.
   Set it once in Vercel and every WhatsApp entry point lights up. */

const DEFAULT_TEXT = "Hi DOODLE! I have a question about the patch tees.";

export const whatsappNumber = env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null;

export function whatsappHref(text: string = DEFAULT_TEXT): string | null {
  if (!whatsappNumber) return null;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
