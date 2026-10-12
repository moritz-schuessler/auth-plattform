import { Button } from "@auth-plattform/ui/components/button"
import { authClient } from "@/lib/auth/client/auth-client"

const SignInButton = () => {
  const signIn = async () => {
    await authClient.signIn.oauth2({
      providerId: "auth-plattform",
      callbackURL: "/profile",
    })
  }

  return <Button onClick={signIn}>Sign in with auth-plattform</Button>
}

export default SignInButton
