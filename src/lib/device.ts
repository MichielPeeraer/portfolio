export const detectIsMobileDevice = () => {
    if (typeof navigator === 'undefined') return false

    const nav = navigator as Navigator & {
        userAgentData?: {
            mobile?: boolean
        }
    }

    if (typeof nav.userAgentData?.mobile === 'boolean') {
        return nav.userAgentData.mobile
    }

    const ua = navigator.userAgent
    const isMobileUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
            ua
        )
    const isTouchMac = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1

    return isMobileUA || isTouchMac
}
