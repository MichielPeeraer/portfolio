import { getSocialIcon } from '@/lib/social-icons'
import { DeferredContactForm } from '@/components/ui'
import type { ContactInfo } from '@/types'

interface ContactSectionProps {
    contact: ContactInfo
}

export default function ContactSection({ contact }: ContactSectionProps) {
    return (
        <section id="contact" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8 text-green-300">
                    Contact
                </h2>

                <div className="space-y-4">
                    <a
                        href={`tel:${contact.phone}`}
                        className="text-lg hover:text-green-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
                    >
                        {contact.phone}
                    </a>
                    <a
                        href={`mailto:${contact.email}`}
                        className="text-lg hover:text-green-300 transition-colors block focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
                    >
                        {contact.email}
                    </a>

                    <DeferredContactForm />

                    <div className="flex space-x-8 justify-center mt-8">
                        {contact.socialLinks
                            .filter((link) => link.name !== 'Website')
                            .map((link) => {
                                const Icon = link.icon
                                    ? getSocialIcon(link.icon)
                                    : null
                                if (!Icon) return null
                                return (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-all duration-200 hover:text-green-300 hover:-translate-y-0.5 hover:drop-shadow-[0_0_10px_rgba(74,222,128,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
                                        aria-label={link.name}
                                    >
                                        <Icon size={32} />
                                    </a>
                                )
                            })}
                    </div>
                </div>
            </div>
        </section>
    )
}
