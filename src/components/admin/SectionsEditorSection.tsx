import { useState, type Dispatch, type SetStateAction } from 'react'
import {
    moveItem,
    type SectionsFormValues,
} from '@/components/admin/editorSchemas'

function PlusIcon() {
    return (
        <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
            />
        </svg>
    )
}

function ArrowUpIcon() {
    return (
        <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19V5m0 0l-4 4m4-4l4 4"
            />
        </svg>
    )
}

function ArrowDownIcon() {
    return (
        <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v14m0 0l-4-4m4 4l4-4"
            />
        </svg>
    )
}

function TrashIcon() {
    return (
        <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
        </svg>
    )
}

function DuplicateIcon() {
    return (
        <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 10h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
        </svg>
    )
}

function ToggleArrowIcon({ open }: { open: boolean }) {
    return (
        <svg
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
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

function LoadingSpinner() {
    return (
        <svg
            className="inline-block h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
            />
        </svg>
    )
}

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
    isSavingSections: boolean
}

export function SectionsEditorSection({
    sectionsDraft,
    setSectionsDraft,
    updateExperienceField,
    updateEducationField,
    updateSkillCategoryField,
    saveSections,
    isSavingSections,
}: SectionsEditorSectionProps) {
    const [experienceOpen, setExperienceOpen] = useState(true)
    const [educationOpen, setEducationOpen] = useState(true)
    const [skillsOpen, setSkillsOpen] = useState(true)
    const [learningOpen, setLearningOpen] = useState(true)

    const panelClass =
        'rounded-xl border border-green-900/50 bg-black/25 overflow-hidden'
    const itemCardClass =
        'space-y-3 rounded-xl border border-green-900/40 bg-black/40 p-4'
    const inputClass =
        'w-full rounded-lg border border-green-900/70 bg-black/60 px-3 py-2 text-sm text-green-100 outline-none transition placeholder:text-green-900 focus:border-green-500 focus:bg-black'
    const textareaClass = `${inputClass} min-h-[100px] resize-y`
    const fieldLabelClass =
        'mb-1 block text-[11px] font-medium uppercase tracking-[0.15em] text-green-600'
    const iconButtonClass =
        'flex h-7 w-7 items-center justify-center rounded-lg border border-green-800/70 text-green-400 transition hover:bg-green-900/30 disabled:opacity-30'
    const destructiveIconButtonClass =
        'flex h-7 w-7 items-center justify-center rounded-lg border border-red-900/60 text-red-400 transition hover:bg-red-950/30 disabled:opacity-30'
    const addButtonClass =
        'flex items-center gap-1.5 rounded-lg border border-green-700/70 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-green-400 transition hover:bg-green-900/30'

    const updateLearningField = (
        field: keyof SectionsFormValues['learning'],
        fieldValue: string | boolean
    ) => {
        setSectionsDraft((current) => ({
            ...current,
            learning: {
                ...current.learning,
                [field]: fieldValue,
            },
        }))
    }

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <div className={panelClass}>
                    {/* Experience header */}
                    <div className="flex items-center justify-between border-b border-green-900/40 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-green-300">
                                Experience
                            </p>
                            <p className="text-[11px] text-green-700">
                                One card per role · bullet points one per line
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setExperienceOpen((open) => !open)
                                }
                                aria-expanded={experienceOpen}
                                aria-label={
                                    experienceOpen
                                        ? 'Collapse experience section'
                                        : 'Expand experience section'
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-800/70 text-green-400 transition hover:bg-green-900/30"
                            >
                                <ToggleArrowIcon open={experienceOpen} />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setSectionsDraft((current) => ({
                                        ...current,
                                        experience: [
                                            {
                                                period: '',
                                                title: '',
                                                company: '',
                                                location: '',
                                                pointsText: '',
                                            },
                                            ...current.experience,
                                        ],
                                    }))
                                }
                                className={addButtonClass}
                            >
                                <PlusIcon />
                                Add
                            </button>
                        </div>
                    </div>

                    {experienceOpen
                        ? sectionsDraft.experience.map((item, index) => (
                              <div
                                  key={`exp-${index}`}
                                  className={`${itemCardClass} mx-4 mb-3`}
                              >
                                  <div className="flex items-center justify-between">
                                      <span className="rounded-full border border-green-900/60 bg-black/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-green-600">
                                          #{index + 1}
                                      </span>
                                      <div className="flex gap-1.5">
                                          <button
                                              type="button"
                                              disabled={index === 0}
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          experience: moveItem(
                                                              current.experience,
                                                              index,
                                                              index - 1
                                                          ),
                                                      })
                                                  )
                                              }
                                              className={iconButtonClass}
                                          >
                                              <ArrowUpIcon />
                                          </button>
                                          <button
                                              type="button"
                                              disabled={
                                                  index ===
                                                  sectionsDraft.experience
                                                      .length -
                                                      1
                                              }
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          experience: moveItem(
                                                              current.experience,
                                                              index,
                                                              index + 1
                                                          ),
                                                      })
                                                  )
                                              }
                                              className={iconButtonClass}
                                          >
                                              <ArrowDownIcon />
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          experience: [
                                                              ...current.experience.slice(
                                                                  0,
                                                                  index + 1
                                                              ),
                                                              {
                                                                  ...item,
                                                              },
                                                              ...current.experience.slice(
                                                                  index + 1
                                                              ),
                                                          ],
                                                      })
                                                  )
                                              }
                                              className={iconButtonClass}
                                              title="Duplicate item"
                                          >
                                              <DuplicateIcon />
                                          </button>
                                          <button
                                              type="button"
                                              disabled={
                                                  sectionsDraft.experience
                                                      .length <= 1
                                              }
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          experience:
                                                              current.experience.filter(
                                                                  (
                                                                      _,
                                                                      itemIndex
                                                                  ) =>
                                                                      itemIndex !==
                                                                      index
                                                              ),
                                                      })
                                                  )
                                              }
                                              className={
                                                  destructiveIconButtonClass
                                              }
                                          >
                                              <TrashIcon />
                                          </button>
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                      <div>
                                          <label
                                              htmlFor={`experience-title-${index}`}
                                              className={fieldLabelClass}
                                          >
                                              Title
                                          </label>
                                          <input
                                              id={`experience-title-${index}`}
                                              name={`experience.${index}.title`}
                                              autoComplete="off"
                                              value={item.title}
                                              onChange={(event) =>
                                                  updateExperienceField(
                                                      index,
                                                      'title',
                                                      event.target.value
                                                  )
                                              }
                                              placeholder="Title"
                                              className={inputClass}
                                          />
                                      </div>
                                      <div>
                                          <label
                                              htmlFor={`experience-company-${index}`}
                                              className={fieldLabelClass}
                                          >
                                              Company
                                          </label>
                                          <input
                                              id={`experience-company-${index}`}
                                              name={`experience.${index}.company`}
                                              autoComplete="organization"
                                              value={item.company}
                                              onChange={(event) =>
                                                  updateExperienceField(
                                                      index,
                                                      'company',
                                                      event.target.value
                                                  )
                                              }
                                              placeholder="Company"
                                              className={inputClass}
                                          />
                                      </div>
                                      <div>
                                          <label
                                              htmlFor={`experience-location-${index}`}
                                              className={fieldLabelClass}
                                          >
                                              Location
                                          </label>
                                          <input
                                              id={`experience-location-${index}`}
                                              name={`experience.${index}.location`}
                                              autoComplete="off"
                                              value={item.location}
                                              onChange={(event) =>
                                                  updateExperienceField(
                                                      index,
                                                      'location',
                                                      event.target.value
                                                  )
                                              }
                                              placeholder="Location"
                                              className={inputClass}
                                          />
                                      </div>
                                      <div>
                                          <label
                                              htmlFor={`experience-period-${index}`}
                                              className={fieldLabelClass}
                                          >
                                              Period
                                          </label>
                                          <input
                                              id={`experience-period-${index}`}
                                              name={`experience.${index}.period`}
                                              autoComplete="off"
                                              value={item.period}
                                              onChange={(event) =>
                                                  updateExperienceField(
                                                      index,
                                                      'period',
                                                      event.target.value
                                                  )
                                              }
                                              placeholder="Period"
                                              className={inputClass}
                                          />
                                      </div>
                                  </div>
                                  <div>
                                      <label
                                          htmlFor={`experience-points-${index}`}
                                          className={fieldLabelClass}
                                      >
                                          Bullet Points
                                      </label>
                                      <textarea
                                          id={`experience-points-${index}`}
                                          name={`experience.${index}.pointsText`}
                                          autoComplete="off"
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
                                          className={textareaClass}
                                      />
                                  </div>
                              </div>
                          ))
                        : null}
                </div>

                <div className={panelClass}>
                    {/* Education header */}
                    <div className="flex items-center justify-between border-b border-green-900/40 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-green-300">
                                Education
                            </p>
                            <p className="text-[11px] text-green-700">
                                Degrees, schools, and supporting context
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setEducationOpen((open) => !open)
                                }
                                aria-expanded={educationOpen}
                                aria-label={
                                    educationOpen
                                        ? 'Collapse education section'
                                        : 'Expand education section'
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-800/70 text-green-400 transition hover:bg-green-900/30"
                            >
                                <ToggleArrowIcon open={educationOpen} />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setSectionsDraft((current) => ({
                                        ...current,
                                        education: [
                                            {
                                                degree: '',
                                                institution: '',
                                                location: '',
                                                year: '',
                                                details: '',
                                            },
                                            ...current.education,
                                        ],
                                    }))
                                }
                                className={addButtonClass}
                            >
                                <PlusIcon />
                                Add
                            </button>
                        </div>
                    </div>

                    {educationOpen
                        ? sectionsDraft.education.map((item, index) => (
                              <div
                                  key={`edu-${index}`}
                                  className={`${itemCardClass} mx-4 mb-3`}
                              >
                                  <div className="flex items-center justify-between">
                                      <span className="rounded-full border border-green-900/60 bg-black/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-green-600">
                                          #{index + 1}
                                      </span>
                                      <div className="flex gap-1.5">
                                          <button
                                              type="button"
                                              disabled={index === 0}
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          education: moveItem(
                                                              current.education,
                                                              index,
                                                              index - 1
                                                          ),
                                                      })
                                                  )
                                              }
                                              className={iconButtonClass}
                                          >
                                              <ArrowUpIcon />
                                          </button>
                                          <button
                                              type="button"
                                              disabled={
                                                  index ===
                                                  sectionsDraft.education
                                                      .length -
                                                      1
                                              }
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          education: moveItem(
                                                              current.education,
                                                              index,
                                                              index + 1
                                                          ),
                                                      })
                                                  )
                                              }
                                              className={iconButtonClass}
                                          >
                                              <ArrowDownIcon />
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          education: [
                                                              ...current.education.slice(
                                                                  0,
                                                                  index + 1
                                                              ),
                                                              {
                                                                  ...item,
                                                              },
                                                              ...current.education.slice(
                                                                  index + 1
                                                              ),
                                                          ],
                                                      })
                                                  )
                                              }
                                              className={iconButtonClass}
                                              title="Duplicate item"
                                          >
                                              <DuplicateIcon />
                                          </button>
                                          <button
                                              type="button"
                                              disabled={
                                                  sectionsDraft.education
                                                      .length <= 1
                                              }
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          education:
                                                              current.education.filter(
                                                                  (
                                                                      _,
                                                                      itemIndex
                                                                  ) =>
                                                                      itemIndex !==
                                                                      index
                                                              ),
                                                      })
                                                  )
                                              }
                                              className={
                                                  destructiveIconButtonClass
                                              }
                                          >
                                              <TrashIcon />
                                          </button>
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                      <div>
                                          <label
                                              htmlFor={`education-degree-${index}`}
                                              className={fieldLabelClass}
                                          >
                                              Degree
                                          </label>
                                          <input
                                              id={`education-degree-${index}`}
                                              name={`education.${index}.degree`}
                                              autoComplete="off"
                                              value={item.degree}
                                              onChange={(event) =>
                                                  updateEducationField(
                                                      index,
                                                      'degree',
                                                      event.target.value
                                                  )
                                              }
                                              placeholder="Degree"
                                              className={inputClass}
                                          />
                                      </div>
                                      <div>
                                          <label
                                              htmlFor={`education-institution-${index}`}
                                              className={fieldLabelClass}
                                          >
                                              Institution
                                          </label>
                                          <input
                                              id={`education-institution-${index}`}
                                              name={`education.${index}.institution`}
                                              autoComplete="organization"
                                              value={item.institution}
                                              onChange={(event) =>
                                                  updateEducationField(
                                                      index,
                                                      'institution',
                                                      event.target.value
                                                  )
                                              }
                                              placeholder="Institution"
                                              className={inputClass}
                                          />
                                      </div>
                                      <div>
                                          <label
                                              htmlFor={`education-location-${index}`}
                                              className={fieldLabelClass}
                                          >
                                              Location
                                          </label>
                                          <input
                                              id={`education-location-${index}`}
                                              name={`education.${index}.location`}
                                              autoComplete="off"
                                              value={item.location}
                                              onChange={(event) =>
                                                  updateEducationField(
                                                      index,
                                                      'location',
                                                      event.target.value
                                                  )
                                              }
                                              placeholder="Location"
                                              className={inputClass}
                                          />
                                      </div>
                                      <div>
                                          <label
                                              htmlFor={`education-year-${index}`}
                                              className={fieldLabelClass}
                                          >
                                              Year
                                          </label>
                                          <input
                                              id={`education-year-${index}`}
                                              name={`education.${index}.year`}
                                              autoComplete="off"
                                              value={item.year}
                                              onChange={(event) =>
                                                  updateEducationField(
                                                      index,
                                                      'year',
                                                      event.target.value
                                                  )
                                              }
                                              placeholder="Year"
                                              className={inputClass}
                                          />
                                      </div>
                                  </div>
                                  <div>
                                      <label
                                          htmlFor={`education-details-${index}`}
                                          className={fieldLabelClass}
                                      >
                                          Details
                                      </label>
                                      <textarea
                                          id={`education-details-${index}`}
                                          name={`education.${index}.details`}
                                          autoComplete="off"
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
                                          className={textareaClass}
                                      />
                                  </div>
                              </div>
                          ))
                        : null}
                </div>

                <div className={panelClass}>
                    {/* Skills header */}
                    <div className="flex items-center justify-between border-b border-green-900/40 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-green-300">
                                Skill Categories
                            </p>
                            <p className="text-[11px] text-green-700">
                                One skill per line · optionally label|icon
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setSkillsOpen((open) => !open)}
                                aria-expanded={skillsOpen}
                                aria-label={
                                    skillsOpen
                                        ? 'Collapse skills section'
                                        : 'Expand skills section'
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-800/70 text-green-400 transition hover:bg-green-900/30"
                            >
                                <ToggleArrowIcon open={skillsOpen} />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setSectionsDraft((current) => ({
                                        ...current,
                                        skillCategories: [
                                            {
                                                label: '',
                                                wide: false,
                                                skillsText: '',
                                            },
                                            ...current.skillCategories,
                                        ],
                                    }))
                                }
                                className={addButtonClass}
                            >
                                <PlusIcon />
                                Add
                            </button>
                        </div>
                    </div>

                    {skillsOpen
                        ? sectionsDraft.skillCategories.map((item, index) => (
                              <div
                                  key={`skills-${index}`}
                                  className={`${itemCardClass} mx-4 mb-3`}
                              >
                                  <div className="flex items-center justify-between">
                                      <span className="rounded-full border border-green-900/60 bg-black/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-green-600">
                                          #{index + 1}
                                      </span>
                                      <div className="flex gap-1.5">
                                          <button
                                              type="button"
                                              disabled={index === 0}
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          skillCategories:
                                                              moveItem(
                                                                  current.skillCategories,
                                                                  index,
                                                                  index - 1
                                                              ),
                                                      })
                                                  )
                                              }
                                              className={iconButtonClass}
                                          >
                                              <ArrowUpIcon />
                                          </button>
                                          <button
                                              type="button"
                                              disabled={
                                                  index ===
                                                  sectionsDraft.skillCategories
                                                      .length -
                                                      1
                                              }
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          skillCategories:
                                                              moveItem(
                                                                  current.skillCategories,
                                                                  index,
                                                                  index + 1
                                                              ),
                                                      })
                                                  )
                                              }
                                              className={iconButtonClass}
                                          >
                                              <ArrowDownIcon />
                                          </button>
                                          <button
                                              type="button"
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          skillCategories: [
                                                              ...current.skillCategories.slice(
                                                                  0,
                                                                  index + 1
                                                              ),
                                                              {
                                                                  ...item,
                                                              },
                                                              ...current.skillCategories.slice(
                                                                  index + 1
                                                              ),
                                                          ],
                                                      })
                                                  )
                                              }
                                              className={iconButtonClass}
                                              title="Duplicate item"
                                          >
                                              <DuplicateIcon />
                                          </button>
                                          <button
                                              type="button"
                                              disabled={
                                                  sectionsDraft.skillCategories
                                                      .length <= 1
                                              }
                                              onClick={() =>
                                                  setSectionsDraft(
                                                      (current) => ({
                                                          ...current,
                                                          skillCategories:
                                                              current.skillCategories.filter(
                                                                  (
                                                                      _,
                                                                      itemIndex
                                                                  ) =>
                                                                      itemIndex !==
                                                                      index
                                                              ),
                                                      })
                                                  )
                                              }
                                              className={
                                                  destructiveIconButtonClass
                                              }
                                          >
                                              <TrashIcon />
                                          </button>
                                      </div>
                                  </div>

                                  <div>
                                      <label
                                          htmlFor={`skills-label-${index}`}
                                          className={fieldLabelClass}
                                      >
                                          Category Label
                                      </label>
                                      <input
                                          id={`skills-label-${index}`}
                                          name={`skillCategories.${index}.label`}
                                          autoComplete="off"
                                          value={item.label}
                                          onChange={(event) =>
                                              updateSkillCategoryField(
                                                  index,
                                                  'label',
                                                  event.target.value
                                              )
                                          }
                                          placeholder="Category label"
                                          className={inputClass}
                                      />
                                  </div>

                                  <label
                                      htmlFor={`skills-wide-${index}`}
                                      className="flex items-center gap-2 rounded-xl border border-green-900/60 bg-black/30 px-3 py-3 text-sm"
                                  >
                                      <input
                                          id={`skills-wide-${index}`}
                                          name={`skillCategories.${index}.wide`}
                                          autoComplete="off"
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

                                  <div>
                                      <label
                                          htmlFor={`skills-text-${index}`}
                                          className={fieldLabelClass}
                                      >
                                          Skills (One Per Line)
                                      </label>
                                      <textarea
                                          id={`skills-text-${index}`}
                                          name={`skillCategories.${index}.skillsText`}
                                          autoComplete="off"
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
                                          className={textareaClass}
                                      />
                                  </div>
                              </div>
                          ))
                        : null}
                </div>

                <div className={panelClass}>
                    {/* Learning header */}
                    <div className="flex items-center justify-between border-b border-green-900/40 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-green-300">
                                Learning
                            </p>
                            <p className="text-[11px] text-green-700">
                                Copy and media fields for the learning section
                                embeds
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLearningOpen((open) => !open)}
                            aria-expanded={learningOpen}
                            aria-label={
                                learningOpen
                                    ? 'Collapse learning section'
                                    : 'Expand learning section'
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-800/70 text-green-400 transition hover:bg-green-900/30"
                        >
                            <ToggleArrowIcon open={learningOpen} />
                        </button>
                    </div>

                    {learningOpen ? (
                        <div className="space-y-4 p-4">
                            <div>
                                <label
                                    htmlFor="learning-heading"
                                    className={fieldLabelClass}
                                >
                                    Heading
                                </label>
                                <input
                                    id="learning-heading"
                                    name="learning.heading"
                                    autoComplete="off"
                                    value={sectionsDraft.learning.heading}
                                    onChange={(event) =>
                                        updateLearningField(
                                            'heading',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Heading"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="learning-description"
                                    className={fieldLabelClass}
                                >
                                    Description
                                </label>
                                <textarea
                                    id="learning-description"
                                    name="learning.description"
                                    autoComplete="off"
                                    value={sectionsDraft.learning.description}
                                    onChange={(event) =>
                                        updateLearningField(
                                            'description',
                                            event.target.value
                                        )
                                    }
                                    rows={4}
                                    placeholder="Description"
                                    className={textareaClass}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="learning-languages"
                                    className={fieldLabelClass}
                                >
                                    Languages (One Per Line)
                                </label>
                                <textarea
                                    id="learning-languages"
                                    name="learning.languagesText"
                                    autoComplete="off"
                                    value={sectionsDraft.learning.languagesText}
                                    onChange={(event) =>
                                        updateLearningField(
                                            'languagesText',
                                            event.target.value
                                        )
                                    }
                                    rows={3}
                                    placeholder="Languages, one per line"
                                    className={textareaClass}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="learning-bootdev-src"
                                        className={fieldLabelClass}
                                    >
                                        Boot.dev Embed URL
                                    </label>
                                    <input
                                        id="learning-bootdev-src"
                                        name="learning.bootDevSrc"
                                        autoComplete="url"
                                        value={
                                            sectionsDraft.learning.bootDevSrc
                                        }
                                        onChange={(event) =>
                                            updateLearningField(
                                                'bootDevSrc',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Boot.dev embed URL"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="learning-bootdev-alt"
                                        className={fieldLabelClass}
                                    >
                                        Boot.dev Alt Text
                                    </label>
                                    <input
                                        id="learning-bootdev-alt"
                                        name="learning.bootDevAlt"
                                        autoComplete="off"
                                        value={
                                            sectionsDraft.learning.bootDevAlt
                                        }
                                        onChange={(event) =>
                                            updateLearningField(
                                                'bootDevAlt',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Boot.dev alt text"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="learning-duolingo-src"
                                        className={fieldLabelClass}
                                    >
                                        Duolingo Embed URL
                                    </label>
                                    <input
                                        id="learning-duolingo-src"
                                        name="learning.duolingoSrc"
                                        autoComplete="url"
                                        value={
                                            sectionsDraft.learning.duolingoSrc
                                        }
                                        onChange={(event) =>
                                            updateLearningField(
                                                'duolingoSrc',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Duolingo embed URL"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="learning-duolingo-alt"
                                        className={fieldLabelClass}
                                    >
                                        Duolingo Alt Text
                                    </label>
                                    <input
                                        id="learning-duolingo-alt"
                                        name="learning.duolingoAlt"
                                        autoComplete="off"
                                        value={
                                            sectionsDraft.learning.duolingoAlt
                                        }
                                        onChange={(event) =>
                                            updateLearningField(
                                                'duolingoAlt',
                                                event.target.value
                                            )
                                        }
                                        placeholder="Duolingo alt text"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <label
                                htmlFor="learning-duolingo-unoptimized"
                                className="flex items-center gap-2 rounded-xl border border-green-900/60 bg-black/30 px-3 py-3 text-sm"
                            >
                                <input
                                    id="learning-duolingo-unoptimized"
                                    name="learning.duolingoUnoptimized"
                                    autoComplete="off"
                                    type="checkbox"
                                    checked={
                                        sectionsDraft.learning
                                            .duolingoUnoptimized
                                    }
                                    onChange={(event) =>
                                        updateLearningField(
                                            'duolingoUnoptimized',
                                            event.target.checked
                                        )
                                    }
                                    className="accent-green-500"
                                />
                                Duolingo image unoptimized
                            </label>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Save bar */}
            <div className="flex flex-col gap-3 rounded-xl border border-green-900/50 bg-black/30 p-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-green-600">
                        Section changes keep list order and overwrite the live
                        portfolio record.
                    </p>
                </div>
                <div className="flex shrink-0 gap-2 md:ml-4">
                    <button
                        type="button"
                        onClick={saveSections}
                        disabled={isSavingSections}
                        className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-500 disabled:opacity-60"
                    >
                        {isSavingSections ? <LoadingSpinner /> : <CheckIcon />}
                        {isSavingSections ? 'Saving…' : 'Save Sections'}
                    </button>
                </div>
            </div>
        </div>
    )
}
