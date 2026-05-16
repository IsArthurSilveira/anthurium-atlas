"use client";

import React from 'react';
import { ImageIcon } from 'lucide-react';

interface Npc {
  nome: string;
  funcao: string;
}

interface Props {
  npc: Npc;
  modoMestre?: boolean;
}

export default function NpcCard({ npc, modoMestre }: Props) {
  return (
    <div className="text-center">
      <div className="aspect-square rounded border border-[#22242b] bg-[#111216] flex items-center justify-center mb-2">
        <ImageIcon className="w-7 h-7 text-zinc-600" />
      </div>
      <p className="text-[11px] text-zinc-200 leading-tight">{npc.nome}</p>
      <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wide">{npc.funcao}</p>
      {modoMestre && (
        <div className="mt-2">
          <button className="text-[11px] px-3 py-1 rounded border border-[#22242b] text-zinc-300 hover:bg-[#111216]">Editar</button>
        </div>
      )}
    </div>
  );
}
