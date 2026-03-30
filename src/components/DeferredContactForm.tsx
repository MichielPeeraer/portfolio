'use client'

import dynamic from 'next/dynamic'
import InViewMount from './InViewMount'

const ContactForm = dynamic(() => import('./ContactForm'), {
    ssr: false,
    loading: () => (
        <div className="text-green-500 text-sm">
            Loading secure contact form...
        </div>
    ),
})

export default function DeferredContactForm() {
    return (
        <InViewMount
            fallback={
                <div className="mt-12 text-green-500 text-sm">
                    Form initializes when you reach this section.
                </div>
            }
        >
            <div className="mt-12">
                <ContactForm />
            </div>
        </InViewMount>
    )
}
