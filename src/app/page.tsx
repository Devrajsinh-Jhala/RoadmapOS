import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  IndianRupee,
  LogIn,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const dashboardStats = [
    { title: "Money load", text: "52% committed", Icon: IndianRupee },
    { title: "Time load", text: "68% planned", Icon: Timer },
    { title: "Goal health", text: "Balanced", Icon: ShieldCheck },
    { title: "Research", text: "Sources saved", Icon: Search },
  ];

  const workflow = [
    {
      title: "Onboarding",
      text: "Capture income, expenses, savings, time, responsibilities, energy, and blockers.",
      Icon: ClipboardCheck,
    },
    {
      title: "Goal builder",
      text: "Add goals across career, wealth, health, skills, relationships, discipline, and lifestyle.",
      Icon: Target,
    },
    {
      title: "Roadmap generator",
      text: "Convert long-term goals into yearly, quarterly, monthly, weekly, and daily plans.",
      Icon: Compass,
    },
  ];

  const dailyTasks = [
    "Complete one focused skill block",
    "Move one money goal forward",
    "Finish health or recovery action",
    "Answer one reflection prompt",
  ];

  const functionality = [
    "Constraint-aware planning before AI generation",
    "Daily non-negotiables instead of noisy task lists",
    "Weekly review with recovery planning",
    "Conflict detector for money, time, and deadlines",
    "Manual research mode with source-backed planning",
    "PWA-ready app structure for mobile use",
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-neutral-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-[#176b5b] text-white">
            <Target className="size-5" aria-hidden />
          </span>
          <span className="font-semibold text-neutral-950">RoadmapOS</span>
        </Link>
        <Link
          href="/login"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
        >
          <LogIn className="size-4" aria-hidden />
          Sign in
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-8 lg:pt-14">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex h-8 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
              <Sparkles className="size-3.5" aria-hidden />
              Constraint-aware life planning
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] text-neutral-950 md:text-6xl">
              RoadmapOS
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-700">
              Turn scattered goals across career, money, health, relationships,
              skills, and discipline into a realistic execution plan that adapts
              when life changes.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#176b5b] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#115246]"
              >
                Start with login
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="#product-demo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                View product demo
                <ShieldCheck className="size-4" aria-hidden />
              </Link>
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              Login first, then build your private roadmap workspace.
            </p>
          </div>

          <div
            id="product-demo"
            className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  Demo workspace
                </p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-950">
                  This week&apos;s plan
                </h2>
              </div>
              <span className="inline-flex h-8 items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800">
                Realistic
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {dashboardStats.map(({ title, text, Icon }) => (
                <div
                  key={title}
                  className="rounded-lg border border-neutral-200 bg-[#fbfaf6] p-4"
                >
                  <Icon className="size-5 text-[#176b5b]" aria-hidden />
                  <h2 className="mt-4 text-sm font-semibold text-neutral-950">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-neutral-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                    Today
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-neutral-950">
                    Non-negotiables
                  </h3>
                </div>
                <CalendarCheck className="size-6 text-blue-600" aria-hidden />
              </div>
              <div className="mt-5 grid gap-3">
                {dailyTasks.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-800"
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="size-3.5" aria-hidden />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-14 md:grid-cols-3">
        {workflow.map(({ title, text, Icon }, index) => (
          <div
            key={title}
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-[#176b5b] text-sm font-semibold text-white">
                {index + 1}
              </span>
              <Icon className="size-5 text-[#176b5b]" aria-hidden />
            </div>
            <h2 className="mt-4 text-base font-semibold text-neutral-950">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">{text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#176b5b]">
                Conflict detector
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
                The app tells you what your ambition costs.
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                RoadmapOS compares monthly surplus, savings targets, weekly
                hours, deadlines, and lifestyle purchases before it generates
                the plan.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                "A new purchase may delay a savings milestone by 2 months.",
                "Two high-effort goals are using most available weekday time.",
                "This week should protect the highest-priority goal first.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-[#fbfaf6] p-3 text-sm leading-6 text-neutral-700"
                >
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#176b5b]" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#176b5b]">
                What it handles
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
                One place for roadmap, execution, reflection, and research.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {functionality.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-[#fbfaf6] p-3 text-sm leading-6 text-neutral-700"
                >
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#176b5b]" aria-hidden />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
