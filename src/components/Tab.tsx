"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Sobre } from "./Sobre"

interface TabProps {
  className?: string;
}

export const Tab: React.FC<TabProps> = ({ className = '' }) => {
  const pathname = usePathname()
  const isRankingRoute = pathname.startsWith('/ranking')
  const isNoticiasRoute = pathname.startsWith('/noticias')
  const isMercadoRoute = pathname.startsWith('/mercado')
  const isCompararRoute = pathname.startsWith('/comparar-times')
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <>
      <div className={`fixed bottom-0 w-full bg-[#272731] shadow-md border-t flex justify-around items-center py-2 z-50 ${className} xl:hidden`}>
        <Link href="/">
          <div className={`flex flex-col items-center ${!isRankingRoute && !isNoticiasRoute && !isMercadoRoute && !isCompararRoute ? "text-[#63E300]" : "text-gray-400"}`}>
            <Image
              src={!isRankingRoute && !isNoticiasRoute && !isMercadoRoute && !isCompararRoute ? "/assets/logo-capacete-verde.png" : "/assets/logo-capacete-branco.png"}
              alt="capacete"
              width={25}
              height={25}
            />
            <span className="text-[12px]">Times</span>
          </div>
        </Link>

        <Link href="/ranking">
          <div className={`flex flex-col items-center ${isRankingRoute ? "text-[#63E300]" : "text-gray-400"}`}>
            <Image
              src={isRankingRoute ? "/assets/ranking2.png" : "/assets/ranking.png"}
              alt="ranking"
              width={25}
              height={25}
            />
            <span className="text-[12px]">Ranking</span>
          </div>
        </Link>

        <Link href="/comparar-times">
          <div className={`flex flex-col items-center ${isCompararRoute ? "text-[#63E300]" : "text-gray-400"}`}>
            <Image
              src={isCompararRoute ? "/assets/compare-active.png" : "/assets/compare.png"}
              alt=""
              width={25}
              height={25}
            />
            <span className="text-[12px]">Comparar</span>
          </div>
        </Link>

        <Link href="/mercado">
          <div className={`flex flex-col items-center ${isMercadoRoute ? "text-[#63E300]" : "text-gray-400"}`}>
            <Image
              src={isMercadoRoute ? "/assets/transfer.png" : "/assets/transfer.png"}
              alt="mercado"
              width={25}
              height={25}
            />
            <span className="text-[12px]">Mercado</span>
          </div>
        </Link>

        <Link href="/noticias">
          <div className={`flex flex-col items-center ${isNoticiasRoute ? "text-[#63E300]" : "text-gray-400"}`}>
            <Image
              src={isNoticiasRoute ? "/assets/news2.png" : "/assets/news.png"}
              alt="noticias"
              width={25}
              height={25}
            />
            <span className="text-[12px]">Notícias</span>
          </div>
        </Link>

        <button
          onClick={() => setIsAboutOpen(true)}
          className="flex flex-col items-center text-gray-400 hover:text-[#63E300] transition-colors"
        >
          <Menu size={30} />
        </button>
      </div>

      <Sobre isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  )
}