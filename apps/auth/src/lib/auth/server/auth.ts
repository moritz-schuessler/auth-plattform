import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins/admin"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"

import db from "@/data/db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin(), tanstackStartCookies()],
})
