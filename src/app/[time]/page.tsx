"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import { ButtonTime } from "@/components/ui/buttonTime"
import { ButtonSetor } from "@/components/ui/buttonSetor"
import { Jogador } from "@/components/Jogador"
import { CurrentTime } from "@/components/Time"
import { motion, useScroll, useTransform } from "framer-motion"
import { getTimes } from "../../api/api"
import { Time } from "@/types/time"
import { Loading } from "@/components/ui/Loading"
import { SelectFilter } from "@/components/SelectFilter"
import TeamNameHeader from "@/components/TeamHeader"

type Setor = "ATAQUE" | "DEFESA" | "SPECIAL"

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const timeName = Array.isArray(params.time) ? params.time[0] : params.time

  const [currentTeam, setCurrentTeam] = useState<Time | null>(null)
  const [loadingTeam, setLoadingTeam] = useState(true)
  const [loadingJogadores, setLoadingJogadores] = useState(false)
  const [selectedButton, setSelectedButton] = useState(searchParams.get("show") || "bio")
  const [selectedSetor, setSelectedSetor] = useState<Setor>((searchParams.get("setor") as Setor) || "ATAQUE")
  const [season, setSeason] = useState('2024');

  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  const height = useTransform(scrollY, [0, 200], [330, 50])

  useEffect(() => {
    async function fetchCurrentTeam() {
      setLoadingTeam(true)
      try {
        if (!timeName) {
          throw new Error("Nome do time não encontrado.")
        }

        const teams = await getTimes()
        const team = teams?.find(
          (t) =>
            t.nome &&
            t.nome.toLowerCase() === decodeURIComponent(timeName).toLowerCase()
        ) || null
        setCurrentTeam(team)

        if (team && team.nome) {
          document.title = `${team.nome}`
        } else {
          document.title = "Time não encontrado"
        }
      } catch (error) {
        console.error("Erro ao buscar os times:", error)
        document.title = "Erro ao carregar time"
        setCurrentTeam(null)
      } finally {
        setLoadingTeam(false)
      }
    }

    fetchCurrentTeam()
  }, [timeName]);

  const handleShowBio = () => {
    router.replace(`?show=bio`)
    setSelectedButton("bio")
  }

  const handleShowJogadores = async () => {
    setSelectedButton("jogadores")
    setLoadingJogadores(true)
    router.replace(`?show=jogadores&setor=${encodeURIComponent(selectedSetor)}`)
    setLoadingJogadores(false)
  }

  const handleSetorChange = (setor: Setor) => {
    setSelectedSetor(setor)
    router.replace(`?show=jogadores&setor=${encodeURIComponent(setor)}`)
  }

  if (loadingTeam) { return <Loading /> }

  if (!currentTeam) { return <div>Time não encontrado</div> }

  const capacetePath = `/assets/times/capacetes/${currentTeam.capacete || "default-capacete.png"}`

  return (
    <div className="pt-20 pb-14 bg-[#ECECEC]">
      <TeamNameHeader teamName={currentTeam?.nome} />
      <motion.div className="fixed z-50 w-full" style={{ height }}>
        <motion.div
          className="p-4 w-full h-full flex flex-col justify-center items-center rounded-b-xl max-w-[1200px] mx-auto"
          style={{ backgroundColor: currentTeam.cor || "#000" }}
        >
          <button
            onClick={() => router.back()}
            className="absolute top-2 left-5 rounded-xl text-xs text-white py-1 px-2 bg-black/20 xl:left-32 2xl:left-96 3xl:56"
          >
            {currentTeam.sigla || "N/A"}
            <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
          </button>
          <TeamNameHeader teamName={currentTeam?.nome} />
          <motion.div className="flex flex-col justify-center items-center md:mb-4" style={{ opacity, pointerEvents: 'none' }}>
            <div className="text-[45px] mt-2 text-white text-center px-6 font-extrabold italic leading-[35px] tracking-[-3px] md:text-5xl md:mt-4">
              {currentTeam.nome?.toLocaleUpperCase() || "Time Indefinido"}
            </div>

            {currentTeam.capacete && (
              <div className="w-40 h-40 rotate-[15deg] -mt-6">
                <Image
                  src={capacetePath}
                  alt="capacete do time"
                  width={160}
                  height={160}
                  quality={100}
                  style={{ width: '160px', height: '160px', objectFit: 'contain' }}
                  priority
                />
              </div>
            )}
          </motion.div>

          <motion.div className="flex justify-between gap-8 mt-4 md:mt-8" style={{ opacity }}>
            <ButtonTime
              label="BIO"
              onClick={handleShowBio}
              isSelected={selectedButton === "bio"}
            />
            <ButtonTime
              label="JOGADORES"
              onClick={handleShowJogadores}
              isSelected={selectedButton === "jogadores"}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {selectedButton === "jogadores" && (
        <motion.div
          className="w-full pt-[350px] xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto xl:mb-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sticky top-[55px] w-full xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto z-40 bg-[#ECECEC]">
            <div className="w-full mt-4 flex justify-center">
              <SelectFilter
                label="TEMPORADA"
                value={season}
                onChange={setSeason}
                options={[
                  { label: '2024', value: '2024' },
                  { label: '2025', value: '2025' }
                ]}
              />
            </div>
            <section className="w-full flex items-center justify-between gap-5 py-5 px-4 md:px-6">
              <ButtonSetor
                label="ATAQUE"
                borderColor={currentTeam.cor || "#000"}
                isSelected={selectedSetor === "ATAQUE"}
                onClick={() => handleSetorChange("ATAQUE")}
              />
              <ButtonSetor
                label="DEFESA"
                borderColor={currentTeam.cor || "#000"}
                isSelected={selectedSetor === "DEFESA"}
                onClick={() => handleSetorChange("DEFESA")}
              />
              <ButtonSetor
                label="SPECIAL"
                borderColor={currentTeam.cor || "#000"}
                isSelected={selectedSetor === "SPECIAL"}
                onClick={() => handleSetorChange("SPECIAL")}
              />
            </section>
          </div>
          <div className="xl:border min-h-screen">
            <Jogador currentTeam={currentTeam} selectedSetor={selectedSetor} />
          </div>
        </motion.div>
      )}

      {selectedButton === "bio" && (
        <motion.div
          className="pt-[350px]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <CurrentTime currentTeam={currentTeam} />
        </motion.div>
      )}
    </div>
  )
}