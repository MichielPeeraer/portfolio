'use client'

import { useEffect, useState, type SetStateAction } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    adminFormSchema,
    buildAdminFormDefaults,
    buildSectionsDraft,
    fromMultiline,
    getRawIssues,
    parseSkillLine,
    sectionsFormSchema,
    type AdminFormValues,
    type SectionsFormValues,
} from '@/components/admin/editorSchemas'
import { portfolioSchema } from '@/lib/portfolio-schema'
import type { PortfolioData } from '@/types'

export const usePortfolioEditorState = (initialData: PortfolioData) => {
    const [portfolioData, setPortfolioData] =
        useState<PortfolioData>(initialData)
    const [value, setValue] = useState(JSON.stringify(initialData, null, 2))
    const [isSaving, setIsSaving] = useState(false)
    const [isSavingSections, setIsSavingSections] = useState(false)
    const [formStatus, setFormStatus] = useState('')
    const [rawStatus, setRawStatus] = useState('')
    const [rawIssues, setRawIssues] = useState<string[]>([])
    const [sectionsStatus, setSectionsStatus] = useState('')
    const [sectionIssues, setSectionIssues] = useState<string[]>([])

    const [sectionsDraft, setSectionsDraftState] = useState<SectionsFormValues>(
        buildSectionsDraft(initialData)
    )

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AdminFormValues>({
        resolver: zodResolver(adminFormSchema),
        defaultValues: buildAdminFormDefaults(initialData),
    })

    const watchedFormValues = watch()

    const quickFormDefaults = buildAdminFormDefaults(portfolioData)
    const sectionsDefaults = buildSectionsDraft(portfolioData)
    const rawDefaults = JSON.stringify(portfolioData, null, 2)

    const isQuickFormDirty =
        JSON.stringify(watchedFormValues) !== JSON.stringify(quickFormDefaults)
    const isSectionsDirty =
        JSON.stringify(sectionsDraft) !== JSON.stringify(sectionsDefaults)
    const isRawJsonDirty = value !== rawDefaults

    useEffect(() => {
        if (formStatus) {
            setFormStatus('')
        }
    }, [watchedFormValues, formStatus])

    const syncEditorState = (nextData: PortfolioData) => {
        setPortfolioData(nextData)
        setValue(JSON.stringify(nextData, null, 2))
        setSectionsDraftState(buildSectionsDraft(nextData))
        reset(buildAdminFormDefaults(nextData))
    }

    const setSectionsDraft = (next: SetStateAction<SectionsFormValues>) => {
        setSectionsStatus('')
        setSectionIssues([])
        setSectionsDraftState(next)
    }

    const setRawValue = (next: string) => {
        setRawStatus('')
        setRawIssues([])
        setValue(next)
    }

    const resetQuickForm = () => {
        reset(buildAdminFormDefaults(portfolioData))
        setFormStatus('')
    }

    const resetSections = () => {
        setSectionsDraftState(buildSectionsDraft(portfolioData))
        setSectionsStatus('')
        setSectionIssues([])
    }

    const resetRawJson = () => {
        setValue(JSON.stringify(portfolioData, null, 2))
        setRawStatus('')
        setRawIssues([])
    }

    const persist = async (payload: PortfolioData) => {
        const response = await fetch('/api/admin/portfolio', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        const result = (await response.json().catch(() => null)) as {
            error?: string
            issues?: Array<{
                path?: Array<string | number>
                message?: string
            }>
        } | null

        return { response, result }
    }

    const onSubmitForm = async (formValues: AdminFormValues) => {
        setFormStatus('')

        const existingSocialLinks = portfolioData.personal.contact.socialLinks
        const nonEditableSocials = existingSocialLinks.filter(
            (link) => link.name !== 'GitHub' && link.name !== 'LinkedIn'
        )

        const githubIcon =
            existingSocialLinks.find((link) => link.name === 'GitHub')?.icon ??
            'github'
        const linkedinIcon =
            existingSocialLinks.find((link) => link.name === 'LinkedIn')
                ?.icon ?? 'linkedin'

        const socialLinks = [
            {
                name: 'GitHub',
                icon: githubIcon,
                url: formValues.githubUrl.trim(),
            },
            {
                name: 'LinkedIn',
                icon: linkedinIcon,
                url: formValues.linkedinUrl.trim(),
            },
            ...nonEditableSocials,
        ]

        const nextData: PortfolioData = {
            ...portfolioData,
            personal: {
                ...portfolioData.personal,
                name: formValues.name.trim(),
                title: formValues.title.trim(),
                about: formValues.about.trim(),
                openToWork: formValues.openToWork,
                openToWorkLabel: formValues.openToWorkLabel.trim(),
                cvPath: formValues.cvPath.trim(),
                heroTypedLines: fromMultiline(formValues.heroTypedLinesText),
                ogTechPills: fromMultiline(formValues.ogTechPillsText),
                contact: {
                    ...portfolioData.personal.contact,
                    email: formValues.contactEmail.trim(),
                    phone: formValues.contactPhone.trim(),
                    socialLinks,
                },
            },
            devPractices: fromMultiline(formValues.devPracticesText),
        }

        const parsed = portfolioSchema.safeParse(nextData)
        if (!parsed.success) {
            setFormStatus(
                `Validation failed: ${parsed.error.issues[0]?.message ?? 'Invalid data'}`
            )
            return
        }

        let response: Response
        let result: {
            error?: string
            issues?: Array<{
                path?: Array<string | number>
                message?: string
            }>
        } | null

        try {
            ;({ response, result } = await persist(
                parsed.data as PortfolioData
            ))
        } catch {
            setFormStatus('Failed to save changes.')
            return
        }

        if (!response.ok) {
            setFormStatus(result?.error ?? 'Failed to save changes.')
            return
        }

        syncEditorState(parsed.data as PortfolioData)
        setFormStatus('Saved successfully.')
    }

    const saveJson = async () => {
        setRawStatus('')
        setRawIssues([])
        setIsSaving(true)

        let parsed: unknown

        try {
            parsed = JSON.parse(value)
        } catch {
            setRawStatus('Invalid JSON format.')
            setIsSaving(false)
            return
        }

        const validated = portfolioSchema.safeParse(parsed)
        if (!validated.success) {
            setRawIssues(getRawIssues(validated.error))
            setRawStatus(
                'Validation failed. Fix the listed fields and try again.'
            )
            setIsSaving(false)
            return
        }

        let response: Response
        let result: {
            error?: string
            issues?: Array<{
                path?: Array<string | number>
                message?: string
            }>
        } | null

        try {
            ;({ response, result } = await persist(
                validated.data as PortfolioData
            ))
        } catch {
            setRawStatus('Failed to save changes.')
            setIsSaving(false)
            return
        }

        if (!response.ok) {
            const serverIssues =
                result?.issues?.map((issue) => {
                    const path = issue.path?.join('.') ?? 'root'
                    return `${path}: ${issue.message ?? 'Invalid value'}`
                }) ?? []

            if (serverIssues.length > 0) {
                setRawIssues(serverIssues)
            }

            setRawStatus(result?.error ?? 'Failed to save changes.')
            setIsSaving(false)
            return
        }

        syncEditorState(validated.data as PortfolioData)
        setRawIssues([])
        setRawStatus('Saved successfully.')
        setIsSaving(false)
    }

    const updateExperienceField = (
        index: number,
        field: keyof SectionsFormValues['experience'][number],
        fieldValue: string
    ) => {
        setSectionsStatus('')
        setSectionIssues([])
        setSectionsDraftState((current) => ({
            ...current,
            experience: current.experience.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: fieldValue } : item
            ),
        }))
    }

    const updateEducationField = (
        index: number,
        field: keyof SectionsFormValues['education'][number],
        fieldValue: string
    ) => {
        setSectionsStatus('')
        setSectionIssues([])
        setSectionsDraftState((current) => ({
            ...current,
            education: current.education.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: fieldValue } : item
            ),
        }))
    }

    const updateSkillCategoryField = (
        index: number,
        field: keyof SectionsFormValues['skillCategories'][number],
        fieldValue: string | boolean
    ) => {
        setSectionsStatus('')
        setSectionIssues([])
        setSectionsDraftState((current) => ({
            ...current,
            skillCategories: current.skillCategories.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: fieldValue } : item
            ),
        }))
    }

    const saveSections = async () => {
        setSectionsStatus('')
        setSectionIssues([])

        const parsedSections = sectionsFormSchema.safeParse(sectionsDraft)
        if (!parsedSections.success) {
            setSectionIssues(getRawIssues(parsedSections.error))
            setSectionsStatus(
                'Validation failed. Fix highlighted section fields.'
            )
            return
        }

        setIsSavingSections(true)

        const experience = parsedSections.data.experience.map((item) => ({
            period: item.period.trim(),
            title: item.title.trim(),
            company: item.company.trim(),
            location: item.location.trim(),
            points: fromMultiline(item.pointsText),
        }))

        const education = parsedSections.data.education.map((item) => ({
            degree: item.degree.trim(),
            institution: item.institution.trim(),
            location: item.location.trim(),
            year: item.year.trim(),
            details: item.details,
        }))

        const skillCategories = parsedSections.data.skillCategories.map(
            (category) => ({
                label: category.label.trim(),
                wide: category.wide,
                skills: fromMultiline(category.skillsText)
                    .map(parseSkillLine)
                    .filter((skill) => skill !== null),
            })
        )

        const candidate = {
            ...portfolioData,
            experience,
            education,
            skillCategories,
            learning: {
                heading: parsedSections.data.learning.heading.trim(),
                description: parsedSections.data.learning.description.trim(),
                languages: fromMultiline(
                    parsedSections.data.learning.languagesText
                ),
                bootDevEmbed: {
                    src: parsedSections.data.learning.bootDevSrc,
                    alt: parsedSections.data.learning.bootDevAlt.trim(),
                },
                duolingoEmbed: {
                    src: parsedSections.data.learning.duolingoSrc,
                    alt: parsedSections.data.learning.duolingoAlt.trim(),
                    unoptimized:
                        parsedSections.data.learning.duolingoUnoptimized,
                },
            },
        }

        const parsedPortfolio = portfolioSchema.safeParse(candidate)
        if (!parsedPortfolio.success) {
            setSectionIssues(getRawIssues(parsedPortfolio.error))
            setSectionsStatus('Validation failed against portfolio schema.')
            return
        }

        let response: Response
        let result: {
            error?: string
            issues?: Array<{
                path?: Array<string | number>
                message?: string
            }>
        } | null

        try {
            ;({ response, result } = await persist(
                parsedPortfolio.data as PortfolioData
            ))
        } catch {
            setSectionsStatus('Failed to save section changes.')
            setIsSavingSections(false)
            return
        }

        if (!response.ok) {
            const serverIssues =
                result?.issues?.map((issue) => {
                    const path = issue.path?.join('.') ?? 'root'
                    return `${path}: ${issue.message ?? 'Invalid value'}`
                }) ?? []

            if (serverIssues.length > 0) {
                setSectionIssues(serverIssues)
            }

            setSectionsStatus(
                result?.error ?? 'Failed to save section changes.'
            )
            setIsSavingSections(false)
            return
        }

        syncEditorState(parsedPortfolio.data as PortfolioData)
        setSectionsStatus('Section changes saved successfully.')
        setIsSavingSections(false)
    }

    return {
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
        setValue: setRawValue,
        saveJson,
        isSaving,
        rawStatus,
        rawIssues,
        resetQuickForm,
        resetSections,
        resetRawJson,
        isQuickFormDirty,
        isSectionsDirty,
        isRawJsonDirty,
    }
}
