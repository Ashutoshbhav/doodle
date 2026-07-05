import { PolicyPage } from "@/components/legal/PolicyPage";
import { shipping } from "@/content/legal";

export const metadata = {
  title: "Shipping Policy — DOODLE",
  description:
    "Dispatch times, delivery estimates, COD availability and free shipping over ₹999 at DOODLE (by CANVAS).",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <PolicyPage
      eyebrow={shipping.eyebrow}
      title={shipping.title}
      intro={shipping.intro}
      sections={shipping.sections}
    />
  );
}
