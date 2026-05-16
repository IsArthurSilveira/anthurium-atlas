'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Eye, UserCheck, Sparkles, Shield, Backpack, Users } from 'lucide-react';
import { useMestre } from './MestreContext';

export default function Header() {
  const { modoMestre, setModoMestre } = useMestre();
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 px-4 py-1.5 rounded text-xs tracking-wider uppercase font-medium transition-all ${
      isActive(path) ? 'bg-[#c5a059]/10 text-[#c5a059]' : 'text-zinc-500 hover:text-zinc-300'
    }`;

  return (
    <header className="border-b border-[#1b1c22] px-8 py-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0a0b0d] z-50 sticky top-0">
      <div className="flex items-center gap-3">
        <Compass className="w-5 h-5 text-[#c5a059]" />
        <Link href="/" className="text-xs tracking-[0.25em] uppercase font-bold text-white hover:text-[#c5a059] transition-colors">
          Anthurium <span className="text-[#c5a059] font-normal">// Grimório</span>
        </Link>
      </div>

      <nav className="flex items-center border border-[#1b1c22] rounded bg-[#0d0e12] p-1">
        <Link href="/universo" className={navLinkClass('/universo')}>
          <Sparkles className="w-3.5 h-3.5" /> O Universo
        </Link>
        <Link href="/elementos" className={navLinkClass('/elementos')}>
          <Shield className="w-3.5 h-3.5" /> Elementos
        </Link>
        <Link href="/inventario" className={navLinkClass('/inventario')}>
          <Backpack className="w-3.5 h-3.5" /> Inventário
        </Link>
        <Link href="/ficha" className={navLinkClass('/ficha')}>
          <Users className="w-3.5 h-3.5" /> Ficha
        </Link>
      </nav>

      <button
        onClick={() => setModoMestre(!modoMestre)}
        className={`flex items-center gap-2 px-4 py-1.5 border rounded text-[10px] tracking-widest uppercase transition-all ${
          modoMestre ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/5 shadow-[0_0_15px_rgba(197,160,89,0.08)]' : 'border-[#22242b] text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {modoMestre ? <UserCheck className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        {modoMestre ? 'Mestre Ativo' : 'Modo Jogador'}
      </button>
    </header>
  );
}