'use client'

import { useEffect, useRef } from 'react'

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext('2d')
        if (!context) return
        const ctx: CanvasRenderingContext2D = context

        const matrix =
            'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const matrixArray = matrix.split('')

        const fontSize = 16
        const frameIntervalMs = 1000 / 30
        let drops: number[] = []
        let width = 0
        let height = 0
        let rafId: number | null = null
        let lastFrameTime = 0

        const setupCanvas = () => {
            width = window.innerWidth
            height = window.innerHeight

            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.floor(width * dpr)
            canvas.height = Math.floor(height * dpr)
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            const columns = Math.max(1, Math.floor(width / fontSize))
            drops = Array.from({ length: columns }, () =>
                Math.floor(Math.random() * (height / fontSize))
            )
        }

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
            ctx.fillRect(0, 0, width, height)

            ctx.fillStyle = '#0f0'
            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const text =
                    matrixArray[Math.floor(Math.random() * matrixArray.length)]
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }
        }

        const animate = (timestamp: number) => {
            if (timestamp - lastFrameTime >= frameIntervalMs) {
                lastFrameTime = timestamp
                draw()
            }

            rafId = window.requestAnimationFrame(animate)
        }

        const startAnimation = () => {
            if (rafId !== null) return
            rafId = window.requestAnimationFrame(animate)
        }

        const stopAnimation = () => {
            if (rafId === null) return
            window.cancelAnimationFrame(rafId)
            rafId = null
        }

        const handleResize = () => {
            setupCanvas()
        }

        const handleVisibility = () => {
            if (document.hidden) {
                stopAnimation()
            } else {
                startAnimation()
            }
        }

        setupCanvas()
        startAnimation()

        window.addEventListener('resize', handleResize, { passive: true })
        document.addEventListener('visibilitychange', handleVisibility)

        return () => {
            stopAnimation()
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
