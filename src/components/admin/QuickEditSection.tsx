import type {
    FieldErrors,
    UseFormHandleSubmit,
    UseFormRegister,
} from 'react-hook-form'
import type { AdminFormValues } from '@/components/admin/editorSchemas'

interface QuickEditSectionProps {
    register: UseFormRegister<AdminFormValues>
    errors: FieldErrors<AdminFormValues>
    isSubmitting: boolean
    formStatus: string
    handleSubmit: UseFormHandleSubmit<AdminFormValues>
    onSubmit: (values: AdminFormValues) => Promise<void>
    onReset: () => void
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
    error?: string
    children: React.ReactNode
}

function Field({ label, error, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-[0.15em] text-green-600">
                {label}
            </label>
            {children}
            {error ? <p className="text-[11px] text-red-400">{error}</p> : null}
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
        <div className="rounded-xl border border-green-900/50 bg-black/30">
            <div className="border-b border-green-900/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-500">
                    {title}
                </p>
                <p className="mt-0.5 text-[11px] text-green-700">
                    {description}
                </p>
            </div>
            <div className="space-y-4 p-4">{children}</div>
        </div>
    )
}

export function QuickEditSection({
    register,
    errors,
    isSubmitting,
    formStatus,
    handleSubmit,
    onSubmit,
    onReset,
}: QuickEditSectionProps) {
    const inputClass =
        'w-full rounded-lg border border-green-900/70 bg-black/60 px-3 py-2 text-sm text-green-100 outline-none transition placeholder:text-green-900 focus:border-green-500 focus:bg-black'
    const textareaClass = `${inputClass} min-h-[100px] resize-y`
    const statusIsSuccess = formStatus.startsWith('Saved')
    const statusClass = statusIsSuccess
        ? 'border-green-800/60 bg-green-950/30 text-green-300'
        : 'border-red-900/60 bg-red-950/20 text-red-300'

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Two-column identity + contact row */}
            <div className="grid gap-4 lg:grid-cols-2">
                <FieldGroup
                    title="Identity"
                    description="Core hero text and personal summary"
                >
                    <Field label="Name" error={errors.name?.message}>
                        <input
                            id="name"
                            {...register('name')}
                            autoComplete="name"
                            placeholder="Your full name"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="Title" error={errors.title?.message}>
                        <input
                            id="title"
                            {...register('title')}
                            autoComplete="organization-title"
                            placeholder="e.g. Full-Stack Developer"
                            className={inputClass}
                        />
                    </Field>
                    <Field label="About" error={errors.about?.message}>
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

                <div className="space-y-4">
                    <FieldGroup
                        title="Contact & Availability"
                        description="Public contact details and CV link"
                    >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            <Field
                                label="Email"
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
                                label="Open-to-work label"
                                error={errors.openToWorkLabel?.message}
                            >
                                <input
                                    id="openToWorkLabel"
                                    {...register('openToWorkLabel')}
                                    autoComplete="off"
                                    placeholder="Open to opportunities"
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-green-900/50 bg-black/30 px-3 py-2.5 text-sm text-green-300 transition hover:bg-green-950/20">
                            <input
                                id="openToWork"
                                type="checkbox"
                                {...register('openToWork')}
                                autoComplete="off"
                                className="h-4 w-4 accent-green-500"
                            />
                            <span>Show open-to-work badge on portfolio</span>
                        </label>
                    </FieldGroup>
                </div>
            </div>

            {/* Repeating content row */}
            <FieldGroup
                title="Repeating Content"
                description="One value per line — drives typewriter, OG image, and about section"
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field
                        label="Hero typed lines"
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
            <div className="flex flex-col gap-3 rounded-xl border border-green-900/50 bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-green-600">
                        Changes publish directly to the live portfolio.
                    </p>
                    {formStatus ? (
                        <p
                            className={`mt-2 rounded-lg border px-3 py-2 text-sm ${statusClass}`}
                        >
                            {formStatus}
                        </p>
                    ) : null}
                </div>
                <div className="flex shrink-0 gap-2 sm:ml-4">
                    <button
                        type="button"
                        onClick={onReset}
                        disabled={isSubmitting}
                        className="rounded-xl border border-green-800/70 bg-black/30 px-4 py-2.5 text-sm text-green-300 transition hover:bg-green-900/30 disabled:opacity-60"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-500 disabled:opacity-60"
                    >
                        {isSubmitting ? <LoadingSpinner /> : <CheckIcon />}
                        {isSubmitting ? 'Saving…' : 'Save Quick Form'}
                    </button>
                </div>
            </div>
        </form>
    )
}
