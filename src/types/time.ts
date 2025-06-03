import { Jogador } from "./jogador"

type Titulos = {
  nacionais?: string
  conferencias?: string
  estaduais?: string
}

export type Time = {
  id?: number
  nome?: string
  temporada?: string
  sigla?: string
  cor?: string
  cidade?: string
  bandeira_estado?: string
  fundacao?: string
  logo?: string
  capacete?: string
  instagram?: string
  instagram2?: string
  estadio?: string
  presidente?: string
  head_coach?: string
  instagram_coach?: string
  coord_ofen?: string
  coord_defen?: string
  titulos?: Titulos[]
  jogadores?: Jogador[]
}

export interface Transferencia {
  id: number;
  jogadorNome: string;
  timeOrigemId?: number;
  timeOrigemNome?: string;
  timeOrigemSigla?: string;
  timeDestinoId: number;
  timeDestinoNome?: string;
  timeDestinoSigla?: string;
  novaPosicao?: string | null;
  novoSetor?: string | null;
  novoNumero?: number | null;
  novaCamisa?: string | null;
  data: string;
}

export interface TimeMercadoCardProps {
  timeNome: string;
  jogadoresEntrando: Transferencia[];
  jogadoresSaindo: Transferencia[];
}