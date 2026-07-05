import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f5ef] px-4">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
        <Compass className="mx-auto size-9 text-[#176b5b]" aria-hidden />
        <h1 className="mt-4 text-2xl font-semibold text-neutral-950">
          Page not found
        </h1>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          This route does not exist, or it moved while the roadmap changed.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#176b5b] px-4 text-sm font-semibold text-white"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to home
        </Link>
      </section>
    </main>
  );
}
