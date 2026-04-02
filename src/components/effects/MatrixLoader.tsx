'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useIsMobileDevice } from '@/hooks'

interface MatrixLoaderProps {
    name: string
}

const STATIC_LINES = [
    'Hey, glad you stopped by.',
    'I turn ideas into software.',
    'Welcome to my portfolio.',
]

const CHAR_DELAY = 55
const LINE_PAUSE = 500
const END_PAUSE = 1200

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))

export default function MatrixLoader({ name }: MatrixLoaderProps) {
    const lines = useMemo(
        () => [
            STATIC_LINES[0],
            `My name is ${name}.`,
            ...STATIC_LINES.slice(1),
        ],
        [name]
    )
    const isMobileDevice = useIsMobileDevice()
    const [show, setShow] = useState(true)
    const [completedLines, setCompletedLines] = useState<string[]>([])
    const [typingLine, setTypingLine] = useState('')
    const hasEmittedReady = useRef(false)

    const emitReady = () => {
        if (hasEmittedReady.current) return
        hasEmittedReady.current = true
        ;(
            window as Window & {
                __matrixLoaderReady?: boolean
            }
        ).__matrixLoaderReady = true

        window.dispatchEvent(new Event('matrix-loader:done'))
    }

    const dismiss = useCallback(() => {
        emitReady()
        document.body.style.overflow = ''
        setShow(false)
    }, [])

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        let cancelled = false

        const run = async () => {
            await delay(400)

            for (let i = 0; i < lines.length; i++) {
                if (cancelled) return
                const line = lines[i]

                for (let c = 1; c <= line.length; c++) {
                    if (cancelled) return
                    setTypingLine(line.slice(0, c))
                    await delay(CHAR_DELAY)
                }

                if (cancelled) return
                setCompletedLines((prev) => [...prev, line])
                setTypingLine('')

                if (i < lines.length - 1) await delay(LINE_PAUSE)
            }

            await delay(END_PAUSE)
            if (!cancelled) dismiss()
        }

        run()

        return () => {
            cancelled = true
            document.body.style.overflow = ''
        }
    }, [dismiss, lines])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="matrix-loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    role="button"
                    tabIndex={0}
                    aria-label="Loading screen — click or press any key to skip"
                    className="fixed inset-0 z-200 bg-black flex items-center justify-center cursor-pointer outline-none"
                    onClick={dismiss}
                    onKeyDown={dismiss}
                >
                    <div className="font-mono text-base md:text-xl px-8 max-w-xl w-full space-y-2">
                        {completedLines.map((line, i) => (
                            <p key={i} className="text-green-400/50">
                                {line}
                            </p>
                        ))}
                        <p className="text-green-300 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]">
                            {typingLine}
                            <span className="animate-pulse">▌</span>
                        </p>
                    </div>
                    <p className="absolute bottom-6 right-6 text-green-400/30 text-xs font-mono select-none">
                        {isMobileDevice ? 'press to skip' : 'click to skip'}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
