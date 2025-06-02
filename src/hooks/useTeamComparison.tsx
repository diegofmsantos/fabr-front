// src/hooks/useTeamComparison.tsx - VERSÃO CORRIGIDA
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTimes, useJogadores } from '@/hooks/queries';

// Flag para dados locais
const USE_LOCAL_DATA = process.env.NEXT_PUBLIC_USE_LOCAL_DATA === 'true'

// Função para processar comparação localmente
const processLocalComparison = (
  times: any[],
  jogadores: any[],
  time1Id: number,
  time2Id: number,
  temporada: string
) => {
  const time1 = times.find(t => t.id === time1Id)
  const time2 = times.find(t => t.id === time2Id)

  if (!time1 || !time2) {
    throw new Error('Times não encontrados')
  }

  const jogadoresTime1 = jogadores.filter(j => j.timeId === time1Id)
  const jogadoresTime2 = jogadores.filter(j => j.timeId === time2Id)

  // Processar estatísticas agregadas por time
  const estatisticasTime1 = agregarEstatisticas(jogadoresTime1)
  const estatisticasTime2 = agregarEstatisticas(jogadoresTime2)

  // Encontrar destaques por time
  const destaquesTime1 = encontrarDestaques(jogadoresTime1)
  const destaquesTime2 = encontrarDestaques(jogadoresTime2)

  return {
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
        time1: jogadoresTime1.length,
        time2: jogadoresTime2.length
      }
    }
  }
}

// Função para agregar estatísticas
const agregarEstatisticas = (jogadores: any[]) => {
  const estatisticas = {
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
  }

  jogadores.forEach(jogador => {
    // Somar estatísticas de passe
    estatisticas.passe.jardas_de_passe += jogador.estatisticas.passe?.jardas_de_passe || 0
    estatisticas.passe.passes_completos += jogador.estatisticas.passe?.passes_completos || 0
    estatisticas.passe.passes_tentados += jogador.estatisticas.passe?.passes_tentados || 0
    estatisticas.passe.td_passados += jogador.estatisticas.passe?.td_passados || 0
    estatisticas.passe.interceptacoes_sofridas += jogador.estatisticas.passe?.interceptacoes_sofridas || 0
    estatisticas.passe.sacks_sofridos += jogador.estatisticas.passe?.sacks_sofridos || 0
    estatisticas.passe.fumble_de_passador += jogador.estatisticas.passe?.fumble_de_passador || 0

    // Somar estatísticas de corrida
    estatisticas.corrida.jardas_corridas += jogador.estatisticas.corrida?.jardas_corridas || 0
    estatisticas.corrida.corridas += jogador.estatisticas.corrida?.corridas || 0
    estatisticas.corrida.tds_corridos += jogador.estatisticas.corrida?.tds_corridos || 0
    estatisticas.corrida.fumble_de_corredor += jogador.estatisticas.corrida?.fumble_de_corredor || 0

    // Somar estatísticas de recepção
    estatisticas.recepcao.jardas_recebidas += jogador.estatisticas.recepcao?.jardas_recebidas || 0
    estatisticas.recepcao.recepcoes += jogador.estatisticas.recepcao?.recepcoes || 0
    estatisticas.recepcao.alvo += jogador.estatisticas.recepcao?.alvo || 0
    estatisticas.recepcao.tds_recebidos += jogador.estatisticas.recepcao?.tds_recebidos || 0

    // Somar estatísticas de retorno
    estatisticas.retorno.jardas_retornadas += jogador.estatisticas.retorno?.jardas_retornadas || 0
    estatisticas.retorno.retornos += jogador.estatisticas.retorno?.retornos || 0
    estatisticas.retorno.td_retornados += jogador.estatisticas.retorno?.td_retornados || 0

    // Somar estatísticas de defesa
    estatisticas.defesa.tackles_totais += jogador.estatisticas.defesa?.tackles_totais || 0
    estatisticas.defesa.tackles_for_loss += jogador.estatisticas.defesa?.tackles_for_loss || 0
    estatisticas.defesa.sacks_forcado += jogador.estatisticas.defesa?.sacks_forcado || 0
    estatisticas.defesa.fumble_forcado += jogador.estatisticas.defesa?.fumble_forcado || 0
    estatisticas.defesa.interceptacao_forcada += jogador.estatisticas.defesa?.interceptacao_forcada || 0
    estatisticas.defesa.passe_desviado += jogador.estatisticas.defesa?.passe_desviado || 0
    estatisticas.defesa.safety += jogador.estatisticas.defesa?.safety || 0
    estatisticas.defesa.td_defensivo += jogador.estatisticas.defesa?.td_defensivo || 0

    // Somar estatísticas de kicker
    estatisticas.kicker.fg_bons += jogador.estatisticas.kicker?.fg_bons || 0
    estatisticas.kicker.tentativas_de_fg += jogador.estatisticas.kicker?.tentativas_de_fg || 0
    estatisticas.kicker.xp_bons += jogador.estatisticas.kicker?.xp_bons || 0
    estatisticas.kicker.tentativas_de_xp += jogador.estatisticas.kicker?.tentativas_de_xp || 0
    
    // Para fg_mais_longo, pegar o maior valor
    if ((jogador.estatisticas.kicker?.fg_mais_longo || 0) > estatisticas.kicker.fg_mais_longo) {
      estatisticas.kicker.fg_mais_longo = jogador.estatisticas.kicker?.fg_mais_longo || 0
    }

    // Somar estatísticas de punter
    estatisticas.punter.punts += jogador.estatisticas.punter?.punts || 0
    estatisticas.punter.jardas_de_punt += jogador.estatisticas.punter?.jardas_de_punt || 0
  })

  return estatisticas
}

