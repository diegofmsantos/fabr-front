import { Jogador } from '@/types/jogador'
import { CategoryKey } from '../categoryThresholds'
import { StatKey } from '@/types/Stats'

export interface StatConfig {
    key: string
    title: string
    category: CategoryKey
    isCalculated?: boolean
}

export interface StatResult {
    value: number | null
    tier: number
}

export const getStatMapping = (statParam: string | null): StatConfig => {
    if (!statParam) {
        return {
            key: 'not_found',
            title: 'Estatística não encontrada',
            category: 'passe'
        }
    }

    const urlParam = statParam.toLowerCase();

    const mapping = statMappings[urlParam]
    if (mapping) return mapping

    return {
        key: 'not_found',
        title: 'Estatística não encontrada',
        category: 'passe'
    }
}

export const getStatCategory = (key: StatKey): keyof Jogador['estatisticas'] => {
    switch (key) {
        case 'passes_percentual':
        case 'passes_completos':
        case 'passes_tentados':
        case 'jardas_de_passe':
        case 'td_passados':
        case 'interceptacoes_sofridas':
        case 'sacks_sofridos':
        case 'fumble_de_passador':
        case 'jardas_media':
            return 'passe'
        case 'corridas':
        case 'jardas_corridas':
        case 'tds_corridos':
        case 'fumble_de_corredor':
        case 'jardas_corridas_media':
            return 'corrida'
        case 'recepcoes':
        case 'alvo':
        case 'jardas_recebidas':
        case 'tds_recebidos':
        case 'jardas_recebidas_media':
            return 'recepcao'
        case 'retornos':
        case 'jardas_retornadas':
        case 'td_retornados':
        case 'jardas_retornadas_media':
            return 'retorno'
        case 'tackles_totais':
        case 'tackles_for_loss':
        case 'sacks_forcado':
        case 'fumble_forcado':
        case 'interceptacao_forcada':
        case 'passe_desviado':
        case 'safety':
        case 'td_defensivo':
            return 'defesa'
        case 'extra_points':
        case 'field_goals':
        case 'xp_bons':
        case 'tentativas_de_xp':
        case 'fg_bons':
        case 'tentativas_de_fg':
        case 'fg_mais_longo':
            return 'kicker'
        case 'jardas_punt_media':
        case 'punts':
        case 'jardas_de_punt':
            return 'punter'
        default:
            throw new Error(`Chave de estatística desconhecida: ${key}`)
    }
}

