import { Database, KeyRound, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/login/actions";
import { PageGuide, PageHeader, Panel } from "@/components/ui";

export default function SettingsPage() {
  const checks = [
    { label: "Neon DATABASE_URL", enabled: Boolean(process.env.DATABASE_URL), Icon: Database },
    { label: "Simple DB sign-in", enabled: Boolean(process.env.DATABASE_URL), Icon: KeyRound },
    { label: "Gemini API", enabled: Boolean(process.env.GEMINI_API_KEY), Icon: KeyRound },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Settings" title="Check setup, edit profile, or sign out." />

      <PageGuide
        title="You usually do not need this page."
        text="Settings exists for quick checks after deployment and basic account actions."
        steps={[
          "Check whether Neon and Gemini are configured.",
          "Use Edit profile when income, expenses, time, or blockers change.",
          "Sign out if you want to switch workspace.",
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-[#176b5b]" aria-hidden />
            <h2 className="text-lg font-semibold text-neutral-950">Configuration</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {checks.map(({ label, enabled, Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-[#fbfaf6] p-3"
              >
                <div className="flex items-center gap-3">
                  <Icon className="size-4 text-neutral-500" aria-hidden />
                  <span className="text-sm font-medium text-neutral-800">{label}</span>
                </div>
                <span
                  className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold ${
                    enabled
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-amber-200 bg-amber-50 text-amber-900"
                  }`}
                >
                  {enabled ? "Ready" : "Missing"}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="text-lg font-semibold text-neutral-950">Account</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Edit profile
            </Link>
            <form action={signOutAction}>
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
                <LogOut className="size-4" aria-hidden />
                Sign out
              </button>
            </form>
          </div>
        </Panel>
      </div>
    </div>
  );
}
