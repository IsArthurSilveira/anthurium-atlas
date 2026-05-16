'use client';

import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8 text-center max-w-2xl mx-auto">
      <span className="text-[10px] tracking-[0.4em] uppercase text-[#c5a059] mb-3">Bem-vindo Portador do Dom</span>
      <h1 className="text-4xl font-light text-white tracking-wide mb-4">Anthúrium RPG</h1>
      <p className="text-sm text-zinc-500 leading-relaxed mb-8">
        Explore as crônicas, os registros geopolíticos, as fraquezas arcanas e a cosmologia do mundo pós-Estrondo através deste grimório digital interativo.
      </p>
      <Link 
        href="/universo" 
        className="flex items-center gap-2 px-6 py-3 bg-[#c5a059] text-black font-semibold text-xs uppercase tracking-widest rounded hover:bg-amber-600 transition-all shadow-[0_0_20px_rgba(197,160,89,0.1)] group"
      >
        <Sparkles className="w-4 h-4" /> Entrar no Universo
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}