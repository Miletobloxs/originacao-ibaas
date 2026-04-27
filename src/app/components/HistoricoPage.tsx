import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend, TooltipProps
} from 'recharts';
import { PageHeader, KPICard, Card, CardHeader, CardBody, Badge, Button } from './ds';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type StatusOp = 'Liquidada' | 'Em Andamento' | 'Inadimplente' | 'Antecipada' | 'Cancelada';
type Instrumento = 'CRI' | 'CRA' | 'Debênture' | 'CCB' | 'FIDC' | 'CPR';

interface Evento { data: string; texto: string }

interface Operacao {
  id: string;
  empresa: string;
  instrumento: Instrumento;
  setor: string;
  volume: number;
  taxa: string;
  prazo: number;
  emissao: string;
  vencimento: string;
  status: StatusOp;
  comissao: number;
  isin: string;
  eventos: Evento[];
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmtMM = (v: number) => `R$ ${v.toLocaleString('pt-BR')} MM`;
const fmtMil = (v: number) => `R$ ${v.toLocaleString('pt-BR')} mil`;

const MESES: Record<string, number> = {
  Jan: 0, Fev: 1, Mar: 2, Abr: 3, Mai: 4, Jun: 5,
  Jul: 6, Ago: 7, Set: 8, Out: 9, Nov: 10, Dez: 11,
};
function parseEmissao(s: string): number {
  const [mes, ano] = s.split('/');
  return parseInt(ano) * 12 + (MESES[mes] ?? 0);
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const OPERACOES: Operacao[] = [
  {
    id: 'OP-001', empresa: 'Agro Cerrado LTDA', instrumento: 'CRA', setor: 'Agronegócio',
    volume: 42, taxa: 'CDI + 2,8%', prazo: 24, emissao: 'Jul/2023', vencimento: 'Jul/2025',
    status: 'Liquidada', comissao: 168, isin: 'BRAGRCER23A1',
    eventos: [
      { data: '01/07/2023', texto: 'Emissão realizada — R$ 42,0 MM captados' },
      { data: '15/07/2023', texto: 'Registro CVM concluído (Instrução 476)' },
      { data: '01/07/2024', texto: 'Amortização parcial de 50% do principal' },
      { data: '01/07/2025', texto: 'Liquidação integral — operação encerrada' },
    ],
  },
  {
    id: 'OP-002', empresa: 'Data Center MG S.A.', instrumento: 'CRI', setor: 'Imobiliário',
    volume: 28, taxa: 'IPCA + 7,2%', prazo: 36, emissao: 'Mar/2024', vencimento: 'Mar/2027',
    status: 'Em Andamento', comissao: 140, isin: 'BRDCMGCRI24A1',
    eventos: [
      { data: '10/03/2024', texto: 'Due diligence imobiliária aprovada' },
      { data: '01/04/2024', texto: 'Emissão realizada — R$ 28,0 MM captados' },
      { data: '01/10/2024', texto: '1ª amortização semestral realizada (R$ 2,3 MM)' },
      { data: '01/04/2025', texto: '2ª amortização semestral realizada (R$ 2,3 MM)' },
    ],
  },
  {
    id: 'OP-003', empresa: 'Logística RJ S.A.', instrumento: 'Debênture', setor: 'Logística',
    volume: 65, taxa: 'CDI + 4,1%', prazo: 48, emissao: 'Abr/2022', vencimento: 'Abr/2026',
    status: 'Em Andamento', comissao: 325, isin: 'BRLOGRJDBN22A1',
    eventos: [
      { data: '15/04/2022', texto: 'Emissão realizada — R$ 65,0 MM captados' },
      { data: '01/04/2023', texto: 'Pagamento de juros anual — R$ 5,2 MM' },
      { data: '01/04/2024', texto: 'Pagamento de juros anual — R$ 5,4 MM' },
      { data: '01/04/2025', texto: 'Pagamento de juros anual — R$ 5,6 MM' },
    ],
  },
  {
    id: 'OP-004', empresa: 'Solar Norte SP', instrumento: 'CRA', setor: 'Energia Renovável',
    volume: 18, taxa: 'CDI + 3,5%', prazo: 18, emissao: 'Jun/2024', vencimento: 'Dez/2025',
    status: 'Liquidada', comissao: 63, isin: 'BRSOLNSPCCR24A1',
    eventos: [
      { data: '10/06/2024', texto: 'Emissão realizada — R$ 18,0 MM captados' },
      { data: '10/12/2024', texto: 'Amortização parcial de 50% (R$ 9,0 MM)' },
      { data: '10/12/2025', texto: 'Liquidação integral — operação encerrada' },
    ],
  },
  {
    id: 'OP-005', empresa: 'Portfólio Agro FIDC', instrumento: 'FIDC', setor: 'Agronegócio',
    volume: 120, taxa: 'CDI + 2,2%', prazo: 60, emissao: 'Jan/2025', vencimento: 'Jan/2030',
    status: 'Em Andamento', comissao: 600, isin: 'BRPAFIDC25A1',
    eventos: [
      { data: '10/01/2025', texto: 'Constituição do fundo aprovada pela CVM' },
      { data: '15/01/2025', texto: 'Captação inicial de R$ 120,0 MM concluída' },
      { data: '01/04/2025', texto: 'Carteira com 98,2% de alocação — inadimplência 0,4%' },
    ],
  },
  {
    id: 'OP-006', empresa: 'Tech Ventures BH', instrumento: 'Debênture', setor: 'Tecnologia',
    volume: 35, taxa: 'CDI + 5,0%', prazo: 36, emissao: 'Out/2023', vencimento: 'Out/2026',
    status: 'Antecipada', comissao: 140, isin: 'BRTECHBHDBN23A1',
    eventos: [
      { data: '01/10/2023', texto: 'Emissão realizada — R$ 35,0 MM captados' },
      { data: '15/03/2024', texto: 'Companhia recebeu aporte de R$ 80 MM (Série B)' },
      { data: '01/05/2025', texto: 'Resgate antecipado integral requerido pelo emissor' },
      { data: '01/06/2025', texto: 'Liquidação antecipada concluída — prêmio de 0,5%' },
    ],
  },
  {
    id: 'OP-007', empresa: 'Frigorífico Norte S.A.', instrumento: 'CRA', setor: 'Agronegócio',
    volume: 55, taxa: 'CDI + 3,0%', prazo: 24, emissao: 'Fev/2022', vencimento: 'Fev/2024',
    status: 'Liquidada', comissao: 220, isin: 'BRFRINOR22A1',
    eventos: [
      { data: '01/02/2022', texto: 'Emissão realizada — R$ 55,0 MM captados' },
      { data: '01/02/2023', texto: 'Amortização parcial de 50% do principal' },
      { data: '01/02/2024', texto: 'Liquidação integral — operação encerrada' },
    ],
  },
  {
    id: 'OP-008', empresa: 'Construtora ABC', instrumento: 'CRI', setor: 'Imobiliário',
    volume: 22, taxa: 'IPCA + 8,5%', prazo: 48, emissao: 'Set/2023', vencimento: 'Set/2027',
    status: 'Inadimplente', comissao: 110, isin: 'BRCNSTABCRI23A1',
    eventos: [
      { data: '01/09/2023', texto: 'Emissão realizada — R$ 22,0 MM captados' },
      { data: '01/03/2024', texto: 'Atraso na amortização semestral (FIDC notificado)' },
      { data: '01/06/2024', texto: 'Evento de inadimplência declarado — processo judicial iniciado' },
      { data: '15/12/2024', texto: 'Acordo extrajudicial em negociação — R$ 14,2 MM recuperável' },
    ],
  },
  {
    id: 'OP-009', empresa: 'Energia Renovável SP', instrumento: 'Debênture', setor: 'Energia Renovável',
    volume: 88, taxa: 'CDI + 2,5%', prazo: 36, emissao: 'Mai/2024', vencimento: 'Mai/2027',
    status: 'Em Andamento', comissao: 352, isin: 'BRENERSPBN24A1',
    eventos: [
      { data: '15/05/2024', texto: 'Emissão realizada — R$ 88,0 MM captados' },
      { data: '15/11/2024', texto: 'Pagamento de juros semestral — R$ 5,9 MM' },
      { data: '15/05/2025', texto: 'Pagamento de juros semestral — R$ 6,1 MM' },
    ],
  },
  {
    id: 'OP-010', empresa: 'Grão Dourado Agro', instrumento: 'CRA', setor: 'Agronegócio',
    volume: 31, taxa: 'CDI + 3,3%', prazo: 18, emissao: 'Nov/2023', vencimento: 'Mai/2025',
    status: 'Liquidada', comissao: 93, isin: 'BRGRDOAGR23A1',
    eventos: [
      { data: '01/11/2023', texto: 'Emissão realizada — R$ 31,0 MM captados' },
      { data: '01/05/2024', texto: 'Amortização parcial de 50% (R$ 15,5 MM)' },
      { data: '01/05/2025', texto: 'Liquidação integral — operação encerrada' },
    ],
  },
  {
    id: 'OP-011', empresa: 'Bioenergia MT', instrumento: 'CRA', setor: 'Energia Renovável',
    volume: 44, taxa: 'CDI + 2,9%', prazo: 30, emissao: 'Mar/2025', vencimento: 'Set/2027',
    status: 'Em Andamento', comissao: 176, isin: 'BRBIOEMTCRA25A1',
    eventos: [
      { data: '10/03/2025', texto: 'Emissão realizada — R$ 44,0 MM captados' },
      { data: '10/09/2025', texto: '1ª amortização semestral realizada (R$ 7,3 MM)' },
    ],
  },
  {
    id: 'OP-012', empresa: 'Crédito Rápido CCB', instrumento: 'CCB', setor: 'Financeiro',
    volume: 15, taxa: 'CDI + 6,5%', prazo: 12, emissao: 'Ago/2024', vencimento: 'Ago/2025',
    status: 'Antecipada', comissao: 75, isin: 'BRCREDRAP24A1',
    eventos: [
      { data: '01/08/2024', texto: 'Emissão realizada — R$ 15,0 MM captados' },
      { data: '15/02/2025', texto: 'Pagamento parcial antecipado (R$ 8,0 MM)' },
      { data: '01/05/2025', texto: 'Liquidação integral antecipada com prêmio de 0,25%' },
    ],
  },
];

const CHART_VOLUME = [
  { periodo: 'Q2/23', volume: 22 },
  { periodo: 'Q3/23', volume: 42 },
  { periodo: 'Q4/23', volume: 88 },
  { periodo: 'Q1/24', volume: 28 },
  { periodo: 'Q2/24', volume: 106 },
  { periodo: 'Q3/24', volume: 15 },
  { periodo: 'Q4/24', volume: 45 },
  { periodo: 'Q1/25', volume: 164 },
];

const DIST_INSTRUMENTO = [
  { name: 'CRA',       value: 5, color: '#22c55e' },
  { name: 'Debênture', value: 3, color: '#1a6edb' },
  { name: 'CRI',       value: 2, color: '#0b1f3a' },
  { name: 'FIDC',      value: 1, color: '#f59e0b' },
  { name: 'CCB',       value: 1, color: '#94a3b8' },
];

// ─── STYLE MAPS ───────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<StatusOp, 'success' | 'primary' | 'error' | 'warning' | 'gray'> = {
  'Liquidada':    'success',
  'Em Andamento': 'primary',
  'Inadimplente': 'error',
  'Antecipada':   'warning',
  'Cancelada':    'gray',
};

const STATUS_DOT: Record<StatusOp, string> = {
  'Liquidada':    'bg-[#059669]',
  'Em Andamento': 'bg-[#1a6edb]',
  'Inadimplente': 'bg-[#dc2626]',
  'Antecipada':   'bg-[#d97706]',
  'Cancelada':    'bg-[#94a3b8]',
};

const INST_STYLE: Record<Instrumento, string> = {
  CRI:       'bg-[#0b1f3a] text-white',
  CRA:       'bg-[#dcfce7] text-[#15803d]',
  Debênture: 'bg-[#dbeafe] text-[#1a6edb]',
  FIDC:      'bg-[#fef3c7] text-[#d97706]',
  CCB:       'bg-[#f1f5f9] text-[#64748b]',
  CPR:       'bg-[#f0fdf4] text-[#166534]',
};

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────

function TooltipVolume({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-lg p-3 text-[12px]">
      <div className="font-semibold text-[#0b1f3a] mb-1">{label}</div>
      <div className="text-[#1a6edb] font-semibold">R$ {payload[0].value} MM originados</div>
    </div>
  );
}

// ─── SORT ICON ────────────────────────────────────────────────────────────────

type SortField = 'volume' | 'emissao' | 'comissao';

function SortIcon({ campo, sortCampo, sortDir }: { campo: SortField; sortCampo: SortField | null; sortDir: 'asc' | 'desc' }) {
  if (sortCampo !== campo) return <i className="fas fa-sort text-[10px] text-[#cbd5e1] ml-1"></i>;
  return sortDir === 'asc'
    ? <i className="fas fa-sort-up text-[10px] text-[#1a6edb] ml-1"></i>
    : <i className="fas fa-sort-down text-[10px] text-[#1a6edb] ml-1"></i>;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function HistoricoPage() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroInstrumento, setFiltroInstrumento] = useState('');
  const [sortCampo, setSortCampo] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [operacaoAberta, setOperacaoAberta] = useState<Operacao | null>(null);

