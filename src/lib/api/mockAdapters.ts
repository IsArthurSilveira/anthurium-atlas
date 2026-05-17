import { supabase } from '../supabaseClient';
import { Plano, Nacao, Lugar, Etnia, Npc } from './types';

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

// Planos
export async function listPlanos(): Promise<Plano[]> {
  const { data, error } = await supabase
    .from('planos')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.warn('Erro ao listar planos:', error);
    return [];
  }

  return (data || []).map(p => ({
    id: p.id,
    nome: p.nome,
    descricaoCurta: p.descricao_curta || '',
    lore: p.lore || '',
  }));
}

export async function getPlano(id: string): Promise<Plano | undefined> {
  const { data, error } = await supabase
    .from('planos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.warn('Erro ao buscar plano:', error);
    return undefined;
  }

  if (!data) return undefined;

  return {
    id: data.id,
    nome: data.nome,
    descricaoCurta: data.descricao_curta || '',
    lore: data.lore || '',
  };
}

export async function upsertPlano(plano: Plano): Promise<Plano> {
  const resolvedId = isUuid(plano.id) ? plano.id : crypto.randomUUID();

  const payload = {
    id: resolvedId,
    nome: plano.nome,
    descricao_curta: plano.descricaoCurta || null,
    lore: plano.lore || null,
  };

  const { data, error } = await supabase
    .from('planos')
    .upsert([payload], { onConflict: 'id' })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Erro ao salvar plano: ${error.message}`);
  }

  return {
    id: data.id,
    nome: data.nome,
    descricaoCurta: data.descricao_curta || '',
    lore: data.lore || '',
  };
}

export async function deletePlano(id: string): Promise<void> {
  const { error } = await supabase
    .from('planos')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Erro ao excluir plano: ${error.message}`);
  }
}

export async function deleteNacao(id: string): Promise<void> {
  const { error } = await supabase
    .from('nacoes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Erro ao excluir nação: ${error.message}`);
  }
}

// Nação
export async function listNacoes(): Promise<Nacao[]> {
  const { data, error } = await supabase
    .from('nacoes')
    .select('*');
  
  if (error) {
    console.warn('Erro ao listar nações:', error);
    return [];
  }
  
  return (data || []).map(n => ({
    id: n.id,
    planoId: n.plano_id,
    nome: n.nome,
    descricaoCurta: n.descricao_curta,
    lema: n.lema,
    climaEmocional: n.clima_emocional,
    cardeal: n.cardeal,
    etnias: n.etnias,
    lore: n.lore,
  }));
}

export async function getNacao(id: string): Promise<Nacao | undefined> {
  const { data, error } = await supabase
    .from('nacoes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.warn('Erro ao buscar nação:', error);
    return undefined;
  }
  
  if (!data) return undefined;
  
  return {
    id: data.id,
    planoId: data.plano_id,
    nome: data.nome,
    descricaoCurta: data.descricao_curta,
    lema: data.lema,
    climaEmocional: data.clima_emocional,
    cardeal: data.cardeal,
    etnias: data.etnias,
    lore: data.lore,
  };
}

export async function upsertNacao(nacao: Nacao): Promise<Nacao> {
  if (!isUuid(nacao.planoId)) {
    throw new Error(`plano_id invalido para Supabase: ${nacao.planoId}`);
  }

  const resolvedNacaoId = isUuid(nacao.id) ? nacao.id : crypto.randomUUID();

  const payload = {
    id: resolvedNacaoId,
    plano_id: nacao.planoId,
    nome: nacao.nome,
    descricao_curta: nacao.descricaoCurta,
    lema: nacao.lema,
    clima_emocional: nacao.climaEmocional,
    cardeal: nacao.cardeal,
    etnias: nacao.etnias,
    lore: nacao.lore,
  };
  
  const { data, error } = await supabase
    .from('nacoes')
    .upsert([payload], { onConflict: 'id' })
    .select('*')
    .single();
  
  if (error) {
    throw new Error(`Erro ao upsert nação: ${error.message}`);
  }

  return {
    id: data.id,
    planoId: data.plano_id,
    nome: data.nome,
    descricaoCurta: data.descricao_curta,
    lema: data.lema,
    climaEmocional: data.clima_emocional,
    cardeal: data.cardeal,
    etnias: data.etnias,
    lore: data.lore,
  };
}

// Lugares
export async function listLugares(nacaoId: string): Promise<Lugar[]> {
  const { data, error } = await supabase
    .from('lugares')
    .select('*')
    .eq('nacao_id', nacaoId);
  
  if (error) {
    console.warn('Erro ao listar lugares:', error);
    return [];
  }
  
  return (data || []).map(l => ({
    id: l.id,
    nome: l.nome,
    descricaoBreve: l.descricao_breve,
    descricaoCompleta: l.descricao_completa,
    imagens: l.imagens || [],
  }));
}

export async function addLugar(nacaoId: string, lugar: Omit<Lugar, 'id'>): Promise<Lugar> {
  const novoId = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('lugares')
    .insert([{
      id: novoId,
      nacao_id: nacaoId,
      nome: lugar.nome,
      descricao_breve: lugar.descricaoBreve,
      descricao_completa: lugar.descricaoCompleta,
      imagens: lugar.imagens || [],
    }])
    .select()
    .single();
  
  if (error) {
    console.warn('Erro ao adicionar lugar:', error);
    return { id: novoId, ...lugar };
  }
  
  return {
    id: data.id,
    nome: data.nome,
    descricaoBreve: data.descricao_breve,
    descricaoCompleta: data.descricao_completa,
    imagens: data.imagens || [],
  };
}

