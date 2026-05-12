import { useState } from 'react';

export type Stage = 'originacao' | 'analise' | 'diligencia' | 'comite' | 'estruturacao' | 'concluido';

interface Criterion {
  id: string;
  text: string;
  owner: 'bloxs' | 'originador';
}

const STAGE_CRITERIA: Partial<Record<Stage, Criterion[]>> = {
  originacao: [
    { id: 'o1', text: 'DRE e Balanço dos últimos 2 exercícios enviados',  owner: 'originador' },
    { id: 'o2', text: 'Garantia com lastro documental anexado',            owner: 'originador' },
    { id: 'o3', text: 'CNPJ sem pendências ativas (Receita Federal)',      owner: 'bloxs'      },
  ],
  analise: [
    { id: 'a1', text: 'Nota de crédito preliminar emitida', owner: 'bloxs' },
    { id: 'a2', text: 'Checklist de PLD/FT completo',        owner: 'bloxs' },
  ],
  diligencia: [
    { id: 'd1', text: 'Laudo de garantia revisado e aprovado',   owner: 'bloxs'      },
    { id: 'd2', text: 'Declaração de beneficiário final assinada', owner: 'originador' },
  ],
  comite: [
    { id: 'c1', text: 'Ata de aprovação do comitê de crédito', owner: 'bloxs'      },
    { id: 'c2', text: 'Contrato de mandato assinado',           owner: 'originador' },
  ],
  estruturacao: [
    { id: 'e1', text: 'Escritura/CCB minutada e aprovada pelo jurídico', owner: 'bloxs'      },
    { id: 'e2', text: 'Assinatura eletrônica de todas as partes',         owner: 'originador' },
  ],
};

interface Pendency {
  id: string;
  text: string;
  prazo: string;
  owner: 'bloxs' | 'originador';
}

const STAGE_PENDENCIES: Partial<Record<Stage, Pendency[]>> = {
  originacao: [
    { id: 'p1', text: 'Enviar DRE e Balanço dos últimos 2 exercícios fiscais',    prazo: '08/05/2026', owner: 'originador' },
    { id: 'p2', text: 'Pendência no CNPJ em verificação pela Receita Federal',    prazo: '—',          owner: 'bloxs'      },
  ],
  analise: [
    { id: 'p3', text: 'Laudo de avaliação de garantia vencido — nova versão necessária', prazo: '30/04/2026', owner: 'originador' },
  ],
  diligencia: [
    { id: 'p4', text: 'Declaração de beneficiário final pendente de assinatura pelo controlador', prazo: '05/05/2026', owner: 'originador' },
    { id: 'p5', text: 'CND federal aguardando emissão pela Receita Federal',                      prazo: '—',          owner: 'bloxs'      },
  ],
  comite: [
    { id: 'p6', text: 'Carta de crédito do emissor pendente de envio ao estruturador', prazo: '10/05/2026', owner: 'originador' },
  ],
  estruturacao: [
    { id: 'p7', text: 'Revisão final da escritura pelo assessor jurídico do emissor', prazo: '15/05/2026', owner: 'originador' },
  ],
};

// ─── SLA ──────────────────────────────────────────────────────────────────────

const STAGE_AVG_DAYS: Partial<Record<Stage, number>> = {
  originacao: 8, analise: 15, diligencia: 20, comite: 10, estruturacao: 30,
};

function parseBR(s: string): Date {
  const [d, m, y] = s.split('/').map(Number);
  return new Date(y, m - 1, d);
}

function daysInStage(deal: Deal): number {
  const from  = parseBR(deal.lastUpdate);
  const today = new Date(2026, 3, 28);
  return Math.max(0, Math.round((today.getTime() - from.getTime()) / 86400000));
}

// ─── SCORE DE QUALIDADE (6.4) ─────────────────────────────────────────────────

interface ScoreItem {
  label: string;
  score: number;
  max: number;
  note: string;
}

interface ScoreBreakdown {
  total: number;
  grade: 'A' | 'B' | 'C' | 'D';
  items: ScoreItem[];
}

const STAGE_SCORE: Record<string, number> = {
  originacao: 5, analise: 10, diligencia: 15, comite: 20, estruturacao: 25, concluido: 25,
};
const STAGE_SCORE_NOTE: Record<string, string> = {
  originacao: 'Início do pipeline', analise: 'Análise de crédito', diligencia: 'Due diligence',
  comite: 'Aguardando comitê', estruturacao: 'Estruturação final', concluido: 'Emitida',
};
const INSTR_SCORE: Record<string, number> = {
  CRI: 20, CRA: 20, FIDC: 18, Debênture: 16, CR: 14, 'Nota Comercial': 12, 'A definir': 8,
};
const INSTR_NOTE: Record<string, string> = {
  CRI: 'Regulado — isenção IR PF', CRA: 'Regulado — isenção IR PF',
  FIDC: 'Veículo securitizado', Debênture: 'Debênture incentivada',
  CR: 'Certificado de Recebíveis', 'Nota Comercial': 'Instrumento de curto prazo',
  'A definir': 'Instrumento não definido',
};

function calcScore(deal: Deal): ScoreBreakdown {
  const items: ScoreItem[] = [];

  // SLA / Tempestividade — 25 pts
  const days  = daysInStage(deal);
  const avg   = STAGE_AVG_DAYS[deal.stage] ?? 10;
  const ratio = deal.stage === 'concluido' ? 0 : days / avg;
  const slaScore = ratio <= 1 ? 25 : ratio <= 1.5 ? 15 : 5;
  items.push({
    label: 'SLA / Tempestividade', score: slaScore, max: 25,
    note: ratio <= 1 ? 'Dentro do prazo médio' : ratio <= 1.5 ? 'Levemente acima da média' : 'SLA excedido',
  });

  // Progressão no pipeline — 25 pts
  items.push({
    label: 'Estágio no Pipeline', score: STAGE_SCORE[deal.stage] ?? 5, max: 25,
    note: STAGE_SCORE_NOTE[deal.stage] ?? '',
  });

  // Instrumento — 20 pts
  items.push({
    label: 'Instrumento', score: INSTR_SCORE[deal.instrument] ?? 8, max: 20,
    note: INSTR_NOTE[deal.instrument] ?? 'Instrumento não mapeado',
  });

  // Volume — 15 pts
  const volScore = deal.value >= 80 ? 15 : deal.value >= 50 ? 12 : deal.value >= 30 ? 8 : 5;
  items.push({
    label: 'Volume da Operação', score: volScore, max: 15,
    note: `R$ ${deal.value}M — ${deal.value >= 80 ? 'Grande porte' : deal.value >= 50 ? 'Médio porte' : 'Pequeno porte'}`,
  });

  // Completude dos dados — 15 pts
  const dataScore = (deal.location ? 5 : 0)
    + (deal.description.length > 50 ? 5 : 0)
    + (deal.timeline.length >= 3 ? 5 : 0);
  items.push({
    label: 'Completude dos Dados', score: dataScore, max: 15,
    note: dataScore >= 12 ? 'Documentação completa' : dataScore >= 8 ? 'Dados parcialmente preenchidos' : 'Documentação básica',
  });

  const total = items.reduce((s, i) => s + i.score, 0);
  const grade = total >= 80 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : 'D';
  return { total, grade, items };
}

