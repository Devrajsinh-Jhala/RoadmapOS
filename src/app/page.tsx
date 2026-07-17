import {
  ArrowRight,
  BadgeIndianRupee,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  ListChecks,
  LogIn,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { DemoGifGallery, HeroWorkspace, LandingTour } from "@/components/landing-demo";

const workflow = [
  {
    number: "01",
    title: "Tell it what is true",
    text: "Add your money, available time, responsibilities, energy, and blockers.",
    Icon: ClipboardCheck,
  },
  {
    number: "02",
    title: "Choose the important goals",
    text: "Set deadlines, priority, cost, and weekly effort for two to four goals.",
    Icon: Target,
  },
  {
    number: "03",
    title: "Get the right order",
    text: "RoadmapOS checks constraints, reveals conflicts, and builds the roadmap.",
    Icon: Compass,
  },
  {
    number: "04",
    title: "Adjust every week",
    text: "Complete today’s essentials and use one weekly review to keep the plan honest.",
    Icon: RotateCcw,
  },
];

const capabilities = [
  {
    title: "Money-aware",
    text: "Protects an emergency reserve and monthly buffer before funding goals.",
    Icon: BadgeIndianRupee,
    tone: "bg-emerald-100 text-emerald-800",
  },
  {
    title: "Time-aware",
    text: "Keeps recovery time outside the plan before scheduling study, fitness, and side income.",
    Icon: Timer,
    tone: "bg-blue-100 text-blue-800",
  },
  {
    title: "Conflict-aware",
    text: "Labels critical conflicts, risky trade-offs, and the exact decision needed to recover.",
    Icon: ShieldCheck,
    tone: "bg-amber-100 text-amber-900",
  },
  {
    title: "Reality-aware",
    text: "Replans around missed weeks, changing energy, and actual progress.",
    Icon: CalendarCheck,
    tone: "bg-rose-100 text-rose-800",
  },
  {
    title: "Research-ready",
    text: "Uses manual, source-backed research when courses, salaries, or prices matter.",
    Icon: Search,
    tone: "bg-cyan-100 text-cyan-800",
  },
  {
    title: "Calm by design",
    text: "Turns the whole roadmap into a short list of daily non-negotiables.",
    Icon: CheckCircle2,
    tone: "bg-violet-100 text-violet-800",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f6f1] text-neutral-950">
      <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-[#f7f6f1]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 font-semibold text-neutral-950">
            <span className="grid size-9 place-items-center rounded-lg bg-[#176b5b] text-white">
              <ListChecks className="size-4" aria-hidden />
            </span>
            RoadmapOS
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 md:flex" aria-label="Landing page">
            <Link href="#how-it-works" className="hover:text-neutral-950">How it works</Link>
            <Link href="#demos" className="hover:text-neutral-950">Product demos</Link>
            <Link href="#walkthrough" className="hover:text-neutral-950">Page tour</Link>
          </nav>
          <Link
            href="/login"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50"
          >
            <LogIn className="size-4" aria-hidden />
            Sign in
          </Link>
        </div>
      </header>

      <main>
        <section className="overflow-hidden px-4 pb-3 pt-12 sm:px-6 sm:pb-4 sm:pt-16">
          <div className="mx-auto max-w-6xl text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#176b5b]">
              <Sparkles className="size-3.5" aria-hidden />
              A life plan built around real constraints
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-none text-neutral-950 sm:text-7xl">
              RoadmapOS
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-xl font-medium leading-8 text-neutral-800 sm:text-2xl">
              Put your big goals in the right order.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              Turn career, money, health, skills, and life goals into a realistic sequence. See what fits, what conflicts, what must wait, and what to do today.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#176b5b] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#125348]"
              >
                Start my life setup
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="#demos"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:border-neutral-400"
              >
                Watch product demos
              </Link>
            </div>
            <p className="mt-4 text-xs text-neutral-500">Setup takes about four minutes. Your first roadmap follows after Goals.</p>
          </div>
        </section>

        <section className="border-b border-neutral-200 px-4 pb-12 sm:px-6" aria-label="RoadmapOS product preview">
          <div className="mx-auto max-w-6xl text-center">
            <HeroWorkspace />
          </div>
        </section>

        <section id="how-it-works" className="bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-[#176b5b]">THE SIMPLE LOOP</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-neutral-950 sm:text-4xl">
                You bring the goals. RoadmapOS finds the order.
              </h2>
            </div>
            <div className="mt-10 grid border-y border-neutral-300 md:grid-cols-4">
              {workflow.map(({ number, title, text, Icon }, index) => (
                <div
                  key={number}
                  className={`relative px-1 py-6 md:px-5 ${index < workflow.length - 1 ? "border-b border-neutral-300 md:border-b-0 md:border-r" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-400">{number}</span>
                    <Icon className="size-5 text-[#176b5b]" aria-hidden />
                  </div>
                  <h3 className="mt-8 text-base font-semibold text-neutral-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demos" className="border-y border-neutral-200 bg-[#eef1ed] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-[#176b5b]">SEE IT IN MOTION</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-neutral-950 sm:text-4xl">
                  From “I want this” to “I know today’s move.”
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-neutral-600">
                Three short loops show how RoadmapOS plans, protects priorities, and recovers when a week goes off course.
              </p>
            </div>
            <div className="mt-10">
              <DemoGifGallery />
            </div>
          </div>
        </section>

        <section className="bg-neutral-950 px-4 py-16 text-white sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="max-w-md">
              <p className="text-xs font-semibold text-[#f4c95d]">BEFORE AI MAKES THE PLAN</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                Protect the baseline before planning the ambition.
              </h2>
              <p className="mt-5 text-base leading-7 text-neutral-300">
                RoadmapOS sets aside emergency savings, a monthly buffer, and recovery time. It then checks every cost, deadline, and weekly commitment before AI creates the roadmap.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-lg border border-white/15 bg-white/15 sm:grid-cols-2">
              {[
                ["Safe money limit", "INR 36,750", "INR 12,250 remains as monthly buffer"],
                ["Safe daily time", "90 minutes", "30 free minutes remain outside the plan"],
                ["Purchase impact", "+2 months", "A reward purchase delays the home deposit"],
                ["Plan decision", "Sequence it", "Move the reward after the next home milestone"],
              ].map(([label, value, note], index) => (
                <div key={label} className="bg-neutral-950 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-neutral-400">{label}</p>
                    <span className={`size-2 rounded-full ${index === 2 ? "bg-[#ef6b55]" : index === 3 ? "bg-[#f4c95d]" : "bg-emerald-400"}`} />
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-[#176b5b]">BUILT FOR THE WHOLE ROADMAP</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-neutral-950 sm:text-4xl">
                Practical help at every decision point.
              </h2>
            </div>
            <div className="mt-10 grid border-t border-neutral-300 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map(({ title, text, Icon, tone }, index) => (
                <div
                  key={title}
                  className={`py-6 sm:px-5 ${index < capabilities.length - 1 ? "border-b border-neutral-300" : ""} ${index % 3 !== 2 ? "lg:border-r" : ""}`}
                >
                  <span className={`grid size-9 place-items-center rounded-lg ${tone}`}>
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-neutral-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="walkthrough" className="border-y border-neutral-200 bg-[#f7f6f1] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-[#176b5b]">PAGE-BY-PAGE WALKTHROUGH</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-neutral-950 sm:text-4xl">
                Know exactly what each page is for.
              </h2>
              <p className="mt-4 text-base leading-7 text-neutral-600">
                Follow the tabs in order the first time. After setup, most days begin and end on Today.
              </p>
            </div>
            <div className="mt-10">
              <LandingTour />
            </div>
          </div>
        </section>

        <section className="bg-[#f4c95d] px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-neutral-700">ONE CLEAR PLACE TO BEGIN</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-neutral-950 sm:text-4xl">
                You do not need to fix everything today.
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-800">
                Build the roadmap, then complete today’s proof.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Build my roadmap
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-neutral-950 px-4 py-6 text-neutral-400 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-white">
            <ListChecks className="size-4 text-[#f4c95d]" aria-hidden />
            <span className="font-semibold">RoadmapOS</span>
          </div>
          <p>Constraint-aware planning for career, money, health, skills, and life.</p>
        </div>
      </footer>
    </div>
  );
}
