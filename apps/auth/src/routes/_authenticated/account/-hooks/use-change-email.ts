import { useMutation } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth/client/auth-client"

const useChangeEmail = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: { newEmail: string }) => {
      const response = await authClient.changeEmail(data)

      if (response.error) {
        throw new Error(response.error.message || "Change email failed")
      }

      const session = await authClient.getSession()

      if (session.data?.user.email !== data.newEmail.toLowerCase()) {
        throw new Error("This email can't be used")
      }

      return response.data
    },
    onSuccess: async () => {
      await router.invalidate()
    },
  })
}

export default useChangeEmail
