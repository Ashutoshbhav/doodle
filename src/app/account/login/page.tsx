import { redirect } from "next/navigation"
import { NavWithCart } from "@/components/sections/NavWithCart"
import { Footer } from "@/components/sections/Footer"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { AuthForms } from "@/components/account/AuthForms"
import { getCustomer } from "@/lib/medusa/auth"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Sign in — DOODLE",
  robots: { index: false, follow: false },
}

export default async function AccountLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const customer = await getCustomer()
  if (customer) redirect("/account")

  const { mode } = await searchParams
  const initialMode = mode === "register" ? "register" : "login"

  return (
    <>
      <NavWithCart />
      <main className="bg-[color:var(--color-surface-blush)] min-h-screen">
        <section className="mx-auto max-w-xl px-6 md:px-10 py-16 md:py-24">
          <Eyebrow variant="mono" accent="orange">
            Your account
          </Eyebrow>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-[-0.02em] text-doodle-ink">
            Pick up where you left off.
          </h1>
          <p className="mt-4 text-lg text-doodle-ink/75 max-w-md">
            Sign in to track orders and check out faster. New here? Create an
            account in a few seconds.
          </p>

          <div className="mt-10">
            <AuthForms initialMode={initialMode} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
