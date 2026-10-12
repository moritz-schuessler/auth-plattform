import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { asc, eq, max } from "drizzle-orm"
import { Separator } from "@auth-plattform/ui/components/separator"
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

  const clients = await db
    .select({
      clientId: oauthClient.clientId,
      name: oauthClient.name,
      uri: oauthClient.uri,
      icon: oauthClient.icon,
      disabled: oauthClient.disabled,
    })
    .from(oauthClient)
    .orderBy(asc(oauthClient.name))

  const used = clients
    .flatMap((client) => {
      const lastActiveAt = lastActiveByClient.get(client.clientId)

      return lastActiveAt ? [{ ...client, lastActiveAt }] : []
    })
    .sort((a, b) => b.lastActiveAt.getTime() - a.lastActiveAt.getTime())

  const available = clients
    .filter(
      (client) => !client.disabled && !lastActiveByClient.has(client.clientId)
    )
    .map((client) => ({ ...client, lastActiveAt: null }))

  return { used, available }
})

export const Route = createFileRoute("/_authenticated/dashboard/")({
  loader: async () => {
    return await listApplications()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { used, available } = Route.useLoaderData()

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
        <ApplicationCards
          applications={used}
          emptyMessage="You haven't signed in to any applications yet."
        />
      </section>
      <Separator />
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg">Explore</h2>
          <p className="text-sm text-muted-foreground">
            Applications you can use but haven't signed in to yet.
          </p>
        </div>
        <ApplicationCards
          applications={available}
          emptyMessage="There are no other applications available."
        />
      </section>
    </main>
  )
}
