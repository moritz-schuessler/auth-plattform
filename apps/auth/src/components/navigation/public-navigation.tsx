import { Button } from "@auth-plattform/ui/components/button"
import { Link } from "@tanstack/react-router"
import type { User } from "better-auth"

const PublicNavigation = ({ user }: { user: User | null }) => {
  return (
    <header className="flex justify-between border-b border-border p-4">
      <Button variant="link" render={<Link to="/"> auth-plattform</Link>} />
      <nav className="flex gap-4">
        {user ? (
          <Button
            variant="link"
            render={<Link to="/dashboard">dashboard</Link>}
          />
        ) : (
          <>
            <Button variant="link" render={<Link to="/login">login</Link>} />
            <Button variant="link" render={<Link to="/signup">sign up</Link>} />
          </>
        )}
      </nav>
    </header>
  )
}

export default PublicNavigation
