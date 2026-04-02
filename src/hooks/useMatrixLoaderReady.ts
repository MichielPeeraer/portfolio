import { useEffect, useState } from 'react'

type MatrixLoaderWindow = Window & {
    __matrixLoaderReady?: boolean
}

const isLoaderReady = () => {
    if (typeof window === 'undefined') return false
    return Boolean((window as MatrixLoaderWindow).__matrixLoaderReady)
}

export const useMatrixLoaderReady = () => {
    const [ready, setReady] = useState(isLoaderReady)

    useEffect(() => {
        if (ready) return

        const handleLoaderDone = () => {
            setReady(true)
        }

        window.addEventListener('matrix-loader:done', handleLoaderDone)

        return () => {
            window.removeEventListener('matrix-loader:done', handleLoaderDone)
        }
    }, [ready])

    return ready
}
