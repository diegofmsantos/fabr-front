"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Time } from "@/types/time"
import { getTimes } from "@/api/api"
import { TimeSkeleton } from "./ui/TimeSkeleton"

export const Lista = () => {
    const itemVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    }

    const [times, setTimes] = useState<Time[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch dos times quando o componente é montado
    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const data = await getTimes()
                setTimes(data)
            } catch (error) {
                console.error("Erro ao buscar os times:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchTimes()
    }, [])

    return (
        <div className="h-screen">
            <header className="w-full h-28 rounded-b-xl bg-black flex justify-center items-center px-2 fixed z-50">
                <Image
                    src={`/assets/logo-fabr-color.png`}
                    width={130}
                    height={130}
                    alt="logo-fabr"
                    quality={100}
                    className="w-auto h-auto"
                />
            </header>

            <div>
                <h1 className="text-[53px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-32 tracking-[-5px]">
                    ESCOLHA SEU TIME
                </h1>
                <div className="h-screen bg-[#ECECEC]">

                    {loading ? (
                        <TimeSkeleton />
                    ) : (
                        <motion.div
                            className="grid grid-cols-4 gap-4 p-3 bg-[#ECECEC] relative"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } },
                            }}
                        >
                            {times
                                .sort((a, b) => (a.sigla ?? '').localeCompare(b.sigla ?? ''))
                                .map((item) => (
                                    <motion.div
                                        key={item.nome}
                                        variants={itemVariants}
                                        className="relative border border-gray-300 rounded-lg overflow-hidden group"
                                    >
                                        <Link href={`/${item.nome}`} className="relative z-20">
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity"
                                                style={{ backgroundColor: item.cor ?? '#000' }}
                                            ></div>
                                            <div className="relative text-center font-extrabold italic z-10 min-[320px]:text-[22px] min-[400px]:text-[31px] md:text-[45px]">
                                                <div>{item.sigla ?? 'N/A'}</div>
                                                <div className="flex flex-col -mt-6 justify-center items-center gap-2 min-h-28 p-2">
                                                    <Image
                                                        src={`/assets/times/capacetes/${item.capacete}`}
                                                        alt="Logo"
                                                        width={90}
                                                        height={90}
                                                        quality={100}
                                                        className="w-auto h-auto"
                                                    />
                                                    <Image
                                                        src={`/assets/times/logos/${item.logo}`}
                                                        alt="Logo"
                                                        width={35}
                                                        height={35}
                                                        quality={100}
                                                        className="w-auto h-auto"
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}