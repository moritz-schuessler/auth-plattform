import { Button } from "@auth-plattform/ui/components/button"
import { Link, useRouter } from "@tanstack/react-router"
import type { PropsWithChildren } from "react"
import { authClient } from "@/lib/auth/client/auth-client"

type AppNavigationProps = PropsWithChildren

const AppNavigation = ({ children }: AppNavigationProps) => {
  const router = useRouter()

  const handleSignOut = () => {
    authClient.signOut().then(() => {
      router.invalidate()
    })
  }

  return (
    <div className="flex h-dvh flex-col divide-y divide-border">
      <header className="flex justify-between p-4">
        <Button
          variant="link"
          render={<Link to="/dashboard">auth-plattform</Link>}
        />
        <Button onClick={handleSignOut}>Signout</Button>
      </header>
      <div className="flex size-full divide-x divide-border">
        <aside className="w-3xs p-4">
          <nav className="flex flex-col items-start">
            <Button
              variant="link"
              render={<Link to="/dashboard">Dashboard</Link>}
            />
          </nav>
        </aside>
        {children}
      </div>
    </div>
  )
}

export default AppNavigation
