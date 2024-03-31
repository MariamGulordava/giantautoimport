// pages/api/signup.ts
import { lucia } from "../../auth";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { db, Users } from "astro:db";

import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get("username");

  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return new Response("Invalid username", {
      status: 400,
    });
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return new Response("Invalid password", {
      status: 400,
    });
  }

  const email = formData.get("email");
  const phone_number = formData.get("phone_number");

  const userId = generateId(15);
  const hashed_password = await new Argon2id().hash(password);

  await db.insert(Users).values({userId, username, hashed_password, phone_number, email});

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return context.redirect("/");
}