const GRADE_STYLE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  A: { bg: '#f0fdf4', text: '#15803d', border: '#86efac', label: 'Excelente' },
  B: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', label: 'Bom'       },
  C: { bg: '#fffbeb', text: '#d97706', border: '#fde68a', label: 'Regular'   },
  D: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Atenção'   },
};

// ─── HUBSPOT ──────────────────────────────────────────────────────────────────

const HS_STAGES = [
  'Appointment Scheduled',
  'Qualified to Buy',
  'Presentation Scheduled',
  'Decision Maker Bought-In',
  'Contract Sent',
  'Closed Won',
];

const HS_STAGE_INDEX: Record<string, number> = {
  originacao: 0, analise: 1, diligencia: 2, comite: 3, estruturacao: 4, concluido: 5,
};

const HS_CLOSE_DATE: Record<string, string> = {
  originacao: '30/10/2026', analise: '30/09/2026', diligencia: '31/08/2026',
  comite: '30/07/2026', estruturacao: '30/06/2026', concluido: '15/03/2026',
};

function hsDealId(deal: Deal) {
  return 40000 + parseInt(deal.id) * 1237;
}

// ─── DEAL SPREADS ─────────────────────────────────────────────────────────────

const DEAL_SPREADS: Record<string, number> = {
  'CRI': 3.5, 'CRA': 4.0, 'FIDC': 5.0, 'Debênture': 2.5,
  'CR': 3.0, 'Nota Comercial': 2.0, 'A definir': 3.0,
};
const SIM_BASE_RATES: Record<string, number> = { CDI: 10.75, IPCA: 5.0, 'Poupança': 7.5 };
const IR_EXEMPT_INSTRUMENTS = new Set(['CRI', 'CRA']);
export type Instrument = 'CRI' | 'CRA' | 'CR' | 'FIDC' | 'Debênture' | 'Nota Comercial' | 'A definir';

export interface DealEvent {
  date: string;
  event: string;
  author: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  location: string;
  instrument: Instrument;
  sector: string;
  stage: Stage;
  responsible: string;
  submittedAt: string;
  lastUpdate: string;
  description: string;
  timeline: DealEvent[];
}

const COLUMNS: { id: Stage; label: string; headerBg: string }[] = [
  { id: 'originacao',   label: 'Originação',   headerBg: '#475569' },
  { id: 'analise',      label: 'Análise',       headerBg: '#1a6edb' },
  { id: 'diligencia',   label: 'Diligência',    headerBg: '#d97706' },
  { id: 'comite',       label: 'Comitê',        headerBg: '#374151' },
  { id: 'estruturacao', label: 'Estruturação',  headerBg: '#1d4ed8' },
  { id: 'concluido',    label: 'Concluído',     headerBg: '#059669' },
];

const INSTRUMENT_STYLE: Record<string, { bg: string; text: string }> = {
  'CRI':           { bg: '#dbeafe', text: '#1d4ed8' },
  'CRA':           { bg: '#d1fae5', text: '#065f46' },
  'CR':            { bg: '#e0f2fe', text: '#0369a1' },
  'FIDC':          { bg: '#ede9fe', text: '#6d28d9' },
  'Debênture':     { bg: '#fef3c7', text: '#d97706' },
  'Nota Comercial':{ bg: '#f3f4f6', text: '#374151' },
  'A definir':     { bg: '#f1f5f9', text: '#64748b' },
};

