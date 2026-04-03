import type { Dispatch, SetStateAction } from 'react'
import {
    moveItem,
    type SectionsFormValues,
} from '@/components/admin/editorSchemas'

interface SectionsEditorSectionProps {
    sectionsDraft: SectionsFormValues
    setSectionsDraft: Dispatch<SetStateAction<SectionsFormValues>>
    updateExperienceField: (
        index: number,
        field: keyof SectionsFormValues['experience'][number],
        fieldValue: string
    ) => void
    updateEducationField: (
        index: number,
        field: keyof SectionsFormValues['education'][number],
        fieldValue: string
    ) => void
    updateSkillCategoryField: (
        index: number,
        field: keyof SectionsFormValues['skillCategories'][number],
        fieldValue: string | boolean
    ) => void
    saveSections: () => Promise<void>
    sectionsStatus: string
    sectionIssues: string[]
}

export function SectionsEditorSection({
    sectionsDraft,
    setSectionsDraft,
    updateExperienceField,
    updateEducationField,
    updateSkillCategoryField,
    saveSections,
    sectionsStatus,
    sectionIssues,
}: SectionsEditorSectionProps) {
    return (
        <section className="border border-green-900/70 bg-green-950/20 rounded-lg p-4 space-y-5">
            <h2 className="text-lg text-green-300">Sections Editor</h2>
            <p className="text-sm text-green-600">
                Manage Experience, Education, Skills, and Learning with
                validation.
            </p>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-green-300">Experience</h3>
                    <button
                        type="button"
                        onClick={() =>
                            setSectionsDraft((current) => ({
                                ...current,
                                experience: [
                                    ...current.experience,
                                    {
                                        period: '',
                                        title: '',
                                        company: '',
                                        location: '',
                                        pointsText: '',
                                    },
                                ],
                            }))
                        }
                        className="rounded border border-green-700 px-2 py-1 text-xs hover:bg-green-900/30"
                    >
                        Add Experience
                    </button>
                </div>

                {sectionsDraft.experience.map((item, index) => (
                    <div
                        key={`exp-${index}`}
                        className="border border-green-900/60 rounded p-3 space-y-2"
                    >
                        <div className="flex items-center justify-between text-xs text-green-500">
                            <span>Item {index + 1}</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() =>
                                        setSectionsDraft((current) => ({
                                            ...current,
                                            experience: moveItem(
                                                current.experience,
                                                index,
                                                index - 1
                                            ),
                                        }))
                                    }
                                    className="px-2 py-1 border border-green-800 rounded disabled:opacity-40"
                                >
                                    Up
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        index ===
                                        sectionsDraft.experience.length - 1
                                    }
                                    onClick={() =>
                                        setSectionsDraft((current) => ({
                                            ...current,
                                            experience: moveItem(
                                                current.experience,
                                                index,
                                                index + 1
                                            ),
                                        }))
                                    }
                                    className="px-2 py-1 border border-green-800 rounded disabled:opacity-40"
                                >
                                    Down
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSectionsDraft((current) => ({
                                            ...current,
                                            experience:
                                                current.experience.filter(
                                                    (_, itemIndex) =>
                                                        itemIndex !== index
                                                ),
                                        }))
                                    }
                                    className="px-2 py-1 border border-red-900 text-red-300 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                                value={item.title}
                                onChange={(event) =>
                                    updateExperienceField(
                                        index,
                                        'title',
                                        event.target.value
                                    )
                                }
                                placeholder="Title"
                                className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                            />
                            <input
                                value={item.company}
                                onChange={(event) =>
                                    updateExperienceField(
                                        index,
                                        'company',
                                        event.target.value
                                    )
                                }
                                placeholder="Company"
                                className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                            />
                            <input
                                value={item.location}
                                onChange={(event) =>
                                    updateExperienceField(
                                        index,
                                        'location',
                                        event.target.value
                                    )
                                }
                                placeholder="Location"
                                className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                            />
                            <input
                                value={item.period}
                                onChange={(event) =>
                                    updateExperienceField(
                                        index,
                                        'period',
                                        event.target.value
                                    )
                                }
                                placeholder="Period"
                                className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <textarea
                            value={item.pointsText}
                            onChange={(event) =>
                                updateExperienceField(
                                    index,
                                    'pointsText',
                                    event.target.value
                                )
                            }
                            rows={4}
                            placeholder="One bullet point per line"
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                        />
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-green-300">Education</h3>
                    <button
                        type="button"
                        onClick={() =>
                            setSectionsDraft((current) => ({
                                ...current,
                                education: [
                                    ...current.education,
                                    {
                                        degree: '',
                                        institution: '',
                                        location: '',
                                        year: '',
                                        details: '',
                                    },
                                ],
                            }))
                        }
                        className="rounded border border-green-700 px-2 py-1 text-xs hover:bg-green-900/30"
                    >
                        Add Education
                    </button>
                </div>

                {sectionsDraft.education.map((item, index) => (
                    <div
                        key={`edu-${index}`}
                        className="border border-green-900/60 rounded p-3 space-y-2"
                    >
                        <div className="flex items-center justify-between text-xs text-green-500">
                            <span>Item {index + 1}</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() =>
                                        setSectionsDraft((current) => ({
                                            ...current,
                                            education: moveItem(
                                                current.education,
                                                index,
                                                index - 1
                                            ),
                                        }))
                                    }
                                    className="px-2 py-1 border border-green-800 rounded disabled:opacity-40"
                                >
                                    Up
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        index ===
                                        sectionsDraft.education.length - 1
                                    }
                                    onClick={() =>
                                        setSectionsDraft((current) => ({
                                            ...current,
                                            education: moveItem(
                                                current.education,
                                                index,
                                                index + 1
                                            ),
                                        }))
                                    }
                                    className="px-2 py-1 border border-green-800 rounded disabled:opacity-40"
                                >
                                    Down
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSectionsDraft((current) => ({
                                            ...current,
                                            education: current.education.filter(
                                                (_, itemIndex) =>
                                                    itemIndex !== index
                                            ),
                                        }))
                                    }
                                    className="px-2 py-1 border border-red-900 text-red-300 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                                value={item.degree}
                                onChange={(event) =>
                                    updateEducationField(
                                        index,
                                        'degree',
                                        event.target.value
                                    )
                                }
                                placeholder="Degree"
                                className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                            />
                            <input
                                value={item.institution}
                                onChange={(event) =>
                                    updateEducationField(
                                        index,
                                        'institution',
                                        event.target.value
                                    )
                                }
                                placeholder="Institution"
                                className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                            />
                            <input
                                value={item.location}
                                onChange={(event) =>
                                    updateEducationField(
                                        index,
                                        'location',
                                        event.target.value
                                    )
                                }
                                placeholder="Location"
                                className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                            />
                            <input
                                value={item.year}
                                onChange={(event) =>
                                    updateEducationField(
                                        index,
                                        'year',
                                        event.target.value
                                    )
                                }
                                placeholder="Year"
                                className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <textarea
                            value={item.details}
                            onChange={(event) =>
                                updateEducationField(
                                    index,
                                    'details',
                                    event.target.value
                                )
                            }
                            rows={3}
                            placeholder="Details"
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                        />
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-green-300">Skill Categories</h3>
                    <button
                        type="button"
                        onClick={() =>
                            setSectionsDraft((current) => ({
                                ...current,
                                skillCategories: [
                                    ...current.skillCategories,
                                    {
                                        label: '',
                                        wide: false,
                                        skillsText: '',
                                    },
                                ],
                            }))
                        }
                        className="rounded border border-green-700 px-2 py-1 text-xs hover:bg-green-900/30"
                    >
                        Add Category
                    </button>
                </div>

                {sectionsDraft.skillCategories.map((item, index) => (
                    <div
                        key={`skills-${index}`}
                        className="border border-green-900/60 rounded p-3 space-y-2"
                    >
                        <div className="flex items-center justify-between text-xs text-green-500">
                            <span>Category {index + 1}</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() =>
                                        setSectionsDraft((current) => ({
                                            ...current,
                                            skillCategories: moveItem(
                                                current.skillCategories,
                                                index,
                                                index - 1
                                            ),
                                        }))
                                    }
                                    className="px-2 py-1 border border-green-800 rounded disabled:opacity-40"
                                >
                                    Up
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        index ===
                                        sectionsDraft.skillCategories.length - 1
                                    }
                                    onClick={() =>
                                        setSectionsDraft((current) => ({
                                            ...current,
                                            skillCategories: moveItem(
                                                current.skillCategories,
                                                index,
                                                index + 1
                                            ),
                                        }))
                                    }
                                    className="px-2 py-1 border border-green-800 rounded disabled:opacity-40"
                                >
                                    Down
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSectionsDraft((current) => ({
                                            ...current,
                                            skillCategories:
                                                current.skillCategories.filter(
                                                    (_, itemIndex) =>
                                                        itemIndex !== index
                                                ),
                                        }))
                                    }
                                    className="px-2 py-1 border border-red-900 text-red-300 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <input
                            value={item.label}
                            onChange={(event) =>
                                updateSkillCategoryField(
                                    index,
                                    'label',
                                    event.target.value
                                )
                            }
                            placeholder="Category label"
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                        />

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={item.wide}
                                onChange={(event) =>
                                    updateSkillCategoryField(
                                        index,
                                        'wide',
                                        event.target.checked
                                    )
                                }
                                className="accent-green-500"
                            />
                            Wide layout
                        </label>

                        <textarea
                            value={item.skillsText}
                            onChange={(event) =>
                                updateSkillCategoryField(
                                    index,
                                    'skillsText',
                                    event.target.value
                                )
                            }
                            rows={5}
                            placeholder="One skill per line, optionally label|icon"
                            className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                        />
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                <h3 className="text-green-300">Learning</h3>
                <input
                    value={sectionsDraft.learning.heading}
                    onChange={(event) =>
                        setSectionsDraft((current) => ({
                            ...current,
                            learning: {
                                ...current.learning,
                                heading: event.target.value,
                            },
                        }))
                    }
                    placeholder="Heading"
                    className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                />
                <textarea
                    value={sectionsDraft.learning.description}
                    onChange={(event) =>
                        setSectionsDraft((current) => ({
                            ...current,
                            learning: {
                                ...current.learning,
                                description: event.target.value,
                            },
                        }))
                    }
                    rows={4}
                    placeholder="Description"
                    className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                />
                <textarea
                    value={sectionsDraft.learning.languagesText}
                    onChange={(event) =>
                        setSectionsDraft((current) => ({
                            ...current,
                            learning: {
                                ...current.learning,
                                languagesText: event.target.value,
                            },
                        }))
                    }
                    rows={3}
                    placeholder="Languages, one per line"
                    className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                        value={sectionsDraft.learning.bootDevSrc}
                        onChange={(event) =>
                            setSectionsDraft((current) => ({
                                ...current,
                                learning: {
                                    ...current.learning,
                                    bootDevSrc: event.target.value,
                                },
                            }))
                        }
                        placeholder="Boot.dev embed URL"
                        className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                    />
                    <input
                        value={sectionsDraft.learning.bootDevAlt}
                        onChange={(event) =>
                            setSectionsDraft((current) => ({
                                ...current,
                                learning: {
                                    ...current.learning,
                                    bootDevAlt: event.target.value,
                                },
                            }))
                        }
                        placeholder="Boot.dev alt text"
                        className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                    />
                    <input
                        value={sectionsDraft.learning.duolingoSrc}
                        onChange={(event) =>
                            setSectionsDraft((current) => ({
                                ...current,
                                learning: {
                                    ...current.learning,
                                    duolingoSrc: event.target.value,
                                },
                            }))
                        }
                        placeholder="Duolingo embed URL"
                        className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                    />
                    <input
                        value={sectionsDraft.learning.duolingoAlt}
                        onChange={(event) =>
                            setSectionsDraft((current) => ({
                                ...current,
                                learning: {
                                    ...current.learning,
                                    duolingoAlt: event.target.value,
                                },
                            }))
                        }
                        placeholder="Duolingo alt text"
                        className="w-full bg-black border border-green-900 rounded px-3 py-2 text-sm"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={sectionsDraft.learning.duolingoUnoptimized}
                        onChange={(event) =>
                            setSectionsDraft((current) => ({
                                ...current,
                                learning: {
                                    ...current.learning,
                                    duolingoUnoptimized: event.target.checked,
                                },
                            }))
                        }
                        className="accent-green-500"
                    />
                    Duolingo image unoptimized
                </label>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={saveSections}
                    className="rounded bg-green-700 text-black font-semibold px-4 py-2 hover:bg-green-500"
                >
                    Save Sections Form
                </button>
                {sectionsStatus ? (
                    <p className="text-sm text-green-300">{sectionsStatus}</p>
                ) : null}
            </div>

            {sectionIssues.length > 0 ? (
                <div className="border border-red-900/70 bg-red-950/20 rounded p-3">
                    <p className="text-sm text-red-300 mb-2">
                        Section validation issues:
                    </p>
                    <ul className="text-xs text-red-300 space-y-1 max-h-48 overflow-auto">
                        {sectionIssues.map((issue) => (
                            <li key={issue}>{issue}</li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </section>
    )
}
