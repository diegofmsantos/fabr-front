"use client"

import { useQuery } from '@tanstack/react-query'
import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import { Noticia } from '@/types/noticia'
import { api } from '@/libs/axios'
import { createSlug, findPlayerBySlug, getPlayerSlug, getTeamSlug } from '@/utils/formatUrl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { queryKeys } from './queryKeys'

// Funções de fetch
const fetchTimes = async (temporada: string = '2024'): Promise<Time[]> => {
    console.log(`Buscando times da temporada: ${temporada}`);
    try {
        const { data } = await api.get<Time[]>(`/times?temporada=${temporada}`)
        console.log(`Encontrados ${data.length} times para a temporada ${temporada}`);
        return data
    } catch (error) {
        console.error(`Erro ao buscar times da temporada ${temporada}:`, error);
        return [];
    }
}

const fetchJogadores = async (temporada: string = '2024'): Promise<Jogador[]> => {
    console.log(`Buscando jogadores da temporada: ${temporada}`);
    try {
        const { data } = await api.get<Jogador[]>(`/jogadores?temporada=${temporada}`)
        console.log(`Encontrados ${data.length} jogadores para a temporada ${temporada}`);
        return data
    } catch (error) {
        console.error(`Erro ao buscar jogadores da temporada ${temporada}:`, error);
        return [];
    }
}

const fetchNoticias = async (): Promise<Noticia[]> => {
    const { data } = await api.get<Noticia[]>('/materias')
    return data
}

// Função helper para notícias relacionadas
function shuffleAndFilterNews(allNews: Noticia[], currentNewsId: number, limit: number = 6) {
    return allNews
        .filter(news => news.id !== currentNewsId)
        .sort(() => Math.random() - 0.5)
        .slice(0, limit)
}

// Hook para obter a temporada dos parâmetros da URL
export function useTemporada(explicitTemporada?: string) {
    const searchParams = useSearchParams();
    let temporada = explicitTemporada || searchParams?.get('temporada') || '2024';
    
    // Validar que temporada é '2024' ou '2025'
    if (temporada !== '2024' && temporada !== '2025') {
        console.warn(`Temporada inválida: ${temporada}, usando 2024`);
        temporada = '2024'; // Default seguro
    }
    
    console.log('useTemporada atual:', temporada);
    return temporada;
}

// Hooks básicos
export function useJogadores(temporada?: string) {
    const currentTemporada = useTemporada(temporada);
    
    return useQuery({
        queryKey: queryKeys.jogadores(currentTemporada),
        queryFn: () => fetchJogadores(currentTemporada),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })
}

export function useTimes(temporada?: string) {
    const currentTemporada = useTemporada(temporada);
    
    return useQuery({
        queryKey: queryKeys.times(currentTemporada),
        queryFn: () => fetchTimes(currentTemporada),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })
}

export function useNoticias() {
    return useQuery({
        queryKey: queryKeys.noticias,
        queryFn: fetchNoticias,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })
}

