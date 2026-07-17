"use client";

import Image from "next/image";
import {
  Check,
  CheckCircle2,
  Compass,
  House,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Target,
  UserRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import styles from "./landing-demo.module.css";

export function HeroWorkspace() {
  const heroDemos = [
    {
      src: "/demos/goals-to-roadmap.gif",
      title: "Goals become an ordered roadmap",
      detail: "Priorities, capacity, and deadlines in one sequence.",
    },
    {
      src: "/demos/conflict-check.gif",
      title: "Conflict detector",
      detail: "See the cost of a decision before committing.",
    },
    {
      src: "/demos/weekly-recovery.gif",
      title: "Weekly recovery",
      detail: "Adjust the next week without starting over.",
    },
  ];

  return (
    <div className="mx-auto mt-8 w-full max-w-6xl overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 p-2 shadow-[0_28px_80px_rgb(31_41_55_/_18%)] sm:p-3">
      <div className="flex items-center justify-between gap-3 px-2 pb-2 text-left text-white sm:px-3 sm:pb-3">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2 rounded-full bg-[#ef6b55]" />
            <span className="size-2 rounded-full bg-[#f4c95d]" />
            <span className="size-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-semibold text-white/80">RoadmapOS in action</span>
        </div>
        <span className="inline-flex items-center gap-2 text-xs font-medium text-white/60">
          <span className="size-2 rounded-full bg-emerald-400" />
          Live loops
        </span>
      </div>

      <div className="grid gap-2 lg:grid-cols-[1.55fr_0.85fr]">
        <figure className="overflow-hidden rounded-lg bg-white text-left">
          <Image
            unoptimized
            src={heroDemos[0].src}
            alt={`${heroDemos[0].title} animated product demo`}
            width={720}
            height={450}
            loading="eager"
            className="block h-auto w-full"
          />
          <figcaption className="border-t border-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-950">{heroDemos[0].title}</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">{heroDemos[0].detail}</p>
          </figcaption>
        </figure>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {heroDemos.slice(1).map((demo) => (
            <figure key={demo.src} className="min-w-0 overflow-hidden rounded-lg bg-white text-left">
              <Image
                unoptimized
                src={demo.src}
                alt={`${demo.title} animated product demo`}
                width={720}
                height={450}
                loading="eager"
                className="block h-auto w-full"
              />
              <figcaption className="border-t border-neutral-200 px-3 py-2.5">
                <p className="text-xs font-semibold text-neutral-950 sm:text-sm">{demo.title}</p>
                <p className="mt-1 hidden text-xs leading-5 text-neutral-500 sm:block">{demo.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1 pt-3 text-left text-[11px] text-white/55 sm:px-3">
        <span>Real product flows, shown with generic example data.</span>
        <span>Goals · conflicts · weekly recovery</span>
      </div>
    </div>
  );
}

const tourItems = [
  {
    key: "setup",
    label: "Setup",
    eyebrow: "01 / SETUP",
    title: "Start with your real capacity",
    text: "Add income, savings, expenses, free time in minutes per day, energy, responsibilities, and blockers. RoadmapOS keeps part of that capacity uncommitted.",
    action: "Your emergency reserve, monthly buffer, and recovery time stay protected.",
    Icon: UserRound,
  },
  {
    key: "goals",
    label: "Goals",
    eyebrow: "02 / GOALS",
    title: "Choose what matters most",
    text: "Add two to four goals with a deadline, priority, target amount when money is involved, and weekly hours when effort is involved.",
    action: "Each goal gets a sequence rank, feasibility label, and recommended decision.",
    Icon: Target,
  },
  {
    key: "roadmap",
    label: "Roadmap",
    eyebrow: "03 / ROADMAP",
    title: "See the right sequence",
    text: "Generate a two-year vision, one-year direction, quarterly milestones, monthly targets, weekly actions, and daily minimums.",
    action: "Critical conflicts become a capacity reset before any generated timeline is trusted.",
    Icon: Compass,
  },
  {
    key: "today",
    label: "Today",
    eyebrow: "04 / TODAY",
    title: "Do only today’s proof",
    text: "The dashboard reduces the roadmap to a few daily essentials across skills, money, health, and discipline.",
    action: "Complete the essentials, add one reflection, and stop planning.",
    Icon: CheckCircle2,
  },
  {
    key: "review",
    label: "Review",
    eyebrow: "05 / WEEKLY REVIEW",
    title: "Let the plan learn from reality",
    text: "Record what worked, what slipped, the reason, money saved, workouts, study time, discipline, and next-week energy.",
    action: "A recovery plan adjusts the next week without guilt language.",
    Icon: RotateCcw,
  },
  {
    key: "research",
    label: "Research",
    eyebrow: "06 / RESEARCH",
    title: "Bring current facts into the plan",
    text: "Manually research courses, salaries, prices, locations, and side-income paths with source-backed Gemini results.",
    action: "You decide whether useful research should change the roadmap.",
    Icon: Search,
  },
  {
    key: "settings",
    label: "Settings",
    eyebrow: "07 / SETTINGS",
    title: "Keep your workspace healthy",
    text: "Review profile details, database readiness, AI configuration, currency, timezone, and account controls in one quiet place.",
    action: "Use it when your circumstances change or you need to sign out.",
    Icon: Settings,
  },
] as const;

type TourKey = (typeof tourItems)[number]["key"];

function TourScreen({ screen }: { screen: TourKey }) {
  if (screen === "setup") {
    return (
      <div className="grid h-full content-center gap-4 p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-[#f4c95d] text-neutral-950">
            <UserRound className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-xs text-neutral-500">YOUR CAPACITY</p>
            <p className="text-sm font-semibold text-neutral-950">A few honest numbers</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {["Monthly income", "Current savings", "Fixed expenses", "Free minutes / day"].map(
            (label, index) => (
              <div key={label} className="border-b border-neutral-200 pb-3">
                <p className="text-xs text-neutral-500">{label}</p>
                <p className="mt-1 text-sm font-semibold text-neutral-950">
                  {["₹85,000", "₹4,50,000", "₹36,000", "120 min"][index]}
                </p>
              </div>
            ),
          )}
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="size-4" aria-hidden />
          Capacity saved. Ready for goals.
        </div>
      </div>
    );
  }

  if (screen === "goals") {
    return (
      <div className="grid h-full content-center gap-3 p-5 sm:p-8">
        {[
          ["Career", "Move into a stronger engineering role", "1", "#dbeafe"],
          ["Wealth", "Build a home deposit", "2", "#dcfce7"],
          ["Health", "Build a sustainable fitness routine", "2", "#ffe4e6"],
        ].map(([domain, title, priority, color]) => (
          <div key={title} className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: color }}>
              <Target className="size-4 text-neutral-800" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-500">{domain}</p>
              <p className="truncate text-sm font-semibold text-neutral-950">{title}</p>
            </div>
            <span className="text-xs font-semibold text-neutral-500">P{priority}</span>
          </div>
        ))}
      </div>
    );
  }

  if (screen === "roadmap") {
    return (
      <div className="grid h-full content-center p-5 sm:p-8">
        <div className="grid grid-cols-[44px_1fr] gap-x-4 gap-y-0">
          {[
            ["NOW", "Protect monthly surplus", "Automate savings and keep career learning consistent."],
            ["Q2", "Build leverage", "Finish two proof-of-work projects and test interviews."],
            ["Q3", "Increase income", "Use stronger income to accelerate the home deposit."],
          ].map(([date, title, text], index) => (
            <div className="contents" key={title}>
              <div className="relative flex justify-center">
                <span className="z-10 grid size-9 place-items-center rounded-full bg-[#176b5b] text-[10px] font-semibold text-white">
                  {date}
                </span>
                {index < 2 ? <span className="absolute top-9 h-[calc(100%+20px)] w-px bg-neutral-300" /> : null}
              </div>
              <div className="pb-7">
                <p className="text-sm font-semibold text-neutral-950">{title}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "today") {
    return (
      <div className="grid h-full content-center gap-3 p-5 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500">TODAY</p>
            <p className="text-lg font-semibold text-neutral-950">Three clear moves</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">2 / 3</span>
        </div>
        {["Finish one focused skill block", "Move the money goal forward", "Complete the health action"].map(
          (task, index) => (
            <div key={task} className="flex items-center gap-3 border-t border-neutral-200 pt-3 text-sm text-neutral-700">
              <span className={`grid size-7 place-items-center rounded-full ${index < 2 ? "bg-[#176b5b] text-white" : "border border-neutral-300 text-transparent"}`}>
                <Check className="size-4" aria-hidden />
              </span>
              {task}
            </div>
          ),
        )}
      </div>
    );
  }

  if (screen === "review") {
    return (
      <div className="grid h-full content-center gap-4 p-5 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500">CURRENT WEEK</p>
            <p className="text-lg font-semibold text-neutral-950">Recovery, not guilt</p>
          </div>
          <RotateCcw className="size-5 text-[#176b5b]" aria-hidden />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[["Study", "5.5h"], ["Workouts", "3"], ["Saved", "₹12k"]].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-white p-3 text-center ring-1 ring-neutral-200">
              <p className="text-base font-semibold text-neutral-950">{value}</p>
              <p className="mt-1 text-xs text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
        <div className="border-l-4 border-[#f4c95d] bg-[#fff9e8] p-3 text-xs leading-5 text-neutral-700">
          Keep the career block. Move one missed fitness session to Saturday. No catch-up marathon needed.
        </div>
      </div>
    );
  }

  if (screen === "research") {
    return (
      <div className="grid h-full content-center gap-4 p-5 sm:p-8">
        <div className="flex items-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-600">
          <Search className="size-4 shrink-0" aria-hidden />
          Compare practical cloud certifications for backend roles in India
        </div>
        <div className="grid gap-2">
          {["Role relevance and prerequisites", "Current course cost and time", "Source-backed recommendation"].map((result, index) => (
            <div key={result} className="flex items-center gap-3 text-sm text-neutral-700">
              <span className="grid size-6 place-items-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800">{index + 1}</span>
              {result}
            </div>
          ))}
        </div>
        <button className="inline-flex h-9 w-fit items-center gap-2 rounded-lg bg-[#176b5b] px-3 text-xs font-semibold text-white" type="button">
          <Sparkles className="size-3.5" aria-hidden />
          Apply to roadmap
        </button>
      </div>
    );
  }

  return (
    <div className="grid h-full content-center gap-3 p-5 sm:p-8">
      {[
        [WalletCards, "Database", "Connected", "text-emerald-700"],
        [Sparkles, "Planning AI", "Ready", "text-blue-700"],
        [House, "Defaults", "INR · Asia/Kolkata", "text-neutral-700"],
      ].map(([Icon, label, value, tone]) => {
        const ItemIcon = Icon as LucideIcon;
        return (
          <div key={label as string} className="flex items-center gap-3 border-b border-neutral-200 pb-3">
            <ItemIcon className="size-4 text-neutral-500" aria-hidden />
            <span className="flex-1 text-sm text-neutral-600">{label as string}</span>
            <span className={`text-sm font-semibold ${tone as string}`}>{value as string}</span>
          </div>
        );
      })}
    </div>
  );
}

export function LandingTour() {
  const [active, setActive] = useState<TourKey>("setup");
  const selected = tourItems.find((item) => item.key === active) ?? tourItems[0];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto border-b border-neutral-300 pb-3" role="tablist" aria-label="RoadmapOS page walkthrough">
        {tourItems.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            aria-controls="landing-tour-panel"
            onClick={() => setActive(key)}
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
              active === key
                ? "bg-neutral-950 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <div
        id="landing-tour-panel"
        key={selected.key}
        role="tabpanel"
        className={`${styles.tourPanel} mt-6 grid overflow-hidden rounded-lg border border-neutral-300 bg-white lg:grid-cols-[0.82fr_1.18fr]`}
      >
        <div className="flex flex-col justify-center border-b border-neutral-200 p-6 lg:border-b-0 lg:border-r lg:p-9">
          <p className="text-xs font-semibold text-[#176b5b]">{selected.eyebrow}</p>
          <h3 className="mt-3 text-2xl font-semibold text-neutral-950">{selected.title}</h3>
          <p className="mt-4 text-sm leading-6 text-neutral-600">{selected.text}</p>
          <p className="mt-6 border-l-4 border-[#f4c95d] pl-4 text-sm font-medium leading-6 text-neutral-800">
            {selected.action}
          </p>
        </div>
        <div className="min-h-80 bg-[#f4f5f2]">
          <TourScreen screen={selected.key} />
        </div>
      </div>
    </div>
  );
}

export function DemoGifGallery() {
  const demos = [
    {
      src: "/demos/goals-to-roadmap.gif",
      label: "Goals → roadmap",
      title: "Turn broad goals into a sequence",
      text: "Priorities, money, time, and deadlines become an ordered plan.",
    },
    {
      src: "/demos/conflict-check.gif",
      label: "Conflict detector",
      title: "See trade-offs before they cost you",
      text: "RoadmapOS flags overloaded weeks and purchases that delay bigger goals.",
    },
    {
      src: "/demos/weekly-recovery.gif",
      label: "Weekly recovery",
      title: "Miss a week without losing the plan",
      text: "A short review reshapes the next week around what actually happened.",
    },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {demos.map((demo, index) => (
        <article key={demo.src} className="overflow-hidden rounded-lg border border-neutral-300 bg-white">
          <Image
            unoptimized
            src={demo.src}
            alt={`${demo.title} animated product demo`}
            width={720}
            height={450}
            loading={index === 0 ? "eager" : "lazy"}
            className={styles.demoImage}
          />
          <div className="border-t border-neutral-200 p-5">
            <p className="text-xs font-semibold text-[#176b5b]">{demo.label}</p>
            <h3 className="mt-2 text-base font-semibold text-neutral-950">{demo.title}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{demo.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
