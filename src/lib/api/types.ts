export interface Plano {
  id: string;
  nome: string;
  descricaoCurta?: string;
  lore?: string;
}

export interface Nacao {
  id: string;
  planoId: string;
  nome: string;
  descricaoCurta?: string;
  lema?: string;
  climaEmocional?: string;
  cardeal?: string;
  etnias?: string;
  lore?: string;
}

export interface Lugar {
  id: string;
  nome: string;
  descricaoBreve?: string;
  descricaoCompleta?: string;
  imagens?: string[];
}

export interface Etnia {
  id: string;
  nome: string;
  descricao?: string;
  afinidades?: string[];
}

export interface Npc {
  id: string;
  nome: string;
  funcao?: string;
}

export interface Teologia {
  nome: string;
  descricao?: string;
  praticas?: string;
}
