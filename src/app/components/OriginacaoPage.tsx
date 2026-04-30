import { useState } from 'react';
import {
  PageHeader, Card, CardBody,
  Button, Input, Select, Textarea, Stepper, InfoBox
} from './ds';
import type { Deal, Instrument } from './DealFlowPage';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Props {
  onNavigate?: (page: string) => void;
  onNewDeal?: (deal: Deal) => void;
}

interface FormState {
  // Step 1
  instrumento: string; setor: string; volume: string;
  indexador: string; spread: string; prazo: string;
  amortizacao: string; descricao: string;
  // Step 2
  razaoSocial: string; cnpj: string; endereco: string;
  contato: string; email: string; telefone: string;
  usoRecursos: string; rating: string;
  // Step 3
  tipoGarantia: string; descGarantia: string; valorGarantia: string;
  // Step 4
  confirmado: boolean;
}

// ─── MARKET INTELLIGENCE ─────────────────────────────────────────────────────

const MARKET_BENCHMARKS: Record<string, { avg: number; min: number; max: number; label: string }> = {
  'FIDC':           { avg: 4.8, min: 3.5, max: 8.0, label: 'FIDC Sênior (ANBIMA)' },
  'CRI':            { avg: 3.8, min: 2.5, max: 6.0, label: 'CRI — Mercado Secundário' },
  'CRA':            { avg: 4.2, min: 3.0, max: 6.5, label: 'CRA — Mercado Secundário' },
  'Debênture':      { avg: 3.0, min: 1.5, max: 5.5, label: 'Debêntures Incentivadas' },
  'Nota Comercial': { avg: 2.5, min: 1.0, max: 4.5, label: 'Nota Comercial' },
  'CCB':            { avg: 3.2, min: 2.0, max: 5.0, label: 'CCB' },
  'CPR':            { avg: 3.5, min: 2.5, max: 5.5, label: 'CPR' },
};

const ELIG_CRITERIA: Record<string, string[]> = {
  CRI: [
    'Lastro em recebíveis imobiliários (contratos de locação, financiamento ou CCI)',
    'Emissor com >2/3 da receita bruta proveniente do setor imobiliário (CMN 5.118)',
    'Imóveis lastro com matrícula atualizada (≤ 6 meses) e livre de ônus',
  ],
  CRA: [
    'Lastro em recebíveis do agronegócio (CPR, CDA, WA, CDCA ou contratos)',
    'Emissor com atividade agropecuária ou agroindustrial como atividade principal',
    'Documentação de origem e rastreabilidade da produção disponível',
  ],
};

// ─── GARANTIA ITEM ────────────────────────────────────────────────────────────

interface GarantiaItem {
  id: string;
  tipo: string;
  hierarquia: 'Principal' | 'Complementar' | 'Adicional';
  valor: string;
  valorMercado?: string;
  fileName?: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Dados da Operação',  description: 'Instrumento, volume e condições' },
  { label: 'Emissor & Estrutura', description: 'Dados do tomador e uso dos recursos' },
  { label: 'Garantias',          description: 'Tipos e cobertura de garantia' },
  { label: 'Revisão & Envio',    description: 'Confirme e submeta para análise' },
];

// ─── MASKS ────────────────────────────────────────────────────────────────────

const maskCNPJ = (v: string) =>
  v.replace(/\D/g,'').slice(0,14)
   .replace(/(\d{2})(\d)/,'$1.$2')
   .replace(/(\d{3})(\d)/,'$1.$2')
   .replace(/(\d{3})(\d)/,'$1/$2')
   .replace(/(\d{4})(\d{1,2})$/,'$1-$2');

const maskPhone = (v: string) =>
  v.replace(/\D/g,'').slice(0,11)
   .replace(/(\d{2})(\d)/,'($1) $2')
   .replace(/(\d{5})(\d{4})$/,'$1-$2');

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const EMPTY: FormState = {
  instrumento:'', setor:'', volume:'', indexador:'CDI+', spread:'', prazo:'', amortizacao:'', descricao:'',
  razaoSocial:'', cnpj:'', endereco:'', contato:'', email:'', telefone:'', usoRecursos:'', rating:'',
  tipoGarantia:'', descGarantia:'', valorGarantia:'',
  confirmado: false,
};

