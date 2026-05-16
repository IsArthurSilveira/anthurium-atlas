'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useMestre } from '../../components/MestreContext';

interface Plano {
  id: string;
  nome: string;
  descricaoCurta: string;
  lore: string;
}

const planosIniciais: Plano[] = [
  { id: 'plano-material', nome: 'O Plano Material (A Âncora)', descricaoCurta: 'A dimensão da solidez, da carne e do tempo linear.', lore: 'É onde nós estamos. Sua função primordial não é apenas abrigar a vida, mas servir como um escudo — uma "pele" da realidade — que nos protege da entropia absoluta.' },
  { id: 'eter', nome: 'O Éter (O Turbilhão)', descricaoCurta: 'Oceano infinito de luz, som e potencial criativo bruto.', lore: 'A fonte de onde a magia vem. O Éter é maleável e reativo; ele não obedece à física, obedece ao sentimento.' },
  { id: 'substrato', nome: 'O Substrato (O Silêncio)', descricaoCurta: 'A Anti-Existência que circunda a realidade.', lore: 'Se o Éter é "Tudo", o Substrato é "Nada". É a Anti-Existência que circunda a realidade. Não há luz, não há tempo.' },
  { id: 'profundeza', nome: 'A Profundeza (O Mistério Submerso)', descricaoCurta: 'O plano de transição velado sob as ondas.', lore: 'O quarto plano, velado sob as ondas. O oceano de Anthurium não é apenas água; é uma barreira de pressão dimensional.' }
];

export default function CamadasPage() {
  const { modoMestre } = useMestre();

  return (
    <div className="max-w-5xl mx-auto p-8 w-full flex-1 flex flex-col justify-center">
      <Link href="/universo" className="flex items-center gap-2 text-xs uppercase text-zinc-500 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar à Introdução
      </Link>
      
      <h2 className="text-xl uppercase tracking-wider text-zinc-400 mb-6">Mapeamento Dimensional</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planosIniciais.map(plano => (
          <Link
            key={plano.id}
            href={`/universo/atlas/${plano.id}`}
            className="p-6 rounded-lg border border-[#1b1c22] bg-[#0e1014] hover:border-[#c5a059] text-left transition-all duration-300 group flex flex-col justify-between h-40 shadow-lg"
          >
            <div>
              <h3 className="text-sm tracking-wider uppercase font-medium text-white group-hover:text-[#c5a059]">{plano.nome}</h3>
              <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{plano.descricaoCurta}</p>
            </div>
            <div className="text-[10px] tracking-widest text-[#c5a059] uppercase font-medium flex items-center gap-1 mt-4">
              Adentrar Plano <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
