import { Button } from "@auth-plattform/ui/components/button"
import { Link, useRouter } from "@tanstack/react-router"
import type { PropsWithChildren } from "react"
import { authClient } from "@/lib/auth/client/auth-client"

type AppNavigationProps = PropsWithChildren

const AppNavigation = ({ children }: AppNavigationProps) => {
  const router = useRouter()

  const { data } = authClient.useSession()
  const isAdmin = data?.user.role === "admin"

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
        <aside className="w-3xs">
          <nav className="flex flex-col divide-y divide-border">
            <div className="p-4">
              <div className="text-lg text-muted-foreground">App</div>
              <div>
                <Button
                  variant="link"
                  render={
                    <Link
                      to="/dashboard"
                      activeProps={{
                        className: "text-primary",
                      }}
                    >
                      Dashboard
                    </Link>
                  }
                />
              </div>
            </div>

            {isAdmin && (
              <div className="p-4">
                <div className="text-lg text-muted-foreground">Admin</div>
                <div>
                  <Button
                    variant="link"
                    render={
                      <Link
                        to="/admin"
                        activeProps={{
                          className: "text-primary",
                        }}
                      >
                        Admin
                      </Link>
                    }
                  />
                </div>
              </div>
            )}
          </nav>
        </aside>
        {children}
      </div>
    </div>
  )
}

export default AppNavigation
