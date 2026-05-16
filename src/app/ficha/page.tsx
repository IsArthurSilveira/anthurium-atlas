import Link from 'next/link';

export default function FichaPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8 text-center max-w-2xl mx-auto">
      <span className="text-[10px] tracking-[0.35em] uppercase text-[#c5a059] mb-3">Módulo em Construção</span>
      <h1 className="text-3xl font-light text-white tracking-wide mb-3">Ficha de Personagem</h1>
      <p className="text-sm text-zinc-500 leading-relaxed mb-8">
        Esta rota será o núcleo de atributos, perícias, evolução e estado atual do personagem.
      </p>
      <Link href="/universo" className="text-xs uppercase tracking-wider text-[#c5a059] hover:text-amber-300">
        Voltar para O Universo
      </Link>
    </div>
  );
}
