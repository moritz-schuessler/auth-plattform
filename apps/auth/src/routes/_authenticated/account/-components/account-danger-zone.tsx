import { useRouter } from "@tanstack/react-router"
import { Button } from "@auth-plattform/ui/components/button"
import DeleteAccountDialog from "./delete-account-dialog"

interface AccountDangerZoneProps {
  oauthClients: Array<{ clientId: string; name: string | null }>
}

const AccountDangerZone = ({ oauthClients }: AccountDangerZoneProps) => {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">
        Deleting your account can't be undone.
        {oauthClients.length > 0 &&
          ` It also deletes the ${oauthClients.length} OAuth ${
            oauthClients.length === 1 ? "client" : "clients"
          } you own.`}
      </span>
      <DeleteAccountDialog
        oauthClients={oauthClients}
        onDeleted={() => router.invalidate()}
        trigger={<Button variant="destructive">Delete account</Button>}
      />
    </div>
  )
}

export default AccountDangerZone