// Função para encontrar destaques
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
  }
}

// Função para encontrar melhor jogador
const melhorJogador = (jogadores: any[], categoria: string, estatistica: string) => {
  let melhor = null
  let melhorValor = 0

  jogadores.forEach(jogador => {
    let valor = 0
    
    const categoriaStats = jogador.estatisticas[categoria]
    
    if (categoriaStats && typeof categoriaStats === 'object') {
      const estatisticaValue = categoriaStats[estatistica]
      valor = typeof estatisticaValue === 'number' ? estatisticaValue : 0
    }
    
    if (valor > melhorValor) {
      melhorValor = valor
      melhor = {
        id: jogador.id,
        nome: jogador.nome,
        camisa: jogador.camisa,
        numero: jogador.numero,
        posicao: jogador.posicao,
        estatisticas: jogador.estatisticas
      }
    }
  })

  return melhor
}

// Hook principal
export function useTeamComparison() {
  const [selectedTeams, setSelectedTeams] = useState<{time1Id?: number, time2Id?: number}>({});
  const [temporada, setTemporada] = useState('2024');
  
  const teamsSelected = !!(selectedTeams.time1Id && selectedTeams.time2Id);
  
  // Buscar dados base
  const { data: times = [] } = useTimes(temporada);
  const { data: jogadores = [] } = useJogadores(temporada);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['teamComparison', selectedTeams.time1Id, selectedTeams.time2Id, temporada],
    queryFn: async () => {
      if (!teamsSelected) return null;
      
      if (USE_LOCAL_DATA) {
        // Processar dados localmente
        return processLocalComparison(times, jogadores, selectedTeams.time1Id!, selectedTeams.time2Id!, temporada);
      } else {
        // Buscar da API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comparar-times?time1Id=${selectedTeams.time1Id}&time2Id=${selectedTeams.time2Id}&temporada=${temporada}`);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar comparação: ${response.status}`);
        }
        
        return response.json();
      }
    },
    enabled: teamsSelected && times.length > 0 && jogadores.length > 0,
    staleTime: 1000 * 60 * 5,
  });
  
  // Função para selecionar um time
  const selectTeam = (position: 'time1Id' | 'time2Id', teamId: number) => {
    setSelectedTeams(prev => ({
      ...prev,
      [position]: teamId
    }));
  };
  
  // Função para mudar a temporada
  const changeTemporada = (newTemporada: string) => {
    if (newTemporada !== '2024' && newTemporada !== '2025') {
      console.warn(`Temporada inválida: ${newTemporada}, usando 2024`);
      newTemporada = '2024';
    }
    setTemporada(newTemporada);
  };
  
  // Função para trocar os times
  const swapTeams = () => {
    setSelectedTeams(prev => ({
      time1Id: prev.time2Id,
      time2Id: prev.time1Id
    }));
  };
  
  return {
    data,
    isLoading,
    error,
    teamsSelected,
    selectedTeams,
    temporada,
    selectTeam,
    changeTemporada,
    swapTeams,
    refetch
  };
}