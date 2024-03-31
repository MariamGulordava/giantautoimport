// pages/api/login.ts
import { lucia } from "@lib/auth";
import { Argon2id } from "oslo/password";
import { db, like, Users } from "astro:db";

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

  const existingUser = await db.select().from(Users).where(like(Users.username, username));

  if (!existingUser || existingUser.length === 0) {
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  const validPassword = await new Argon2id().verify(
    existingUser[0].hashed_password,
    password
  );
  if (!validPassword) {
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  const userId = existingUser[0].id;

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return context.redirect("/");
}
