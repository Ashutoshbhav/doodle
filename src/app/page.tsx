/**
 * DOODLE — Home (composition root)
 *
 * Tight editorial model (SKIMS-length, not Souled-Store-length): every
 * section has exactly one job and no two sections repeat a job.
 * announcement → hero (waitlist) → trust → build-your-tee (interactive) →
 * education → patch library → packs → brand promise → makers → CTA → footer.
 *
 * Consolidated 2026-06-27: dropped TheRealThing + WhyDoodle (merged into the
 * single Promise brand-story) and CharacterStrip (placeholder smileys).
 * Consolidated 2026-07-05: dropped PatchMath (restated PatchWall's job),
 * EarlyVoices (invented testimonials — reinstate ONLY with real, consented
 * quotes) and FindUsOffline (expired pop-up dates — reinstate ONLY with
 * booked venues). Files kept in the repo, just not rendered.
 */

import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { NavWithCart } from "@/components/sections/NavWithCart";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { BuildYourTee } from "@/components/sections/BuildYourTee";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PatchWall } from "@/components/sections/PatchWall";
import { PacksShowcase } from "@/components/sections/PacksShowcase";
import { Promise as PromiseSection } from "@/components/sections/Promise";
import { Founders } from "@/components/sections/Founders";
import { DualCTA } from "@/components/sections/DualCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <NavWithCart />
      <main className="bg-background text-foreground">
        <Hero />
        <TrustStrip />
        <BuildYourTee />
        <HowItWorks />
        <PatchWall />
        <PacksShowcase />
        <PromiseSection />
        <Founders />
        <DualCTA />
      </main>
      <Footer />
    </>
  );
}
