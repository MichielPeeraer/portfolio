import { useSyncExternalStore } from 'react'

import { detectIsMobileDevice } from '@/lib/device'

const subscribe = () => {
    return () => {}
}

const getServerSnapshot = () => false

export const useIsMobileDevice = () => {
    const isMobileDevice = useSyncExternalStore(
        subscribe,
        detectIsMobileDevice,
        getServerSnapshot
    )

    return isMobileDevice
}
