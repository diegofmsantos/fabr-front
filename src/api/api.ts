// src/api/api.ts - VERSÃO ATUALIZADA
import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import { Noticia } from '@/types/noticia'
import axios, { AxiosResponse } from 'axios'

// Flag para controlar fonte dos dados
const USE_LOCAL_DATA = process.env.NEXT_PUBLIC_USE_LOCAL_DATA === 'true'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

// Cache para armazenar dados pré-carregados
let cachedData: { 
  times: Time[] | null; 
  jogadores: Jogador[] | null; 
  noticias: Noticia[] | null;
  [key: string]: Time[] | Jogador[] | Noticia[] | null | undefined;
} = {
  times: null,
  jogadores: null,
  noticias: null,
}

// ========== FUNÇÕES PARA DADOS LOCAIS ==========
const getTimesLocal = async (temporada: string = '2024'): Promise<Time[]> => {
  // Simula delay de rede para manter UX consistente
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
  
  if (temporada === '2024') {
    const { Times } = await import('@/data/times')
    return Times
  } else if (temporada === '2025') {
    // Por enquanto retorna erro até criar o arquivo
    throw new Error(`Dados da temporada ${temporada} ainda não estão disponíveis`)
  }
  
  throw new Error(`Temporada ${temporada} não suportada`)
}

const getJogadoresLocal = async (temporada: string = '2024'): Promise<Jogador[]> => {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
  
  const times = await getTimesLocal(temporada)
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

const getNoticiasLocal = async (): Promise<Noticia[]> => {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
  
  try {
    const { Noticias } = await import('@/data/noticias')
    return Noticias
  } catch (error) {
    console.warn('Arquivo de notícias não encontrado, retornando array vazio')
    return []
  }
}

// ========== FUNÇÕES PARA API EXTERNA ==========
const getTimesAPI = async (temporada: string = '2024'): Promise<Time[]> => {
  const response: AxiosResponse<Time[]> = await api.get(`/times?temporada=${temporada}`)
  return response.data || []
}

const getJogadoresAPI = async (temporada: string = '2024'): Promise<Jogador[]> => {
  const response: AxiosResponse<Jogador[]> = await api.get(`/jogadores?temporada=${temporada}`)
  return response.data || []
}

const getNoticiasAPI = async (): Promise<Noticia[]> => {
  const response: AxiosResponse<Noticia[]> = await api.get('/materias')
  return response.data || []
}

// ========== FUNÇÕES PÚBLICAS (COMPATIBILIDADE) ==========

// Função para pré-carregar dados no cache
export const prefetchData = async (temporada: string = '2024'): Promise<void> => {
  try {
    const [timesResponse, jogadoresResponse, noticiasResponse] = await Promise.all([
      getTimes(temporada),
      getJogadores(temporada),
      getNoticias(),
    ])

    cachedData[`times_${temporada}`] = timesResponse
    cachedData[`jogadores_${temporada}`] = jogadoresResponse
    cachedData.noticias = noticiasResponse
    
    console.log('Dados pré-carregados com sucesso!')
  } catch (error) {
    console.error('Erro ao pré-carregar dados:', error)
    throw new Error('Falha ao pré-carregar dados')
  }
}

// Função para buscar times (usando cache ou fonte de dados)
export const getTimes = async (temporada: string = '2024'): Promise<Time[]> => {
  const cacheKey = `times_${temporada}`

  if (cachedData[cacheKey]) {
    return cachedData[cacheKey] as Time[]
  }

  try {
    const times = USE_LOCAL_DATA 
      ? await getTimesLocal(temporada)
      : await getTimesAPI(temporada)
      
    cachedData[cacheKey] = times
    return times
  } catch (error) {
    console.error('Erro ao buscar times:', error)
    throw new Error('Falha ao buscar times')
  }
}

// Função para buscar jogadores (usando cache ou fonte de dados)
export const getJogadores = async (temporada: string = '2024'): Promise<Jogador[]> => {
  const cacheKey = `jogadores_${temporada}`

  if (cachedData[cacheKey]) {
    console.log('Retornando jogadores do cache, quantidade:', cachedData[cacheKey]?.length);
    return cachedData[cacheKey] as Jogador[]
  }

  try {
    console.log('Buscando jogadores para temporada:', temporada);
    
    const jogadores = USE_LOCAL_DATA 
      ? await getJogadoresLocal(temporada)
      : await getJogadoresAPI(temporada)
      
    console.log('Jogadores obtidos, quantidade:', jogadores?.length);
    cachedData[cacheKey] = jogadores
    return jogadores
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error)
    throw new Error('Falha ao buscar jogadores')
  }
}

// Função para buscar notícias
export const getNoticias = async (): Promise<Noticia[]> => {
  if (cachedData.noticias) {
    return cachedData.noticias as Noticia[]
  }

  try {
    const noticias = USE_LOCAL_DATA 
      ? await getNoticiasLocal()
      : await getNoticiasAPI()
      
    cachedData.noticias = noticias
    return noticias
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
    // Para notícias, retorna array vazio em vez de erro
    return []
  }
}

// Função para buscar transferências (mantida para compatibilidade)
export const getTransferenciasFromJson = async (
  temporadaOrigem: string,
  temporadaDestino: string
) => {
  try {
    if (USE_LOCAL_DATA) {
      // Simula delay
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
      
      try {
        const { Transferencias } = await import(`@/data/transferencias-${temporadaOrigem}-${temporadaDestino}`)
        return Transferencias
      } catch (error) {
        console.warn(`Arquivo de transferências ${temporadaOrigem}-${temporadaDestino} não encontrado`)
        return []
      }
    } else {
      const response = await api.get('/transferencias-json', {
        params: { temporadaOrigem, temporadaDestino }
      });
      return response.data;
    }
  } catch (error) {
    console.error('Erro ao buscar transferências:', error);
    throw new Error('Falha ao buscar transferências');
  }
};