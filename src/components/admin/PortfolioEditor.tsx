'use client'

import { useState } from 'react'
import { AdvancedJsonSection } from '@/components/admin/AdvancedJsonSection'
import { QuickEditSection } from '@/components/admin/QuickEditSection'
import { SectionsEditorSection } from '@/components/admin/SectionsEditorSection'
import { usePortfolioEditorState } from '@/components/admin/usePortfolioEditorState'
import type { PortfolioData } from '@/types'

interface PortfolioEditorProps {
    initialData: PortfolioData
}

function ToggleArrowIcon({ open }: { open: boolean }) {
    return (
        <svg
            className={`h-4 w-4 text-green-500 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    )
}

export function PortfolioEditor({ initialData }: PortfolioEditorProps) {
    const [quickEditOpen, setQuickEditOpen] = useState(true)
    const [sectionsOpen, setSectionsOpen] = useState(true)
    const [jsonOpen, setJsonOpen] = useState(false)

    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        formStatus,
        onSubmitForm,
        sectionsDraft,
        setSectionsDraft,
        updateExperienceField,
        updateEducationField,
        updateSkillCategoryField,
        saveSections,
        isSavingSections,
        sectionsStatus,
        sectionIssues,
        value,
        setValue,
        saveJson,
        isSaving,
        rawStatus,
        rawIssues,
    } = usePortfolioEditorState(initialData)

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-green-900/70 bg-black/20 p-3">
                <button
                    type="button"
                    onClick={() => setQuickEditOpen((open) => !open)}
                    aria-expanded={quickEditOpen}
                    aria-label={
                        quickEditOpen
                            ? 'Collapse quick edit'
                            : 'Expand quick edit'
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-green-900/60 bg-black/30 px-4 py-3 text-left text-sm text-green-200 transition hover:bg-green-900/20"
                >
                    <span className="uppercase tracking-[0.18em]">
                        Quick Edit
                    </span>
                    <ToggleArrowIcon open={quickEditOpen} />
                </button>
                {quickEditOpen ? (
                    <div className="mt-3">
                        <QuickEditSection
                            register={register}
                            errors={errors}
                            isSubmitting={isSubmitting}
                            formStatus={formStatus}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmitForm}
                        />
                    </div>
                ) : null}
            </section>

            <section className="rounded-2xl border border-green-900/70 bg-black/20 p-3">
                <button
                    type="button"
                    onClick={() => setSectionsOpen((open) => !open)}
                    aria-expanded={sectionsOpen}
                    aria-label={
                        sectionsOpen
                            ? 'Collapse sections editor'
                            : 'Expand sections editor'
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-green-900/60 bg-black/30 px-4 py-3 text-left text-sm text-green-200 transition hover:bg-green-900/20"
                >
                    <span className="uppercase tracking-[0.18em]">
                        Sections Editor
                    </span>
                    <ToggleArrowIcon open={sectionsOpen} />
                </button>
                {sectionsOpen ? (
                    <div className="mt-3">
                        <SectionsEditorSection
                            sectionsDraft={sectionsDraft}
                            setSectionsDraft={setSectionsDraft}
                            updateExperienceField={updateExperienceField}
                            updateEducationField={updateEducationField}
                            updateSkillCategoryField={updateSkillCategoryField}
                            saveSections={saveSections}
                            isSavingSections={isSavingSections}
                            sectionsStatus={sectionsStatus}
                            sectionIssues={sectionIssues}
                        />
                    </div>
                ) : null}
            </section>

            <section className="rounded-2xl border border-green-900/70 bg-black/20 p-3">
                <button
                    type="button"
                    onClick={() => setJsonOpen((open) => !open)}
                    aria-expanded={jsonOpen}
                    aria-label={
                        jsonOpen
                            ? 'Collapse advanced JSON'
                            : 'Expand advanced JSON'
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-green-900/60 bg-black/30 px-4 py-3 text-left text-sm text-green-200 transition hover:bg-green-900/20"
                >
                    <span className="uppercase tracking-[0.18em]">
                        Advanced JSON
                    </span>
                    <ToggleArrowIcon open={jsonOpen} />
                </button>
                {jsonOpen ? (
                    <div className="mt-3">
                        <AdvancedJsonSection
                            value={value}
                            setValue={setValue}
                            save={saveJson}
                            isSaving={isSaving}
                            rawStatus={rawStatus}
                            rawIssues={rawIssues}
                        />
                    </div>
                ) : null}
            </section>
        </div>
    )
}
