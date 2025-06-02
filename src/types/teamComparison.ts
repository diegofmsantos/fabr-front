// src/types/teamComparison.ts

export interface TeamComparisonStats {
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
}

export interface TeamComparisonPlayer {
  id: number;
  nome: string;
  camisa: string;
  numero: number;
  posicao: string;
  estatisticas: {
    passe?: Record<string, number>;
    corrida?: Record<string, number>;
    recepcao?: Record<string, number>;
    retorno?: Record<string, number>;
    defesa?: Record<string, number>;
    kicker?: Record<string, number>;
    punter?: Record<string, number>;
  };
}

export interface TeamComparisonHighlights {
  ataque: {
    passador: TeamComparisonPlayer | null;
    corredor: TeamComparisonPlayer | null;
    recebedor: TeamComparisonPlayer | null;
    retornador: TeamComparisonPlayer | null;
  };
  defesa: {
    tackler: TeamComparisonPlayer | null;
    rusher: TeamComparisonPlayer | null;
    interceptador: TeamComparisonPlayer | null;
    desviador: TeamComparisonPlayer | null;
  };
  specialTeams: {
    kicker: TeamComparisonPlayer | null;
    punter: TeamComparisonPlayer | null;
  };
}

export interface TeamComparisonTeam {
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
  temporada: string;
  estatisticas: TeamComparisonStats;
  destaques: TeamComparisonHighlights;
}

export interface TeamComparisonData {
  teams: {
    time1: TeamComparisonTeam;
    time2: TeamComparisonTeam;
  };
  metaData: {
    temporada: string;
    geradoEm: string;
    totalJogos: {
      time1: number;
      time2: number;
    };
  };
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export type StatCategory = 'passe' | 'corrida' | 'recepcao' | 'retorno' | 'defesa' | 'kicker' | 'punter';

export interface ComparisonCardData {
  title: string;
  stat1: string;
  stat2: string;
  color1: string;
  color2: string;
  isFirstBetter?: boolean;
  isSecondBetter?: boolean;
  isEqual?: boolean;
}

export interface PlayerComparisonData {
  title: string;
  player1: TeamComparisonPlayer | null;
  player2: TeamComparisonPlayer | null;
  team1: TeamComparisonTeam;
  team2: TeamComparisonTeam;
  statKey: string;
  statCategory: StatCategory;
}

// Utility types para diferentes tipos de comparação
export type StatComparison = {
  [K in StatCategory]: {
    [key: string]: number;
  };
};

export interface TeamComparisonResponse {
  success: boolean;
  data: TeamComparisonData;
  message?: string;
  error?: string;
}

// Enum para diferentes tipos de estatísticas
export enum StatType {
  TOTAL = 'total',
  AVERAGE = 'average',
  PERCENTAGE = 'percentage',
  RATIO = 'ratio'
}

// Interface para configuração de estatísticas
export interface StatConfig {
  key: string;
  title: string;
  category: StatCategory;
  type: StatType;
  format?: (value: number) => string;
  compareFunction?: (a: number, b: number) => number;
}

// Interface para filtros de comparação
export interface ComparisonFilters {
  temporada: string;
  categoria?: StatCategory;
  tipoEstatistica?: StatType;
  ordenarPor?: 'nome' | 'valor' | 'diferenca';
  mostrarApenas?: 'melhores' | 'piores' | 'todos';
}

// Interface para resultado de comparação processada
export interface ProcessedComparison {
  teams: {
    time1: TeamComparisonTeam;
    time2: TeamComparisonTeam;
  };
  comparisons: {
    [category in StatCategory]: ComparisonCardData[];
  };
  highlights: {
    [category in StatCategory]: PlayerComparisonData[];
  };
  charts: {
    [category in StatCategory]: ChartDataPoint[];
  };
  summary: {
    vencedor: 'time1' | 'time2' | 'empate';
    categorias_vencidas: {
      time1: StatCategory[];
      time2: StatCategory[];
      empates: StatCategory[];
    };
    pontuacao: {
      time1: number;
      time2: number;
    };
  };
}