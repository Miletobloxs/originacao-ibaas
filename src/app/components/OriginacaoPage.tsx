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
  const [savedAt,   setSavedAt]   = useState<string | null>(() => localStorage.getItem('originar_rascunho_at'));
  const [saving,    setSaving]    = useState(false);
  const [opId]                    = useState(() => `OP-${String(Date.now()).slice(-3)}`);

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
    if (!validate(step)) return;
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
            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                icon={<i className="fas fa-stream"></i>}
                onClick={() => onNavigate?.('dealflow')}
              >
                Acompanhar no Deal Flow
              </Button>
              <Button
                variant="outline"
                icon={<i className="fas fa-plus"></i>}
                onClick={() => { setEnviado(false); setForm(EMPTY); setStep(1); }}
              >
                Nova Operação
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ── Volume / LTV helpers ──────────────────────────────────────────────────
  const volumeMM  = parseMM(form.volume);
  const garantiaMM = parseMM(form.valorGarantia);
  const ltv = volumeMM > 0 ? Math.round((garantiaMM / volumeMM) * 100) : 0;

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
              </div>
            )}

            {/* ── STEP 3: Garantias ─────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <Select
                    label="Tipo de Garantia"
                    value={form.tipoGarantia}
                    onChange={e => field('tipoGarantia', e.target.value)}
                    options={[
                      { value: '',                      label: 'Selecione' },
                      { value: 'Alienação Fiduciária',  label: 'Alienação Fiduciária' },
                      { value: 'Penhor de Recebíveis',  label: 'Penhor de Recebíveis' },
                      { value: 'Aval',                  label: 'Aval' },
                      { value: 'Fiança Bancária',        label: 'Fiança Bancária' },
                      { value: 'Garantia Real Imobiliária', label: 'Garantia Real Imobiliária' },
                      { value: 'Fundo de Reserva',      label: 'Fundo de Reserva' },
                      { value: 'Sem Garantia',          label: 'Sem Garantia (sênior/subordinada)' },
                    ]}
                  />
                  <Input
                    label="Valor da Garantia (R$ MM)"
                    value={form.valorGarantia}
                    onChange={e => field('valorGarantia', e.target.value.replace(/\D/g,'').slice(0,5))}
                    placeholder="Ex: 75"
                    rightIcon={<span className="text-[11px] font-semibold">MM</span>}
                    helperText={volumeMM > 0 && garantiaMM > 0 ? `LTV calculado: ${ltv}%` : undefined}
                  />
                </div>

                {/* LTV indicator */}
                {volumeMM > 0 && garantiaMM > 0 && (
                  <div className={`rounded-xl p-4 border ${
                    ltv >= 100 ? 'bg-[#f0fdf4] border-[#86efac]' :
                    ltv >= 70  ? 'bg-[#fffbeb] border-[#fde68a]' :
                                 'bg-[#fef2f2] border-[#fecaca]'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[12px] font-semibold ${
                        ltv >= 100 ? 'text-[#15803d]' : ltv >= 70 ? 'text-[#92400e]' : 'text-[#dc2626]'
                      }`}>
                        <i className={`fas ${ltv >= 100 ? 'fa-shield-alt' : ltv >= 70 ? 'fa-exclamation-triangle' : 'fa-times-circle'} mr-1.5`}></i>
                        Cobertura de Garantia: {ltv}%
                      </span>
                      <span className="text-[11px] text-[#94a3b8]">
                        R$ {garantiaMM} MM / R$ {volumeMM} MM
                      </span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          ltv >= 100 ? 'bg-[#22c55e]' : ltv >= 70 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
                        }`}
                        style={{ width: `${Math.min(ltv, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <Textarea
                  label="Descrição da Garantia"
                  value={form.descGarantia}
                  onChange={e => field('descGarantia', e.target.value)}
                  placeholder="Descreva o bem dado em garantia, localização, avaliação, registro em cartório, etc."
                  rows={4}
                />

                {/* Upload visual */}
                <div>
                  <div className="text-[13px] font-medium text-[#1e293b] mb-1.5">
                    Documentos de Suporte <span className="text-[11px] text-[#94a3b8] font-normal">(opcional)</span>
                  </div>
                  <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-8 text-center hover:border-[#1a6edb]/50 hover:bg-[#f8faff] transition-all cursor-pointer">
                    <i className="fas fa-cloud-upload-alt text-[28px] text-[#94a3b8] mb-3 block"></i>
                    <div className="text-[13px] font-semibold text-[#0b1f3a] mb-1">
                      Arraste arquivos ou clique para selecionar
                    </div>
                    <div className="text-[11px] text-[#94a3b8]">
                      Laudo de avaliação, matrícula do imóvel, contrato de penhor… PDF ou DOCX, máx. 10 MB por arquivo
                    </div>
                  </div>
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
                      {[
                        ['Tipo',     form.tipoGarantia || 'Não informado'],
                        ['Valor',    form.valorGarantia ? `R$ ${form.valorGarantia} MM` : '—'],
                        ['Cobertura', volumeMM > 0 && garantiaMM > 0 ? `${ltv}% do volume` : '—'],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-[10px] uppercase font-semibold text-[#94a3b8]">{k}</dt>
                          <dd className="text-[12.5px] font-semibold text-[#0b1f3a]">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    {form.descGarantia && (
                      <div className="mt-3 pt-3 border-t border-[#e2e8f0]">
                        <dt className="text-[10px] uppercase font-semibold text-[#94a3b8] mb-1">Descrição</dt>
                        <dd className="text-[11.5px] text-[#475569] leading-relaxed line-clamp-4">{form.descGarantia}</dd>
                      </div>
                    )}
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
