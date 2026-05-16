"use client";

import React from 'react';
import { X } from 'lucide-react';

interface Etnia {
  nome: string;
  descricao: string;
  afinidades: string[];
}

interface Props {
  etnia: Etnia | null;
  abrir: boolean;
  onClose: () => void;
  modoMestre?: boolean;
}

export default function EthniaModal({ etnia, abrir, onClose, modoMestre }: Props) {
  const [desc, setDesc] = React.useState(etnia?.descricao || '');

  React.useEffect(() => {
    setDesc(etnia?.descricao || '');
  }, [etnia]);

  if (!abrir || !etnia) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl border border-[#22242b] bg-[#0a0b0d] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase mb-2">Etnia</p>
            <h3 className="text-xl font-light text-white">{etnia.nome}</h3>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded border border-[#22242b] text-zinc-400 hover:text-white flex items-center justify-center" aria-label="Fechar modal">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-2">Descrição</span>
            {modoMestre ? (
              <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-[#111216] border border-[#22242b] rounded px-3 py-2 text-sm text-white" />
            ) : (
              <p className="text-sm text-zinc-300 leading-relaxed">{etnia.descricao}</p>
            )}
          </div>

          <div>
            <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-2">Afinidades</span>
            <div className="flex flex-wrap gap-2">
              {etnia.afinidades.map(a => (
                <span key={a} className="px-3 py-1 rounded-full border border-[#2a2d34] text-xs text-zinc-300 bg-[#111216]">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
