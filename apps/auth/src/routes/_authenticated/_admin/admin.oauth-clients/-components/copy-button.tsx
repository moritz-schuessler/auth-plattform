import { Button } from "@auth-plattform/ui/components/button"
import type { ComponentProps } from "react"
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard"

type CopyButtonProps = Pick<
  ComponentProps<typeof Button>,
  "variant" | "size" | "className"
> & {
  value: string
  label: string
}

const CopyButton = ({
  value,
  label,
  variant = "ghost",
  size = "xs",
  className = "w-14 text-muted-foreground",
}: CopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard(value)

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      aria-label={label}
      onClick={copy}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </Button>
  )
}

export default CopyButton
