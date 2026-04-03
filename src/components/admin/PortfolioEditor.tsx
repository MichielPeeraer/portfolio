'use client'

import { AdvancedJsonSection } from '@/components/admin/AdvancedJsonSection'
import { QuickEditSection } from '@/components/admin/QuickEditSection'
import { SectionsEditorSection } from '@/components/admin/SectionsEditorSection'
import { usePortfolioEditorState } from '@/components/admin/usePortfolioEditorState'
import type { PortfolioData } from '@/types'

interface PortfolioEditorProps {
    initialData: PortfolioData
}

export function PortfolioEditor({ initialData }: PortfolioEditorProps) {
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
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] items-start">
            <div className="space-y-6 xl:sticky xl:top-6">
                <QuickEditSection
                    register={register}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    formStatus={formStatus}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmitForm}
                />
            </div>

            <div className="space-y-6">
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

                <AdvancedJsonSection
                    value={value}
                    setValue={setValue}
                    save={saveJson}
                    isSaving={isSaving}
                    rawStatus={rawStatus}
                    rawIssues={rawIssues}
                />
            </div>
        </div>
    )
}