  function toggleSort(campo: SortField) {
    if (sortCampo === campo) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCampo(campo);
      setSortDir('desc');
    }
  }

  const operacoesFiltradas = useMemo(() => {
    let result = OPERACOES.filter(op => {
      const q = busca.toLowerCase();
      const matchBusca = !busca || op.empresa.toLowerCase().includes(q) || op.id.toLowerCase().includes(q) || op.isin.toLowerCase().includes(q);
      const matchStatus = !filtroStatus || op.status === filtroStatus;
      const matchInst = !filtroInstrumento || op.instrumento === filtroInstrumento;
      return matchBusca && matchStatus && matchInst;
    });
    if (sortCampo) {
      result = [...result].sort((a, b) => {
        let va: number, vb: number;
        if (sortCampo === 'volume')   { va = a.volume;   vb = b.volume; }
        else if (sortCampo === 'comissao') { va = a.comissao; vb = b.comissao; }
        else { va = parseEmissao(a.emissao); vb = parseEmissao(b.emissao); }
        return sortDir === 'asc' ? va - vb : vb - va;
      });
    }
    return result;
  }, [busca, filtroStatus, filtroInstrumento, sortCampo, sortDir]);

  const totalVolume = OPERACOES.reduce((s, o) => s + o.volume, 0);
  const totalComissoes = OPERACOES.reduce((s, o) => s + o.comissao, 0);
  const ativas = OPERACOES.filter(o => o.status === 'Em Andamento').length;

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <PageHeader
        breadcrumb="Gestão"
        title="Histórico de Operações"
        subtitle="Registro completo de todas as operações originadas desde 2022."
        action={
          <Button variant="secondary" size="sm" icon={<i className="fas fa-download"></i>}>
            Exportar CSV
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-5 mb-8 max-lg:grid-cols-2">
        <KPICard
          label="Total de Operações"
          value="12"
          trend="up"
          trendValue="+3"
          subtitle="vs. ano anterior"
          icon={<i className="fas fa-layer-group"></i>}
        />
        <KPICard
          label="Volume Originado"
          value="R$ 563 MM"
          trend="up"
          trendValue="+38%"
          subtitle="vs. ano anterior"
          icon={<i className="fas fa-chart-line"></i>}
        />
        <KPICard
          label="Taxa Média (CDI+)"
          value="CDI + 3,6%"
          trend="neutral"
          trendValue="estável"
          subtitle="spread médio histórico"
          icon={<i className="fas fa-percentage"></i>}
        />
        <KPICard
          label="Comissões Acumuladas"
          value="R$ 2,46 MM"
          trend="up"
          trendValue="+22%"
          subtitle="vs. ano anterior"
          icon={<i className="fas fa-coins"></i>}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-12 gap-5 mb-8">
        {/* Volume por trimestre */}
        <Card className="col-span-8 max-lg:col-span-12" padding="none">
          <CardHeader icon={<i className="fas fa-chart-bar"></i>}>
            Volume Originado por Trimestre
            <span className="ml-auto text-[11px] font-normal text-[#94a3b8]">R$ MM</span>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CHART_VOLUME} barSize={32} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={36} />
                <RTooltip content={<TooltipVolume />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                  {CHART_VOLUME.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === CHART_VOLUME.length - 1 ? '#1a6edb' : '#0b1f3a'}
                      opacity={i === CHART_VOLUME.length - 1 ? 0.7 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 text-[11px] text-[#94a3b8]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#0b1f3a] inline-block"></span>
                Histórico
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#1a6edb] opacity-70 inline-block"></span>
                Trimestre atual
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Distribuição por instrumento */}
        <Card className="col-span-4 max-lg:col-span-12" padding="none">
          <CardHeader icon={<i className="fas fa-chart-pie"></i>}>
            Por Instrumento
          </CardHeader>
          <CardBody>
            <div className="relative">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={DIST_INSTRUMENTO}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {DIST_INSTRUMENTO.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '-4px' }}>
                <div className="font-['Playfair_Display'] text-[22px] font-semibold text-[#0b1f3a] leading-none">12</div>
                <div className="text-[10px] text-[#94a3b8] mt-0.5">operações</div>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {DIST_INSTRUMENTO.map(d => (
                <div key={d.name} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: d.color }}></span>
                    <span className="text-[#475569]">{d.name}</span>
                  </span>
                  <span className="font-semibold text-[#0b1f3a]">{d.value} op{d.value > 1 ? 's' : '.'}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* TABLE CARD */}
      <Card padding="none">
        {/* Filter bar */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
            <input
              type="text"
              placeholder="Buscar por empresa, ID ou ISIN…"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-8 pr-3 py-[7px] text-[13px] border border-[#e2e8f0] rounded-lg bg-[#f8fafc] text-[#0b1f3a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#1a6edb] focus:bg-white transition-all"
            />
          </div>
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            className="text-[13px] border border-[#e2e8f0] rounded-lg px-3 py-[7px] bg-[#f8fafc] text-[#475569] focus:outline-none focus:border-[#1a6edb] cursor-pointer"
          >
            <option value="">Todos os status</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Liquidada">Liquidada</option>
            <option value="Antecipada">Antecipada</option>
            <option value="Inadimplente">Inadimplente</option>
            <option value="Cancelada">Cancelada</option>
          </select>
          <select
            value={filtroInstrumento}
            onChange={e => setFiltroInstrumento(e.target.value)}
            className="text-[13px] border border-[#e2e8f0] rounded-lg px-3 py-[7px] bg-[#f8fafc] text-[#475569] focus:outline-none focus:border-[#1a6edb] cursor-pointer"
          >
            <option value="">Todos os instrumentos</option>
            <option value="CRI">CRI</option>
            <option value="CRA">CRA</option>
            <option value="Debênture">Debênture</option>
            <option value="FIDC">FIDC</option>
            <option value="CCB">CCB</option>
            <option value="CPR">CPR</option>
          </select>
          {(busca || filtroStatus || filtroInstrumento) && (
            <button
              onClick={() => { setBusca(''); setFiltroStatus(''); setFiltroInstrumento(''); }}
              className="text-[12px] text-[#1a6edb] font-medium hover:underline"
            >
              Limpar filtros
            </button>
          )}
          <span className="ml-auto text-[12px] text-[#94a3b8] font-medium">
            {operacoesFiltradas.length} operaç{operacoesFiltradas.length === 1 ? 'ão' : 'ões'}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                <th className="text-left text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] px-6 py-3">ID</th>
                <th className="text-left text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] px-3 py-3">Empresa / Setor</th>
                <th className="text-left text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] px-3 py-3">Instrumento</th>
                <th
                  className="text-right text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] px-3 py-3 cursor-pointer select-none hover:text-[#0b1f3a]"
                  onClick={() => toggleSort('volume')}
                >
                  Volume
                  <SortIcon campo="volume" sortCampo={sortCampo} sortDir={sortDir} />
                </th>
                <th className="text-left text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] px-3 py-3">Taxa</th>
                <th className="text-center text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] px-3 py-3">Prazo</th>
                <th
                  className="text-left text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] px-3 py-3 cursor-pointer select-none hover:text-[#0b1f3a]"
                  onClick={() => toggleSort('emissao')}
                >
                  Emissão
                  <SortIcon campo="emissao" sortCampo={sortCampo} sortDir={sortDir} />
                </th>
                <th className="text-left text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] px-3 py-3">Status</th>
                <th
                  className="text-right text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] px-3 py-3 cursor-pointer select-none hover:text-[#0b1f3a]"
                  onClick={() => toggleSort('comissao')}
                >
                  Comissão
                  <SortIcon campo="comissao" sortCampo={sortCampo} sortDir={sortDir} />
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {operacoesFiltradas.map((op, i) => (
                <tr
                  key={op.id}
                  className={`border-b border-[#f1f5f9] cursor-pointer transition-colors ${
                    operacaoAberta?.id === op.id
                      ? 'bg-[#eef5ff]'
                      : i % 2 === 0
                      ? 'bg-white hover:bg-[#f8fafc]'
                      : 'bg-[#fafbfc] hover:bg-[#f8fafc]'
                  }`}
                  onClick={() => setOperacaoAberta(operacaoAberta?.id === op.id ? null : op)}
                >
                  <td className="px-6 py-3.5">
                    <span className="text-[11px] font-mono font-semibold text-[#64748b]">{op.id}</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="text-[13px] font-semibold text-[#0b1f3a] leading-tight">{op.empresa}</div>
                    <div className="text-[11px] text-[#94a3b8] mt-0.5">{op.setor}</div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${INST_STYLE[op.instrumento]}`}>
                      {op.instrumento}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <span className="text-[13px] font-semibold text-[#0b1f3a]">R$ {op.volume} MM</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-[12px] text-[#475569] font-mono">{op.taxa}</span>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className="text-[12px] text-[#475569]">{op.prazo}m</span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="text-[12px] text-[#475569]">{op.emissao}</div>
                    <div className="text-[11px] text-[#94a3b8]">vto. {op.vencimento}</div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${STATUS_DOT[op.status]}`}></span>
                      <Badge variant={STATUS_BADGE[op.status]} size="sm">{op.status}</Badge>
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <span className="text-[12px] font-semibold text-[#475569]">
                      R$ {op.comissao.toLocaleString('pt-BR')} mil
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <i className={`fas fa-chevron-right text-[11px] transition-colors ${
                      operacaoAberta?.id === op.id ? 'text-[#1a6edb]' : 'text-[#cbd5e1]'
                    }`}></i>
                  </td>
                </tr>
              ))}
              {operacoesFiltradas.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-14 text-[13px] text-[#94a3b8]">
                    <i className="fas fa-search text-[28px] mb-3 block opacity-40"></i>
                    Nenhuma operação encontrada com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
            {operacoesFiltradas.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-[#e2e8f0] bg-[#f8fafc]">
                  <td colSpan={3} className="px-6 py-3 text-[11px] font-bold tracking-wide uppercase text-[#94a3b8]">
                    Total ({operacoesFiltradas.length} ops.)
                  </td>
                  <td className="px-3 py-3 text-right text-[13px] font-bold text-[#0b1f3a]">
                    R$ {operacoesFiltradas.reduce((s, o) => s + o.volume, 0).toLocaleString('pt-BR')} MM
                  </td>
                  <td colSpan={4} className="px-3 py-3"></td>
                  <td className="px-3 py-3 text-right text-[13px] font-bold text-[#0b1f3a]">
                    R$ {operacoesFiltradas.reduce((s, o) => s + o.comissao, 0).toLocaleString('pt-BR')} mil
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {/* DETAIL PANEL BACKDROP */}
      {operacaoAberta && (
        <div
          className="fixed inset-0 bg-black/25 z-[300]"
          onClick={() => setOperacaoAberta(null)}
        />
      )}

      {/* DETAIL PANEL */}
      {operacaoAberta && (
        <div className="fixed top-[60px] right-0 bottom-0 w-[440px] bg-white border-l border-[#e2e8f0] z-[400] overflow-y-auto flex flex-col shadow-2xl">
          {/* Panel header */}
          <div className="px-6 py-5 border-b border-[#e2e8f0] bg-[#fafbfc] flex items-start justify-between gap-3 sticky top-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${INST_STYLE[operacaoAberta.instrumento]}`}>
                  {operacaoAberta.instrumento}
                </span>
                <Badge variant={STATUS_BADGE[operacaoAberta.status]} size="sm">
                  {operacaoAberta.status}
                </Badge>
              </div>
              <h2 className="font-['Playfair_Display'] text-[20px] font-semibold text-[#0b1f3a] leading-snug">
                {operacaoAberta.empresa}
              </h2>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-[#94a3b8]">
                <span className="font-mono">{operacaoAberta.id}</span>
                <span>·</span>
                <span className="font-mono">{operacaoAberta.isin}</span>
              </div>
            </div>
            <button
              onClick={() => setOperacaoAberta(null)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#0b1f3a] transition-colors flex-shrink-0"
            >
              <i className="fas fa-times text-[14px]"></i>
            </button>
          </div>

          {/* Metrics grid */}
          <div className="px-6 py-5 border-b border-[#e2e8f0]">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Volume',       value: fmtMM(operacaoAberta.volume),   icon: 'fa-chart-bar' },
                { label: 'Taxa',         value: operacaoAberta.taxa,             icon: 'fa-percentage' },
                { label: 'Prazo',        value: `${operacaoAberta.prazo} meses`, icon: 'fa-clock' },
                { label: 'Setor',        value: operacaoAberta.setor,            icon: 'fa-industry' },
                { label: 'Emissão',      value: operacaoAberta.emissao,          icon: 'fa-calendar-plus' },
                { label: 'Vencimento',   value: operacaoAberta.vencimento,       icon: 'fa-calendar-check' },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#94a3b8] flex items-center gap-1.5 mb-1">
                    <i className={`fas ${item.icon} text-[9px]`}></i>
                    {item.label}
                  </div>
                  <div className="text-[13px] font-semibold text-[#0b1f3a]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Comissão box */}
          <div className="px-6 py-4 border-b border-[#e2e8f0] bg-[#f0fdf4]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#15803d] mb-0.5">
                  <i className="fas fa-coins mr-1.5"></i>Comissão Recebida
                </div>
                <div className="font-['Playfair_Display'] text-[22px] font-semibold text-[#0b1f3a]">
                  {fmtMil(operacaoAberta.comissao)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#94a3b8] mb-0.5">% sobre volume</div>
                <div className="text-[14px] font-bold text-[#059669]">
                  {((operacaoAberta.comissao / (operacaoAberta.volume * 1000)) * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Events timeline */}
          <div className="px-6 py-5 flex-1">
            <div className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] mb-4">
              <i className="fas fa-history mr-1.5"></i>Histórico de Eventos
            </div>
            <div className="relative">
              <div className="absolute left-[7px] top-0 bottom-0 w-px bg-[#e2e8f0]"></div>
              <div className="space-y-4">
                {operacaoAberta.eventos.map((ev, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 relative z-10 ${
                      i === 0
                        ? 'border-[#1a6edb] bg-[#1a6edb]'
                        : 'border-[#e2e8f0] bg-white'
                    }`}></div>
                    <div className="flex-1 pb-1">
                      <div className="text-[10px] font-semibold text-[#94a3b8] mb-0.5">{ev.data}</div>
                      <div className="text-[12.5px] text-[#475569] leading-relaxed">{ev.texto}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 border-t border-[#e2e8f0] bg-[#fafbfc] flex gap-2.5">
            <Button variant="primary" size="sm" className="flex-1" icon={<i className="fas fa-folder-open"></i>}>
              Ver Documentos
            </Button>
            <Button variant="secondary" size="sm" icon={<i className="fas fa-file-pdf"></i>}>
              Relatório
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
