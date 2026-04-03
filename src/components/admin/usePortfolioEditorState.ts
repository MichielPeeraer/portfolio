'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    adminFormSchema,
    fromMultiline,
    getRawIssues,
    parseSkillLine,
    sectionsFormSchema,
    skillItemToLine,
    toMultiline,
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
    const [formStatus, setFormStatus] = useState('')
    const [rawStatus, setRawStatus] = useState('')
    const [rawIssues, setRawIssues] = useState<string[]>([])
    const [sectionsStatus, setSectionsStatus] = useState('')
    const [sectionIssues, setSectionIssues] = useState<string[]>([])

    const [sectionsDraft, setSectionsDraft] = useState<SectionsFormValues>({
        experience: initialData.experience.map((item) => ({
            period: item.period,
            title: item.title,
            company: item.company,
            location: item.location,
            pointsText: item.points.join('\n'),
        })),
        education: initialData.education.map((item) => ({
            degree: item.degree,
            institution: item.institution,
            location: item.location,
            year: item.year,
            details: item.details,
        })),
        skillCategories: initialData.skillCategories.map((category) => ({
            label: category.label,
            wide: Boolean(category.wide),
            skillsText: category.skills.map(skillItemToLine).join('\n'),
        })),
        learning: {
            heading: initialData.learning.heading,
            description: initialData.learning.description,
            languagesText: initialData.learning.languages.join('\n'),
            bootDevSrc: initialData.learning.bootDevEmbed.src,
            bootDevAlt: initialData.learning.bootDevEmbed.alt,
            duolingoSrc: initialData.learning.duolingoEmbed.src,
            duolingoAlt: initialData.learning.duolingoEmbed.alt,
            duolingoUnoptimized: Boolean(
                initialData.learning.duolingoEmbed.unoptimized
            ),
        },
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AdminFormValues>({
        resolver: zodResolver(adminFormSchema),
        defaultValues: {
            name: initialData.personal.name,
            title: initialData.personal.title,
            about: initialData.personal.about,
            openToWork: Boolean(initialData.personal.openToWork),
            openToWorkLabel:
                initialData.personal.openToWorkLabel ?? 'Open to opportunities',
            cvPath: initialData.personal.cvPath ?? '/CV_Michiel_Peeraer.pdf',
            contactEmail: initialData.personal.contact.email,
            contactPhone: initialData.personal.contact.phone,
            heroTypedLinesText: toMultiline(
                initialData.personal.heroTypedLines
            ),
            ogTechPillsText: toMultiline(initialData.personal.ogTechPills),
            devPracticesText: toMultiline(initialData.devPractices),
        },
    })

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

        const { response, result } = await persist(parsed.data as PortfolioData)
        if (!response.ok) {
            setFormStatus(result?.error ?? 'Failed to save changes.')
            return
        }

        setPortfolioData(parsed.data as PortfolioData)
        setValue(JSON.stringify(parsed.data, null, 2))
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

        const { response, result } = await persist(
            validated.data as PortfolioData
        )

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

        setPortfolioData(validated.data as PortfolioData)
        setRawStatus('Saved successfully.')
        setIsSaving(false)
    }

    const updateExperienceField = (
        index: number,
        field: keyof SectionsFormValues['experience'][number],
        fieldValue: string
    ) => {
        setSectionsDraft((current) => ({
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
        setSectionsDraft((current) => ({
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
        setSectionsDraft((current) => ({
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

        const { response, result } = await persist(
            parsedPortfolio.data as PortfolioData
        )

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
            return
        }

        setPortfolioData(parsedPortfolio.data as PortfolioData)
        setValue(JSON.stringify(parsedPortfolio.data, null, 2))
        setSectionsStatus('Section changes saved successfully.')
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
        sectionsStatus,
        sectionIssues,
        value,
        setValue,
        saveJson,
        isSaving,
        rawStatus,
        rawIssues,
    }
}
