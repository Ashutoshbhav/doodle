/**
 * DOODLE — Home (composition root)
 *
 * All 12 sections shipped. Hand-off notes for Ash:
 *
 * [PLACEHOLDER] items to replace before launch:
 *   1. All section copy — every headline + body is original prose I wrote.
 *      Rewrite in Ash's brand voice. Files affected:
 *        Hero.tsx · Promise.tsx · HowItWorks.tsx · PatchWall.tsx
 *        CharacterStrip.tsx · WhyDoodle.tsx · EarlyVoices.tsx
 *        Founders.tsx · FindUsOffline.tsx · DualCTA.tsx · Footer.tsx
 *   2. Patch SVGs — drop real silicone-charm renders into /public/patches/
 *      and swap the inline <PatchShape> components in PatchScrubber.tsx.
 *   3. Character art — swap the placeholder face icons in CharacterStrip.tsx
 *      with real illustrated kids when designs are ready.
 *   4. Founders block — replace [Founder One/Two/Three] with real names,
 *      roles, bios in Founders.tsx.
 *   5. Pop-up dates — replace [Bengaluru/Mumbai/Delhi] placeholders in
 *      FindUsOffline.tsx once venues confirm.
 *   6. Early Voices quotes — replace [Sneha/Ravi/Anjali] with real
 *      consented testimonials in EarlyVoices.tsx (mark them as supporters
 *      not customers until first sales land).
 *   7. Stockist email — change hello@example.in in DualCTA.tsx + Footer.tsx
 *      to the real inbox.
 *   8. Footer link destinations — most are # stubs.
 *   9. .env.local — add RESEND_API_KEY + RESEND_AUDIENCE_ID; uncomment the
 *      Resend block in src/app/actions/waitlist.ts.
 *  10. Domain + favicon — currently using the wordmark JPEG; consider a
 *      cropped square SVG when brand assets ship.
 */

import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { TheRealThing } from "@/components/sections/TheRealThing";
import { Promise as PromiseSection } from "@/components/sections/Promise";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PatchWall } from "@/components/sections/PatchWall";
import { PatchMath } from "@/components/sections/PatchMath";
import { CharacterStrip } from "@/components/sections/CharacterStrip";
import { WhyDoodle } from "@/components/sections/WhyDoodle";
import { EarlyVoices } from "@/components/sections/EarlyVoices";
import { Founders } from "@/components/sections/Founders";
import { FindUsOffline } from "@/components/sections/FindUsOffline";
import { DualCTA } from "@/components/sections/DualCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="bg-background text-foreground">
        <Hero />
        <TheRealThing />
        <PromiseSection />
        <HowItWorks />
        <PatchWall />
        <PatchMath />
        <CharacterStrip />
        <WhyDoodle />
        <EarlyVoices />
        <Founders />
        <FindUsOffline />
        <DualCTA />
      </main>
      <Footer />
    </>
  );
}
