import { Button } from "@auth-plattform/ui/components/button"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

interface CredentialFieldProps {
  label: string
  value: string
}

const CredentialField = ({ label, value }: CredentialFieldProps) => {
  const { copied, copy } = useCopyToClipboard(value)

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <code className="flex h-9 min-w-0 flex-1 items-center overflow-x-auto border border-border bg-muted px-3 font-mono text-sm select-all">
          {value}
        </code>
        <Button variant="outline" className="w-20" onClick={copy}>
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
    </div>
  )
}

export default CredentialField
