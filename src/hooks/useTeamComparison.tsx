import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/axios';
import { Time } from '@/types/time';

// Estruturas de estatísticas para futebol americano
interface TeamOffenseStats {
  // Estatísticas de passe
  jardas_de_passe: number;
  passes_completos: number;
  passes_tentados: number;
  td_passados: number;
  interceptacoes_sofridas: number;
  sacks_sofridos: number;
  fumble_de_passador: number;
  
  // Estatísticas de corrida
  jardas_corridas: number;
  corridas: number;
  tds_corridos: number;
  fumble_de_corredor: number;
  
  // Estatísticas de recepção
  jardas_recebidas: number;
  recepcoes: number;
  alvo: number;
  tds_recebidos: number;
  
  // Estatísticas de retorno
  jardas_retornadas: number;
  retornos: number;
  td_retornados: number;
}

interface TeamDefenseStats {
  tackles_totais: number;
  tackles_for_loss: number;
  sacks_forcado: number;
  fumble_forcado: number;
  interceptacao_forcada: number;
  passe_desviado: number;
  safety: number;
  td_defensivo: number;
}

interface TeamSpecialTeamsStats {
  // Kicker
  fg_bons: number;
  tentativas_de_fg: number;
  fg_mais_longo: number;
  xp_bons: number;
  tentativas_de_xp: number;
  
  // Punter
  jardas_de_punt: number;
  punts: number;
}

interface PlayerHighlight {
  id: number;
  nome: string;
  camisa: string;
  numero: number;
  estatisticas: {
    passe?: Record<string, any>;
    corrida?: Record<string, any>;
    recepcao?: Record<string, any>;
    retorno?: Record<string, any>;
    defesa?: Record<string, any>;
    kicker?: Record<string, any>;
    punter?: Record<string, any>;
  };
}

interface TeamComparisonDetail {
  id: number;
  nome: string;
  sigla: string;
  cor: string;
  cidade: string;
  bandeira_estado: string;
  fundacao: string;
  logo: string;
  capacete: string;
  estadio: string;
  presidente: string;
  head_coach: string;
  coord_ofen: string;
  coord_defen: string;
  estatisticas: {
    passe: {
      jardas_de_passe: number;
      passes_completos: number;
      passes_tentados: number;
      td_passados: number;
      interceptacoes_sofridas: number;
      sacks_sofridos: number;
      fumble_de_passador: number;
    };
    corrida: {
      jardas_corridas: number;
      corridas: number;
      tds_corridos: number;
      fumble_de_corredor: number;
    };
    recepcao: {
      jardas_recebidas: number;
      recepcoes: number;
      alvo: number;
      tds_recebidos: number;
    };
    retorno: {
      jardas_retornadas: number;
      retornos: number;
      td_retornados: number;
    };
    defesa: {
      tackles_totais: number;
      tackles_for_loss: number;
      sacks_forcado: number;
      fumble_forcado: number;
      interceptacao_forcada: number;
      passe_desviado: number;
      safety: number;
      td_defensivo: number;
    };
    kicker: {
      fg_bons: number;
      tentativas_de_fg: number;
      fg_mais_longo: number;
      xp_bons: number;
      tentativas_de_xp: number;
    };
    punter: {
      jardas_de_punt: number;
      punts: number;
    };
  };
  destaques: {
    ataque: {
      passador: PlayerHighlight | null;
      corredor: PlayerHighlight | null;
      recebedor: PlayerHighlight | null;
      retornador: PlayerHighlight | null;
    };
    defesa: {
      tackler: PlayerHighlight | null;
      rusher: PlayerHighlight | null;
      interceptador: PlayerHighlight | null;
      desviador: PlayerHighlight | null;
    };
    specialTeams: {
      kicker: PlayerHighlight | null;
      punter: PlayerHighlight | null;
    };
  };
}

interface TeamComparisonData {
  teams: {
    time1: TeamComparisonDetail;
    time2: TeamComparisonDetail;
  }
}

export function useTeamComparison() {
  const [selectedTeams, setSelectedTeams] = useState<{time1Id?: number, time2Id?: number}>({});
  const [temporada, setTemporada] = useState('2024'); // Default para futebol americano
  
  const teamsSelected = !!(selectedTeams.time1Id && selectedTeams.time2Id);
  
  const { data, isLoading, error, refetch } = useQuery<TeamComparisonData>({
    queryKey: ['teamComparison', selectedTeams.time1Id, selectedTeams.time2Id, temporada],
    queryFn: async () => {
      if (!teamsSelected) return null;
      
      // API compatível com a estrutura do futebol americano
      const { data } = await api.get('/comparar-times', {
        params: {
          time1Id: selectedTeams.time1Id,
          time2Id: selectedTeams.time2Id,
          temporada
        }
      });
      
      return data;
    },
    enabled: teamsSelected,
    staleTime: 1000 * 60 * 5, // 5 minutos
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
    // Validar que a temporada é 2024 ou 2025
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