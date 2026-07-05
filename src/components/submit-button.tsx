"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function SubmitButton({ children, className = "" }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#176b5b] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#115246] disabled:opacity-60 ${className}`}
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
