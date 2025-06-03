"use client"

import React from 'react';

interface StatComparisonCardProps {
    title: string;
    stat1: string;
    stat2: string;
    color1: string;
    color2: string;
}

const StatComparisonCard: React.FC<StatComparisonCardProps> = ({
    title, stat1, stat2, color1, color2
}) => {
    const num1 = parseFloat(stat1.replace(/[^0-9.]/g, ''));
    const num2 = parseFloat(stat2.replace(/[^0-9.]/g, ''));

    const isFirstBetter = !isNaN(num1) && !isNaN(num2) && num1 > num2;
    const isSecondBetter = !isNaN(num1) && !isNaN(num2) && num2 > num1;
    const isEqual = num1 === num2;

    return (
        <div className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-bold mb-4 text-center">{title}</h3>
            <div className="grid grid-cols-2 gap-2">
                <div
                    className={`p-3 rounded-md text-center font-bold text-2xl ${isFirstBetter ? 'bg-green-100' : isEqual ? 'bg-gray-100' : ''}`}
                    style={{ color: color1 }}
                >
                    {stat1}
                </div>
                <div
                    className={`p-3 rounded-md text-center font-bold text-2xl ${isSecondBetter ? 'bg-green-100' : isEqual ? 'bg-gray-100' : ''}`}
                    style={{ color: color2 }}
                >
                    {stat2}
                </div>
            </div>
        </div>
    );
};

interface PlayerComparisonCardProps {
    title: string;
    player1: any;
    player2: any;
    team1: any;
    team2: any;
    statKey: string;
    statCategory: 'passe' | 'corrida' | 'recepcao' | 'retorno' | 'defesa' | 'kicker' | 'punter';
}

