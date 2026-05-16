'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, ShieldAlert, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMestre } from '../../../components/MestreContext';

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

function resumirNacao(nacao: Nacao) {
  const fonte = nacao.descricaoCurta || nacao.lore;
  const texto = fonte.replace(/\s+/g, ' ').trim();

  if (texto.length <= 120) {
    return texto;
  }

  return `${texto.slice(0, 117).replace(/\s+\S*$/, '')}...`;
}

export default function AtlasPage() {
  const { modoMestre } = useMestre();
  const params = useParams();
  const planoId = params.planoId as string;

  const planoAtivo = planosIniciais.find(p => p.id === planoId) || planosIniciais[0];
  const [nacoes, setNacoes] = useState<Nacao[]>(nacoesIniciais);
  const [nacaoSelecionada, setNacaoSelecionada] = useState<Nacao | null>(null);

  useEffect(() => {
    const localNacoes = localStorage.getItem('anthurium_nacoes');
    if (localNacoes) setNacoes(JSON.parse(localNacoes));
  }, []);

  const nacoesDoPlano = nacoes.filter(n => n.planoId === planoId);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full">
      {/* Grid Principal */}
      <div className="flex-1 max-w-5xl mx-auto p-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/universo/camadas"
              className="flex items-center gap-2 text-xs uppercase text-zinc-500 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar às Camadas
            </Link>
            <h2 className="text-2xl font-light text-white tracking-wide">{planoAtivo.nome}</h2>
            <p className="text-xs text-zinc-500 mt-2 max-w-md">{planoAtivo.descricaoCurta}</p>
          </div>

          {modoMestre && (
            <Link
              href={`/universo/atlas/${planoId}/novo`}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#c5a059] text-black text-xs uppercase font-semibold rounded hover:bg-amber-600 transition-all"
            >
              <Plus className="w-4 h-4" /> Novo Ponto
            </Link>
          )}
        </div>

        {nacoesDoPlano.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {nacoesDoPlano.map(nacao => (
              <button
                key={nacao.id}
                onClick={() => setNacaoSelecionada(nacao)}
                className="p-6 rounded-lg border border-[#1b1c22] bg-[#0e1014] hover:border-[#c5a059] text-left transition-all duration-300 group flex flex-col justify-between h-40"
              >
                <div>
                  <h3 className="text-sm tracking-wider uppercase font-medium text-white group-hover:text-[#c5a059]">
                    {nacao.nome}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2 italic line-clamp-2">"{nacao.lema}"</p>
                </div>
                <div className="text-[10px] tracking-widest text-[#c5a059] uppercase font-medium flex items-center gap-1 mt-4">
                  Selecionar →
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[#1b1c22] p-16 rounded text-center">
            <h3 className="text-sm text-zinc-400 mb-2">Nenhum ponto registrado neste plano</h3>
            <p className="text-xs text-zinc-600">
              {modoMestre ? 'Clique em "Novo Ponto" para começar a forjar.' : 'Volte mais tarde.'}
            </p>
          </div>
        )}

        <div className="p-4 bg-[#0d0e12] border border-[#1b1c22] rounded flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-500/70 shrink-0 mt-1" />
          <div>
            <h4 className="text-xs font-medium text-zinc-400">Frequência Cartográfica</h4>
            <p className="text-xs text-zinc-600 mt-1">Eco dimensional de {planoAtivo.nome}.</p>
          </div>
        </div>
      </div>

      {/* Card Lateral (Preview de Nação) */}
      {nacaoSelecionada && (
        <div className="w-full lg:w-96 bg-[#0a0b0d] border-t lg:border-t-0 lg:border-l border-[#1b1c22] p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-light text-white">{nacaoSelecionada.nome}</h3>
            <button
              onClick={() => setNacaoSelecionada(null)}
              className="text-zinc-500 hover:text-white text-xl w-6 h-6 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-4 mb-6">
            <div>
              <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-1">Lema</span>
              <p className="text-xs text-zinc-300 italic">"{nacaoSelecionada.lema}"</p>
            </div>

            <div className="border-t border-[#1b1c22] pt-4">
              <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-1">Descrição Breve</span>
              <p className="text-xs text-zinc-300 leading-relaxed">{resumirNacao(nacaoSelecionada)}</p>
            </div>

            <div className="border-t border-[#1b1c22] pt-4">
              <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-1">Clima Emocional</span>
              <p className="text-xs text-zinc-300">{nacaoSelecionada.climaEmocional}</p>
            </div>

            <div className="border-t border-[#1b1c22] pt-4">
              <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-1">Cardeal</span>
              <p className="text-xs text-zinc-300">{nacaoSelecionada.cardeal}</p>
            </div>
          </div>

          <Link
            href={`/universo/atlas/${planoId}/nacao/${nacaoSelecionada.id}`}
            className="w-full py-3 bg-[#c5a059] text-black font-semibold rounded text-xs flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Explorar Lore Completa
          </Link>
        </div>
      )}
    </div>
  );
}
