import Image from 'next/image'
import Reveal from './Reveal'

export default function LearningSection() {
    return (
        <section id="learning" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <Reveal x={-30}>
                    <h2 className="text-4xl font-bold mb-4 text-green-300">
                        Continuous Learning
                    </h2>
                </Reveal>

                <Reveal x={30} delay={0.1}>
                    <p className="text-green-400 mb-8">
                        Currently grinding through Boot.dev — back-end
                        development, algorithms, and computer science
                        fundamentals.
                    </p>
                </Reveal>

                <Reveal y={24} delay={0.2}>
                    <div className="transition-transform duration-300 hover:-translate-y-1">
                        <div className="crt-lines rounded-lg inline-block">
                            <Image
                                src="https://api.boot.dev/v1/users/public/196f7e84-b6b7-4b3a-b28c-a0d5f98f60d2/thumbnail"
                                alt="Boot.dev progress"
                                width={500}
                                height={150}
                                sizes="(max-width: 640px) 100vw, 500px"
                                className="rounded-lg grayscale block"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
