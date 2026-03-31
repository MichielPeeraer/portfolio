'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { track } from '@vercel/analytics'
import { Controller, type FieldErrors, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Turnstile } from '@marsidev/react-turnstile'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const PhoneInput = dynamic(() => import('react-phone-number-input'), {
    ssr: false,
})

const MIN_FILL_DURATION_MS = 2000
const SUBMIT_TIMEOUT_MS = 12000

const contactSchema = z.object({
    firstname: z.string().min(1, '* Required'),
    lastname: z.string().min(1, '* Required'),
    email: z.string().email('* Not a valid email address'),
    phone: z
        .string()
        .optional()
        .refine(
            (value) => !value || isValidPhoneNumber(value),
            '* Not a valid phone number'
        ),
    company: z.string().optional(),
    linkedin: z
        .string()
        .optional()
        .refine(
            (value) =>
                !value ||
                /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(
                    value
                ),
            '* Not a valid LinkedIn URL'
        ),
    message: z.string().min(1, '* Required'),
    website: z.string().optional(),
    turnstile: z.string().min(1, '* Required'),
})

type ContactFormValues = z.infer<typeof contactSchema>

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const FORMSPARK_FORM_ID = process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [turnstileKey, setTurnstileKey] = useState(0)
    const [formError, setFormError] = useState<string | null>(null)
    const startedAtRef = useRef<number>(Date.now())
    const trackedStartRef = useRef(false)

    const {
        register,
        control,
        handleSubmit,
        setFocus,
        setValue,
        formState: { errors, isDirty, isValid },
        reset,
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        mode: 'onChange',
        defaultValues: {
            phone: '',
            website: '',
            turnstile: '',
        },
    })

    useEffect(() => {
        if (isDirty && !trackedStartRef.current) {
            track('contact_form_started')
            trackedStartRef.current = true
        }
    }, [isDirty])

    const resetTurnstile = () => {
        setValue('turnstile', '')
        setTurnstileKey((k) => k + 1)
    }

    const normalizeLinkedIn = (value?: string) => {
        if (!value) return ''

        const trimmed = value.trim()
        if (!trimmed) return ''

        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    }

    const onInvalidSubmit = (formErrors: FieldErrors<ContactFormValues>) => {
        const fieldOrder: Array<keyof ContactFormValues> = [
            'firstname',
            'lastname',
            'email',
            'phone',
            'company',
            'linkedin',
            'message',
            'turnstile',
        ]

        const firstInvalidField = fieldOrder.find((key) =>
            Boolean(formErrors[key])
        )

        if (firstInvalidField && firstInvalidField !== 'turnstile') {
            setFocus(firstInvalidField)
        }

        setFormError('* Please fix the highlighted fields and try again.')
        track('contact_form_validation_failed', {
            field: firstInvalidField ?? 'unknown',
        })
    }

    const onSubmit = async (data: ContactFormValues) => {
        setFormError(null)

        if (data.website && data.website.trim().length > 0) {
            track('contact_form_honeypot_triggered')
            toast.success('Transmission complete', {
                description:
                    'Message sent successfully. I will get back to you soon.',
            })
            reset()
            resetTurnstile()
            startedAtRef.current = Date.now()
            trackedStartRef.current = false
            return
        }

        if (Date.now() - startedAtRef.current < MIN_FILL_DURATION_MS) {
            const tooFastMessage =
                '* Please wait a moment before submitting the form.'
            setFormError(tooFastMessage)
            toast.error('Transmission failed', {
                description: tooFastMessage,
            })
            return
        }

        if (!TURNSTILE_SITE_KEY || !FORMSPARK_FORM_ID) {
            toast.error('Form misconfigured', {
                description:
                    'The contact form is missing required environment configuration.',
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
                'cf-turnstile-response': data.turnstile,
            }

            let attempt = 0

            while (attempt < 2) {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => {
                    controller.abort()
                }, SUBMIT_TIMEOUT_MS)

                try {
                    const response = await fetch(
                        `https://submit-form.com/${FORMSPARK_FORM_ID}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                            },
                            body: JSON.stringify(payload),
                            signal: controller.signal,
                        }
                    )

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
                    resetTurnstile()
                    setFormError(null)
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

            setFormError(`* ${errorMessage}`)
            track('contact_form_error', {
                message: error instanceof Error ? error.message : 'unknown',
            })
            toast.error('Transmission failed', {
                description: errorMessage,
            })
            resetTurnstile()
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
            noValidate
            aria-busy={isSubmitting}
            className="max-w-2xl mx-auto space-y-6 text-left"
        >
            <p className="text-xs text-green-500/90 text-left">
                * Required fields
            </p>

            <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register('website')}
                />
            </div>

            {formError && (
                <p
                    role="status"
                    aria-live="polite"
                    className="text-red-400 text-sm text-left"
                >
                    {formError}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="firstname"
                        className="block text-sm text-green-300 mb-2"
                    >
                        First name *
                    </label>
                    <input
                        id="firstname"
                        {...register('firstname')}
                        type="text"
                        placeholder="Neo"
                        autoComplete="given-name"
                        aria-invalid={Boolean(errors.firstname)}
                        aria-describedby={
                            errors.firstname ? 'firstname-error' : undefined
                        }
                        className="w-full bg-black border border-green-400/50 text-green-400 placeholder-green-600 px-4 py-3 rounded transition-[border-color,box-shadow,transform] duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_0_0_1px_rgba(74,222,128,0.35),0_0_18px_rgba(74,222,128,0.15)]"
                    />
                    {errors.firstname && (
                        <p
                            id="firstname-error"
                            className="text-red-400 text-sm mt-1 text-left"
                        >
                            {errors.firstname.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="lastname"
                        className="block text-sm text-green-300 mb-2"
                    >
                        Last name *
                    </label>
                    <input
                        id="lastname"
                        {...register('lastname')}
                        type="text"
                        placeholder="Anderson"
                        autoComplete="family-name"
                        aria-invalid={Boolean(errors.lastname)}
                        aria-describedby={
                            errors.lastname ? 'lastname-error' : undefined
                        }
                        className="w-full bg-black border border-green-400/50 text-green-400 placeholder-green-600 px-4 py-3 rounded transition-[border-color,box-shadow,transform] duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_0_0_1px_rgba(74,222,128,0.35),0_0_18px_rgba(74,222,128,0.15)]"
                    />
                    {errors.lastname && (
                        <p
                            id="lastname-error"
                            className="text-red-400 text-sm mt-1 text-left"
                        >
                            {errors.lastname.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm text-green-300 mb-2"
                    >
                        Email *
                    </label>
                    <input
                        id="email"
                        {...register('email')}
                        type="email"
                        placeholder="neo@zion.io"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                            errors.email ? 'email-error' : undefined
                        }
                        className="w-full bg-black border border-green-400/50 text-green-400 placeholder-green-600 px-4 py-3 rounded transition-[border-color,box-shadow,transform] duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_0_0_1px_rgba(74,222,128,0.35),0_0_18px_rgba(74,222,128,0.15)]"
                    />
                    {errors.email && (
                        <p
                            id="email-error"
                            className="text-red-400 text-sm mt-1 text-left"
                        >
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm text-green-300 mb-2"
                    >
                        Phone
                    </label>
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <PhoneInput
                                id="phone"
                                international
                                defaultCountry="BE"
                                countryCallingCodeEditable={false}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                placeholder="Hardline number (optional)"
                                autoComplete="tel"
                                aria-invalid={Boolean(errors.phone)}
                                aria-describedby={
                                    errors.phone ? 'phone-error' : undefined
                                }
                                className="matrix-phone-input"
                            />
                        )}
                    />
                    {errors.phone && (
                        <p
                            id="phone-error"
                            className="text-red-400 text-sm mt-1 text-left"
                        >
                            {errors.phone.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="company"
                        className="block text-sm text-green-300 mb-2"
                    >
                        Company
                    </label>
                    <input
                        id="company"
                        {...register('company')}
                        type="text"
                        placeholder="Zion Operations"
                        autoComplete="organization"
                        aria-invalid={Boolean(errors.company)}
                        aria-describedby={
                            errors.company ? 'company-error' : undefined
                        }
                        className="w-full bg-black border border-green-400/50 text-green-400 placeholder-green-600 px-4 py-3 rounded transition-[border-color,box-shadow,transform] duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_0_0_1px_rgba(74,222,128,0.35),0_0_18px_rgba(74,222,128,0.15)]"
                    />
                    {errors.company && (
                        <p
                            id="company-error"
                            className="text-red-400 text-sm mt-1 text-left"
                        >
                            {errors.company.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="linkedin"
                        className="block text-sm text-green-300 mb-2"
                    >
                        LinkedIn
                    </label>
                    <input
                        id="linkedin"
                        {...register('linkedin')}
                        type="text"
                        placeholder="linkedin.com/in/the-one"
                        autoComplete="url"
                        aria-invalid={Boolean(errors.linkedin)}
                        aria-describedby={
                            errors.linkedin ? 'linkedin-error' : undefined
                        }
                        className="w-full bg-black border border-green-400/50 text-green-400 placeholder-green-600 px-4 py-3 rounded transition-[border-color,box-shadow,transform] duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_0_0_1px_rgba(74,222,128,0.35),0_0_18px_rgba(74,222,128,0.15)]"
                    />
                    {errors.linkedin && (
                        <p
                            id="linkedin-error"
                            className="text-red-400 text-sm mt-1 text-left"
                        >
                            {errors.linkedin.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label
                    htmlFor="message"
                    className="block text-sm text-green-300 mb-2"
                >
                    Message *
                </label>
                <textarea
                    id="message"
                    {...register('message')}
                    placeholder="Drop your transmission from the Matrix..."
                    rows={6}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                        errors.message ? 'message-error' : undefined
                    }
                    className="w-full bg-black border border-green-400/50 text-green-400 placeholder-green-600 px-4 py-3 rounded resize-none transition-[border-color,box-shadow,transform] duration-200 focus:outline-none focus:border-green-400 focus:shadow-[0_0_0_1px_rgba(74,222,128,0.35),0_0_18px_rgba(74,222,128,0.15)]"
                />
                {errors.message && (
                    <p
                        id="message-error"
                        className="text-red-400 text-sm mt-1 text-left"
                    >
                        {errors.message.message}
                    </p>
                )}
            </div>

            <div className="space-y-2" aria-live="polite">
                <div className="flex justify-center">
                    {TURNSTILE_SITE_KEY ? (
                        <Turnstile
                            key={turnstileKey}
                            siteKey={TURNSTILE_SITE_KEY}
                            options={{ language: 'en' }}
                            onSuccess={(token) => {
                                setValue('turnstile', token, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                })
                            }}
                            onExpire={resetTurnstile}
                            onError={() => {
                                resetTurnstile()
                                toast.error('CAPTCHA failed', {
                                    description:
                                        'Could not complete CAPTCHA. Please try again.',
                                })
                            }}
                        />
                    ) : (
                        <p className="text-sm text-red-400">
                            Turnstile site key is not configured.
                        </p>
                    )}
                </div>
            </div>

            {errors.turnstile && (
                <p className="text-red-400 text-sm mt-1 text-left">
                    {errors.turnstile.message}
                </p>
            )}

            <div className="text-center">
                <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="bg-green-400 text-black px-8 py-3 rounded font-semibold transition-all duration-200 hover:bg-green-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(74,222,128,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                    {isSubmitting
                        ? 'Sending...'
                        : isValid
                          ? 'Send Message'
                          : 'Complete Required Fields'}
                </button>
            </div>
        </motion.form>
    )
}
