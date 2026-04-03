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
        <div className="space-y-6">
            <QuickEditSection
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                formStatus={formStatus}
                handleSubmit={handleSubmit}
                onSubmit={onSubmitForm}
            />

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
    )
}
