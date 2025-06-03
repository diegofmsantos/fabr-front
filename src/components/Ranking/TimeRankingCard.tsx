import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { statMappings } from '@/utils/constants/statMappings'
import { formatValue } from '@/utils/services/FormatterService'
import { ImageService, UrlService } from '@/utils/services/ImageService'

interface TeamCardProps {
    id: number
    name: string
    value: string
    teamColor?: string
    isFirst?: boolean
}

interface TeamRankingCardProps {
    title: string
    category: string
    teams: TeamCardProps[]
}

export const TeamRankingCard: React.FC<TeamRankingCardProps> = ({ title, category, teams }) => {
    const validTeams = teams.filter(team => {
        if (typeof team.value === 'string' && team.value.includes('%')) {
            return true;
        }
        const value = parseFloat(team.value);
        return !isNaN(value) && value > 0;
    });

    const getViewMoreUrl = (category: string, title: string): string => {
        const normalizedTitle = title.toUpperCase().replace(/\s+/g, ' ').trim();

        for (const [urlParam, mapping] of Object.entries(statMappings)) {
            if (urlParam.startsWith(category.toLowerCase()) &&
                mapping.title.toUpperCase() === normalizedTitle) {
                return `/ranking/times/stats?stat=${urlParam}`;
            }
        }

        return UrlService.getTeamStatsUrl(category, title);
    }

    const sortedTeams = validTeams
        .sort((a, b) => {
            let valueA = parseFloat(a.value.replace(/\./g, '').replace(/,/g, '.'));
            let valueB = parseFloat(b.value.replace(/\./g, '').replace(/,/g, '.'));

            if (isNaN(valueA) || isNaN(valueB)) {
                return a.name.localeCompare(b.name);
            }

            if (valueB === valueA) return a.name.localeCompare(b.name);
            return valueB - valueA;
        })
        .map((team, index) => ({
            ...team,
            isFirst: index === 0
        }));

    if (sortedTeams.length === 0) return null;

    return (
        <div className="ranking-card-container px-3">
            <h3 className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">
                {title}
            </h3>
            
            <ul className="flex flex-col text-white h-full">
                {sortedTeams.map((team, index) => (
                    <li
                        key={`${team.id}-${index}`}
                        className={`flex items-center justify-center p-2 px-4 border-b border-b-[#D9D9D9] rounded-md xl:w-[450px]
                            ${team.isFirst ? "bg-gray-100 text-black shadow-lg" : "bg-white text-black"}`}
                        style={{
                            backgroundColor: team.isFirst ? team.teamColor : undefined,
                        }}
                    >
                        <Link
                            href={getViewMoreUrl(category, title)}
                            className="w-full"
                        >
                            {team.isFirst ? (
                                <div className="flex justify-between items-center w-full text-white md:px-10 lg:px-10">
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[25px] font-bold">{index + 1}</p>
                                        <div className='flex flex-col gap-2'>
                                            <h4 className="font-extrabold italic leading-4 text-xl uppercase">
                                                {team.name}
                                            </h4>
                                            
                                            <Image
                                                src={ImageService.getTeamLogo(team.name)}
                                                width={60}
                                                height={60}
                                                alt={`Logo do time ${team.name}`}
                                                onError={(e) => ImageService.handleTeamLogoError(e, team.name)}
                                            />
                                            
                                            <span className="font-extrabold italic text-4xl mt-2">
                                                {team.value}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="relative w-[200px] h-[200px]">
                                        <Image
                                            src={ImageService.getTeamHelmet(team.name)}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            alt={`Capacete do ${team.name}`}
                                            className="object-contain"
                                            priority
                                            quality={100}
                                            onError={(e) => ImageService.handleTeamHelmetError(e, team.name)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-auto flex justify-between items-center gap-2 px-2 md:px-10 lg:px-10">
                                    <div className="flex items-center gap-2 max-[374px]:gap-1">
                                        <span className="font-bold text-[14px]">{index + 1}</span>
                                        
                                        <Image
                                            src={ImageService.getTeamLogo(team.name)}
                                            width={40}
                                            height={40}
                                            alt={`Logo do time ${team.name}`}
                                            onError={(e) => ImageService.handleTeamLogoError(e, team.name)}
                                        />
                                        
                                        <div className="text-sm">{team.name}</div>
                                    </div>
                                    
                                    <span className="font-bold text-lg">
                                        {formatValue(team.value, title)}
                                    </span>
                                </div>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
            
            <Link
                href={getViewMoreUrl(category, title)}
                className="block text-center border border-gray-400 bg-white text-[17px] text-black font-bold py-1 mt-1 rounded-md hover:bg-[#C1C2C3] xl:mr-6"
            >
                Ver Mais
            </Link>
        </div>
    )
}