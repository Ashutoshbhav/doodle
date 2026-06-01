import Image from "next/image";
import Link from "next/link";
import {
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "#how", label: "How it works" },
      { href: "#wall", label: "Patch library" },
      { href: "#characters", label: "Looks gallery" },
      { href: "#why", label: "Why DOODLE" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "#", label: "Sizing guide" },
      { href: "#", label: "Care & washing" },
      { href: "#", label: "FAQs" },
      { href: "#", label: "Returns" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#founders", label: "Founders" },
      { href: "#voices", label: "Press kit" },
      { href: "#dual-cta", label: "Stockists" },
      { href: "#", label: "Contact" },
    ],
  },
] as const;

const SOCIALS = [
  { href: "#", label: "Instagram", Icon: InstagramLogo },
  { href: "#", label: "TikTok", Icon: TiktokLogo },
  { href: "#", label: "YouTube", Icon: YoutubeLogo },
  { href: "mailto:hello@example.in", label: "Email", Icon: EnvelopeSimple },
] as const;

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative bg-doodle-ink text-doodle-canvas pt-20 pb-10 overflow-hidden"
    >
      {/* Decorative top stitch divider */}
      <div
        className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(90deg,var(--color-doodle-stitch)_0_8px,transparent_8px_18px)] opacity-40"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand block */}
          <ScrollReveal direction="up" className="lg:col-span-5">
            <Link href="/" aria-label="DOODLE — home" className="inline-block">
              <Image
                src="/brand/wordmark-logo.jpeg"
                alt="DOODLE"
                width={180}
                height={54}
                className="h-12 w-auto object-contain mix-blend-screen brightness-110"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-doodle-canvas/75">
              {/* [PLACEHOLDER] tagline — Ash will rewrite */}
              Modular kids&rsquo; clothing with patches that swap, mix and
              remix. Designed in India. Made for the way kids actually play.
            </p>

            <div className="mt-7 flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="
                    grid place-items-center h-10 w-10 rounded-full
                    border-2 border-dashed border-doodle-canvas/40
                    text-doodle-canvas/80 hover:text-doodle-orange hover:border-doodle-orange
                    transition-colors
                    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/40
                  "
                >
                  <Icon weight="duotone" size={18} />
                </a>
              ))}
            </div>
          </ScrollReveal>

          {/* Link columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <Eyebrow variant="mono" tone="stitch">
                  {col.title}
                </Eyebrow>
                <ul className="mt-4 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-doodle-canvas/85 hover:text-doodle-orange transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-dashed border-doodle-canvas/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-doodle-canvas/55">
            <span className="text-doodle-canvas/85 font-semibold">DOODLE</span>
            <span className="px-1.5 opacity-50">by</span>
            <span className="text-doodle-canvas/85 font-semibold">CANVAS</span>
            <span className="ml-3 opacity-50">
              &copy; {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-doodle-canvas/55">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-3 rounded-sm bg-doodle-orange" aria-hidden />
              <span className="inline-block h-2 w-3 rounded-sm bg-doodle-canvas" aria-hidden />
              <span className="inline-block h-2 w-3 rounded-sm bg-doodle-blue" aria-hidden />
              Made in India
            </span>
            <Link href="#" className="hover:text-doodle-orange transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-doodle-orange transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
