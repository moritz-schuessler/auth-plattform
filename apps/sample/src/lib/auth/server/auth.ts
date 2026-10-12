import { betterAuth } from "better-auth"
import { genericOAuth } from "better-auth/plugins/generic-oauth"
import { tanstackStartCookies } from "better-auth/tanstack-start"

export const auth = betterAuth({
  advanced: {
    cookiePrefix: "sample",
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "auth-plattform",
          clientId: process.env.AUTH_PLATFORM_CLIENT_ID as string,
          clientSecret: process.env.AUTH_PLATFORM_CLIENT_SECRET,
          discoveryUrl: `${process.env.AUTH_PLATFORM_URL}/api/auth/.well-known/openid-configuration`,
          scopes: ["openid", "profile", "email"],
          pkce: true,
        },
      ],
    }),
    tanstackStartCookies(),
  ],
})
