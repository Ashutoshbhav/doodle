import { PolicyPage } from "@/components/legal/PolicyPage";
import { terms } from "@/content/legal";

export const metadata = {
  title: "Terms & Conditions — DOODLE",
  description:
    "The terms that govern your use of doodlebycanvas.in and any purchase from DOODLE (by CANVAS).",
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow={terms.eyebrow}
      title={terms.title}
      intro={terms.intro}
      sections={terms.sections}
    />
  );
}
