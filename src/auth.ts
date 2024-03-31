import { Lucia } from "lucia";
import { db, Users, Session } from "astro:db";
import { AstroDBAdapter } from "lucia-adapter-astrodb";

const adapter = new AstroDBAdapter(db, Session, Users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<typeof Users, "id">;
  }
}
