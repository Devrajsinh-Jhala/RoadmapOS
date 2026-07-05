"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  USER_ID_COOKIE,
  USER_NAME_COOKIE,
  isDemoMode,
} from "@/lib/current-user";
import { createOrFindUser } from "@/lib/repository";
import { simpleSignInSchema } from "@/lib/schemas";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

export async function simpleSignInAction(formData: FormData) {
  if (!process.env.DATABASE_URL && !isDemoMode()) {
    throw new Error("DATABASE_URL is required before sign in can work.");
  }

  const parsed = simpleSignInSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  const user = await createOrFindUser(parsed);
  const cookieStore = await cookies();

  cookieStore.set(USER_ID_COOKIE, user.id, cookieOptions);
  cookieStore.set(USER_NAME_COOKIE, user.name ?? user.email, cookieOptions);

  redirect("/dashboard");
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_ID_COOKIE);
  cookieStore.delete(USER_NAME_COOKIE);
  redirect("/");
}
