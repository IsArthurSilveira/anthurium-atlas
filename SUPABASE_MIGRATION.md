# Migração para Supabase

Este projeto hoje usa `localStorage` via `src/lib/api/mockAdapters.ts`. A migração para Supabase deve substituir essa camada por consultas reais no banco, mantendo os mesmos modelos de domínio:

- `Plano`
- `Nacao`
- `Lugar`
- `Etnia`
- `Npc`
- `Teologia`

## 1) O que criar no Supabase

Crie um projeto no Supabase e depois rode o SQL abaixo no editor SQL. Ele já cria as tabelas principais, relacionamentos e políticas básicas de RLS.

```sql
-- Extensões úteis
create extension if not exists pgcrypto;

-- Planos
create table if not exists public.planos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao_curta text,
  lore text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Nações
create table if not exists public.nacoes (
  id uuid primary key default gen_random_uuid(),
  plano_id uuid not null references public.planos(id) on delete cascade,
  nome text not null,
  descricao_curta text,
  lema text,
  clima_emocional text,
  cardeal text,
  etnias text,
  lore text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_nacoes_plano_id on public.nacoes(plano_id);

-- Lugares
create table if not exists public.lugares (
  id uuid primary key default gen_random_uuid(),
  nacao_id uuid not null references public.nacoes(id) on delete cascade,
  nome text not null,
  descricao_breve text,
  descricao_completa text,
  imagens jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_lugares_nacao_id on public.lugares(nacao_id);

-- Etnias
create table if not exists public.etnias (
  id uuid primary key default gen_random_uuid(),
  nacao_id uuid not null references public.nacoes(id) on delete cascade,
  nome text not null,
  descricao text,
  afinidades jsonb not null default '[]'::jsonb,
  imagens jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_etnias_nacao_id on public.etnias(nacao_id);

-- NPCs
create table if not exists public.npcs (
  id uuid primary key default gen_random_uuid(),
  nacao_id uuid not null references public.nacoes(id) on delete cascade,
  nome text not null,
  funcao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_npcs_nacao_id on public.npcs(nacao_id);

-- Teologia da nação
create table if not exists public.teologias (
  id uuid primary key default gen_random_uuid(),
  nacao_id uuid not null unique references public.nacoes(id) on delete cascade,
  nome text not null,
  descricao text,
  praticas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger genérica para updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_planos_updated_at on public.planos;
create trigger trg_planos_updated_at
before update on public.planos
for each row execute function public.set_updated_at();

drop trigger if exists trg_nacoes_updated_at on public.nacoes;
create trigger trg_nacoes_updated_at
before update on public.nacoes
for each row execute function public.set_updated_at();

drop trigger if exists trg_lugares_updated_at on public.lugares;
create trigger trg_lugares_updated_at
before update on public.lugares
for each row execute function public.set_updated_at();

drop trigger if exists trg_etnias_updated_at on public.etnias;
create trigger trg_etnias_updated_at
before update on public.etnias
for each row execute function public.set_updated_at();

drop trigger if exists trg_npcs_updated_at on public.npcs;
create trigger trg_npcs_updated_at
before update on public.npcs
for each row execute function public.set_updated_at();

drop trigger if exists trg_teologias_updated_at on public.teologias;
create trigger trg_teologias_updated_at
before update on public.teologias
for each row execute function public.set_updated_at();

-- RLS: comece simples. Depois ajuste por usuário/autenticação.
alter table public.planos enable row level security;
alter table public.nacoes enable row level security;
alter table public.lugares enable row level security;
alter table public.etnias enable row level security;
alter table public.npcs enable row level security;
alter table public.teologias enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'planos' and policyname = 'allow_all_planos'
  ) then
    create policy allow_all_planos on public.planos for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'nacoes' and policyname = 'allow_all_nacoes'
  ) then
    create policy allow_all_nacoes on public.nacoes for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'lugares' and policyname = 'allow_all_lugares'
  ) then
    create policy allow_all_lugares on public.lugares for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'etnias' and policyname = 'allow_all_etnias'
  ) then
    create policy allow_all_etnias on public.etnias for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'npcs' and policyname = 'allow_all_npcs'
  ) then
    create policy allow_all_npcs on public.npcs for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'teologias' and policyname = 'allow_all_teologias'
  ) then
    create policy allow_all_teologias on public.teologias for all using (true) with check (true);
  end if;
end $$;
```

## 2) O que colocar no `env.local`

Crie um arquivo `.env.local` na raiz do projeto. O Supabase precisa, no mínimo, destas variáveis:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SEU_ANON_KEY
```

Se você for usar operações administrativas no servidor, adicione também:

```bash
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
```

Observações:

- `NEXT_PUBLIC_*` fica disponível no browser e pode ser usado no client.
- `SUPABASE_SERVICE_ROLE_KEY` não deve ir para o client; use somente em server actions, route handlers ou scripts de seed.
- Se você ainda não quiser autenticação, o ANON key já basta para começar.

## 3) Onde mexer no código

Hoje a persistência está em `src/lib/api/mockAdapters.ts`. A migração mais simples é trocar esse arquivo por um repositório Supabase com a mesma assinatura de funções:

- `listNacoes()`
- `getNacao(id)`
- `upsertNacao(nacao)`
- `listLugares(nacaoId)`
- `addLugar(nacaoId, lugar)`
- `updateLugar(nacaoId, lugar)`
- `listEtnias(nacaoId)`
- `addEtnia(nacaoId, etnia)`
- `updateEtnia(nacaoId, etnia)`
- `listNpcs(nacaoId)`
- `addNpc(nacaoId, npc)`

Isso evita mexer nas telas primeiro. Você pode:

1. Criar um client Supabase em `src/lib/supabaseClient.ts`.
2. Reescrever `mockAdapters.ts` para chamar Supabase em vez de `localStorage`.
3. Manter os componentes e páginas como estão.

## 4) Passo a passo recomendado

1. Criar o projeto no Supabase.
2. Rodar o SQL acima.
3. Preencher `.env.local`.
4. Criar um client Supabase no app.
5. Substituir `localStorage` por queries no adapter.
6. Testar primeiro `Nação`, depois `Lugares`, `Etnias` e `NPCs`.
7. Quando estiver estável, remover o seed/mock antigo.

## 5) Notas importantes

- As imagens hoje são armazenadas como `string[]`; no banco, `jsonb` é a forma mais simples de manter isso sem refatorar a UI.
- Se quiser upload real de imagens, o ideal é usar Supabase Storage e salvar no banco apenas as URLs públicas.
- Para produção, você vai querer trocar as policies `using (true)` por regras baseadas em autenticação/owner.

## 6) Próximo passo prático

Se você quiser, eu posso fazer o próximo passo e já criar os arquivos de integração do Supabase no projeto:

- `src/lib/supabaseClient.ts`
- adaptar `src/lib/api/mockAdapters.ts` para Supabase
- opcionalmente criar um `.env.local.example`