import { Button } from "@auth-plattform/ui/components/button"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

interface CopyButtonProps {
  value: string
  label: string
}

const CopyButton = ({ value, label }: CopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard(value)

  return (
    <Button
      variant="ghost"
      size="xs"
      className="w-14 text-muted-foreground"
      aria-label={label}
      onClick={copy}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </Button>
  )
}

export default CopyButton
