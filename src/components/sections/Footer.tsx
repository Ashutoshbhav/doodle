import Image from "next/image";
import Link from "next/link";
import {
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
  EnvelopeSimple,
  HandCoins,
  Truck,
  ArrowsClockwise,
  ShieldCheck,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CookieSettings } from "@/components/ui/CookieSettings";
import { footer as content } from "@/content/home";

const COLUMNS = content.columns;

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

const TRUST = [
  { Icon: HandCoins, title: "Cash on delivery", note: "Pay when it arrives" },
  { Icon: Truck, title: "Free shipping", note: "On orders over ₹999" },
  { Icon: ArrowsClockwise, title: "7-day exchange", note: "Hassle-free swaps" },
  { Icon: ShieldCheck, title: "Secure checkout", note: "UPI · Cards · COD" },
];

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative bg-doodle-ink text-doodle-canvas pt-16 pb-10 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-doodle-orange/50" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Trust / support band */}
        <div className="mb-14 grid grid-cols-2 gap-x-4 gap-y-6 rounded-[1rem] bg-doodle-canvas/[0.06] p-6 sm:p-7 lg:grid-cols-4">
          {TRUST.map(({ Icon, title, note }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-doodle-canvas/10 text-doodle-orange">
                <Icon weight="duotone" size={20} aria-hidden />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-doodle-canvas">{title}</div>
                <div className="text-[12px] text-doodle-canvas/60">{note}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand block */}
          <ScrollReveal direction="up" className="lg:col-span-5">
            <Link href="/" aria-label="DOODLE — home" className="inline-block">
              <Image
                src="/brand/logo.png"
                alt="DOODLE"
                width={170}
                height={62}
                unoptimized
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-doodle-canvas/75">
              {content.tagline}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-doodle-canvas/70">
              <MapPin weight="duotone" size={16} className="text-doodle-orange" />
              Bengaluru, India
            </div>

            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid place-items-center h-10 w-10 rounded-full bg-doodle-canvas/10 text-doodle-canvas/80 hover:text-doodle-orange hover:bg-doodle-canvas/15 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-doodle-orange/40"
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
                <Eyebrow variant="rule" tone="stitch">
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
        <div className="mt-16 pt-6 border-t border-doodle-canvas/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-[12px] font-medium text-doodle-canvas/55">
            <span className="text-doodle-canvas/85 font-semibold">{content.brandName}</span>
            <span className="px-1.5 opacity-50">{content.brandBy}</span>
            <span className="text-doodle-canvas/85 font-semibold">{content.brandParent}</span>
            <span className="ml-3 opacity-50">&copy; {new Date().getFullYear()}</span>
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
            <CookieSettings />
          </div>
        </div>
      </div>
    </footer>
  );
}
