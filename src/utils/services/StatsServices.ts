import { CorridaStats, DefesaStats, KickerStats, PasseStats, PunterStats, RecepcaoStats, RetornoStats, StatKey, StatsBase } from "@/types/Stats";
import { CATEGORY_THRESHOLDS, CategoryKey, getTierForValue } from "../categoryThresholds";
import { Jogador } from "@/types/jogador";
import { getStatCategory, StatConfig, StatResult } from "../constants/statMappings";
import { getCategoryFromKey } from "../helpers/categoryHelpers";


const calculateDefenseTotal = (stats: DefesaStats): number => {
    return stats.tackles_totais +
        stats.tackles_for_loss +
        stats.sacks_forcado +
        stats.fumble_forcado +
        stats.interceptacao_forcada +
        stats.passe_desviado +
        stats.safety +
        stats.td_defensivo;
}

export class StatsCalculator {
  private static calculateAverage(numerator: number, denominator: number): number | null {
    return denominator > 0 ? numerator / denominator : null
  }

  private static calculatePercentage(made: number, attempted: number): number | null {
    return attempted > 0 ? (made / attempted) * 100 : null
  }

  private static parseStringRatio(value: string): { made: number; attempted: number } | null {
    if (!value || value === '') return null
    const [made, attempted] = value.split('/').map(Number)
    if (isNaN(made) || isNaN(attempted)) return null
    return { made, attempted }
  }

  private static getFieldGoalRatio(value: string): number {
    if (!value || value === 'N/A') return 0
    const ratio = this.parseStringRatio(value)
    if (!ratio || ratio.attempted === 0) return 0
    return ratio.made / ratio.attempted
  }

  static compareFieldGoals(a: string, b: string): number {
    const ratioA = this.getFieldGoalRatio(a)
    const ratioB = this.getFieldGoalRatio(b)
    return ratioB - ratioA
  }

  static calculate(stats: any, key: string): number | string | null {
    if (!stats) return null

    switch (key) {
      case 'jardas_media':
        return this.calculateAverage(stats.jardas_de_passe, stats.passes_tentados)
        
      case 'jardas_corridas_media':
        return this.calculateAverage(stats.jardas_corridas, stats.corridas)
        
      case 'jardas_recebidas_media':
        return this.calculateAverage(stats.jardas_recebidas, stats.alvo)
        
      case 'jardas_retornadas_media':
        return this.calculateAverage(stats.jardas_retornadas, stats.retornos)
        
      case 'jardas_punt_media':
        return this.calculateAverage(stats.jardas_de_punt, stats.punts)
    }

    switch (key) {
      case 'passes_percentual':
        return this.calculatePercentage(stats.passes_completos, stats.passes_tentados)
        
      case 'field_goals':
        return this.calculatePercentage(stats.fg_bons, stats.tentativas_de_fg)
        
      case 'extra_points':
        return this.calculatePercentage(stats.xp_bons, stats.tentativas_de_xp)
    }

    if (key.match(/^fg_\d+_\d+$/)) {
      const stringRatio = stats[key]
      if (typeof stringRatio !== 'string') return null
      return stringRatio || null
    }

    return typeof stats[key] === 'number' ? stats[key] : null
  }

  static formatValue(value: number | string | null, isCalculated: boolean, key: string): string {
    if (value === null) return 'N/A'

    if (typeof value === 'string' && value.includes('/')) {
      return value
    }

    if (isCalculated && key.includes('media')) {
      return typeof value === 'number' ? value.toFixed(1) : 'N/A';
    }

    if (isCalculated && (key.includes('percentual') || key === 'field_goals' || key === 'extra_points')) {
      return typeof value === 'number' ? `${Math.round(value)}%` : 'N/A'
    }

    return typeof value === 'number' ? Math.round(value).toString() : 'N/A'
  }
}

