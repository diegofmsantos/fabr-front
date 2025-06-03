import { StatKey } from "@/types/Stats";

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    passe: 'PASSE',
    corrida: 'CORRIDA',
    recepcao: 'RECEPÇÃO',
    retorno: 'RETORNO',
    defesa: 'DEFESA',
    kicker: 'CHUTE',
    punter: 'PUNT'
  }

  return labels[category] || 'ESTATÍSTICAS'
}

export const getCategoryTitle = (category: string): string => {
        switch (category) {
            case "passe": return "PASSE"
            case "corrida": return "CORRIDA"
            case "recepcao": return "RECEPÇÃO"
            case "retorno": return "RETORNO"
            case "defesa": return "DEFESA"
            case "chute": return "CHUTE"
            case "punt": return "PUNT"
            default: return ""
        }
    }

export const getStatsByCategory = (category: string): Array<{ key: StatKey; title: string }> => {
        switch (category) {
            case "passe":
                return [
                    { key: "jardas_de_passe", title: "JARDAS" },
                    { key: "passes_percentual", title: "PASSES(%)" },
                    { key: "td_passados", title: "TOUCHDOWNS" },
                    { key: "jardas_media", title: "JARDAS(AVG)" },
                    { key: "passes_completos", title: "PASSES COMP." },
                    { key: "passes_tentados", title: "PASSES TENT." },
                    { key: "interceptacoes_sofridas", title: "INTERCEPTAÇÕES" },
                    { key: "sacks_sofridos", title: "SACKS" },
                    { key: "fumble_de_passador", title: "FUMBLES " }
                ]
            case "corrida":
                return [
                    { key: "jardas_corridas", title: "JARDAS" },
                    { key: "corridas", title: "CORRIDAS" },
                    { key: "tds_corridos", title: "TOUCHDOWNS" },
                    { key: "jardas_corridas_media", title: "JARDAS(AVG)" },
                    { key: "fumble_de_corredor", title: "FUMBLES" }
                ]
            case "recepcao":
                return [
                    { key: "jardas_recebidas", title: "JARDAS" },
                    { key: "recepcoes", title: "RECEPÇÕES" },
                    { key: "tds_recebidos", title: "TOUCHDOWNS" },
                    { key: "jardas_recebidas_media", title: "JARDAS(AVG)" },
                    { key: "alvo", title: "ALVOS" },
                ]
            case "retorno":
                return [
                    { key: "jardas_retornadas_media", title: "JARDAS(AVG)" },
                    { key: "retornos", title: "RETORNOS" },
                    { key: "jardas_retornadas", title: "JARDAS" },
                    { key: "td_retornados", title: "TOUCHDOWNS" },
                ]
            case "defesa":
                return [
                    { key: "interceptacao_forcada", title: "INTERCEPTAÇÕES" },
                    { key: "sacks_forcado", title: "SACKS" },
                    { key: "fumble_forcado", title: "FUMBLES FORÇ." },
                    { key: "td_defensivo", title: "TOUCHDOWNS" },
                    { key: "passe_desviado", title: "PASSES DESV." },
                    { key: "tackles_for_loss", title: "TACKLES(LOSS)" },
                    { key: "tackles_totais", title: "TACKLES TOTAIS" },
                    { key: "safety", title: "SAFETIES" }
                ]
            case "chute":
                return [
                    { key: "field_goals", title: "FG(%)" },
                    { key: "fg_bons", title: "FG BOM" },
                    { key: "fg_mais_longo", title: "MAIS LONGO" },
                    { key: "tentativas_de_fg", title: "FG TENTADOS" },
                    { key: "extra_points", title: "XP(%)" },
                    { key: "xp_bons", title: "XP BOM" },
                    { key: "tentativas_de_xp", title: "XP TENTADOS" },
                ]
            case "punt":
                return [
                    { key: "jardas_punt_media", title: "JARDAS(AVG)" },
                    { key: "punts", title: "PUNTS" },
                    { key: "jardas_de_punt", title: "JARDAS" }
                ]
            default:
                return []
        }
    }

    export const getCategoryFromKey = (key: string): string => {
        const exactKeyMap: Record<string, string> = {
            'jardas_de_passe': 'passe',
            'passes_completos': 'passe',
            'passes_tentados': 'passe',
            'td_passados': 'passe',
            'interceptacoes_sofridas': 'passe',
            'sacks_sofridos': 'passe',
            'fumble_de_passador': 'passe',
    
            'jardas_corridas': 'corrida',
            'corridas': 'corrida',
            'tds_corridos': 'corrida',
            'fumble_de_corredor': 'corrida',
    
            'recepcoes': 'recepcao',
            'jardas_recebidas': 'recepcao',
            'tds_recebidos': 'recepcao',
            'alvo': 'recepcao',
    
            'jardas_retornadas': 'retorno',
            'retornos': 'retorno',
            'td_retornados': 'retorno',
    
            'passe_desviado': 'defesa',
            'tackles_totais': 'defesa',
            'tackles_for_loss': 'defesa',
            'sacks_forcado': 'defesa',
            'fumble_forcado': 'defesa',
            'interceptacao_forcada': 'defesa',
            'safety': 'defesa',
            'td_defensivo': 'defesa',
    
            'fg_bons': 'kicker',
            'tentativas_de_fg': 'kicker',
            'fg_mais_longo': 'kicker',
            'xp_bons': 'kicker',
            'tentativas_de_xp': 'kicker',
            'field_goals': 'kicker',
            'extra_points': 'kicker',
    
            'punts': 'punter',
            'jardas_de_punt': 'punter'
        }
    
        return exactKeyMap[key] || 'passe'
    }
    