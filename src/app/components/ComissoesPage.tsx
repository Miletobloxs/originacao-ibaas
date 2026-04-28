import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, TooltipProps
} from 'recharts';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button } from './ds';
import type { Deal } from './DealFlowPage';

const STAGE_PROB: Record<string, number> = {
  originacao: 0.20, analise: 0.40, diligencia: 0.60, comite: 0.80, estruturacao: 0.95,
};
const STAGE_LABEL: Record<string, string> = {
  originacao: 'Originação', analise: 'Análise', diligencia: 'Diligência',
  comite: 'Comitê', estruturacao: 'Estruturação',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmtBRL = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TRIMESTRAL = [
  { periodo: 'Q1 2025', valor: 45000,  projetado: false },
  { periodo: 'Q2 2025', valor: 72000,  projetado: false },
  { periodo: 'Q3 2025', valor: 88000,  projetado: false },
  { periodo: 'Q4 2025', valor: 107000, projetado: false },
  { periodo: 'Q1 2026', valor: 132000, projetado: false },
  { periodo: 'Q2 2026*',valor: 180000, projetado: true  },
];

const DONUT_DATA = [
  { name: 'Pago',       value: 312000, color: '#059669' },
  { name: 'A receber',  value: 535000, color: '#1a6edb' },
  { name: 'Em análise', value: 63000,  color: '#d97706' },
];
const DONUT_TOTAL = DONUT_DATA.reduce((s, d) => s + d.value, 0);

const POR_OPERACAO = [
  { operacao: 'Data Center MG', valor: 165000 },
  { operacao: 'Logística RJ',   valor: 127500 },
  { operacao: 'Telecom Norte',  valor: 75000  },
  { operacao: 'Solar Norte SP', valor: 63000  },
  { operacao: 'Imobiliário PE', valor: 45000  },
];

type StatusComissao = 'Pago' | 'A receber' | 'Em análise';

interface Comissao {
  operacao: string;
  setor: string;
  volume: string;
  pctComissao: string;
  valor: number;
  status: StatusComissao;
  nf: string;
}

const COMISSOES: Comissao[] = [
  { operacao: 'Agro Cerrado',    setor: 'Agronegócio',      volume: 'R$ 120M', pctComissao: '1,5%', valor: 180000, status: 'Pago',       nf: 'NF 001'  },
  { operacao: 'Eólica Nordeste', setor: 'Energia',          volume: 'R$ 88M',  pctComissao: '1,5%', valor: 132000, status: 'Pago',       nf: 'NF 002'  },
  { operacao: 'Data Center MG',  setor: 'Tecnologia',       volume: 'R$ 110M', pctComissao: '1,5%', valor: 165000, status: 'A receber',  nf: 'Pendente'},
  { operacao: 'Logística RJ',    setor: 'Infraestrutura',   volume: 'R$ 85M',  pctComissao: '1,5%', valor: 127500, status: 'A receber',  nf: 'Pendente'},
  { operacao: 'Telecom Norte',   setor: 'Telecomunicações', volume: 'R$ 50M',  pctComissao: '1,5%', valor: 75000,  status: 'A receber',  nf: 'Pendente'},
  { operacao: 'Solar Norte SP',  setor: 'Energia',          volume: 'R$ 42M',  pctComissao: '1,5%', valor: 63000,  status: 'Em análise', nf: '—'       },
  { operacao: 'Imobiliário PE',  setor: 'Imobiliário',      volume: 'R$ 30M',  pctComissao: '1,5%', valor: 45000,  status: 'Em análise', nf: '—'       },
];

const STATUS_STYLE: Record<StatusComissao, { variant: 'success' | 'primary' | 'warning'; icon: string }> = {
  'Pago':       { variant: 'success', icon: 'fa-check-circle'  },
  'A receber':  { variant: 'primary', icon: 'fa-clock'         },
  'Em análise': { variant: 'warning', icon: 'fa-hourglass-half'},
};

// ─── TOOLTIPS ─────────────────────────────────────────────────────────────────

function TooltipBRL({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-lg)] shadow-[var(--bloxs-shadow-xl)] px-4 py-3 text-[12px]">
      <div className="font-semibold text-[var(--bloxs-navy)] mb-1.5">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill as string ?? p.color as string }} />
          <span className="text-[var(--bloxs-gray-500)]">{p.name}:</span>
          <span className="font-semibold text-[var(--bloxs-navy)]">{fmtBRL(p.value as number)}</span>
        </div>
      ))}
    </div>
  );
}

