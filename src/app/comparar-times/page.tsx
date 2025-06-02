"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTimes } from '@/hooks/queries';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SelectFilter } from '@/components/SelectFilter';
import { Loading } from '@/components/ui/Loading';

export default function CompararTimesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [temporada, setTemporada] = useState(searchParams?.get('temporada') || '2024');

    // Estados para controlar a seleção de times e dados de comparação
    const [selectedTeams, setSelectedTeams] = useState<{ time1Id?: number, time2Id?: number }>({});
    const [comparisonData, setComparisonData] = useState<any>(null);
    const [loadingComparison, setLoadingComparison] = useState(false);

    // Buscar lista de times
    const { data: times = [], isLoading: loadingTimes } = useTimes(temporada);

    // Estado para controlar a aba ativa (estatísticas ou gráficos)
    const [activeTab, setActiveTab] = useState<'estatisticas' | 'graficos'>('estatisticas');

    // Efeito para inicializar a seleção com base nos parâmetros da URL
    useEffect(() => {
        const time1Id = searchParams?.get('time1');
        const time2Id = searchParams?.get('time2');

        if (time1Id) selectTeam('time1Id', Number(time1Id));
        if (time2Id) selectTeam('time2Id', Number(time2Id));
    }, [searchParams]);

    // Efeito para carregar dados quando os times forem selecionados
    useEffect(() => {
        if (selectedTeams.time1Id && selectedTeams.time2Id) {
            loadComparisonData();

            // Atualizar URL quando times forem selecionados
            const params = new URLSearchParams();
            params.set('time1', String(selectedTeams.time1Id));
            params.set('time2', String(selectedTeams.time2Id));
            params.set('temporada', temporada);

            router.replace(`/comparar-times?${params.toString()}`, { scroll: false });
        }
    }, [selectedTeams, temporada]);

    // Função para carregar dados de comparação
    // Função para carregar dados de comparação
