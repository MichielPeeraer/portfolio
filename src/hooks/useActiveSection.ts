import { useEffect, useState } from 'react'

interface UseActiveSectionOptions {
    sectionIds: string[]
    initialSectionId?: string
    triggerRatio?: number
}

export const useActiveSection = ({
    sectionIds,
    initialSectionId,
    triggerRatio = 0.35,
}: UseActiveSectionOptions) => {
    const fallbackId = initialSectionId ?? sectionIds[0] ?? ''
    const [activeSection, setActiveSection] = useState(fallbackId)

    useEffect(() => {
        if (sectionIds.length === 0) return

        const sectionElements = sectionIds
            .map((id) => ({ id, el: document.getElementById(id) }))
            .filter((section): section is { id: string; el: HTMLElement } =>
                Boolean(section.el)
            )

        if (sectionElements.length === 0) return

        const handleScroll = () => {
            const triggerY = window.scrollY + window.innerHeight * triggerRatio
            let nextActive = sectionElements[0].id

            for (const { id, el } of sectionElements) {
                if (el.offsetTop <= triggerY) {
                    nextActive = id
                }
            }

            setActiveSection((currentActive) =>
                currentActive === nextActive ? currentActive : nextActive
            )
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleScroll)
        }
    }, [sectionIds, triggerRatio])

    return activeSection
}
