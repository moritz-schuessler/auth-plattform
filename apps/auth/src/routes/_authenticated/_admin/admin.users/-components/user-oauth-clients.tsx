interface UserOAuthClientsProps {
  clients: Array<{ clientId: string; name: string | null }>
}

const UserOAuthClients = ({ clients }: UserOAuthClientsProps) => {
  if (clients.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This user doesn't own any OAuth clients.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2 text-sm">
      {clients.map((client) => (
        <li key={client.clientId} className="flex items-center gap-3">
          <span className="font-medium">{client.name ?? client.clientId}</span>
          <code className="font-mono text-xs text-muted-foreground">
            {client.clientId}
          </code>
        </li>
      ))}
    </ul>
  )
}

export default UserOAuthClients
