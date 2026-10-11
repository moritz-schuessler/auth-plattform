import { useMutation } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth/client/auth-client"

const useSetRole = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: { userId: string; role: "admin" | "user" }) => {
      const response = await authClient.admin.setRole(data)

      if (response.error) {
        throw new Error(response.error.message || "Set role failed")
      }

      return response.data
    },
    onSuccess: async () => {
      await router.invalidate()
    },
  })
}

export default useSetRole
