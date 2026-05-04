'use client'

import { useReducer } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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

/**
 * Consolidated editor state using useReducer for single source of truth.
 * Replaces 15+ scattered useState variables with one coordinated state object.
 */
interface EditorState {
    portfolioData: PortfolioData
    rawJsonValue: string
    sectionsDraft: SectionsFormValues
    version: number
    isSavingForm: boolean
    isSavingRaw: boolean
    isSavingSections: boolean
    formStatus: string
    rawStatus: string
    rawIssues: string[]
    sectionsStatus: string
    sectionIssues: string[]
    isResettingForm: boolean
}

type EditorAction =
    | {
          type: 'SYNC_FROM_DATA'
          payload: {
              data: PortfolioData
              version: number
          }
      }
    | {
          type: 'UPDATE_RAW_JSON'
          payload: string
      }
    | {
          type: 'UPDATE_SECTIONS_DRAFT'
          payload: SectionsFormValues
      }
    | { type: 'SET_FORM_STATUS'; payload: string }
    | { type: 'SET_RAW_STATUS'; payload: string }
    | { type: 'SET_SECTIONS_STATUS'; payload: string }
    | { type: 'SET_RAW_ISSUES'; payload: string[] }
    | { type: 'SET_SECTION_ISSUES'; payload: string[] }
    | { type: 'SET_SAVING_FORM'; payload: boolean }
    | { type: 'SET_SAVING_RAW'; payload: boolean }
    | { type: 'SET_SAVING_SECTIONS'; payload: boolean }
    | { type: 'SET_RESETTING_FORM'; payload: boolean }

const createInitialState = (
    initialData: PortfolioData,
    initialVersion: number
): EditorState => ({
    portfolioData: initialData,
    rawJsonValue: JSON.stringify(initialData, null, 2),
    sectionsDraft: buildSectionsDraft(initialData),
    version: initialVersion,
    isSavingForm: false,
    isSavingRaw: false,
    isSavingSections: false,
    formStatus: '',
    rawStatus: '',
    rawIssues: [],
    sectionsStatus: '',
    sectionIssues: [],
    isResettingForm: false,
})

const editorReducer = (
    state: EditorState,
    action: EditorAction
): EditorState => {
    switch (action.type) {
        case 'SYNC_FROM_DATA':
            return {
                ...state,
                portfolioData: action.payload.data,
                rawJsonValue: JSON.stringify(action.payload.data, null, 2),
                sectionsDraft: buildSectionsDraft(action.payload.data),
                version: action.payload.version,
                formStatus: '',
                rawStatus: '',
                rawIssues: [],
                sectionsStatus: '',
                sectionIssues: [],
            }
        case 'UPDATE_RAW_JSON':
            return {
                ...state,
                rawJsonValue: action.payload,
                rawStatus: '',
                rawIssues: [],
            }
        case 'UPDATE_SECTIONS_DRAFT':
            return {
                ...state,
                sectionsDraft: action.payload,
                sectionsStatus: '',
                sectionIssues: [],
            }
        case 'SET_FORM_STATUS':
            return { ...state, formStatus: action.payload }
        case 'SET_RAW_STATUS':
            return { ...state, rawStatus: action.payload }
        case 'SET_SECTIONS_STATUS':
            return { ...state, sectionsStatus: action.payload }
        case 'SET_RAW_ISSUES':
            return { ...state, rawIssues: action.payload }
        case 'SET_SECTION_ISSUES':
            return { ...state, sectionIssues: action.payload }
        case 'SET_SAVING_FORM':
            return { ...state, isSavingForm: action.payload }
        case 'SET_SAVING_RAW':
            return { ...state, isSavingRaw: action.payload }
        case 'SET_SAVING_SECTIONS':
            return { ...state, isSavingSections: action.payload }
        case 'SET_RESETTING_FORM':
            return { ...state, isResettingForm: action.payload }
        default:
            return state
    }
}