export async function updateLugar(nacaoId: string, lugar: Lugar): Promise<Lugar> {
  const { data, error } = await supabase
    .from('lugares')
    .update({
      nome: lugar.nome,
      descricao_breve: lugar.descricaoBreve,
      descricao_completa: lugar.descricaoCompleta,
      imagens: lugar.imagens || [],
    })
    .eq('id', lugar.id)
    .eq('nacao_id', nacaoId)
    .select()
    .single();
  
  if (error) {
    console.warn('Erro ao atualizar lugar:', error);
    return lugar;
  }
  
  return {
    id: data.id,
    nome: data.nome,
    descricaoBreve: data.descricao_breve,
    descricaoCompleta: data.descricao_completa,
    imagens: data.imagens || [],
  };
}

export async function deleteLugar(nacaoId: string, lugarId: string): Promise<void> {
  const { error } = await supabase
    .from('lugares')
    .delete()
    .eq('id', lugarId)
    .eq('nacao_id', nacaoId);

  if (error) {
    throw new Error(`Erro ao excluir lugar: ${error.message}`);
  }
}

// Etnias
export async function listEtnias(nacaoId: string): Promise<Etnia[]> {
  const { data, error } = await supabase
    .from('etnias')
    .select('*')
    .eq('nacao_id', nacaoId);
  
  if (error) {
    console.warn('Erro ao listar etnias:', error);
    return [];
  }
  
  return (data || []).map(e => ({
    id: e.id,
    nome: e.nome,
    descricao: e.descricao,
    afinidades: e.afinidades || [],
    imagens: e.imagens || [],
  }));
}

export async function addEtnia(nacaoId: string, etnia: Omit<Etnia, 'id'>): Promise<Etnia> {
  const novoId = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('etnias')
    .insert([{
      id: novoId,
      nacao_id: nacaoId,
      nome: etnia.nome,
      descricao: etnia.descricao,
      afinidades: etnia.afinidades || [],
      imagens: etnia.imagens || [],
    }])
    .select()
    .single();
  
  if (error) {
    console.warn('Erro ao adicionar etnia:', error);
    return { id: novoId, ...etnia };
  }
  
  return {
    id: data.id,
    nome: data.nome,
    descricao: data.descricao,
    afinidades: data.afinidades || [],
    imagens: data.imagens || [],
  };
}

export async function updateEtnia(nacaoId: string, etnia: Etnia): Promise<Etnia> {
  const { data, error } = await supabase
    .from('etnias')
    .update({
      nome: etnia.nome,
      descricao: etnia.descricao,
      afinidades: etnia.afinidades || [],
      imagens: etnia.imagens || [],
    })
    .eq('id', etnia.id)
    .eq('nacao_id', nacaoId)
    .select()
    .single();
  
  if (error) {
    console.warn('Erro ao atualizar etnia:', error);
    return etnia;
  }
  
  return {
    id: data.id,
    nome: data.nome,
    descricao: data.descricao,
    afinidades: data.afinidades || [],
    imagens: data.imagens || [],
  };
}

export async function deleteEtnia(nacaoId: string, etniaId: string): Promise<void> {
  const { error } = await supabase
    .from('etnias')
    .delete()
    .eq('id', etniaId)
    .eq('nacao_id', nacaoId);

  if (error) {
    throw new Error(`Erro ao excluir etnia: ${error.message}`);
  }
}

// NPCs
export async function listNpcs(nacaoId: string): Promise<Npc[]> {
  const { data, error } = await supabase
    .from('npcs')
    .select('*')
    .eq('nacao_id', nacaoId);
  
  if (error) {
    console.warn('Erro ao listar NPCs:', error);
    return [];
  }
  
  return (data || []).map(npc => ({
    id: npc.id,
    nome: npc.nome,
    funcao: npc.funcao,
  }));
}

export async function addNpc(nacaoId: string, npc: Omit<Npc, 'id'>): Promise<Npc> {
  const novoId = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('npcs')
    .insert([{
      id: novoId,
      nacao_id: nacaoId,
      nome: npc.nome,
      funcao: npc.funcao || '',
    }])
    .select()
    .single();
  
  if (error) {
    console.warn('Erro ao adicionar NPC:', error);
    return { id: novoId, ...npc };
  }
  
  return {
    id: data.id,
    nome: data.nome,
    funcao: data.funcao || '',
  };
}

export async function deleteNpc(nacaoId: string, npcId: string): Promise<void> {
  const { error } = await supabase
    .from('npcs')
    .delete()
    .eq('id', npcId)
    .eq('nacao_id', nacaoId);

  if (error) {
    throw new Error(`Erro ao excluir NPC: ${error.message}`);
  }
}

// Helpers para seed (opcional)
export async function seedIfEmpty(seed: Partial<{ nacoes?: Nacao[] }>): Promise<void> {
  const nacoes = await listNacoes();
  if (nacoes.length === 0 && seed.nacoes) {
    for (const nacao of seed.nacoes) {
      await upsertNacao(nacao);
    }
  }
}
