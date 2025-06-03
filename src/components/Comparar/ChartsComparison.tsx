// src/components/Comparar/ChartsComparison.tsx
"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartsComparisonProps {
    comparisonData: any;
}

export const ChartsComparison: React.FC<ChartsComparisonProps> = ({ comparisonData }) => {
    const [activeChartCategory, setActiveChartCategory] = useState<
        'passe' | 'corrida' | 'recepcao' | 'retorno' | 'defesa' | 'kicker' | 'punter'
    >('passe');

    // Preparar dados para gráficos
    const prepareChartData = () => {
        if (!comparisonData) return {
            passeData: [], corridaData: [], recepcaoData: [],
            retornoData: [], defesaData: [], kickerData: [], punterData: []
        };

        const time1 = comparisonData.teams.time1;
        const time2 = comparisonData.teams.time2;

        // Dados para o gráfico de passe
        const passeData = [
            {
                name: "Jardas",
                [time1.nome]: time1.estatisticas?.passe?.jardas_de_passe || 0,
                [time2.nome]: time2.estatisticas?.passe?.jardas_de_passe || 0
            },
            {
                name: "Passes Comp.",
                [time1.nome]: time1.estatisticas?.passe?.passes_completos || 0,
                [time2.nome]: time2.estatisticas?.passe?.passes_completos || 0
            },
            {
                name: "Passes Tent.",
                [time1.nome]: time1.estatisticas?.passe?.passes_tentados || 0,
                [time2.nome]: time2.estatisticas?.passe?.passes_tentados || 0
            },
            {
                name: "TDs",
                [time1.nome]: time1.estatisticas?.passe?.td_passados || 0,
                [time2.nome]: time2.estatisticas?.passe?.td_passados || 0
            },
            {
                name: "Interceptações",
                [time1.nome]: time1.estatisticas?.passe?.interceptacoes_sofridas || 0,
                [time2.nome]: time2.estatisticas?.passe?.interceptacoes_sofridas || 0
            }
        ];

        // Dados para o gráfico de corrida
        const corridaData = [
            {
                name: "Jardas",
                [time1.nome]: time1.estatisticas?.corrida?.jardas_corridas || 0,
                [time2.nome]: time2.estatisticas?.corrida?.jardas_corridas || 0
            },
            {
                name: "Corridas",
                [time1.nome]: time1.estatisticas?.corrida?.corridas || 0,
                [time2.nome]: time2.estatisticas?.corrida?.corridas || 0
            },
            {
                name: "TDs",
                [time1.nome]: time1.estatisticas?.corrida?.tds_corridos || 0,
                [time2.nome]: time2.estatisticas?.corrida?.tds_corridos || 0
            },
            {
                name: "Fumbles",
                [time1.nome]: time1.estatisticas?.corrida?.fumble_de_corredor || 0,
                [time2.nome]: time2.estatisticas?.corrida?.fumble_de_corredor || 0
            }
        ];

        // Dados para o gráfico de recepção
        const recepcaoData = [
            {
                name: "Jardas",
                [time1.nome]: time1.estatisticas?.recepcao?.jardas_recebidas || 0,
                [time2.nome]: time2.estatisticas?.recepcao?.jardas_recebidas || 0
            },
            {
                name: "Recepções",
                [time1.nome]: time1.estatisticas?.recepcao?.recepcoes || 0,
                [time2.nome]: time2.estatisticas?.recepcao?.recepcoes || 0
            },
            {
                name: "Alvos",
                [time1.nome]: time1.estatisticas?.recepcao?.alvo || 0,
                [time2.nome]: time2.estatisticas?.recepcao?.alvo || 0
            },
            {
                name: "TDs",
                [time1.nome]: time1.estatisticas?.recepcao?.tds_recebidos || 0,
                [time2.nome]: time2.estatisticas?.recepcao?.tds_recebidos || 0
            }
        ];

        // Dados para o gráfico de retorno
        const retornoData = [
            {
                name: "Jardas",
                [time1.nome]: time1.estatisticas?.retorno?.jardas_retornadas || 0,
                [time2.nome]: time2.estatisticas?.retorno?.jardas_retornadas || 0
            },
            {
                name: "Retornos",
                [time1.nome]: time1.estatisticas?.retorno?.retornos || 0,
                [time2.nome]: time2.estatisticas?.retorno?.retornos || 0
            },
            {
                name: "TDs",
                [time1.nome]: time1.estatisticas?.retorno?.td_retornados || 0,
                [time2.nome]: time2.estatisticas?.retorno?.td_retornados || 0
            }
        ];

        // Dados para o gráfico de defesa
        const defesaData = [
            {
                name: "Tackles Totais",
                [time1.nome]: time1.estatisticas?.defesa?.tackles_totais || 0,
                [time2.nome]: time2.estatisticas?.defesa?.tackles_totais || 0
            },
            {
                name: "Sacks",
                [time1.nome]: time1.estatisticas?.defesa?.sacks_forcado || 0,
                [time2.nome]: time2.estatisticas?.defesa?.sacks_forcado || 0
            },
            {
                name: "Interceptações",
                [time1.nome]: time1.estatisticas?.defesa?.interceptacao_forcada || 0,
                [time2.nome]: time2.estatisticas?.defesa?.interceptacao_forcada || 0
            },
            {
                name: "Fumbles Forç.",
                [time1.nome]: time1.estatisticas?.defesa?.fumble_forcado || 0,
                [time2.nome]: time2.estatisticas?.defesa?.fumble_forcado || 0
            },
            {
                name: "TDs Defensivos",
                [time1.nome]: time1.estatisticas?.defesa?.td_defensivo || 0,
                [time2.nome]: time2.estatisticas?.defesa?.td_defensivo || 0
            }
        ];

        // Dados para o gráfico de kicker
        const kickerData = [
            {
                name: "FG Bons",
                [time1.nome]: time1.estatisticas?.kicker?.fg_bons || 0,
                [time2.nome]: time2.estatisticas?.kicker?.fg_bons || 0
            },
            {
                name: "FG Tentados",
                [time1.nome]: time1.estatisticas?.kicker?.tentativas_de_fg || 0,
                [time2.nome]: time2.estatisticas?.kicker?.tentativas_de_fg || 0
            },
            {
                name: "XP Bons",
                [time1.nome]: time1.estatisticas?.kicker?.xp_bons || 0,
                [time2.nome]: time2.estatisticas?.kicker?.xp_bons || 0
            },
            {
                name: "XP Tentados",
                [time1.nome]: time1.estatisticas?.kicker?.tentativas_de_xp || 0,
                [time2.nome]: time2.estatisticas?.kicker?.tentativas_de_xp || 0
            }
        ];

        // Dados para o gráfico de punter
        const punterData = [
            {
                name: "Jardas",
                [time1.nome]: time1.estatisticas?.punter?.jardas_de_punt || 0,
                [time2.nome]: time2.estatisticas?.punter?.jardas_de_punt || 0
            },
            {
                name: "Punts",
                [time1.nome]: time1.estatisticas?.punter?.punts || 0,
                [time2.nome]: time2.estatisticas?.punter?.punts || 0
            }
        ];

        return { passeData, corridaData, recepcaoData, retornoData, defesaData, kickerData, punterData };
    };

    const { passeData, corridaData, recepcaoData, retornoData, defesaData, kickerData, punterData } = prepareChartData();

    const getChartData = () => {
        switch (activeChartCategory) {
            case 'passe': return passeData;
            case 'corrida': return corridaData;
            case 'recepcao': return recepcaoData;
            case 'retorno': return retornoData;
            case 'defesa': return defesaData;
            case 'kicker': return kickerData;
            case 'punter': return punterData;
            default: return passeData;
        }
    };

    const getChartTitle = () => {
        switch (activeChartCategory) {
            case 'passe': return 'Comparativo de Passe';
            case 'corrida': return 'Comparativo de Corrida';
            case 'recepcao': return 'Comparativo de Recepção';
            case 'retorno': return 'Comparativo de Retorno';
            case 'defesa': return 'Comparativo Defensivo';
            case 'kicker': return 'Comparativo de Chute';
            case 'punter': return 'Comparativo de Punt';
            default: return 'Comparativo de Passe';
        }
    };

    return (
        <div className="mt-4">
            {/* Selector para escolher categoria do gráfico */}
            <div className="mb-6">
                <div className="flex justify-center space-x-2 flex-wrap gap-2">
                    <button
                        className={`px-3 py-2 font-bold rounded-md text-sm ${activeChartCategory === 'passe' ? 'bg-[#272731] text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveChartCategory('passe')}
                    >
                        Passe
                    </button>
                    <button
                        className={`px-3 py-2 font-bold rounded-md text-sm ${activeChartCategory === 'corrida' ? 'bg-[#272731] text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveChartCategory('corrida')}
                    >
                        Corrida
                    </button>
                    <button
                        className={`px-3 py-2 font-bold rounded-md text-sm ${activeChartCategory === 'recepcao' ? 'bg-[#272731] text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveChartCategory('recepcao')}
                    >
                        Recepção
                    </button>
                    <button
                        className={`px-3 py-2 font-bold rounded-md text-sm ${activeChartCategory === 'retorno' ? 'bg-[#272731] text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveChartCategory('retorno')}
                    >
                        Retorno
                    </button>
                    <button
                        className={`px-3 py-2 font-bold rounded-md text-sm ${activeChartCategory === 'defesa' ? 'bg-[#272731] text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveChartCategory('defesa')}
                    >
                        Defesa
                    </button>
                    <button
                        className={`px-3 py-2 font-bold rounded-md text-sm ${activeChartCategory === 'kicker' ? 'bg-[#272731] text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveChartCategory('kicker')}
                    >
                        Chute
                    </button>
                    <button
                        className={`px-3 py-2 font-bold rounded-md text-sm ${activeChartCategory === 'punter' ? 'bg-[#272731] text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveChartCategory('punter')}
                    >
                        Punt
                    </button>
                </div>
            </div>

            {/* Gráfico */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4">{getChartTitle()}</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={getChartData()}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey={comparisonData.teams.time1.nome}
                                fill={comparisonData.teams.time1.cor}
                            />
                            <Bar
                                dataKey={comparisonData.teams.time2.nome}
                                fill={comparisonData.teams.time2.cor}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Resumo Comparativo */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4">Resumo Comparativo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-bold" style={{ color: comparisonData.teams.time1.cor }}>
                            {comparisonData.teams.time1.nome}
                        </h4>
                        <ul className="mt-2 space-y-1">
                            <li className="flex justify-between">
                                <span>Jardas de Passe:</span>
                                <span className="font-bold">{(comparisonData.teams.time1.estatisticas?.passe?.jardas_de_passe || 0).toLocaleString('pt-BR')}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Jardas de Corrida:</span>
                                <span className="font-bold">{(comparisonData.teams.time1.estatisticas?.corrida?.jardas_corridas || 0).toLocaleString('pt-BR')}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>TDs Totais:</span>
                                <span className="font-bold">{((comparisonData.teams.time1.estatisticas?.passe?.td_passados || 0) +
                                    (comparisonData.teams.time1.estatisticas?.corrida?.tds_corridos || 0) +
                                    (comparisonData.teams.time1.estatisticas?.recepcao?.tds_recebidos || 0))}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sacks:</span>
                                <span className="font-bold">{comparisonData.teams.time1.estatisticas?.defesa?.sacks_forcado || 0}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <h4 className="font-bold" style={{ color: comparisonData.teams.time2.cor }}>
                            {comparisonData.teams.time2.nome}
                        </h4>
                        <ul className="mt-2 space-y-1">
                            <li className="flex justify-between">
                                <span>Jardas de Passe:</span>
                                <span className="font-bold">{(comparisonData.teams.time2.estatisticas?.passe?.jardas_de_passe || 0).toLocaleString('pt-BR')}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Jardas de Corrida:</span>
                                <span className="font-bold">{(comparisonData.teams.time2.estatisticas?.corrida?.jardas_corridas || 0).toLocaleString('pt-BR')}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>TDs Totais:</span>
                                <span className="font-bold">{((comparisonData.teams.time2.estatisticas?.passe?.td_passados || 0) +
                                    (comparisonData.teams.time2.estatisticas?.corrida?.tds_corridos || 0) +
                                    (comparisonData.teams.time2.estatisticas?.recepcao?.tds_recebidos || 0))}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sacks:</span>
                                <span className="font-bold">{comparisonData.teams.time2.estatisticas?.defesa?.sacks_forcado || 0}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};