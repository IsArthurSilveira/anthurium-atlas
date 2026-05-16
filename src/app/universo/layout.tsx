'use client';

export default function UniversoLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col">{children}</div>;
}
