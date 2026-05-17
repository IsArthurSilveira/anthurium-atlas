'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Edit3, Trash2, X, Save, Plus } from 'lucide-react';
import { useMestre } from '../../components/MestreContext';
import { listPlanos, upsertPlano, deletePlano } from '../../../lib/api/mockAdapters';

interface Plano {
  id: string;
  nome: string;
  descricaoCurta: string;
  lore: string;
}

export default function CamadasPage() {
  const { modoMestre } = useMestre();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: 'error' | 'success' } | null>(null);
  const [abrirModalPlano, setAbrirModalPlano] = useState(false);
  const [form, setForm] = useState({
    id: '',
    nome: '',
    descricaoCurta: '',
    lore: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await listPlanos();
        setPlanos(data as Plano[]);
      } catch (err) {
        console.warn('Erro carregando planos do Supabase:', err);
        setPlanos([]);
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const resetForm = () => {
    setForm({ id: '', nome: '', descricaoCurta: '', lore: '' });
  };

  const abrirCriacaoPlano = () => {
    resetForm();
    setAbrirModalPlano(true);
  };

  const startEdit = (plano: Plano) => {
    setForm({
      id: plano.id,
      nome: plano.nome,
      descricaoCurta: plano.descricaoCurta || '',
      lore: plano.lore || '',
    });
    setAbrirModalPlano(true);
  };

  const handleSavePlano = async () => {
    if (!form.nome.trim()) {
      setToast({ message: 'Nome do plano é obrigatório.', type: 'error' });
      return;
    }

    setSalvando(true);
    try {
      const salvo = await upsertPlano({
        id: form.id,
        nome: form.nome.trim(),
        descricaoCurta: form.descricaoCurta.trim(),
        lore: form.lore.trim(),
      });

      setPlanos(prev => {
        const exists = prev.some(p => p.id === salvo.id);
        if (exists) {
          return prev.map(p => (p.id === salvo.id ? salvo : p));
        }
        return [...prev, salvo];
      });

      setToast({ message: form.id ? 'Plano atualizado com sucesso.' : 'Plano criado com sucesso.', type: 'success' });
      setAbrirModalPlano(false);
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar plano:', err);
      setToast({ message: 'Não foi possível salvar o plano no banco.', type: 'error' });
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletePlano = async (id: string) => {
    setExcluindoId(id);
    try {
      await deletePlano(id);
      setPlanos(prev => prev.filter(p => p.id !== id));
      setConfirmDeleteId(null);
      setToast({ message: 'Plano excluído com sucesso.', type: 'success' });
      if (form.id === id) resetForm();
    } catch (err) {
      console.error('Erro ao excluir plano:', err);
      setToast({ message: 'Não foi possível excluir o plano.', type: 'error' });
    } finally {
      setExcluindoId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 w-full flex-1 flex flex-col">
      <Link href="/universo" className="flex items-center gap-2 text-xs uppercase text-zinc-500 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar à Introdução
      </Link>
      
      <h2 className="text-xl uppercase tracking-wider text-zinc-400 mb-6">Mapeamento Dimensional</h2>

      {modoMestre && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={abrirCriacaoPlano}
            className="px-4 py-2 bg-[#c5a059] text-black text-xs font-semibold rounded hover:bg-amber-600 flex items-center gap-2"
          >
            <Plus className="w-3 h-3" /> Adicionar Plano
          </button>
        </div>
      )}

      {carregando ? (
        <div className="border border-dashed border-[#1b1c22] p-16 rounded text-center">
          <h3 className="text-sm text-zinc-400 mb-2">Carregando planos do banco...</h3>
        </div>
      ) : planos.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planos.map(plano => (
          <Link
            key={plano.id}
            href={`/universo/atlas/${plano.id}`}
            className="p-6 rounded-lg border border-[#1b1c22] bg-[#0e1014] hover:border-[#c5a059] text-left transition-all duration-300 group flex flex-col justify-between h-40 shadow-lg"
          >
            <div>
              <h3 className="text-sm tracking-wider uppercase font-medium text-white group-hover:text-[#c5a059]">{plano.nome}</h3>
              <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{plano.descricaoCurta}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-[10px] tracking-widest text-[#c5a059] uppercase font-medium flex items-center gap-1">
                Adentrar Plano <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
              {modoMestre && (
                <div className="flex items-center gap-1" onClick={e => e.preventDefault()}>
                  <button
                    type="button"
                    onClick={() => startEdit(plano)}
                    className="p-1 rounded border border-[#22242b] text-zinc-300 hover:text-white"
                    aria-label="Editar plano"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>

                  {confirmDeleteId === plano.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDeletePlano(plano.id)}
                        disabled={excluindoId === plano.id}
                        className="px-2 py-1 text-[10px] rounded bg-red-600 text-white disabled:opacity-50"
                      >
                        {excluindoId === plano.id ? '...' : 'Confirmar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="p-1 rounded border border-[#22242b] text-zinc-300 hover:text-white"
                        aria-label="Cancelar exclusão"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(plano.id)}
                      className="p-1 rounded border border-[#22242b] text-zinc-300 hover:text-red-300"
                      aria-label="Excluir plano"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      ) : (
        <div className="border border-dashed border-[#1b1c22] p-16 rounded text-center">
          <h3 className="text-sm text-zinc-400 mb-2">Nenhum plano cadastrado no banco</h3>
          <p className="text-xs text-zinc-600">Cadastre planos no Supabase para aparecerem aqui.</p>
        </div>
      )}

      {toast && (
        <div className={`fixed left-1/2 -translate-x-1/2 bottom-8 z-50 rounded-md px-4 py-2 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-400 text-black'}`}>
          {toast.message}
        </div>
      )}

      {modoMestre && abrirModalPlano && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setAbrirModalPlano(false)}>
          <div className="w-full max-w-2xl rounded-xl border border-[#22242b] bg-[#0a0b0d] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#c5a059]">{form.id ? 'Editar Plano' : 'Adicionar Plano'}</p>
              <button
                type="button"
                onClick={() => setAbrirModalPlano(false)}
                className="p-1 rounded border border-[#22242b] text-zinc-300 hover:text-white"
                aria-label="Fechar modal"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome do plano"
                className="w-full bg-[#111216] border border-[#22242b] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              />
              <input
                type="text"
                value={form.descricaoCurta}
                onChange={e => setForm(prev => ({ ...prev, descricaoCurta: e.target.value }))}
                placeholder="Descrição curta"
                className="w-full bg-[#111216] border border-[#22242b] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <textarea
              rows={4}
              value={form.lore}
              onChange={e => setForm(prev => ({ ...prev, lore: e.target.value }))}
              placeholder="Lore do plano"
              className="w-full bg-[#111216] border border-[#22242b] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c5a059] resize-none"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setAbrirModalPlano(false)}
                className="px-4 py-2 border border-[#22242b] rounded text-xs text-zinc-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePlano}
                disabled={salvando}
                className="px-4 py-2 bg-[#c5a059] text-black text-xs font-semibold rounded hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-3 h-3" /> {salvando ? 'Salvando...' : form.id ? 'Atualizar Plano' : 'Criar Plano'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
