'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMestre } from '../../../../components/MestreContext';
import { upsertNacao, listPlanos } from '../../../../../lib/api/mockAdapters';

interface Plano {
  id: string;
  nome: string;
  descricaoCurta: string;
  lore: string;
}

interface Nacao {
  id: string;
  planoId: string;
  nome: string;
  descricaoCurta?: string;
  lema: string;
  climaEmocional: string;
  cardeal: string;
  etnias: string;
  lore: string;
}

export default function NovoNacaoPage() {
  const { modoMestre } = useMestre();
  const params = useParams();
  const router = useRouter();
  const planoId = params.planoId as string;

  if (!modoMestre) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Modo Mestre desativado</p>
          <Link href={`/universo/atlas/${planoId}`} className="text-[#c5a059] text-xs uppercase">
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  const [planos, setPlanos] = useState<Plano[]>([]);
  const [carregandoPlanos, setCarregandoPlanos] = useState(true);
  const planoAtivo = planos.find(p => p.id === planoId);

  const [fNome, setFNome] = useState('');
  const [fDescricaoCurta, setFDescricaoCurta] = useState('');
  const [fLema, setFLema] = useState('');
  const [fClima, setFClima] = useState('');
  const [fCardeal, setFCardeal] = useState('');
  const [fEtnias, setFEtnias] = useState('');
  const [fLore, setFLore] = useState('');
  const [toast, setToast] = useState<{ message: string; type?: 'error' | 'success' } | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await listPlanos();
        setPlanos(data as Plano[]);
      } catch (err) {
        console.warn('Erro carregando planos do Supabase:', err);
        setPlanos([]);
      } finally {
        setCarregandoPlanos(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const criarNacao = async () => {
    if (!fNome.trim()) {
      setToast({ message: 'Nome da nação é obrigatório.', type: 'error' });
      return;
    }

    const novaNacao: Nacao = {
      id: fNome.toLowerCase().replace(/\s+/g, '-'),
      planoId,
      nome: fNome,
      descricaoCurta: fDescricaoCurta,
      lema: fLema,
      climaEmocional: fClima,
      cardeal: fCardeal,
      etnias: fEtnias,
      lore: fLore
    };

    try {
      const criada = await upsertNacao(novaNacao);
      localStorage.removeItem('anthurium_nacoes');
      setToast({ message: 'Nação criada com sucesso.', type: 'success' });
      router.push(`/universo/atlas/${planoId}/nacao/${criada.id}`);
    } catch (err) {
      console.error('Falha ao persistir nação no Supabase:', err);
      setToast({ message: 'Nao foi possivel salvar no banco. Verifique policies/RLS e UUID.', type: 'error' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 flex-1 flex flex-col justify-center w-full">
      <Link
        href={`/universo/atlas/${planoId}`}
        className="flex items-center gap-2 text-xs uppercase text-zinc-500 hover:text-white mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="mb-8">
        <h2 className="text-2xl font-light text-white tracking-wide mb-2">Forjar Novo Ponto</h2>
        <p className="text-xs text-zinc-500">em {planoAtivo?.nome || 'Plano'}</p>
      </div>

      {!carregandoPlanos && !planoAtivo && (
        <div className="mb-6 rounded border border-[#3b2020] bg-[#2a1111] p-3 text-xs text-red-300">
          Plano não encontrado no banco. Cadastre o plano no Supabase antes de criar nações nele.
        </div>
      )}

      <form
        onSubmit={async e => {
          e.preventDefault();
          await criarNacao();
        }}
        className="space-y-6 bg-[#0a0b0d] border border-[#c5a059]/20 p-8 rounded-lg"
      >
        <div>
          <label className="block text-xs uppercase text-zinc-400 mb-2">Nome da Nação</label>
          <input
            type="text"
            value={fNome}
            onChange={e => setFNome(e.target.value)}
            className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]"
            placeholder="Crystallinum"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase text-zinc-400 mb-2">Descrição Breve</label>
          <textarea
            value={fDescricaoCurta}
            onChange={e => setFDescricaoCurta(e.target.value)}
            rows={3}
            className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059] resize-none"
            placeholder="Resumo curto para o card lateral e cabeçalho"
          />
        </div>

        <div>
          <label className="block text-xs uppercase text-zinc-400 mb-2">Lema</label>
          <input
            type="text"
            value={fLema}
            onChange={e => setFLema(e.target.value)}
            className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]"
            placeholder="A Nitidez no Reflexo do Éter"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase text-zinc-400 mb-2">Clima Emocional</label>
            <input
              type="text"
              value={fClima}
              onChange={e => setFClima(e.target.value)}
              className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              placeholder="Frieza analítica"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-zinc-400 mb-2">Cardeal/Divindade</label>
            <input
              type="text"
              value={fCardeal}
              onChange={e => setFCardeal(e.target.value)}
              className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              placeholder="Naqua - A Senhora"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase text-zinc-400 mb-2">Etnias</label>
          <input
            type="text"
            value={fEtnias}
            onChange={e => setFEtnias(e.target.value)}
            className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]"
            placeholder="Hyalin, Xylid, etc"
          />
        </div>

        <div>
          <label className="block text-xs uppercase text-zinc-400 mb-2">Lore Completo</label>
          <textarea
            value={fLore}
            onChange={e => setFLore(e.target.value)}
            rows={8}
            className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059] resize-none"
            placeholder="Descreva a história, cultura e significado desta nação no universo..."
          />
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Link
            href={`/universo/atlas/${planoId}`}
            className="px-6 py-3 border border-[#22242b] rounded text-xs text-zinc-400 hover:text-white"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={carregandoPlanos || !planoAtivo}
            className="px-6 py-3 bg-[#c5a059] text-black font-semibold rounded text-xs hover:bg-amber-600 transition-colors"
          >
            Forjar Nação
          </button>
        </div>
      </form>
      {toast && (
        <div className={`fixed left-1/2 -translate-x-1/2 bottom-8 z-50 rounded-md px-4 py-2 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-400 text-black'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
