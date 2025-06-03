import { TeamComparisonData, TeamComparisonTeam, ChartDataPoint, ComparisonCardData, StatCategory,StatType } from '@/types/teamComparison';

export const formatStatValue = (value: number, type: StatType = StatType.TOTAL): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';

  switch (type) {
    case StatType.PERCENTAGE:
      return `${Math.round(value)}%`;
    case StatType.AVERAGE:
      return value.toFixed(1).replace('.', ',');
    case StatType.RATIO:
      return value.toFixed(2).replace('.', ',');
    case StatType.TOTAL:
    default:
      return value.toLocaleString('pt-BR');
  }
};

export const calculatePercentage = (made: number, attempted: number): number => {
  if (attempted === 0) return 0;
  return (made / attempted) * 100;
};

export const calculateAverage = (total: number, attempts: number): number => {
  if (attempts === 0) return 0;
  return total / attempts;
};

export const compareValues = (
  value1: number, 
  value2: number, 
  higherIsBetter: boolean = true
): 'first' | 'second' | 'equal' => {
  if (value1 === value2) return 'equal';
  
  if (higherIsBetter) {
    return value1 > value2 ? 'first' : 'second';
  } else {
    return value1 < value2 ? 'first' : 'second';
  }
};

export const prepareChartData = (
  team1: TeamComparisonTeam,
  team2: TeamComparisonTeam,
  category: StatCategory
): ChartDataPoint[] => {
  const stats1 = team1.estatisticas[category];
  const stats2 = team2.estatisticas[category];

  if (!stats1 || !stats2) return [];

  const chartConfigs = {
    passe: [
      { key: 'jardas_de_passe', label: 'Jardas' },
      { key: 'passes_completos', label: 'Passes Comp.' },
      { key: 'passes_tentados', label: 'Passes Tent.' },
      { key: 'td_passados', label: 'TDs' },
      { key: 'interceptacoes_sofridas', label: 'Interceptações' }
    ],
    corrida: [
      { key: 'jardas_corridas', label: 'Jardas' },
      { key: 'corridas', label: 'Corridas' },
      { key: 'tds_corridos', label: 'TDs' },
      { key: 'fumble_de_corredor', label: 'Fumbles' }
    ],
    recepcao: [
      { key: 'jardas_recebidas', label: 'Jardas' },
      { key: 'recepcoes', label: 'Recepções' },
      { key: 'alvo', label: 'Alvos' },
      { key: 'tds_recebidos', label: 'TDs' }
    ],
    retorno: [
      { key: 'jardas_retornadas', label: 'Jardas' },
      { key: 'retornos', label: 'Retornos' },
      { key: 'td_retornados', label: 'TDs' }
    ],
    defesa: [
      { key: 'tackles_totais', label: 'Tackles' },
      { key: 'sacks_forcado', label: 'Sacks' },
      { key: 'interceptacao_forcada', label: 'Interceptações' },
      { key: 'fumble_forcado', label: 'Fumbles Forç.' },
      { key: 'td_defensivo', label: 'TDs' }
    ],
    kicker: [
      { key: 'fg_bons', label: 'FG Bons' },
      { key: 'tentativas_de_fg', label: 'FG Tent.' },
      { key: 'xp_bons', label: 'XP Bons' },
      { key: 'tentativas_de_xp', label: 'XP Tent.' }
    ],
    punter: [
      { key: 'jardas_de_punt', label: 'Jardas' },
      { key: 'punts', label: 'Punts' }
    ]
  };

  const config = chartConfigs[category] || [];

  return config.map(({ key, label }) => ({
    name: label,
    [team1.nome]: (stats1 as any)[key] || 0,
    [team2.nome]: (stats2 as any)[key] || 0,
  }));
};

