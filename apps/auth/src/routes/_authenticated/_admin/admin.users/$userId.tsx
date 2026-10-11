import { Link, createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { Badge } from "@auth-plattform/ui/components/badge"
import { Button } from "@auth-plattform/ui/components/button"
import UserGeneralForm from "./-components/user-general-form"
import { auth } from "@/lib/auth/server/auth"

const getUser = createServerFn({ method: "GET" })
  .inputValidator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const headers = getRequestHeaders()

    try {
      const user = await auth.api.getUser({
        headers,
        query: { id: userId },
      })

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role ?? null,
        banned: user.banned ?? false,
      }
    } catch {
      return null
    }
  })

export const Route = createFileRoute(
  "/_authenticated/_admin/admin/users/$userId"
)({
  loader: async ({ params }) => {
    const user = await getUser({ data: params.userId })

    if (!user) {
      throw notFound()
    }

    return { user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useLoaderData()
  const { user: currentUser } = Route.useRouteContext()

  return (
    <main className="flex w-full flex-col gap-6 overflow-y-auto p-4">
      <div className="flex flex-col gap-1">
        <Button
          variant="link"
          size="sm"
          nativeButton={false}
          className="self-start text-muted-foreground"
          render={<Link to="/admin/users">← Users</Link>}
        />
        <div className="flex items-center gap-2">
          <h1 className="text-2xl">{user.name.trim() || user.email}</h1>
          {user.id === currentUser.id && <Badge variant="outline">You</Badge>}
          {user.role?.split(",").includes("admin") && <Badge>Admin</Badge>}
          {user.banned && <Badge variant="destructive">Banned</Badge>}
        </div>
      </div>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg">General</h2>
        <UserGeneralForm key={user.id} user={user} />
      </section>
    </main>
  )
}
