import { Button } from "@auth-plattform/ui/components/button"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth/client/auth-client"

export const Route = createFileRoute("/(app)/_authenticated/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { data } = authClient.useSession()

  const handleSignOut = () => {
    authClient.signOut().then(() => {
      router.invalidate()
    })
  }

  return (
    <main className="flex flex-col p-4">
      <h1 className="text-2xl">Dashboard</h1>
      <p className="mt-2">Welcome, {data?.user.email}!</p>
      <Button onClick={handleSignOut}>Signout</Button>
    </main>
  )
}
