"use client"

import { useQuery } from '@tanstack/react-query'
import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import { Noticia } from '@/types/noticia'
import { createSlug, findPlayerBySlug, getPlayerSlug, getTeamSlug } from '@/utils/formatUrl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { queryKeys } from './queryKeys'

// Flag para controlar fonte dos dados
const USE_LOCAL_DATA = process.env.NEXT_PUBLIC_USE_LOCAL_DATA === 'true'

interface DataNotFoundError extends Error {
    code: 'NOT_FOUND';
    temporada: string;
    entityName?: string;
}

const createNotFoundError = (temporada: string, entityName?: string): DataNotFoundError => {
    const error = new Error(`Dados não encontrados para temporada ${temporada}`) as DataNotFoundError;
    error.code = 'NOT_FOUND';
    error.temporada = temporada;
    error.entityName = entityName;
    return error;
};

// Funções para buscar dados - LOCAL ou API
const fetchTimesLocal = async (temporada: string): Promise<Time[]> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
    
    if (temporada === '2024') {
        const { Times } = await import('@/data/times')
        return Times
    } else if (temporada === '2025') {
        // Por enquanto, retorna erro até você criar o arquivo times-2025.ts
        throw createNotFoundError(temporada)
    }
    
    throw createNotFoundError(temporada)
}

const fetchJogadoresLocal = async (temporada: string): Promise<Jogador[]> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
    
    const times = await fetchTimesLocal(temporada)
    const jogadores: Jogador[] = []
    
    times.forEach(time => {
        if (time.jogadores) {
            time.jogadores.forEach(jogador => {
                jogadores.push({
                    ...jogador,
                    timeId: time.id || 0
                })
            })
        }
    })
    
    return jogadores
}

const fetchNoticiasLocal = async (): Promise<Noticia[]> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
    
    try {
        const { Noticias } = await import('@/data/noticias')
        return Noticias
    } catch (error) {
        return [] // Retorna array vazio se não tiver notícias
    }
}

// Funções para API (sua implementação original)
const fetchTimesAPI = async (temporada: string): Promise<Time[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/times?temporada=${temporada}`)
    if (!response.ok) throw new Error('Erro ao buscar times')
    return response.json()
}

const fetchJogadoresAPI = async (temporada: string): Promise<Jogador[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jogadores?temporada=${temporada}`)
    if (!response.ok) throw new Error('Erro ao buscar jogadores')
    return response.json()
}