function parseMM(v: string): number {
  return parseInt(v.replace(/\D/g,'')) || 0;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const VALID_INSTRUMENTS: Instrument[] = ['CRI', 'CRA', 'CR', 'FIDC', 'Debênture', 'Nota Comercial', 'A definir'];

export default function OriginacaoPage({ onNavigate, onNewDeal }: Props) {
  const [step,      setStep]      = useState<1|2|3|4>(1);
  const [form,      setForm]      = useState<FormState>(EMPTY);
  const [errors,    setErrors]    = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading,   setLoading]   = useState(false);
  const [enviado,   setEnviado]   = useState(false);
  const [savedAt,      setSavedAt]      = useState<string | null>(() => localStorage.getItem('originar_rascunho_at'));
  const [saving,       setSaving]       = useState(false);
  const [opId]                          = useState(() => `OP-${String(Date.now()).slice(-3)}`);
  const [garantias,    setGarantias]    = useState<GarantiaItem[]>([{ id: '1', tipo: '', hierarquia: 'Principal', valor: '' }]);
  const [eligChecks,   setEligChecks]   = useState<Record<string, 'sim' | 'nao' | 'nao_sei'>>({});
  const [eligWarning,  setEligWarning]  = useState(false);
  const [showTeaser,   setShowTeaser]   = useState(false);
  const [teaserLoading, setTeaserLoading] = useState(false);
  const [showDCC,      setShowDCC]      = useState(false);

  function field<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate(s: number): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (s === 1) {
      if (!form.instrumento) e.instrumento = 'Selecione o instrumento';
      if (!form.setor)       e.setor       = 'Selecione o setor';
      if (!form.volume)      e.volume      = 'Informe o volume pretendido';
      if (!form.spread)      e.spread      = 'Informe o spread / taxa';
      if (!form.prazo)       e.prazo       = 'Informe o prazo em meses';
      if (!form.amortizacao) e.amortizacao = 'Selecione o tipo de amortização';
    }
    if (s === 2) {
      if (!form.razaoSocial)               e.razaoSocial = 'Informe a razão social';
      if (form.cnpj.replace(/\D/g,'').length < 14) e.cnpj = 'CNPJ inválido (14 dígitos)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (step === 1 && ['CRI', 'CRA'].includes(form.instrumento)) {
      const hasNao = Object.values(eligChecks).some(v => v === 'nao');
      if (hasNao && !eligWarning) { setEligWarning(true); return; }
    }
    if (!validate(step)) return;
    setEligWarning(false);
    setStep(s => (s + 1) as 1|2|3|4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function prevStep() {
    setErrors({});
    setStep(s => (s - 1) as 1|2|3|4);
  }

  function saveRascunho() {
    setSaving(true);
    localStorage.setItem('originar_rascunho', JSON.stringify(form));
    setTimeout(() => {
      const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setSaving(false);
      setSavedAt(time);
      localStorage.setItem('originar_rascunho_at', time);
    }, 600);
  }

  function handleSubmit() {
    if (!form.confirmado) {
      setErrors({ confirmado: 'Você precisa confirmar os dados antes de enviar.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
      localStorage.removeItem('originar_rascunho');
      localStorage.removeItem('originar_rascunho_at');
      const today = new Date().toLocaleDateString('pt-BR');
      const instrument: Instrument = VALID_INSTRUMENTS.includes(form.instrumento as Instrument)
        ? (form.instrumento as Instrument)
        : 'A definir';
      onNewDeal?.({
        id: String(Date.now()),
        title: form.razaoSocial || `${form.setor} — Nova Op.`,
        value: parseMM(form.volume),
        location: '',
        instrument,
        sector: form.setor,
        stage: 'originacao',
        responsible: 'Rafael Andrade',
        submittedAt: today,
        lastUpdate: today,
        description: form.descricao || form.usoRecursos || 'Operação originada via IBaaS.',
        timeline: [
          { date: today, event: 'Operação originada no IBaaS', author: 'Rafael Andrade' },
        ],
      });
    }, 1500);
  }

  // ── Volume / LTV helpers (needed in both success screen and main render) ───
  const volumeMM        = parseMM(form.volume);
  const totalGarantiaMM = garantias.reduce((s, g) => s + parseMM(g.valor), 0);
  const ltv = volumeMM > 0 ? Math.round((totalGarantiaMM / volumeMM) * 100) : 0;

  // ── Success screen ─────────────────────────────────────────────────────────
  if (enviado) {
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
              ID: {opId} · {form.instrumento} · {form.setor}
            </div>
            <p className="text-[14px] text-[#64748b] leading-relaxed mb-4">
              <strong className="text-[#0b1f3a]">{form.razaoSocial || 'Operação'}</strong> foi registrada no pipeline.
              Nossa equipe de estruturação iniciará a análise em até <strong className="text-[#0b1f3a]">2 dias úteis</strong>.
              Você receberá uma notificação assim que o status for atualizado.
            </p>
            <div className="grid grid-cols-3 gap-3 bg-[#f8fafc] rounded-xl p-4 mb-7 text-left">
              {[
                { label: 'Volume',    value: form.volume ? `${form.volume} MM` : '—' },
                { label: 'Taxa',      value: form.spread ? `${form.indexador} ${form.spread}` : '—' },
                { label: 'Prazo',     value: form.prazo  ? `${form.prazo} meses`          : '—' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-[10px] uppercase font-semibold tracking-wide text-[#94a3b8] mb-0.5">{s.label}</div>
                  <div className="text-[13px] font-semibold text-[#0b1f3a]">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                variant="primary"
                icon={<i className="fas fa-stream"></i>}
                onClick={() => onNavigate?.('dealflow')}
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
              <Button
                variant="outline"
                icon={<i className="fas fa-plus"></i>}
                onClick={() => { setEnviado(false); setForm(EMPTY); setStep(1); setGarantias([{ id: '1', tipo: '', hierarquia: 'Principal', valor: '' }]); }}
              >
                Nova Operação
              </Button>
            </div>
            {showTeaser && <TeaserModal form={form} garantias={garantias} ltv={ltv} onClose={() => setShowTeaser(false)} />}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <PageHeader
        breadcrumb="Pipeline"
        title="Originar Operação"
        subtitle="Estruture uma nova operação de crédito privado, CRI, CRA, FIDC ou debênture."
      />

      <div className="grid gap-8" style={{ gridTemplateColumns: '280px 1fr' }}>

        {/* ── LEFT: Stepper ──────────────────────────────────────────────── */}
        <div className="space-y-5">
          <Card padding="md">
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#94a3b8] mb-4 px-1">
              Etapas
            </div>
            <Stepper steps={STEPS} currentStep={step} orientation="vertical" />
          </Card>

          <InfoBox variant="info" icon={<i className="fas fa-lightbulb"></i>} title="Dica">
            <span className="text-[12px]">
              Você pode salvar um rascunho a qualquer momento e retomar depois.
              As operações submetidas entram automaticamente no <strong>Deal Flow</strong>.
            </span>
          </InfoBox>
        </div>

        {/* ── RIGHT: Form ─────────────────────────────────────────────────── */}
        <Card padding="none">
          {/* Step header */}
          <div className="px-7 py-5 border-b border-[#e2e8f0] bg-[#fafbfc]">
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#1a6edb] mb-0.5">
              Etapa {step} de 4
            </div>
            <h2 className="text-[17px] font-semibold text-[#0b1f3a]">{STEPS[step - 1].label}</h2>
            <p className="text-[12px] text-[#94a3b8] mt-0.5">{STEPS[step - 1].description}</p>
          </div>

          <CardBody padding="lg">

            {/* ── STEP 1: Dados da Operação ──────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <Select
                    label="Instrumento *"
                    value={form.instrumento}
                    onChange={e => field('instrumento', e.target.value)}
                    error={errors.instrumento}
                    options={[
                      { value: '',               label: 'Selecione' },
                      { value: 'FIDC',           label: 'FIDC' },
                      { value: 'CRI',            label: 'CRI — Certificado de Recebíveis Imobiliários' },
                      { value: 'CRA',            label: 'CRA — Certificado de Recebíveis do Agronegócio' },
                      { value: 'Debênture',      label: 'Debênture' },
                      { value: 'Nota Comercial', label: 'Nota Comercial' },
                      { value: 'CCB',            label: 'CCB — Cédula de Crédito Bancário' },
                      { value: 'CPR',            label: 'CPR — Cédula do Produtor Rural' },
                    ]}
                  />
                  <Select
                    label="Setor *"
                    value={form.setor}
                    onChange={e => field('setor', e.target.value)}
                    error={errors.setor}
                    options={[
                      { value: '',                 label: 'Selecione' },
                      { value: 'Agronegócio',      label: 'Agronegócio' },
                      { value: 'Imobiliário',      label: 'Imobiliário' },
                      { value: 'Energia Renovável',label: 'Energia Renovável' },
                      { value: 'Infraestrutura',   label: 'Infraestrutura' },
                      { value: 'Tecnologia',       label: 'Tecnologia' },
                      { value: 'Logística',        label: 'Logística' },
                      { value: 'Saúde',            label: 'Saúde' },
                      { value: 'Telecomunicações', label: 'Telecomunicações' },
                      { value: 'Financeiro',       label: 'Financeiro' },
                      { value: 'Serviços',         label: 'Serviços' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <Input
                    label="Volume Pretendido (R$ MM) *"
                    value={form.volume}
                    onChange={e => field('volume', e.target.value.replace(/\D/g,'').slice(0,5))}
                    error={errors.volume}
                    placeholder="Ex: 50"
                    rightIcon={<span className="text-[11px] font-semibold">MM</span>}
                    helperText="Valor em milhões de reais"
                  />
                  <Input
                    label="Prazo (meses) *"
                    value={form.prazo}
                    onChange={e => field('prazo', e.target.value.replace(/\D/g,'').slice(0,3))}
                    error={errors.prazo}
                    placeholder="Ex: 36"
                  />
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <Select
                    label="Indexador"
                    value={form.indexador}
                    onChange={e => field('indexador', e.target.value)}
                    options={[
                      { value: 'CDI+',    label: 'CDI+' },
                      { value: 'IPCA+',   label: 'IPCA+' },
                      { value: 'Prefixado', label: 'Prefixado' },
                      { value: 'TJLP+',   label: 'TJLP+' },
                    ]}
                  />
                  <Input
                    label="Spread / Taxa (% a.a.) *"
                    value={form.spread}
                    onChange={e => field('spread', e.target.value)}
                    error={errors.spread}
                    placeholder="Ex: 3,5"
                    rightIcon={<span className="text-[11px] font-semibold">%</span>}
                  />
                  <Select
                    label="Amortização *"
                    value={form.amortizacao}
                    onChange={e => field('amortizacao', e.target.value)}
                    error={errors.amortizacao}
                    options={[
                      { value: '',          label: 'Selecione' },
                      { value: 'Bullet',    label: 'Bullet (pagamento único)' },
                      { value: 'SAC',       label: 'SAC — Sistema de Amortização Constante' },
                      { value: 'SAF',       label: 'SAF — Sistema Francês (Price)' },
                      { value: 'Customizado', label: 'Customizado' },
                    ]}
                  />
                </div>

                <Textarea
                  label="Descrição da Operação"
                  value={form.descricao}
                  onChange={e => field('descricao', e.target.value)}
                  placeholder="Descreva o objetivo da captação, estrutura proposta e quaisquer informações relevantes para análise..."
                  rows={4}
                  helperText="Opcional. Informações adicionais aceleram a análise da equipe de estruturação."
                />

                {/* ── 1.1 Inteligência de Mercado Inline ────────────────── */}
                {(() => {
                  const bench = MARKET_BENCHMARKS[form.instrumento];
                  const spreadNum = parseFloat((form.spread || '0').replace(',', '.'));
                  if (!bench || !spreadNum) return null;
                  const diff = spreadNum - bench.avg;
                  const pos = diff > bench.avg * 0.15 ? 'above' : diff < -bench.avg * 0.15 ? 'below' : 'at';
                  const cfg = {
                    above: { bg:'#f0fdf4', border:'#86efac', text:'#15803d', icon:'fa-arrow-trend-up', label:'Acima da média — posicionamento agressivo' },
                    at:    { bg:'#eff6ff', border:'#bfdbfe', text:'#1d4ed8', icon:'fa-equals',          label:'Na média de mercado' },
                    below: { bg:'#fffbeb', border:'#fde68a', text:'#b45309', icon:'fa-arrow-trend-down', label:'Abaixo da média — reavalie o spread' },
                  }[pos];
                  return (
                    <div style={{ background: cfg.bg, borderColor: cfg.border }} className="rounded-xl p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <i className={`fas ${cfg.icon} text-[12px]`} style={{ color: cfg.text }}></i>
                        <span className="text-[12.5px] font-semibold" style={{ color: cfg.text }}>
                          Inteligência de Mercado — {bench.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-center">
                        {[
                          { label: 'Seu spread',    value: `${form.indexador} ${spreadNum.toFixed(1)}%`, highlight: true },
                          { label: 'Média mercado', value: `${form.indexador} ${bench.avg.toFixed(1)}%`, highlight: false },
                          { label: 'Mínimo',        value: `${form.indexador} ${bench.min.toFixed(1)}%`, highlight: false },
                          { label: 'Máximo',        value: `${form.indexador} ${bench.max.toFixed(1)}%`, highlight: false },
                        ].map((m, i) => (
                          <div key={i} className="bg-white/70 rounded-lg px-3 py-2">
                            <div className="text-[10px] text-[#94a3b8] uppercase font-semibold mb-0.5">{m.label}</div>
                            <div className="text-[13px] font-bold" style={{ color: m.highlight ? cfg.text : '#0b1f3a' }}>{m.value}</div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] mt-2" style={{ color: cfg.text }}>{cfg.label}{pos === 'above' ? ` · Diferença de +${diff.toFixed(1)}pp vs. média` : pos === 'below' ? ` · Diferença de ${diff.toFixed(1)}pp vs. média` : ''}.</p>
                    </div>
                  );
                })()}

                {/* ── 1.2 Elegibilidade Regulatória ─────────────────────── */}
                {['CRI', 'CRA'].includes(form.instrumento) && (
                  <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fas fa-balance-scale text-[#d97706]"></i>
                      <span className="text-[12.5px] font-semibold text-[#92400e]">
                        Elegibilidade Regulatória — {form.instrumento}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#92400e] mb-3">
                      Confirme o enquadramento nos critérios antes de avançar:
                    </p>
                    {(ELIG_CRITERIA[form.instrumento] ?? []).map((criterion, idx) => {
                      const key = `${form.instrumento}_${idx}`;
                      const val = eligChecks[key];
                      return (
                        <div key={key} className="flex items-start gap-3 mb-2.5">
                          <div className="flex gap-1 flex-shrink-0 mt-0.5">
                            {(['sim', 'nao', 'nao_sei'] as const).map(opt => (
                              <button key={opt}
                                onClick={() => { setEligChecks(prev => ({ ...prev, [key]: opt })); setEligWarning(false); }}
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                                  val === opt
                                    ? opt === 'sim'  ? 'bg-[#059669] text-white border-[#059669]'
                                    : opt === 'nao'  ? 'bg-[#dc2626] text-white border-[#dc2626]'
                                    :                  'bg-[#6b7280] text-white border-[#6b7280]'
                                    : 'bg-white text-[#6b7280] border-[#d1d5db] hover:border-[#6b7280]'
                                }`}
                              >
                                {opt === 'sim' ? 'Sim' : opt === 'nao' ? 'Não' : '?'}
                              </button>
                            ))}
                          </div>
                          <span className="text-[12px] text-[#475569]">{criterion}</span>
                        </div>
                      );
                    })}
                    {eligWarning && (
                      <div className="mt-3 bg-[#fef2f2] border border-[#fecaca] rounded-[8px] p-3">
                        <p className="text-[12px] text-[#dc2626] font-medium">
                          <i className="fas fa-exclamation-circle mr-1.5"></i>
                          Um ou mais critérios marcados como "Não" podem indicar inelegibilidade regulatória. Clique "Próximo" novamente para confirmar mesmo assim.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Emissor & Estrutura ─────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <Input
                      label="Razão Social do Emissor / Tomador *"
                      value={form.razaoSocial}
                      onChange={e => field('razaoSocial', e.target.value)}
                      error={errors.razaoSocial}
                      placeholder="Nome completo conforme CNPJ"
                    />
                  </div>
                  <Input
                    label="CNPJ *"
                    value={form.cnpj}
                    onChange={e => field('cnpj', maskCNPJ(e.target.value))}
                    error={errors.cnpj}
                    placeholder="00.000.000/0001-00"
                  />
                  <Select
                    label="Rating Pretendido"
                    value={form.rating}
                    onChange={e => field('rating', e.target.value)}
                    options={[
                      { value: '',    label: 'Não definido / A definir' },
                      { value: 'AAA', label: 'AAA' },
                      { value: 'AA+', label: 'AA+' },
                      { value: 'AA',  label: 'AA' },
                      { value: 'AA-', label: 'AA-' },
                      { value: 'A+',  label: 'A+' },
                      { value: 'A',   label: 'A' },
                      { value: 'A-',  label: 'A-' },
                      { value: 'BBB', label: 'BBB' },
                      { value: 'NR',  label: 'NR (não solicitado)' },
                    ]}
                  />
                </div>

                <Input
                  label="Endereço da Sede"
                  value={form.endereco}
                  onChange={e => field('endereco', e.target.value)}
                  placeholder="Rua, número, cidade, UF, CEP"
                />

                <div className="grid grid-cols-3 gap-5">
                  <Input
                    label="Nome do Responsável"
                    value={form.contato}
                    onChange={e => field('contato', e.target.value)}
                    placeholder="Nome completo"
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    value={form.email}
                    onChange={e => field('email', e.target.value)}
                    placeholder="contato@empresa.com.br"
                  />
                  <Input
                    label="Telefone"
                    value={form.telefone}
                    onChange={e => field('telefone', maskPhone(e.target.value))}
                    placeholder="(11) 99999-0000"
                  />
                </div>

                <Textarea
                  label="Uso dos Recursos"
                  value={form.usoRecursos}
                  onChange={e => field('usoRecursos', e.target.value)}
                  placeholder="Descreva como os recursos captados serão utilizados (expansão, capital de giro, refinanciamento, projetos específicos)..."
                  rows={4}
                />

                <div>
                  <div className="text-[13px] font-medium text-[#1e293b] mb-1.5">
                    Documentos do Emissor <span className="text-[11px] text-[#94a3b8] font-normal">(opcional)</span>
                  </div>
                  <label className="block border-2 border-dashed border-[#e2e8f0] rounded-xl p-6 text-center hover:border-[#1a6edb]/50 hover:bg-[#f8faff] transition-all cursor-pointer">
                    <i className="fas fa-cloud-upload-alt text-[24px] text-[#94a3b8] mb-2 block"></i>
                    <div className="text-[12.5px] font-semibold text-[#0b1f3a] mb-0.5">Arraste ou clique para selecionar</div>
                    <div className="text-[11px] text-[#94a3b8]">DRE, Balanço, Fluxo de Caixa, Declaração IR… PDF, XLSX, máx. 10 MB por arquivo</div>
                    <input type="file" multiple accept=".pdf,.xlsx,.xls,.doc,.docx" className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {/* ── STEP 3: Garantias (múltiplas) ─────────────────────────── */}
            {step === 3 && (
              <div className="space-y-4">
                {garantias.map((g, idx) => (
                  <div key={g.id} className="border border-[#e2e8f0] rounded-xl p-4 bg-[#fafbfc]">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${
                        g.hierarquia === 'Principal'    ? 'bg-[#ede9fe] text-[#6d28d9]' :
                        g.hierarquia === 'Complementar' ? 'bg-[#e0f2fe] text-[#0369a1]' :
                                                          'bg-[#f1f5f9] text-[#475569]'
                      }`}>
                        {idx + 1}ª camada — {g.hierarquia}
                      </span>
                      {garantias.length > 1 && (
                        <button
                          onClick={() => setGarantias(prev => prev.filter(x => x.id !== g.id))}
                          className="text-[11px] text-[#94a3b8] hover:text-[#dc2626] transition-colors flex items-center gap-1"
                        >
                          <i className="fas fa-times"></i> Remover
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <Select
                        label="Tipo de Garantia"
                        value={g.tipo}
                        onChange={e => setGarantias(prev => prev.map(x => x.id === g.id ? { ...x, tipo: e.target.value } : x))}
                        options={[
                          { value: '',                             label: 'Selecione' },
                          { value: 'Alienação Fiduciária de Imóvel', label: 'Alienação Fiduciária de Imóvel' },
                          { value: 'Cessão de Recebíveis',          label: 'Cessão de Recebíveis' },
                          { value: 'Aval / Garantia Corporativa',   label: 'Aval / Garantia Corporativa' },
                          { value: 'Fundo de Reserva',              label: 'Fundo de Reserva' },
                          { value: 'Penhor de Ações',               label: 'Penhor de Ações' },
                          { value: 'Seguro de Crédito',             label: 'Seguro de Crédito' },
                          { value: 'Outras',                        label: 'Outras' },
                        ]}
                      />
                      <Select
                        label="Hierarquia"
                        value={g.hierarquia}
                        onChange={e => setGarantias(prev => prev.map(x => x.id === g.id ? { ...x, hierarquia: e.target.value as GarantiaItem['hierarquia'] } : x))}
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
                        onChange={e => setGarantias(prev => prev.map(x => x.id === g.id ? { ...x, valor: e.target.value.replace(/\D/g,'').slice(0,5) } : x))}
                        placeholder="Ex: 75"
                        rightIcon={<span className="text-[11px] font-semibold">MM</span>}
                      />
                      <Input
                        label="Valor de mercado (R$ MM)"
                        value={g.valorMercado ?? ''}
                        onChange={e => setGarantias(prev => prev.map(x => x.id === g.id ? { ...x, valorMercado: e.target.value.replace(/\D/g,'').slice(0,5) } : x))}
                        placeholder="Laudo / avaliação"
                        rightIcon={<span className="text-[11px] font-semibold">MM</span>}
                      />
                    </div>

                    {/* 3.2 Delta valor de mercado vs. declarado */}
                    {(() => {
                      const vD = parseMM(g.valor);
                      const vM = parseMM(g.valorMercado ?? '');
                      if (!vD || !vM) return null;
                      const delta = ((vM - vD) / vD) * 100;
                      const up = delta >= 0;
                      return (
                        <div className={`mt-2 flex items-center gap-1.5 text-[11px] font-medium ${up ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
                          <i className={`fas fa-arrow-${up ? 'up' : 'down'} text-[9px]`}></i>
                          Mercado {up ? 'acima' : 'abaixo'} em {Math.abs(delta).toFixed(1)}% vs. valor declarado
                        </div>
                      );
                    })()}

                    {/* 3.4 LTV individual */}
                    {volumeMM > 0 && parseMM(g.valor) > 0 && (() => {
                      const ltvInd = Math.round((parseMM(g.valor) / volumeMM) * 100);
                      const color = ltvInd >= 30 ? '#059669' : ltvInd >= 15 ? '#d97706' : '#dc2626';
                      return (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium" style={{ color }}>
                          <i className="fas fa-shield-alt text-[9px]"></i>
                          Cobertura individual: {ltvInd}% do volume
                        </div>
                      );
                    })()}

                    {/* 3.3 Upload por garantia */}
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
                            if (file) setGarantias(prev => prev.map(x => x.id === g.id ? { ...x, fileName: file.name } : x));
                          }}
                        />
                      </label>
                      {g.fileName && (
                        <button
                          onClick={() => setGarantias(prev => prev.map(x => x.id === g.id ? { ...x, fileName: undefined } : x))}
                          className="text-[10px] text-[#94a3b8] hover:text-[#dc2626] transition-colors"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setGarantias(prev => [...prev, {
                    id: String(Date.now()),
                    tipo: '',
                    hierarquia: prev.length === 0 ? 'Principal' : prev.length === 1 ? 'Complementar' : 'Adicional',
                    valor: '',
                  }])}
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
                      <span className="text-[11px] text-[#94a3b8]">R$ {totalGarantiaMM}MM garantia / R$ {volumeMM}MM volume</span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${ltv >= 100 ? 'bg-[#22c55e]' : ltv >= 70 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'}`}
                        style={{ width: `${Math.min(ltv, 100)}%` }} />
                    </div>
                  </div>
                )}

                <Textarea
                  label="Observações sobre as Garantias"
                  value={form.descGarantia}
                  onChange={e => field('descGarantia', e.target.value)}
                  placeholder="Informações adicionais sobre avaliação, cartório, restrições, etc."
                  rows={3}
                />

                <div>
                  <div className="text-[13px] font-medium text-[#1e293b] mb-1.5">
                    Documentos de Garantia <span className="text-[11px] text-[#94a3b8] font-normal">(opcional)</span>
                  </div>
                  <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-8 text-center hover:border-[#1a6edb]/50 hover:bg-[#f8faff] transition-all cursor-pointer">
                    <i className="fas fa-cloud-upload-alt text-[28px] text-[#94a3b8] mb-3 block"></i>
                    <div className="text-[13px] font-semibold text-[#0b1f3a] mb-1">Arraste arquivos ou clique para selecionar</div>
                    <div className="text-[11px] text-[#94a3b8]">Laudo de avaliação, matrícula do imóvel, contrato de cessão… PDF ou DOCX, máx. 10 MB</div>
                  </div>
                </div>

                {/* ── Protocolo DCC ─────────────────────────────────────── */}
                <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                  {/* Toggle header */}
                  <button
                    onClick={() => setShowDCC(v => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-[#fafbfc] hover:bg-[#f1f5f9] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-[#0b1f3a] flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-cube text-white text-[12px]"></i>
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#0b1f3a] flex items-center gap-2">
                          DCC — Digital Cash Collateral
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#6d28d9]">
                            Novo
                          </span>
                        </div>
                        <div className="text-[11.5px] text-[#64748b] mt-0.5">
                          Construa colateral líquido digital para esta operação
                        </div>
                      </div>
                    </div>
                    <i className={`fas fa-chevron-${showDCC ? 'up' : 'down'} text-[11px] text-[#94a3b8] group-hover:text-[#0b1f3a] transition-all flex-shrink-0`}></i>
                  </button>

                  {/* Conteúdo expansível */}
                  {showDCC && (
                    <div className="px-5 py-5 border-t border-[#e2e8f0] space-y-4">
                      <p className="text-[13px] text-[#475569] leading-relaxed">
                        O <strong className="text-[#0b1f3a]">DCC (Digital Cash Collateral)</strong> é um novo formato de colateral líquido da Bloxs — uma posição em caixa digital que substitui ou complementa garantias tradicionais. Em vez de imobilizar ativos físicos, o emissor deposita recursos tokenizados que ficam segregados e disponíveis para execução imediata em caso de inadimplência, reduzindo custo de estruturação e acelerando o processo de aprovação.
                      </p>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { icon: 'fa-bolt',          title: 'Execução imediata',    desc: 'Colateral disponível para liquidação instantânea — sem necessidade de ação judicial.' },
                          { icon: 'fa-water',         title: 'Colateral líquido',    desc: 'Recursos em caixa digital, sem imobilização de ativos físicos ou reais.' },
                          { icon: 'fa-chart-line',    title: 'Melhora o rating',     desc: 'Estrutura de colateral líquido eleva o perfil de crédito e pode reduzir o spread exigido.' },
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
            )}

            {/* ── STEP 4: Revisão & Envio ──────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  {/* Dados da Operação */}
                  <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                        <i className="fas fa-file-alt mr-1.5"></i>Operação
                      </span>
                      <button onClick={() => setStep(1)} className="text-[11px] text-[#1a6edb] font-semibold hover:underline">
                        Editar
                      </button>
                    </div>
                    <dl className="space-y-2">
                      {[
                        ['Instrumento', form.instrumento || '—'],
                        ['Setor',       form.setor || '—'],
                        ['Volume',      form.volume ? `R$ ${form.volume} MM` : '—'],
                        ['Taxa',        form.spread ? `${form.indexador} ${form.spread}%` : '—'],
                        ['Prazo',       form.prazo ? `${form.prazo} meses` : '—'],
                        ['Amortização', form.amortizacao || '—'],
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
                      <button onClick={() => setStep(2)} className="text-[11px] text-[#1a6edb] font-semibold hover:underline">
                        Editar
                      </button>
                    </div>
                    <dl className="space-y-2">
                      {[
                        ['Razão Social', form.razaoSocial || '—'],
                        ['CNPJ',         form.cnpj || '—'],
                        ['Responsável',  form.contato || '—'],
                        ['E-mail',       form.email || '—'],
                        ['Rating',       form.rating || 'A definir'],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-[10px] uppercase font-semibold text-[#94a3b8]">{k}</dt>
                          <dd className="text-[12.5px] font-semibold text-[#0b1f3a] break-all">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* Garantias */}
                  <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                        <i className="fas fa-shield-alt mr-1.5"></i>Garantias
                      </span>
                      <button onClick={() => setStep(3)} className="text-[11px] text-[#1a6edb] font-semibold hover:underline">
                        Editar
                      </button>
                    </div>
                    <dl className="space-y-2">
                      {garantias.map(g => (
                        <div key={g.id}>
                          <dt className="text-[10px] uppercase font-semibold text-[#94a3b8]">{g.hierarquia}</dt>
                          <dd className="text-[12.5px] font-semibold text-[#0b1f3a]">
                            {g.tipo || 'Tipo não definido'}{g.valor ? ` · R$ ${g.valor}MM` : ''}
                          </dd>
                        </div>
                      ))}
                      <div>
                        <dt className="text-[10px] uppercase font-semibold text-[#94a3b8]">LTV Global</dt>
                        <dd className="text-[12.5px] font-semibold text-[#0b1f3a]">{ltv > 0 ? `${ltv}%` : '—'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <InfoBox variant="info">
                  <span className="text-[12.5px]">
                    Ao enviar, esta operação será registrada como <strong>{opId}</strong> no Deal Flow com status
                    <strong> "Originação"</strong>. A equipe de estruturação da Bloxs iniciará a análise em até 2 dias úteis.
                  </span>
                </InfoBox>

                {/* Confirmação */}
                <div
                  className={`flex items-start gap-3 p-4 rounded-xl border-[1.5px] cursor-pointer transition-all ${
                    form.confirmado
                      ? 'bg-[#f0fdf4] border-[#22c55e]'
                      : errors.confirmado
                      ? 'bg-[#fef2f2] border-[#ef4444]'
                      : 'bg-white border-[#e2e8f0] hover:border-[#1a6edb]'
                  }`}
                  onClick={() => field('confirmado', !form.confirmado)}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all ${
                    form.confirmado ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[#d1d5db]'
                  }`}>
                    {form.confirmado && <i className="fas fa-check text-white text-[9px]"></i>}
                  </div>
                  <span className="text-[13px] text-[#475569] leading-relaxed">
                    Confirmo que as informações prestadas são verídicas e autorizo a <strong className="text-[#0b1f3a]">Bloxs IBaaS</strong> a
                    iniciar o processo de análise e estruturação desta operação.
                  </span>
                </div>
                {errors.confirmado && (
                  <p className="text-[12px] text-[#ef4444] -mt-2">{errors.confirmado}</p>
                )}
              </div>
            )}
          </CardBody>

          {/* ── Navigation footer ─────────────────────────────────────────── */}
          <div className="px-7 py-4 border-t border-[#e2e8f0] bg-[#fafbfc] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <Button variant="outline" size="sm" onClick={prevStep} icon={<i className="fas fa-arrow-left"></i>}>
                  Voltar
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={saveRascunho} icon={<i className={`fas fa-${saving ? 'spinner fa-spin' : savedAt ? 'check' : 'save'}`}></i>}>
                {saving ? 'Salvando…' : savedAt ? `Salvo às ${savedAt}` : 'Salvar Rascunho'}
              </Button>
            </div>

            {step < 4 ? (
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

// ─── TEASER MODAL (6.1) ───────────────────────────────────────────────────────

function TeaserModal({ form, garantias, ltv, onClose }: {
  form: FormState;
  garantias: GarantiaItem[];
  ltv: number;
  onClose: () => void;
}) {
  const hoje = new Date().toLocaleDateString('pt-BR');

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[700]" onClick={onClose} />
      <div className="fixed inset-0 z-[800] flex items-center justify-center p-4 overflow-auto">
        <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[700px] overflow-hidden">

          {/* Header */}
          <div className="bg-[#0b1f3a] px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://bloxs.com.br/_next/static/media/logotype-bloxs.24b4579c.svg" alt="Bloxs" className="h-5 brightness-0 invert" />
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
            {/* Título */}
            <div className="border-b border-[#e2e8f0] pb-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8] mb-1">Operação</div>
              <h1 className="font-['Playfair_Display'] text-[24px] font-semibold text-[#0b1f3a]">
                {form.razaoSocial || 'Emissor não informado'}
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {form.instrumento && (
                  <span className="bg-[#0b1f3a] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    {form.instrumento}
                  </span>
                )}
                {form.rating && (
                  <span className="bg-[#ede9fe] text-[#6d28d9] text-[11px] font-semibold px-3 py-1 rounded-full">
                    Rating {form.rating}
                  </span>
                )}
                {form.setor && (
                  <span className="bg-[#f1f5f9] text-[#475569] text-[11px] font-medium px-3 py-1 rounded-full">
                    {form.setor}
                  </span>
                )}
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Volume',     value: form.volume   ? `R$ ${form.volume} MM`              : '—' },
                { label: 'Taxa',       value: form.spread   ? `${form.indexador} +${form.spread}%` : '—' },
                { label: 'Prazo',      value: form.prazo    ? `${form.prazo} meses`                : '—' },
                { label: 'Amortização', value: form.amortizacao || '—' },
              ].map((k, i) => (
                <div key={i} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] px-4 py-3 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8] mb-1">{k.label}</div>
                  <div className="text-[14px] font-bold text-[#0b1f3a]">{k.value}</div>
                </div>
              ))}
            </div>

            {/* Emissor + Garantias */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1a6edb] mb-2 flex items-center gap-1.5">
                  <i className="fas fa-building text-[10px]"></i> Emissor
                </div>
                <dl className="space-y-1.5">
                  {[
                    ['Razão Social', form.razaoSocial || '—'],
                    ['CNPJ',         form.cnpj        || '—'],
                    ['Localização',  form.endereco    || '—'],
                    ['Responsável',  form.contato     || '—'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[10px] text-[#94a3b8] font-semibold uppercase">{k}</dt>
                      <dd className="text-[12.5px] text-[#0b1f3a] font-medium break-all">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1a6edb] mb-2 flex items-center gap-1.5">
                  <i className="fas fa-shield-alt text-[10px]"></i> Garantias
                </div>
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

            {/* Uso dos Recursos */}
            {(form.usoRecursos || form.descricao) && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1a6edb] mb-2 flex items-center gap-1.5">
                  <i className="fas fa-bullseye text-[10px]"></i> Uso dos Recursos
                </div>
                <p className="text-[12.5px] text-[#475569] leading-relaxed">
                  {form.usoRecursos || form.descricao}
                </p>
              </div>
            )}

            {/* Footer legal */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] px-4 py-3">
              <p className="text-[10px] text-[#94a3b8] leading-relaxed">
                <strong>CONFIDENCIAL.</strong> Este documento contém informações proprietárias destinadas exclusivamente a Investidores Qualificados conforme definição da RCVM 30/2023. Proibida sua reprodução, distribuição ou divulgação sem autorização expressa da Bloxs Securitizadora. As informações foram fornecidas pelo originador e não constituem oferta pública de valores mobiliários. ID: {form.razaoSocial?.slice(0,3).toUpperCase() || 'BLX'}-{Date.now().toString().slice(-6)} · Bloxs IBaaS Originação.
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
