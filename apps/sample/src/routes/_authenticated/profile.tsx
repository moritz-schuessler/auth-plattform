import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
})

function Profile() {
  const { user, session } = Route.useRouteContext()

  return (
    <main className="flex max-w-md flex-col gap-4 p-6 text-sm">
      <h1 className="font-medium">Profile</h1>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
        <dt className="text-muted-foreground">Name</dt>
        <dd>{user.name}</dd>
        <dt className="text-muted-foreground">Email</dt>
        <dd>{user.email}</dd>
        <dt className="text-muted-foreground">User ID</dt>
        <dd className="truncate">{user.id}</dd>
        <dt className="text-muted-foreground">Session expires</dt>
        <dd>{new Date(session.expiresAt).toLocaleString()}</dd>
      </dl>
    </main>
  )
}
