import { useState } from 'react';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button, InfoBox, Input, Select } from './ds';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const OPERACOES_NF = [
  { value: '',           label: 'Selecione a operação'        },
  { value: 'agro',       label: 'Agro Cerrado — R$ 180.000'   },
  { value: 'eolica',     label: 'Eólica Nordeste — R$ 132.000'},
  { value: 'datacenter', label: 'Data Center MG — R$ 165.000' },
  { value: 'logistica',  label: 'Logística RJ — R$ 127.500'   },
  { value: 'telecom',    label: 'Telecom Norte — R$ 75.000'   },
];

type StatusPagamento = 'Pago' | 'Aguardando NF' | 'Em análise' | 'Em processamento';

interface Pagamento {
  operacao: string;
  nf: string;
  valor: number;
  data: string;
  status: StatusPagamento;
}

const HISTORICO: Pagamento[] = [
  { operacao: 'Agro Cerrado',    nf: 'NF 001', valor: 180000, data: '15/03/2026', status: 'Pago'           },
  { operacao: 'Eólica Nordeste', nf: 'NF 002', valor: 132000, data: '28/02/2026', status: 'Pago'           },
  { operacao: 'Data Center MG',  nf: '—',      valor: 165000, data: '—',          status: 'Aguardando NF'  },
  { operacao: 'Logística RJ',    nf: '—',      valor: 127500, data: '—',          status: 'Aguardando NF'  },
  { operacao: 'Telecom Norte',   nf: '—',      valor: 75000,  data: '—',          status: 'Em análise'     },
  { operacao: 'Solar Norte SP',  nf: '—',      valor: 63000,  data: '—',          status: 'Em análise'     },
];

const STATUS_STYLE: Record<StatusPagamento, {
  variant: 'success' | 'warning' | 'primary' | 'gray';
  icon: string;
}> = {
  'Pago':               { variant: 'success', icon: 'fa-check-circle'   },
  'Aguardando NF':      { variant: 'warning', icon: 'fa-file-invoice'   },
  'Em análise':         { variant: 'gray',    icon: 'fa-hourglass-half' },
  'Em processamento':   { variant: 'primary', icon: 'fa-spinner'        },
};

const pendentes = HISTORICO.filter(h => h.status === 'Aguardando NF').length;

const fmtBRL = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0 });

// ─── MASKS ────────────────────────────────────────────────────────────────────

const maskCNPJ = (v: string) =>
  v.replace(/\D/g, '').slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

const maskNFe = (v: string) =>
  v.replace(/\D/g, '').slice(0, 44)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

// ─── COMPONENT ────────────────────────────────────────────────────────────────

interface Props {
  nfPreSelected?: { operacaoValue: string; valor: number } | null;
  onNFSubmit?: () => void;
}

