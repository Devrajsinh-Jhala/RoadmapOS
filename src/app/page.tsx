import {
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  IndianRupee,
  LayoutDashboard,
  ListChecks,
  LogIn,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  UserRound,
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
      text: "Add money, time, energy, responsibilities, and blockers once.",
      Icon: ClipboardCheck,
    },
    {
      title: "Goal builder",
      text: "Add a few goals with deadlines, target amounts, weekly hours, and priority.",
      Icon: Target,
    },
    {
      title: "Roadmap generator",
      text: "Generate a realistic sequence, then execute from the Today page.",
      Icon: Compass,
    },
  ];

  const firstSteps = [
    "Sign in with name and email",
    "Fill onboarding in 3 minutes",
    "Add 2 to 4 important goals",
    "Generate roadmap and follow Today",
  ];

  const pageWalkthrough = [
    {
      page: "Login",
      purpose: "Create your private workspace with just name and email.",
      action: "Use this once. No OAuth setup or password flow in the MVP.",
      Icon: UserRound,
    },
    {
      page: "Onboarding",
      purpose: "Tell the app your real capacity: income, savings, expenses, free minutes, energy, responsibilities, and blockers.",
      action: "Approximate values are fine. The app uses them to avoid impossible plans.",
      Icon: ClipboardCheck,
    },
    {
      page: "Goals",
      purpose: "Add goals one by one across career, wealth, health, skills, side income, discipline, relationships, spirituality, and rewards.",
      action: "Give each goal a deadline, priority, target amount if money is involved, and weekly hours if effort is involved.",
      Icon: Target,
    },
    {
      page: "Roadmap",
      purpose: "Turn the goals into a two-year vision, one-year sequence, quarterly milestones, weekly plan, conflicts, and recovery guidance.",
      action: "Read conflicts first. If the plan is risky, reduce scope or move a lower-priority goal later.",
      Icon: Compass,
    },
    {
      page: "Today",
      purpose: "Show only today's essentials so the plan does not become another overwhelming dashboard.",
      action: "Complete the few non-negotiables, then stop. This page is for execution.",
      Icon: LayoutDashboard,
    },
    {
      page: "Weekly Review",
      purpose: "Tell the system what actually happened: completed work, slipped items, reasons, money saved, workouts, study hours, and energy.",
      action: "Use it on Sunday. The next week should adapt without guilt language.",
      Icon: RotateCcw,
    },
    {
      page: "Research",
      purpose: "Ask for current, source-backed help only when facts may have changed.",
      action: "Use it for courses, salary ranges, prices, locations, markets, or side-income ideas, then apply useful research to the next roadmap.",
      Icon: Search,
    },
    {
      page: "Settings",
      purpose: "Check database, sign-in, and Gemini configuration status.",
      action: "Use it when you want to edit profile or sign out.",
      Icon: Settings,
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
            <ListChecks className="size-5" aria-hidden />
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
            <div className="mt-5 grid gap-2">
              {firstSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 text-sm text-neutral-700">
                  <span className="grid size-6 place-items-center rounded-full bg-white text-xs font-semibold text-[#176b5b] ring-1 ring-emerald-200">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#176b5b] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#115246]"
              >
                Start with login
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="#walkthrough"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                See walkthrough
                <BookOpenCheck className="size-4" aria-hidden />
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

      <section id="walkthrough" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#176b5b]">
            Page-by-page walkthrough
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-neutral-950">
            What to do on each page
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            RoadmapOS is meant to be used in a simple order: setup once, add goals,
            generate the roadmap, execute today, review weekly, and research only
            when current facts matter.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {pageWalkthrough.map(({ page, purpose, action, Icon }, index) => (
            <div
              key={page}
              className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-[#176b5b] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-semibold text-neutral-950">{page}</h3>
                </div>
                <Icon className="size-5 shrink-0 text-[#176b5b]" aria-hidden />
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-700">{purpose}</p>
              <p className="mt-3 rounded-lg border border-neutral-200 bg-[#fbfaf6] p-3 text-sm leading-6 text-neutral-700">
                {action}
              </p>
            </div>
          ))}
        </div>
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
