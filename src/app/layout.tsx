'use client';

import React from 'react';
import Header from './components/Header';
import { MestreProvider } from './components/MestreContext';
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#0d0e12] min-h-screen flex flex-col">
        <MestreProvider>
          <Header />
          <div className="flex-1 flex flex-col">{children}</div>
        </MestreProvider>
      </body>
    </html>
  );
}