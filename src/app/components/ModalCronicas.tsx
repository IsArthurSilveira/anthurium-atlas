'use client';

import React from 'react';
import { X } from 'lucide-react';

interface Nacao {
  nome: string;
  lema: string;
  lore: string;
}

interface ModalProps {
  nacao: Nacao | null;
  fechar: () => void;
}

export default function ModalCronicas({ nacao, fechar }: ModalProps) {
  if (!nacao) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 z-50 animate-fade-in">
      <div className="bg-[#0a0b0d] border border-[#22242b] max-w-3xl w-full max-h-[85vh] flex flex-col rounded-lg shadow-2xl overflow-hidden relative">
        <div className="w-full h-px bg-linear-to-r from-transparent via-[#c5a059] to-transparent" />
        
        <div className="p-6 border-b border-[#18191f] flex justify-between items-start bg-[#0e1014]">
          <div>
            <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase">Registros Históricos Imperiais</span>
            <h2 className="text-2xl font-light tracking-wide text-white mt-1">{nacao.nome}</h2>
            <p className="text-xs italic text-zinc-500">"{nacao.lema}"</p>
          </div>
          <button onClick={fechar} className="p-1.5 border border-[#22242b] rounded-md text-zinc-500 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto text-sm leading-relaxed text-zinc-400 text-justify whitespace-pre-line">
          <p>{nacao.lore}</p>
        </div>

        <div className="p-4 bg-[#0a0b0d] border-t border-[#18191f] flex justify-end text-[10px] tracking-widest text-zinc-600 uppercase">
          Grimório Oculto // Biblioteca de {nacao.nome}
        </div>
      </div>
    </div>
  );
}