export const generateComparisonCards = (
  team1: TeamComparisonTeam,
  team2: TeamComparisonTeam,
  category: StatCategory
): ComparisonCardData[] => {
  const stats1 = team1.estatisticas[category];
  const stats2 = team2.estatisticas[category];

  if (!stats1 || !stats2) return [];

  const cardConfigs = {
    passe: [
      {
        title: 'JARDAS DE PASSE',
        getValue: (stats: any) => stats.jardas_de_passe || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'PASSES COMPLETOS/TENTADOS',
        getValue: (stats: any) => `${stats.passes_completos || 0}/${stats.passes_tentados || 0}`,
        format: (val: any) => val
      },
      {
        title: 'PERCENTUAL DE PASSES',
        getValue: (stats: any) => calculatePercentage(stats.passes_completos || 0, stats.passes_tentados || 0),
        format: (val: number) => formatStatValue(val, StatType.PERCENTAGE)
      },
      {
        title: 'TOUCHDOWNS',
        getValue: (stats: any) => stats.td_passados || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      }
    ],
    corrida: [
      {
        title: 'JARDAS DE CORRIDA',
        getValue: (stats: any) => stats.jardas_corridas || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'CORRIDAS',
        getValue: (stats: any) => stats.corridas || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'TOUCHDOWNS',
        getValue: (stats: any) => stats.tds_corridos || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'MÉDIA POR CORRIDA',
        getValue: (stats: any) => calculateAverage(stats.jardas_corridas || 0, stats.corridas || 0),
        format: (val: number) => `${formatStatValue(val, StatType.AVERAGE)} jardas`
      }
    ],
    recepcao: [
      {
        title: 'JARDAS DE RECEPÇÃO',
        getValue: (stats: any) => stats.jardas_recebidas || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'RECEPÇÕES/ALVOS',
        getValue: (stats: any) => `${stats.recepcoes || 0}/${stats.alvo || 0}`,
        format: (val: any) => val
      },
      {
        title: 'TOUCHDOWNS',
        getValue: (stats: any) => stats.tds_recebidos || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      }
    ],
    retorno: [
      {
        title: 'JARDAS DE RETORNO',
        getValue: (stats: any) => stats.jardas_retornadas || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'RETORNOS',
        getValue: (stats: any) => stats.retornos || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'TOUCHDOWNS',
        getValue: (stats: any) => stats.td_retornados || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      }
    ],
    defesa: [
      {
        title: 'TACKLES TOTAIS',
        getValue: (stats: any) => stats.tackles_totais || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'SACKS',
        getValue: (stats: any) => stats.sacks_forcado || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'INTERCEPTAÇÕES',
        getValue: (stats: any) => stats.interceptacao_forcada || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'FUMBLES FORÇADOS',
        getValue: (stats: any) => stats.fumble_forcado || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      }
    ],
    kicker: [
      {
        title: 'FIELD GOALS',
        getValue: (stats: any) => `${stats.fg_bons || 0}/${stats.tentativas_de_fg || 0}`,
        format: (val: any) => val
      },
      {
        title: 'PERCENTUAL FG',
        getValue: (stats: any) => calculatePercentage(stats.fg_bons || 0, stats.tentativas_de_fg || 0),
        format: (val: number) => formatStatValue(val, StatType.PERCENTAGE)
      },
      {
        title: 'EXTRA POINTS',
        getValue: (stats: any) => `${stats.xp_bons || 0}/${stats.tentativas_de_xp || 0}`,
        format: (val: any) => val
      },
      {
        title: 'FG MAIS LONGO',
        getValue: (stats: any) => stats.fg_mais_longo || 0,
        format: (val: number) => `${val} jardas`
      }
    ],
    punter: [
      {
        title: 'JARDAS DE PUNT',
        getValue: (stats: any) => stats.jardas_de_punt || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'PUNTS',
        getValue: (stats: any) => stats.punts || 0,
        format: (val: number) => formatStatValue(val, StatType.TOTAL)
      },
      {
        title: 'MÉDIA POR PUNT',
        getValue: (stats: any) => calculateAverage(stats.jardas_de_punt || 0, stats.punts || 0),
        format: (val: number) => `${formatStatValue(val, StatType.AVERAGE)} jardas`
      }
    ]
  };

  const config = cardConfigs[category] || [];

  return config.map(({ title, getValue, format }) => {
    const value1 = getValue(stats1);
    const value2 = getValue(stats2);
    
    const stat1 = format(value1);
    const stat2 = format(value2);

    let isFirstBetter = false;
    let isSecondBetter = false;
    let isEqual = false;

    if (typeof value1 === 'number' && typeof value2 === 'number') {
      const comparison = compareValues(value1, value2);
      isFirstBetter = comparison === 'first';
      isSecondBetter = comparison === 'second';
      isEqual = comparison === 'equal';
    }

    return {
      title,
      stat1,
      stat2,
      color1: team1.cor,
      color2: team2.cor,
      isFirstBetter,
      isSecondBetter,
      isEqual
    };
  });
};

