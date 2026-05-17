"use client";

import React from 'react';
import { ImageIcon } from 'lucide-react';

interface Lugar {
  nome: string;
  descricaoBreve: string;
  descricaoCompleta: string;
  imagens: string[];
}

interface Props {
  lugar: Lugar;
  onOpen: (l: Lugar) => void;
  modoMestre?: boolean;
}

export default function PlaceCard({ lugar, onOpen, modoMestre }: Props) {
  return (
    <div className="text-left p-3 border border-[#1b1c22] rounded bg-[#0e1014] hover:border-[#c5a059] transition-colors">
      <button type="button" onClick={() => onOpen(lugar)} className="w-full text-left">
        <div className="aspect-square rounded mb-3 overflow-hidden border border-[#22242b] bg-[#111216]">
          {lugar.imagens && lugar.imagens.length > 0 ? (
            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${lugar.imagens[0]})` }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-zinc-600" />
            </div>
          )}
        </div>
        <p className="text-xs text-zinc-200 text-center">{lugar.nome}</p>
      </button>

      {modoMestre && (
        <div className="mt-2 text-center">
          <button type="button" onClick={() => onOpen(lugar)} className="text-[11px] px-3 py-1 rounded border border-[#22242b] text-zinc-300 hover:bg-[#111216]">Editar</button>
        </div>
      )}
    </div>
  );
}
