import { useMutation } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth/client/auth-client"

const useUpdateName = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await authClient.updateUser(data)

      if (response.error) {
        throw new Error(response.error.message || "Update name failed")
      }

      return response.data
    },
    onSuccess: async () => {
      await router.invalidate()
    },
  })
}

export default useUpdateName
