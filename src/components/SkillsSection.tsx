'use client'

import { motion } from 'framer-motion'
import SkillCard from './SkillCard'
import Reveal from './Reveal'
import type { SkillCategory } from '@/types'

interface SkillsSectionProps {
    skillCategories: SkillCategory[]
    devPractices: string[]
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    {skillCategories.map((category, catIdx) => (
                        <motion.div
                            key={category.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.45,
                                delay: catIdx * 0.08,
                            }}
                            className="border border-green-400/30 rounded-lg p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-green-300/60 hover:shadow-[0_0_28px_rgba(74,222,128,0.14)]"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-widest text-green-500 mb-3">
                                {category.label}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill, skillIdx) => (
                                    <SkillCard
                                        key={`${category.label}-${skill}`}
                                        skill={skill}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Dev Practices */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: 0.28 }}
                    className="border border-green-400/30 rounded-lg p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-green-300/60 hover:shadow-[0_0_28px_rgba(74,222,128,0.14)]"
                >
                    <h3 className="text-sm font-bold uppercase tracking-widest text-green-500 mb-3">
                        Dev Practices
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {devPractices.map((practice, practiceIdx) => (
                            <SkillCard key={practice} skill={practice} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
