import { useMutation } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import useClientSecret from "./use-client-secret"
import { auth } from "@/lib/auth/server/auth"

const createOAuthClient = createServerFn({ method: "POST" })
  .inputValidator((data: { client_name: string; redirect_uri: string }) => data)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()

    const client = await auth.api.adminCreateOAuthClient({
      headers,
      body: {
        client_name: data.client_name,
        redirect_uris: [data.redirect_uri],
        skip_consent: true,
      },
    })

    return {
      client_id: client.client_id,
      client_secret: client.client_secret,
    }
  })

const useCreateClient = () => {
  const { setClientSecret } = useClientSecret()

  return useMutation({
    mutationFn: async (data: { client_name: string; redirect_uri: string }) => {
      const client = await createOAuthClient({ data })

      return { ...client, client_name: data.client_name }
    },
    onSuccess: ({ client_secret, ...client }) => {
      if (client_secret) {
        setClientSecret({ reason: "created", ...client, client_secret })
      }
    },
    gcTime: 0,
  })
}

export default useCreateClient
