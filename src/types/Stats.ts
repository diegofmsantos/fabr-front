import { Jogador } from "./jogador";

export type StatKey =
  | keyof Jogador['estatisticas']['passe']
  | keyof Jogador['estatisticas']['corrida']
  | keyof Jogador['estatisticas']['recepcao']
  | keyof Jogador['estatisticas']['retorno']
  | keyof Jogador['estatisticas']['defesa']
  | keyof Jogador['estatisticas']['kicker']
  | keyof Jogador['estatisticas']['punter']
  | 'passes_percentual'
  | 'jardas_media'
  | 'jardas_corridas_media'
  | 'jardas_recebidas_media'
  | 'jardas_retornadas_media'
  | 'extra_points'
  | 'field_goals'
  | 'jardas_punt_media';

export interface StatsBase {
  passe: PasseStats
  corrida: CorridaStats
  recepcao: RecepcaoStats
  retorno: RetornoStats
  defesa: DefesaStats
  kicker: KickerStats
  punter: PunterStats
}

export interface PasseStats {
  passes_completos: number
  passes_tentados: number
  jardas_de_passe: number
  td_passados: number
  interceptacoes_sofridas: number
  sacks_sofridos: number
  fumble_de_passador: number
}

export interface CorridaStats {
  corridas: number
  jardas_corridas: number
  tds_corridos: number
  fumble_de_corredor: number
}

export interface RecepcaoStats {
  recepcoes: number
  alvo: number
  jardas_recebidas: number
  tds_recebidos: number
}

export interface RetornoStats {
  retornos: number
  jardas_retornadas: number
  td_retornados: number
}

export interface DefesaStats {
  tackles_totais: number
  tackles_for_loss: number
  sacks_forcado: number
  fumble_forcado: number
  interceptacao_forcada: number
  passe_desviado: number
  safety: number
  td_defensivo: number
}

export interface KickerStats {
  xp_bons: number
  tentativas_de_xp: number
  fg_bons: number
  tentativas_de_fg: number
  fg_mais_longo: number
}

export interface PunterStats {
  punts: number
  jardas_de_punt: number
}

export interface StatGroup {
  title: string
  groupLabel: string
  stats: Array<{
    title: string
    urlParam: string
  }>
}

export interface CalculatedStats {
  jardas_media: number | null
  jardas_corridas_media: number | null
  jardas_recebidas_media: number | null
  jardas_retornadas_media: number | null
  jardas_punt_media: number | null

  passes_percentual: number | null
  field_goals: string | null
  extra_points: string | null

}

export type StatType = 'PASSE' | 'CORRIDA' | 'RECEPÇÃO' | 'RETORNO' | 'DEFESA' | 'CHUTE' | 'PUNT'

export interface TeamStats {
  timeId: number
  passe: {
      jardas_de_passe: number
      passes_completos: number
      passes_tentados: number
      td_passados: number
      interceptacoes_sofridas: number
      sacks_sofridos: number
      fumble_de_passador: number
  }
  corrida: {
      jardas_corridas: number
      corridas: number
      tds_corridos: number
      fumble_de_corredor: number
  }
  recepcao: {
      jardas_recebidas: number
      recepcoes: number
      tds_recebidos: number
      alvo: number
  }
  retorno: {
      jardas_retornadas: number
      retornos: number
      td_retornados: number
  }
  defesa: {
      tackles_totais: number
      tackles_for_loss: number
      sacks_forcado: number
      fumble_forcado: number
      interceptacao_forcada: number
      passe_desviado: number
      safety: number
      td_defensivo: number
  }
  kicker: {
      xp_bons: number
      tentativas_de_xp: number
      fg_bons: number
      tentativas_de_fg: number
      fg_mais_longo: number
  }
  punter: {
      punts: number
      jardas_de_punt: number
  }
}