export const INITIAL_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Imobiliário PE',
    value: 30,
    location: 'Pernambuco',
    instrument: 'CRI',
    sector: 'Imobiliário',
    stage: 'originacao',
    responsible: 'Rafael Andrade',
    submittedAt: '10/04/2026',
    lastUpdate: '18/04/2026',
    description: 'CRI para financiamento de empreendimento residencial no Recife. Fase preliminar com análise de viabilidade em andamento.',
    timeline: [
      { date: '14/04/2026', event: 'Recebido pela equipe Bloxs', author: 'Bloxs Estruturação' },
      { date: '12/04/2026', event: 'Documentação inicial enviada', author: 'Rafael Andrade' },
      { date: '10/04/2026', event: 'Operação originada no IBaaS', author: 'Rafael Andrade' },
    ],
  },
  {
    id: '2',
    title: 'Serviços SP',
    value: 15,
    location: 'São Paulo',
    instrument: 'A definir',
    sector: 'Serviços',
    stage: 'originacao',
    responsible: 'Rafael Andrade',
    submittedAt: '16/04/2026',
    lastUpdate: '16/04/2026',
    description: 'Operação em fase de definição do instrumento mais adequado. Empresa de serviços com histórico de crédito sólido.',
    timeline: [
      { date: '16/04/2026', event: 'Operação originada no IBaaS', author: 'Rafael Andrade' },
    ],
  },
  {
    id: '3',
    title: 'Logística RJ',
    value: 85,
    location: 'Rio de Janeiro',
    instrument: 'CR',
    sector: 'Infraestrutura',
    stage: 'analise',
    responsible: 'Rafael Andrade',
    submittedAt: '01/04/2026',
    lastUpdate: '20/04/2026',
    description: 'CR para expansão de hub logístico no Porto de Itaguaí. Análise de risco e garantias em andamento.',
    timeline: [
      { date: '20/04/2026', event: 'Parecer preliminar positivo emitido', author: 'Bloxs Análise' },
      { date: '10/04/2026', event: 'Documentação de garantias recebida', author: 'Bloxs Análise' },
      { date: '03/04/2026', event: 'Análise de crédito iniciada', author: 'Bloxs Análise' },
      { date: '01/04/2026', event: 'Operação originada no IBaaS', author: 'Rafael Andrade' },
    ],
  },
  {
    id: '4',
    title: 'Telecom Norte',
    value: 50,
    location: 'Pará',
    instrument: 'CR',
    sector: 'Telecomunicações',
    stage: 'analise',
    responsible: 'Rafael Andrade',
    submittedAt: '05/04/2026',
    lastUpdate: '19/04/2026',
    description: 'Certificado de Recebíveis para expansão de infraestrutura de fibra óptica na região Norte do país.',
    timeline: [
      { date: '19/04/2026', event: 'Solicitação de documentação complementar', author: 'Bloxs Análise' },
      { date: '08/04/2026', event: 'Análise de crédito iniciada', author: 'Bloxs Análise' },
      { date: '05/04/2026', event: 'Operação originada no IBaaS', author: 'Rafael Andrade' },
    ],
  },
  {
    id: '5',
    title: 'Solar Norte SP',
    value: 42,
    location: 'São Paulo',
    instrument: 'Debênture',
    sector: 'Energia',
    stage: 'diligencia',
    responsible: 'Rafael Andrade',
    submittedAt: '15/03/2026',
    lastUpdate: '18/04/2026',
    description: 'Debênture incentivada para projeto de usina solar no interior de São Paulo. Due diligence técnica e jurídica em andamento.',
    timeline: [
      { date: '18/04/2026', event: 'Relatório técnico preliminar enviado', author: 'Bloxs Estruturação' },
      { date: '10/04/2026', event: 'Diligência técnica iniciada', author: 'Bloxs Estruturação' },
      { date: '01/04/2026', event: 'Diligência jurídica iniciada', author: 'Bloxs Jurídico' },
      { date: '22/03/2026', event: 'Análise de crédito concluída', author: 'Bloxs Análise' },
      { date: '15/03/2026', event: 'Operação originada no IBaaS', author: 'Rafael Andrade' },
    ],
  },
  {
    id: '6',
    title: 'Agro Mato Grosso',
    value: 75,
    location: 'Mato Grosso',
    instrument: 'CRA',
    sector: 'Agronegócio',
    stage: 'comite',
    responsible: 'Rafael Andrade',
    submittedAt: '01/03/2026',
    lastUpdate: '21/04/2026',
    description: 'CRA para financiamento de safra e expansão de área agricultável. Aprovação pelo comitê de investimentos prevista para esta semana.',
    timeline: [
      { date: '21/04/2026', event: 'Aguardando votação do comitê', author: 'Bloxs Estruturação' },
      { date: '01/04/2026', event: 'Submetido ao comitê de investimentos', author: 'Bloxs Estruturação' },
      { date: '20/03/2026', event: 'Diligência concluída', author: 'Bloxs Jurídico' },
      { date: '10/03/2026', event: 'Análise de crédito concluída', author: 'Bloxs Análise' },
      { date: '01/03/2026', event: 'Operação originada no IBaaS', author: 'Rafael Andrade' },
    ],
  },
  {
    id: '7',
    title: 'Data Center MG',
    value: 110,
    location: 'Minas Gerais',
    instrument: 'FIDC',
    sector: 'Tecnologia',
    stage: 'estruturacao',
    responsible: 'Rafael Andrade',
    submittedAt: '01/02/2026',
    lastUpdate: '20/04/2026',
    description: 'FIDC para financiamento de data center de alta performance em Belo Horizonte. Estruturação jurídica e financeira em fase final.',
    timeline: [
      { date: '20/04/2026', event: 'Minuta de escritura enviada para revisão', author: 'Bloxs Jurídico' },
      { date: '01/04/2026', event: 'Estruturação jurídica iniciada', author: 'Bloxs Jurídico' },
      { date: '15/03/2026', event: 'Aprovado em comitê de investimentos', author: 'Bloxs Estruturação' },
      { date: '01/03/2026', event: 'Diligência concluída', author: 'Bloxs Jurídico' },
      { date: '15/02/2026', event: 'Análise de crédito concluída', author: 'Bloxs Análise' },
      { date: '01/02/2026', event: 'Operação originada no IBaaS', author: 'Rafael Andrade' },
    ],
  },
  {
    id: '8',
    title: 'Agro Cerrado',
    value: 120,
    location: 'Goiás',
    instrument: 'CRA',
    sector: 'Agronegócio',
    stage: 'concluido',
    responsible: 'Rafael Andrade',
    submittedAt: '10/10/2025',
    lastUpdate: '15/03/2026',
    description: 'CRA emitido com sucesso para financiamento de expansão de produção de soja. Operação concluída.',
    timeline: [
      { date: '15/03/2026', event: 'CRA emitido — operação concluída', author: 'Bloxs Estruturação' },
      { date: '15/01/2026', event: 'Estruturação concluída', author: 'Bloxs Estruturação' },
      { date: '10/12/2025', event: 'Aprovado em comitê de investimentos', author: 'Bloxs Estruturação' },
      { date: '20/11/2025', event: 'Diligência concluída', author: 'Bloxs Jurídico' },
      { date: '01/11/2025', event: 'Análise de crédito concluída', author: 'Bloxs Análise' },
      { date: '10/10/2025', event: 'Operação originada no IBaaS', author: 'Rafael Andrade' },
    ],
  },
];

