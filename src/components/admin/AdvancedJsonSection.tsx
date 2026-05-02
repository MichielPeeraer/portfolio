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
    const statusIsSuccess = rawStatus.startsWith('Saved')
    const statusClass = statusIsSuccess
        ? 'border-green-800/60 bg-green-950/30 text-green-300'
        : 'border-red-900/60 bg-red-950/20 text-red-300'

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
            {/* Editor column */}
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="portfolio-json"
                    className="text-[11px] font-medium uppercase tracking-[0.15em] text-green-600"
                >
                    Portfolio JSON
                </label>
                <textarea
                    id="portfolio-json"
                    name="portfolioJson"
                    autoComplete="off"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    className="h-[50vh] min-h-75 w-full rounded-xl border border-green-900/70 bg-black/70 p-4 font-mono text-sm text-green-100 outline-none transition focus:border-green-500 focus:bg-black sm:h-[55vh]"
                    spellCheck={false}
                />
            </div>

            {/* Sidebar column */}
            <aside className="flex flex-col gap-4 rounded-xl border border-amber-900/40 bg-black/30 p-4 lg:max-h-[calc(55vh+32px)] lg:self-start lg:overflow-y-auto">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-600">
                        Safe use
                    </p>
                    <ul className="mt-3 space-y-2 text-[11px] leading-5 text-green-600">
                        <li>Keep the JSON structure intact.</li>
                        <li>Use arrays for repeated text values.</li>
                        <li>Skill icons stay in label|icon format.</li>
                    </ul>
                </div>

                <div className="border-t border-amber-900/30 pt-4">
                    <p className="text-[11px] text-amber-700/80">
                        Only use this editor when the structured forms above are
                        too limiting.
                    </p>
                </div>

                {rawStatus ? (
                    <p
                        className={`rounded-lg border px-3 py-2 text-sm ${statusClass}`}
                    >
                        {rawStatus}
                    </p>
                ) : null}

                <div className="grid gap-2">
                    <button
                        type="button"
                        onClick={save}
                        disabled={isSaving}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-600 disabled:opacity-60"
                    >
                        {isSaving ? <LoadingSpinner /> : <CheckIcon />}
                        {isSaving ? 'Saving…' : 'Save JSON'}
                    </button>
                </div>
            </aside>

            {rawIssues.length > 0 ? (
                <div className="rounded-xl border border-red-900/60 bg-red-950/20 p-4 lg:col-span-2">
                    <p className="mb-2 text-sm text-red-300">
                        Validation issues:
                    </p>
                    <ul className="max-h-48 space-y-1 overflow-auto text-xs text-red-300">
                        {rawIssues.map((issue) => (
                            <li key={issue}>{issue}</li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    )
}
