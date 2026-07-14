import { createFileRoute } from "@tanstack/react-router"
import { auth } from "@/lib/auth/server/auth"

export const Route = createFileRoute(
  "/(api)/.well-known/oauth-authorization-server/api/auth"
)({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const url = new URL(request.url)
        url.pathname = "/api/auth/.well-known/oauth-authorization-server"
        return await auth.handler(new Request(url, request))
      },
    },
  },
})
