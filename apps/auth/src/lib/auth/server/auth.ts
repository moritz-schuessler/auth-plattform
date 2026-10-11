import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins/admin"
import { jwt } from "better-auth/plugins/jwt"
import { oauthProvider } from "@better-auth/oauth-provider"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"

import db from "../../../data/db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  disabledPaths: ["/token"],
  plugins: [
    admin(),
    jwt(),
    oauthProvider({
      loginPage: "/login",
      consentPage: "/consent",
      clientPrivileges: ({ user }) =>
        typeof user?.role === "string" &&
        user.role.split(",").includes("admin"),
    }),
    tanstackStartCookies(),
  ],
})