export const calculateStat = (player: Jogador, key: StatKey): string | number | null => {
    try {
        switch (key) {
            case 'passes_percentual':
                return player.estatisticas.passe.passes_tentados > 0
                    ? Math.round((player.estatisticas.passe.passes_completos / player.estatisticas.passe.passes_tentados) * 100)
                    : null
            case 'jardas_media':
                return player.estatisticas.passe.passes_completos > 0
                    ? Number((player.estatisticas.passe.jardas_de_passe / player.estatisticas.passe.passes_tentados))
                    : null
            case 'jardas_corridas_media':
                return player.estatisticas.corrida.corridas > 0
                    ? Number((player.estatisticas.corrida.jardas_corridas / player.estatisticas.corrida.corridas))
                    : null
            case 'jardas_recebidas_media':
                return player.estatisticas.recepcao.recepcoes > 0
                    ? Number((player.estatisticas.recepcao.jardas_recebidas / player.estatisticas.recepcao.alvo))
                    : null
            case 'jardas_retornadas_media':
                return player.estatisticas.retorno.retornos > 0
                    ? Number((player.estatisticas.retorno.jardas_retornadas / player.estatisticas.retorno.retornos))
                    : null
            case 'extra_points':
                return player.estatisticas.kicker.tentativas_de_xp > 0
                    ? Math.round((player.estatisticas.kicker.xp_bons / player.estatisticas.kicker.tentativas_de_xp) * 100)
                    : null
            case 'field_goals':
                return player.estatisticas.kicker.tentativas_de_fg > 0
                    ? Math.round((player.estatisticas.kicker.fg_bons / player.estatisticas.kicker.tentativas_de_fg) * 100)
                    : null
            case 'jardas_punt_media':
                return player.estatisticas.punter.punts > 0
                    ? Number((player.estatisticas.punter.jardas_de_punt / player.estatisticas.punter.punts))
                    : null
            default:
                const category = getStatCategory(key)
                const stats = player.estatisticas[category]
                return stats[key as keyof typeof stats] as number
        }
    } catch (error) {
        console.error(`Error calculating statistic ${key}:`, error)
        return null
    }
}

export const calculateStatValue = (player: Jogador, mapping: StatConfig): StatResult => {
    try {
        const category = mapping.category
        const stats = player.estatisticas[category]

        if (!stats || !checkCategoryMinimum(category, stats)) {
            return { value: null, tier: 3 }
        }

        let value: number | null

        if (mapping.isCalculated) {
            value = calculateDerivedStat(stats, mapping.key)
        } else {
            value = stats[mapping.key as keyof typeof stats] as number
        }

        if (value === null || value === undefined) {
            return { value: null, tier: 3 }
        }

        const tier = getTierForValue(value, category)

        return { value, tier }
    } catch (error) {
        console.error('Error calculating stat value:', error)
        
        return { value: null, tier: 3 }
    }
}

const calculateDerivedStat = (stats: any, key: string): number | null => {
    switch (key) {
        case 'passes_percentual':
            return stats.passes_tentados > 0
                ? (stats.passes_completos / stats.passes_tentados) * 100
                : null
        case 'jardas_media':
            return stats.passes_tentados > 0
                ? stats.jardas_de_passe / stats.passes_tentados
                : null
        case 'jardas_corridas_media':
            return stats.corridas > 0
                ? stats.jardas_corridas / stats.corridas
                : null
        case 'jardas_recebidas_media':
            return stats.alvo > 0
                ? stats.jardas_recebidas / stats.alvo
                : null
        case 'jardas_retornadas_media':
            return stats.retornos > 0
                ? stats.jardas_retornadas / stats.retornos
                : null
        case 'extra_points':
            return stats.tentativas_de_xp > 0
                ? (stats.xp_bons / stats.tentativas_de_xp) * 100
                : null
        case 'field_goals':
            return stats.tentativas_de_fg > 0
                ? (stats.fg_bons / stats.tentativas_de_fg) * 100
                : null
        case 'jardas_punt_media':
            return stats.punts > 0
                ? stats.jardas_de_punt / stats.punts
                : null
        default:
            return null
    }
}

const checkCategoryMinimum = (category: CategoryKey, stats: any): boolean => {
    const thresholds = CATEGORY_THRESHOLDS[category];
    if (!thresholds) return false;

    switch (category) {
        case 'passe':
            return (stats as PasseStats).passes_tentados >= thresholds.tier3;
        case 'corrida':
            return (stats as CorridaStats).corridas >= thresholds.tier3;
        case 'recepcao':
            return (stats as RecepcaoStats).alvo >= thresholds.tier3;
        case 'retorno':
            return (stats as RetornoStats).retornos >= thresholds.tier3;
        case 'defesa':
            return calculateDefenseTotal(stats as DefesaStats) >= thresholds.tier3;
        case 'kicker':
            return (stats as KickerStats).tentativas_de_fg >= thresholds.tier3;
        case 'punter':
            return (stats as PunterStats).punts >= thresholds.tier3;
    }
}

export class BaseStatCalculator {
    static calculate(stats: StatsBase[keyof StatsBase], category: CategoryKey): number {
      switch (category) {
        case 'defesa':
          return this.calculateDefenseTotal(stats as DefesaStats)
        default:
          return this.getBasicStat(stats, category)
      }
    }
  
    private static calculateDefenseTotal(stats: DefesaStats): number {
      return stats.tackles_totais +
             stats.tackles_for_loss +
             stats.sacks_forcado +
             stats.fumble_forcado +
             stats.interceptacao_forcada +
             stats.passe_desviado +
             stats.safety +
             stats.td_defensivo;
    }
  
