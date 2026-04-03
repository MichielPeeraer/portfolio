'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { track } from '@vercel/analytics'
import { Controller, type FieldErrors, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Loader2, ShieldCheck } from 'lucide-react'
import { useContactSubmission } from '@/hooks'
import type { ContactFormValues } from '@/types'
import { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

z.config({ jitless: true })

const PhoneInput = dynamic(() => import('react-phone-number-input'), {
    ssr: false,
})

const MAX_MESSAGE_LENGTH = 5000

const contactSchema = z.object({
    firstname: z.string().trim().min(1, '* Required'),
    lastname: z.string().trim().min(1, '* Required'),
    email: z.email('* Not a valid email address'),
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
    message: z
        .string()
        .trim()
        .min(1, '* Required')
        .max(MAX_MESSAGE_LENGTH, `* Max ${MAX_MESSAGE_LENGTH} characters`),
    website: z.string().optional(),
})

export default function ContactForm() {
    const {
        register,
        control,
        handleSubmit,
        setFocus,
        formState: { errors, isDirty, isValid },
        reset,
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        mode: 'onChange',
        defaultValues: {
            phone: '',
            website: '',
        },
    })

    const { isSubmitting, formError, markFormStarted, setFormError, submit } =
        useContactSubmission({ reset })

    useEffect(() => {
        markFormStarted(isDirty)
    }, [isDirty, markFormStarted])

    const onInvalidSubmit = (formErrors: FieldErrors<ContactFormValues>) => {
        const fieldOrder: Array<keyof ContactFormValues> = [
            'firstname',
            'lastname',
            'email',
            'phone',
            'company',
            'linkedin',
            'message',
        ]

        const firstInvalidField = fieldOrder.find((key) =>
            Boolean(formErrors[key])
        )

        if (firstInvalidField) {
            setFocus(firstInvalidField)
        }

        setFormError('* Please fix the highlighted fields and try again.')
        track('contact_form_validation_failed', {
            field: firstInvalidField ?? 'unknown',
        })
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit(submit, onInvalidSubmit)}
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
                                name={field.name}
                                international
                                defaultCountry="BE"
                                countryCallingCodeEditable={false}
                                countrySelectProps={{
                                    id: 'phone-country',
                                    name: 'phoneCountry',
                                }}
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

            <div className="flex flex-col items-center gap-2 text-center">
                <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="min-w-62 bg-green-400 text-black px-8 py-3 rounded font-semibold transition-all duration-200 hover:bg-green-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(74,222,128,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                    {isSubmitting ? (
                        <span className="inline-flex items-center justify-center gap-2">
                            <Loader2
                                className="h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                            <span>Sending Secure Message...</span>
                        </span>
                    ) : isValid ? (
                        'Send Secure Message'
                    ) : (
                        'Complete Required Fields'
                    )}
                </button>
                <div className="inline-flex items-center gap-2 rounded-full border border-green-300/35 bg-[linear-gradient(135deg,rgba(74,222,128,0.16),rgba(74,222,128,0.06))] px-3.5 py-1.5 text-[10px] font-medium tracking-[0.08em] text-green-100/90 shadow-[0_0_0_1px_rgba(74,222,128,0.12),0_0_10px_rgba(74,222,128,0.12)]">
                    <ShieldCheck
                        className="h-3.5 w-3.5 text-green-200/90"
                        aria-hidden="true"
                    />
                    <span>Protected by Vercel BotID</span>
                </div>
            </div>
        </motion.form>
    )
}