export const calculateComparisonSummary = (
  team1: TeamComparisonTeam,
  team2: TeamComparisonTeam
) => {
  const categories: StatCategory[] = ['passe', 'corrida', 'recepcao', 'retorno', 'defesa', 'kicker', 'punter'];
  
  const summary = {
    jardas_totais: {
      time1: (team1.estatisticas.passe.jardas_de_passe || 0) + 
             (team1.estatisticas.corrida.jardas_corridas || 0) + 
             (team1.estatisticas.recepcao.jardas_recebidas || 0),
      time2: (team2.estatisticas.passe.jardas_de_passe || 0) + 
             (team2.estatisticas.corrida.jardas_corridas || 0) + 
             (team2.estatisticas.recepcao.jardas_recebidas || 0)
    },
    touchdowns_totais: {
      time1: (team1.estatisticas.passe.td_passados || 0) + 
             (team1.estatisticas.corrida.tds_corridos || 0) + 
             (team1.estatisticas.recepcao.tds_recebidos || 0) +
             (team1.estatisticas.retorno.td_retornados || 0) +
             (team1.estatisticas.defesa.td_defensivo || 0),
      time2: (team2.estatisticas.passe.td_passados || 0) + 
             (team2.estatisticas.corrida.tds_corridos || 0) + 
             (team2.estatisticas.recepcao.tds_recebidos || 0) +
             (team2.estatisticas.retorno.td_retornados || 0) +
             (team2.estatisticas.defesa.td_defensivo || 0)
    },
    turnovers: {
      time1: (team1.estatisticas.passe.interceptacoes_sofridas || 0) + 
             (team1.estatisticas.passe.fumble_de_passador || 0) + 
             (team1.estatisticas.corrida.fumble_de_corredor || 0),
      time2: (team2.estatisticas.passe.interceptacoes_sofridas || 0) + 
             (team2.estatisticas.passe.fumble_de_passador || 0) + 
             (team2.estatisticas.corrida.fumble_de_corredor || 0)
    }
  };

  return summary;
};

export const generateExportFileName = (team1Name: string, team2Name: string, temporada: string): string => {
  const date = new Date().toISOString().split('T')[0];
  const cleanTeam1 = team1Name.replace(/[^a-zA-Z0-9]/g, '');
  const cleanTeam2 = team2Name.replace(/[^a-zA-Z0-9]/g, '');
  return `comparacao_${cleanTeam1}_vs_${cleanTeam2}_${temporada}_${date}`;
};

export const validateComparisonData = (data: TeamComparisonData): boolean => {
  if (!data || !data.teams || !data.teams.time1 || !data.teams.time2) {
    return false;
  }

  const team1 = data.teams.time1;
  const team2 = data.teams.time2;

  return !!(team1.nome && team1.estatisticas && team2.nome && team2.estatisticas);
};

export const normalizeComparisonData = (data: TeamComparisonData): TeamComparisonData => {
  const normalizeStats = (stats: any) => {
    const categories: StatCategory[] = ['passe', 'corrida', 'recepcao', 'retorno', 'defesa', 'kicker', 'punter'];
    
    categories.forEach(category => {
      if (!stats[category]) {
        stats[category] = {};
      }
    });

    return stats;
  };

  return {
    ...data,
    teams: {
      time1: {
        ...data.teams.time1,
        estatisticas: normalizeStats(data.teams.time1.estatisticas)
      },
      time2: {
        ...data.teams.time2,
        estatisticas: normalizeStats(data.teams.time2.estatisticas)
      }
    }
  };
};
