import { useMutation } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { auth } from "@/lib/auth/server/auth"

const createOAuthClient = createServerFn({ method: "POST" })
  .inputValidator((data: { client_name: string; redirect_uri: string }) => data)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()

    await auth.api.adminCreateOAuthClient({
      headers,
      body: {
        client_name: data.client_name,
        redirect_uris: [data.redirect_uri],
        skip_consent: true,
      },
    })
  })

const useCreateClient = () => {
  return useMutation({
    mutationFn: async (data: { client_name: string; redirect_uri: string }) => {
      await createOAuthClient({ data })
    },
  })
}

export default useCreateClient
