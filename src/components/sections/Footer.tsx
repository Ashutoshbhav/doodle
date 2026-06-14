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
import { footer as content } from "@/content/home";

const COLUMNS = content.columns;

// Maps icon names from content to their components (icons are not copy)
const SOCIAL_ICONS = {
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
  EnvelopeSimple,
} as const;

const SOCIALS = content.socials.map((s) => ({
  href: s.href,
  label: s.label,
  Icon: SOCIAL_ICONS[s.iconName],
}));

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
              {content.tagline}
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
            <span className="text-doodle-canvas/85 font-semibold">{content.brandName}</span>
            <span className="px-1.5 opacity-50">{content.brandBy}</span>
            <span className="text-doodle-canvas/85 font-semibold">{content.brandParent}</span>
            <span className="ml-3 opacity-50">
              &copy; {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-doodle-canvas/55">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-3 rounded-sm bg-doodle-orange" aria-hidden />
              <span className="inline-block h-2 w-3 rounded-sm bg-doodle-canvas" aria-hidden />
              <span className="inline-block h-2 w-3 rounded-sm bg-doodle-blue" aria-hidden />
              {content.madeInIndia}
            </span>
            {content.legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-doodle-orange transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
