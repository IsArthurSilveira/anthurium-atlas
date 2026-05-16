'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMestre } from '../../../../../components/MestreContext';

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

const planosIniciais: Plano[] = [
  { id: 'plano-material', nome: 'O Plano Material (A Âncora)', descricaoCurta: 'A dimensão da solidez, da carne e do tempo linear.', lore: 'É onde nós estamos.' },
  { id: 'eter', nome: 'O Éter (O Turbilhão)', descricaoCurta: 'Oceano infinito de luz, som e potencial criativo bruto.', lore: 'A fonte de onde a magia vem.' },
  { id: 'substrato', nome: 'O Substrato (O Silêncio)', descricaoCurta: 'A Anti-Existência que circunda a realidade.', lore: 'Se o Éter é "Tudo", o Substrato é "Nada".' },
  { id: 'profundeza', nome: 'A Profundeza (O Mistério Submerso)', descricaoCurta: 'O plano de transição velado sob as ondas.', lore: 'O quarto plano, velado sob as ondas.' }
];

const nacoesIniciais: Nacao[] = [
  { id: 'crystallinum', planoId: 'plano-material', nome: 'Crystallinum', lema: 'A Nitidez no Reflexo do Éter', climaEmocional: 'Frieza analítica e melancolia profunda.', cardeal: 'Naqua - A Senhora da Memória', etnias: 'Hyalin (Pele translúcida)', lore: 'Crystallinum é o centro do conhecimento histórico e medicinal de Anthurium...' },
  { id: 'andraeanum', planoId: 'plano-material', nome: 'Andraeanum', lema: 'Crescer, florescer, devorar', climaEmocional: 'Euforia biológica.', cardeal: 'Eos - A Dama Vivaz', etnias: 'Xylid (Simbiontes)', lore: 'Andraeanum é uma selva predatória onde a vida cresce com velocidade aterrorizante...' }
];

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

  const planoAtivo = planosIniciais.find(p => p.id === planoId) || planosIniciais[0];

  const [fNome, setFNome] = useState('');
  const [fDescricaoCurta, setFDescricaoCurta] = useState('');
  const [fLema, setFLema] = useState('');
  const [fClima, setFClima] = useState('');
  const [fCardeal, setFCardeal] = useState('');
  const [fEtnias, setFEtnias] = useState('');
  const [fLore, setFLore] = useState('');

  const criarNacao = () => {
    if (!fNome.trim()) {
      alert('Nome da nação é obrigatório');
      return;
    }

    const nacoes = JSON.parse(localStorage.getItem('anthurium_nacoes') || JSON.stringify(nacoesIniciais));
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

    const nacoesAtualizadas = [...nacoes, novaNacao];
    localStorage.setItem('anthurium_nacoes', JSON.stringify(nacoesAtualizadas));

    router.push(`/universo/atlas/${planoId}/nacao/${novaNacao.id}`);
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
        <p className="text-xs text-zinc-500">em {planoAtivo.nome}</p>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          criarNacao();
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
            className="px-6 py-3 bg-[#c5a059] text-black font-semibold rounded text-xs hover:bg-amber-600 transition-colors"
          >
            Forjar Nação
          </button>
        </div>
      </form>
    </div>
  );
}
