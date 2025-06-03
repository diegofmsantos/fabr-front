import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import { Time } from '@/types/time'
import { getTimes } from '@/api/api'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { NoStats } from '../ui/NoStats'
import { TeamRankingCard } from './TimeRankingCard'
import { calculateTeamStat } from '@/utils/services/StatsServices'

interface TeamRankingGroupProps {
    title: string
    stats: { key: string; title: string }[]
    teamStats: any[]
}

const SLIDER_SETTINGS = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1.5,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 1.2,
                slidesToScroll: 1,
            },
        },
    ],
}

export const TeamRankingGroup: React.FC<TeamRankingGroupProps> = ({ title, stats, teamStats }) => {
    const [times, setTimes] = useState<Time[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                setIsLoading(true)
                const timesData = await getTimes()
                setTimes(timesData)
            } catch (error) {
                console.error('Error fetching times:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTimes()
    }, [])


    const normalizeValue = (value: number | null, key: string, title: string): string => {
        if (value === null) return 'N/A';
        
        if (key.includes('percentual') || key === 'field_goals' || key === 'extra_points' || 
            title.includes('(%)') || title === 'FG(%)' || title === 'XP(%)') {
            return `${Math.round(value)}%`;
        }
        
        if (key.includes('media') || title.includes('(AVG)')) {
            return value.toFixed(1).replace('.', ',');
        }
        
        return Math.round(value).toLocaleString('pt-BR');
    }

    const getTeamInfo = (timeId: number) => {
        const team = times.find((t) => t.id === timeId)
        return {
            nome: team?.nome || 'Time Desconhecido',
            cor: team?.cor || '#CCCCCC',
        }
    }

    if (isLoading) {
        return <div className="p-4">Carregando estatísticas de times...</div>
    }

    return (
        <div className="mb-6 pl-4 py-8 overflow-x-hidden overflow-y-hidden mx-auto xl:px-12 xl:overflow-x xl:overflow-y">
            <h2 className="text-4xl pl-2 font-extrabold italic mb-4 leading-[30px] tracking-[-2px] lg:pl-16 xl:pl-20">{title}</h2>
            <Slider {...SLIDER_SETTINGS}>
                {stats.map((stat, index) => {
                    const rankedTeams = teamStats
                        .map(teamStat => ({
                            teamId: teamStat.timeId,
                            value: calculateTeamStat(teamStat, stat.key)
                        }))
                        .filter(team => team.value !== null && team.value > 0)
                        .sort((a, b) => {
                            if (a.value === null && b.value === null) return 0;
                            if (a.value === null) return 1;
                            if (b.value === null) return -1;
                            return b.value - a.value;
                        })
                        .slice(0, 5);

                    if (rankedTeams.length === 0) {
                        return (
                            <div key={index}>
                                <div className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">
                                    {stat.title}
                                </div>
                                <NoStats />
                            </div>
                        )
                    }

                    return (
                        <div key={index}>
                            <TeamRankingCard
                                title={stat.title}
                                category={title}
                                teams={rankedTeams.map((team, teamIndex) => {
                                    const teamInfo = getTeamInfo(team.teamId)
                                    return {
                                        id: team.teamId,
                                        name: teamInfo.nome,
                                        value: normalizeValue(team.value, stat.key, stat.title),
                                        teamColor: teamIndex === 0 ? teamInfo.cor : undefined,
                                        isFirst: teamIndex === 0,
                                    }
                                })}
                            />
                        </div>
                    )
                })}
            </Slider>
        </div>
    )
}