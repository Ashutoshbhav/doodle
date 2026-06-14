import { PolicyPage } from "@/components/legal/PolicyPage";
import { privacy } from "@/content/legal";

export const metadata = {
  title: "Privacy Policy — DOODLE",
  description:
    "How DOODLE (by CANVAS) collects, uses and protects your personal data, and your rights under India's DPDP Act, 2023.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow={privacy.eyebrow}
      title={privacy.title}
      intro={privacy.intro}
      sections={privacy.sections}
    />
  );
}
