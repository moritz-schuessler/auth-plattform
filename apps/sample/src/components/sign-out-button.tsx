import { useRouter } from "@tanstack/react-router"
import { Button } from "@auth-plattform/ui/components/button"
import { authClient } from "@/lib/auth/client/auth-client"

const SignOutButton = () => {
  const router = useRouter()

  const signOut = async () => {
    await authClient.signOut()
    await router.navigate({ to: "/" })
    await router.invalidate()
  }

  return (
    <Button variant="outline" onClick={signOut}>
      Sign out
    </Button>
  )
}

export default SignOutButton
