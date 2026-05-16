'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

interface MestreContextValue {
  modoMestre: boolean;
  setModoMestre: (value: boolean) => void;
}

const MestreContext = createContext<MestreContextValue | null>(null);

export function MestreProvider({ children }: { children: React.ReactNode }) {
  const [modoMestre, setModoMestre] = useState(false);

  const value = useMemo(
    () => ({ modoMestre, setModoMestre }),
    [modoMestre]
  );

  return <MestreContext.Provider value={value}>{children}</MestreContext.Provider>;
}

export function useMestre() {
  const context = useContext(MestreContext);
  if (!context) {
    throw new Error('useMestre deve ser usado dentro de MestreProvider');
  }
  return context;
}