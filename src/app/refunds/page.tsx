import { PolicyPage } from "@/components/legal/PolicyPage";
import { refunds } from "@/content/legal";

export const metadata = {
  title: "Return & Refund Policy — DOODLE",
  description:
    "DOODLE (by CANVAS) return window, conditions, reverse pickup, refund methods and timelines.",
  alternates: { canonical: "/refunds" },
};

export default function RefundsPage() {
  return (
    <PolicyPage
      eyebrow={refunds.eyebrow}
      title={refunds.title}
      intro={refunds.intro}
      sections={refunds.sections}
    />
  );
}
