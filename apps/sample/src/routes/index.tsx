import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const { user } = Route.useRouteContext()

  return (
    <main className="flex max-w-md flex-col gap-2 p-6 text-sm leading-loose">
      <h1 className="font-medium">Sample App</h1>
      {user ? (
        <p>Signed in as {user.email}.</p>
      ) : (
        <p>Sign in with your auth-plattform account to continue.</p>
      )}
    </main>
  )
}
