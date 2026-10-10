import { useEffect, useRef, useState } from "react"
import { Button } from "@auth-plattform/ui/components/button"

interface CredentialFieldProps {
  label: string
  value: string
}

const CredentialField = ({ label, value }: CredentialFieldProps) => {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <code className="flex h-9 min-w-0 flex-1 items-center overflow-x-auto border border-border bg-muted px-3 font-mono text-sm select-all">
          {value}
        </code>
        <Button variant="outline" className="w-20" onClick={handleCopy}>
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
    </div>
  )
}

export default CredentialField
