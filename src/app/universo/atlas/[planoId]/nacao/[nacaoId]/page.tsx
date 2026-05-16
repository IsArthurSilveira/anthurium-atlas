'use client';

import React, { useState, useEffect } from 'react';
import { Edit3, ArrowLeft, ChevronLeft, ChevronRight, ImageIcon, Palette, X } from 'lucide-react';
import PlaceCard from '../components/PlaceCard';
import PlaceModal from '../components/PlaceModal';
import TheologyCard from '../components/TheologyCard';
import EthniaCard from '../components/EthniaCard';
import EthniaModal from '../components/EthniaModal';
import NpcCard from '../components/NpcCard';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMestre } from '../../../../../components/MestreContext';
import {
  listLugares,
  addLugar,
  listEtnias,
  addEtnia,
  listNpcs,
  addNpc,
} from '../../../../../../lib/api/mockAdapters';
import { updateLugar } from '../../../../../../lib/api/mockAdapters';

interface Plano {
  id: string;
  nome: string;
  descricaoCurta: string;
  lore: string;
}

interface Nacao {
  id: string;
  planoId: string;
  nome: string;
  descricaoCurta?: string;
  lema: string;
  climaEmocional: string;
  cardeal: string;
  etnias: string;
  lore: string;
}

interface Etnia {
  nome: string;
  descricao: string;
  afinidades: string[];
}

interface Lugar {
  nome: string;
  descricaoBreve: string;
  descricaoCompleta: string;
  imagens: string[];
}

const planosIniciais: Plano[] = [
  { id: 'plano-material', nome: 'O Plano Material (A Âncora)', descricaoCurta: 'A dimensão da solidez, da carne e do tempo linear.', lore: 'É onde nós estamos.' },
  { id: 'eter', nome: 'O Éter (O Turbilhão)', descricaoCurta: 'Oceano infinito de luz, som e potencial criativo bruto.', lore: 'A fonte de onde a magia vem.' },
  { id: 'substrato', nome: 'O Substrato (O Silêncio)', descricaoCurta: 'A Anti-Existência que circunda a realidade.', lore: 'Se o Éter é "Tudo", o Substrato é "Nada".' },
  { id: 'profundeza', nome: 'A Profundeza (O Mistério Submerso)', descricaoCurta: 'O plano de transição velado sob as ondas.', lore: 'O quarto plano, velado sob as ondas.' }
];

const nacoesIniciais: Nacao[] = [
  { id: 'crystallinum', planoId: 'plano-material', nome: 'Crystallinum', lema: 'A Nitidez no Reflexo do Éter', climaEmocional: 'Frieza analítica e melancolia profunda.', cardeal: 'Naqua - A Senhora da Memória', etnias: 'Hyalin (Pele translúcida)', lore: 'Crystallinum é o centro do conhecimento histórico e medicinal de Anthurium...' },
  { id: 'andraeanum', planoId: 'plano-material', nome: 'Andraeanum', lema: 'Crescer, florescer, devorar', climaEmocional: 'Euforia biológica.', cardeal: 'Eos - A Dama Vivaz', etnias: 'Xylid (Simbiontes)', lore: 'Andraeanum é uma selva predatória onde a vida cresce com velocidade aterrorizante...' }
];

function resumirLore(nacao: Nacao) {
  const fonte = nacao.descricaoCurta || nacao.lore;
  const texto = fonte.replace(/\s+/g, ' ').trim();

  if (texto.length <= 150) {
    return texto;
  }

  return `${texto.slice(0, 147).replace(/\s+\S*$/, '')}...`;
}

function obterDemografia(nacao: Nacao) {
  const mapa: Record<string, { habitantes: string; territorio: string; elementoMagico: string }> = {
    crystallinum: {
      habitantes: '84 mil habitantes',
      territorio: '1.200 km²',
      elementoMagico: 'Cristal / Memória',
    },
    andraeanum: {
      habitantes: '310 mil habitantes',
      territorio: '4.800 km²',
      elementoMagico: 'Vida / Seiva',
    },
  };

  return mapa[nacao.id] || {
    habitantes: '42 mil habitantes',
    territorio: '900 km²',
    elementoMagico: 'Éter / Harmonia',
  };
}

