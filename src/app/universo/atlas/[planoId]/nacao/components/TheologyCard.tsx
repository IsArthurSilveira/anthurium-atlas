"use client";

import React from 'react';
import { Palette } from 'lucide-react';

interface Teologia {
  nome: string;
  descricao: string;
  praticas: string;
}

interface Demografia {
  habitantes: string;
  territorio: string;
  elementoMagico: string;
}

interface Props {
  teologia: Teologia;
  demografia: Demografia;
  modoMestre?: boolean;
}

export default function TheologyCard({ teologia, demografia, modoMestre }: Props) {
  const [desc, setDesc] = React.useState(teologia.descricao);
  const [praticas, setPraticas] = React.useState(teologia.praticas);

  React.useEffect(() => {
    setDesc(teologia.descricao);
    setPraticas(teologia.praticas);
  }, [teologia]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-light text-white">A Teologia Viva</h3>
      <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)] items-start bg-[#0a0b0d] border border-[#22242b] p-4 rounded">
        <div className="space-y-3">
          <div className="aspect-square rounded border border-[#22242b] bg-[#111216] flex items-center justify-center overflow-hidden">
            <Palette className="w-8 h-8 text-zinc-600" />
          </div>
          <div>
            <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-1">Cardeal</span>
            <p className="text-sm text-white font-light leading-snug">{teologia.nome}</p>
          </div>
          <div>
            <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-1">Elemento Mágico</span>
            <p className="text-xs text-zinc-300">{demografia.elementoMagico}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-2">Teologia / Religião</span>
            <h4 className="text-base font-light text-white">{teologia.nome}</h4>
          </div>
          {modoMestre ? (
            <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-[#111216] border border-[#22242b] rounded px-3 py-2 text-sm text-white" />
          ) : (
            <p className="text-sm text-zinc-300 leading-relaxed">{desc}</p>
          )}

          <div className="pt-2 border-t border-[#1b1c22]">
            <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-2">Rituais e Práticas</span>
            {modoMestre ? (
              <textarea rows={3} value={praticas} onChange={e => setPraticas(e.target.value)} className="w-full bg-[#111216] border border-[#22242b] rounded px-3 py-2 text-sm text-white" />
            ) : (
              <p className="text-sm text-zinc-300 leading-relaxed">{praticas}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
