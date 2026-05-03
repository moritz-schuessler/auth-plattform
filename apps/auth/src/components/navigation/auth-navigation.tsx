import { Button } from "@auth-plattform/ui/components/button"
import { Link } from "@tanstack/react-router"

const AuthNavigation = () => {
  return (
    <header className="flex justify-start border-b border-border p-4">
      <Button
        variant="link"
        nativeButton={false}
        render={<Link to="/">auth-plattform</Link>}
      />
    </header>
  )
}

export default AuthNavigation
