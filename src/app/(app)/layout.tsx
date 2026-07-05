import { AppShell } from "@/components/app-shell";
import { getCurrentUserLabel } from "@/lib/current-user";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userLabel = await getCurrentUserLabel();
  return <AppShell userLabel={userLabel}>{children}</AppShell>;
}
