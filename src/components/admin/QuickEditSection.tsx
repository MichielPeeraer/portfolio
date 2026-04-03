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

export function QuickEditSection({
    register,
    errors,
    isSubmitting,
    formStatus,
    handleSubmit,
    onSubmit,
}: QuickEditSectionProps) {
    const inputClass =
        'w-full rounded-xl border border-green-900 bg-black/70 px-3 py-2.5 text-sm outline-none transition focus:border-green-500'
    const textareaClass = `${inputClass} min-h-[120px]`
    const helperClass = 'text-xs leading-5 text-green-700'
    const statusClass = formStatus.startsWith('Saved')
        ? 'border-green-800/70 bg-green-950/30 text-green-300'
        : 'border-red-900/70 bg-red-950/20 text-red-300'

    return (
        <section className="rounded-2xl border border-green-900/70 bg-green-950/20 p-5 md:p-6">
            <div className="flex flex-col gap-3 border-b border-green-900/70 pb-4">
                <h2 className="text-xl text-green-200">Quick Edit</h2>
                <p className="text-sm leading-6 text-green-500">
                    Fast updates for identity, contact details, and homepage
                    copy blocks.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <section className="space-y-4 rounded-2xl border border-green-900/60 bg-black/25 p-4">
                        <div>
                            <h3 className="text-sm uppercase tracking-[0.24em] text-green-500">
                                Identity
                            </h3>
                            <p className={helperClass}>
                                Core hero text and personal summary.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm"
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                {...register('name')}
                                autoComplete="name"
                                className={inputClass}
                            />
                            {errors.name ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.name.message}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="title"
                                className="mb-1 block text-sm"
                            >
                                Title
                            </label>
                            <input
                                id="title"
                                {...register('title')}
                                autoComplete="organization-title"
                                className={inputClass}
                            />
                            {errors.title ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.title.message}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="about"
                                className="mb-1 block text-sm"
                            >
                                About
                            </label>
                            <textarea
                                id="about"
                                {...register('about')}
                                autoComplete="off"
                                rows={6}
                                className={textareaClass}
                            />
                            {errors.about ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.about.message}
                                </p>
                            ) : null}
                        </div>
                    </section>

                    <section className="space-y-4 rounded-2xl border border-green-900/60 bg-black/25 p-4">
                        <div>
                            <h3 className="text-sm uppercase tracking-[0.24em] text-green-500">
                                Contact And Availability
                            </h3>
                            <p className={helperClass}>
                                Public contact details and CV availability.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="contactEmail"
                                className="mb-1 block text-sm"
                            >
                                Contact Email
                            </label>
                            <input
                                id="contactEmail"
                                {...register('contactEmail')}
                                autoComplete="email"
                                className={inputClass}
                            />
                            {errors.contactEmail ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.contactEmail.message}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="contactPhone"
                                className="mb-1 block text-sm"
                            >
                                Contact Phone
                            </label>
                            <input
                                id="contactPhone"
                                {...register('contactPhone')}
                                autoComplete="tel"
                                className={inputClass}
                            />
                            {errors.contactPhone ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.contactPhone.message}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="openToWorkLabel"
                                className="mb-1 block text-sm"
                            >
                                Open To Work Label
                            </label>
                            <input
                                id="openToWorkLabel"
                                {...register('openToWorkLabel')}
                                autoComplete="off"
                                className={inputClass}
                            />
                            {errors.openToWorkLabel ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.openToWorkLabel.message}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="cvPath"
                                className="mb-1 block text-sm"
                            >
                                CV Path
                            </label>
                            <input
                                id="cvPath"
                                {...register('cvPath')}
                                autoComplete="off"
                                className={inputClass}
                            />
                            {errors.cvPath ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.cvPath.message}
                                </p>
                            ) : null}
                        </div>

                        <label className="flex items-center gap-2 rounded-xl border border-green-900/60 bg-black/30 px-3 py-3 text-sm text-green-300">
                            <input
                                id="openToWork"
                                type="checkbox"
                                {...register('openToWork')}
                                autoComplete="off"
                                className="accent-green-500"
                            />
                            Open to work badge visible
                        </label>
                    </section>
                </div>

                <section className="space-y-4 rounded-2xl border border-green-900/60 bg-black/25 p-4">
                    <div>
                        <h3 className="text-sm uppercase tracking-[0.24em] text-green-500">
                            Repeating Content
                        </h3>
                        <p className={helperClass}>
                            One item per line. These lists drive the hero and
                            SEO text blocks.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label
                                htmlFor="heroTypedLinesText"
                                className="mb-1 block text-sm"
                            >
                                Hero Typed Lines
                            </label>
                            <textarea
                                id="heroTypedLinesText"
                                {...register('heroTypedLinesText')}
                                autoComplete="off"
                                rows={8}
                                className={textareaClass}
                            />
                            {errors.heroTypedLinesText ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.heroTypedLinesText.message}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="ogTechPillsText"
                                className="mb-1 block text-sm"
                            >
                                OG Tech Pills
                            </label>
                            <textarea
                                id="ogTechPillsText"
                                {...register('ogTechPillsText')}
                                autoComplete="off"
                                rows={8}
                                className={textareaClass}
                            />
                            {errors.ogTechPillsText ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.ogTechPillsText.message}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label
                                htmlFor="devPracticesText"
                                className="mb-1 block text-sm"
                            >
                                Dev Practices
                            </label>
                            <textarea
                                id="devPracticesText"
                                {...register('devPracticesText')}
                                autoComplete="off"
                                rows={8}
                                className={textareaClass}
                            />
                            {errors.devPracticesText ? (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.devPracticesText.message}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </section>

                <div className="flex flex-col gap-3 rounded-2xl border border-green-900/60 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm text-green-300">
                            Quick changes save directly to the live portfolio.
                        </p>
                        {formStatus ? (
                            <p
                                className={`rounded-lg border px-3 py-2 text-sm ${statusClass}`}
                            >
                                {formStatus}
                            </p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-black transition hover:bg-green-500 disabled:opacity-60 sm:ml-3"
                    >
                        {isSubmitting ? <LoadingSpinner /> : <CheckIcon />}
                        {isSubmitting ? 'Saving...' : 'Save Quick Form'}
                    </button>
                </div>
            </form>
        </section>
    )
}