export const usePortfolioEditorState = (
    initialData: PortfolioData,
    initialVersion = 0
) => {
    const [state, dispatch] = useReducer(
        editorReducer,
        initialData,
        (initial) => createInitialState(initial, initialVersion)
    )

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue: setFormValue,
        formState: { errors, isSubmitting, isDirty: isQuickFormDirty },
    } = useForm<AdminFormValues>({
        resolver: zodResolver(adminFormSchema),
        defaultValues: buildAdminFormDefaults(initialData),
    })

    // Derived state
    const sectionsDefaults = buildSectionsDraft(state.portfolioData)
    const isSectionsDirty =
        JSON.stringify(state.sectionsDraft) !== JSON.stringify(sectionsDefaults)
    const formatIssuesForToast = (issues: string[]) => {
        if (issues.length === 0) {
            return undefined
        }

        const visibleIssues = issues.slice(0, 3).join(' | ')
        return issues.length > 3
            ? `${visibleIssues} | +${issues.length - 3} more`
            : visibleIssues
    }

    const syncEditorState = (nextData: PortfolioData) => {
        dispatch({
            type: 'SYNC_FROM_DATA',
            payload: { data: nextData, version: state.version + 1 },
        })

        dispatch({ type: 'SET_RESETTING_FORM', payload: true })
        reset(buildAdminFormDefaults(nextData))
        Promise.resolve().then(() => {
            dispatch({ type: 'SET_RESETTING_FORM', payload: false })
        })
    }

    const syncFromApiResponse = (
        result: {
            success?: boolean
            data?: PortfolioData
            version?: number
            error?: string
        } | null
    ): boolean => {
        if (result?.success && result.data) {
            dispatch({
                type: 'SYNC_FROM_DATA',
                payload: {
                    data: result.data,
                    version:
                        typeof result.version === 'number'
                            ? result.version
                            : state.version,
                },
            })
            dispatch({ type: 'SET_RESETTING_FORM', payload: true })
            reset(buildAdminFormDefaults(result.data))
            Promise.resolve().then(() => {
                dispatch({ type: 'SET_RESETTING_FORM', payload: false })
            })
            return true
        }
        return false
    }

    const persist = async (
        payload: PortfolioData,
        blobPendingPathnames: string[]
    ) => {
        const response = await fetch('/api/admin/portfolio', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _version: state.version,
                _blobPendingPathnames: blobPendingPathnames,
                ...payload,
            }),
        })

        const result = (await response.json().catch(() => null)) as {
            success?: boolean
            data?: PortfolioData
            version?: number
            error?: string
            issues?: Array<{
                path?: Array<string | number>
                message?: string
            }>
        } | null

        return { response, result }
    }

    const onSubmitForm = async (formValues: AdminFormValues) => {
        dispatch({ type: 'SET_FORM_STATUS', payload: '' })

        const blobPendingPathnames = (() => {
            if (!formValues.profileImagePendingPathnames) {
                return [] as string[]
            }

            try {
                const parsed = JSON.parse(
                    formValues.profileImagePendingPathnames
                )
                if (!Array.isArray(parsed)) {
                    return [] as string[]
                }

                return parsed.filter(
                    (value): value is string => typeof value === 'string'
                )
            } catch {
                return [] as string[]
            }
        })()

        const existingSocialLinks =
            state.portfolioData.personal.contact.socialLinks
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
            ...state.portfolioData,
            personal: {
                ...state.portfolioData.personal,
                name: formValues.name.trim(),
                title: formValues.title.trim(),
                about: formValues.about.trim(),
                status: formValues.status,
                statusLabel: formValues.statusLabel.trim(),
                cvPath: formValues.cvPath.trim(),
                profileImageUrl:
                    formValues.profileImageUrl?.trim() || undefined,
                heroTypedLines: fromMultiline(formValues.heroTypedLinesText),
                ogTechPills: fromMultiline(formValues.ogTechPillsText),
                contact: {
                    ...state.portfolioData.personal.contact,
                    email: formValues.contactEmail.trim(),
                    phone: formValues.contactPhone.trim(),
                    socialLinks,
                },
            },
            devPractices: fromMultiline(formValues.devPracticesText),
        }

        const parsed = portfolioSchema.safeParse(nextData)
        if (!parsed.success) {
            toast.error('Quick form validation failed', {
                description:
                    parsed.error.issues[0]?.message ??
                    'Invalid portfolio data.',
            })
            return
        }

        try {
            const { response, result } = await persist(
                parsed.data as PortfolioData,
                blobPendingPathnames
            )

            if (!response.ok) {
                toast.error('Failed to save quick form', {
                    description: result?.error ?? 'Please try again.',
                })
                return
            }

            if (!syncFromApiResponse(result)) {
                syncEditorState(parsed.data as PortfolioData)
            }
            setFormValue('profileImageCurrentPathname', '', {
                shouldDirty: false,
            })
            setFormValue('profileImagePendingPathnames', '[]', {
                shouldDirty: false,
            })
            toast.success('Quick form saved')
        } catch {
            toast.error('Failed to save quick form', {
                description: 'Please try again.',
            })
        }
    }

    const updateExperienceField = (
        index: number,
        field: keyof SectionsFormValues['experience'][number],
        fieldValue: string
    ) => {
        const updated = {
            ...state.sectionsDraft,
            experience: state.sectionsDraft.experience.map((item, i) =>
                i === index ? { ...item, [field]: fieldValue } : item
            ),
        }
        dispatch({ type: 'UPDATE_SECTIONS_DRAFT', payload: updated })
    }

    const updateEducationField = (
        index: number,
        field: keyof SectionsFormValues['education'][number],
        fieldValue: string
    ) => {
        const updated = {
            ...state.sectionsDraft,
            education: state.sectionsDraft.education.map((item, i) =>
                i === index ? { ...item, [field]: fieldValue } : item
            ),
        }
        dispatch({ type: 'UPDATE_SECTIONS_DRAFT', payload: updated })
    }

    const updateSkillCategoryField = (
        index: number,
        field: keyof SectionsFormValues['skillCategories'][number],
        fieldValue: string | boolean
    ) => {
        const updated = {
            ...state.sectionsDraft,
            skillCategories: state.sectionsDraft.skillCategories.map(
                (item, i) =>
                    i === index ? { ...item, [field]: fieldValue } : item
            ),
        }
        dispatch({ type: 'UPDATE_SECTIONS_DRAFT', payload: updated })
    }

    const saveSections = async () => {
        dispatch({ type: 'SET_SECTION_ISSUES', payload: [] })

        const parsedSections = sectionsFormSchema.safeParse(state.sectionsDraft)
        if (!parsedSections.success) {
            const issues = getRawIssues(parsedSections.error)
            dispatch({
                type: 'SET_SECTION_ISSUES',
                payload: issues,
            })
            toast.error('Sections validation failed', {
                description:
                    formatIssuesForToast(issues) ??
                    'Fix the highlighted section fields.',
            })
            return
        }

        dispatch({ type: 'SET_SAVING_SECTIONS', payload: true })

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
            ...state.portfolioData,
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
            const issues = getRawIssues(parsedPortfolio.error)
            dispatch({
                type: 'SET_SECTION_ISSUES',
                payload: issues,
            })
            toast.error('Portfolio schema validation failed', {
                description:
                    formatIssuesForToast(issues) ??
                    'Review the section content and try again.',
            })
            dispatch({ type: 'SET_SAVING_SECTIONS', payload: false })
            return
        }

        try {
            const { response, result } = await persist(
                parsedPortfolio.data as PortfolioData,
                []
            )

            if (!response.ok) {
                const serverIssues =
                    result?.issues?.map((issue) => {
                        const path = issue.path?.join('.') ?? 'root'
                        return `${path}: ${issue.message ?? 'Invalid value'}`
                    }) ?? []

                if (serverIssues.length > 0) {
                    dispatch({
                        type: 'SET_SECTION_ISSUES',
                        payload: serverIssues,
                    })
                }

                toast.error('Failed to save sections', {
                    description:
                        formatIssuesForToast(serverIssues) ??
                        result?.error ??
                        'Please try again.',
                })
                dispatch({ type: 'SET_SAVING_SECTIONS', payload: false })
                return
            }

            if (!syncFromApiResponse(result)) {
                syncEditorState(parsedPortfolio.data as PortfolioData)
            }
            toast.success('Sections saved')
            dispatch({ type: 'SET_SAVING_SECTIONS', payload: false })
        } catch {
            toast.error('Failed to save sections', {
                description: 'Please try again.',
            })
            dispatch({ type: 'SET_SAVING_SECTIONS', payload: false })
        }
    }

    return {
        register,
        handleSubmit,
        watch,
        setFormValue,
        errors,
        isSubmitting,
        onSubmitForm,
        sectionsDraft: state.sectionsDraft,
        setSectionsDraft: (
            next:
                | SectionsFormValues
                | ((prev: SectionsFormValues) => SectionsFormValues)
        ) => {
            const updated =
                typeof next === 'function' ? next(state.sectionsDraft) : next
            dispatch({ type: 'UPDATE_SECTIONS_DRAFT', payload: updated })
        },
        updateExperienceField,
        updateEducationField,
        updateSkillCategoryField,
        saveSections,
        isSavingSections: state.isSavingSections,
        isSectionsDirty,
        isQuickFormDirty,
        portfolioData: state.portfolioData,
    }
}
