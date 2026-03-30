'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'learning', label: 'Learning' },
    { id: 'contact', label: 'Contact' },
]

const socialLinks = [
    {
        name: 'GitHub',
        icon: FaGithub,
        url: 'https://github.com/MichielPeeraer',
    },
    {
        name: 'LinkedIn',
        icon: FaLinkedin,
        url: 'https://linkedin.com/in/michiel-herman-peeraer',
    },
]

export default function FloatingNavbar() {
    const [activeSection, setActiveSection] = useState('hero')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100

            for (const section of sections) {
                const element = document.getElementById(section.id)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetTop + offsetHeight
                    ) {
                        setActiveSection(section.id)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            const prefersReducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches
            element.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
            })
            setMobileMenuOpen(false)
        }
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-4xl bg-black/90 backdrop-blur-md border border-green-400/30 rounded-lg px-4 md:px-6 py-3"
        >
            <div className="flex items-center justify-between gap-4 md:gap-6">
                {/* Navigation (tablet + desktop) */}
                <div className="hidden md:flex flex-1 items-center gap-2 lg:gap-4 xl:gap-6">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`px-2 lg:px-3 py-1 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap hover:text-green-300 ${
                                activeSection === section.id
                                    ? 'text-green-300'
                                    : 'text-green-400'
                            } focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded`}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Mobile: label + menu button */}
                <div className="md:hidden flex items-center justify-between w-full">
                    <span className="text-green-300 text-sm font-medium">
                        {sections.find((s) => s.id === activeSection)?.label ??
                            'Menu'}
                    </span>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-green-400 hover:text-green-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Social Links - Tablet/Desktop */}
                <div className="hidden md:flex items-center gap-3 lg:gap-4 pl-3 lg:pl-4 border-l border-green-400/30">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded"
                            aria-label={link.name}
                        >
                            <link.icon size={18} />
                        </a>
                    ))}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-md border border-green-400/30 rounded-lg p-4 flex flex-col gap-3"
                >
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`text-left px-3 py-2 text-sm font-medium transition-colors hover:text-green-300 ${
                                activeSection === section.id
                                    ? 'text-green-300'
                                    : 'text-green-400'
                            } focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded`}
                        >
                            {section.label}
                        </button>
                    ))}
                    <div className="border-t border-green-400/30 pt-3 flex gap-4 justify-center">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded"
                                aria-label={link.name}
                            >
                                <link.icon size={20} />
                            </a>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    )
}
