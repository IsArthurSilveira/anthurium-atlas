"use client";

import React from 'react';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

interface Lugar {
  id?: string;
  nome: string;
  descricaoBreve?: string;
  descricaoCompleta?: string;
  imagens?: string[];
}

interface Props {
  lugar: Lugar | null;
  abrir: boolean;
  onClose: () => void;
  modoMestre?: boolean;
  onSave?: (l: Lugar) => void;
  onDelete?: (id: string) => void | Promise<void>;
}

export default function PlaceModal({ lugar, abrir, onClose, modoMestre, onSave, onDelete }: Props) {
  const [indice, setIndice] = React.useState(0);
  const [desc, setDesc] = React.useState('');
  const [imagens, setImagens] = React.useState<string[]>([]);
  const [toast, setToast] = React.useState<{ message: string; type?: 'error' | 'success' } | null>(null);
  const [salvando, setSalvando] = React.useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = React.useState(false);

  React.useEffect(() => {
    setIndice(0);
    setDesc(lugar?.descricaoCompleta || '');
    setImagens(lugar?.imagens || []);
    setConfirmarExclusao(false);
  }, [lugar]);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!abrir || !lugar) return null;

  const handleSave = async () => {
    setSalvando(true);
    try {
      const updated: Lugar = { ...(lugar as any), descricaoCompleta: desc, imagens } as Lugar;
      if (typeof onSave === 'function') {
        await onSave(updated);
      }
      setToast({ message: 'Salvo com sucesso.', type: 'success' });
      setTimeout(() => onClose(), 600);
    } catch (err) {
      console.error('Erro ao salvar lugar:', err);
      setToast({ message: 'Erro ao salvar. Tente novamente.', type: 'error' });
    } finally {
      setSalvando(false);
    }
  };

  const handleDelete = async () => {
    if (!lugar?.id || typeof onDelete !== 'function') return;

    setSalvando(true);
    try {
      await onDelete(lugar.id);
      setToast({ message: 'Lugar excluído com sucesso.', type: 'success' });
      setTimeout(() => onClose(), 600);
    } catch (err) {
      console.error('Erro ao excluir lugar:', err);
      setToast({ message: 'Erro ao excluir. Tente novamente.', type: 'error' });
    } finally {
      setSalvando(false);
      setConfirmarExclusao(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-xl border border-[#22242b] bg-[#0a0b0d] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#c5a059] uppercase">Lugar</p>
            <h3 className="text-lg text-white">{lugar.nome}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar modal" className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)] items-start">
          <div>
            <div className="relative overflow-hidden rounded-xl border border-[#22242b] bg-[#111216] aspect-16/10">
              <button type="button" onClick={() => setIndice(i => (i - 1 + (imagens.length || 1)) % (imagens.length || 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-[#2a2d34] bg-black/40 text-zinc-300 hover:text-white hover:border-[#c5a059] flex items-center justify-center z-10" aria-label="Imagem anterior">
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div className="max-w-sm">
                  {imagens.length > 0 ? (
                    <img src={imagens[indice]} alt="preview" className="mx-auto mb-4 max-h-64 object-cover rounded" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  )}
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#c5a059] mb-2">{imagens[indice] || 'Imagem conceitual'}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">Galeria conceitual do lugar, reservada para imagens, ângulos arquitetônicos e detalhes de ambiente.</p>
                </div>
              </div>

              <button type="button" onClick={() => setIndice(i => (i + 1) % (imagens.length || 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-[#2a2d34] bg-black/40 text-zinc-300 hover:text-white hover:border-[#c5a059] flex items-center justify-center z-10" aria-label="Próxima imagem">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              {imagens.map((imagem, index) => (
                <button key={index} type="button" onClick={() => setIndice(index)} className={index === indice ? 'h-2 rounded-full transition-all w-6 bg-[#c5a059]' : 'h-2 rounded-full transition-all w-2 bg-[#2a2d34] hover:bg-[#555962]'} aria-label={`Ir para ${index}`}></button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-[#1b1c22] bg-[#0e1014] p-4">
              <p className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase mb-3">Descrição Breve</p>
              {modoMestre ? (
                <div>
                  <textarea rows={6} value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-[#111216] border border-[#22242b] rounded px-3 py-2 text-sm text-white focus:outline-none" />

                    <div className="mt-3">
                      <label className="text-xs text-zinc-400 block mb-2">Imagens</label>
                      <input type="file" accept="image/*" multiple onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        const urls: string[] = [];
                        const maxSize = 2 * 1024 * 1024; // 2MB per file
                        for (const f of files) {
                          if (!f.type.startsWith('image/')) {
                            setToast({ message: 'Apenas imagens são permitidas.', type: 'error' });
                            continue;
                          }
                          if (f.size > maxSize) {
                            setToast({ message: `Arquivo ${f.name} excede 2MB.`, type: 'error' });
                            continue;
                          }
                          try {
                            const dataUrl = await new Promise<string>((res, rej) => {
                              const reader = new FileReader();
                              reader.onload = () => res(String(reader.result));
                              reader.onerror = rej;
                              reader.readAsDataURL(f);
                            });
                            urls.push(dataUrl);
                          } catch (err) {
                            setToast({ message: `Falha ao ler ${f.name}.`, type: 'error' });
                          }
                        }
                        if (urls.length > 0) setImagens(prev => [...prev, ...urls]);
                      }} className="w-full text-xs text-zinc-300" />
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {imagens.map((img, i) => (
                          <div key={i} className="w-20 h-14 bg-[#0b0b0d] rounded overflow-hidden border border-[#22242b] relative">
                            <img src={img} alt={`img-${i}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setImagens(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 text-xs bg-black/40 px-1">X</button>
                          </div>
                        ))}
                      </div>
                    </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-300 leading-relaxed">{lugar.descricaoCompleta}</p>
              )}
            </div>

            <div className="rounded-lg border border-[#1b1c22] bg-[#0e1014] p-4">
              <p className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase mb-3">Resumo Visual</p>
              <p className="text-xs text-zinc-400 leading-relaxed">Cada imagem do carrossel representa um ponto de vista do lugar, pensado para orientar a expansão do mapa e dos usos sociais do território.</p>
            </div>

            {modoMestre && (
              <div className="flex flex-wrap justify-end gap-2">
                {lugar.id && onDelete && (
                  confirmarExclusao ? (
                    <>
                      <button onClick={() => setConfirmarExclusao(false)} disabled={salvando} className="px-3 py-1 text-xs rounded border border-[#22242b] text-zinc-300 disabled:opacity-50">Cancelar exclusão</button>
                      <button onClick={handleDelete} disabled={salvando} className="px-3 py-1 text-xs rounded bg-red-600 text-white disabled:opacity-50">{salvando ? 'Excluindo...' : 'Confirmar exclusão'}</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmarExclusao(true)} disabled={salvando} className="px-3 py-1 text-xs rounded border border-red-500/60 text-red-300 hover:bg-red-500/10 disabled:opacity-50">
                      Excluir
                    </button>
                  )
                )}
                <button onClick={() => onClose()} disabled={salvando} className="px-3 py-1 text-xs rounded border border-[#22242b] text-zinc-300 disabled:opacity-50">Cancelar</button>
                <button onClick={handleSave} disabled={salvando} className="px-3 py-1 text-xs rounded bg-[#c5a059] text-black disabled:opacity-50">{salvando ? 'Salvando...' : 'Salvar'}</button>
              </div>
            )}
          </div>
        </div>
        {toast && (
          <div className={`fixed left-1/2 -translate-x-1/2 bottom-8 z-50 rounded-md px-4 py-2 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-400 text-black'}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
