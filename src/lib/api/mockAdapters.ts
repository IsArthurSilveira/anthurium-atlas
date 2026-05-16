import { Nacao, Lugar, Etnia, Npc } from './types';

const STORAGE_KEY = 'anthurium_mock_data_v1';

type Store = {
  nacoes: Nacao[];
  lugares: Record<string, Lugar[]>; // key: nacaoId
  etnias: Record<string, Etnia[]>; // key: nacaoId
  npcs: Record<string, Npc[]>; // key: nacaoId
};

const defaultStore: Store = {
  nacoes: [],
  lugares: {},
  etnias: {},
  npcs: {},
};

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore;
    return JSON.parse(raw) as Store;
  } catch (e) {
    console.warn('mockAdapters: erro ao ler store', e);
    return defaultStore;
  }
}

function writeStore(s: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn('mockAdapters: erro ao gravar store', e);
  }
}

// Nação
export function listNacoes(): Nacao[] {
  return readStore().nacoes;
}

export function getNacao(id: string): Nacao | undefined {
  return readStore().nacoes.find(n => n.id === id);
}

export function upsertNacao(nacao: Nacao) {
  const s = readStore();
  const idx = s.nacoes.findIndex(n => n.id === nacao.id);
  if (idx >= 0) s.nacoes[idx] = nacao;
  else s.nacoes.push(nacao);
  writeStore(s);
}

// Lugares
export function listLugares(nacaoId: string): Lugar[] {
  const s = readStore();
  return s.lugares[nacaoId] || [];
}

export function addLugar(nacaoId: string, lugar: Omit<Lugar, 'id'>) {
  const s = readStore();
  const novo: Lugar = { id: `l_${Date.now()}`, ...lugar } as Lugar;
  s.lugares[nacaoId] = s.lugares[nacaoId] || [];
  s.lugares[nacaoId].push(novo);
  writeStore(s);
  return novo;
}

export function updateLugar(nacaoId: string, lugar: Lugar) {
  const s = readStore();
  s.lugares[nacaoId] = s.lugares[nacaoId] || [];
  s.lugares[nacaoId] = s.lugares[nacaoId].map(l => l.id === lugar.id ? lugar : l);
  writeStore(s);
}

// Etnias
export function listEtnias(nacaoId: string): Etnia[] {
  const s = readStore();
  return s.etnias[nacaoId] || [];
}

export function addEtnia(nacaoId: string, etnia: Omit<Etnia, 'id'>) {
  const s = readStore();
  const novo: Etnia = { id: `e_${Date.now()}`, ...etnia } as Etnia;
  s.etnias[nacaoId] = s.etnias[nacaoId] || [];
  s.etnias[nacaoId].push(novo);
  writeStore(s);
  return novo;
}

// NPCs
export function listNpcs(nacaoId: string): Npc[] {
  const s = readStore();
  return s.npcs[nacaoId] || [];
}

export function addNpc(nacaoId: string, npc: Omit<Npc, 'id'>) {
  const s = readStore();
  const novo: Npc = { id: `npc_${Date.now()}`, ...npc } as Npc;
  s.npcs[nacaoId] = s.npcs[nacaoId] || [];
  s.npcs[nacaoId].push(novo);
  writeStore(s);
  return novo;
}

// Helpers para seed (opcional)
export function seedIfEmpty(seed: Partial<Store>) {
  const s = readStore();
  const merged: Store = {
    nacoes: s.nacoes.length ? s.nacoes : (seed.nacoes as Nacao[]) || [],
    lugares: Object.keys(s.lugares).length ? s.lugares : seed.lugares || {},
    etnias: Object.keys(s.etnias).length ? s.etnias : seed.etnias || {},
    npcs: Object.keys(s.npcs).length ? s.npcs : seed.npcs || {},
  };
  writeStore(merged);
}
