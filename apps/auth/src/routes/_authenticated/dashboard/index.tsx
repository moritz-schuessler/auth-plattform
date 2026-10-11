import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { eq, inArray, max } from "drizzle-orm"
import ApplicationCards from "./-components/application-cards"
import { requireSession } from "@/lib/auth/server/guards"
import db from "@/data/db"
import { oauthAccessToken, oauthClient, oauthRefreshToken } from "@/data/schema"

const listApplications = createServerFn({ method: "GET" }).handler(async () => {
  const { user } = await requireSession()

  const [refreshTokens, accessTokens] = await Promise.all([
    db
      .select({
        clientId: oauthRefreshToken.clientId,
        lastActiveAt: max(oauthRefreshToken.createdAt),
      })
      .from(oauthRefreshToken)
      .where(eq(oauthRefreshToken.userId, user.id))
      .groupBy(oauthRefreshToken.clientId),
    db
      .select({
        clientId: oauthAccessToken.clientId,
        lastActiveAt: max(oauthAccessToken.createdAt),
      })
      .from(oauthAccessToken)
      .where(eq(oauthAccessToken.userId, user.id))
      .groupBy(oauthAccessToken.clientId),
  ])

  const lastActiveByClient = new Map<string, Date>()

  for (const { clientId, lastActiveAt } of [
    ...refreshTokens,
    ...accessTokens,
  ]) {
    const current = lastActiveByClient.get(clientId)

    if (lastActiveAt && (!current || lastActiveAt > current)) {
      lastActiveByClient.set(clientId, lastActiveAt)
    }
  }

  if (lastActiveByClient.size === 0) {
    return []
  }

  const clients = await db
    .select({
      clientId: oauthClient.clientId,
      name: oauthClient.name,
      uri: oauthClient.uri,
      icon: oauthClient.icon,
      disabled: oauthClient.disabled,
    })
    .from(oauthClient)
    .where(inArray(oauthClient.clientId, [...lastActiveByClient.keys()]))

  return clients
    .map((client) => ({
      ...client,
      lastActiveAt: lastActiveByClient.get(client.clientId)!,
    }))
    .sort((a, b) => b.lastActiveAt.getTime() - a.lastActiveAt.getTime())
})

export const Route = createFileRoute("/_authenticated/dashboard/")({
  loader: async () => {
    return { applications: await listApplications() }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { applications } = Route.useLoaderData()

  return (
    <main className="flex w-full flex-col gap-6 overflow-y-auto p-4">
      <h1 className="text-2xl">Dashboard</h1>
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg">Applications</h2>
          <p className="text-sm text-muted-foreground">
            Applications you have signed in to with your account.
          </p>
        </div>
        <ApplicationCards applications={applications} />
      </section>
    </main>
  )
}