const PlayerComparisonCard: React.FC<PlayerComparisonCardProps> = ({
    title, player1, player2, team1, team2, statKey, statCategory
}) => {
    const getValue = (player: any) => {
        if (!player || !player.estatisticas) return 'N/A';
        const stats = player.estatisticas[statCategory];
        if (!stats) return 'N/A';
        return stats[statKey] || 0;
    };

    const value1 = getValue(player1);
    const value2 = getValue(player2);

    const isFirstBetter = value1 !== 'N/A' && value2 !== 'N/A' && value1 > value2;
    const isSecondBetter = value1 !== 'N/A' && value2 !== 'N/A' && value2 > value1;
    const isEqual = value1 === value2 && value1 !== 'N/A';

    return (
        <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
            <h4 className="text-md font-bold mb-2">{title}</h4>
            <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded-md ${isFirstBetter ? 'bg-green-100' : isEqual ? 'bg-gray-200' : ''}`}>
                    {player1 ? (
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-bold" style={{ color: team1.cor }}>{player1.nome}</p>
                                <p className="text-sm">{typeof value1 === 'number' ? value1.toLocaleString('pt-BR') : value1}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Nenhum destaque</p>
                    )}
                </div>

                <div className={`p-2 rounded-md ${isSecondBetter ? 'bg-green-100' : isEqual ? 'bg-gray-200' : ''}`}>
                    {player2 ? (
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-bold" style={{ color: team2.cor }}>{player2.nome}</p>
                                <p className="text-sm">{typeof value2 === 'number' ? value2.toLocaleString('pt-BR') : value2}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Nenhum destaque</p>
                    )}
                </div>
            </div>
        </div>
    );
};

interface StatisticsComparisonProps {
    comparisonData: any;
}

export const StatisticsComparison: React.FC<StatisticsComparisonProps> = ({ comparisonData }) => {
    const calculatePercentage = (made: number, attempted: number): string => {
        return attempted > 0 ? `${Math.round((made / attempted) * 100)}%` : '0%';
    };

    const calculateAverage = (total: number, attempts: number): string => {
        return attempts > 0 ? `${(total / attempts).toFixed(1)} jardas` : '0,0 jardas';
    };

    return (
        <div>
            {/* Seção de Estatísticas de Passe */}
            <div className="mt-4">
                <h2 className="text-2xl font-bold mb-4 bg-[#373740] text-white p-2 inline-block rounded-md">PASSE</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatComparisonCard
                        title="JARDAS DE PASSE"
                        stat1={(comparisonData.teams.time1.estatisticas?.passe?.jardas_de_passe || 0).toLocaleString('pt-BR')}
                        stat2={(comparisonData.teams.time2.estatisticas?.passe?.jardas_de_passe || 0).toLocaleString('pt-BR')}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="PASSES"
                        stat1={`${comparisonData.teams.time1.estatisticas?.passe?.passes_completos || 0}/${comparisonData.teams.time1.estatisticas?.passe?.passes_tentados || 0}`}
                        stat2={`${comparisonData.teams.time2.estatisticas?.passe?.passes_completos || 0}/${comparisonData.teams.time2.estatisticas?.passe?.passes_tentados || 0}`}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="PERCENTUAL DE PASSES"
                        stat1={calculatePercentage(
                            comparisonData.teams.time1.estatisticas?.passe?.passes_completos || 0,
                            comparisonData.teams.time1.estatisticas?.passe?.passes_tentados || 1
                        )}
                        stat2={calculatePercentage(
                            comparisonData.teams.time2.estatisticas?.passe?.passes_completos || 0,
                            comparisonData.teams.time2.estatisticas?.passe?.passes_tentados || 1
                        )}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="TOUCHDOWNS (PASSE)"
                        stat1={(comparisonData.teams.time1.estatisticas?.passe?.td_passados || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.passe?.td_passados || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="INTERCEPTAÇÕES SOFRIDAS"
                        stat1={(comparisonData.teams.time1.estatisticas?.passe?.interceptacoes_sofridas || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.passe?.interceptacoes_sofridas || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="SACKS SOFRIDOS"
                        stat1={(comparisonData.teams.time1.estatisticas?.passe?.sacks_sofridos || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.passe?.sacks_sofridos || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 bg-[#373740] text-white p-2 inline-block rounded-md">CORRIDA</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatComparisonCard
                        title="JARDAS DE CORRIDA"
                        stat1={(comparisonData.teams.time1.estatisticas?.corrida?.jardas_corridas || 0).toLocaleString('pt-BR')}
                        stat2={(comparisonData.teams.time2.estatisticas?.corrida?.jardas_corridas || 0).toLocaleString('pt-BR')}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="CORRIDAS"
                        stat1={(comparisonData.teams.time1.estatisticas?.corrida?.corridas || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.corrida?.corridas || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="TOUCHDOWNS (CORRIDA)"
                        stat1={(comparisonData.teams.time1.estatisticas?.corrida?.tds_corridos || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.corrida?.tds_corridos || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="FUMBLES DE CORREDOR"
                        stat1={(comparisonData.teams.time1.estatisticas?.corrida?.fumble_de_corredor || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.corrida?.fumble_de_corredor || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 bg-[#373740] text-white p-2 inline-block rounded-md">RECEPÇÃO</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatComparisonCard
                        title="JARDAS DE RECEPÇÃO"
                        stat1={(comparisonData.teams.time1.estatisticas?.recepcao?.jardas_recebidas || 0).toLocaleString('pt-BR')}
                        stat2={(comparisonData.teams.time2.estatisticas?.recepcao?.jardas_recebidas || 0).toLocaleString('pt-BR')}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="RECEPÇÕES/ALVOS"
                        stat1={`${comparisonData.teams.time1.estatisticas?.recepcao?.recepcoes || 0}/${comparisonData.teams.time1.estatisticas?.recepcao?.alvo || 0}`}
                        stat2={`${comparisonData.teams.time2.estatisticas?.recepcao?.recepcoes || 0}/${comparisonData.teams.time2.estatisticas?.recepcao?.alvo || 0}`}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="TOUCHDOWNS (RECEPÇÃO)"
                        stat1={(comparisonData.teams.time1.estatisticas?.recepcao?.tds_recebidos || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.recepcao?.tds_recebidos || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 bg-[#373740] text-white p-2 inline-block rounded-md">RETORNO</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatComparisonCard
                        title="JARDAS DE RETORNO"
                        stat1={(comparisonData.teams.time1.estatisticas?.retorno?.jardas_retornadas || 0).toLocaleString('pt-BR')}
                        stat2={(comparisonData.teams.time2.estatisticas?.retorno?.jardas_retornadas || 0).toLocaleString('pt-BR')}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="RETORNOS"
                        stat1={(comparisonData.teams.time1.estatisticas?.retorno?.retornos || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.retorno?.retornos || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="TOUCHDOWNS (RETORNO)"
                        stat1={(comparisonData.teams.time1.estatisticas?.retorno?.td_retornados || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.retorno?.td_retornados || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 bg-[#373740] text-white p-2 inline-block rounded-md">DEFESA</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatComparisonCard
                        title="TACKLES TOTAIS"
                        stat1={(comparisonData.teams.time1.estatisticas?.defesa?.tackles_totais || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.defesa?.tackles_totais || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="TACKLES FOR LOSS"
                        stat1={(comparisonData.teams.time1.estatisticas?.defesa?.tackles_for_loss || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.defesa?.tackles_for_loss || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="SACKS"
                        stat1={(comparisonData.teams.time1.estatisticas?.defesa?.sacks_forcado || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.defesa?.sacks_forcado || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="INTERCEPTAÇÕES"
                        stat1={(comparisonData.teams.time1.estatisticas?.defesa?.interceptacao_forcada || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.defesa?.interceptacao_forcada || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="FUMBLES FORÇADOS"
                        stat1={(comparisonData.teams.time1.estatisticas?.defesa?.fumble_forcado || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.defesa?.fumble_forcado || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="PASSES DESVIADOS"
                        stat1={(comparisonData.teams.time1.estatisticas?.defesa?.passe_desviado || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.defesa?.passe_desviado || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="TOUCHDOWNS DEFENSIVOS"
                        stat1={(comparisonData.teams.time1.estatisticas?.defesa?.td_defensivo || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.defesa?.td_defensivo || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="SAFETIES"
                        stat1={(comparisonData.teams.time1.estatisticas?.defesa?.safety || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.defesa?.safety || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 bg-[#373740] text-white p-2 inline-block rounded-md">CHUTE</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatComparisonCard
                        title="FIELD GOALS"
                        stat1={`${comparisonData.teams.time1.estatisticas?.kicker?.fg_bons || 0}/${comparisonData.teams.time1.estatisticas?.kicker?.tentativas_de_fg || 0}`}
                        stat2={`${comparisonData.teams.time2.estatisticas?.kicker?.fg_bons || 0}/${comparisonData.teams.time2.estatisticas?.kicker?.tentativas_de_fg || 0}`}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="PERCENTUAL FG"
                        stat1={calculatePercentage(
                            comparisonData.teams.time1.estatisticas?.kicker?.fg_bons || 0,
                            comparisonData.teams.time1.estatisticas?.kicker?.tentativas_de_fg || 1
                        )}
                        stat2={calculatePercentage(
                            comparisonData.teams.time2.estatisticas?.kicker?.fg_bons || 0,
                            comparisonData.teams.time2.estatisticas?.kicker?.tentativas_de_fg || 1
                        )}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="EXTRA POINTS"
                        stat1={`${comparisonData.teams.time1.estatisticas?.kicker?.xp_bons || 0}/${comparisonData.teams.time1.estatisticas?.kicker?.tentativas_de_xp || 0}`}
                        stat2={`${comparisonData.teams.time2.estatisticas?.kicker?.xp_bons || 0}/${comparisonData.teams.time2.estatisticas?.kicker?.tentativas_de_xp || 0}`}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="FG MAIS LONGO"
                        stat1={`${comparisonData.teams.time1.estatisticas?.kicker?.fg_mais_longo || 0} jardas`}
                        stat2={`${comparisonData.teams.time2.estatisticas?.kicker?.fg_mais_longo || 0} jardas`}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 bg-[#373740] text-white p-2 inline-block rounded-md">PUNT</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatComparisonCard
                        title="JARDAS DE PUNT"
                        stat1={(comparisonData.teams.time1.estatisticas?.punter?.jardas_de_punt || 0).toLocaleString('pt-BR')}
                        stat2={(comparisonData.teams.time2.estatisticas?.punter?.jardas_de_punt || 0).toLocaleString('pt-BR')}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="PUNTS"
                        stat1={(comparisonData.teams.time1.estatisticas?.punter?.punts || 0).toString()}
                        stat2={(comparisonData.teams.time2.estatisticas?.punter?.punts || 0).toString()}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />

                    <StatComparisonCard
                        title="MÉDIA DE JARDAS POR PUNT"
                        stat1={calculateAverage(
                            comparisonData.teams.time1.estatisticas?.punter?.jardas_de_punt || 0,
                            comparisonData.teams.time1.estatisticas?.punter?.punts || 1
                        )}
                        stat2={calculateAverage(
                            comparisonData.teams.time2.estatisticas?.punter?.jardas_de_punt || 0,
                            comparisonData.teams.time2.estatisticas?.punter?.punts || 1
                        )}
                        color1={comparisonData.teams.time1.cor}
                        color2={comparisonData.teams.time2.cor}
                    />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 bg-[#373740] text-white p-2 inline-block rounded-md">DESTAQUES</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Destaque Ataque */}
                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <h3 className="text-xl font-bold mb-4">Melhores do Ataque</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <PlayerComparisonCard
                                title="Melhor Passador (Jardas)"
                                player1={comparisonData.teams.time1.destaques?.ataque?.passador}
                                player2={comparisonData.teams.time2.destaques?.ataque?.passador}
                                team1={comparisonData.teams.time1}
                                team2={comparisonData.teams.time2}
                                statKey="jardas_de_passe"
                                statCategory="passe"
                            />

                            <PlayerComparisonCard
                                title="Melhor Corredor (Jardas)"
                                player1={comparisonData.teams.time1.destaques?.ataque?.corredor}
                                player2={comparisonData.teams.time2.destaques?.ataque?.corredor}
                                team1={comparisonData.teams.time1}
                                team2={comparisonData.teams.time2}
                                statKey="jardas_corridas"
                                statCategory="corrida"
                            />

                            <PlayerComparisonCard
                                title="Melhor Recebedor (Jardas)"
                                player1={comparisonData.teams.time1.destaques?.ataque?.recebedor}
                                player2={comparisonData.teams.time2.destaques?.ataque?.recebedor}
                                team1={comparisonData.teams.time1}
                                team2={comparisonData.teams.time2}
                                statKey="jardas_recebidas"
                                statCategory="recepcao"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md">
                        <h3 className="text-xl font-bold mb-4">Melhores da Defesa</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <PlayerComparisonCard
                                title="Melhor em Tackles"
                                player1={comparisonData.teams.time1.destaques?.defesa?.tackler}
                                player2={comparisonData.teams.time2.destaques?.defesa?.tackler}
                                team1={comparisonData.teams.time1}
                                team2={comparisonData.teams.time2}
                                statKey="tackles_totais"
                                statCategory="defesa"
                            />

                            <PlayerComparisonCard
                                title="Melhor em Sacks"
                                player1={comparisonData.teams.time1.destaques?.defesa?.rusher}
                                player2={comparisonData.teams.time2.destaques?.defesa?.rusher}
                                team1={comparisonData.teams.time1}
                                team2={comparisonData.teams.time2}
                                statKey="sacks_forcado"
                                statCategory="defesa"
                            />

                            <PlayerComparisonCard
                                title="Melhor Interceptador"
                                player1={comparisonData.teams.time1.destaques?.defesa?.interceptador}
                                player2={comparisonData.teams.time2.destaques?.defesa?.interceptador}
                                team1={comparisonData.teams.time1}
                                team2={comparisonData.teams.time2}
                                statKey="interceptacao_forcada"
                                statCategory="defesa"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};