'use client';

import React, { useState, useEffect } from 'react';
import { Edit3, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMestre } from '../components/MestreContext';

const introducaoInicial = {
  titulo: "Anthurium: A Cicatriz Aberta",
  texto: `Anthurium não é um conto de fadas; é uma cicatriz aberta. É um universo de fantasia sombria que respira através de aparelhos, tentando se lembrar de como funciona após o cataclismo conhecido como O Estrondo. Aqui, a sobrevivência não é garantida pela força da espada, mas pela estabilidade da mente. 

  O mundo é melancólico, vasto e perigosamente silencioso. As Nações-Estado não são apenas países; são botes salva-vidas culturais, isolados por um oceano que se tornou hostil e imprevisível. O inimigo não é um lorde das trevas em uma torre, mas a Corrupção (o esquecimento) que vaza do Substrato através de falhas na realidade.`
};

export default function UniversoIntroPage() {
  const { modoMestre } = useMestre();
  const [editando, setEditando] = useState(false);
  const [intro, setIntro] = useState(introducaoInicial);
  const [fNome, setFNome] = useState('');
  const [fLore, setFLore] = useState('');

  useEffect(() => {
    const localIntro = localStorage.getItem('anthurium_intro');
    if (localIntro) setIntro(JSON.parse(localIntro));
  }, []);

  const salvarIntro = () => {
    const novaIntro = { titulo: fNome, texto: fLore };
    setIntro(novaIntro);
    localStorage.setItem('anthurium_intro', JSON.stringify(novaIntro));
    setEditando(false);
  };

  const ativarEdicao = () => {
    setFNome(intro.titulo);
    setFLore(intro.texto);
    setEditando(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 flex-1 flex flex-col justify-center items-center">
      {!editando ? (
        <div className="bg-[#0a0b0d] border border-[#1b1c22] p-8 md:p-12 rounded-lg relative w-full shadow-2xl">
          {modoMestre && (
            <button
              onClick={ativarEdicao}
              className="absolute top-6 right-6 p-2 border border-[#22242b] rounded text-zinc-400 hover:text-[#c5a059] transition-all"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-2">Crônicas Iniciais</span>
          <h2 className="text-2xl font-light text-white tracking-wide mb-6">{intro.titulo}</h2>
          <p className="text-zinc-400 leading-relaxed text-sm text-justify whitespace-pre-line">{intro.texto}</p>
          <div className="mt-8 pt-6 border-t border-[#18191f] flex justify-end">
            <Link
              href="/universo/camadas"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#c5a059] text-black text-xs uppercase font-semibold rounded hover:bg-amber-600 transition-all group"
            >
              Conhecer as Camadas <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-[#0a0b0d] border border-[#c5a059]/30 p-8 rounded-lg space-y-4 w-full">
          <input
            type="text"
            value={fNome}
            onChange={e => setFNome(e.target.value)}
            className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
          />
          <textarea
            rows={8}
            value={fLore}
            onChange={e => setFLore(e.target.value)}
            className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059] resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditando(false)}
              className="px-4 py-2 border border-[#22242b] rounded text-xs text-zinc-400"
            >
              Cancelar
            </button>
            <button
              onClick={salvarIntro}
              className="px-4 py-2 bg-[#c5a059] text-black font-semibold rounded text-xs"
            >
              Gravar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}