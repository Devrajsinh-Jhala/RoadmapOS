"use client";

import { RotateCcw } from "lucide-react";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f5ef] px-4">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-950">
          Something slipped
        </h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          The app hit an unexpected error. Retry the action, then check
          `/api/health` if it keeps happening after deployment.
        </p>
        <button
          onClick={reset}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#176b5b] px-4 text-sm font-semibold text-white"
        >
          <RotateCcw className="size-4" aria-hidden />
          Try again
        </button>
      </section>
    </main>
  );
}
