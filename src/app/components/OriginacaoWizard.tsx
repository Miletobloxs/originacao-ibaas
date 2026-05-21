import { useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PolarRadiusAxis,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import {
  PageHeader, Card, CardBody, Button,
  Input, Select, Textarea, Stepper, InfoBox, Badge, Spinner,
} from './ds';
import { SECTOR_DATA, RADAR_LABELS } from '../data/sectorData';
import { DOCS_GERAIS, DOCS_ESPECIFICOS } from '../data/documentsData';
import { INSTRUMENTS, COMMISSION_RATES, suggestInstruments } from '../data/instrumentData';
import { useDraftPersist, clearDraft } from '../hooks/useDraftPersist';
import type { Deal, Instrument as DealInstrument } from './DealFlowPage';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface GarantiaItem {
  id: string;
  tipo: string;
  hierarquia: 'Principal' | 'Complementar' | 'Adicional';
  valor: string;
  valorMercado?: string;
  fileName?: string;
}

interface WizardState {
  step: number;
  sector: string;
  checkedDocs: Record<string, boolean>;
  selectedInstruments: string[];
  instrumento: string;
  volume: string;
  indexador: string;
  spread: string;
  prazo: string;
  amortizacao: string;
  descricao: string;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  contato: string;
  email: string;
  telefone: string;
  usoRecursos: string;
  rating: string;
  garantias: GarantiaItem[];
  showDCC: boolean;
  confirmado: boolean;
}

type Action =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_SECTOR'; payload: string }
  | { type: 'SET_FIELD'; key: keyof Omit<WizardState, 'step' | 'checkedDocs' | 'selectedInstruments' | 'garantias' | 'showDCC' | 'confirmado'>; value: string }
  | { type: 'TOGGLE_DOC'; id: string }
  | { type: 'TOGGLE_INSTRUMENT'; id: string }
  | { type: 'SET_GARANTIAS'; payload: GarantiaItem[] }
  | { type: 'TOGGLE_DCC' }
  | { type: 'TOGGLE_CONFIRMADO' }
  | { type: 'RESTORE'; payload: WizardState }
  | { type: 'RESET' };

interface Props {
  onNavigate?: (page: string) => void;
  onNewDeal?: (deal: Deal) => void;
}

// ─── INITIAL STATE ────────────────────────────────────────────────────────────

const INITIAL_STATE: WizardState = {
  step: 1,
  sector: '',
  checkedDocs: {},
  selectedInstruments: [],
  instrumento: '',
  volume: '',
  indexador: 'CDI+',
  spread: '',
  prazo: '',
  amortizacao: '',
  descricao: '',
  razaoSocial: '',
  cnpj: '',
  endereco: '',
  contato: '',
  email: '',
  telefone: '',
  usoRecursos: '',
  rating: '',
  garantias: [{ id: '1', tipo: '', hierarquia: 'Principal', valor: '' }],
  showDCC: false,
  confirmado: false,
};

// ─── REDUCER ──────────────────────────────────────────────────────────────────

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_SECTOR':
      return { ...state, sector: action.payload, selectedInstruments: [] };
    case 'SET_FIELD':
      return { ...state, [action.key]: action.value };
    case 'TOGGLE_DOC': {
      const id = action.id;
      return { ...state, checkedDocs: { ...state.checkedDocs, [id]: !state.checkedDocs[id] } };
    }
    case 'TOGGLE_INSTRUMENT': {
      const id = action.id;
      const has = state.selectedInstruments.includes(id);
      const next = has
        ? state.selectedInstruments.filter(i => i !== id)
        : [...state.selectedInstruments, id];
      return {
        ...state,
        selectedInstruments: next,
        instrumento: next.length === 1 ? next[0] : state.instrumento,
      };
    }
    case 'SET_GARANTIAS':
      return { ...state, garantias: action.payload };
    case 'TOGGLE_DCC':
      return { ...state, showDCC: !state.showDCC };
    case 'TOGGLE_CONFIRMADO':
      return { ...state, confirmado: !state.confirmado };
    case 'RESTORE':
      return { ...action.payload, step: 1 };
    case 'RESET':
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}

// ─── SECTOR CONFIG ────────────────────────────────────────────────────────────

const SECTORS: { key: string; icon: string; color: string }[] = [
  { key: 'Imobiliário',   icon: 'fa-building',       color: '#0b1f3a' },
  { key: 'Agronegócio',   icon: 'fa-seedling',        color: '#059669' },
  { key: 'Energia Solar', icon: 'fa-solar-panel',     color: '#d97706' },
  { key: 'Energia Eólica',icon: 'fa-wind',            color: '#0ea5e9' },
  { key: 'Infraestrutura',icon: 'fa-road',            color: '#475569' },
  { key: 'Transportes',   icon: 'fa-truck',           color: '#7c3aed' },
  { key: 'Data Center',   icon: 'fa-server',          color: '#1a6edb' },
  { key: 'Telecom',       icon: 'fa-satellite-dish',  color: '#db2777' },
  { key: 'Varejo',        icon: 'fa-shopping-cart',   color: '#ea580c' },
  { key: 'Criptoeconomia',icon: 'fa-coins',           color: '#ca8a04' },
  { key: 'Serviços',      icon: 'fa-briefcase',       color: '#64748b' },
  { key: 'Outro',         icon: 'fa-ellipsis-h',      color: '#94a3b8' },
];

// ─── WIZARD STEPS ─────────────────────────────────────────────────────────────

const WIZARD_STEPS = [
  { label: 'Setor',        description: 'Selecione o setor de atuação' },
  { label: 'Análise',      description: 'Riscos e perfil de investidores' },
  { label: 'Documentos',   description: 'Checklist de documentação' },
  { label: 'Instrumento',  description: 'Escolha o veículo de captação' },
  { label: 'Operação',     description: 'Dados do emissor e condições' },
  { label: 'Revisão',      description: 'Confirme e submeta' },
];

// ─── MASKS ────────────────────────────────────────────────────────────────────

function maskCNPJ(v: string) {
  return v.replace(/\D/g, '').slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function maskPhone(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{4})$/, '$1-$2');
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function parseMM(v: string) {
  return parseInt(v.replace(/\D/g, '')) || 0;
}

function calcViabilidade(sector: string): number {
  const data = SECTOR_DATA[sector];
  if (!data) return 50;
  const avg = data.risks.reduce((s, r) => s + r.pct, 0) / data.risks.length;
  return Math.round(100 - avg);
}

type DSCRLevel = 'verde' | 'ambar' | 'neutro';

function calcDSCR(prazo: string, spread: string, volume: string, indexador: string): DSCRLevel {
  const prazoN = parseInt(prazo) || 0;
  const spreadN = parseFloat(spread.replace(',', '.')) || 0;
  const volumeN = parseMM(volume);
  if (volumeN < 5) return 'ambar';
  const isCDI = indexador.startsWith('CDI');
  if (isCDI && prazoN >= 36 && spreadN <= 6) return 'verde';
  if (prazoN < 12 || spreadN > 8) return 'ambar';
  return 'neutro';
}

function calcCommission(instrumentId: string, volumeStr: string): number {
  const rate = COMMISSION_RATES[instrumentId] ?? 0;
  const volume = parseMM(volumeStr) * 1_000_000;
  return rate * volume;
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

const VALID_INSTRUMENTS_DEAL: DealInstrument[] = ['CRI', 'CRA', 'CR', 'FIDC', 'Debênture', 'Nota Comercial', 'A definir'];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function RiskTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-lg px-4 py-3 text-[12px]">
      <div className="font-semibold text-[#0b1f3a] mb-1">{label}</div>
      <div className="text-[#1a6edb] font-semibold">{payload[0].value}% de risco</div>
    </div>
  );
}

