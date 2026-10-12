import { redirect } from "@tanstack/react-router"
import { getSession } from "./session"

const requireSession = async () => {
  const session = await getSession()

  if (!session) {
    throw redirect({ to: "/" })
  }

  return session
}

export { requireSession }