    private static getBasicStat(stats: any, category: CategoryKey): number {
      const statMap: Record<CategoryKey, string> = {
        passe: 'passes_tentados',
        corrida: 'corridas',
        recepcao: 'alvo',
        retorno: 'retornos',
        kicker: 'tentativas_de_fg',
        punter: 'punts',
        defesa: 'tackles_totais'
      }
  
      return stats[statMap[category]] || 0;
    }
  }

  export const shouldIncludePlayer = (player: Jogador, key: StatKey, category: string): boolean => {
    try {
        if (!meetsMinimumRequirements(player, category)) {
            return false
        }

        const value = calculateStat(player, key)
        if (value === null) return false
        return Number(value) > 0
    } catch (error) {
        console.error(`Error checking statistic ${key}:`, error)
        return false
    }
}

export const meetsMinimumRequirements = (player: Jogador, category: string): boolean => {
    try {
        switch (category) {
            case 'DEFESA':
                const defStats = player.estatisticas.defesa;
                const defTotal =
                    defStats.tackles_totais +
                    defStats.tackles_for_loss +
                    defStats.sacks_forcado +
                    defStats.fumble_forcado +
                    defStats.interceptacao_forcada +
                    defStats.passe_desviado +
                    defStats.safety +
                    defStats.td_defensivo;
                return defTotal >= 4.8;
            case 'PASSE':
                return player.estatisticas.passe.passes_tentados >= 40.9
            case 'CHUTE':
                return player.estatisticas.kicker.tentativas_de_fg >= 1.8
            case 'CORRIDA':
                return player.estatisticas.corrida.corridas >= 10.2
            case 'RECEPÇÃO':
                return player.estatisticas.recepcao.alvo >= 7.5
            case 'RETORNO':
                return player.estatisticas.retorno.retornos >= 2.9
            case 'PUNT':
                return player.estatisticas.punter.punts >= 6.4
            default:
                return true
        }
    } catch (error) {
        console.error(`Error checking minimum requirements for ${category}:`, error)
        return false
    }
}

export const compareValues = (a: string | number | null, b: string | number | null): number => {
    if (a === null && b === null) return 0
    if (a === null) return 1
    if (b === null) return -1

    // Comparação normal para números
    return Number(b) - Number(a)
}

export const getFGRatio = (fgString: string): number => {
    if (!fgString || fgString === '') return 0
    const [made, attempted] = fgString.split('/').map(Number)
    if (isNaN(made) || isNaN(attempted) || attempted === 0) return 0
    return made / attempted
}


export const calculateTeamStat = (teamStat: any, key: string): number | null => {
        try {
            const category = getCategoryFromKey(key);
            
            // Verificar se a categoria e chave existem
            if (!teamStat[category] || !(key in teamStat[category]) && 
                !['passes_percentual', 'jardas_media', 'jardas_corridas_media', 
                'jardas_recebidas_media', 'jardas_retornadas_media', 'extra_points', 
                'field_goals', 'jardas_punt_media'].includes(key)) {
                return null;
            }

            switch (key) {
                case 'passes_percentual':
                    return teamStat.passe.passes_tentados > 0
                        ? (teamStat.passe.passes_completos / teamStat.passe.passes_tentados) * 100
                        : null
                case 'jardas_media':
                    return teamStat.passe.passes_tentados > 0
                        ? teamStat.passe.jardas_de_passe / teamStat.passe.passes_tentados
                        : null
                case 'jardas_corridas_media':
                    return teamStat.corrida.corridas > 0
                        ? teamStat.corrida.jardas_corridas / teamStat.corrida.corridas
                        : null
                case 'jardas_recebidas_media':
                    return teamStat.recepcao.alvo > 0
                        ? teamStat.recepcao.jardas_recebidas / teamStat.recepcao.alvo
                        : null
                case 'jardas_retornadas_media':
                    return teamStat.retorno.retornos > 0
                        ? teamStat.retorno.jardas_retornadas / teamStat.retorno.retornos
                        : null
                case 'jardas_punt_media':
                    return teamStat.punter.punts > 0
                        ? teamStat.punter.jardas_de_punt / teamStat.punter.punts
                        : null
                case 'extra_points':
                    return teamStat.kicker.tentativas_de_xp > 0
                        ? (teamStat.kicker.xp_bons / teamStat.kicker.tentativas_de_xp) * 100
                        : null
                case 'field_goals':
                    return teamStat.kicker.tentativas_de_fg > 0
                        ? (teamStat.kicker.fg_bons / teamStat.kicker.tentativas_de_fg) * 100
                        : null;
                default:
                    return teamStat[category][key];
            }
        } catch (error) {
            console.error(`Error calculating stat ${key}:`, error)
            return null
        }
    }