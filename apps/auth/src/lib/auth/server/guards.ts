import { redirect } from "@tanstack/react-router"
import { getSession } from "./session"

const requireSession = async () => {
  const session = await getSession()

  if (!session) {
    throw redirect({ to: "/login" })
  }

  return session
}

const requireAdmin = async () => {
  const session = await getSession()

  if (!session) {
    throw redirect({ to: "/login" })
  }

  if (!session.user.role?.includes("admin")) {
    console.warn("User is not an admin, redirecting to dashboard")
    throw redirect({ to: "/dashboard" })
  }

  return session
}

const requireAnonymous = async () => {
  const session = await getSession()

  if (session) {
    throw redirect({
      to: "/dashboard",
    })
  }

  return null
}

export { requireSession, requireAdmin, requireAnonymous }
