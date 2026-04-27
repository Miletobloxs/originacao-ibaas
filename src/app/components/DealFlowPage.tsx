import { useState } from 'react';

export type Stage = 'originacao' | 'analise' | 'diligencia' | 'comite' | 'estruturacao' | 'concluido';
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

  const filteredDeals = deals.filter((d: Deal) =>
    d.title.toLowerCase().includes(search.toLowerCase()) &&
    (!filterInstrument || d.instrument === filterInstrument) &&
    (!filterSector || d.sector === filterSector)
  );

  const activeDeals = deals.filter((d: Deal) => d.stage !== 'concluido');
  const pipelineVolume = activeDeals.reduce((sum: number, d: Deal) => sum + d.value, 0);
  const finalStageDeals = deals.filter((d: Deal) => d.stage === 'comite' || d.stage === 'estruturacao');
  const finalStageVolume = finalStageDeals.reduce((sum: number, d: Deal) => sum + d.value, 0);

  const dealsForColumn = (stage: Stage) => filteredDeals.filter((d: Deal) => d.stage === stage);
  const colVolume = (stage: Stage) => deals.filter((d: Deal) => d.stage === stage).reduce((sum: number, d: Deal) => sum + d.value, 0);

  const hasFilters = search || filterInstrument || filterSector;

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

        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setFilterInstrument(''); setFilterSector(''); }}
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
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span
          className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full leading-5"
          style={{ backgroundColor: style.bg, color: style.text }}
        >
          {deal.instrument}
        </span>
        <i className="fas fa-chevron-right text-[10px] text-[#d1d5db] group-hover:text-[#1a6edb] transition-colors mt-0.5 flex-shrink-0"></i>
      </div>
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
    </button>
  );
}

function DealPanel({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const instrStyle = INSTRUMENT_STYLE[deal.instrument] ?? INSTRUMENT_STYLE['A definir'];
  const col = COLUMNS.find(c => c.id === deal.stage);
  const stageLabel = col?.label ?? deal.stage;
  const stageBg = col?.headerBg ?? '#475569';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 z-[300]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-[440px] bg-white z-[400] shadow-[-6px_0_40px_rgba(0,0,0,0.10)] flex flex-col">
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
            <span
              className="text-[11.5px] font-semibold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: stageBg }}
            >
              {stageLabel}
            </span>
            <span
              className="text-[11.5px] font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: instrStyle.bg, color: instrStyle.text }}
            >
              {deal.instrument}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Volume', value: `R$ ${deal.value}M` },
              { label: 'Localização', value: deal.location },
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
                      <div className="text-[12.5px] font-medium text-[#0b1f3a] leading-snug">
                        {ev.event}
                      </div>
                      <div className="text-[11px] text-[#94a3b8] mt-0.5">
                        {ev.date} · {ev.author}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex gap-2.5">
          <button className="flex-1 py-2.5 bg-[#0b1f3a] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#1a6edb] transition-all flex items-center justify-center gap-2">
            <i className="fas fa-edit text-[12px]"></i>
            Editar
          </button>
          <button className="py-2.5 px-4 border border-[#e2e8f0] text-[#475569] text-[13px] font-medium rounded-[8px] hover:border-[#0b1f3a] hover:text-[#0b1f3a] transition-all flex items-center gap-2">
            <i className="fas fa-external-link-alt text-[11px]"></i>
            HubSpot
          </button>
          <button className="py-2.5 px-4 border border-[#e2e8f0] text-[#475569] text-[13px] font-medium rounded-[8px] hover:border-[#dc2626] hover:text-[#dc2626] transition-all flex items-center gap-2">
            <i className="fas fa-archive text-[11px]"></i>
            Arquivar
          </button>
        </div>
      </div>
    </>
  );
}