export default function FinanceiroPage({ nfPreSelected, onNFSubmit }: Props) {
  const [form, setForm] = useState({
    operacao: nfPreSelected?.operacaoValue ?? '',
    cnpj: '',
    valorNF: nfPreSelected?.valor ? String(nfPreSelected.valor) : '',
    numeroNF: '',
    chaveNFe: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let v = e.target.value;
    if (field === 'cnpj')    v = maskCNPJ(v);
    if (field === 'chaveNFe') v = maskNFe(v);
    setForm(prev => ({ ...prev, [field]: v }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.operacao)                   e.operacao  = 'Selecione a operação.';
    if (form.cnpj.replace(/\D/g,'').length < 14) e.cnpj = 'CNPJ inválido.';
    if (!form.valorNF)                    e.valorNF   = 'Informe o valor da NF.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
      setForm({ operacao: '', cnpj: '', valorNF: '', numeroNF: '', chaveNFe: '' });
      setErrors({});
      onNFSubmit?.();
    }, 1200);
  };

  const handleNovo = () => setEnviado(false);

  return (
    <div>
      <PageHeader
        breadcrumb="Área Financeira"
        title="Pagamentos e Nota Fiscal"
        subtitle="Gerencie a emissão de NF e o recebimento das comissões das operações fechadas."
      />

      {/* BANNER DE PENDÊNCIAS */}
      {pendentes > 0 && (
        <div className="mb-6">
          <InfoBox
            variant="warning"
            icon={<i className="fas fa-exclamation-triangle" />}
            title={`${pendentes} operaç${pendentes > 1 ? 'ões aguardam' : 'ão aguarda'} emissão de NF`}
          >
            O pagamento das comissões está condicionado ao envio da nota fiscal. Emita a NF abaixo para liberar o processamento.
          </InfoBox>
        </div>
      )}

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-2 gap-6 mb-6 max-lg:grid-cols-1">

        {/* FORMULÁRIO DE EMISSÃO */}
        <Card padding="none">
          <CardHeader icon={<i className="fas fa-file-invoice-dollar" />}>
            Emitir Nota Fiscal
          </CardHeader>
          <CardBody padding="lg">
            {enviado ? (
              <div className="flex flex-col items-center gap-5 py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--bloxs-success-light)] flex items-center justify-center">
                  <i className="fas fa-check text-[var(--bloxs-success)] text-2xl" />
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-[20px] font-semibold text-[var(--bloxs-navy)] mb-1">
                    NF enviada com sucesso!
                  </h3>
                  <p className="text-[13px] text-[var(--bloxs-text-muted)] max-w-[320px] leading-relaxed">
                    A equipe financeira da Bloxs recebeu sua nota fiscal e irá processar o pagamento em até <strong>3 dias úteis</strong>.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  icon={<i className="fas fa-plus text-[11px]" />}
                  onClick={handleNovo}
                >
                  Emitir outra NF
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <InfoBox variant="info" icon={<i className="fas fa-info-circle" />}>
                  Após o fechamento da operação, preencha os dados abaixo para que a Bloxs processe o pagamento da sua comissão.
                </InfoBox>

                <Select
                  label="Operação *"
                  options={OPERACOES_NF}
                  value={form.operacao}
                  onChange={set('operacao')}
                  error={errors.operacao}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="CNPJ do prestador *"
                    placeholder="00.000.000/0001-00"
                    value={form.cnpj}
                    onChange={set('cnpj')}
                    error={errors.cnpj}
                    leftIcon={<i className="fas fa-building text-[12px]" />}
                  />
                  <Input
                    label="Valor da NF (R$) *"
                    placeholder="Ex: 180.000"
                    value={form.valorNF}
                    onChange={set('valorNF')}
                    error={errors.valorNF}
                    leftIcon={<i className="fas fa-dollar-sign text-[12px]" />}
                  />
                </div>

                <Input
                  label="Número da NF"
                  placeholder="Número da nota fiscal"
                  value={form.numeroNF}
                  onChange={set('numeroNF')}
                  leftIcon={<i className="fas fa-hashtag text-[12px]" />}
                  helperText="Opcional — mas recomendado para rastreabilidade."
                />

                <Input
                  label="Chave de acesso NF-e"
                  placeholder="44 dígitos"
                  value={form.chaveNFe}
                  onChange={set('chaveNFe')}
                  leftIcon={<i className="fas fa-key text-[12px]" />}
                  helperText={`${form.chaveNFe.replace(/\s/g, '').length}/44 dígitos`}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={loading}
                  icon={<i className="fas fa-paper-plane text-[12px]" />}
                >
                  Enviar para financeiro Bloxs
                </Button>
              </form>
            )}
          </CardBody>
        </Card>

        {/* HISTÓRICO DE PAGAMENTOS */}
        <Card padding="none">
          <CardHeader
            icon={<i className="fas fa-history" />}
            action={
              <span className="text-[var(--bloxs-text-xs)] font-normal text-[var(--bloxs-text-muted)]">
                {HISTORICO.filter(h => h.status === 'Pago').length} pagamentos realizados
              </span>
            }
          >
            Histórico de pagamentos
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--bloxs-border)] bg-[var(--bloxs-gray-50)]">
                  {['Operação', 'NF', 'Valor', 'Data', 'Status', ''].map(h => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[10.5px] font-semibold tracking-[0.07em] uppercase text-[var(--bloxs-gray-400)] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bloxs-border)]">
                {HISTORICO.map((row, i) => {
                  const st = STATUS_STYLE[row.status];
                  const isPago = row.status === 'Pago';
                  return (
                    <tr key={i} className="hover:bg-[var(--bloxs-gray-50)] transition-colors group">
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] font-semibold text-[var(--bloxs-navy)]">
                          {row.operacao}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {row.nf === '—' ? (
                          <span className="text-[12px] text-[var(--bloxs-gray-300)]">—</span>
                        ) : (
                          <Badge variant="primary" size="sm">
                            <i className="fas fa-file text-[9px]" /> {row.nf}
                          </Badge>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] font-bold text-[var(--bloxs-navy)]">
                          {fmtBRL(row.valor)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-[var(--bloxs-text-muted)] whitespace-nowrap">
                        {row.data}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={st.variant} size="sm">
                          <i className={`fas ${st.icon} text-[9px]`} />
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isPago && (
                          <Button variant="ghost" size="sm" icon={<i className="fas fa-download text-[10px]" />}>
                            Baixar NF
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--bloxs-border)] bg-[var(--bloxs-gray-50)]">
                  <td colSpan={2} className="px-5 py-3.5 text-[11px] font-semibold tracking-[0.06em] uppercase text-[var(--bloxs-gray-400)]">
                    Total geral
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-['Playfair_Display'] text-[15px] font-semibold text-[var(--bloxs-navy)]">
                      {fmtBRL(HISTORICO.reduce((s, h) => s + h.valor, 0))}
                    </span>
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

      </div>

      {/* DADOS BANCÁRIOS E TRIBUTÁRIOS */}
      <Card padding="none">
        <CardHeader
          icon={<i className="fas fa-university" />}
          action={
            <Button variant="outline" size="sm" icon={<i className="fas fa-pen text-[11px]" />}>
              Editar dados
            </Button>
          }
        >
          Dados bancários e tributários
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-x-8 gap-y-5 max-lg:grid-cols-2 max-md:grid-cols-1">

            {/* Dados bancários */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--bloxs-blue)] mb-3 flex items-center gap-1.5">
                <i className="fas fa-piggy-bank text-[10px]" />
                Dados bancários
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Banco',   value: 'Itaú Unibanco (341)'       },
                  { label: 'Agência', value: '0001'                      },
                  { label: 'Conta',   value: '12345-6 — Corrente'        },
                  { label: 'Titular', value: 'Rafael Andrade Assessoria'  },
                ].map((item, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-[11px] font-semibold text-[var(--bloxs-gray-400)] w-[68px] flex-shrink-0">
                      {item.label}
                    </span>
                    <span className="text-[13px] text-[var(--bloxs-navy)] font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dados do prestador */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--bloxs-blue)] mb-3 flex items-center gap-1.5">
                <i className="fas fa-building text-[10px]" />
                Pessoa jurídica prestadora
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'CNPJ',          value: '12.345.678/0001-90'         },
                  { label: 'Razão social',   value: 'Rafael Andrade Assessoria Ltda' },
                  { label: 'Regime',         value: 'Simples Nacional'           },
                  { label: 'CNAE',           value: '6619-3/99 — Intermediação'  },
                ].map((item, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-[11px] font-semibold text-[var(--bloxs-gray-400)] w-[96px] flex-shrink-0">
                      {item.label}
                    </span>
                    <span className="text-[13px] text-[var(--bloxs-navy)] font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status de habilitação */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--bloxs-blue)] mb-3 flex items-center gap-1.5">
                <i className="fas fa-shield-alt text-[10px]" />
                Status de habilitação
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Cadastro Bloxs',  ok: true  },
                  { label: 'KYC / Onboarding', ok: true  },
                  { label: 'Dados bancários',  ok: true  },
                  { label: 'Contrato assinado', ok: true  },
                  { label: 'Declaração FATCA',  ok: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.ok
                        ? 'bg-[var(--bloxs-success-light)]'
                        : 'bg-[var(--bloxs-warning-light)]'
                    }`}>
                      <i className={`fas ${item.ok ? 'fa-check' : 'fa-clock'} text-[9px] ${
                        item.ok ? 'text-[var(--bloxs-success)]' : 'text-[var(--bloxs-warning)]'
                      }`} />
                    </div>
                    <span className="text-[12.5px] text-[var(--bloxs-navy)]">{item.label}</span>
                    {!item.ok && (
                      <Badge variant="warning" size="sm">Pendente</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </CardBody>
      </Card>
    </div>
  );
}