// Trecho adaptado para o arquivo queries.ts
export function useTeam(teamName: string | undefined, explicitTemporada?: string) {
    const temporada = useTemporada(explicitTemporada);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    return useQuery({
        queryKey: [...queryKeys.times(temporada), teamName],
        queryFn: async () => {
            if (!teamName) throw new Error("Nome do time não encontrado.");
            
            console.log(`Buscando time: ${teamName} na temporada: ${temporada}`);
            
            // Busca os times da temporada solicitada
            const times = await fetchTimes(temporada);
            
            if (!times.length) {
                console.error(`Nenhum time encontrado para temporada ${temporada}`);
                return null;
            }
            
            // Normaliza o slug do time buscado
            const teamSlug = createSlug(teamName);
            console.log(`Buscando por time com slug: ${teamSlug}`);
            
            // Primeiro tenta encontrar o time na temporada solicitada pelo slug
            let timeEncontrado = times.find(t => {
                if (!t.nome) return false;
                return getTeamSlug(t.nome) === teamSlug;
            });
            
            // Se encontrou o time na temporada solicitada, retorna-o
            if (timeEncontrado) {
                console.log(`Time encontrado na temporada ${temporada}:`, timeEncontrado.nome);
                return timeEncontrado;
            }
            
            console.log(`Time ${teamName} não encontrado diretamente na temporada ${temporada}, buscando correspondências...`);
            
            // Mapeamento especial para casos conhecidos
           // Caso de 2024 -> 2025
if (temporada === '2025') {
    // América Locomotiva -> Locomotiva FA
    if (teamSlug === 'America-Locomotiva') {
        timeEncontrado = times.find(t => 
            getTeamSlug(t.nome || '') === 'Locomotiva-FA'
        );
        
        if (timeEncontrado) {
            console.log(`Time 'América Locomotiva' encontrado como '${timeEncontrado.nome}' em 2025`);
            
            // Redireciona para o novo nome
            const params = new URLSearchParams(searchParams?.toString() || '');
            const novaURL = `/${getTeamSlug(timeEncontrado.nome || '')}?${params.toString()}`;
            
            console.log(`Redirecionando para o novo nome do time: ${novaURL}`);
            setTimeout(() => {
                router.replace(novaURL, { scroll: false });
            }, 0);
            
            return timeEncontrado;
        }
    }
    
    // Paraná HP -> Calvary Cavaliers
    else if (teamSlug === 'Parana-HP') {
        timeEncontrado = times.find(t => 
            getTeamSlug(t.nome || '') === 'Calvary-Cavaliers'
        );
        
        if (timeEncontrado) {
            console.log(`Time 'Paraná HP' encontrado como '${timeEncontrado.nome}' em 2025`);
            
            // Redireciona para o novo nome
            const params = new URLSearchParams(searchParams?.toString() || '');
            const novaURL = `/${getTeamSlug(timeEncontrado.nome || '')}?${params.toString()}`;
            
            console.log(`Redirecionando para o novo nome do time: ${novaURL}`);
            setTimeout(() => {
                router.replace(novaURL, { scroll: false });
            }, 0);
            
            return timeEncontrado;
        }
    }
}

// Caso de 2025 -> 2024
if (temporada === '2024') {
    // Locomotiva FA -> América Locomotiva
    if (teamSlug === 'Locomotiva-FA') {
        timeEncontrado = times.find(t => 
            getTeamSlug(t.nome || '') === 'America-Locomotiva'
        );
        
        if (timeEncontrado) {
            console.log(`Time 'Locomotiva FA' encontrado como '${timeEncontrado.nome}' em 2024`);
            
            // Redireciona para o nome antigo
            const params = new URLSearchParams(searchParams?.toString() || '');
            const novaURL = `/${getTeamSlug(timeEncontrado.nome || '')}?${params.toString()}`;
            
            console.log(`Redirecionando para o nome antigo do time: ${novaURL}`);
            setTimeout(() => {
                router.replace(novaURL, { scroll: false });
            }, 0);
            
            return timeEncontrado;
        }
    }
    
    // Calvary Cavaliers -> Paraná HP
    else if (teamSlug === 'Calvary-Cavaliers') {
        timeEncontrado = times.find(t => 
            getTeamSlug(t.nome || '') === 'Parana-HP'
        );
        
        if (timeEncontrado) {
            console.log(`Time 'Calvary Cavaliers' encontrado como '${timeEncontrado.nome}' em 2024`);
            
            // Redireciona para o nome antigo
            const params = new URLSearchParams(searchParams?.toString() || '');
            const novaURL = `/${getTeamSlug(timeEncontrado.nome || '')}?${params.toString()}`;
            
            console.log(`Redirecionando para o nome antigo do time: ${novaURL}`);
            setTimeout(() => {
                router.replace(novaURL, { scroll: false });
            }, 0);
            
            return timeEncontrado;
        }
    }
}
            
            // Se não encontrou com os mapeamentos específicos, busca por cidade e estado
            if (temporada === '2025') {
                // Busca os times da temporada 2024
                const timesAnteriores = await fetchTimes('2024');
                
                // Procura o time pelo slug na temporada 2024
                const timeAntigo = timesAnteriores.find(t => 
                    getTeamSlug(t.nome || '') === teamSlug
                );
                
                if (timeAntigo) {
                    console.log(`Time encontrado na temporada 2024 como: ${timeAntigo.nome}`);
                    
                    // Busca o time correspondente na temporada 2025 por cidade e estado
                    const possiveisCorrespondencias = times.filter(t => 
                        t.cidade === timeAntigo.cidade && 
                        t.bandeira_estado === timeAntigo.bandeira_estado
                    );
                    
                    if (possiveisCorrespondencias.length > 0) {
                        timeEncontrado = possiveisCorrespondencias[0];
                        console.log(`Time correspondente encontrado em 2025: ${timeEncontrado.nome}`);
                        
                        // Atualiza a URL se o nome do time mudou
                        if (pathname && getTeamSlug(timeEncontrado.nome || '') !== teamSlug) {
                            const params = new URLSearchParams(searchParams?.toString() || '');
                            const novaURL = `/${getTeamSlug(timeEncontrado.nome || '')}?${params.toString()}`;
                            
                            console.log(`Redirecionando para o novo nome do time: ${novaURL}`);
                            setTimeout(() => {
                                router.replace(novaURL, { scroll: false });
                            }, 0);
                        }
                        
                        return timeEncontrado;
                    }
                }
            }
            
            // Similar para 2024 buscando em 2025
            if (temporada === '2024') {
                try {
                    const timesFuturos = await fetchTimes('2025');
                    
                    // Resto da lógica de busca em 2025
                    // [...]
                } catch (error) {
                    console.error("Erro ao buscar times futuros:", error);
                }
            }
            
            console.log(`Time ${teamName} não encontrado em nenhuma temporada`);
            return null;
        },
        enabled: !!teamName
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

    const { data: jogadores = [], isLoading: jogadoresLoading } = useJogadores(currentTemporada);
    const { data: times = [], isLoading: timesLoading } = useTimes(currentTemporada);

    return useQuery({
        queryKey: [...queryKeys.jogadores(currentTemporada), timeSlug, jogadorSlug],
        queryFn: async () => {
            if (!jogadores.length || !times.length || !timeSlug || !jogadorSlug) {
                return null;
            }

            console.log(`Buscando jogador: ${jogadorSlug} do time: ${timeSlug} na temporada: ${currentTemporada}`);

            // Tenta encontrar o jogador na temporada atual pelo slug e time
            let jogadorEncontrado = findPlayerBySlug(jogadores, jogadorSlug, timeSlug, times);

            // Se encontrou o jogador em algum time
            if (jogadorEncontrado && jogadorEncontrado.timeId) {
                const timeAtual = times.find(t => t.id === jogadorEncontrado?.timeId);

                if (timeAtual) {
                    // Verificar se o jogador está em um time diferente do que está na URL
                    const jogadorMudouDeTime = getTeamSlug(timeAtual.nome || '') !== createSlug(timeSlug);
                    
                    if (jogadorMudouDeTime) {
                        console.log(`Jogador encontrado, mas em time diferente: ${timeAtual.nome}`);
                        
                        // Redirecionar para o time correto
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

            // Se não encontrou o jogador na temporada atual, tente em outras temporadas
            if (!jogadorEncontrado) {
                console.log(`Jogador não encontrado na temporada ${currentTemporada}, buscando em outras temporadas...`);
                
                // Lista de temporadas alternativas para busca
                const temporadasAlt = currentTemporada === '2024' ? ['2025'] : ['2024'];
                
                // Busca sequencialmente em outras temporadas
                for (const tempAlt of temporadasAlt) {
                    try {
                        console.log(`Buscando jogador na temporada: ${tempAlt}`);
                        const jogadoresAlt = await fetchJogadores(tempAlt);
                        const timesAlt = await fetchTimes(tempAlt);
                        
                        // Busca o jogador na temporada alternativa
                        const jogadorAlt = findPlayerBySlug(jogadoresAlt, jogadorSlug, timeSlug, timesAlt);
                        
                        if (jogadorAlt) {
                            console.log(`Jogador encontrado na temporada ${tempAlt}:`, jogadorAlt.nome);
                            
                            // Busca o mesmo jogador na temporada atual (por ID)
                            const jogadorAtual = jogadores.find(j => j.id === jogadorAlt.id);
                            
                            if (jogadorAtual && jogadorAtual.timeId) {
                                console.log(`Jogador também existe na temporada atual:`, jogadorAtual.nome);
                                const timeEncontrado = times.find(t => t.id === jogadorAtual.timeId);
                                
                                if (timeEncontrado) {
                                    const jogadorMudouDeTime = getTeamSlug(timeEncontrado.nome || '') !== createSlug(timeSlug);
                                    
                                    if (jogadorMudouDeTime) {
                                        // Redirecionar para o time correto na temporada atual
                                        const timeCorretoSlug = getTeamSlug(timeEncontrado.nome || '');
                                        const jogadorSlugCorreto = getPlayerSlug(jogadorAtual.nome);
                                        
                                        setTimeout(() => {
                                            router.replace(`/${timeCorretoSlug}/${jogadorSlugCorreto}?temporada=${currentTemporada}`);
                                        }, 0);
                                    }
                                    
                                    return {
                                        jogador: jogadorAtual,
                                        time: timeEncontrado,
                                        jogadorMudouDeTime
                                    };
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Erro ao buscar na temporada ${tempAlt}:`, error);
                    }
                }
            }

            console.log(`Jogador ${jogadorSlug} não encontrado em nenhuma temporada`);
            return null;
        },
        enabled: !!jogadores.length && !!times.length && !!timeSlug && !!jogadorSlug
    });
}

export function useNoticiaDetalhes(noticiaId: number) {
    const { data: noticias = [], isLoading } = useNoticias()

    return {
        noticia: noticias.find(n => n.id === noticiaId),
        noticiasRelacionadas: isLoading ? [] : shuffleAndFilterNews(noticias, noticiaId),
        isLoading,
        noticias
    }
}

// Função de prefetch melhorada
export const prefetchQueries = async (queryClient: any, temporada: string = '2024') => {
    console.log(`Pré-carregando dados para temporada: ${temporada}`);
    
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: queryKeys.times(temporada),
            queryFn: () => fetchTimes(temporada),
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.jogadores(temporada),
            queryFn: () => fetchJogadores(temporada),
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.noticias,
            queryFn: fetchNoticias,
        }),
    ]);
    
    console.log(`Dados pré-carregados com sucesso para temporada: ${temporada}`);
}