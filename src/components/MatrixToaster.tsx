'use client'

import { Toaster } from 'sonner'

export default function MatrixToaster() {
    return (
        <Toaster
            theme="dark"
            className="matrix-toaster"
            position="top-right"
            expand
            richColors
            toastOptions={{
                duration: 5000,
                classNames: {
                    toast: 'matrix-toast',
                    title: 'matrix-toast-title',
                    description: 'matrix-toast-description',
                    success: 'matrix-toast-success',
                    error: 'matrix-toast-error',
                },
            }}
        />
    )
}