export const statMappings: { [key: string]: StatConfig } = {
    'passe-jardas': {
        key: 'jardas_de_passe',
        title: 'Jardas',
        category: 'passe'
    },
    'passe-passes': {
        key: 'passes_percentual',
        title: 'Passes Completos (%)',
        category: 'passe',
        isCalculated: true
    },
    'passe-jardasavg': {
        key: 'jardas_media',
        title: 'Jardas(AVG)',
        category: 'passe',
        isCalculated: true
    },
    'passe-touchdowns': {
        key: 'td_passados',
        title: 'Touchdowns',
        category: 'passe'
    },
    'passe-passes-comp': {
        key: 'passes_completos',
        title: 'Passes Completos',
        category: 'passe'
    },
    'passe-passes-tent': {
        key: 'passes_tentados',
        title: 'Passes Tentados',
        category: 'passe'
    },
    'passe-interceptacoes': {
        key: 'interceptacoes_sofridas',
        title: 'Interceptações',
        category: 'passe'
    },
    'passe-sacks': {
        key: 'sacks_sofridos',
        title: 'Sacks',
        category: 'passe'
    },
    'passe-fumbles': {
        key: 'fumble_de_passador',
        title: 'Fumbles',
        category: 'passe'
    },
    'corrida-jardas': {
        key: 'jardas_corridas',
        title: 'Jardas',
        category: 'corrida'
    },
    'corrida-corridas': {
        key: 'corridas',
        title: 'Corridas',
        category: 'corrida'
    },
    'corrida-jardasavg': {
        key: 'jardas_corridas_media',
        title: 'Jardas(AVG)',
        category: 'corrida',
        isCalculated: true
    },
    'corrida-touchdowns': {
        key: 'tds_corridos',
        title: 'Touchdowns',
        category: 'corrida'
    },
    'corrida-fumbles': {
        key: 'fumble_de_corredor',
        title: 'Fumbles',
        category: 'corrida'
    },
    'recepcao-jardas': {
        key: 'jardas_recebidas',
        title: 'Jardas',
        category: 'recepcao'
    },
    'recepcao-recepcoes': {
        key: 'recepcoes',
        title: 'Recepções',
        category: 'recepcao'
    },
    'recepcao-touchdowns': {
        key: 'tds_recebidos',
        title: 'Touchdowns',
        category: 'recepcao'
    },
    'recepcao-jardasavg': {
        key: 'jardas_recebidas_media',
        title: 'Jardas(AVG)',
        category: 'recepcao',
        isCalculated: true
    },
    'recepcao-alvos': {
        key: 'alvo',
        title: 'Alvos',
        category: 'recepcao'
    },
    'retorno-jardas': {
        key: 'jardas_retornadas',
        title: 'Jardas',
        category: 'retorno'
    },
    'retorno-retornos': {
        key: 'retornos',
        title: 'Retornos',
        category: 'retorno'
    },
    'retorno-touchdowns': {
        key: 'td_retornados',
        title: 'Touchdowns',
        category: 'retorno'
    },
    'retorno-jardasavg': {
        key: 'jardas_retornadas_media',
        title: 'Jardas(AVG)',
        category: 'retorno',
        isCalculated: true
    },
    'defesa-sacks': {
        key: 'sacks_forcado',
        title: 'Sacks',
        category: 'defesa'
    },
    'defesa-interceptacoes': {
        key: 'interceptacao_forcada',
        title: 'Interceptações',
        category: 'defesa'
    },
    'defesa-fumbles-forc': {
        key: 'fumble_forcado',
        title: 'Fumbles Forçados',
        category: 'defesa'
    },
    'defesa-touchdowns': {
        key: 'td_defensivo',
        title: 'Touchdowns',
        category: 'defesa'
    },
    'defesa-tacklesloss': {
        key: 'tackles_for_loss',
        title: 'Tackles (Loss)',
        category: 'defesa'
    },
    'defesa-tackles-totais': {
        key: 'tackles_totais',
        title: 'Tackles Totais',
        category: 'defesa'
    },
    'defesa-passes-desv': {
        key: 'passe_desviado',
        title: 'Passes Desviados',
        category: 'defesa'
    },
    'defesa-safeties': {
        key: 'safety',
        title: 'Safeties',
        category: 'defesa'
    },
    'chute-fg': {
        key: 'field_goals',
        title: 'FG(%)',
        category: 'kicker',
        isCalculated: true
    },
    'chute-xp': {
        key: 'extra_points',
        title: 'Extra Points(%)',
        category: 'kicker',
        isCalculated: true
    },
    'chute-xp-bom': {
        key: 'xp_bons',
        title: 'XP Bons',
        category: 'kicker'
    },
    'chute-xp-tentados': {
        key: 'tentativas_de_xp',
        title: 'XP Tentados',
        category: 'kicker'
    },
    'chute-fg-bom': {
        key: 'fg_bons',
        title: 'FG Bons',
        category: 'kicker'
    },
    'chute-fg-tentados': {
        key: 'tentativas_de_fg',
        title: 'FG Tentados',
        category: 'kicker'
    },
    'chute-mais-longo': {
        key: 'fg_mais_longo',
        title: 'FG Mais Longo',
        category: 'kicker'
    },
    'punt-jardasavg': {
        key: 'jardas_punt_media',
        title: 'Jardas (AVG)',
        category: 'punter',
        isCalculated: true
    },
    'punt-punts': {
        key: 'punts',
        title: 'Punts',
        category: 'punter'
    },
    'punt-jardas': {
        key: 'jardas_de_punt',
        title: 'Jardas',
        category: 'punter'
    }
}