function obterNpcsPrincipais(nacao: Nacao) {
  const mapa: Record<string, Array<{ nome: string; funcao: string }>> = {
    crystallinum: [
      { nome: 'Arconte Nael', funcao: 'Curador de Memórias' },
      { nome: 'Iria Voss', funcao: 'Cartógrafa de Cristal' },
      { nome: 'Soren Hal', funcao: 'Mestre dos Registros' },
      { nome: 'Mira Thale', funcao: 'Guardião da Biblioteca' },
    ],
    andraeanum: [
      { nome: 'Eron Vale', funcao: 'Jardineiro-Chefe' },
      { nome: 'Lysa Mor', funcao: 'Arauta da Seiva' },
      { nome: 'Tarek Nym', funcao: 'Vigia da Selva' },
      { nome: 'Asha Rin', funcao: 'Médica dos Brotos' },
    ],
  };

  return mapa[nacao.id] || [
    { nome: 'NPC Principal 1', funcao: 'Função Local' },
    { nome: 'NPC Principal 2', funcao: 'Função Local' },
    { nome: 'NPC Principal 3', funcao: 'Função Local' },
    { nome: 'NPC Principal 4', funcao: 'Função Local' },
  ];
}

function obterTeologia(nacao: Nacao) {
  const mapa: Record<string, { nome: string; descricao: string; praticas: string }> = {
    crystallinum: {
      nome: 'Ordem da Memória Lúcida',
      descricao: 'A teologia de Crystallinum gira em torno do registro, da preservação e do cuidado com as lembranças sagradas. O sagrado é visto como aquilo que permanece vivo dentro do arquivo, do rito e da transmissão fiel do passado.',
      praticas: 'Os rituais incluem leitura de arquivos vivos, juramentos em silêncio e oferendas de cristal para marcar decisões importantes.',
    },
    andraeanum: {
      nome: 'Liturgia da Seiva Viva',
      descricao: 'Em Andraeanum, religião e biologia se confundem. A fé celebra o crescimento, a fusão com a selva e a renovação constante. O sagrado é sentido como impulso vital, brotação e continuidade orgânica.',
      praticas: 'As práticas envolvem cantos de brotação, bênçãos sobre sementes e ritos de união com a selva em ciclos de renovação.',
    },
  };

  return mapa[nacao.id] || {
    nome: 'Culto Local',
    descricao: 'A teologia desta nação organiza os ritos locais, os símbolos sagrados e a visão espiritual sobre o território.',
    praticas: 'A religião se manifesta em ritos comunitários, símbolos naturais e pequenas práticas cotidianas de devoção.',
  };
}

function obterEtniasPrincipais(nacao: Nacao) {
  const mapa: Record<string, Etnia[]> = {
    crystallinum: [
      {
        nome: 'Hyalin',
        descricao: 'Povo translúcido ligado a memória, pesquisa e registros vivos.',
        afinidades: ['Memória', 'Cristal', 'Archivística'],
      },
      {
        nome: 'Lumin',
        descricao: 'Descendentes das cúpulas claras, especialistas em luz e leitura de ecos.',
        afinidades: ['Luz', 'Eco', 'Observação'],
      },
      {
        nome: 'Vetra',
        descricao: 'Caminhantes frios das bordas montanhosas e dos salões de vidro.',
        afinidades: ['Gelo', 'Estrutura', 'Silêncio'],
      },
      {
        nome: 'Silex',
        descricao: 'Artesãos de pedra e ressonância, ligados a ritos de estabilidade.',
        afinidades: ['Pedra', 'Ressonância', 'Rito'],
      },
    ],
    andraeanum: [
      {
        nome: 'Xylid',
        descricao: 'Simbiontes de selva, ligados ao crescimento e à mutação orgânica.',
        afinidades: ['Vida', 'Seiva', 'Crescimento'],
      },
      {
        nome: 'Broma',
        descricao: 'Guardadores das estufas vivas e dos cultivos sagrados.',
        afinidades: ['Cultivo', 'Fotossíntese', 'Cura'],
      },
      {
        nome: 'Riz',
        descricao: 'Exploradores das raízes profundas e dos caminhos internos da selva.',
        afinidades: ['Raiz', 'Território', 'Instinto'],
      },
      {
        nome: 'Thorn',
        descricao: 'Guerreiros vegetais, moldados pela agressividade do bioma.',
        afinidades: ['Defesa', 'Espinhos', 'Vigor'],
      },
    ],
  };

  return mapa[nacao.id] || [
    {
      nome: 'Etnia Local 1',
      descricao: 'Grupo nativo da nação, com traços culturais próprios.',
      afinidades: ['Cultura', 'Território'],
    },
    {
      nome: 'Etnia Local 2',
      descricao: 'Grupo associado a ritos, ofícios e tradições antigas.',
      afinidades: ['Tradição', 'Rito'],
    },
    {
      nome: 'Etnia Local 3',
      descricao: 'Grupo de linhagem local com práticas sociais bem marcadas.',
      afinidades: ['Sociedade', 'Identidade'],
    },
    {
      nome: 'Etnia Local 4',
      descricao: 'Grupo complementar de presença menor no território.',
      afinidades: ['Migração', 'Adaptação'],
    },
  ];
}

