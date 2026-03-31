export interface Senha {
  id?: string;
  numero: string; // YYMMDD-PPSQ
  tipo: 'SP' | 'SG' | 'SE';
  dataEmissao: string;
  dataAtendimento?: string;
  guiche?: string;
  atendida: boolean;
  tempoAtendimento?: number; // minutos
}

export interface Guiche {
  id: number;
  nome: string;
  ocupado: boolean;
  senhaAtual?: Senha;
  tempoFim?: number; // timestamp
}