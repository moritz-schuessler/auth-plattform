import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { Button } from "@auth-plattform/ui/components/button"

import appCss from "@auth-plattform/ui/globals.css?url"
import { getSession } from "@/lib/auth/server/session"
import SignInButton from "@/components/sign-in-button"
import SignOutButton from "@/components/sign-out-button"

export const Route = createRootRoute({
  beforeLoad: async () => {
    const session = await getSession()

    return {
      user: session?.user ?? null,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Sample App",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  const { user } = Route.useRouteContext()

  return (
    <>
      <header className="flex justify-between border-b border-border p-4">
        <Button
          variant="link"
          nativeButton={false}
          render={<Link to="/">sample</Link>}
        />
        <nav className="flex gap-4">
          {user ? (
            <>
              <Button
                variant="link"
                nativeButton={false}
                render={<Link to="/profile">profile</Link>}
              />
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </nav>
      </header>
      <Outlet />
    </>
  )
}
