'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'
import InViewMount from '@/components/ui/InViewMount'

const ContactForm = dynamic(() => import('@/components/ui/ContactForm'), {
    ssr: false,
    loading: () => (
        <div className="inline-flex items-center gap-2 text-green-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Loading secure contact form...</span>
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
