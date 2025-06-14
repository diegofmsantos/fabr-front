import { statMappings } from "@/utils/constants/statMappings"
import { formatValue } from "@/utils/services/FormatterService"
import { ImageService, UrlService } from "@/utils/services/ImageService"
import Image from "next/image"
import Link from "next/link"

interface PlayerCardProps {
  id: number
  name: string
  team: string
  value: string
  camisa: string
  teamColor?: string
  teamLogo?: string
  isFirst?: boolean
}

interface RankingCardProps {
  title: string
  category: string
  stat?: string
  players: PlayerCardProps[]
}

export const RankingCard: React.FC<RankingCardProps> = ({ title, category, players, stat }) => {

  const getStatsUrl = (): string => {
    if (stat) {
      for (const [urlParam, mapping] of Object.entries(statMappings)) {
        if (mapping.key === stat) {
          return `/ranking/stats?stat=${urlParam}`;
        }
      }
    }

    // Usa UrlService em vez de normalizeForFilePath bugada
    return UrlService.getPlayerStatsUrl(category, title);
  }

  return (
    <div className="ranking-card-container px-3">
      <h3 className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">{title}</h3>
      <ul className="flex flex-col text-white h-full">
        {players.map((player, index) => {
          const teamLogoPath = player.teamLogo?.toLowerCase().replace(/\s/g, "-") || ImageService.getTeamLogo(player.team);

          return (
            <li
              key={index}
              className={`flex items-center justify-center p-2 px-4 border-b border-b-[#D9D9D9] rounded-md xl:w-[450px] ${player.isFirst ?
                "bg-gray-100 text-black shadow-lg" : "bg-white text-black"
                }`}
              style={{ backgroundColor: player.isFirst ? player.teamColor : undefined }}
            >
              <Link
                href={getStatsUrl()}
                className="w-full"
              >
                {player.isFirst ? (
                  <div className="flex justify-between items-center w-full text-white md:px-10 lg:pr-6 xl:px-4">
                    <div className="flex flex-col justify-center">
                      <p className="text-[25px] font-bold">{index + 1}</p>
                      <h4 className="font-bold flex flex-col leading-tight">
                        <span className="text-[12px] font-extrabold italic leading-4 uppercase">{player.name.split(" ")[0]}</span>
                        <span className="text-2xl font-extrabold italic leading-4 uppercase">{player.name.split(" ").slice(1).join(" ")}</span>
                      </h4>
                      <div className="flex items-center gap-1 min-w-32 max-[374px]:hidden">
                        <Image src={teamLogoPath} width={40} height={40} alt={`Logo do time ${player.team}`} />
                        <p className="text-[10px] xl:text-xs">{player.team}</p>
                      </div>
                      <span className="font-extrabold italic text-[40px] max-[374px]:mt-4">
                        {formatValue(player.value, title)}
                      </span>
                    </div>
                    <div className="relative w-[200px] h-[200px]">
                      <Image
                        src={ImageService.getPlayerShirt(player.team, player.camisa)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={`Camisa`}
                        className="object-contain"
                        priority
                        quality={100}
                        onError={(e) => ImageService.handlePlayerShirtError(e, player.team, player.camisa)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-auto flex justify-between items-center gap-2 md:px-10 lg:px-4">
                    <div className="flex items-center lg:gap-2">
                      <span className="font-bold flex items-center gap-1 mr-1 max-[374px]:gap-1 lg:gap-3">
                        <div>{index + 1}</div>
                        <Image src={teamLogoPath} width={40} height={40} alt={`Logo do time ${player.team}`} className="max-[374px]:hidden" />
                      </span>
                      <div className="flex flex-col ">
                        <div className="text-[12px] min-[375px]:font-bold min-[375px]:text-sm">{player.name}</div>
                        <div className="font-light text-[13px] max-[374px]:hidden">{player.team}</div>
                      </div>
                    </div>
                    <span className="font-bold text-sm min-[375px]:text-lg">
                      {formatValue(player.value, title)}
                    </span>
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      {players.length > 0 && (
        <Link
          href={getStatsUrl()}
          className="block text-center border border-gray-400 bg-white text-[17px] text-black font-bold py-1 mt-1 rounded-md hover:bg-[#C1C2C3] xl:w-[450px]"
        >
          Ver Mais
        </Link>
      )}
    </div>
  )
}