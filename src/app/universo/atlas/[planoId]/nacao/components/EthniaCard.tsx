"use client";

import React from 'react';
import { ImageIcon } from 'lucide-react';

interface Etnia {
  nome: string;
  descricao: string;
  afinidades: string[];
}

interface Props {
  etnia: Etnia;
  onOpen: (e: Etnia) => void;
  modoMestre?: boolean;
}

export default function EthniaCard({ etnia, onOpen, modoMestre }: Props) {
  return (
    <div className="text-left p-3 border border-[#1b1c22] rounded bg-[#0e1014] hover:border-[#c5a059] transition-colors">
      <button type="button" onClick={() => onOpen(etnia)} className="w-full text-left">
        <div className="aspect-square bg-[#111216] rounded flex items-center justify-center border border-[#22242b] mb-3 overflow-hidden">
          <ImageIcon className="w-7 h-7 text-zinc-600" />
        </div>
        <p className="text-xs text-zinc-200 text-center">{etnia.nome}</p>
      </button>

      {modoMestre && (
        <div className="mt-2 text-center">
          <button type="button" onClick={() => onOpen(etnia)} className="text-[11px] px-3 py-1 rounded border border-[#22242b] text-zinc-300 hover:bg-[#111216]">Editar</button>
        </div>
      )}
    </div>
  );
}
