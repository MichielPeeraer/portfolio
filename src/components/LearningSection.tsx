'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function LearningSection() {
    return (
        <section id="learning" className="relative z-10 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-bold mb-4 text-green-300"
                >
                    Continuous Learning
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-green-400 mb-8"
                >
                    Currently grinding through Boot.dev — back-end development,
                    algorithms, and computer science fundamentals.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    whileHover={{ y: -4 }}
                >
                    <div className="crt-lines rounded-lg inline-block">
                        <Image
                            src="https://api.boot.dev/v1/users/public/196f7e84-b6b7-4b3a-b28c-a0d5f98f60d2/thumbnail"
                            alt="Boot.dev progress"
                            width={500}
                            height={150}
                            sizes="(max-width: 640px) 100vw, 500px"
                            className="rounded-lg grayscale block"
                            style={{ width: '100%', height: 'auto' }}
                            unoptimized
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