function DSCRBadge({ level }: { level: DSCRLevel }) {
  if (level === 'neutro') return null;
  const cfg = {
    verde: { bg: '#f0fdf4', border: '#86efac', text: '#15803d', icon: 'fa-shield-alt', label: 'Estrutura favorável ao investidor' },
    ambar: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', icon: 'fa-exclamation-triangle', label: 'Atenção — reavalie prazo ou taxa' },
  }[level];
  return (
    <div className="flex items-center gap-2 rounded-xl px-4 py-3 border" style={{ background: cfg.bg, borderColor: cfg.border }}>
      <i className={`fas ${cfg.icon} text-[13px]`} style={{ color: cfg.text }}></i>
      <span className="text-[12.5px] font-semibold" style={{ color: cfg.text }}>{cfg.label}</span>
    </div>
  );
}

// ─── COMMISSION LIVE ──────────────────────────────────────────────────────────

function CommissionLive({ instrumento, volume }: { instrumento: string; volume: string }) {
  const inst = INSTRUMENTS.find(i => i.id === instrumento);
  const commission = inst ? calcCommission(instrumento, volume) : 0;
  const rate = inst ? COMMISSION_RATES[instrumento] * 100 : 0;

  return (
    <div className="bg-[#f0fdf4] border border-[#86efac] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <i className="fas fa-coins text-[#059669] text-[12px]"></i>
        <span className="text-[12.5px] font-semibold text-[#15803d]">Comissão Projetada</span>
      </div>
      {!inst || !parseMM(volume) ? (
        <p className="text-[12px] text-[#64748b]">Selecione um instrumento e informe o volume para calcular.</p>
      ) : (
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[11px] text-[#64748b]">{inst.label} · {rate.toFixed(1)}% de comissão</span>
            <span className="text-[16px] font-bold text-[#059669]">{fmtBRL(commission)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-[#94a3b8]">
            <span>Base de cálculo</span>
            <span>R$ {parseMM(volume)} MM = {fmtBRL(parseMM(volume) * 1_000_000)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP 1: SECTOR SELECTION ─────────────────────────────────────────────────

function Step1({ sector, dispatch }: { sector: string; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="space-y-6">
      <p className="text-[13px] text-[#64748b]">
        Escolha o setor principal da operação. A seleção orienta o perfil de risco, documentação exigida e instrumentos recomendados.
      </p>
      <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-3 max-md:grid-cols-2">
        {SECTORS.map(s => (
          <button
            key={s.key}
            onClick={() => dispatch({ type: 'SET_SECTOR', payload: s.key })}
            className={`flex flex-col items-center gap-3 p-5 rounded-[12px] border-[2px] transition-all hover:shadow-md ${
              sector === s.key
                ? 'border-[#1a6edb] bg-[#eef5ff] shadow-md'
                : 'border-[#e2e8f0] bg-white hover:border-[#1a6edb]/40 hover:bg-[#f8faff]'
            }`}
          >
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white text-[15px]"
              style={{ backgroundColor: sector === s.key ? '#1a6edb' : s.color }}
            >
              <i className={`fas ${s.icon}`}></i>
            </div>
            <span className={`text-[12px] font-semibold text-center leading-tight ${
              sector === s.key ? 'text-[#1a6edb]' : 'text-[#0b1f3a]'
            }`}>
              {s.key}
            </span>
          </button>
        ))}
      </div>
      {sector && (
        <div className="flex items-center gap-3 bg-[#f0fdf4] border border-[#86efac] rounded-xl px-4 py-3">
          <i className="fas fa-check-circle text-[#059669]"></i>
          <span className="text-[13px] font-semibold text-[#15803d]">
            Setor selecionado: <strong>{sector}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── STEP 2: SECTOR ANALYSIS ──────────────────────────────────────────────────

function Step2({ sector }: { sector: string }) {
  const data = SECTOR_DATA[sector];
  const viabilidade = calcViabilidade(sector);
  const vCfg =
    viabilidade >= 70 ? { label: 'Alta Viabilidade', color: '#059669', bg: '#f0fdf4', border: '#86efac' } :
    viabilidade >= 50 ? { label: 'Viabilidade Moderada', color: '#d97706', bg: '#fffbeb', border: '#fde68a' } :
                        { label: 'Baixa Viabilidade',   color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };

  if (!data) return <p className="text-[13px] text-[#94a3b8]">Nenhum dado disponível para este setor.</p>;

  const radarData = RADAR_LABELS.map((label, i) => ({ label, value: data.radarData[i] }));
  const barData = data.risks.map(r => ({ name: r.label.replace('Risco de ', '').replace('Risco ', ''), value: r.pct }));
  const barColors = data.risks.map(r => r.lvl === 'high' ? '#ef4444' : r.lvl === 'med' ? '#f59e0b' : '#22c55e');

  return (
    <div className="space-y-6">
      {/* Score de viabilidade */}
      <div className="flex items-center gap-4 rounded-xl p-4 border" style={{ background: vCfg.bg, borderColor: vCfg.border }}>
        <div className="w-14 h-14 rounded-full border-4 flex items-center justify-center text-[16px] font-bold flex-shrink-0"
          style={{ borderColor: vCfg.color, color: vCfg.color }}>
          {viabilidade}
        </div>
        <div>
          <div className="text-[13px] font-bold" style={{ color: vCfg.color }}>{vCfg.label}</div>
          <div className="text-[11.5px] text-[#64748b] mt-0.5">
            Score de viabilidade para o setor <strong className="text-[#0b1f3a]">{sector}</strong> baseado no perfil médio de risco.
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] mb-3">Radar de Riscos</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="label" tick={{ fontSize: 9, fill: '#64748b' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8, fill: '#94a3b8' }} />
              <Radar name="Risco" dataKey="value" stroke="#1a6edb" fill="#1a6edb" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] mb-3">Score por Dimensão</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} layout="vertical" barSize={12} margin={{ top: 0, right: 16, bottom: 0, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9.5, fill: '#475569' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip content={<RiskTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {barData.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risks list */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] mb-3">Fatores de Risco</div>
        <div className="space-y-2">
          {data.risks.map((r, i) => {
            const cfg =
              r.lvl === 'high' ? { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', badge: 'bg-[#fecaca] text-[#dc2626]' } :
              r.lvl === 'med'  ? { bg: '#fffbeb', border: '#fde68a', text: '#d97706', badge: 'bg-[#fde68a] text-[#92400e]' } :
                                 { bg: '#f0fdf4', border: '#86efac', text: '#059669', badge: 'bg-[#bbf7d0] text-[#15803d]' };
            return (
              <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3 border" style={{ background: cfg.bg, borderColor: cfg.border }}>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${cfg.badge}`}>
                  {r.pct}%
                </span>
                <div>
                  <div className="text-[12.5px] font-semibold" style={{ color: cfg.text }}>{r.label}</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">{r.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investors */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] mb-2">Perfil de Investidor Típico</div>
        <div className="flex flex-wrap gap-2">
          {data.investors.map((inv, i) => (
            <span key={i} className="text-[12px] font-medium px-3 py-1.5 bg-[#f1f5f9] text-[#475569] rounded-full border border-[#e2e8f0]">
              {inv}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3: DOCUMENTS CHECKLIST ─────────────────────────────────────────────

function Step3({ sector, checkedDocs, dispatch }: {
  sector: string;
  checkedDocs: Record<string, boolean>;
  dispatch: React.Dispatch<Action>;
}) {
  const sectorDocs = DOCS_ESPECIFICOS[sector] ?? [];
  const allDocs = [...DOCS_GERAIS, ...sectorDocs];
  const checkedCount = allDocs.filter(d => checkedDocs[d.id]).length;
  const requiredTotal = allDocs.filter(d => d.required).length;
  const checkedRequired = allDocs.filter(d => d.required && checkedDocs[d.id]).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#64748b]">
          Indique quais documentos já estão disponíveis. Documentos obrigatórios são necessários para a análise.
        </p>
        <span className="text-[12px] font-semibold text-[#1a6edb] flex-shrink-0 ml-4">
          {checkedCount} / {allDocs.length} marcados
        </span>
      </div>

      {checkedRequired < requiredTotal && (
        <InfoBox variant="warning">
          <span className="text-[12.5px]">
            {requiredTotal - checkedRequired} documento(s) obrigatório(s) ainda não marcado(s).
            Você pode avançar, mas a análise só terá início após o envio completo.
          </span>
        </InfoBox>
      )}

      {/* Gerais */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] mb-3">
          Documentos Gerais ({DOCS_GERAIS.length})
        </div>
        <div className="space-y-2">
          {DOCS_GERAIS.map(doc => (
            <DocRow key={doc.id} doc={doc} checked={!!checkedDocs[doc.id]} onToggle={() => dispatch({ type: 'TOGGLE_DOC', id: doc.id })} />
          ))}
        </div>
      </div>

      {/* Específicos do setor */}
      {sectorDocs.length > 0 && (
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] mb-3">
            Documentos Específicos — {sector} ({sectorDocs.length})
          </div>
          <div className="space-y-2">
            {sectorDocs.map(doc => (
              <DocRow key={doc.id} doc={doc} checked={!!checkedDocs[doc.id]} onToggle={() => dispatch({ type: 'TOGGLE_DOC', id: doc.id })} />
            ))}
          </div>
        </div>
      )}

      {/* Upload zone */}
      <div>
        <div className="text-[13px] font-medium text-[#1e293b] mb-1.5">
          Envio Antecipado <span className="text-[11px] text-[#94a3b8] font-normal">(opcional)</span>
        </div>
        <label className="block border-2 border-dashed border-[#e2e8f0] rounded-xl p-6 text-center hover:border-[#1a6edb]/50 hover:bg-[#f8faff] transition-all cursor-pointer">
          <i className="fas fa-cloud-upload-alt text-[24px] text-[#94a3b8] mb-2 block"></i>
          <div className="text-[12.5px] font-semibold text-[#0b1f3a] mb-0.5">Arraste ou clique para selecionar</div>
          <div className="text-[11px] text-[#94a3b8]">PDF, XLSX, DOC — máx. 10 MB por arquivo</div>
          <input type="file" multiple accept=".pdf,.xlsx,.xls,.doc,.docx" className="hidden" />
        </label>
      </div>
    </div>
  );
}

function DocRow({ doc, checked, onToggle }: { doc: { id: string; label: string; required: boolean }; checked: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
        checked ? 'bg-[#f0fdf4] border-[#86efac]' : 'bg-white border-[#e2e8f0] hover:border-[#1a6edb]/40 hover:bg-[#f8faff]'
      }`}
    >
      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
        checked ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[#d1d5db]'
      }`}>
        {checked && <i className="fas fa-check text-white text-[9px]"></i>}
      </div>
      <span className={`text-[12.5px] flex-1 ${checked ? 'text-[#15803d] line-through opacity-70' : 'text-[#0b1f3a]'}`}>
        {doc.label}
      </span>
      {doc.required && !checked && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fef2f2] text-[#dc2626]">
          Obrigatório
        </span>
      )}
    </div>
  );
}

// ─── STEP 4: INSTRUMENT SELECTION ─────────────────────────────────────────────

function Step4({ sector, volume, selectedInstruments, dispatch }: {
  sector: string;
  volume: string;
  selectedInstruments: string[];
  dispatch: React.Dispatch<Action>;
}) {
  const volumeN = parseMM(volume);
  const suggestions = suggestInstruments(sector, volumeN);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <div className="flex-1">
          <Input
            label="Volume Pretendido (R$ MM)"
            value={volume}
            onChange={e => dispatch({ type: 'SET_FIELD', key: 'volume', value: e.target.value.replace(/\D/g, '').slice(0, 5) })}
            placeholder="Ex: 50"
            rightIcon={<span className="text-[11px] font-semibold">MM</span>}
            helperText="Informe o volume para ver recomendações de instrumentos"
          />
        </div>
        {selectedInstruments.length > 0 && (
          <div className="mt-4 flex-shrink-0">
            <span className="text-[12px] font-semibold text-[#1a6edb]">
              {selectedInstruments.length} selecionado(s)
            </span>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <InfoBox variant="info" icon={<i className="fas fa-lightbulb"></i>} title="Instrumentos recomendados">
          <span className="text-[12.5px]">
            Com base no setor <strong>{sector}</strong> e volume de <strong>R$ {volumeN} MM</strong>, recomendamos:{' '}
            {suggestions.map(id => INSTRUMENTS.find(i => i.id === id)?.label).filter(Boolean).join(', ')}.
          </span>
        </InfoBox>
      )}

      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {INSTRUMENTS.map(inst => {
          const selected = selectedInstruments.includes(inst.id);
          const recommended = suggestions.includes(inst.id);
          const eligible = !volumeN || (volumeN * 1_000_000 >= inst.minVolume && volumeN * 1_000_000 <= inst.maxVolume);
          const rate = (COMMISSION_RATES[inst.id] * 100).toFixed(1);
          const commission = volumeN ? calcCommission(inst.id, String(volumeN)) : 0;

          return (
            <button
              key={inst.id}
              onClick={() => dispatch({ type: 'TOGGLE_INSTRUMENT', id: inst.id })}
              className={`text-left p-4 rounded-[12px] border-[2px] transition-all ${
                selected
                  ? 'border-[#1a6edb] bg-[#eef5ff] shadow-md'
                  : !eligible
                  ? 'border-[#e2e8f0] bg-[#fafbfc] opacity-50 cursor-not-allowed'
                  : 'border-[#e2e8f0] bg-white hover:border-[#1a6edb]/40 hover:bg-[#f8faff]'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[14px] font-bold ${selected ? 'text-[#1a6edb]' : 'text-[#0b1f3a]'}`}>
                    {inst.label}
                  </span>
                  {recommended && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9]">
                      ★ Recomendado
                    </span>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  selected ? 'bg-[#1a6edb] border-[#1a6edb]' : 'border-[#d1d5db]'
                }`}>
                  {selected && <i className="fas fa-check text-white text-[8px]"></i>}
                </div>
              </div>
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b]">
                {inst.tag}
              </span>
              <p className="text-[11.5px] text-[#64748b] mt-2 leading-relaxed">{inst.desc}</p>
              <div className="mt-3 pt-3 border-t border-[#f1f5f9] flex justify-between text-[11px] text-[#94a3b8]">
                <span>Comissão: <strong className="text-[#059669]">{rate}%</strong></span>
                {commission > 0 && (
                  <span className="font-semibold text-[#059669]">≈ {fmtBRL(commission)}</span>
                )}
                {!commission && (
                  <span>Min: R$ {(inst.minVolume / 1_000_000).toFixed(0)} MM · Max: R$ {(inst.maxVolume / 1_000_000).toFixed(0)} MM</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 5: OPERATION FORM ───────────────────────────────────────────────────

function Step5({
  state, dispatch,
  errors, setErrors,
  cnpjLoading, setCnpjLoading,
}: {
  state: WizardState;
  dispatch: React.Dispatch<Action>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  cnpjLoading: boolean;
  setCnpjLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { instrumento, volume, indexador, spread, prazo, amortizacao, descricao,
    razaoSocial, cnpj, endereco, contato, email, telefone, usoRecursos, rating,
    garantias, showDCC } = state;

  function field(key: keyof Omit<WizardState, 'step' | 'checkedDocs' | 'selectedInstruments' | 'garantias' | 'showDCC' | 'confirmado'>, value: string) {
    dispatch({ type: 'SET_FIELD', key, value });
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  }

  const volumeMM = parseMM(volume);
  const totalGarantiaMM = garantias.reduce((s, g) => s + parseMM(g.valor), 0);
  const ltv = volumeMM > 0 ? Math.round((totalGarantiaMM / volumeMM) * 100) : 0;
  const dscr = calcDSCR(prazo, spread, volume, indexador);

  async function fetchCNPJ(raw: string) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 14) return;
    setCnpjLoading(true);
    try {
      const res = await fetch(`https://publica.cnpj.ws/cnpj/${digits}`);
      if (!res.ok) throw new Error('not found');
      const json = await res.json() as {
        razao_social?: string;
        logradouro?: string;
        municipio?: string;
        uf?: string;
        cep?: string;
      };
      if (json.razao_social) field('razaoSocial', json.razao_social);
      if (json.logradouro) {
        const addr = [json.logradouro, json.municipio, json.uf, json.cep].filter(Boolean).join(', ');
        field('endereco', addr);
      }
    } catch {
      // API unavailable — ignore silently
    } finally {
      setCnpjLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Financial conditions */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] mb-3">Condições da Operação</div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-5">
            <Select
              label="Instrumento *"
              value={instrumento}
              onChange={e => field('instrumento', e.target.value)}
              error={errors.instrumento}
              options={[
                { value: '',              label: 'Selecione' },
                ...INSTRUMENTS.map(i => ({ value: i.id, label: i.label })),
              ]}
            />
            <Input
              label="Volume Pretendido (R$ MM) *"
              value={volume}
              onChange={e => field('volume', e.target.value.replace(/\D/g, '').slice(0, 5))}
              error={errors.volume}
              placeholder="Ex: 50"
              rightIcon={<span className="text-[11px] font-semibold">MM</span>}
            />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <Select
              label="Indexador"
              value={indexador}
              onChange={e => field('indexador', e.target.value)}
              options={[
                { value: 'CDI+',     label: 'CDI+' },
                { value: 'IPCA+',    label: 'IPCA+' },
                { value: 'Prefixado', label: 'Prefixado' },
                { value: 'TJLP+',    label: 'TJLP+' },
              ]}
            />
            <Input
              label="Spread / Taxa (% a.a.) *"
              value={spread}
              onChange={e => field('spread', e.target.value)}
              error={errors.spread}
              placeholder="Ex: 3,5"
              rightIcon={<span className="text-[11px] font-semibold">%</span>}
            />
            <Input
              label="Prazo (meses) *"
              value={prazo}
              onChange={e => field('prazo', e.target.value.replace(/\D/g, '').slice(0, 3))}
              error={errors.prazo}
              placeholder="Ex: 36"
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Select
              label="Amortização *"
              value={amortizacao}
              onChange={e => field('amortizacao', e.target.value)}
              error={errors.amortizacao}
              options={[
                { value: '',           label: 'Selecione' },
                { value: 'Bullet',     label: 'Bullet (pagamento único)' },
                { value: 'SAC',        label: 'SAC — Amortização Constante' },
                { value: 'SAF',        label: 'SAF — Sistema Francês (Price)' },
                { value: 'Customizado', label: 'Customizado' },
              ]}
            />
            <Select
              label="Rating Pretendido"
              value={rating}
              onChange={e => field('rating', e.target.value)}
              options={[
                { value: '',    label: 'Não definido / A definir' },
                { value: 'AAA', label: 'AAA' }, { value: 'AA+', label: 'AA+' },
                { value: 'AA',  label: 'AA' },  { value: 'AA-', label: 'AA-' },
                { value: 'A+',  label: 'A+' },  { value: 'A',   label: 'A' },
                { value: 'A-',  label: 'A-' },  { value: 'BBB', label: 'BBB' },
                { value: 'NR',  label: 'NR (não solicitado)' },
              ]}
            />
          </div>

          <DSCRBadge level={dscr} />
          <CommissionLive instrumento={instrumento} volume={volume} />

          <Textarea
            label="Descrição da Operação"
            value={descricao}
            onChange={e => field('descricao', e.target.value)}
            placeholder="Descreva o objetivo da captação, estrutura proposta e informações relevantes..."
            rows={3}
          />
        </div>
      </div>

      {/* Issuer info */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] mb-3">Dados do Emissor / Tomador</div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Input
                label="CNPJ *"
                value={cnpj}
                onChange={e => {
                  const masked = maskCNPJ(e.target.value);
                  field('cnpj', masked);
                  fetchCNPJ(masked);
                }}
                error={errors.cnpj}
                placeholder="00.000.000/0001-00"
                rightIcon={cnpjLoading ? <Spinner size="sm" /> : undefined}
              />
            </div>
            <Input
              label="Razão Social *"
              value={razaoSocial}
              onChange={e => field('razaoSocial', e.target.value)}
              error={errors.razaoSocial}
              placeholder="Nome completo conforme CNPJ"
            />
          </div>
          <Input
            label="Endereço da Sede"
            value={endereco}
            onChange={e => field('endereco', e.target.value)}
            placeholder="Rua, número, cidade, UF, CEP"
          />
          <div className="grid grid-cols-3 gap-5">
            <Input
              label="Responsável"
              value={contato}
              onChange={e => field('contato', e.target.value)}
              placeholder="Nome completo"
            />
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={e => field('email', e.target.value)}
              placeholder="contato@empresa.com.br"
            />
            <Input
              label="Telefone"
              value={telefone}
              onChange={e => field('telefone', maskPhone(e.target.value))}
              placeholder="(11) 99999-0000"
            />
          </div>
          <Textarea
            label="Uso dos Recursos"
            value={usoRecursos}
            onChange={e => field('usoRecursos', e.target.value)}
            placeholder="Descreva como os recursos captados serão utilizados..."
            rows={3}
          />
        </div>
      </div>

      {/* Guarantees */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8] mb-3">Garantias</div>
        <div className="space-y-3">
          {garantias.map((g, idx) => (
            <div key={g.id} className="border border-[#e2e8f0] rounded-xl p-4 bg-[#fafbfc]">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${
                  g.hierarquia === 'Principal'    ? 'bg-[#ede9fe] text-[#6d28d9]' :
                  g.hierarquia === 'Complementar' ? 'bg-[#e0f2fe] text-[#0369a1]' :
                                                    'bg-[#f1f5f9] text-[#475569]'
                }`}>
                  {idx + 1}ª camada — {g.hierarquia}
                </span>
                {garantias.length > 1 && (
                  <button
                    onClick={() => dispatch({ type: 'SET_GARANTIAS', payload: garantias.filter(x => x.id !== g.id) })}
                    className="text-[11px] text-[#94a3b8] hover:text-[#dc2626] transition-colors"
                  >
                    <i className="fas fa-times mr-1"></i>Remover
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <Select
                  label="Tipo de Garantia"
                  value={g.tipo}
                  onChange={e => dispatch({ type: 'SET_GARANTIAS', payload: garantias.map(x => x.id === g.id ? { ...x, tipo: e.target.value } : x) })}
                  options={[
                    { value: '', label: 'Selecione' },
                    { value: 'Alienação Fiduciária de Imóvel', label: 'Alienação Fiduciária de Imóvel' },
                    { value: 'Cessão de Recebíveis',           label: 'Cessão de Recebíveis' },
                    { value: 'Aval / Garantia Corporativa',    label: 'Aval / Garantia Corporativa' },
                    { value: 'Fundo de Reserva',               label: 'Fundo de Reserva' },
                    { value: 'Penhor de Ações',                label: 'Penhor de Ações' },
                    { value: 'Seguro de Crédito',              label: 'Seguro de Crédito' },
                    { value: 'Outras',                         label: 'Outras' },
                  ]}
                />
                <Select
                  label="Hierarquia"
                  value={g.hierarquia}
                  onChange={e => dispatch({ type: 'SET_GARANTIAS', payload: garantias.map(x => x.id === g.id ? { ...x, hierarquia: e.target.value as GarantiaItem['hierarquia'] } : x) })}
                  options={[
                    { value: 'Principal',    label: 'Principal (1ª camada)'    },
                    { value: 'Complementar', label: 'Complementar (2ª camada)' },
                    { value: 'Adicional',    label: 'Adicional (3ª camada)'    },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Valor declarado (R$ MM)"
                  value={g.valor}
                  onChange={e => dispatch({ type: 'SET_GARANTIAS', payload: garantias.map(x => x.id === g.id ? { ...x, valor: e.target.value.replace(/\D/g, '').slice(0, 5) } : x) })}
                  placeholder="Ex: 75"
                  rightIcon={<span className="text-[11px] font-semibold">MM</span>}
                />
                <Input
                  label="Valor de mercado (R$ MM)"
                  value={g.valorMercado ?? ''}
                  onChange={e => dispatch({ type: 'SET_GARANTIAS', payload: garantias.map(x => x.id === g.id ? { ...x, valorMercado: e.target.value.replace(/\D/g, '').slice(0, 5) } : x) })}
                  placeholder="Laudo / avaliação"
                  rightIcon={<span className="text-[11px] font-semibold">MM</span>}
                />
              </div>
              {(() => {
                const vD = parseMM(g.valor);
                const vM = parseMM(g.valorMercado ?? '');
                if (!vD || !vM) return null;
                const delta = ((vM - vD) / vD) * 100;
                const up = delta >= 0;
                return (
                  <div className={`mt-1.5 flex items-center gap-1.5 text-[11px] font-medium ${up ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
                    <i className={`fas fa-arrow-${up ? 'up' : 'down'} text-[9px]`}></i>
                    Mercado {up ? 'acima' : 'abaixo'} em {Math.abs(delta).toFixed(1)}% vs. declarado
                  </div>
                );
              })()}
              {volumeMM > 0 && parseMM(g.valor) > 0 && (() => {
                const ltvInd = Math.round((parseMM(g.valor) / volumeMM) * 100);
                const color = ltvInd >= 30 ? '#059669' : ltvInd >= 15 ? '#d97706' : '#dc2626';
                return (
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium" style={{ color }}>
                    <i className="fas fa-shield-alt text-[9px]"></i>
                    Cobertura individual: {ltvInd}% do volume
                  </div>
                );
              })()}
              <div className="mt-3 pt-3 border-t border-[#e2e8f0] flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#64748b] hover:text-[#1a6edb] cursor-pointer transition-colors">
                  <i className="fas fa-paperclip text-[10px]"></i>
                  {g.fileName ? g.fileName : 'Anexar documento'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) dispatch({ type: 'SET_GARANTIAS', payload: garantias.map(x => x.id === g.id ? { ...x, fileName: file.name } : x) });
                    }}
                  />
                </label>
                {g.fileName && (
                  <button
                    onClick={() => dispatch({ type: 'SET_GARANTIAS', payload: garantias.map(x => x.id === g.id ? { ...x, fileName: undefined } : x) })}
                    className="text-[10px] text-[#94a3b8] hover:text-[#dc2626] transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => dispatch({
              type: 'SET_GARANTIAS',
              payload: [...garantias, {
                id: String(Date.now()),
                tipo: '',
                hierarquia: garantias.length === 0 ? 'Principal' : garantias.length === 1 ? 'Complementar' : 'Adicional',
                valor: '',
              }],
            })}
            className="w-full py-3 border-2 border-dashed border-[#e2e8f0] rounded-xl text-[13px] font-semibold text-[#64748b] hover:border-[#1a6edb] hover:text-[#1a6edb] hover:bg-[#f8faff] transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus text-[12px]"></i>
            Adicionar Garantia
          </button>

          {volumeMM > 0 && totalGarantiaMM > 0 && (
            <div className={`rounded-xl p-4 border ${
              ltv >= 100 ? 'bg-[#f0fdf4] border-[#86efac]' :
              ltv >= 70  ? 'bg-[#fffbeb] border-[#fde68a]' :
                           'bg-[#fef2f2] border-[#fecaca]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[12px] font-semibold ${ltv >= 100 ? 'text-[#15803d]' : ltv >= 70 ? 'text-[#92400e]' : 'text-[#dc2626]'}`}>
                  <i className={`fas ${ltv >= 100 ? 'fa-shield-alt' : ltv >= 70 ? 'fa-exclamation-triangle' : 'fa-times-circle'} mr-1.5`}></i>
                  LTV Global: {ltv}%
                </span>
                <span className="text-[11px] text-[#94a3b8]">R$ {totalGarantiaMM}MM / R$ {volumeMM}MM</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${ltv >= 100 ? 'bg-[#22c55e]' : ltv >= 70 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'}`}
                  style={{ width: `${Math.min(ltv, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DCC Box */}
      <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_DCC' })}
          className="w-full flex items-center justify-between px-5 py-4 bg-[#fafbfc] hover:bg-[#f1f5f9] transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[#0b1f3a] flex items-center justify-center flex-shrink-0">
              <i className="fas fa-cube text-white text-[12px]"></i>
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#0b1f3a] flex items-center gap-2">
                DCC — Digital Cash Collateral
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9]">Novo</span>
              </div>
              <div className="text-[11.5px] text-[#64748b] mt-0.5">Construa colateral líquido digital para esta operação</div>
            </div>
          </div>
          <i className={`fas fa-chevron-${showDCC ? 'up' : 'down'} text-[11px] text-[#94a3b8] group-hover:text-[#0b1f3a] transition-all flex-shrink-0`}></i>
        </button>
        {showDCC && (
          <div className="px-5 py-5 border-t border-[#e2e8f0] space-y-4">
            <p className="text-[13px] text-[#475569] leading-relaxed">
              O <strong className="text-[#0b1f3a]">DCC (Digital Cash Collateral)</strong> é um novo formato de colateral líquido da Bloxs — uma posição em caixa digital que substitui ou complementa garantias tradicionais. Em vez de imobilizar ativos físicos, o emissor deposita recursos tokenizados que ficam segregados e disponíveis para execução imediata em caso de inadimplência.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: 'fa-bolt',       title: 'Execução imediata',  desc: 'Colateral disponível para liquidação instantânea — sem necessidade de ação judicial.' },
                { icon: 'fa-water',      title: 'Colateral líquido',  desc: 'Recursos em caixa digital, sem imobilização de ativos físicos ou reais.' },
                { icon: 'fa-chart-line', title: 'Melhora o rating',   desc: 'Estrutura de colateral líquido eleva o perfil de crédito e pode reduzir o spread exigido.' },
              ].map((item, i) => (
                <div key={i} className="bg-[#f8fafc] rounded-[10px] p-3.5 border border-[#e2e8f0]">
                  <div className="w-7 h-7 rounded-[6px] bg-[#0b1f3a] flex items-center justify-center mb-2.5">
                    <i className={`fas ${item.icon} text-white text-[10px]`}></i>
                  </div>
                  <div className="text-[12px] font-semibold text-[#0b1f3a] mb-1">{item.title}</div>
                  <div className="text-[11px] text-[#64748b] leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-[#94a3b8] leading-relaxed max-w-[360px]">
                O DCC é opcional e complementar às garantias tradicionais. A estruturação ocorre em paralelo ao fluxo de aprovação.
              </p>
              <button
                onClick={() => window.open('https://bloxs.com.br', '_blank')}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#0b1f3a] text-white text-[12.5px] font-semibold rounded-[8px] hover:bg-[#1a6edb] transition-all"
              >
                <i className="fas fa-arrow-right text-[10px]"></i>
                Quero conhecer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STEP 6: REVIEW ───────────────────────────────────────────────────────────

function Step6({
  state, dispatch, goToStep, opId, errors,
}: {
  state: WizardState;
  dispatch: React.Dispatch<Action>;
  goToStep: (n: number) => void;
  opId: string;
  errors: Record<string, string>;
}) {
  const { sector, selectedInstruments, instrumento, volume, indexador, spread, prazo,
    amortizacao, rating, razaoSocial, cnpj, contato, email, garantias, checkedDocs,
    confirmado } = state;

  const volumeMM = parseMM(volume);
  const totalGarantiaMM = garantias.reduce((s, g) => s + parseMM(g.valor), 0);
  const ltv = volumeMM > 0 ? Math.round((totalGarantiaMM / volumeMM) * 100) : 0;

  const allDocs = [...DOCS_GERAIS, ...(DOCS_ESPECIFICOS[sector] ?? [])];
  const checkedCount = allDocs.filter(d => checkedDocs[d.id]).length;

  const instLabel = INSTRUMENTS.find(i => i.id === instrumento)?.label ?? instrumento;
  const commission = instrumento && volume ? calcCommission(instrumento, volume) : 0;

  const missingRequired: string[] = [];
  if (!instrumento) missingRequired.push('Instrumento');
  if (!volume) missingRequired.push('Volume');
  if (!spread) missingRequired.push('Taxa');
  if (!prazo) missingRequired.push('Prazo');
  if (!razaoSocial) missingRequired.push('Razão Social');
  if ((cnpj ?? '').replace(/\D/g, '').length < 14) missingRequired.push('CNPJ válido');

  return (
    <div className="space-y-5">
      {missingRequired.length > 0 && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <i className="fas fa-exclamation-circle text-[#dc2626] text-[13px]"></i>
            <span className="text-[12.5px] font-semibold text-[#dc2626]">Campos obrigatórios pendentes</span>
          </div>
          <p className="text-[12px] text-[#dc2626]">Retorne e preencha: {missingRequired.join(', ')}.</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Operação */}
        <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
              <i className="fas fa-file-alt mr-1.5"></i>Operação
            </span>
            <button onClick={() => goToStep(5)} className="text-[11px] text-[#1a6edb] font-semibold hover:underline">Editar</button>
          </div>
          <dl className="space-y-2">
            {[
              ['Setor',       sector || '—'],
              ['Instrumento', instLabel || '—'],
              ['Volume',      volume ? `R$ ${volume} MM` : '—'],
              ['Taxa',        spread ? `${indexador} ${spread}%` : '—'],
              ['Prazo',       prazo ? `${prazo} meses` : '—'],
              ['Amortização', amortizacao || '—'],
              ['Rating',      rating || 'A definir'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] uppercase font-semibold text-[#94a3b8]">{k}</dt>
                <dd className="text-[12.5px] font-semibold text-[#0b1f3a]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Emissor */}
        <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
              <i className="fas fa-building mr-1.5"></i>Emissor
            </span>
            <button onClick={() => goToStep(5)} className="text-[11px] text-[#1a6edb] font-semibold hover:underline">Editar</button>
          </div>
          <dl className="space-y-2">
            {[
              ['Razão Social', razaoSocial || '—'],
              ['CNPJ',         cnpj || '—'],
              ['Responsável',  contato || '—'],
              ['E-mail',       email || '—'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] uppercase font-semibold text-[#94a3b8]">{k}</dt>
                <dd className="text-[12.5px] font-semibold text-[#0b1f3a] break-all">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Garantias + Docs */}
        <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
              <i className="fas fa-shield-alt mr-1.5"></i>Garantias
            </span>
            <button onClick={() => goToStep(5)} className="text-[11px] text-[#1a6edb] font-semibold hover:underline">Editar</button>
          </div>
          <dl className="space-y-2">
            {garantias.map(g => (
              <div key={g.id}>
                <dt className="text-[10px] uppercase font-semibold text-[#94a3b8]">{g.hierarquia}</dt>
                <dd className="text-[12.5px] font-semibold text-[#0b1f3a]">
                  {g.tipo || 'Não definido'}{g.valor ? ` · R$ ${g.valor}MM` : ''}
                </dd>
              </div>
            ))}
            {ltv > 0 && (
              <div>
                <dt className="text-[10px] uppercase font-semibold text-[#94a3b8]">LTV Global</dt>
                <dd className="text-[12.5px] font-semibold text-[#0b1f3a]">{ltv}%</dd>
              </div>
            )}
            <div>
              <dt className="text-[10px] uppercase font-semibold text-[#94a3b8]">Documentos</dt>
              <dd className="text-[12.5px] font-semibold text-[#0b1f3a]">{checkedCount} / {allDocs.length} marcados</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Instruments selected */}
      {selectedInstruments.length > 1 && (
        <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
              <i className="fas fa-layer-group mr-1.5"></i>Instrumentos Explorados
            </span>
            <button onClick={() => goToStep(4)} className="text-[11px] text-[#1a6edb] font-semibold hover:underline">Editar</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedInstruments.map(id => (
              <Badge key={id} variant={id === instrumento ? 'primary' : 'gray'}>
                {INSTRUMENTS.find(i => i.id === id)?.label ?? id}
                {id === instrumento && ' ★ Principal'}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Commission */}
      {commission > 0 && (
        <div className="flex items-center justify-between bg-[#f0fdf4] border border-[#86efac] rounded-xl px-5 py-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Comissão Projetada</div>
            <div className="text-[20px] font-bold text-[#059669]">{fmtBRL(commission)}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#64748b]">{instLabel} · {((COMMISSION_RATES[instrumento] ?? 0) * 100).toFixed(1)}%</div>
            <div className="text-[12px] text-[#94a3b8]">sobre R$ {volumeMM} MM</div>
          </div>
        </div>
      )}

      <InfoBox variant="info">
        <span className="text-[12.5px]">
          Ao enviar, esta operação será registrada como <strong>{opId}</strong> no Deal Flow com status{' '}
          <strong>"Originação"</strong>. A equipe de estruturação da Bloxs iniciará a análise em até 2 dias úteis.
        </span>
      </InfoBox>

      {/* Confirmation checkbox */}
      <div
        onClick={() => dispatch({ type: 'TOGGLE_CONFIRMADO' })}
        className={`flex items-start gap-3 p-4 rounded-xl border-[1.5px] cursor-pointer transition-all ${
          confirmado
            ? 'bg-[#f0fdf4] border-[#22c55e]'
            : errors.confirmado
            ? 'bg-[#fef2f2] border-[#ef4444]'
            : 'bg-white border-[#e2e8f0] hover:border-[#1a6edb]'
        }`}
      >
        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all ${
          confirmado ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[#d1d5db]'
        }`}>
          {confirmado && <i className="fas fa-check text-white text-[9px]"></i>}
        </div>
        <span className="text-[13px] text-[#475569] leading-relaxed">
          Confirmo que as informações prestadas são verídicas e autorizo a{' '}
          <strong className="text-[#0b1f3a]">Bloxs IBaaS</strong> a iniciar o processo de análise e estruturação desta operação.
        </span>
      </div>
      {errors.confirmado && <p className="text-[12px] text-[#ef4444] -mt-2">{errors.confirmado}</p>}
    </div>
  );
}

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────

function SuccessScreen({
  state, opId, onNavigate, onReset,
}: {
  state: WizardState;
  opId: string;
  onNavigate?: (page: string) => void;
  onReset: () => void;
}) {
  const [hsSync, setHsSync] = useState<'idle' | 'syncing' | 'done'>('idle');
  const [teaserLoading, setTeaserLoading] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setHsSync('syncing');
    const t = setTimeout(() => setHsSync('done'), 2500);
    return () => clearTimeout(t);
  }, []);

  const { instrumento, volume, indexador, spread, prazo, sector, razaoSocial } = state;
  const instLabel = INSTRUMENTS.find(i => i.id === instrumento)?.label ?? instrumento;

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <div className="max-w-[600px] mx-auto mt-8">
        <Card padding="lg" className="text-center">
          <div className="w-[72px] h-[72px] bg-[#059669] rounded-full flex items-center justify-center text-[28px] text-white mx-auto mb-6">
            <i className="fas fa-check"></i>
          </div>
          <h2 className="font-['Playfair_Display'] text-[26px] font-semibold text-[#0b1f3a] mb-2">
            Operação submetida com sucesso!
          </h2>
          <div className="inline-block bg-[#f1f5f9] rounded-full px-4 py-1.5 text-[12px] font-mono font-semibold text-[#64748b] mb-5">
            ID: {opId} · {instLabel} · {sector}
          </div>
          <p className="text-[14px] text-[#64748b] leading-relaxed mb-4">
            <strong className="text-[#0b1f3a]">{razaoSocial || 'Operação'}</strong> foi registrada no pipeline.
            Nossa equipe de estruturação iniciará a análise em até{' '}
            <strong className="text-[#0b1f3a]">2 dias úteis</strong>.
          </p>
          <div className="grid grid-cols-3 gap-3 bg-[#f8fafc] rounded-xl p-4 mb-5 text-left">
            {[
              { label: 'Volume', value: volume ? `${volume} MM` : '—' },
              { label: 'Taxa',   value: spread ? `${indexador} ${spread}` : '—' },
              { label: 'Prazo',  value: prazo  ? `${prazo} meses` : '—' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-[10px] uppercase font-semibold tracking-wide text-[#94a3b8] mb-0.5">{s.label}</div>
                <div className="text-[13px] font-semibold text-[#0b1f3a]">{s.value}</div>
              </div>
            ))}
          </div>

          {/* HubSpot sync */}
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-5 border transition-all ${
            hsSync === 'done' ? 'bg-[#fff4f0] border-[#ffd5c8]' : 'bg-[#f8fafc] border-[#e2e8f0]'
          }`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ff7a59' }}>
              {hsSync === 'syncing' ? (
                <i className="fas fa-spinner fa-spin text-white text-[12px]"></i>
              ) : hsSync === 'done' ? (
                <i className="fas fa-check text-white text-[12px]"></i>
              ) : (
                <i className="fas fa-sync text-white text-[12px]"></i>
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="text-[12px] font-semibold text-[#0b1f3a]">
                {hsSync === 'syncing' && 'Criando deal no HubSpot CRM…'}
                {hsSync === 'done'    && 'Deal criado no HubSpot CRM'}
                {hsSync === 'idle'    && 'Aguardando sincronização com HubSpot'}
              </div>
              <div className="text-[11px] text-[#64748b] mt-0.5">
                {hsSync === 'done'    && `Deal #${40000 + parseInt(opId.replace('OP-', '')) * 3} · Pipeline: Appointment Scheduled`}
                {hsSync === 'syncing' && 'Sincronizando dados da operação…'}
                {hsSync === 'idle'    && 'A operação será sincronizada automaticamente.'}
              </div>
            </div>
            {hsSync === 'done' && (
              <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff7a59] text-white">HS</span>
            )}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              variant="primary"
              icon={<i className="fas fa-stream"></i>}
              onClick={() => {
                if (onNavigate) onNavigate('dealflow');
                else navigate('/dashboard/dealflow');
              }}
            >
              Acompanhar no Deal Flow
            </Button>
            <Button
              variant="outline"
              icon={<i className={`fas fa-${teaserLoading ? 'spinner fa-spin' : 'file-pdf'}`}></i>}
              onClick={() => {
                setTeaserLoading(true);
                setTimeout(() => { setTeaserLoading(false); setShowTeaser(true); }, 1500);
              }}
            >
              {teaserLoading ? 'Gerando Teaser…' : 'Baixar Teaser'}
            </Button>
            <Button variant="outline" icon={<i className="fas fa-plus"></i>} onClick={onReset}>
              Nova Operação
            </Button>
          </div>

          {showTeaser && (
            <TeaserModal state={state} opId={opId} onClose={() => setShowTeaser(false)} />
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── TEASER MODAL ─────────────────────────────────────────────────────────────

function TeaserModal({ state, opId, onClose }: { state: WizardState; opId: string; onClose: () => void }) {
  const hoje = new Date().toLocaleDateString('pt-BR');
  const { razaoSocial, cnpj, endereco, contato, instrumento, volume, indexador, spread, prazo,
    amortizacao, rating, sector, garantias, usoRecursos, descricao } = state;
  const instLabel = INSTRUMENTS.find(i => i.id === instrumento)?.label ?? instrumento;
  const volumeMM = parseMM(volume);
  const totalGarantiaMM = garantias.reduce((s, g) => s + parseMM(g.valor), 0);
  const ltv = volumeMM > 0 ? Math.round((totalGarantiaMM / volumeMM) * 100) : 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[700]" onClick={onClose} />
      <div className="fixed inset-0 z-[800] flex items-center justify-center p-4 overflow-auto">
        <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[700px] overflow-hidden">
          <div className="bg-[#0b1f3a] px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-[15px]">Bloxs</span>
              <span className="text-white/40 text-[16px]">|</span>
              <span className="text-white/80 text-[12px] font-medium">Investment Teaser</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-[11px]">Gerado em {hoje}</span>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <i className="fas fa-times text-[14px]"></i>
              </button>
            </div>
          </div>
          <div className="px-8 py-6 space-y-5">
            <div className="border-b border-[#e2e8f0] pb-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8] mb-1">Operação</div>
              <h1 className="font-['Playfair_Display'] text-[24px] font-semibold text-[#0b1f3a]">
                {razaoSocial || 'Emissor não informado'}
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {instLabel && <span className="bg-[#0b1f3a] text-white text-[11px] font-semibold px-3 py-1 rounded-full">{instLabel}</span>}
                {rating    && <span className="bg-[#ede9fe] text-[#6d28d9] text-[11px] font-semibold px-3 py-1 rounded-full">Rating {rating}</span>}
                {sector    && <span className="bg-[#f1f5f9] text-[#475569] text-[11px] font-medium px-3 py-1 rounded-full">{sector}</span>}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Volume',     value: volume     ? `R$ ${volume} MM`              : '—' },
                { label: 'Taxa',       value: spread     ? `${indexador} +${spread}%`     : '—' },
                { label: 'Prazo',      value: prazo      ? `${prazo} meses`               : '—' },
                { label: 'Amortização', value: amortizacao || '—' },
              ].map((k, i) => (
                <div key={i} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] px-4 py-3 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8] mb-1">{k.label}</div>
                  <div className="text-[14px] font-bold text-[#0b1f3a]">{k.value}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1a6edb] mb-2">Emissor</div>
                <dl className="space-y-1.5">
                  {[
                    ['Razão Social', razaoSocial || '—'],
                    ['CNPJ',         cnpj        || '—'],
                    ['Localização',  endereco    || '—'],
                    ['Responsável',  contato     || '—'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] text-[#94a3b8] font-semibold uppercase">{k}</dt>
                      <dd className="text-[12.5px] text-[#0b1f3a] font-medium break-all">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1a6edb] mb-2">Garantias</div>
                {garantias.filter(g => g.tipo).length > 0 ? (
                  <dl className="space-y-1.5">
                    {garantias.filter(g => g.tipo).map(g => (
                      <div key={g.id}>
                        <dt className="text-[10px] text-[#94a3b8] font-semibold uppercase">{g.hierarquia}</dt>
                        <dd className="text-[12.5px] text-[#0b1f3a] font-medium">
                          {g.tipo}{g.valor ? ` · R$ ${g.valor}MM` : ''}
                        </dd>
                      </div>
                    ))}
                    {ltv > 0 && (
                      <div>
                        <dt className="text-[10px] text-[#94a3b8] font-semibold uppercase">LTV Global</dt>
                        <dd className="text-[12.5px] text-[#0b1f3a] font-medium">{ltv}%</dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  <p className="text-[12px] text-[#94a3b8]">Não informadas</p>
                )}
              </div>
            </div>
            {(usoRecursos || descricao) && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1a6edb] mb-2">Uso dos Recursos</div>
                <p className="text-[12.5px] text-[#475569] leading-relaxed">{usoRecursos || descricao}</p>
              </div>
            )}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-4 py-3">
              <p className="text-[10px] text-[#94a3b8] leading-relaxed">
                <strong>CONFIDENCIAL.</strong> Este documento contém informações proprietárias destinadas exclusivamente a Investidores Qualificados conforme RCVM 30/2023. ID: {opId} · Bloxs IBaaS Originação.
              </p>
            </div>
          </div>
          <div className="px-8 py-4 border-t border-[#e2e8f0] flex gap-3 justify-end bg-[#fafbfc]">
            <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-[#475569] border border-[#e2e8f0] rounded-[8px] hover:border-[#0b1f3a] transition-all">
              Fechar
            </button>
            <button onClick={() => window.print()} className="px-4 py-2 text-[13px] font-semibold text-white bg-[#0b1f3a] rounded-[8px] hover:bg-[#1a6edb] transition-all flex items-center gap-2">
              <i className="fas fa-print text-[11px]"></i>
              Imprimir / Salvar PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function OriginacaoWizard({ onNavigate, onNewDeal }: Props) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [opId] = useState(() => `OP-${String(Date.now()).slice(-3)}`);

  useDraftPersist(state, (draft) => dispatch({ type: 'RESTORE', payload: draft }));

  const { step, sector } = state;

  function goToStep(n: number) {
    dispatch({ type: 'SET_STEP', payload: n });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (step === 1 && !sector) {
      toast.error('Selecione um setor para continuar.');
      return false;
    }
    if (step === 5) {
      if (!state.instrumento) e.instrumento = 'Selecione o instrumento';
      if (!state.volume)      e.volume      = 'Informe o volume';
      if (!state.spread)      e.spread      = 'Informe a taxa';
      if (!state.prazo)       e.prazo       = 'Informe o prazo';
      if (!state.amortizacao) e.amortizacao = 'Selecione a amortização';
      if (!state.razaoSocial) e.razaoSocial = 'Informe a razão social';
      if ((state.cnpj ?? '').replace(/\D/g, '').length < 14) e.cnpj = 'CNPJ inválido (14 dígitos)';
    }
    if (step === 6 && !state.confirmado) {
      e.confirmado = 'Você precisa confirmar os dados antes de enviar.';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error('Corrija os campos destacados antes de continuar.');
      return false;
    }
    return true;
  }

  function nextStep() {
    if (!validate()) return;
    if (step < 6) goToStep(step + 1);
  }

  function prevStep() {
    setErrors({});
    if (step > 1) goToStep(step - 1);
  }

  function saveRascunho() {
    setSaving(true);
    setTimeout(() => {
      const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setSaving(false);
      setSavedAt(time);
      toast.success(`Rascunho salvo às ${time}`);
    }, 600);
  }

  function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearDraft();
      const today = new Date().toLocaleDateString('pt-BR');
      const instLabel = INSTRUMENTS.find(i => i.id === state.instrumento)?.label ?? state.instrumento;
      const instrument: DealInstrument = VALID_INSTRUMENTS_DEAL.includes(instLabel as DealInstrument)
        ? (instLabel as DealInstrument)
        : 'A definir';
      onNewDeal?.({
        id: String(Date.now()),
        title: state.razaoSocial || `${sector} — Nova Op.`,
        value: parseMM(state.volume),
        location: '',
        instrument,
        sector,
        stage: 'originacao',
        responsible: 'Rafael Andrade',
        submittedAt: today,
        lastUpdate: today,
        description: state.descricao || state.usoRecursos || 'Operação originada via IBaaS.',
        timeline: [
          { date: today, event: 'Operação originada no IBaaS', author: 'Rafael Andrade' },
        ],
      });
      toast.success('Operação submetida com sucesso!');
      setEnviado(true);
    }, 1500);
  }

  if (enviado) {
    return (
      <SuccessScreen
        state={state}
        opId={opId}
        onNavigate={onNavigate}
        onReset={() => { dispatch({ type: 'RESET' }); setEnviado(false); setErrors({}); }}
      />
    );
  }

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <PageHeader
        breadcrumb="Pipeline"
        title="Originar Operação"
        subtitle="Estruture uma nova operação de crédito privado em 6 etapas guiadas."
      />

      <div className="grid gap-8" style={{ gridTemplateColumns: '280px 1fr' }}>

        {/* ── LEFT: Stepper ──────────────────────────────────────────────── */}
        <div className="space-y-5">
          <Card padding="md">
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#94a3b8] mb-4 px-1">Etapas</div>
            <Stepper steps={WIZARD_STEPS} currentStep={step} orientation="vertical" />
          </Card>
          <InfoBox variant="info" icon={<i className="fas fa-lightbulb"></i>} title="Dica">
            <span className="text-[12px]">
              Salve um rascunho a qualquer momento e retome depois. As operações submetidas entram automaticamente no <strong>Deal Flow</strong>.
            </span>
          </InfoBox>
          {sector && step >= 2 && (() => {
            const viabilidade = calcViabilidade(sector);
            const color = viabilidade >= 70 ? '#059669' : viabilidade >= 50 ? '#d97706' : '#dc2626';
            return (
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8] mb-2">Viabilidade do Setor</div>
                <div className="text-[32px] font-bold" style={{ color }}>{viabilidade}</div>
                <div className="text-[11px] text-[#64748b]">{sector}</div>
              </div>
            );
          })()}
        </div>

        {/* ── RIGHT: Form ─────────────────────────────────────────────────── */}
        <Card padding="none">
          {/* Step header */}
          <div className="px-7 py-5 border-b border-[#e2e8f0] bg-[#fafbfc]">
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#1a6edb] mb-0.5">
              Etapa {step} de 6
            </div>
            <h2 className="text-[17px] font-semibold text-[#0b1f3a]">{WIZARD_STEPS[step - 1].label}</h2>
            <p className="text-[12px] text-[#94a3b8] mt-0.5">{WIZARD_STEPS[step - 1].description}</p>
          </div>

          <CardBody padding="lg">
            {step === 1 && <Step1 sector={sector} dispatch={dispatch} />}
            {step === 2 && <Step2 sector={sector} />}
            {step === 3 && <Step3 sector={sector} checkedDocs={state.checkedDocs} dispatch={dispatch} />}
            {step === 4 && (
              <Step4
                sector={sector}
                volume={state.volume}
                selectedInstruments={state.selectedInstruments}
                dispatch={dispatch}
              />
            )}
            {step === 5 && (
              <Step5
                state={state}
                dispatch={dispatch}
                errors={errors}
                setErrors={setErrors}
                cnpjLoading={cnpjLoading}
                setCnpjLoading={setCnpjLoading}
              />
            )}
            {step === 6 && (
              <Step6
                state={state}
                dispatch={dispatch}
                goToStep={goToStep}
                opId={opId}
                errors={errors}
              />
            )}
          </CardBody>

          {/* Navigation footer */}
          <div className="px-7 py-4 border-t border-[#e2e8f0] bg-[#fafbfc] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <Button variant="outline" size="sm" onClick={prevStep} icon={<i className="fas fa-arrow-left"></i>}>
                  Voltar
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={saveRascunho}
                icon={<i className={`fas fa-${saving ? 'spinner fa-spin' : savedAt ? 'check' : 'save'}`}></i>}
              >
                {saving ? 'Salvando…' : savedAt ? `Salvo às ${savedAt}` : 'Salvar Rascunho'}
              </Button>
            </div>

            {step < 6 ? (
              <Button variant="primary" size="sm" onClick={nextStep} icon={<i className="fas fa-arrow-right"></i>} iconPosition="right">
                Próximo
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                loading={loading}
                onClick={handleSubmit}
                icon={<i className="fas fa-paper-plane"></i>}
              >
                Enviar para Análise
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
