import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const DEMO_USER_ID = "demo-user";
export const USER_ID_COOKIE = "roadmapos_user_id";
export const USER_NAME_COOKIE = "roadmapos_user_name";

export function isDemoMode() {
  return process.env.ROADMAPOS_DEMO_MODE === "true";
}

export async function getCurrentUserId() {
  if (isDemoMode()) {
    return DEMO_USER_ID;
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_ID_COOKIE)?.value;

  if (userId) {
    return userId;
  }

  redirect("/login");
}

export async function getCurrentUserLabel() {
  if (isDemoMode()) {
    return "Demo planner";
  }

  const cookieStore = await cookies();
  return cookieStore.get(USER_NAME_COOKIE)?.value ?? "Planner";
}
