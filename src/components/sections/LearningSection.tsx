import Image from 'next/image'
import { Reveal } from '@/components/ui'
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                    {data.embeds.map((embed, index) => (
                        <Reveal
                            key={`${embed.src}-${index}`}
                            y={24}
                            delay={0.2 + index * 0.08}
                            className={embed.wide ? 'sm:col-span-2' : undefined}
                        >
                            <div className="transition-transform duration-300 hover:-translate-y-1">
                                <div className="crt-lines rounded-lg block w-full">
                                    <Image
                                        src={embed.src}
                                        alt={embed.alt}
                                        width={500}
                                        height={150}
                                        unoptimized={embed.unoptimized}
                                        referrerPolicy="no-referrer"
                                        sizes={
                                            embed.wide
                                                ? '(max-width: 639px) 100vw, 100vw'
                                                : '(max-width: 639px) 100vw, 50vw'
                                        }
                                        className="rounded-lg grayscale block"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                        }}
                                    />
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
