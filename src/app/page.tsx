/**
 * DOODLE — Home (composition root)
 *
 * Section order follows the benchmarked apparel blueprint: announcement →
 * hero → trust → build-your-tee (interactive, buyable) → education → patch
 * library → patch-math → one brand-story → social proof → founders →
 * offline → CTA → footer.
 *
 * Consolidated 2026-06-27: dropped TheRealThing + WhyDoodle (merged into the
 * single Promise brand-story) and CharacterStrip (placeholder smileys) for
 * restraint. The static FeaturedTee was replaced by the interactive
 * BuildYourTee demo. Files kept in the repo, just not rendered.
 */

import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { NavWithCart } from "@/components/sections/NavWithCart";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { BuildYourTee } from "@/components/sections/BuildYourTee";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PatchWall } from "@/components/sections/PatchWall";
import { PacksShowcase } from "@/components/sections/PacksShowcase";
import { PatchMath } from "@/components/sections/PatchMath";
import { Promise as PromiseSection } from "@/components/sections/Promise";
import { EarlyVoices } from "@/components/sections/EarlyVoices";
import { Founders } from "@/components/sections/Founders";
import { FindUsOffline } from "@/components/sections/FindUsOffline";
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
        <PatchMath />
        <PromiseSection />
        <EarlyVoices />
        <Founders />
        <FindUsOffline />
        <DualCTA />
      </main>
      <Footer />
    </>
  );
}
