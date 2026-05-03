import { useCallback, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import { toast } from 'sonner'
import type { ContactFormValues } from '@/types'

const MIN_FILL_DURATION_MS = 2000
const SUBMIT_TIMEOUT_MS = 12000

interface UseContactSubmissionOptions {
    reset: () => void
}

const normalizeLinkedIn = (value?: string) => {
    if (!value) return ''

    const trimmed = value.trim()
    if (!trimmed) return ''

    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export const useContactSubmission = ({
    reset,
}: UseContactSubmissionOptions) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const startedAtRef = useRef<number>(Date.now())
    const trackedStartRef = useRef(false)

    const markFormStarted = useCallback((isDirty: boolean) => {
        if (isDirty && !trackedStartRef.current) {
            track('contact_form_started')
            trackedStartRef.current = true
        }
    }, [])

    const submit = useCallback(
        async (data: ContactFormValues) => {
            if (data.website && data.website.trim().length > 0) {
                track('contact_form_honeypot_triggered')
                toast.success('Transmission complete', {
                    description:
                        'Message sent successfully. I will get back to you soon.',
                })
                reset()
                startedAtRef.current = Date.now()
                trackedStartRef.current = false
                return
            }

            if (Date.now() - startedAtRef.current < MIN_FILL_DURATION_MS) {
                const tooFastMessage =
                    'Please wait a moment before submitting the form.'
                toast.error('Transmission failed', {
                    description: tooFastMessage,
                })
                return
            }

            track('contact_form_submitted')
            setIsSubmitting(true)

            try {
                const payload = {
                    FirstName: data.firstname,
                    LastName: data.lastname,
                    Email: data.email,
                    Phone: data.phone,
                    Company: data.company,
                    LinkedIn: normalizeLinkedIn(data.linkedin),
                    Message: data.message,
                    Website: data.website,
                }

                let attempt = 0

                while (attempt < 2) {
                    const controller = new AbortController()
                    const timeoutId = setTimeout(() => {
                        controller.abort()
                    }, SUBMIT_TIMEOUT_MS)

                    try {
                        const response = await fetch('/api/contact', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                            },
                            body: JSON.stringify(payload),
                            signal: controller.signal,
                        })

                        if (!response.ok) {
                            const body = (await response
                                .json()
                                .catch(() => ({}))) as {
                                error?: string
                                message?: string
                            }
                            throw new Error(
                                body.error ??
                                    body.message ??
                                    `Submission failed (${response.status})`
                            )
                        }

                        clearTimeout(timeoutId)
                        toast.success('Transmission complete', {
                            description:
                                'Message sent successfully. I will get back to you soon.',
                        })
                        track('contact_form_success')
                        reset()
                        startedAtRef.current = Date.now()
                        trackedStartRef.current = false
                        return
                    } catch (error) {
                        clearTimeout(timeoutId)

                        const canRetry =
                            attempt === 0 &&
                            error instanceof Error &&
                            (error.name === 'AbortError' ||
                                error.name === 'TypeError')

                        if (canRetry) {
                            attempt += 1
                            // Exponential backoff with jitter: ~100ms for first retry
                            const backoffMs =
                                Math.pow(2, attempt) * 50 + Math.random() * 50
                            await new Promise((resolve) =>
                                setTimeout(resolve, backoffMs)
                            )
                            continue
                        }

                        throw error
                    }
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.name === 'AbortError'
                            ? 'Request timed out. Please check your connection and try again.'
                            : error.message
                        : 'Failed to send message. Please try again.'

                track('contact_form_error', {
                    message: error instanceof Error ? error.message : 'unknown',
                })
                toast.error('Transmission failed', {
                    description: errorMessage,
                })
            } finally {
                setIsSubmitting(false)
            }
        },
        [reset]
    )

    return {
        isSubmitting,
        markFormStarted,
        submit,
    }
}
