"use client";

import React from 'react';
import { X } from 'lucide-react';

interface Etnia {
  id?: string;
  nome: string;
  descricao?: string;
  afinidades?: string[];
  imagens?: string[];
}

interface Props {
  etnia: Etnia | null;
  abrir: boolean;
  onClose: () => void;
  modoMestre?: boolean;
  onSave?: (e: Etnia) => void;
  onDelete?: (id: string) => void | Promise<void>;
}

export default function EthniaModal({ etnia, abrir, onClose, modoMestre, onSave, onDelete }: Props) {
  const [desc, setDesc] = React.useState(etnia?.descricao || '');
  const [imagens, setImagens] = React.useState<string[]>(etnia?.imagens || []);
  const [salvando, setSalvando] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; type?: 'error' | 'success' } | null>(null);
  const [confirmarExclusao, setConfirmarExclusao] = React.useState(false);

  React.useEffect(() => {
    setDesc(etnia?.descricao || '');
    setImagens(etnia?.imagens || []);
    setConfirmarExclusao(false);
  }, [etnia]);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!abrir || !etnia) return null;

  const handleSave = async () => {
    setSalvando(true);
    try {
      const updated: Etnia = { ...(etnia as any), descricao: desc, imagens };
      if (typeof onSave === 'function') {
        await onSave(updated);
      }
      setToast({ message: 'Salvo com sucesso.', type: 'success' });
      setTimeout(() => onClose(), 600);
    } catch (err) {
      console.error('Erro ao salvar etnia:', err);
      setToast({ message: 'Erro ao salvar. Tente novamente.', type: 'error' });
    } finally {
      setSalvando(false);
    }
  };

  const handleDelete = async () => {
    if (!etnia?.id || typeof onDelete !== 'function') return;

    setSalvando(true);
    try {
      await onDelete(etnia.id);
      setToast({ message: 'Etnia excluída com sucesso.', type: 'success' });
      setTimeout(() => onClose(), 600);
    } catch (err) {
      console.error('Erro ao excluir etnia:', err);
      setToast({ message: 'Erro ao excluir. Tente novamente.', type: 'error' });
    } finally {
      setSalvando(false);
      setConfirmarExclusao(false);
    }
  };

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
            <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-2">Imagens</span>
            {modoMestre ? (
              <div>
                <input type="file" accept="image/*" multiple onChange={async (ev) => {
                  const files = Array.from(ev.target.files || []);
                  const urls: string[] = [];
                  for (const f of files) {
                    try {
                      const dataUrl = await new Promise<string>((res, rej) => {
                        const reader = new FileReader();
                        reader.onload = () => res(String(reader.result));
                        reader.onerror = rej;
                        reader.readAsDataURL(f);
                      });
                      urls.push(dataUrl);
                    } catch (err) {
                      // ignore
                    }
                  }
                  if (urls.length) setImagens(prev => [...prev, ...urls]);
                }} className="w-full text-xs text-zinc-300 mb-2" />

                <div className="flex gap-2 flex-wrap">
                  {imagens.map((img, i) => (
                    <div key={i} className="w-20 h-14 rounded overflow-hidden border border-[#22242b] relative">
                      <img src={img} alt={`etnia-${i}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImagens(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 text-xs bg-black/40 px-1">X</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {(etnia.imagens || []).map((img, i) => (
                  <img key={i} src={img} alt={`etnia-${i}`} className="w-20 h-14 object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase block mb-2">Afinidades</span>
            <div className="flex flex-wrap gap-2">
              {(etnia.afinidades ?? []).map(a => (
                <span key={a} className="px-3 py-1 rounded-full border border-[#2a2d34] text-xs text-zinc-300 bg-[#111216]">{a}</span>
              ))}
            </div>
          </div>

          {modoMestre && (
            <div className="flex flex-wrap justify-end gap-2">
              {etnia.id && onDelete && (
                confirmarExclusao ? (
                  <>
                    <button onClick={() => setConfirmarExclusao(false)} disabled={salvando} className="px-3 py-1 rounded border border-[#22242b] text-zinc-300 text-xs disabled:opacity-50">Cancelar exclusão</button>
                    <button onClick={handleDelete} disabled={salvando} className="px-3 py-1 rounded bg-red-600 text-white text-xs disabled:opacity-50">{salvando ? 'Excluindo...' : 'Confirmar exclusão'}</button>
                  </>
                ) : (
                  <button onClick={() => setConfirmarExclusao(true)} disabled={salvando} className="px-3 py-1 rounded border border-red-500/60 text-red-300 text-xs hover:bg-red-500/10 disabled:opacity-50">
                    Excluir
                  </button>
                )
              )}
              <button onClick={handleSave} disabled={salvando} className="px-3 py-1 rounded bg-[#c5a059] text-black text-xs disabled:opacity-50">{salvando ? 'Salvando...' : 'Salvar'}</button>
            </div>
          )}
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
