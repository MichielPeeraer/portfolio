import Reveal from './Reveal'

interface AboutSectionProps {
    about: string
}

export default function AboutSection({ about }: AboutSectionProps) {
    return (
        <section id="about" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <Reveal x={-30}>
                    <h2 className="text-4xl font-bold mb-8 text-green-300">
                        About
                    </h2>
                </Reveal>

                <Reveal x={30} delay={0.1}>
                    <p className="text-lg leading-relaxed">{about}</p>
                </Reveal>
            </div>
        </section>
    )
}