export default function DealFlowPage({ deals: dealsProp }: { deals?: Deal[] }) {
  const deals = dealsProp ?? INITIAL_DEALS;

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [search, setSearch] = useState('');
  const [filterInstrument, setFilterInstrument] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterVolMin, setFilterVolMin] = useState('');
  const [filterVolMax, setFilterVolMax] = useState('');

  const filteredDeals = deals.filter((d: Deal) =>
    d.title.toLowerCase().includes(search.toLowerCase()) &&
    (!filterInstrument || d.instrument === filterInstrument) &&
    (!filterSector || d.sector === filterSector) &&
    (!filterVolMin || d.value >= Number(filterVolMin)) &&
    (!filterVolMax || d.value <= Number(filterVolMax))
  );

  const activeDeals = deals.filter((d: Deal) => d.stage !== 'concluido');
  const pipelineVolume = activeDeals.reduce((sum: number, d: Deal) => sum + d.value, 0);
  const finalStageDeals = deals.filter((d: Deal) => d.stage === 'comite' || d.stage === 'estruturacao');
  const finalStageVolume = finalStageDeals.reduce((sum: number, d: Deal) => sum + d.value, 0);

  const dealsForColumn = (stage: Stage) => filteredDeals.filter((d: Deal) => d.stage === stage);
  const colVolume = (stage: Stage) => deals.filter((d: Deal) => d.stage === stage).reduce((sum: number, d: Deal) => sum + d.value, 0);

  const hasFilters = search || filterInstrument || filterSector || filterVolMin || filterVolMax;

  return (
    <div className="relative">
      {/* HEADER */}
      <div className="mb-6">
        <div className="text-[11px] font-semibold tracking-[0.09em] uppercase text-[#1a6edb] mb-2">
          Pipeline
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-['Playfair_Display'] text-[28px] font-semibold text-[#0b1f3a] tracking-tight mb-1.5">
              Deal Flow
            </h1>
            <p className="text-sm text-[#64748b]">
              Acompanhe em tempo real as fases de cada operação, sincronizado com o CRM.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#64748b] pb-1 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#059669] inline-block animate-pulse"></span>
            CRM sincronizado · 22/04/2026 às 09:41
          </div>
        </div>
        <div className="h-px bg-[#e2e8f0] mt-5"></div>
      </div>

      {/* KPI BAR */}
      <div className="grid grid-cols-4 gap-4 mb-6 max-lg:grid-cols-2">
        {[
          {
            icon: 'layer-group',
            label: 'Operações ativas',
            value: String(activeDeals.length),
            sub: `${deals.length} total incluindo concluídas`,
          },
          {
            icon: 'chart-pie',
            label: 'Volume em pipeline',
            value: `R$ ${pipelineVolume}M`,
            sub: 'operações em andamento',
          },
          {
            icon: 'hourglass-half',
            label: 'Em fase final',
            value: String(finalStageDeals.length),
            sub: 'Comitê + Estruturação',
          },
          {
            icon: 'coins',
            label: 'Volume fase final',
            value: `R$ ${finalStageVolume}M`,
            sub: 'prestes a fechar',
          },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-[10px] px-5 py-4 flex flex-col gap-1.5">
            <div className="text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#94a3b8] flex items-center gap-1.5">
              <i className={`fas fa-${kpi.icon} text-[10px]`}></i>
              {kpi.label}
            </div>
            <div className="font-['Playfair_Display'] text-[22px] font-semibold text-[#0b1f3a] leading-none">
              {kpi.value}
            </div>
            <div className="text-[11px] text-[#64748b]">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-[#e2e8f0] rounded-[10px] px-5 py-3.5 mb-5 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Buscar operação..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-[7px] w-[220px] text-[13px] border border-[#e2e8f0] rounded-[7px] outline-none focus:border-[#1a6edb] transition-all"
          />
        </div>

        <select
          value={filterInstrument}
          onChange={e => setFilterInstrument(e.target.value)}
          className="py-[7px] px-3 text-[13px] border border-[#e2e8f0] rounded-[7px] outline-none focus:border-[#1a6edb] text-[#475569] transition-all cursor-pointer"
        >
          <option value="">Todos os instrumentos</option>
          {(['CRI', 'CRA', 'CR', 'FIDC', 'Debênture', 'Nota Comercial', 'A definir'] as Instrument[]).map(i => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>

        <select
          value={filterSector}
          onChange={e => setFilterSector(e.target.value)}
          className="py-[7px] px-3 text-[13px] border border-[#e2e8f0] rounded-[7px] outline-none focus:border-[#1a6edb] text-[#475569] transition-all cursor-pointer"
        >
          <option value="">Todos os setores</option>
          {['Agronegócio', 'Imobiliário', 'Infraestrutura', 'Tecnologia', 'Energia', 'Serviços', 'Telecomunicações'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex items-center gap-1.5">
          <span className="text-[11.5px] text-[#94a3b8] whitespace-nowrap">Volume:</span>
          <input
            type="number"
            placeholder="Mín (M)"
            value={filterVolMin}
            onChange={e => setFilterVolMin(e.target.value)}
            className="w-[78px] py-[7px] px-2.5 text-[12.5px] border border-[#e2e8f0] rounded-[7px] outline-none focus:border-[#1a6edb] text-[#475569] transition-all"
          />
          <span className="text-[#94a3b8] text-[11px]">–</span>
          <input
            type="number"
            placeholder="Máx (M)"
            value={filterVolMax}
            onChange={e => setFilterVolMax(e.target.value)}
            className="w-[78px] py-[7px] px-2.5 text-[12.5px] border border-[#e2e8f0] rounded-[7px] outline-none focus:border-[#1a6edb] text-[#475569] transition-all"
          />
        </div>

        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setFilterInstrument(''); setFilterSector(''); setFilterVolMin(''); setFilterVolMax(''); }}
            className="flex items-center gap-1.5 text-[12px] text-[#64748b] hover:text-[#dc2626] transition-colors"
          >
            <i className="fas fa-times-circle text-[12px]"></i>
            Limpar filtros
          </button>
        )}

        <div className="ml-auto text-[12px] text-[#94a3b8]">
          {filteredDeals.length} operaç{filteredDeals.length !== 1 ? 'ões' : 'ão'} exibida{filteredDeals.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="overflow-x-auto pb-6 -mx-10 px-10">
        <div className="flex gap-3.5" style={{ minWidth: '1340px' }}>
          {COLUMNS.map(col => {
            const cards = dealsForColumn(col.id);
            const volume = colVolume(col.id);
            return (
              <div key={col.id} className="flex-1 min-w-0 flex flex-col">
                {/* Column header */}
                <div
                  className="rounded-t-[8px] px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: col.headerBg }}
                >
                  <span className="text-white text-[12px] font-semibold tracking-[0.03em]">
                    {col.label}
                  </span>
                  <span className="bg-white/25 text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {deals.filter((d: Deal) => d.stage === col.id).length}
                  </span>
                </div>

                {/* Column volume subtitle */}
                <div className="bg-white border-x border-[#e2e8f0] px-4 py-2 text-[11px] text-[#94a3b8] font-medium border-b border-[#e2e8f0]">
                  R$ {volume}M no pipeline
                </div>

                {/* Cards */}
                <div className="bg-[#f7f9fc] border-x border-b border-[#e2e8f0] rounded-b-[8px] p-2.5 flex flex-col gap-2.5 flex-1 min-h-[140px]">
                  {cards.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-8">
                      <span className="text-[12px] text-[#cbd5e1] text-center">
                        {hasFilters ? 'Nenhum resultado' : 'Sem operações'}
                      </span>
                    </div>
                  ) : (
                    cards.map(deal => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        onClick={() => setSelectedDeal(deal)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DEAL DETAIL PANEL */}
      {selectedDeal && (
        <DealPanel
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      )}
    </div>
  );
}

function DealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  const style = INSTRUMENT_STYLE[deal.instrument] ?? INSTRUMENT_STYLE['A definir'];
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-[#e2e8f0] rounded-[8px] p-3.5 cursor-pointer hover:border-[#1a6edb] hover:shadow-[0_2px_12px_rgba(26,110,219,0.10)] transition-all group"
    >
      {(() => {
        const sc = calcScore(deal);
        const gs = GRADE_STYLE[sc.grade];
        return (
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span
              className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full leading-5"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              {deal.instrument}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] border"
                style={{ backgroundColor: gs.bg, color: gs.text, borderColor: gs.border }}
                title={`Score ${sc.total}/100 — ${gs.label}`}
              >
                {sc.grade} {sc.total}
              </span>
              <i className="fas fa-chevron-right text-[10px] text-[#d1d5db] group-hover:text-[#1a6edb] transition-colors mt-0.5"></i>
            </div>
          </div>
        );
      })()}
      <div className="text-[13px] font-semibold text-[#0b1f3a] mb-1 leading-snug">
        {deal.title}
      </div>
      <div className="text-[11.5px] text-[#64748b] mb-3">
        R$ {deal.value}M · {deal.location}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10.5px] text-[#94a3b8] bg-[#f1f5f9] px-2 py-0.5 rounded-full">
          {deal.sector}
        </span>
        <span className="text-[10px] text-[#94a3b8] flex-shrink-0">
          {deal.lastUpdate}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <div className="flex items-center gap-1">
          <i className="fas fa-coins text-[9px] text-[#059669]"></i>
          <span className="text-[10px] text-[#059669] font-medium">
            Com. est.: R$ {(deal.value * 15).toLocaleString('pt-BR')}k
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[#fff4f0] border border-[#ffd5c8] rounded-full px-1.5 py-0.5">
          <span className="w-1 h-1 rounded-full bg-[#ff7a59]"></span>
          <span className="text-[9px] font-semibold text-[#ff7a59]">HS</span>
        </div>
      </div>
      {deal.stage !== 'concluido' && (() => {
        const days = daysInStage(deal);
        const avg  = STAGE_AVG_DAYS[deal.stage] ?? 10;
        const ratio = days / avg;
        const color = ratio >= 2 ? '#dc2626' : ratio >= 1.5 ? '#d97706' : '#94a3b8';
        const icon  = ratio >= 2 ? 'fa-exclamation-circle' : ratio >= 1.5 ? 'fa-exclamation-triangle' : 'fa-clock';
        return (
          <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-[#f1f5f9]">
            <i className={`fas ${icon} text-[9px]`} style={{ color }}></i>
            <span className="text-[10px]" style={{ color }}>
              {days}d nesta etapa · Média: {avg}d
            </span>
          </div>
        );
      })()}
    </button>
  );
}

function DealPanel({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const instrStyle = INSTRUMENT_STYLE[deal.instrument] ?? INSTRUMENT_STYLE['A definir'];
  const col = COLUMNS.find(c => c.id === deal.stage);
  const stageLabel = col?.label ?? deal.stage;
  const stageBg = col?.headerBg ?? '#475569';

  const criteria   = STAGE_CRITERIA[deal.stage]   ?? [];
  const pendencies = STAGE_PENDENCIES[deal.stage]  ?? [];

  const [checkedItems,  setCheckedItems]  = useState<string[]>([]);
  const [resolvedIds,   setResolvedIds]   = useState<string[]>([]);
  const [showSim,       setShowSim]       = useState(false);
  const [showHubSpot,   setShowHubSpot]   = useState(false);
  const [hsSyncing,     setHsSyncing]     = useState(false);
  const [sim, setSim] = useState({
    investimento: '1000000',
    prazo: '24',
    ir: 'auto',
    benchmark: 'CDI' as 'CDI' | 'IPCA' | 'Poupança',
  });

  const isExempt   = IR_EXEMPT_INSTRUMENTS.has(deal.instrument);
  const spread     = DEAL_SPREADS[deal.instrument] ?? 3.0;
  const grossRate  = SIM_BASE_RATES[sim.benchmark] + spread;
  const prazoMeses = Math.max(1, Number(sim.prazo) || 24);
  const prazoAnos  = prazoMeses / 12;
  const irRate     = isExempt ? 0
    : sim.ir === 'auto'
      ? (prazoMeses <= 6 ? 22.5 : prazoMeses <= 12 ? 20 : prazoMeses <= 24 ? 17.5 : 15)
      : Number(sim.ir);
  const netRate    = grossRate * (1 - irRate / 100);
  const investRaw  = Number(sim.investimento.replace(/\D/g, '')) || 0;
  const grossVal   = investRaw * Math.pow(1 + grossRate / 100, prazoAnos);
  const netVal     = investRaw + (grossVal - investRaw) * (1 - irRate / 100);
  const benchVal   = investRaw * Math.pow(1 + SIM_BASE_RATES[sim.benchmark] / 100, prazoAnos);
  const spreadPP   = grossRate - SIM_BASE_RATES[sim.benchmark];
  const fmtBRL = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtPct = (v: number) => v.toFixed(2) + '% a.a.';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/25 z-[300]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-[460px] bg-white z-[400] shadow-[-6px_0_40px_rgba(0,0,0,0.10)] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-[#e2e8f0] flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#94a3b8] mb-1.5">
              Detalhes da Operação
            </div>
            <h2 className="font-['Playfair_Display'] text-[22px] font-semibold text-[#0b1f3a] leading-tight">
              {deal.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="mt-1 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-[#f1f5f9] text-[#94a3b8] hover:text-[#0b1f3a] transition-all"
          >
            <i className="fas fa-times text-[14px]"></i>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Stage + instrument */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11.5px] font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: stageBg }}>
              {stageLabel}
            </span>
            <span className="text-[11.5px] font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: instrStyle.bg, color: instrStyle.text }}>
              {deal.instrument}
            </span>
          </div>

          {/* ── 6.4 Score de Qualidade da Operação ───────────────────────── */}
          {(() => {
            const sc = calcScore(deal);
            const gs = GRADE_STYLE[sc.grade];
            return (
              <div
                className="rounded-[10px] border p-4"
                style={{ background: gs.bg, borderColor: gs.border }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-star text-[12px]" style={{ color: gs.text }}></i>
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: gs.text }}>
                      Score de Qualidade
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Playfair_Display'] text-[22px] font-semibold leading-none" style={{ color: gs.text }}>
                      {sc.total}
                    </span>
                    <div className="text-right">
                      <div className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: gs.text }}>
                        /100
                      </div>
                      <div
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5"
                        style={{ backgroundColor: 'white', color: gs.text, borderColor: gs.border }}
                      >
                        {gs.label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="h-1.5 bg-white/60 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${sc.total}%`, backgroundColor: gs.text }}
                  />
                </div>

                {/* Breakdown por critério */}
                <div className="space-y-2">
                  {sc.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10.5px] font-semibold" style={{ color: gs.text }}>
                            {item.label}
                          </span>
                          <span className="text-[10px] font-bold flex-shrink-0 ml-2" style={{ color: gs.text }}>
                            {item.score}/{item.max}
                          </span>
                        </div>
                        <div className="h-1 bg-white/50 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(item.score / item.max) * 100}%`, backgroundColor: gs.text, opacity: 0.7 }}
                          />
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: gs.text, opacity: 0.75 }}>
                          {item.note}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ── 4.2 Checklist de critérios de avanço ─────────────────────── */}
          {criteria.length > 0 && deal.stage !== 'concluido' && (
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8] mb-3 flex items-center gap-1.5">
                <i className="fas fa-tasks text-[10px]"></i>
                Critérios para avançar de etapa
              </div>
              <div className="flex flex-col gap-2.5">
                {criteria.map(c => {
                  const checked = checkedItems.includes(c.id);
                  const isBloxs = c.owner === 'bloxs';
                  return (
                    <div key={c.id} className="flex items-start gap-2.5">
                      {isBloxs ? (
                        <div className={`w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center ${checked ? 'bg-[#1a6edb]' : 'bg-[#e2e8f0]'}`}>
                          {checked
                            ? <i className="fas fa-check text-white text-[7px]"></i>
                            : <i className="fas fa-lock text-[#94a3b8] text-[7px]"></i>
                          }
                        </div>
                      ) : (
                        <button
                          onClick={() => setCheckedItems(prev =>
                            prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]
                          )}
                          className={`w-4 h-4 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${
                            checked ? 'bg-[#059669] border-[#059669]' : 'border-[#d1d5db] hover:border-[#059669]'
                          }`}
                        >
                          {checked && <i className="fas fa-check text-white text-[7px]"></i>}
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className={`text-[12px] leading-relaxed ${checked ? 'line-through text-[#94a3b8]' : 'text-[#475569]'}`}>
                          {c.text}
                        </span>
                        <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          isBloxs ? 'bg-[#eff6ff] text-[#1a6edb]' : 'bg-[#f0fdf4] text-[#059669]'
                        }`}>
                          {isBloxs ? 'Bloxs' : 'Você'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
                <div className="flex justify-between text-[10.5px] text-[#94a3b8] mb-1.5">
                  <span>{checkedItems.length}/{criteria.length} critérios atendidos</span>
                  <span>{Math.round((checkedItems.length / criteria.length) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1a6edb] rounded-full transition-all duration-300"
                    style={{ width: `${(checkedItems.length / criteria.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* ── 4.3 Pendências da Bloxs ───────────────────────────────────── */}
          {pendencies.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8] mb-3 flex items-center gap-1.5">
                <i className="fas fa-exclamation-triangle text-[#d97706] text-[10px]"></i>
                Pendências
              </div>
              <div className="flex flex-col gap-2">
                {pendencies.map(p => {
                  const resolved = resolvedIds.includes(p.id);
                  return (
                    <div key={p.id} className={`flex items-start gap-3 p-3 rounded-[8px] border transition-all ${
                      resolved
                        ? 'border-[#bbf7d0] bg-[#f0fdf4]'
                        : p.owner === 'originador'
                        ? 'border-[#fde68a] bg-[#fffbeb]'
                        : 'border-[#bfdbfe] bg-[#eff6ff]'
                    }`}>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12px] leading-relaxed ${resolved ? 'line-through text-[#94a3b8]' : 'text-[#475569]'}`}>
                          {p.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {p.prazo !== '—' && (
                            <span className="text-[10px] text-[#94a3b8]">
                              <i className="fas fa-calendar text-[9px] mr-1"></i>Prazo: {p.prazo}
                            </span>
                          )}
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                            p.owner === 'bloxs' ? 'bg-[#eff6ff] text-[#1a6edb]' : 'bg-[#fef3c7] text-[#d97706]'
                          }`}>
                            {p.owner === 'bloxs' ? 'Bloxs' : 'Você'}
                          </span>
                        </div>
                      </div>
                      {p.owner === 'originador' && !resolved && (
                        <button
                          onClick={() => setResolvedIds(prev => [...prev, p.id])}
                          className="flex-shrink-0 text-[10.5px] font-semibold text-[#059669] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded-full hover:bg-[#dcfce7] transition-all whitespace-nowrap"
                        >
                          Resolver
                        </button>
                      )}
                      {resolved && <i className="fas fa-check-circle text-[#059669] text-[14px] flex-shrink-0 mt-0.5"></i>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Volume', value: `R$ ${deal.value}M` },
              { label: 'Localização', value: deal.location || '—' },
              { label: 'Setor', value: deal.sector },
              { label: 'Responsável', value: deal.responsible },
              { label: 'Originado em', value: deal.submittedAt },
              { label: 'Última atualização', value: deal.lastUpdate },
            ].map((item, i) => (
              <div key={i} className="bg-[#f7f9fc] rounded-[8px] px-3.5 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8] mb-0.5">
                  {item.label}
                </div>
                <div className="text-[13px] font-semibold text-[#0b1f3a]">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8] mb-2">
              Descrição
            </div>
            <p className="text-[13px] text-[#475569] leading-relaxed">{deal.description}</p>
          </div>

          {/* Timeline */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8] mb-4">
              Histórico de atividades
            </div>
            <div className="relative pl-5">
              <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-[#e2e8f0]"></div>
              <div className="flex flex-col gap-4">
                {deal.timeline.map((ev, i) => (
                  <div key={i} className="relative flex gap-3 items-start">
                    <div
                      className="absolute -left-5 mt-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white flex-shrink-0 z-10"
                      style={{ borderColor: i === 0 ? '#1a6edb' : '#cbd5e1' }}
                    ></div>
                    <div>
                      <div className="text-[12.5px] font-medium text-[#0b1f3a] leading-snug">{ev.event}</div>
                      <div className="text-[11px] text-[#94a3b8] mt-0.5">{ev.date} · {ev.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 6.2 Simulador de Retorno ─────────────────────────────────── */}
          <div className="border-t border-[#e2e8f0] pt-4">
            <button
              onClick={() => setShowSim(v => !v)}
              className="w-full flex items-center justify-between py-1 text-left"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8] flex items-center gap-1.5">
                <i className="fas fa-calculator text-[10px]"></i>
                Simulador de Retorno para Investidor
              </div>
              <i className={`fas fa-chevron-${showSim ? 'up' : 'down'} text-[10px] text-[#94a3b8]`}></i>
            </button>

            {showSim && (
              <div className="mt-4 space-y-4">
                {isExempt && (
                  <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px] px-3 py-2">
                    <i className="fas fa-leaf text-[#059669] text-[11px]"></i>
                    <span className="text-[11.5px] font-semibold text-[#059669]">
                      Isento de IR para Pessoa Física — {deal.instrument} (Lei 12.431)
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8] block mb-1.5">Valor investido</label>
                    <input
                      type="text"
                      value={`R$ ${Number(sim.investimento || 0).toLocaleString('pt-BR')}`}
                      onChange={e => setSim(prev => ({ ...prev, investimento: e.target.value.replace(/\D/g, '') }))}
                      className="w-full px-3 py-2 text-[12.5px] border border-[#e2e8f0] rounded-[7px] outline-none focus:border-[#1a6edb] text-[#0b1f3a] font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8] block mb-1.5">Prazo (meses)</label>
                    <input
                      type="number"
                      value={sim.prazo}
                      min={1} max={360}
                      onChange={e => setSim(prev => ({ ...prev, prazo: e.target.value }))}
                      className="w-full px-3 py-2 text-[12.5px] border border-[#e2e8f0] rounded-[7px] outline-none focus:border-[#1a6edb] text-[#0b1f3a] font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8] block mb-1.5">Alíquota IR</label>
                    <select
                      value={isExempt ? 'exempt' : sim.ir}
                      disabled={isExempt}
                      onChange={e => setSim(prev => ({ ...prev, ir: e.target.value }))}
                      className="w-full px-3 py-2 text-[12.5px] border border-[#e2e8f0] rounded-[7px] outline-none focus:border-[#1a6edb] text-[#0b1f3a] font-medium"
                    >
                      {isExempt ? (
                        <option value="exempt">Isento (0%)</option>
                      ) : (
                        <>
                          <option value="auto">Automático (por prazo)</option>
                          <option value="22.5">22,5% (≤ 6 meses)</option>
                          <option value="20">20,0% (≤ 12 meses)</option>
                          <option value="17.5">17,5% (≤ 24 meses)</option>
                          <option value="15">15,0% (&gt; 24 meses)</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8] block mb-1.5">Benchmark</label>
                    <select
                      value={sim.benchmark}
                      onChange={e => setSim(prev => ({ ...prev, benchmark: e.target.value as typeof sim.benchmark }))}
                      className="w-full px-3 py-2 text-[12.5px] border border-[#e2e8f0] rounded-[7px] outline-none focus:border-[#1a6edb] text-[#0b1f3a] font-medium"
                    >
                      <option value="CDI">CDI (10,75% a.a.)</option>
                      <option value="IPCA">IPCA (5,00% a.a.)</option>
                      <option value="Poupança">Poupança (7,50% a.a.)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#f8fafc] rounded-[10px] p-4 space-y-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">Resultado estimado</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: 'Retorno bruto',         value: fmtPct(grossRate), color: '#0b1f3a' },
                      { label: 'Retorno líquido IR',     value: fmtPct(netRate),   color: '#059669' },
                      { label: 'Valor líquido no venc.', value: investRaw > 0 ? fmtBRL(netVal) : '—', color: '#0b1f3a' },
                      { label: `Spread vs. ${sim.benchmark}`, value: `+${spreadPP.toFixed(2)} pp`, color: '#1a6edb' },
                    ].map((r, i) => (
                      <div key={i} className="bg-white border border-[#e2e8f0] rounded-[8px] px-3 py-2.5">
                        <div className="text-[10px] text-[#94a3b8] mb-0.5">{r.label}</div>
                        <div className="text-[13px] font-semibold" style={{ color: r.color }}>{r.value}</div>
                      </div>
                    ))}
                  </div>
                  {investRaw > 0 && (
                    <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[8px] px-3 py-2.5 flex items-center gap-2">
                      <i className="fas fa-chart-line text-[#1a6edb] text-[11px]"></i>
                      <span className="text-[11.5px] text-[#1d4ed8]">
                        {sim.benchmark} puro: {fmtBRL(benchVal)} · Ganho adicional: {fmtBRL(netVal - benchVal)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-[#94a3b8] leading-relaxed">
                  * Taxa estimada: {sim.benchmark} + {spreadPP.toFixed(1)}pp (referência {deal.instrument}). Valores meramente indicativos — consulte a documentação oficial da operação.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex gap-2.5">
          <button className="flex-1 py-2.5 bg-[#0b1f3a] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#1a6edb] transition-all flex items-center justify-center gap-2">
            <i className="fas fa-edit text-[12px]"></i>
            Editar
          </button>
          <button
            onClick={() => setShowHubSpot(true)}
            className="py-2.5 px-4 border border-[#e2e8f0] text-[#475569] text-[13px] font-medium rounded-[8px] hover:border-[#ff7a59] hover:text-[#ff7a59] transition-all flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.4 14.2c-.4-1.3-1.3-2.4-2.5-3.1V8.4c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v.8c-.7-.1-1.4-.1-2.1 0V8.4c0-1.3-1.1-2.4-2.4-2.4S8.2 7.1 8.2 8.4v2.7C7 11.8 6.1 12.9 5.7 14.2c-.7 2.4.2 5 2.2 6.5 1.1.8 2.4 1.3 3.7 1.3h4.6c1.4 0 2.7-.5 3.7-1.3 2.1-1.5 3-4.1 2.5-6.5z"/>
            </svg>
            HubSpot
          </button>
          <button className="py-2.5 px-4 border border-[#e2e8f0] text-[#475569] text-[13px] font-medium rounded-[8px] hover:border-[#dc2626] hover:text-[#dc2626] transition-all flex items-center gap-2">
            <i className="fas fa-archive text-[11px]"></i>
            Arquivar
          </button>
        </div>
      </div>

      {/* ── Modal HubSpot CRM ─────────────────────────────────────────── */}
      {showHubSpot && (() => {
        const hsIdx    = HS_STAGE_INDEX[deal.stage] ?? 0;
        const dealId   = hsDealId(deal);
        const closeDate = HS_CLOSE_DATE[deal.stage] ?? '—';
        return (
          <>
            <div className="fixed inset-0 bg-black/40 z-[700]" onClick={() => setShowHubSpot(false)} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] bg-white rounded-2xl shadow-2xl z-[800] overflow-hidden flex flex-col max-h-[90vh]">

              {/* Header laranja HubSpot */}
              <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#ff7a59' }}>
                <div className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.4 14.2c-.4-1.3-1.3-2.4-2.5-3.1V8.4c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v.8c-.7-.1-1.4-.1-2.1 0V8.4c0-1.3-1.1-2.4-2.4-2.4S8.2 7.1 8.2 8.4v2.7C7 11.8 6.1 12.9 5.7 14.2c-.7 2.4.2 5 2.2 6.5 1.1.8 2.4 1.3 3.7 1.3h4.6c1.4 0 2.7-.5 3.7-1.3 2.1-1.5 3-4.1 2.5-6.5z"/>
                  </svg>
                  <div>
                    <div className="text-white text-[11px] font-semibold tracking-[0.08em] uppercase opacity-80">HubSpot CRM</div>
                    <div className="text-white text-[13px] font-bold leading-tight">{deal.title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span className="text-white text-[10.5px] font-semibold">Sincronizado</span>
                  </div>
                  <button onClick={() => setShowHubSpot(false)} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all">
                    <i className="fas fa-times text-white text-[12px]"></i>
                  </button>
                </div>
              </div>

              {/* Pipeline de estágios */}
              <div className="px-6 py-4 bg-[#f5f8fa] border-b border-[#e2e8f0]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#516f90] mb-2.5">Estágio no Pipeline</div>
                <div className="flex items-center gap-0">
                  {HS_STAGES.map((s, i) => {
                    const active  = i === hsIdx;
                    const past    = i < hsIdx;
                    return (
                      <div key={i} className="flex items-center flex-1 min-w-0">
                        <div className="flex flex-col items-center flex-1 min-w-0 gap-1">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                            style={{
                              backgroundColor: active ? '#ff7a59' : past ? '#00bda5' : '#e2e8f0',
                            }}
                          >
                            {past
                              ? <i className="fas fa-check text-white text-[7px]"></i>
                              : active
                              ? <div className="w-2 h-2 rounded-full bg-white"></div>
                              : <div className="w-2 h-2 rounded-full bg-[#94a3b8]"></div>
                            }
                          </div>
                          <span className="text-[8.5px] text-center leading-tight px-0.5 truncate w-full text-center" style={{ color: active ? '#ff7a59' : past ? '#00bda5' : '#94a3b8', fontWeight: active ? 700 : 400 }}>
                            {s.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </div>
                        {i < HS_STAGES.length - 1 && (
                          <div className="h-px flex-shrink-0 w-3 -mt-4" style={{ backgroundColor: i < hsIdx ? '#00bda5' : '#e2e8f0' }}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Corpo scrollável */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* Propriedades */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#516f90] mb-2.5">Propriedades do Deal</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: 'Deal ID',        value: `#${dealId}` },
                      { label: 'Valor',           value: `R$ ${deal.value}M` },
                      { label: 'Empresa',         value: deal.title },
                      { label: 'Setor',           value: deal.sector },
                      { label: 'Instrumento',     value: deal.instrument },
                      { label: 'Proprietário',    value: deal.responsible },
                      { label: 'Previsão de fechamento', value: closeDate },
                      { label: 'Última atividade', value: deal.lastUpdate },
                    ].map((p, i) => (
                      <div key={i} className="bg-[#f5f8fa] rounded-[8px] px-3.5 py-2.5">
                        <div className="text-[9.5px] font-semibold uppercase tracking-[0.07em] text-[#516f90] mb-0.5">{p.label}</div>
                        <div className="text-[12.5px] font-semibold text-[#2d3648]">{p.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Atividade recente */}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#516f90] mb-2.5">Atividade Recente</div>
                  <div className="space-y-2">
                    {deal.timeline.slice(0, 3).map((ev, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-[12px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff7a59] mt-1.5 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium text-[#2d3648]">{ev.event}</span>
                          <span className="text-[#516f90] ml-1.5">· {ev.date} · {ev.author}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer com ações */}
              <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#f5f8fa] flex items-center gap-2.5">
                <button
                  className="flex-1 py-2.5 text-white text-[13px] font-semibold rounded-[8px] flex items-center justify-center gap-2 transition-all"
                  style={{ backgroundColor: '#ff7a59' }}
                  onClick={() => window.open('https://app.hubspot.com', '_blank')}
                >
                  <i className="fas fa-external-link-alt text-[11px]"></i>
                  Abrir no HubSpot
                </button>
                <button
                  onClick={() => {
                    setHsSyncing(true);
                    setTimeout(() => setHsSyncing(false), 2000);
                  }}
                  disabled={hsSyncing}
                  className="py-2.5 px-4 border border-[#e2e8f0] text-[#2d3648] text-[13px] font-medium rounded-[8px] hover:bg-[#e2e8f0] transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  <i className={`fas ${hsSyncing ? 'fa-spinner fa-spin' : 'fa-sync-alt'} text-[11px]`}></i>
                  {hsSyncing ? 'Sincronizando…' : 'Sincronizar'}
                </button>
              </div>

            </div>
          </>
        );
      })()}
    </>
  );
}

