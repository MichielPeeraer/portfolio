import { useEffect, useState } from 'react'

interface UseTypewriterOptions {
    lines: string[]
    enabled?: boolean
    typingSpeedMs?: number
    deletingSpeedMs?: number
    holdAtFullMs?: number
    holdAtEmptyMs?: number
}

export const useTypewriter = ({
    lines,
    enabled = true,
    typingSpeedMs = 72,
    deletingSpeedMs = 42,
    holdAtFullMs = 1500,
    holdAtEmptyMs = 280,
}: UseTypewriterOptions) => {
    const [typedLineIndex, setTypedLineIndex] = useState(0)
    const [typedText, setTypedText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (!enabled || lines.length === 0) return

        const currentLine = lines[typedLineIndex] ?? ''
        const isLineComplete = typedText === currentLine
        const isLineCleared = typedText === ''

        let timeoutMs = isDeleting ? deletingSpeedMs : typingSpeedMs

        if (!isDeleting && isLineComplete) {
            timeoutMs = holdAtFullMs
        } else if (isDeleting && isLineCleared) {
            timeoutMs = holdAtEmptyMs
        }

        const timeout = window.setTimeout(() => {
            if (!isDeleting && !isLineComplete) {
                setTypedText(currentLine.slice(0, typedText.length + 1))
                return
            }

            if (!isDeleting && isLineComplete) {
                setIsDeleting(true)
                return
            }

            if (isDeleting && !isLineCleared) {
                setTypedText(currentLine.slice(0, typedText.length - 1))
                return
            }

            setIsDeleting(false)
            setTypedLineIndex(
                (currentIndex) => (currentIndex + 1) % lines.length
            )
        }, timeoutMs)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [
        deletingSpeedMs,
        enabled,
        holdAtEmptyMs,
        holdAtFullMs,
        isDeleting,
        lines,
        typedLineIndex,
        typedText,
        typingSpeedMs,
    ])

    return typedText
}