function obterLugaresSociedade(nacao: Nacao) {
  const mapa: Record<string, Lugar[]> = {
    crystallinum: [
      {
        nome: 'Biblioteca Prismática',
        descricaoBreve: 'O maior arquivo vivo de registros e mapas de memória da nação.',
        descricaoCompleta: 'A Biblioteca Prismática concentra manuscritos, arquivos cristalizados e rotas de pesquisa. É um ponto de encontro entre estudiosos, cartógrafos e guardiões do passado.',
        imagens: ['Salão de arquivos', 'Corredor de prismas', 'Mesa cartográfica'],
      },
      {
        nome: 'Terraços de Vidro',
        descricaoBreve: 'Plataformas translúcidas suspensas sobre os lagos frios.',
        descricaoCompleta: 'Os Terraços de Vidro formam bairros de contemplação, cultivo e observação do céu. A arquitetura foi construída para capturar luz e ecoar memórias em cerimônias públicas.',
        imagens: ['Terraço superior', 'Jardins frios', 'Passarela suspensa'],
      },
      {
        nome: 'Círculo dos Arquivistas',
        descricaoBreve: 'Distrito cívico dedicado a registros, decisões e ritos de preservação.',
        descricaoCompleta: 'O Círculo dos Arquivistas reúne escritórios, templos laicos e salões de julgamento onde decisões precisam ser gravadas e testemunhadas por toda a comunidade.',
        imagens: ['Salão cívico', 'Mesa de registro', 'Arquivo ritual'],
      },
      {
        nome: 'Ponte das Núpcias Fulgentes',
        descricaoBreve: 'Corredor cerimonial usado para pactos, promessas e juramentos formais.',
        descricaoCompleta: 'A ponte é atravessada em eventos solenes e pactos de longo prazo. Sua função é unir bairros e simbolizar a continuidade entre gerações.',
        imagens: ['Vista da ponte', 'Detalhe cerimonial', 'Luzes noturnas'],
      },
    ],
    andraeanum: [
      {
        nome: 'Viveiro-Mãe',
        descricaoBreve: 'Complexo central de cultivo, cura e criação de espécies sagradas.',
        descricaoCompleta: 'O Viveiro-Mãe é o coração social de Andraeanum. Ali são cultivadas plantas raras, feitas curas comunitárias e definidas as rotas de expansão viva.',
        imagens: ['Estufa principal', 'Bancada de cura', 'Jardim interno'],
      },
      {
        nome: 'Rua das Trepadeiras',
        descricaoBreve: 'Eixo urbano onde arquitetura e vegetação crescem juntas.',
        descricaoCompleta: 'A Rua das Trepadeiras mistura passarelas, raízes e fachadas cobertas por flora ativa. É uma das áreas mais movimentadas para comércio e convívio.',
        imagens: ['Passarela viva', 'Fachada orgânica', 'Mercado verde'],
      },
      {
        nome: 'Anfiteatro da Seiva',
        descricaoBreve: 'Espaço para cantos, pactos tribais e celebrações de ciclo.',
        descricaoCompleta: 'O anfiteatro é usado para ritos de brotação, reuniões públicas e pactos de união entre linhagens. Ele funciona como um centro de memória oral.',
        imagens: ['Arena cerimonial', 'Círculo central', 'Plateia vegetal'],
      },
      {
        nome: 'Muralha das Raízes',
        descricaoBreve: 'Defesa natural e simbólica que protege os bairros mais antigos.',
        descricaoCompleta: 'A muralha é formada por raízes guiadas e estruturas vivas. Além de defesa, marca o limite entre o crescimento espontâneo e as áreas ritualizadas da cidade.',
        imagens: ['Raízes erguidas', 'Portão orgânico', 'Vista defensiva'],
      },
    ],
  };

  return mapa[nacao.id] || [
    {
      nome: 'Centro Antigo',
      descricaoBreve: 'Área histórica principal com comércio, culto e encontros públicos.',
      descricaoCompleta: 'O Centro Antigo concentra a memória urbana, os espaços de reunião e as construções mais antigas da nação, funcionando como eixo social do território.',
      imagens: ['Rua principal', 'Praça central', 'Vista aérea'],
    },
    {
      nome: 'Distrito Alto',
      descricaoBreve: 'Região de governo, observação e casas mais elevadas.',
      descricaoCompleta: 'O Distrito Alto reúne observatórios, sedes administrativas e residências de linhagens influentes, além de mirantes para o resto do território.',
      imagens: ['Mirante', 'Sede local', 'Residências altas'],
    },
    {
      nome: 'Jardins Comuns',
      descricaoBreve: 'Espaço coletivo de cultivo, descanso e pequenas festas.',
      descricaoCompleta: 'Os Jardins Comuns servem como área de convivência e lazer, mas também sustentam parte da produção alimentar e das atividades artesanais da nação.',
      imagens: ['Jardim comunitário', 'Fonte', 'Área de descanso'],
    },
    {
      nome: 'Passo das Fronteiras',
      descricaoBreve: 'Faixa de travessia e vigilância entre a cidade e o exterior.',
      descricaoCompleta: 'O Passo das Fronteiras funciona como corredor de comércio, proteção e controle. É uma zona de contato constante com viajantes e emissários.',
      imagens: ['Portão externo', 'Ponto de guarda', 'Estrada de saída'],
    },
  ];
}

