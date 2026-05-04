import type {
    FieldErrors,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormWatch,
    UseFormSetValue,
} from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { AdminFormValues } from '@/components/admin/editorSchemas'

interface QuickEditSectionProps {
    register: UseFormRegister<AdminFormValues>
    errors: FieldErrors<AdminFormValues>
    isSubmitting: boolean
    handleSubmit: UseFormHandleSubmit<AdminFormValues>
    onSubmit: (values: AdminFormValues) => Promise<void>
    watch: UseFormWatch<AdminFormValues>
    setValue: UseFormSetValue<AdminFormValues>
}

function LoadingSpinner() {
    return (
        <svg
            className="inline-block h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
            />
        </svg>
    )
}

interface FieldProps {
    label: string
    htmlFor: string
    error?: string
    children: React.ReactNode
}

function Field({ label, htmlFor, error, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-1 sm:gap-1.5">
            <label
                htmlFor={htmlFor}
                className="text-[9px] font-medium uppercase tracking-[0.15em] text-green-600 sm:text-[10px] sm:tracking-[0.2em]"
            >
                {label}
            </label>
            {children}
            {error ? (
                <p className="text-[10px] text-red-400 sm:text-[11px]">
                    {error}
                </p>
            ) : null}
        </div>
    )
}

interface FieldGroupProps {
    title: string
    description: string
    children: React.ReactNode
}

function FieldGroup({ title, description, children }: FieldGroupProps) {
    return (
        <div className="rounded-lg border border-green-900/50 bg-black/30 sm:rounded-xl">
            <div className="border-b border-green-900/40 px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-green-500 sm:text-xs">
                    {title}
                </p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-green-700 sm:text-xs sm:leading-normal">
                    {description}
                </p>
            </div>
            <div className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-5 lg:p-6">
                {children}
            </div>
        </div>
    )
}

