import { useEffect, useRef, useState } from "react"

const useCopyToClipboard = (value: string, resetAfter = 1500) => {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopied(false), resetAfter)
  }

  return { copied, copy }
}

export default useCopyToClipboard
