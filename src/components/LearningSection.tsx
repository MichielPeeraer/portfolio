import Image from 'next/image'
import Reveal from './Reveal'
import type { LearningInfo } from '@/types'

interface LearningSectionProps {
    data: LearningInfo
}

export default function LearningSection({ data }: LearningSectionProps) {
    const languageList = data.languages.join(', ')

    return (
        <section id="learning" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <Reveal x={-30}>
                    <h2 className="text-4xl font-bold mb-4 text-green-300">
                        {data.heading}
                    </h2>
                </Reveal>

                <Reveal x={30} delay={0.1}>
                    <p className="text-green-400 mb-8">
                        {data.description} {languageList}.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <Reveal y={24} delay={0.2}>
                        <div className="transition-transform duration-300 hover:-translate-y-1">
                            <div className="crt-lines rounded-lg block w-full">
                                <Image
                                    src={data.bootDevEmbed.src}
                                    alt={data.bootDevEmbed.alt}
                                    width={500}
                                    height={150}
                                    sizes="(max-width: 767px) 100vw, 50vw"
                                    className="rounded-lg block"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        </div>
                    </Reveal>

                    <Reveal y={24} delay={0.28}>
                        <div className="transition-transform duration-300 hover:-translate-y-1">
                            <div className="crt-lines rounded-lg block w-full">
                                <Image
                                    src={data.duolingoEmbed.src}
                                    alt={data.duolingoEmbed.alt}
                                    width={500}
                                    height={150}
                                    unoptimized={data.duolingoEmbed.unoptimized}
                                    sizes="(max-width: 767px) 100vw, 50vw"
                                    className="rounded-lg block"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