function TooltipDonut({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const pct = ((p.value as number) / DONUT_TOTAL * 100).toFixed(1);
  return (
    <div className="bg-white border border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-lg)] shadow-[var(--bloxs-shadow-xl)] px-4 py-3 text-[12px]">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.payload.color }} />
        <span className="font-semibold text-[var(--bloxs-navy)]">{p.name}</span>
      </div>
      <div className="text-[var(--bloxs-text-muted)]">{fmtBRL(p.value as number)}</div>
      <div className="text-[var(--bloxs-text-muted)]">{pct}% do total</div>
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const OP_TO_VALUE: Record<string, string> = {
  'Data Center MG': 'datacenter',
  'Logística RJ':   'logistica',
  'Telecom Norte':  'telecom',
};

interface Props {
  onGerarNF?: (operacaoValue: string, valor: number) => void;
  deals?: Deal[];
}

export default function ComissoesPage({ onGerarNF, deals = [] }: Props) {
  const [filtroStatus, setFiltroStatus] = useState<StatusComissao | 'Todas'>('Todas');

  const comissoesFiltradas = filtroStatus === 'Todas'
    ? COMISSOES
    : COMISSOES.filter(c => c.status === filtroStatus);

  const totalFiltrado = comissoesFiltradas.reduce((s, c) => s + c.valor, 0);

  const contagem = (s: StatusComissao) => COMISSOES.filter(c => c.status === s).length;

  return (
    <div>
      <PageHeader
        breadcrumb="Comissões"
        title="Comissões e Remuneração"
        subtitle="Acompanhe os valores devidos, projetados e recebidos por operação."
        action={
          <Button
            variant="outline"
            size="sm"
            icon={<i className="fas fa-download text-[11px]" />}
          >
            Exportar
          </Button>
        }
      />

      {/* KPI BANNER */}
      <Card padding="none" className="mb-6">
        <div className="grid grid-cols-3 divide-x divide-[var(--bloxs-border)] max-md:grid-cols-1 max-md:divide-x-0 max-md:divide-y">

          {/* Total acumulado */}
          <div className="px-8 py-6">
            <div className="text-[10.5px] font-semibold tracking-[0.09em] uppercase text-[var(--bloxs-gray-400)] mb-2">
              Total acumulado 2026
            </div>
            <div className="font-['Playfair_Display'] text-[30px] font-semibold text-[var(--bloxs-navy)] leading-none mb-1.5">
              R$ 312.000
            </div>
            <div className="text-[12px] text-[var(--bloxs-text-muted)] flex items-center gap-1.5 mb-4">
              <i className="fas fa-check-circle text-[var(--bloxs-success)] text-[11px]" />
              5 operações concluídas
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-[var(--bloxs-gray-100)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--bloxs-success)] rounded-full" style={{ width: '36.8%' }} />
            </div>
            <div className="text-[10.5px] text-[var(--bloxs-text-muted)] mt-1.5">
              36,8% da projeção anual
            </div>
          </div>

          {/* A receber */}
          <div className="px-8 py-6">
            <div className="text-[10.5px] font-semibold tracking-[0.09em] uppercase text-[var(--bloxs-gray-400)] mb-2">
              A receber
            </div>
            <div className="font-['Playfair_Display'] text-[30px] font-semibold text-[var(--bloxs-navy)] leading-none mb-1.5">
              R$ 535.000
            </div>
            <div className="text-[12px] text-[var(--bloxs-text-muted)] flex items-center gap-1.5 mb-4">
              <i className="fas fa-clock text-[var(--bloxs-blue)] text-[11px]" />
              2 operações em estruturação
            </div>
            <div className="h-1.5 bg-[var(--bloxs-gray-100)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--bloxs-blue)] rounded-full" style={{ width: '63.2%' }} />
            </div>
            <div className="text-[10.5px] text-[var(--bloxs-text-muted)] mt-1.5">
              63,2% da projeção anual
            </div>
          </div>

          {/* Projeção total */}
          <div className="px-8 py-6">
            <div className="text-[10.5px] font-semibold tracking-[0.09em] uppercase text-[var(--bloxs-gray-400)] mb-2">
              Projeção total
            </div>
            <div className="font-['Playfair_Display'] text-[30px] font-semibold text-[var(--bloxs-navy)] leading-none mb-1.5">
              R$ 847.000
            </div>
            <div className="text-[12px] text-[var(--bloxs-text-muted)] flex items-center gap-1.5 mb-4">
              <i className="fas fa-chart-line text-[var(--bloxs-warning)] text-[11px]" />
              Pipeline atual · 7 operações
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-[var(--bloxs-success)] font-semibold">
                <i className="fas fa-arrow-up text-[10px]" />
                +171%
              </span>
              <span className="text-[var(--bloxs-text-muted)]">vs. 2025 completo</span>
            </div>
          </div>

        </div>
      </Card>

      {/* CHARTS — GRID 3 */}
      <div className="grid grid-cols-3 gap-5 mb-6 max-lg:grid-cols-1">

        {/* Evolução trimestral */}
        <Card padding="none" hover>
          <CardHeader icon={<i className="fas fa-chart-bar" />}>
            Evolução trimestral
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={TRIMESTRAL} barSize={22} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="var(--bloxs-gray-100)" />
                <XAxis
                  dataKey="periodo"
                  tick={{ fill: 'var(--bloxs-gray-500)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={v => v >= 1000 ? `${v / 1000}k` : String(v)}
                  tick={{ fill: 'var(--bloxs-gray-400)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<TooltipBRL />} cursor={{ fill: 'rgba(241,245,249,0.8)' }} />
                <Bar dataKey="valor" name="Comissão" radius={[5, 5, 0, 0]}>
                  {TRIMESTRAL.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={i >= 4 ? '#1a6edb' : '#0b1f3a'}
                      opacity={entry.projetado ? 0.45 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[10.5px] text-[var(--bloxs-text-muted)] text-center mt-1">
              * Q2 2026 projetado
            </p>
          </CardBody>
        </Card>

        {/* Status das comissões — Donut */}
        <Card padding="none" hover>
          <CardHeader icon={<i className="fas fa-chart-pie" />}>
            Status das comissões
          </CardHeader>
          <CardBody>
            <div className="relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={DONUT_DATA}
                    cx="50%"
                    cy="46%"
                    innerRadius="52%"
                    outerRadius="72%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {DONUT_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<TooltipDonut />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: 'var(--bloxs-gray-600)', paddingTop: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Centro do donut */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ bottom: 32 }}
              >
                <div className="text-center">
                  <div className="font-['Playfair_Display'] text-[17px] font-semibold text-[var(--bloxs-navy)] leading-none">
                    {fmtBRL(DONUT_TOTAL)}
                  </div>
                  <div className="text-[10px] text-[var(--bloxs-text-muted)] mt-0.5">total</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Por operação ativa — Horizontal bar */}
        <Card padding="none" hover>
          <CardHeader icon={<i className="fas fa-tasks" />}>
            Por operação ativa
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={POR_OPERACAO}
                layout="vertical"
                barSize={14}
                barCategoryGap="30%"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid strokeDasharray="0" horizontal={false} stroke="var(--bloxs-gray-100)" />
                <XAxis
                  type="number"
                  tickFormatter={v => `${v / 1000}k`}
                  tick={{ fill: 'var(--bloxs-gray-400)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="operacao"
                  width={90}
                  tick={{ fill: 'var(--bloxs-gray-600)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<TooltipBRL />} cursor={{ fill: 'rgba(241,245,249,0.8)' }} />
                <Bar dataKey="valor" name="Comissão" fill="#1a6edb" radius={[0, 4, 4, 0]}>
                  {POR_OPERACAO.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#0b1f3a' : '#1a6edb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

      </div>

      {/* TABELA DETALHADA */}
      <Card padding="none">
        <CardHeader
          icon={<i className="fas fa-table" />}
          action={
            <div className="flex items-center gap-2">
              {(['Todas', 'Pago', 'A receber', 'Em análise'] as (StatusComissao | 'Todas')[]).map(s => (
                <button
                  key={s}
                  onClick={() => setFiltroStatus(s)}
                  className={`flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-[var(--bloxs-radius-full)] border transition-all ${
                    filtroStatus === s
                      ? 'bg-[var(--bloxs-navy)] text-white border-[var(--bloxs-navy)]'
                      : 'bg-white text-[var(--bloxs-gray-500)] border-[var(--bloxs-border)] hover:border-[var(--bloxs-navy)] hover:text-[var(--bloxs-navy)]'
                  }`}
                >
                  {s}
                  {s !== 'Todas' && (
                    <span className={`text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                      filtroStatus === s ? 'bg-white/20' : 'bg-[var(--bloxs-gray-100)]'
                    }`}>
                      {contagem(s as StatusComissao)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          }
        >
          Detalhamento por operação
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--bloxs-border)] bg-[var(--bloxs-gray-50)]">
                {['Operação', 'Setor', 'Volume', '% Comissão', 'Valor', 'Status', 'NF'].map(h => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-[10.5px] font-semibold tracking-[0.07em] uppercase text-[var(--bloxs-gray-400)] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bloxs-border)]">
              {comissoesFiltradas.map((row, i) => {
                const st = STATUS_STYLE[row.status];
                return (
                  <tr key={i} className="hover:bg-[var(--bloxs-gray-50)] transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-semibold text-[var(--bloxs-navy)]">{row.operacao}</span>
                    </td>
                    <td className="px-6 py-4 text-[12.5px] text-[var(--bloxs-text-muted)]">
                      {row.setor}
                    </td>
                    <td className="px-6 py-4 text-[12.5px] font-medium text-[var(--bloxs-navy)]">
                      {row.volume}
                    </td>
                    <td className="px-6 py-4 text-[12.5px] text-[var(--bloxs-text-muted)] text-center">
                      {row.pctComissao}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-bold text-[var(--bloxs-navy)]">
                        {fmtBRL(row.valor)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={st.variant} size="sm">
                        <i className={`fas ${st.icon} text-[9px]`} />
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {row.nf === '—' ? (
                        <span className="text-[12px] text-[var(--bloxs-gray-300)]">—</span>
                      ) : row.nf === 'Pendente' ? (
                        <button
                          onClick={() => onGerarNF?.(OP_TO_VALUE[row.operacao] ?? '', row.valor)}
                          className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#d97706] bg-[#fffbeb] border border-[#fde68a] px-2.5 py-1 rounded-full hover:bg-[#fef3c7] hover:border-[#f59e0b] transition-all"
                        >
                          <i className="fas fa-file-invoice text-[10px]" />
                          Gerar NF
                        </button>
                      ) : (
                        <Badge variant="primary" size="sm">
                          <i className="fas fa-file-invoice text-[9px]" />
                          {row.nf}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Linha de total */}
            <tfoot>
              <tr className="border-t-2 border-[var(--bloxs-border)] bg-[var(--bloxs-gray-50)]">
                <td colSpan={4} className="px-6 py-3.5 text-[11.5px] font-semibold text-[var(--bloxs-gray-500)] uppercase tracking-[0.06em]">
                  Total exibido ({comissoesFiltradas.length} operações)
                </td>
                <td className="px-6 py-3.5">
                  <span className="font-['Playfair_Display'] text-[16px] font-semibold text-[var(--bloxs-navy)]">
                    {fmtBRL(totalFiltrado)}
                  </span>
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* ── 5.1 Forecast de Comissões por Pipeline ───────────────────── */}
      {deals.filter(d => d.stage !== 'concluido').length > 0 && (() => {
        const rows = deals
          .filter(d => d.stage !== 'concluido')
          .map(d => {
            const bruta   = d.value * 15000;
            const prob    = STAGE_PROB[d.stage] ?? 0.20;
            return { title: d.title, stage: d.stage, bruta, prob, esperado: bruta * prob };
          });
        const totalEsperado = rows.reduce((s, r) => s + r.esperado, 0);
        const totalBruta    = rows.reduce((s, r) => s + r.bruta, 0);

        return (
          <Card padding="none" className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--bloxs-blue)] mb-0.5">
                    Pipeline
                  </div>
                  <h3 className="text-[16px] font-semibold text-[var(--bloxs-navy)]">
                    Projeção por Operação em Pipeline
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-[10.5px] text-[var(--bloxs-gray-400)] uppercase font-semibold tracking-wide mb-0.5">
                    Valor esperado total
                  </div>
                  <div className="font-['Playfair_Display'] text-[20px] font-semibold text-[var(--bloxs-navy)]">
                    {fmtBRL(totalEsperado)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--bloxs-border)] bg-[var(--bloxs-gray-50)]">
                    {['Operação', 'Etapa atual', 'Comissão bruta (1,5%)', 'Probabilidade', 'Valor esperado'].map(h => (
                      <th key={h} className="px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[var(--bloxs-gray-400)]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b border-[var(--bloxs-border)] hover:bg-[var(--bloxs-gray-50)] transition-colors">
                      <td className="px-5 py-3.5 text-[13px] font-semibold text-[var(--bloxs-navy)]">{r.title}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#475569]">
                          {STAGE_LABEL[r.stage] ?? r.stage}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12.5px] text-[var(--bloxs-navy)] font-medium">{fmtBRL(r.bruta)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#1a6edb] rounded-full" style={{ width: `${r.prob * 100}%` }} />
                          </div>
                          <span className="text-[12px] font-semibold text-[var(--bloxs-navy)]">{(r.prob * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] font-bold text-[#059669]">{fmtBRL(r.esperado)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[var(--bloxs-border)] bg-[var(--bloxs-gray-50)]">
                    <td colSpan={2} className="px-5 py-3.5 text-[11.5px] font-semibold text-[var(--bloxs-gray-500)] uppercase tracking-[0.06em]">
                      Total pipeline ({rows.length} operações)
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-['Playfair_Display'] text-[15px] font-semibold text-[var(--bloxs-navy)]">{fmtBRL(totalBruta)}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[11px] text-[var(--bloxs-gray-400)]">ponderado</td>
                    <td className="px-5 py-3.5">
                      <span className="font-['Playfair_Display'] text-[16px] font-semibold text-[#059669]">{fmtBRL(totalEsperado)}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        );
      })()}
    </div>
  );
}
