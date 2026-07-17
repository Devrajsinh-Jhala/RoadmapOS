"use client";

import {
  ClipboardCheck,
  Compass,
  FlaskConical,
  Home,
  Settings,
  Target,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/setup", label: "Setup", icon: UserRound },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/roadmap", label: "Roadmap", icon: Compass },
  { href: "/dashboard", label: "Today", icon: Home },
  { href: "/review", label: "Review", icon: ClipboardCheck },
  { href: "/research", label: "Research", icon: FlaskConical },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const items = mobile ? navItems.slice(0, 6) : navItems;

  return (
    <nav className={mobile ? "flex gap-2 overflow-x-auto pb-1" : "grid gap-1"}>
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              mobile
                ? `inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-xs font-semibold ${
                    active
                      ? "border-[#176b5b] bg-[#176b5b] text-white"
                      : "border-neutral-200 bg-white text-neutral-700"
                  }`
                : `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                    active
                      ? "bg-emerald-50 text-[#125548]"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                  }`
            }
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