const fetchNoticiasAPI = async (): Promise<Noticia[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/materias`)
    if (!response.ok) throw new Error('Erro ao buscar notícias')
    return response.json()
}

// Hook para obter a temporada dos parâmetros da URL
export function useTemporada(explicitTemporada?: string) {
    const searchParams = useSearchParams();
    let temporada = explicitTemporada || searchParams?.get('temporada') || '2024';

    // Validar que temporada é '2024' ou '2025'
    if (temporada !== '2024' && temporada !== '2025') {
        console.warn(`Temporada inválida: ${temporada}, usando 2024`);
        temporada = '2024';
    }

    return temporada;
}

// Hooks principais
export function useJogadores(temporada?: string) {
    const currentTemporada = useTemporada(temporada);

    return useQuery({
        queryKey: queryKeys.jogadores(currentTemporada),
        queryFn: async () => {
            try {
                const jogadores = USE_LOCAL_DATA 
                    ? await fetchJogadoresLocal(currentTemporada)
                    : await fetchJogadoresAPI(currentTemporada);

                if (!jogadores || jogadores.length === 0) {
                    throw createNotFoundError(currentTemporada);
                }

                return jogadores;
            } catch (error: any) {
                if (error.code === 'NOT_FOUND') throw error;
                console.error('Erro ao buscar jogadores:', error);
                throw createNotFoundError(currentTemporada);
            }
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: false,
    });
}

export function useTimes(temporada?: string) {
    const currentTemporada = useTemporada(temporada);

    return useQuery({
        queryKey: queryKeys.times(currentTemporada),
        queryFn: async () => {
            try {
                const times = USE_LOCAL_DATA 
                    ? await fetchTimesLocal(currentTemporada)
                    : await fetchTimesAPI(currentTemporada);

                if (!times || times.length === 0) {
                    throw createNotFoundError(currentTemporada);
                }

                return times;
            } catch (error: any) {
                if (error.code === 'NOT_FOUND') throw error;
                console.error('Erro ao buscar times:', error);
                throw createNotFoundError(currentTemporada);
            }
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: false,
    });
}

export function useNoticias() {
    return useQuery({
        queryKey: queryKeys.noticias,
        queryFn: async () => {
            return USE_LOCAL_DATA 
                ? await fetchNoticiasLocal()
                : await fetchNoticiasAPI();
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })
}

// Manter seus hooks complexos existentes (useTeam, usePlayerDetails) 
// Eles já funcionam bem, só precisam usar os hooks básicos acima

export function useTeam(teamName: string | undefined, explicitTemporada?: string) {
    const temporada = useTemporada(explicitTemporada);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { data: times = [], isLoading: timesLoading, error: timesError } = useTimes(temporada);

    return useQuery({
        queryKey: [...queryKeys.times(temporada), teamName],
        queryFn: async () => {
            if (!teamName) throw new Error("Nome do time não encontrado.");

            if (timesError && (timesError as DataNotFoundError).code === 'NOT_FOUND') {
                throw createNotFoundError(temporada, teamName);
            }

            if (!times.length && !timesLoading) {
                throw createNotFoundError(temporada, teamName);
            }

            console.log(`Buscando time: ${teamName} na temporada: ${temporada}`);

            const teamSlug = createSlug(teamName);
            let timeEncontrado = times.find(t => {
                if (!t.nome) return false;
                return getTeamSlug(t.nome) === teamSlug;
            });

            if (timeEncontrado) {
                console.log(`Time encontrado na temporada ${temporada}:`, timeEncontrado.nome);
                return timeEncontrado;
            }

            // Lógica de mapeamento específico (mantida do seu código original)
            if (temporada === '2025' && teamSlug === 'Parana-HP') {
                timeEncontrado = times.find(t =>
                    getTeamSlug(t.nome || '') === 'Calvary-Cavaliers'
                );

                if (timeEncontrado) {
                    console.log(`Time 'Paraná HP' encontrado como '${timeEncontrado.nome}' em 2025`);
                    const params = new URLSearchParams(searchParams?.toString() || '');
                    if (!params.has('temporada') && temporada) {
                        params.set('temporada', temporada);
                    }
                    const novaURL = `/${getTeamSlug(timeEncontrado.nome || '')}?${params.toString()}`;
                    setTimeout(() => {
                        router.replace(novaURL, { scroll: false });
                    }, 0);
                    return timeEncontrado;
                }
            }

            // Outros mapeamentos...
            if (temporada === '2024' && teamSlug === 'Calvary-Cavaliers') {
                timeEncontrado = times.find(t =>
                    getTeamSlug(t.nome || '') === 'Parana-HP'
                );

                if (timeEncontrado) {
                    console.log(`Time 'Calvary Cavaliers' encontrado como '${timeEncontrado.nome}' em 2024`);
                    const params = new URLSearchParams(searchParams?.toString() || '');
                    if (!params.has('temporada') && temporada) {
                        params.set('temporada', temporada);
                    }
                    const novaURL = `/${getTeamSlug(timeEncontrado.nome || '')}?${params.toString()}`;
                    setTimeout(() => {
                        router.replace(novaURL, { scroll: false });
                    }, 0);
                    return timeEncontrado;
                }
            }

            console.log(`Time ${teamName} não encontrado em nenhuma temporada`);
            throw createNotFoundError(temporada, teamName);
        },
        enabled: !!teamName && !timesLoading,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}

export function usePlayerDetails(
    timeSlug: string | undefined,
    jogadorSlug: string | undefined,
    temporada?: string
) {
    const urlTemporada = useTemporada(temporada);
    const currentTemporada = temporada || urlTemporada;
    const router = useRouter();

    const { data: jogadores = [], isLoading: jogadoresLoading, error: jogadoresError } = useJogadores(currentTemporada);
    const { data: times = [], isLoading: timesLoading, error: timesError } = useTimes(currentTemporada);

    return useQuery({
        queryKey: [...queryKeys.jogadores(currentTemporada), timeSlug, jogadorSlug],
        queryFn: async () => {
            if (jogadoresError && (jogadoresError as DataNotFoundError).code === 'NOT_FOUND') {
                throw createNotFoundError(currentTemporada, jogadorSlug);
            }

            if (timesError && (timesError as DataNotFoundError).code === 'NOT_FOUND') {
                throw createNotFoundError(currentTemporada, jogadorSlug);
            }

            if (!jogadores.length || !times.length || !timeSlug || !jogadorSlug) {
                if (!jogadoresLoading && !timesLoading) {
                    throw createNotFoundError(currentTemporada, jogadorSlug);
                }
                return null;
            }

            console.log(`Buscando jogador: ${jogadorSlug} do time: ${timeSlug} na temporada: ${currentTemporada}`);

            let jogadorEncontrado = findPlayerBySlug(jogadores, jogadorSlug, timeSlug, times);

            if (jogadorEncontrado && jogadorEncontrado.timeId) {
                const timeAtual = times.find(t => t.id === jogadorEncontrado?.timeId);

                if (timeAtual) {
                    const jogadorMudouDeTime = getTeamSlug(timeAtual.nome || '') !== createSlug(timeSlug);

                    if (jogadorMudouDeTime) {
                        console.log(`Jogador encontrado, mas em time diferente: ${timeAtual.nome}`);
                        const timeCorretoSlug = getTeamSlug(timeAtual.nome || '');
                        const jogadorSlugCorreto = getPlayerSlug(jogadorEncontrado.nome);

                        setTimeout(() => {
                            router.replace(`/${timeCorretoSlug}/${jogadorSlugCorreto}?temporada=${currentTemporada}`);
                        }, 0);
                    }

                    return {
                        jogador: jogadorEncontrado,
                        time: timeAtual,
                        jogadorMudouDeTime
                    };
                }
            }

            console.log(`Jogador ${jogadorSlug} não encontrado na temporada ${currentTemporada}`);
            throw createNotFoundError(currentTemporada, jogadorSlug);
        },
        enabled: !!timeSlug && !!jogadorSlug,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}

export function useNoticiaDetalhes(noticiaId: number) {
    const { data: noticias = [], isLoading } = useNoticias()

    function shuffleAndFilterNews(allNews: Noticia[], currentNewsId: number, limit: number = 6) {
        return allNews
            .filter(news => news.id !== currentNewsId)
            .sort(() => Math.random() - 0.5)
            .slice(0, limit)
    }

    return {
        noticia: noticias.find(n => n.id === noticiaId),
        noticiasRelacionadas: isLoading ? [] : shuffleAndFilterNews(noticias, noticiaId),
        isLoading,
        noticias
    }
}

// Função de prefetch
export const prefetchQueries = async (queryClient: any, temporada: string = '2024') => {
    console.log(`Pré-carregando dados para temporada: ${temporada}`);

    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: queryKeys.times(temporada),
            queryFn: () => USE_LOCAL_DATA ? fetchTimesLocal(temporada) : fetchTimesAPI(temporada),
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.jogadores(temporada),
            queryFn: () => USE_LOCAL_DATA ? fetchJogadoresLocal(temporada) : fetchJogadoresAPI(temporada),
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.noticias,
            queryFn: () => USE_LOCAL_DATA ? fetchNoticiasLocal() : fetchNoticiasAPI(),
        }),
    ]);

    console.log(`Dados pré-carregados com sucesso para temporada: ${temporada}`);
}