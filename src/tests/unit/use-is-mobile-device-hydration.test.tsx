import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { useIsMobileDevice } from '@/hooks'

vi.mock('@/lib/device', () => ({
    detectIsMobileDevice: vi.fn(() => true),
}))

function MobileLabelProbe() {
    const isMobileDevice = useIsMobileDevice()

    return <p>{isMobileDevice ? 'press to skip' : 'click to skip'}</p>
}

describe('useIsMobileDevice hydration behavior', () => {
    it('hydrates without mismatch when client snapshot differs from server snapshot', async () => {
        const errorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined)

        const serverHtml = renderToString(<MobileLabelProbe />)
        expect(serverHtml).toContain('click to skip')

        const container = document.createElement('div')
        container.innerHTML = serverHtml
        document.body.appendChild(container)

        await act(async () => {
            hydrateRoot(container, <MobileLabelProbe />)
            await Promise.resolve()
        })

        expect(container.textContent).toContain('press to skip')

        const hydrationMismatchCalls = errorSpy.mock.calls.filter((args) =>
            String(args[0]).includes('Hydration failed')
        )
        expect(hydrationMismatchCalls).toHaveLength(0)

        errorSpy.mockRestore()
        container.remove()
    })
})
