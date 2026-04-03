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
                    className="flex w-full items-center justify-between rounded-xl border border-green-900/60 bg-black/30 px-4 py-3 text-left text-sm text-green-200 transition hover:bg-green-900/20"
                >
                    <span className="uppercase tracking-[0.18em]">
                        Quick Edit
                    </span>
                    <span className="text-green-500">
                        {quickEditOpen ? 'Collapse' : 'Expand'}
                    </span>
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
                    className="flex w-full items-center justify-between rounded-xl border border-green-900/60 bg-black/30 px-4 py-3 text-left text-sm text-green-200 transition hover:bg-green-900/20"
                >
                    <span className="uppercase tracking-[0.18em]">
                        Sections Editor
                    </span>
                    <span className="text-green-500">
                        {sectionsOpen ? 'Collapse' : 'Expand'}
                    </span>
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
                    className="flex w-full items-center justify-between rounded-xl border border-green-900/60 bg-black/30 px-4 py-3 text-left text-sm text-green-200 transition hover:bg-green-900/20"
                >
                    <span className="uppercase tracking-[0.18em]">
                        Advanced JSON
                    </span>
                    <span className="text-green-500">
                        {jsonOpen ? 'Collapse' : 'Expand'}
                    </span>
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
