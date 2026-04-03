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

export function QuickEditSection({
    register,
    errors,
    isSubmitting,
    formStatus,
    handleSubmit,
    onSubmit,
}: QuickEditSectionProps) {
    return (
        <section className="border border-green-900/70 bg-green-950/20 rounded-lg p-4 space-y-4">
            <h2 className="text-lg text-green-300">Quick Edit Form</h2>
            <p className="text-sm text-green-600">
                These fields validate before saving.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            {...register('name')}
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                        {errors.name ? (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.name.message}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm mb-1">
                            Title
                        </label>
                        <input
                            id="title"
                            {...register('title')}
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                        {errors.title ? (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.title.message}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div>
                    <label htmlFor="about" className="block text-sm mb-1">
                        About
                    </label>
                    <textarea
                        id="about"
                        {...register('about')}
                        rows={5}
                        className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                    />
                    {errors.about ? (
                        <p className="text-xs text-red-400 mt-1">
                            {errors.about.message}
                        </p>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="contactEmail"
                            className="block text-sm mb-1"
                        >
                            Contact Email
                        </label>
                        <input
                            id="contactEmail"
                            {...register('contactEmail')}
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                        {errors.contactEmail ? (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.contactEmail.message}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <label
                            htmlFor="contactPhone"
                            className="block text-sm mb-1"
                        >
                            Contact Phone
                        </label>
                        <input
                            id="contactPhone"
                            {...register('contactPhone')}
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                        {errors.contactPhone ? (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.contactPhone.message}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="openToWorkLabel"
                            className="block text-sm mb-1"
                        >
                            Open To Work Label
                        </label>
                        <input
                            id="openToWorkLabel"
                            {...register('openToWorkLabel')}
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                        {errors.openToWorkLabel ? (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.openToWorkLabel.message}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="cvPath" className="block text-sm mb-1">
                            CV Path
                        </label>
                        <input
                            id="cvPath"
                            {...register('cvPath')}
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                        {errors.cvPath ? (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.cvPath.message}
                            </p>
                        ) : null}
                    </div>
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        {...register('openToWork')}
                        className="accent-green-500"
                    />
                    Open to work
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label
                            htmlFor="heroTypedLinesText"
                            className="block text-sm mb-1"
                        >
                            Hero Typed Lines (one per line)
                        </label>
                        <textarea
                            id="heroTypedLinesText"
                            {...register('heroTypedLinesText')}
                            rows={6}
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                        {errors.heroTypedLinesText ? (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.heroTypedLinesText.message}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <label
                            htmlFor="ogTechPillsText"
                            className="block text-sm mb-1"
                        >
                            OG Tech Pills (one per line)
                        </label>
                        <textarea
                            id="ogTechPillsText"
                            {...register('ogTechPillsText')}
                            rows={6}
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                        {errors.ogTechPillsText ? (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.ogTechPillsText.message}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <label
                            htmlFor="devPracticesText"
                            className="block text-sm mb-1"
                        >
                            Dev Practices (one per line)
                        </label>
                        <textarea
                            id="devPracticesText"
                            {...register('devPracticesText')}
                            rows={6}
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 outline-none focus:border-green-500"
                        />
                        {errors.devPracticesText ? (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.devPracticesText.message}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded bg-green-700 text-black font-semibold px-4 py-2 hover:bg-green-500 disabled:opacity-60"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Quick Form'}
                    </button>
                    {formStatus ? (
                        <p className="text-sm text-green-300">{formStatus}</p>
                    ) : null}
                </div>
            </form>
        </section>
    )
}