// Função para carregar dados de comparação
const loadComparisonData = async () => {
    if (!selectedTeams.time1Id || !selectedTeams.time2Id) return;

    try {
        setLoadingComparison(true);

        // Verificar se deve usar dados locais
        const USE_LOCAL_DATA = process.env.NEXT_PUBLIC_USE_LOCAL_DATA === 'true';

        if (USE_LOCAL_DATA) {
            // Simular delay para manter UX
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Buscar times e jogadores
            const time1 = times.find(t => t.id === selectedTeams.time1Id);
            const time2 = times.find(t => t.id === selectedTeams.time2Id);
            
            if (!time1 || !time2) {
                throw new Error('Times não encontrados');
            }

            // Processar jogadores e agregar estatísticas
            const jogadoresTime1 = time1.jogadores || [];
            const jogadoresTime2 = time2.jogadores || [];

            // Função para agregar estatísticas de um time
            const agregarEstatisticas = (jogadores: any[]) => {
                const stats = {
                    passe: {
                        jardas_de_passe: 0,
                        passes_completos: 0,
                        passes_tentados: 0,
                        td_passados: 0,
                        interceptacoes_sofridas: 0,
                        sacks_sofridos: 0,
                        fumble_de_passador: 0
                    },
                    corrida: {
                        jardas_corridas: 0,
                        corridas: 0,
                        tds_corridos: 0,
                        fumble_de_corredor: 0
                    },
                    recepcao: {
                        jardas_recebidas: 0,
                        recepcoes: 0,
                        alvo: 0,
                        tds_recebidos: 0
                    },
                    retorno: {
                        jardas_retornadas: 0,
                        retornos: 0,
                        td_retornados: 0
                    },
                    defesa: {
                        tackles_totais: 0,
                        tackles_for_loss: 0,
                        sacks_forcado: 0,
                        fumble_forcado: 0,
                        interceptacao_forcada: 0,
                        passe_desviado: 0,
                        safety: 0,
                        td_defensivo: 0
                    },
                    kicker: {
                        fg_bons: 0,
                        tentativas_de_fg: 0,
                        fg_mais_longo: 0,
                        xp_bons: 0,
                        tentativas_de_xp: 0
                    },
                    punter: {
                        punts: 0,
                        jardas_de_punt: 0
                    }
                };

                jogadores.forEach(jogador => {
                    if (jogador.estatisticas) {
                        // Agregar passe
                        if (jogador.estatisticas.passe) {
                            stats.passe.jardas_de_passe += jogador.estatisticas.passe.jardas_de_passe || 0;
                            stats.passe.passes_completos += jogador.estatisticas.passe.passes_completos || 0;
                            stats.passe.passes_tentados += jogador.estatisticas.passe.passes_tentados || 0;
                            stats.passe.td_passados += jogador.estatisticas.passe.td_passados || 0;
                            stats.passe.interceptacoes_sofridas += jogador.estatisticas.passe.interceptacoes_sofridas || 0;
                            stats.passe.sacks_sofridos += jogador.estatisticas.passe.sacks_sofridos || 0;
                            stats.passe.fumble_de_passador += jogador.estatisticas.passe.fumble_de_passador || 0;
                        }

                        // Agregar corrida
                        if (jogador.estatisticas.corrida) {
                            stats.corrida.jardas_corridas += jogador.estatisticas.corrida.jardas_corridas || 0;
                            stats.corrida.corridas += jogador.estatisticas.corrida.corridas || 0;
                            stats.corrida.tds_corridos += jogador.estatisticas.corrida.tds_corridos || 0;
                            stats.corrida.fumble_de_corredor += jogador.estatisticas.corrida.fumble_de_corredor || 0;
                        }

                        // Agregar recepção
                        if (jogador.estatisticas.recepcao) {
                            stats.recepcao.jardas_recebidas += jogador.estatisticas.recepcao.jardas_recebidas || 0;
                            stats.recepcao.recepcoes += jogador.estatisticas.recepcao.recepcoes || 0;
                            stats.recepcao.alvo += jogador.estatisticas.recepcao.alvo || 0;
                            stats.recepcao.tds_recebidos += jogador.estatisticas.recepcao.tds_recebidos || 0;
                        }

                        // Agregar retorno
                        if (jogador.estatisticas.retorno) {
                            stats.retorno.jardas_retornadas += jogador.estatisticas.retorno.jardas_retornadas || 0;
                            stats.retorno.retornos += jogador.estatisticas.retorno.retornos || 0;
                            stats.retorno.td_retornados += jogador.estatisticas.retorno.td_retornados || 0;
                        }

                        // Agregar defesa
                        if (jogador.estatisticas.defesa) {
                            stats.defesa.tackles_totais += jogador.estatisticas.defesa.tackles_totais || 0;
                            stats.defesa.tackles_for_loss += jogador.estatisticas.defesa.tackles_for_loss || 0;
                            stats.defesa.sacks_forcado += jogador.estatisticas.defesa.sacks_forcado || 0;
                            stats.defesa.fumble_forcado += jogador.estatisticas.defesa.fumble_forcado || 0;
                            stats.defesa.interceptacao_forcada += jogador.estatisticas.defesa.interceptacao_forcada || 0;
                            stats.defesa.passe_desviado += jogador.estatisticas.defesa.passe_desviado || 0;
                            stats.defesa.safety += jogador.estatisticas.defesa.safety || 0;
                            stats.defesa.td_defensivo += jogador.estatisticas.defesa.td_defensivo || 0;
                        }

                        // Agregar kicker
                        if (jogador.estatisticas.kicker) {
                            stats.kicker.fg_bons += jogador.estatisticas.kicker.fg_bons || 0;
                            stats.kicker.tentativas_de_fg += jogador.estatisticas.kicker.tentativas_de_fg || 0;
                            stats.kicker.xp_bons += jogador.estatisticas.kicker.xp_bons || 0;
                            stats.kicker.tentativas_de_xp += jogador.estatisticas.kicker.tentativas_de_xp || 0;
                            
                            // Para fg_mais_longo, pegar o maior valor
                            if ((jogador.estatisticas.kicker.fg_mais_longo || 0) > stats.kicker.fg_mais_longo) {
                                stats.kicker.fg_mais_longo = jogador.estatisticas.kicker.fg_mais_longo || 0;
                            }
                        }

                        // Agregar punter
                        if (jogador.estatisticas.punter) {
                            stats.punter.punts += jogador.estatisticas.punter.punts || 0;
                            stats.punter.jardas_de_punt += jogador.estatisticas.punter.jardas_de_punt || 0;
                        }
                    }
                });

                return stats;
            };

            // Calcular estatísticas agregadas
            const estatisticasTime1 = agregarEstatisticas(jogadoresTime1);
            const estatisticasTime2 = agregarEstatisticas(jogadoresTime2);

            // Montar dados no formato esperado pela sua página
            const comparisonData = {
                teams: {
                    time1: {
                        ...time1,
                        temporada,
                        estatisticas: estatisticasTime1,
                        destaques: {
                            ataque: { passador: null, corredor: null, recebedor: null, retornador: null },
                            defesa: { tackler: null, rusher: null, interceptador: null, desviador: null },
                            specialTeams: { kicker: null, punter: null }
                        }
                    },
                    time2: {
                        ...time2,
                        temporada,
                        estatisticas: estatisticasTime2,
                        destaques: {
                            ataque: { passador: null, corredor: null, recebedor: null, retornador: null },
                            defesa: { tackler: null, rusher: null, interceptador: null, desviador: null },
                            specialTeams: { kicker: null, punter: null }
                        }
                    }
                },
                metaData: {
                    temporada,
                    geradoEm: new Date().toISOString(),
                    totalJogos: {
                        time1: jogadoresTime1.length,
                        time2: jogadoresTime2.length
                    }
                }
            };
            
            setComparisonData(comparisonData);
        } else {
            // Manter sua implementação original para API
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

    // Função para selecionar um time
    const selectTeam = (position: 'time1Id' | 'time2Id', teamId: number) => {
        setSelectedTeams(prev => ({
            ...prev,
            [position]: teamId
        }));
    };

    // Função para trocar os times de posição
    const swapTeams = () => {
        setSelectedTeams(prev => ({
            time1Id: prev.time2Id,
            time2Id: prev.time1Id
        }));
    };

    // Função para lidar com mudança de temporada
    const handleTemporadaChange = (novaTemporada: string) => {
        setTemporada(novaTemporada);

        // Atualizar URL mantendo os times selecionados
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('temporada', novaTemporada);

        router.replace(`/comparar-times?${params.toString()}`, { scroll: false });
    };

    // Verificar se os times estão selecionados
    const teamsSelected = !!(selectedTeams.time1Id && selectedTeams.time2Id);

    // Preparar dados para gráficos quando houver dados de comparação
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

    const { passeData, corridaData, recepcaoData, retornoData, defesaData, kickerData, punterData } =
        comparisonData ? prepareChartData() : {
            passeData: [], corridaData: [], recepcaoData: [],
            retornoData: [], defesaData: [], kickerData: [], punterData: []
        };

    const [activeChartCategory, setActiveChartCategory] = useState<
        'passe' | 'corrida' | 'recepcao' | 'retorno' | 'defesa' | 'kicker' | 'punter'
    >('passe');

    if (loadingTimes) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-[#ECECEC] py-24 px-4  max-w-[1200px] mx-auto xl:pt-10 xl:ml-[600px]">
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

            {/* Seleção de times */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {/* Time 1 */}
                <div className="bg-white rounded-lg p-4">
                    <label className="block mb-2 font-bold">Time 1</label>
                    <select
                        value={selectedTeams.time1Id || ''}
                        onChange={(e) => selectTeam('time1Id', Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Selecione um time</option>
                        {times.map((time) => (
                            <option
                                key={time.id}
                                value={time.id}
                                disabled={time.id === selectedTeams.time2Id}
                            >
                                {time.nome}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Time 2 */}
                <div className="bg-white rounded-lg p-4">
                    <label className="block mb-2 font-bold">Time 2</label>
                    <select
                        value={selectedTeams.time2Id || ''}
                        onChange={(e) => selectTeam('time2Id', Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Selecione um time</option>
                        {times.map((time) => (
                            <option
                                key={time.id}
                                value={time.id}
                                disabled={time.id === selectedTeams.time1Id}
                            >
                                {time.nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Botão para inverter times */}
            {teamsSelected && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={swapTeams}
                        className="bg-[#373740] hover:opacity-80 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Inverter Times
                    </button>
                </div>
            )}

            {/* Loading durante a comparação */}
            {loadingComparison && teamsSelected && (
                <div className="mt-8 text-center">
                    <div className="w-12 h-12 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Carregando comparação...</p>
                </div>
            )}

            {/* Resultado da comparação */}
            {comparisonData && teamsSelected && !loadingComparison && (
                <div className="mt-8">
                    {/* Cabeçalho */}
                    <TeamComparisonHeader
                        time1={comparisonData.teams.time1}
                        time2={comparisonData.teams.time2}
                    />

                    {/* Abas para alternar entre estatísticas e gráficos */}
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

                    {/* Conteúdo baseado na aba selecionada */}
                    {activeTab === 'estatisticas' ? (
                        <>
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
                                        stat1={`${Math.round((comparisonData.teams.time1.estatisticas?.passe?.passes_completos || 0) /
                                            Math.max(1, (comparisonData.teams.time1.estatisticas?.passe?.passes_tentados || 1)) * 100)}%`}
                                        stat2={`${Math.round((comparisonData.teams.time2.estatisticas?.passe?.passes_completos || 0) /
                                            Math.max(1, (comparisonData.teams.time2.estatisticas?.passe?.passes_tentados || 1)) * 100)}%`}
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

                            {/* Seção de Estatísticas de Corrida */}
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

                            {/* Seção de Estatísticas de Recepção */}
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

                            {/* Seção de Estatísticas de Retorno */}
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

                            {/* Seção de Estatísticas de Defesa */}
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

                            {/* Seção de Estatísticas de Kicker */}
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
                                        stat1={`${Math.round((comparisonData.teams.time1.estatisticas?.kicker?.fg_bons || 0) /
                                            Math.max(1, (comparisonData.teams.time1.estatisticas?.kicker?.tentativas_de_fg || 1)) * 100)}%`}
                                        stat2={`${Math.round((comparisonData.teams.time2.estatisticas?.kicker?.fg_bons || 0) /
                                            Math.max(1, (comparisonData.teams.time2.estatisticas?.kicker?.tentativas_de_fg || 1)) * 100)}%`}
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

                            {/* Seção de Estatísticas de Punter */}
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
                                        stat1={`${((comparisonData.teams.time1.estatisticas?.punter?.jardas_de_punt || 0) /
                                            Math.max(1, (comparisonData.teams.time1.estatisticas?.punter?.punts || 1))).toFixed(1)} jardas`}
                                        stat2={`${((comparisonData.teams.time2.estatisticas?.punter?.jardas_de_punt || 0) /
                                            Math.max(1, (comparisonData.teams.time2.estatisticas?.punter?.punts || 1))).toFixed(1)} jardas`}
                                        color1={comparisonData.teams.time1.cor}
                                        color2={comparisonData.teams.time2.cor}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        // Visualização de gráficos
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
                                        className={`px-3 py-2 font-bold rounded-md text-sm ${activeChartCategory === 'punter' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        onClick={() => setActiveChartCategory('punter')}
                                    >
                                        Punt
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold mb-4">{
                                    activeChartCategory === 'passe' ? 'Comparativo de Passe' :
                                        activeChartCategory === 'corrida' ? 'Comparativo de Corrida' :
                                            activeChartCategory === 'recepcao' ? 'Comparativo de Recepção' :
                                                activeChartCategory === 'retorno' ? 'Comparativo de Retorno' :
                                                    activeChartCategory === 'defesa' ? 'Comparativo Defensivo' :
                                                        activeChartCategory === 'kicker' ? 'Comparativo de Chute' :
                                                            'Comparativo de Punt'
                                }</h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={
                                                activeChartCategory === 'passe' ? passeData :
                                                    activeChartCategory === 'corrida' ? corridaData :
                                                        activeChartCategory === 'recepcao' ? recepcaoData :
                                                            activeChartCategory === 'retorno' ? retornoData :
                                                                activeChartCategory === 'defesa' ? defesaData :
                                                                    activeChartCategory === 'kicker' ? kickerData :
                                                                        punterData
                                            }
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
                    )}

                    {/* Jogadores Destaque */}
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

                            {/* Destaque Defesa */}
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
            )}

            {/* Mensagem para selecionar times */}
            {!teamsSelected && (
                <div className="mt-8 bg-white p-8 rounded-lg text-center">
                    <h2 className="text-xl font-bold mb-4">Selecione dois times para comparar</h2>
                    <p className="text-gray-600">Escolha dois times diferentes nas caixas de seleção acima para ver uma comparação detalhada de estatísticas e jogadores.</p>
                </div>
            )}
        </div>
    );
}

// Componente de cabeçalho da comparação
interface TeamComparisonHeaderProps {
    time1: any;
    time2: any;
}

const TeamComparisonHeader: React.FC<TeamComparisonHeaderProps> = ({ time1, time2 }) => {

    const normalizeForFilePath = (input: string): string => {
        return input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9-]/g, "");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time 1 */}
            <Link href={`/${time1.nome}`} className="block">
                <div
                    className="rounded-lg p-6 flex flex-col items-center text-white shadow-lg"
                    style={{ backgroundColor: time1.cor }}
                >
                    <h2 className="text-3xl font-extrabold italic tracking-tight mb-4">{time1.nome}</h2>
                    <div className="w-32 h-32 relative">
                        <Image
                            src={`/assets/times/logos/${normalizeForFilePath(time1.nome)}.png`}
                            fill
                            sizes="128px"
                            alt={`Logo ${time1.nome}`}
                            className="object-contain"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/assets/times/logos/default-logo.png';
                            }}
                        />
                    </div>
                    <div className="mt-4 text-xl font-bold">{time1.sigla}</div>
                </div>
            </Link>

            {/* Time 2 */}
            <Link href={`/${time2.nome}`} className="block">
                <div
                    className="rounded-lg p-6 flex flex-col items-center text-white shadow-lg"
                    style={{ backgroundColor: time2.cor }}
                >
                    <h2 className="text-3xl font-extrabold italic tracking-tight mb-4">{time2.nome}</h2>
                    <div className="w-32 h-32 relative">
                        <Image
                            src={`/assets/times/logos/${normalizeForFilePath(time2.nome)}.png`}
                            fill
                            sizes="128px"
                            alt={`Logo ${time2.nome}`}
                            className="object-contain"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/assets/times/logos/default-logo.png';
                            }}
                        />
                    </div>
                    <div className="mt-4 text-xl font-bold">{time2.sigla}</div>
                </div>
            </Link>
        </div>
    );
};

// Componente de card para comparação de estatísticas
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
    // Determinar qual valor é maior para destacar
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

// Componente para comparação de jogadores
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
    // Obter os valores estatísticos
    const getValue = (player: any) => {
        if (!player || !player.estatisticas) return 'N/A';

        const stats = player.estatisticas[statCategory];
        if (!stats) return 'N/A';

        return stats[statKey] || 0;
    };

    const value1 = getValue(player1);
    const value2 = getValue(player2);

    // Determinar qual valor é melhor
    const isFirstBetter = value1 !== 'N/A' && value2 !== 'N/A' && value1 > value2;
    const isSecondBetter = value1 !== 'N/A' && value2 !== 'N/A' && value2 > value1;
    const isEqual = value1 === value2 && value1 !== 'N/A';

    return (
        <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
            <h4 className="text-md font-bold mb-2">{title}</h4>
            <div className="grid grid-cols-2 gap-2">
                {/* Jogador Time 1 */}
                <div
                    className={`p-2 rounded-md ${isFirstBetter ? 'bg-green-100' : isEqual ? 'bg-gray-200' : ''}`}
                >
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

                {/* Jogador Time 2 */}
                <div
                    className={`p-2 rounded-md ${isSecondBetter ? 'bg-green-100' : isEqual ? 'bg-gray-200' : ''}`}
                >
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