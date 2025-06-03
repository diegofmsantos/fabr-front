"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTimes } from '@/hooks/queries';
import Link from 'next/link';
import { ArrowLeft, BarChart2 } from 'lucide-react';
import { SelectFilter } from '@/components/ui/SelectFilter';
import { Loading } from '@/components/ui/Loading';
import { TeamSelector } from '@/components/Comparar/TeamSelector';
import { TeamComparisonHeader } from '@/components/Comparar/TeamComparisonHeader';
import { StatisticsComparison } from '@/components/Comparar/StatisticsComparison';
import { ChartsComparison } from '@/components/Comparar/ChartsComparison';

export default function CompararTimesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [temporada, setTemporada] = useState(searchParams?.get('temporada') || '2024');
    const [selectedTeams, setSelectedTeams] = useState<{ time1Id?: number, time2Id?: number }>({});
    const [comparisonData, setComparisonData] = useState<any>(null);
    const [loadingComparison, setLoadingComparison] = useState(false);
    const [activeTab, setActiveTab] = useState<'estatisticas' | 'graficos'>('estatisticas');

    const { data: times = [], isLoading: loadingTimes } = useTimes(temporada);

    const teamsSelected = !!(selectedTeams.time1Id && selectedTeams.time2Id);

    useEffect(() => {
        const time1Id = searchParams?.get('time1');
        const time2Id = searchParams?.get('time2');

        if (time1Id) selectTeam('time1Id', Number(time1Id));
        if (time2Id) selectTeam('time2Id', Number(time2Id));
    }, [searchParams]);

    useEffect(() => {
        if (selectedTeams.time1Id && selectedTeams.time2Id) {
            loadComparisonData();
            updateURL();
        }
    }, [selectedTeams, temporada]);

    const updateURL = () => {
        if (!selectedTeams.time1Id || !selectedTeams.time2Id) return;

        const params = new URLSearchParams();
        params.set('time1', String(selectedTeams.time1Id));
        params.set('time2', String(selectedTeams.time2Id));
        params.set('temporada', temporada);

        router.replace(`/comparar-times?${params.toString()}`, { scroll: false });
    };

    const loadComparisonData = async () => {
        if (!selectedTeams.time1Id || !selectedTeams.time2Id) return;

        try {
            setLoadingComparison(true);
            const USE_LOCAL_DATA = process.env.NEXT_PUBLIC_USE_LOCAL_DATA === 'true';

            if (USE_LOCAL_DATA) {
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const time1 = times.find(t => t.id === selectedTeams.time1Id);
                const time2 = times.find(t => t.id === selectedTeams.time2Id);
                
                if (!time1 || !time2) {
                    throw new Error('Times não encontrados');
                }

                const estatisticasTime1 = agregarEstatisticas(time1.jogadores || []);
                const estatisticasTime2 = agregarEstatisticas(time2.jogadores || []);

                // Calcular destaques reais
                const destaquesTime1 = encontrarDestaques(time1.jogadores || []);
                const destaquesTime2 = encontrarDestaques(time2.jogadores || []);

                const comparisonData = {
                    teams: {
                        time1: {
                            ...time1,
                            temporada,
                            estatisticas: estatisticasTime1,
                            destaques: destaquesTime1
                        },
                        time2: {
                            ...time2,
                            temporada,
                            estatisticas: estatisticasTime2,
                            destaques: destaquesTime2
                        }
                    },
                    metaData: {
                        temporada,
                        geradoEm: new Date().toISOString(),
                        totalJogos: {
                            time1: (time1.jogadores || []).length,
                            time2: (time2.jogadores || []).length
                        }
                    }
                };
                
                setComparisonData(comparisonData);
            } else {
                // Manter implementação original para API
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
                const url = `${apiBaseUrl}/comparar-times?time1Id=${selectedTeams.time1Id}&time2Id=${selectedTeams.time2Id}&temporada=${temporada}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Erro ao carregar comparação: ${response.status}`);
                }

                const data = await response.json();
                setComparisonData(data);
            }
        } catch (error) {
            console.error('Erro ao carregar dados de comparação:', error);
        } finally {
            setLoadingComparison(false);
        }
    };

    const agregarEstatisticas = (jogadores: any[]) => {
        const stats = {
            passe: {
                jardas_de_passe: 0, passes_completos: 0, passes_tentados: 0,
                td_passados: 0, interceptacoes_sofridas: 0, sacks_sofridos: 0, fumble_de_passador: 0
            },
            corrida: {
                jardas_corridas: 0, corridas: 0, tds_corridos: 0, fumble_de_corredor: 0
            },
            recepcao: {
                jardas_recebidas: 0, recepcoes: 0, alvo: 0, tds_recebidos: 0
            },
            retorno: {
                jardas_retornadas: 0, retornos: 0, td_retornados: 0
            },
            defesa: {
                tackles_totais: 0, tackles_for_loss: 0, sacks_forcado: 0, fumble_forcado: 0,
                interceptacao_forcada: 0, passe_desviado: 0, safety: 0, td_defensivo: 0
            },
            kicker: {
                fg_bons: 0, tentativas_de_fg: 0, fg_mais_longo: 0, xp_bons: 0, tentativas_de_xp: 0
            },
            punter: {
                punts: 0, jardas_de_punt: 0
            }
        };

        jogadores.forEach(jogador => {
            if (!jogador.estatisticas) return;

            Object.entries(stats).forEach(([categoria, categoriaStats]) => {
                const jogadorStats = jogador.estatisticas[categoria];
                if (!jogadorStats) return;

                Object.keys(categoriaStats).forEach(stat => {
                    if (stat === 'fg_mais_longo') {
                        if ((jogadorStats[stat] || 0) > stats.kicker.fg_mais_longo) {
                            stats.kicker.fg_mais_longo = jogadorStats[stat] || 0;
                        }
                    } else {
                        (categoriaStats as any)[stat] += jogadorStats[stat] || 0;
                    }
                });
            });
        });

        return stats;
    };

    const encontrarDestaques = (jogadores: any[]) => {
        return {
            ataque: {
                passador: melhorJogador(jogadores, 'passe', 'jardas_de_passe'),
                corredor: melhorJogador(jogadores, 'corrida', 'jardas_corridas'),
                recebedor: melhorJogador(jogadores, 'recepcao', 'jardas_recebidas'),
                retornador: melhorJogador(jogadores, 'retorno', 'jardas_retornadas')
            },
            defesa: {
                tackler: melhorJogador(jogadores, 'defesa', 'tackles_totais'),
                rusher: melhorJogador(jogadores, 'defesa', 'sacks_forcado'),
                interceptador: melhorJogador(jogadores, 'defesa', 'interceptacao_forcada'),
                desviador: melhorJogador(jogadores, 'defesa', 'passe_desviado')
            },
            specialTeams: {
                kicker: melhorJogador(jogadores, 'kicker', 'fg_bons'),
                punter: melhorJogador(jogadores, 'punter', 'jardas_de_punt')
            }
        };
    };

    const melhorJogador = (jogadores: any[], categoria: string, estatistica: string) => {
        let melhor = null;
        let melhorValor = 0;

        jogadores.forEach(jogador => {
            if (!jogador.estatisticas || !jogador.estatisticas[categoria]) return;
            
            const categoriaStats = jogador.estatisticas[categoria];
            const valor = categoriaStats[estatistica] || 0;
            
            if (typeof valor === 'number' && valor > melhorValor) {
                melhorValor = valor;
                melhor = {
                    id: jogador.id,
                    nome: jogador.nome,
                    camisa: jogador.camisa,
                    numero: jogador.numero,
                    posicao: jogador.posicao,
                    estatisticas: jogador.estatisticas
                };
            }
        });

        return melhor;
    };

    const createEmptyDestaques = () => ({
        ataque: { passador: null, corredor: null, recebedor: null, retornador: null },
        defesa: { tackler: null, rusher: null, interceptador: null, desviador: null },
        specialTeams: { kicker: null, punter: null }
    });

    const selectTeam = (position: 'time1Id' | 'time2Id', teamId: number) => {
        setSelectedTeams(prev => ({
            ...prev,
            [position]: teamId
        }));
    };

    const swapTeams = () => {
        setSelectedTeams(prev => ({
            time1Id: prev.time2Id,
            time2Id: prev.time1Id
        }));
    };

    const handleTemporadaChange = (novaTemporada: string) => {
        setTemporada(novaTemporada);
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('temporada', novaTemporada);
        router.replace(`/comparar-times?${params.toString()}`, { scroll: false });
    };

    if (loadingTimes) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-[#ECECEC] py-24 px-4 max-w-[1200px] mx-auto xl:pt-10 xl:ml-[600px]">
            <div className="flex items-center mb-6">
                <Link href="/" className="mr-4">
                    <button className="rounded-full text-xs text-[#63E300] p-2 w-8 h-8 flex justify-center items-center bg-[#373740] hover:opacity-80 z-50">
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <h1 className="text-4xl font-extrabold italic tracking-[-2px]">COMPARAR TIMES</h1>
            </div>

            <div className="w-full mt-4">
                <SelectFilter
                    label="TEMPORADA"
                    value={temporada}
                    onChange={handleTemporadaChange}
                    options={[
                        { label: '2024', value: '2024' },
                        { label: '2025', value: '2025' }
                    ]}
                />
            </div>

            <TeamSelector
                times={times}
                selectedTeams={selectedTeams}
                onSelectTeam={selectTeam}
                onSwapTeams={swapTeams}
            />

            {loadingComparison && teamsSelected && (
                <div className="mt-8 text-center">
                    <div className="w-12 h-12 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Carregando comparação...</p>
                </div>
            )}

            {comparisonData && teamsSelected && !loadingComparison && (
                <div className="mt-8">
                    <TeamComparisonHeader
                        time1={comparisonData.teams.time1}
                        time2={comparisonData.teams.time2}
                    />

                    <div className="flex border-b border-gray-200 mt-8 mb-8">
                        <button
                            className={`py-2 px-4 font-bold text-lg ${activeTab === 'estatisticas' ? 'border-b-4 border-[#272731] text-[#272731]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('estatisticas')}
                        >
                            Estatísticas
                        </button>
                        <button
                            className={`py-2 px-4 font-bold text-lg flex items-center ${activeTab === 'graficos' ? 'border-b-4 border-[#272731] text-[#272731]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('graficos')}
                        >
                            <BarChart2 size={16} className="mr-2" />
                            Gráficos
                        </button>
                    </div>

                    {activeTab === 'estatisticas' ? (
                        <StatisticsComparison comparisonData={comparisonData} />
                    ) : (
                        <ChartsComparison comparisonData={comparisonData} />
                    )}
                </div>
            )}

            {!teamsSelected && (
                <div className="mt-8 bg-white p-8 rounded-lg text-center">
                    <h2 className="text-xl font-bold mb-4">Selecione dois times para comparar</h2>
                    <p className="text-gray-600">Escolha dois times diferentes nas caixas de seleção acima para ver uma comparação detalhada de estatísticas e jogadores.</p>
                </div>
            )}
        </div>
    );
}