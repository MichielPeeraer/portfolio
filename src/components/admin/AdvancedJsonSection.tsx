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
    return (
        <section className="border border-green-900/70 bg-green-950/20 rounded-lg p-4 space-y-3">
            <h2 className="text-lg text-green-300">Advanced JSON Editor</h2>
            <p className="text-sm text-green-600">
                Full-content editing with client-side schema validation.
            </p>

            <textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="w-full h-[55vh] bg-black border border-green-900 rounded p-3 text-sm outline-none focus:border-green-500"
                spellCheck={false}
            />

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={save}
                    disabled={isSaving}
                    className="rounded bg-green-700 text-black font-semibold px-4 py-2 hover:bg-green-500 disabled:opacity-60"
                >
                    {isSaving ? 'Saving...' : 'Save JSON'}
                </button>
                {rawStatus ? (
                    <p className="text-sm text-green-300">{rawStatus}</p>
                ) : null}
            </div>

            {rawIssues.length > 0 ? (
                <div className="border border-red-900/70 bg-red-950/20 rounded p-3">
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
