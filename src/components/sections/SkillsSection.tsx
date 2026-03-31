'use client'

import { motion } from 'framer-motion'
import { SkillCard } from '@/components/cards'
import { getSkillLabel } from '@/lib/skill-icons'
import { Reveal } from '@/components/ui'
import type { SkillCategory } from '@/types'

interface SkillsSectionProps {
    skillCategories: SkillCategory[]
    devPractices: string[]
}

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.05,
        },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    },
}

export default function SkillsSection({
    skillCategories,
    devPractices,
}: SkillsSectionProps) {
    return (
        <section id="skills" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <Reveal x={-30}>
                    <h2 className="text-4xl font-bold mb-8 text-green-300">
                        Skills
                    </h2>
                </Reveal>

                {/* Skill categories grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {skillCategories.map((category) => {
                        const isToolingCategory =
                            category.label === 'Tooling & DevOps'

                        return (
                            <motion.div
                                key={category.label}
                                variants={cardVariants}
                                className={`border border-green-400/30 rounded-lg p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-green-300/60 hover:shadow-[0_0_28px_rgba(74,222,128,0.14)] ${
                                    isToolingCategory ? 'sm:col-span-2' : ''
                                }`}
                            >
                                <h3 className="text-sm font-bold uppercase tracking-widest text-green-500 mb-3">
                                    {category.label}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill) => (
                                        <SkillCard
                                            key={`${category.label}-${getSkillLabel(skill)}`}
                                            skill={skill}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Dev Practices */}
                <motion.div
                    initial={{ opacity: 0, y: 28, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="border border-green-400/30 rounded-lg p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-green-300/60 hover:shadow-[0_0_28px_rgba(74,222,128,0.14)]"
                >
                    <h3 className="text-sm font-bold uppercase tracking-widest text-green-500 mb-3">
                        Dev Practices
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {devPractices.map((practice) => (
                            <SkillCard key={practice} skill={practice} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
