'use client'

import { useState } from 'react'
import { QuickEditSection } from '@/components/admin/QuickEditSection'
import { SectionsEditorSection } from '@/components/admin/SectionsEditorSection'
import { usePortfolioEditorState } from '@/components/admin/usePortfolioEditorState'
import type { PortfolioData } from '@/types'

interface PortfolioEditorProps {
    initialData: PortfolioData
    initialVersion?: number
}

interface PanelProps {
    index: number
    label: string
    badge?: string
    statusBadge?: string
    open: boolean
    onToggle: () => void
    children: React.ReactNode
    danger?: boolean
}

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            className={`h-4 w-4 shrink-0 text-green-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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

function Panel({
    index,
    label,
    badge,
    statusBadge,
    open,
    onToggle,
    children,
    danger,
}: PanelProps) {
    const borderColor = danger ? 'border-red-900/60' : 'border-green-900/60'
    const accentColor = danger ? 'text-red-400' : 'text-green-400'
    const badgeBg = danger
        ? 'border-red-900/70 bg-red-950/30 text-red-400'
        : 'border-green-900/70 bg-green-950/30 text-green-500'
    const hoverBg = danger ? 'hover:bg-red-950/20' : 'hover:bg-green-950/10'

    return (
        <section
            className={`rounded-2xl border ${borderColor} bg-black/25 overflow-hidden transition`}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
                className={`group flex w-full items-center gap-3 px-4 py-3 text-left transition sm:gap-4 sm:px-5 sm:py-4 md:px-6 md:py-5 ${hoverBg}`}
            >
                <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold tracking-wider ${badgeBg}`}
                >
                    {index}
                </span>
                <span
                    className={`flex-1 text-xs font-medium uppercase tracking-[0.2em] sm:text-sm md:tracking-[0.25em] ${accentColor}`}
                >
                    {label}
                </span>
                {badge ? (
                    <span className="hidden rounded-full border border-green-900/60 bg-black/40 px-2 py-0.5 text-[9px] uppercase tracking-wider text-green-600 sm:px-2.5 sm:py-0.5 sm:text-[10px] md:inline-block">
                        {badge}
                    </span>
                ) : null}
                {statusBadge ? (
                    <span className="hidden rounded-full border border-amber-800/70 bg-amber-950/30 px-2 py-0.5 text-[9px] uppercase tracking-wider text-amber-300 sm:px-2.5 sm:py-0.5 sm:text-[10px] md:inline-block">
                        {statusBadge}
                    </span>
                ) : null}
                <ChevronIcon open={open} />
            </button>
            {open ? (
                <div className="border-t border-green-900/40 p-4 sm:p-5 md:p-6 lg:p-7">
                    {children}
                </div>
            ) : null}
        </section>
    )
}

export function PortfolioEditor({
    initialData,
    initialVersion = 0,
}: PortfolioEditorProps) {
    const [quickEditOpen, setQuickEditOpen] = useState(true)
    const [sectionsOpen, setSectionsOpen] = useState(true)

    const {
        register,
        handleSubmit,
        watch,
        setFormValue,
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
        resetQuickForm,
        resetSections,
        isQuickFormDirty,
        isSectionsDirty,
    } = usePortfolioEditorState(initialData, initialVersion)

    return (
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <Panel
                index={1}
                label="Quick Edit"
                badge="Identity & contact"
                statusBadge={isQuickFormDirty ? 'Unsaved' : undefined}
                open={quickEditOpen}
                onToggle={() => setQuickEditOpen((o) => !o)}
            >
                <QuickEditSection
                    register={register}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    formStatus={formStatus}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmitForm}
                    onReset={resetQuickForm}
                    watch={watch}
                    setValue={setFormValue}
                />
            </Panel>

            <Panel
                index={2}
                label="Sections Editor"
                badge="Experience, education & skills"
                statusBadge={isSectionsDirty ? 'Unsaved' : undefined}
                open={sectionsOpen}
                onToggle={() => setSectionsOpen((o) => !o)}
            >
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
                    onReset={resetSections}
                />
            </Panel>
        </div>
    )
}
