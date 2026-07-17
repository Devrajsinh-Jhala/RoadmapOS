import {
  ListChecks,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { signOutAction } from "@/app/login/actions";
import { isDemoMode } from "@/lib/current-user";

export function AppShell({
  userLabel,
  children,
}: {
  userLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f5ef]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-neutral-200 bg-white px-4 py-5 lg:flex lg:flex-col">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-lg bg-[#176b5b] text-white">
            <ListChecks className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block text-base font-semibold text-neutral-950">
              RoadmapOS
            </span>
            <span className="block text-xs text-neutral-500">Life planning system</span>
          </span>
        </Link>

        <div className="mt-8">
          <AppNav />
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-5">
          <p className="text-xs font-semibold uppercase text-emerald-800">
            Planning loop
          </p>
          <ol className="mt-3 grid gap-2 text-xs leading-5 text-neutral-700">
            <li>1. Define money and time limits</li>
            <li>2. Add and sequence life goals</li>
            <li>3. Execute today&apos;s minimums</li>
            <li>4. Reset the plan every week</li>
          </ol>
        </div>

        <div className="mt-auto rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <p className="text-xs uppercase text-neutral-500">
            Signed in as
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-950">{userLabel}</p>
          {isDemoMode() ? (
            <p className="mt-1 text-xs leading-5 text-neutral-500">Demo mode active</p>
          ) : null}
          <form action={signOutAction} className="mt-3">
            <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-300 px-3 text-xs font-semibold text-neutral-700 hover:bg-white">
              <LogOut className="size-3.5" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="grid size-9 place-items-center rounded-lg bg-[#176b5b] text-white">
              <ListChecks className="size-4" aria-hidden />
            </span>
            RoadmapOS
          </Link>
          <Link
            href="/settings"
            className="grid size-9 place-items-center rounded-lg border border-neutral-300 bg-white"
            aria-label="Settings"
          >
            <Settings className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-3">
          <AppNav mobile />
        </div>
      </header>

      <main className="px-4 py-6 lg:ml-64 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
