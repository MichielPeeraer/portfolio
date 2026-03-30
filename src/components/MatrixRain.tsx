'use client'

import { useEffect, useRef } from 'react'

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const matrix =
            'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const matrixArray = matrix.split('')

        const fontSize = 16
        const columns = canvas.width / fontSize
        const drops: number[] = []

        for (let x = 0; x < columns; x++) {
            drops[x] = 1
        }

        function draw() {
            if (!ctx || !canvas) return

            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.fillStyle = '#0f0'
            ctx.font = fontSize + 'px monospace'

            for (let i = 0; i < drops.length; i++) {
                const text =
                    matrixArray[Math.floor(Math.random() * matrixArray.length)]
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)

                if (
                    drops[i] * fontSize > canvas.height &&
                    Math.random() > 0.975
                ) {
                    drops[i] = 0
                }
                drops[i]++
            }
        }

        let intervalId: ReturnType<typeof setInterval> | null = setInterval(
            draw,
            35
        )

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const handleVisibility = () => {
            if (document.hidden) {
                if (intervalId) {
                    clearInterval(intervalId)
                    intervalId = null
                }
            } else {
                if (!intervalId) intervalId = setInterval(draw, 35)
            }
        }

        window.addEventListener('resize', handleResize)
        document.addEventListener('visibilitychange', handleVisibility)

        return () => {
            if (intervalId) clearInterval(intervalId)
            window.removeEventListener('resize', handleResize)
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.1 }}
        />
    )
}
