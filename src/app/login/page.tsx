import { LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { simpleSignInAction } from "@/app/login/actions";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass } from "@/components/ui";

export default function LoginPage() {
  const databaseConfigured =
    Boolean(process.env.DATABASE_URL) ||
    process.env.ROADMAPOS_DEMO_MODE === "true";

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f5ef] px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <Link href="/" className="text-sm font-semibold text-[#176b5b]">
          RoadmapOS
        </Link>
        <h1 className="mt-5 text-2xl font-semibold text-neutral-950">
          Start or continue your life plan
        </h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Use the same email each time. New planners start with Setup; returning planners continue from Today.
        </p>

        {databaseConfigured ? (
          <form action={simpleSignInAction} className="mt-6 grid gap-4">
            <Field label="Name">
              <input
                className={inputClass}
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </Field>
            <SubmitButton className="w-full">
              <LogIn className="size-4" aria-hidden />
              Sign in
            </SubmitButton>
            <div className="grid grid-cols-3 divide-x divide-neutral-200 border-t border-neutral-200 pt-4 text-center">
              <div className="px-2">
                <p className="text-xs font-semibold text-neutral-900">1. Setup</p>
                <p className="mt-1 text-xs text-neutral-500">4 minutes</p>
              </div>
              <div className="px-2">
                <p className="text-xs font-semibold text-neutral-900">2. Goals</p>
                <p className="mt-1 text-xs text-neutral-500">2 to 4 outcomes</p>
              </div>
              <div className="px-2">
                <p className="text-xs font-semibold text-neutral-900">3. Roadmap</p>
                <p className="mt-1 text-xs text-neutral-500">Ready to execute</p>
              </div>
            </div>
          </form>
        ) : (
          <div className="mt-6 grid gap-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
              Add `DATABASE_URL` from Neon, then restart the app to enable
              sign in.
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-600">
              <Mail className="size-4" aria-hidden />
              Only Neon setup is required.
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
