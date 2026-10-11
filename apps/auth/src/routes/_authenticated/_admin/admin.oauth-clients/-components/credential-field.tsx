import CopyButton from "./copy-button"

interface CredentialFieldProps {
  label: string
  value: string
}

const CredentialField = ({ label, value }: CredentialFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <code className="flex h-9 min-w-0 flex-1 items-center overflow-x-auto border border-border bg-muted px-3 font-mono text-sm select-all">
          {value}
        </code>
        <CopyButton
          value={value}
          label={`Copy ${label}`}
          variant="outline"
          size="default"
          className="w-20"
        />
      </div>
    </div>
  )
}

export default CredentialField
