import { Button } from "@auth-plattform/ui/components/button"
import { Link } from "@tanstack/react-router"

type PublicNavigationProps = {
  isAuthenticated: boolean
}

const PublicNavigation = ({ isAuthenticated }: PublicNavigationProps) => {
  return (
    <header className="flex justify-between border-b border-border p-4">
      <Button variant="link" render={<Link to="/"> auth-plattform</Link>} />
      <nav className="flex gap-4">
        {isAuthenticated ? (
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
