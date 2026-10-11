import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { asc, eq } from "drizzle-orm"
import { Separator } from "@auth-plattform/ui/components/separator"
import AccountDangerZone from "./-components/account-danger-zone"
import AccountEmailForm from "./-components/account-email-form"
import AccountNameForm from "./-components/account-name-form"
import AccountPasswordForm from "./-components/account-password-form"
import { requireSession } from "@/lib/auth/server/guards"
import db from "@/data/db"
import { oauthClient } from "@/data/schema"

const listOwnOAuthClients = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await requireSession()

    return await db
      .select({ clientId: oauthClient.clientId, name: oauthClient.name })
      .from(oauthClient)
      .where(eq(oauthClient.userId, user.id))
      .orderBy(asc(oauthClient.name))
  }
)

export const Route = createFileRoute("/_authenticated/account/")({
  loader: async () => {
    return { oauthClients: await listOwnOAuthClients() }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()
  const { oauthClients } = Route.useLoaderData()

  return (
    <main className="flex w-full flex-col gap-6 overflow-y-auto p-4">
      <h1 className="text-2xl">Account</h1>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg">General</h2>
        <AccountNameForm user={user} />
        <AccountEmailForm user={user} />
      </section>
      <Separator />
      <section className="flex flex-col gap-3">
        <h2 className="text-lg">Password</h2>
        <AccountPasswordForm />
      </section>
      <Separator />
      <section className="flex flex-col gap-3">
        <h2 className="text-lg">Danger zone</h2>
        <AccountDangerZone oauthClients={oauthClients} />
      </section>
    </main>
  )
}