type AbaAtiva = 'sociedade' | 'teologia' | 'etnias';

export default function NacaoPage() {
  const { modoMestre } = useMestre();
  const params = useParams();
  const router = useRouter();
  const planoId = params.planoId as string;
  const nacaoId = params.nacaoId as string;

  const [nacoes, setNacoes] = useState<Nacao[]>(nacoesIniciais);
  const [nacao, setNacao] = useState<Nacao | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('sociedade');
  const [editando, setEditando] = useState(false);

  const [fNome, setFNome] = useState('');
  const [fDescricaoCurta, setFDescricaoCurta] = useState('');
  const [fLema, setFLema] = useState('');
  const [fClima, setFClima] = useState('');
  const [fCardeal, setFCardeal] = useState('');
  const [fEtnias, setFEtnias] = useState('');
  const [fLore, setFLore] = useState('');
  const [indiceCarrossel, setIndiceCarrossel] = useState(0);
  const [etniaSelecionada, setEtniaSelecionada] = useState<Etnia | null>(null);
  const [lugarSelecionado, setLugarSelecionado] = useState<Lugar | null>(null);
  const [indiceLugarCarrossel, setIndiceLugarCarrossel] = useState(0);
  const [showAddEtnia, setShowAddEtnia] = useState(false);
  const [showAddLugar, setShowAddLugar] = useState(false);
  const [showAddNpc, setShowAddNpc] = useState(false);
  const [lugaresList, setLugaresList] = useState<Lugar[]>([]);
  const [etniasList, setEtniasList] = useState<Etnia[]>([]);
  const [npcsList, setNpcsList] = useState<Array<{ nome: string; funcao: string }>>([]);

  // form states for mock creation
  const [newLugarNome, setNewLugarNome] = useState('');
  const [newLugarDescBreve, setNewLugarDescBreve] = useState('');
  const [newLugarDescCompleta, setNewLugarDescCompleta] = useState('');

  const [newEtniaNome, setNewEtniaNome] = useState('');
  const [newEtniaDesc, setNewEtniaDesc] = useState('');

  const [newNpcNome, setNewNpcNome] = useState('');
  const [newNpcFuncao, setNewNpcFuncao] = useState('');

  const slidesCarrossel = [
    'Mapa conceitual',
    'Retrato da nação',
    'Arquitetura local',
    'Símbolo sagrado'
  ];

  useEffect(() => {
    const localNacoes = localStorage.getItem('anthurium_nacoes');
    if (localNacoes) setNacoes(JSON.parse(localNacoes));
  }, []);

  useEffect(() => {
    const encontrada = nacoes.find(n => n.id === nacaoId && n.planoId === planoId);
    if (encontrada) {
      setNacao(encontrada);
    } else {
      router.push(`/universo/atlas/${planoId}`);
    }
  }, [nacaoId, planoId, nacoes, router]);

  // load dynamic lists for current nação
  useEffect(() => {
    if (!nacao) return;
    try {
      const l = listLugares(nacao.id) || [];
      setLugaresList(l as Lugar[]);
      const e = listEtnias(nacao.id) || [];
      setEtniasList(e as Etnia[]);
      const np = listNpcs(nacao.id) || [];
      setNpcsList(np as Array<{ nome: string; funcao: string }>);
    } catch (err) {
      console.warn('Erro carregando dados mock', err);
    }
  }, [nacao]);

  const salvarNacao = () => {
    if (!nacao) return;
    
    let nLista = [...nacoes];
    const dNacao: Nacao = {
      id: nacao.id,
      planoId,
      nome: fNome,
      descricaoCurta: fDescricaoCurta,
      lema: fLema,
      climaEmocional: fClima,
      cardeal: fCardeal,
      etnias: fEtnias,
      lore: fLore
    };
    nLista = nLista.map(n => n.id === nacao.id ? dNacao : n);
    setNacoes(nLista);
    setNacao(dNacao);
    localStorage.setItem('anthurium_nacoes', JSON.stringify(nLista));
    setEditando(false);
  };

  const ativarEdicao = () => {
    if (!nacao) return;
    setFNome(nacao.nome);
    setFDescricaoCurta(nacao.descricaoCurta || '');
    setFLema(nacao.lema);
    setFClima(nacao.climaEmocional);
    setFCardeal(nacao.cardeal);
    setFEtnias(nacao.etnias);
    setFLore(nacao.lore);
    setEditando(true);
  };

  if (!nacao) {
    return <div className="flex-1 flex items-center justify-center text-zinc-500">Carregando...</div>;
  }

  const abas = [
    { id: 'sociedade', label: 'Sociedade & Geografia', icon: '🏛️' },
    { id: 'teologia', label: 'A Teologia Viva', icon: '✨' },
    { id: 'etnias', label: 'Etnias Nativas', icon: '👥' }
  ] as const;

  const demografia = obterDemografia(nacao);
  const npcsPrincipais = obterNpcsPrincipais(nacao);
  const teologia = obterTeologia(nacao);
  const etniasPrincipais = obterEtniasPrincipais(nacao);
  const lugaresSociedade = obterLugaresSociedade(nacao);
  const lugaresToShow = lugaresList.length ? lugaresList : lugaresSociedade;
  const etniasToShow = etniasList.length ? etniasList : etniasPrincipais;
  const npcsToShow = npcsList.length ? npcsList : npcsPrincipais;

  const renderConteudo = () => {
    switch (abaAtiva) {
      case 'sociedade':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-light text-white">Sociedade & Geografia</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {nacao.descricaoCurta || resumirLore(nacao)}
            </p>
            <div className="flex items-center justify-between">
              <div />
              {modoMestre && (
                <div className="mb-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLugar(s => !s)}
                    className="px-3 py-1 text-xs rounded border border-[#22242b] text-zinc-300 hover:bg-[#111216]"
                  >
                    {showAddLugar ? 'Fechar' : 'Adicionar Lugar'}
                  </button>
                </div>
              )}
            </div>

            {showAddLugar && modoMestre && (
              <div className="mb-3 p-3 border border-[#1b1c22] rounded bg-[#0f1114]">
                <input value={newLugarNome} onChange={e => setNewLugarNome(e.target.value)} placeholder="Nome do Lugar" className="w-full mb-2 p-2 bg-[#111216] border border-[#22242b] rounded text-sm text-white" />
                <input value={newLugarDescBreve} onChange={e => setNewLugarDescBreve(e.target.value)} placeholder="Descrição breve" className="w-full mb-2 p-2 bg-[#111216] border border-[#22242b] rounded text-sm text-white" />
                <textarea value={newLugarDescCompleta} onChange={e => setNewLugarDescCompleta(e.target.value)} placeholder="Descrição completa" rows={3} className="w-full p-2 bg-[#111216] border border-[#22242b] rounded text-sm text-white" />
                <div className="mt-2 text-right">
                  <button
                    onClick={() => {
                      if (!nacao) return;
                      const novo = addLugar(nacao.id, { nome: newLugarNome, descricaoBreve: newLugarDescBreve, descricaoCompleta: newLugarDescCompleta, imagens: [] });
                      setLugaresList(prev => [...prev, (novo as any)]);
                      setNewLugarNome(''); setNewLugarDescBreve(''); setNewLugarDescCompleta('');
                      setShowAddLugar(false);
                    }}
                    className="px-3 py-1 text-xs rounded bg-[#c5a059] text-black"
                  >
                    Criar (mock)
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              {lugaresToShow.map(lugar => (
                <PlaceCard key={(lugar as any).id ?? lugar.nome} lugar={lugar as any} onOpen={(l: any) => { setLugarSelecionado(l); setIndiceLugarCarrossel(0); }} modoMestre={modoMestre} />
              ))}
            </div>
          </div>
        );
      case 'teologia':
        return (
          <div className="space-y-4">
            <TheologyCard teologia={teologia} demografia={demografia} modoMestre={modoMestre} />
          </div>
        );
      case 'etnias':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-light text-white">Etnias Nativas</h3>
              {modoMestre && (
                <button type="button" onClick={() => setShowAddEtnia(s => !s)} className="px-3 py-1 text-xs rounded border border-[#22242b] text-zinc-300 hover:bg-[#111216]">{showAddEtnia ? 'Fechar' : 'Adicionar Etnia'}</button>
              )}
            </div>

            {showAddEtnia && modoMestre && (
              <div className="p-3 border border-[#1b1c22] rounded bg-[#0f1114] mb-3">
                <input value={newEtniaNome} onChange={e => setNewEtniaNome(e.target.value)} placeholder="Nome da Etnia" className="w-full mb-2 p-2 bg-[#111216] border border-[#22242b] rounded text-sm text-white" />
                <textarea value={newEtniaDesc} onChange={e => setNewEtniaDesc(e.target.value)} placeholder="Descrição" rows={3} className="w-full p-2 bg-[#111216] border border-[#22242b] rounded text-sm text-white" />
                <div className="mt-2 text-right"><button onClick={() => {
                  if (!nacao) return;
                  const novo = addEtnia(nacao.id, { nome: newEtniaNome, descricao: newEtniaDesc, afinidades: [] });
                  setEtniasList(prev => [...prev, (novo as any)]);
                  setNewEtniaNome(''); setNewEtniaDesc(''); setShowAddEtnia(false);
                }} className="px-3 py-1 text-xs rounded bg-[#c5a059] text-black">Criar (mock)</button></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {etniasToShow.map(etnia => (
                <EthniaCard key={(etnia as any).id ?? etnia.nome} etnia={etnia as any} onOpen={(e) => setEtniaSelecionada(e)} modoMestre={modoMestre} />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full">
      {/* Sidebar Esquerdo com Abas */}
      <div className="w-full lg:w-80 bg-[#0b0c0f]/40 border-r border-[#15161a] p-8 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/universo/atlas/${planoId}`}
            className="flex items-center gap-2 text-xs uppercase text-zinc-500 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>

        {/* Cabeçalho da Nação */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-light text-white tracking-wide">{nacao.nome}</h2>
              <p className="text-xs italic text-zinc-500 mt-1">"{nacao.lema}"</p>
              <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                {nacao.descricaoCurta || resumirLore(nacao)}
              </p>
            </div>
            {modoMestre && !editando && (
              <button
                onClick={ativarEdicao}
                className="p-2 border border-[#22242b] rounded text-zinc-400 hover:text-[#c5a059] transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4 border-t border-[#1b1c22] pt-6 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase mb-3">Dados Demográficos</p>
            <div className="space-y-4 text-xs text-zinc-400">
              <div>
                <span className="text-zinc-600 uppercase block mb-1">Quantidade de Habitantes</span>
                <p className="text-zinc-200">{demografia.habitantes}</p>
              </div>
              <div>
                <span className="text-zinc-600 uppercase block mb-1">Tamanho do País</span>
                <p className="text-zinc-200">{demografia.territorio}</p>
              </div>
              <div>
                <span className="text-zinc-600 uppercase block mb-1">Elemento Mágico</span>
                <p className="text-zinc-200">{demografia.elementoMagico}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="space-y-2">
          {abas.map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`w-full text-left px-4 py-3 rounded text-xs uppercase tracking-wider transition-all ${
                abaAtiva === aba.id
                  ? 'bg-[#c5a059]/10 border border-[#c5a059] text-[#c5a059]'
                  : 'border border-[#1b1c22] text-zinc-400 hover:border-[#22242b]'
              }`}
            >
              <span className="mr-2">{aba.icon}</span>
              {aba.label}
            </button>
          ))}
        </div>
      </div>

      <EthniaModal etnia={etniaSelecionada} abrir={!!etniaSelecionada} onClose={() => setEtniaSelecionada(null)} modoMestre={modoMestre} />

      <PlaceModal
        lugar={lugarSelecionado}
        abrir={!!lugarSelecionado}
        onClose={() => setLugarSelecionado(null)}
        modoMestre={modoMestre}
        onSave={(updated) => {
          if (!nacao) return;
          // persist via mock adapter
          updateLugar(nacao.id, updated as any);
          setLugaresList(prev => prev.map(l => ((l as any).id === (updated as any).id ? (updated as any) : l)));
          setLugarSelecionado(updated as any);
        }}
      />

      {/* Conteúdo Principal */}
      {!editando ? (
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <div className="border border-[#1b1c22] rounded-lg p-6 bg-[#0a0b0d]">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase mb-2">Visão Geral</p>
                    <h3 className="text-lg font-light text-white">Resumo da Nação</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase">Clima</p>
                    <p className="text-xs text-zinc-400">{nacao.climaEmocional}</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{resumirLore(nacao)}</p>
              </div>

              <div className="max-w-3xl">{renderConteudo()}</div>
            </div>

            <div className="space-y-4">
              <div className="border border-[#1b1c22] rounded-lg p-4 bg-[#0a0b0d]">
                <p className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase mb-3">Carrossel</p>
                <div className="aspect-4/5 rounded border border-dashed border-[#2a2d34] bg-[#0d0e12] flex items-center justify-center relative overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIndiceCarrossel(indice => (indice - 1 + slidesCarrossel.length) % slidesCarrossel.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#2a2d34] bg-black/40 text-zinc-300 hover:text-white hover:border-[#c5a059] flex items-center justify-center"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="text-center px-4 max-w-55">
                    <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                    <p className="text-xs uppercase tracking-[0.3em] text-[#c5a059] mb-2">
                      {slidesCarrossel[indiceCarrossel]}
                    </p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Área reservada para imagens, mapas, retratos ou conceitos visuais da nação.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIndiceCarrossel(indice => (indice + 1) % slidesCarrossel.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#2a2d34] bg-black/40 text-zinc-300 hover:text-white hover:border-[#c5a059] flex items-center justify-center"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {slidesCarrossel.map((slide, index) => (
                    <button
                      key={slide}
                      type="button"
                      onClick={() => setIndiceCarrossel(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === indiceCarrossel ? 'w-6 bg-[#c5a059]' : 'w-2 bg-[#2a2d34] hover:bg-[#555962]'
                      }`}
                      aria-label={`Ir para ${slide}`}
                    />
                  ))}
                </div>
              </div>

              <div className="border border-[#1b1c22] rounded-lg p-4 bg-[#0a0b0d]">
                <p className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase mb-3">NPCs Principais</p>
                  {modoMestre && (
                    <div className="flex justify-end mb-2">
                      <button type="button" onClick={() => setShowAddNpc(s => !s)} className="px-2 py-1 text-xs rounded border border-[#22242b] text-zinc-300 hover:bg-[#111216]">{showAddNpc ? 'Fechar' : 'Adicionar NPC'}</button>
                    </div>
                  )}
                  {showAddNpc && modoMestre && (
                    <div className="p-2 mb-2 border border-[#1b1c22] rounded bg-[#0f1114]">
                      <input value={newNpcNome} onChange={e => setNewNpcNome(e.target.value)} placeholder="Nome NPC" className="w-full mb-1 p-2 bg-[#111216] border border-[#22242b] rounded text-sm text-white" />
                      <input value={newNpcFuncao} onChange={e => setNewNpcFuncao(e.target.value)} placeholder="Função" className="w-full mb-1 p-2 bg-[#111216] border border-[#22242b] rounded text-sm text-white" />
                      <div className="text-right"><button onClick={() => {
                        if (!nacao) return;
                        const novo = addNpc(nacao.id, { nome: newNpcNome, funcao: newNpcFuncao });
                        setNpcsList(prev => [...prev, (novo as any)]);
                        setNewNpcNome(''); setNewNpcFuncao(''); setShowAddNpc(false);
                      }} className="px-3 py-1 text-xs rounded bg-[#c5a059] text-black">Criar (mock)</button></div>
                    </div>
                  )}
                <div className="grid grid-cols-2 gap-3">
                  {npcsToShow.map(npc => (
                    <NpcCard key={(npc as any).id ?? npc.nome} npc={npc as any} modoMestre={modoMestre} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl space-y-6">
            <h3 className="text-lg font-light text-white">Editar Nação</h3>
            <div>
              <label className="block text-xs uppercase text-zinc-400 mb-2">Descrição Breve</label>
              <textarea
                rows={3}
                value={fDescricaoCurta}
                onChange={e => setFDescricaoCurta(e.target.value)}
                className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059] resize-none"
                placeholder="Resumo curto exibido na seleção e no cabeçalho da nação"
              />
            </div>
            <input
              type="text"
              value={fNome}
              onChange={e => setFNome(e.target.value)}
              className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              placeholder="Nome"
            />
            <input
              type="text"
              value={fLema}
              onChange={e => setFLema(e.target.value)}
              className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              placeholder="Lema"
            />
            <input
              type="text"
              value={fClima}
              onChange={e => setFClima(e.target.value)}
              className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              placeholder="Clima Emocional"
            />
            <input
              type="text"
              value={fCardeal}
              onChange={e => setFCardeal(e.target.value)}
              className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              placeholder="Cardeal"
            />
            <input
              type="text"
              value={fEtnias}
              onChange={e => setFEtnias(e.target.value)}
              className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              placeholder="Etnias"
            />
            <textarea
              rows={8}
              value={fLore}
              onChange={e => setFLore(e.target.value)}
              className="w-full bg-[#111216] border border-[#22242b] rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059] resize-none"
              placeholder="Lore..."
            />
            <div className="flex gap-2 justify-end pt-4">
              <button
                onClick={() => setEditando(false)}
                className="px-6 py-2 border border-[#22242b] rounded text-xs text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={salvarNacao}
                className="px-6 py-2 bg-[#c5a059] text-black font-semibold rounded text-xs hover:bg-amber-600"
              >
                Gravar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}