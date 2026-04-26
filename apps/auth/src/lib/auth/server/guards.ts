import { redirect } from "@tanstack/react-router"
import { getSession } from "./session"

const requireSession = async () => {
  const session = await getSession()

  if (!session) {
    throw redirect({ to: "/login" })
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

export { requireSession, requireAnonymous }