export function QuickEditSection({
    register,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    watch,
    setValue,
}: QuickEditSectionProps) {
    const status = watch('status')
    const profileImageUrl = watch('profileImageUrl')
    const profileImageCurrentPathname = watch('profileImageCurrentPathname')
    const profileImagePendingPathnames = watch('profileImagePendingPathnames')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const pendingPathnamesRef = useRef<string[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const parsePendingPathnames = (value: string | undefined) => {
        if (!value) {
            return [] as string[]
        }

        try {
            const parsed = JSON.parse(value)
            if (!Array.isArray(parsed)) {
                return [] as string[]
            }

            return parsed.filter(
                (item): item is string => typeof item === 'string'
            )
        } catch {
            return [] as string[]
        }
    }

    const deletePendingBlobs = async (
        pathnames: string[],
        keepalive = false
    ) => {
        if (!pathnames.length) {
            return
        }

        try {
            await fetch('/api/admin/upload', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pathnames }),
                keepalive,
            })
        } catch (error) {
            console.error('[profile-upload] pending cleanup failed:', error)
        }
    }

    useEffect(() => {
        pendingPathnamesRef.current = parsePendingPathnames(
            profileImagePendingPathnames
        )
    }, [profileImagePendingPathnames])

    useEffect(() => {
        const handleBeforeUnload = () => {
            const pending = pendingPathnamesRef.current
            if (!pending.length) {
                return
            }

            void deletePendingBlobs(pending, true)
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            const pending = pendingPathnamesRef.current
            void deletePendingBlobs(pending)
        }
    }, [])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const pendingPathnames = parsePendingPathnames(
            profileImagePendingPathnames
        )

        const formData = new FormData()
        formData.append('file', file)

        setIsUploading(true)
        try {
            if (profileImageCurrentPathname) {
                await deletePendingBlobs([profileImageCurrentPathname])
            }

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            })
            const json = (await res.json()) as {
                url?: string
                pathname?: string
                error?: string
            }
            if (!res.ok || !json.url || !json.pathname) {
                throw new Error(json.error ?? 'Upload failed')
            }

            const nextPendingPathnames = Array.from(
                new Set([
                    ...pendingPathnames.filter(
                        (pathname) => pathname !== profileImageCurrentPathname
                    ),
                    json.pathname,
                ])
            )

            setValue('profileImageUrl', json.url, { shouldDirty: true })
            setValue('profileImageCurrentPathname', json.pathname, {
                shouldDirty: true,
            })
            setValue(
                'profileImagePendingPathnames',
                JSON.stringify(nextPendingPathnames),
                { shouldDirty: true }
            )
        } catch (err) {
            console.error('[profile-upload]', err)
        } finally {
            setIsUploading(false)
            // Reset so the same file can be re-selected if needed
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const inputClass =
        'w-full rounded-lg border border-green-900/70 bg-black/60 px-2.5 py-2 text-xs sm:px-3 sm:py-2.5 sm:text-sm text-green-100 outline-none transition placeholder:text-green-900 focus:border-green-500 focus:bg-black'
    const textareaClass = `${inputClass} min-h-[100px] sm:min-h-[120px] resize-y`

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4 md:space-y-5"
        >
            {/* Two-column identity + contact row */}
            <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 md:gap-5">
                <FieldGroup
                    title="Identity"
                    description="Core hero text and personal summary"
                >
                    {/* Profile image upload */}
                    <Field
                        label="Profile Photo"
                        htmlFor="profileImageUpload"
                        error={errors.profileImageUrl?.message}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-green-900/70">
                                <Image
                                    src={profileImageUrl || '/profile.jpg'}
                                    alt="Profile preview"
                                    fill
                                    className="object-cover grayscale"
                                    unoptimized={!profileImageUrl}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 min-w-0">
                                <input
                                    ref={fileInputRef}
                                    id="profileImageUpload"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={isUploading}
                                    className="rounded-lg border border-green-900/70 bg-black/60 px-3 py-2 text-xs text-green-300 transition hover:border-green-500 hover:bg-black disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <>
                                            <LoadingSpinner /> Uploading…
                                        </>
                                    ) : (
                                        'Choose image…'
                                    )}
                                </button>
                                <p className="text-[10px] text-green-700 sm:text-[11px]">
                                    JPEG, PNG or WebP · max 2 MB
                                </p>
                            </div>
                        </div>
                        {/* Hidden field so the URL is part of the form */}
                        <input type="hidden" {...register('profileImageUrl')} />
                        <input
                            type="hidden"
                            {...register('profileImageCurrentPathname')}
                        />
                        <input
                            type="hidden"
                            {...register('profileImagePendingPathnames')}
                        />
                    </Field>
                    <Field
                        label="Name"
                        htmlFor="name"
                        error={errors.name?.message}
                    >
                        <input
                            id="name"
                            {...register('name')}
                            autoComplete="name"
                            placeholder="Your full name"
                            className={inputClass}
                        />
                    </Field>
                    <Field
                        label="Title"
                        htmlFor="title"
                        error={errors.title?.message}
                    >
                        <input
                            id="title"
                            {...register('title')}
                            autoComplete="organization-title"
                            placeholder="e.g. Full-Stack Developer"
                            className={inputClass}
                        />
                    </Field>
                    <Field
                        label="About"
                        htmlFor="about"
                        error={errors.about?.message}
                    >
                        <textarea
                            id="about"
                            {...register('about')}
                            autoComplete="off"
                            rows={6}
                            placeholder="Short bio shown in the about section"
                            className={textareaClass}
                        />
                    </Field>
                </FieldGroup>

                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    <FieldGroup
                        title="Contact & Availability"
                        description="Public contact details and CV link"
                    >
                        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-1 xl:grid-cols-2">
                            <Field
                                label="Email"
                                htmlFor="contactEmail"
                                error={errors.contactEmail?.message}
                            >
                                <input
                                    id="contactEmail"
                                    {...register('contactEmail')}
                                    autoComplete="email"
                                    placeholder="contact@example.com"
                                    className={inputClass}
                                />
                            </Field>
                            <Field
                                label="Phone"
                                htmlFor="contactPhone"
                                error={errors.contactPhone?.message}
                            >
                                <input
                                    id="contactPhone"
                                    {...register('contactPhone')}
                                    autoComplete="tel"
                                    placeholder="+32 ..."
                                    className={inputClass}
                                />
                            </Field>
                            <Field
                                label="GitHub URL"
                                htmlFor="githubUrl"
                                error={errors.githubUrl?.message}
                            >
                                <input
                                    id="githubUrl"
                                    {...register('githubUrl')}
                                    autoComplete="url"
                                    placeholder="https://github.com/..."
                                    className={inputClass}
                                />
                            </Field>
                            <Field
                                label="LinkedIn URL"
                                htmlFor="linkedinUrl"
                                error={errors.linkedinUrl?.message}
                            >
                                <input
                                    id="linkedinUrl"
                                    {...register('linkedinUrl')}
                                    autoComplete="url"
                                    placeholder="https://linkedin.com/in/..."
                                    className={inputClass}
                                />
                            </Field>
                            <Field
                                label="CV URL / Path"
                                htmlFor="cvPath"
                                error={errors.cvPath?.message}
                            >
                                <input
                                    id="cvPath"
                                    {...register('cvPath')}
                                    autoComplete="off"
                                    placeholder="https://docs.google.com/... or /CV_Name.pdf"
                                    className={inputClass}
                                />
                            </Field>
                            <Field
                                label="Status text"
                                htmlFor="statusLabel"
                                error={errors.statusLabel?.message}
                            >
                                <input
                                    id="statusLabel"
                                    {...register('statusLabel')}
                                    autoComplete="off"
                                    placeholder="Open to opportunities"
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                        <label className="flex cursor-pointer items-center gap-2 sm:gap-3 rounded-lg border border-green-900/50 bg-black/30 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-green-300 transition hover:bg-green-950/20">
                            <input
                                id="status"
                                type="checkbox"
                                checked={status}
                                onChange={(e) =>
                                    setValue('status', e.target.checked, {
                                        shouldDirty: true,
                                    })
                                }
                                autoComplete="off"
                                className="h-4 w-4 accent-green-500"
                            />
                            <span>Show status badge on portfolio</span>
                        </label>
                    </FieldGroup>
                </div>
            </div>

            {/* Repeating content row */}
            <FieldGroup
                title="Repeating Content"
                description="One value per line — drives typewriter, OG image, and about section"
            >
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
                    <Field
                        label="Hero typed lines"
                        htmlFor="heroTypedLinesText"
                        error={errors.heroTypedLinesText?.message}
                    >
                        <textarea
                            id="heroTypedLinesText"
                            {...register('heroTypedLinesText')}
                            autoComplete="off"
                            rows={8}
                            placeholder="One line per entry"
                            className={textareaClass}
                        />
                    </Field>
                    <Field
                        label="OG tech pills"
                        htmlFor="ogTechPillsText"
                        error={errors.ogTechPillsText?.message}
                    >
                        <textarea
                            id="ogTechPillsText"
                            {...register('ogTechPillsText')}
                            autoComplete="off"
                            rows={8}
                            placeholder="One pill per line"
                            className={textareaClass}
                        />
                    </Field>
                    <Field
                        label="Dev practices"
                        htmlFor="devPracticesText"
                        error={errors.devPracticesText?.message}
                    >
                        <textarea
                            id="devPracticesText"
                            {...register('devPracticesText')}
                            autoComplete="off"
                            rows={8}
                            placeholder="One practice per line"
                            className={textareaClass}
                        />
                    </Field>
                </div>
            </FieldGroup>

            {/* Save bar */}
            <div className="flex flex-col gap-3 rounded-lg border border-green-900/50 bg-black/30 p-3 sm:rounded-xl sm:gap-4 sm:p-4 md:flex-row md:items-center md:justify-between md:p-5 md:gap-5 lg:rounded-2xl lg:p-6">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-green-600 sm:text-xs">
                        Changes publish directly to the live portfolio.
                    </p>
                </div>
                <div className="flex shrink-0 w-full gap-2 sm:w-auto md:ml-4 sm:gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-green-700 px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-black transition hover:bg-green-500 disabled:opacity-60"
                    >
                        {isSubmitting ? <LoadingSpinner /> : <CheckIcon />}
                        {isSubmitting ? 'Saving…' : 'Save Quick Form'}
                    </button>
                </div>
            </div>
        </form>
    )
}
