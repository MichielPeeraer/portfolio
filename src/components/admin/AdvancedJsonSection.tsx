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

interface AdvancedJsonSectionProps {
    value: string
    setValue: (next: string) => void
    save: () => Promise<void>
    isSaving: boolean
    rawStatus: string
    rawIssues: string[]
}

export function AdvancedJsonSection({
    value,
    setValue,
    save,
    isSaving,
    rawStatus,
    rawIssues,
}: AdvancedJsonSectionProps) {
    const statusClass = rawStatus.startsWith('Saved')
        ? 'border-green-800/70 bg-green-950/30 text-green-300'
        : 'border-red-900/70 bg-red-950/20 text-red-300'

    return (
        <section className="rounded-2xl border border-green-900/70 bg-green-950/20 p-5 md:p-6">
            <div className="flex flex-col gap-3 border-b border-green-900/70 pb-4">
                <h2 className="text-xl text-green-200">Advanced JSON Editor</h2>
                <p className="text-sm leading-6 text-green-500">
                    Full-record editing for bulk changes. Save only after the
                    structured editors are too limiting.
                </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="portfolio-json"
                        className="text-sm font-medium text-green-300"
                    >
                        Portfolio JSON
                    </label>
                    <textarea
                        id="portfolio-json"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        className="h-[50vh] min-h-75 w-full rounded-2xl border border-green-900 bg-black/80 p-4 text-sm outline-none transition focus:border-green-500 sm:h-[55vh]"
                        spellCheck={false}
                    />
                </div>

                <aside className="space-y-4 rounded-2xl border border-green-900/60 bg-black/25 p-4 lg:max-h-[calc(50vh+44px)] lg:overflow-y-auto lg:sm:h-[55vh]">
                    <div>
                        <h3 className="text-sm uppercase tracking-[0.24em] text-green-500">
                            Safe Use
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs leading-5 text-green-600">
                            <li>Keep the JSON structure intact.</li>
                            <li>Use arrays for repeated text values.</li>
                            <li>Skill icons stay in label|icon format.</li>
                        </ul>
                    </div>

                    {rawStatus ? (
                        <p
                            className={`rounded-lg border px-3 py-2 text-sm ${statusClass}`}
                        >
                            {rawStatus}
                        </p>
                    ) : null}

                    <button
                        type="button"
                        onClick={save}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-black transition hover:bg-green-500 disabled:opacity-60"
                    >
                        {isSaving ? <LoadingSpinner /> : <CheckIcon />}
                        {isSaving ? 'Saving...' : 'Save JSON'}
                    </button>
                </aside>
            </div>

            {rawIssues.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-red-900/70 bg-red-950/20 p-4">
                    <p className="text-sm text-red-300 mb-2">
                        Validation issues:
                    </p>
                    <ul className="text-xs text-red-300 space-y-1 max-h-48 overflow-auto">
                        {rawIssues.map((issue) => (
                            <li key={issue}>{issue}</li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </section>
    )
}
