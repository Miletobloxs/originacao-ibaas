import { useState, useRef } from 'react';
import { PageHeader, KPICard, Card, CardHeader, CardBody, Badge, Button, InfoBox, Select } from './ds';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Tab = 'contratos' | 'operacao' | 'compliance' | 'upload';
type DocStatus = 'Assinado' | 'Pendente' | 'Disponível' | 'Validado' | 'Expirado';
type FileType = 'pdf' | 'excel' | 'word' | 'signed' | 'shield' | 'user-check' | 'lock';

interface Documento {
  id: string;
  nome: string;
  meta: string;
  tipo: FileType;
  status: DocStatus;
  acoes: ('download' | 'sign' | 'view')[];
}

interface OperacaoDoc {
  nome: string;
  volume: string;
  status: 'Concluído' | 'Estruturação' | 'Análise' | 'Diligência';
  docs: Documento[];
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CONTRATOS: Documento[] = [
  {
    id: 'd1', tipo: 'signed',
    nome: 'Mandato de Originação — Logística RJ',
    meta: 'Assinado em 10/04/2026 · PDF · 240 KB',
    status: 'Assinado', acoes: ['download'],
  },
  {
    id: 'd2', tipo: 'signed',
    nome: 'Contrato de Originação — Bloxs × Roberto Alves',
    meta: 'Assinado em 15/01/2026 · PDF · 412 KB',
    status: 'Assinado', acoes: ['download'],
  },
  {
    id: 'd3', tipo: 'pdf',
    nome: 'Mandato de Originação — Solar Norte SP',
    meta: 'Pendente de assinatura · PDF · 218 KB',
    status: 'Pendente', acoes: ['sign', 'download'],
  },
  {
    id: 'd4', tipo: 'pdf',
    nome: 'Termo de Confidencialidade — Data Center MG',
    meta: 'Pendente de assinatura · PDF · 180 KB',
    status: 'Pendente', acoes: ['sign', 'download'],
  },
  {
    id: 'd5', tipo: 'signed',
    nome: 'Mandato de Originação — Agro Mato Grosso',
    meta: 'Assinado em 05/03/2026 · PDF · 225 KB',
    status: 'Assinado', acoes: ['download'],
  },
  {
    id: 'd6', tipo: 'pdf',
    nome: 'Acordo de Parceria Bloxs — Aditivo 2026',
    meta: 'Pendente de assinatura · PDF · 310 KB',
    status: 'Pendente', acoes: ['sign', 'download'],
  },
];

const POR_OPERACAO: OperacaoDoc[] = [
  {
    nome: 'Agro Cerrado', volume: 'R$ 120M', status: 'Concluído',
    docs: [
      { id: 'o1', tipo: 'pdf',   nome: 'Instrumento de Emissão CRA',         meta: 'PDF · 1,2 MB',  status: 'Disponível', acoes: ['download'] },
      { id: 'o2', tipo: 'excel', nome: 'Modelo financeiro da operação',       meta: 'XLSX · 890 KB', status: 'Disponível', acoes: ['download'] },
      { id: 'o3', tipo: 'pdf',   nome: 'Relatório de due diligence',          meta: 'PDF · 2,1 MB',  status: 'Disponível', acoes: ['download', 'view'] },
    ],
  },
  {
    nome: 'Data Center MG', volume: 'R$ 110M', status: 'Estruturação',
    docs: [
      { id: 'o4', tipo: 'pdf',   nome: 'Minuta de escritura FIDC',            meta: 'PDF · 540 KB',  status: 'Disponível', acoes: ['download', 'view'] },
      { id: 'o5', tipo: 'word',  nome: 'Parecer jurídico — Estrutura',        meta: 'DOCX · 320 KB', status: 'Disponível', acoes: ['download'] },
      { id: 'o6', tipo: 'excel', nome: 'Projeção de fluxo de caixa',          meta: 'XLSX · 1,1 MB', status: 'Disponível', acoes: ['download'] },
    ],
  },
  {
    nome: 'Logística RJ', volume: 'R$ 85M', status: 'Análise',
    docs: [
      { id: 'o7', tipo: 'pdf',   nome: 'Memória de cálculo financeiro',       meta: 'PDF · 410 KB',  status: 'Disponível', acoes: ['download', 'view'] },
      { id: 'o8', tipo: 'pdf',   nome: 'Documentação de garantias',           meta: 'PDF · 780 KB',  status: 'Disponível', acoes: ['download'] },
    ],
  },
  {
    nome: 'Solar Norte SP', volume: 'R$ 42M', status: 'Diligência',
    docs: [
      { id: 'o9', tipo: 'pdf',   nome: 'Relatório técnico preliminar',        meta: 'PDF · 1,4 MB',  status: 'Disponível', acoes: ['download', 'view'] },
      { id: 'o10', tipo: 'word', nome: 'Escopo de diligência jurídica',       meta: 'DOCX · 215 KB', status: 'Disponível', acoes: ['download'] },
    ],
  },
];

const COMPLIANCE: Documento[] = [
  {
    id: 'c1', tipo: 'shield',
    nome: 'Cadastro KYC — RCVM 50',
    meta: 'Aprovado em 20/01/2026',
    status: 'Validado', acoes: ['view'],
  },
  {
    id: 'c2', tipo: 'user-check',
    nome: 'Suitability — RCVM 30',
    meta: 'Perfil: Moderado · Válido até jan/2031',
    status: 'Validado', acoes: ['view'],
  },
  {
    id: 'c3', tipo: 'lock',
    nome: 'Declaração PLD/FTP — RCVM 50',
    meta: 'Assinada em 20/01/2026',
    status: 'Validado', acoes: ['download'],
  },
  {
    id: 'c4', tipo: 'pdf',
    nome: 'Declaração FATCA / CRS',
    meta: 'Pendente de envio',
    status: 'Pendente', acoes: ['download', 'sign'],
  },
];

// ─── STYLE MAPS ───────────────────────────────────────────────────────────────

const ICON_STYLE: Record<FileType, { icon: string; bg: string; color: string }> = {
  pdf:         { icon: 'fa-file-pdf',       bg: '#fee2e2', color: '#dc2626' },
  excel:       { icon: 'fa-file-excel',     bg: '#d1fae5', color: '#059669' },
  word:        { icon: 'fa-file-word',      bg: '#dbeafe', color: '#1d4ed8' },
  signed:      { icon: 'fa-file-signature', bg: '#d6e8ff', color: '#1a6edb' },
  shield:      { icon: 'fa-shield-alt',     bg: '#e0f2fe', color: '#0369a1' },
  'user-check':{ icon: 'fa-user-check',     bg: '#d1fae5', color: '#059669' },
  lock:        { icon: 'fa-lock',           bg: '#f1f5f9', color: '#475569' },
};

const STATUS_BADGE: Record<DocStatus, 'success' | 'warning' | 'primary' | 'gray'> = {
  Assinado:   'success',
  Disponível: 'success',
  Validado:   'success',
  Pendente:   'warning',
  Expirado:   'error' as never,
};

const OP_STATUS_BADGE: Record<OperacaoDoc['status'], 'success' | 'warning' | 'primary' | 'gray'> = {
  Concluído:    'success',
  Estruturação: 'primary',
  Análise:      'gray',
  Diligência:   'warning',
};

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'contratos', label: 'Contratos & Mandatos', icon: 'fa-file-signature' },
  { id: 'operacao',  label: 'Por Operação',          icon: 'fa-layer-group'    },
  { id: 'compliance',label: 'Compliance',            icon: 'fa-shield-alt'     },
  { id: 'upload',    label: 'Upload',                icon: 'fa-cloud-upload-alt'},
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function DocumentosPage() {
  const [tab, setTab] = useState<Tab>('contratos');
  const [expandedOps, setExpandedOps] = useState<string[]>(['Agro Cerrado']);
  const [busca, setBusca] = useState('');
  const [assinandoDoc, setAssinandoDoc] = useState<Documento | null>(null);
  const [assinaStep, setAssinaStep] = useState<0 | 1 | 2>(0);
  const [assinadosIds, setAssinadosIds] = useState<string[]>([]);

  function abrirModal(doc: Documento) {
    setAssinandoDoc(doc);
    setAssinaStep(0);
  }

  function confirmarAssinatura() {
    setAssinaStep(1);
    setTimeout(() => {
      setAssinaStep(2);
      setAssinadosIds(prev => [...prev, assinandoDoc!.id]);
    }, 2000);
  }

  function fecharModal() {
    setAssinandoDoc(null);
    setAssinaStep(0);
  }

  function docEfetivo(doc: Documento): Documento {
    if (assinadosIds.includes(doc.id)) {
      return { ...doc, status: 'Assinado', tipo: 'signed', acoes: ['download'] };
    }
    return doc;
  }

  const toggleOp = (nome: string) =>
    setExpandedOps(prev =>
      prev.includes(nome) ? prev.filter(n => n !== nome) : [...prev, nome]
    );

  const totalDocs = CONTRATOS.length + POR_OPERACAO.reduce((s, o) => s + o.docs.length, 0) + COMPLIANCE.length;
  const totalAssinados = [...CONTRATOS, ...COMPLIANCE].filter(d => d.status === 'Assinado' || d.status === 'Validado').length;
  const totalPendentes = [...CONTRATOS, ...COMPLIANCE].filter(d => d.status === 'Pendente').length;
  const totalDownload = totalDocs - totalPendentes;

  const filtrarDocs = (docs: Documento[]) =>
    busca ? docs.filter(d => d.nome.toLowerCase().includes(busca.toLowerCase())) : docs;

  return (
    <div>
      <PageHeader
        breadcrumb="Documentos"
        title="Gestão de Documentos"
        subtitle="Mandatos, contratos, documentos regulatórios e arquivos por operação, em um só lugar."
        action={
          <Button variant="outline" size="sm" icon={<i className="fas fa-download text-[11px]" />}>
            Exportar tudo
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6 max-lg:grid-cols-2">
        <KPICard
          label="Total de documentos"
          value={String(totalDocs)}
          subtitle="em todas as categorias"
          icon={<i className="fas fa-folder-open" />}
        />
        <KPICard
          label="Assinados"
          value={String(totalAssinados)}
          subtitle="Sem pendências"
          icon={<i className="fas fa-check-circle" />}
          trend="neutral"
          trendValue="OK"
        />
        <KPICard
          label="Pendentes de assinatura"
          value={String(totalPendentes)}
          subtitle="Atenção necessária"
          icon={<i className="fas fa-clock" />}
          trend={totalPendentes > 0 ? 'down' : 'neutral'}
          trendValue={totalPendentes > 0 ? 'Ação requerida' : 'OK'}
        />
        <KPICard
          label="Para download"
          value={String(totalDownload)}
          subtitle="disponíveis agora"
          icon={<i className="fas fa-download" />}
        />
      </div>

      {/* ALERT PENDENTES */}
      {totalPendentes > 0 && (
        <div className="mb-5">
          <InfoBox variant="warning" icon={<i className="fas fa-exclamation-triangle" />} title={`${totalPendentes} documento${totalPendentes > 1 ? 's pendentes' : ' pendente'} de assinatura`}>
            Assine os documentos pendentes para liberar as respectivas operações para a próxima fase.
          </InfoBox>
        </div>
      )}

      {/* TABS */}
      <div className="flex items-end gap-0 border-b-2 border-[var(--bloxs-border)] mb-6">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setBusca(''); }}
            className={`flex items-center gap-2 px-5 py-3 text-[13px] font-semibold transition-all border-b-2 -mb-[2px] ${
              tab === t.id
                ? 'text-[var(--bloxs-blue)] border-b-[var(--bloxs-blue)] bg-[var(--bloxs-blue-xxlight)] rounded-t-[var(--bloxs-radius-md)]'
                : 'text-[var(--bloxs-gray-500)] border-b-transparent hover:text-[var(--bloxs-navy)] hover:bg-[var(--bloxs-gray-50)] rounded-t-[var(--bloxs-radius-md)]'
            }`}
          >
            <i className={`fas ${t.icon} text-[11px]`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ABA 1: CONTRATOS & MANDATOS ── */}
      {tab === 'contratos' && (
        <div>
          <SearchBar value={busca} onChange={setBusca} placeholder="Buscar contrato ou mandato..." />
          <div className="flex flex-col gap-3 mt-4">
            {filtrarDocs(CONTRATOS).length === 0 ? (
              <EmptySearch />
            ) : (
              filtrarDocs(CONTRATOS).map(doc => (
                <DocCard key={doc.id} doc={docEfetivo(doc)} onAssinar={() => abrirModal(doc)} />
              ))
            )}
          </div>
        </div>
      )}

      {/* ── ABA 2: POR OPERAÇÃO ── */}
      {tab === 'operacao' && (
        <div className="flex flex-col gap-4">
          {POR_OPERACAO.map(op => {
            const isExpanded = expandedOps.includes(op.nome);
            return (
              <Card key={op.nome} padding="none">
                <button
                  className="w-full text-left"
                  onClick={() => toggleOp(op.nome)}
                >
                  <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--bloxs-border)] hover:bg-[var(--bloxs-gray-50)] transition-colors">
                    <div className="flex items-center gap-3">
                      <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'} text-[11px] text-[var(--bloxs-gray-400)] transition-transform`} />
                      <div>
                        <span className="text-[14px] font-semibold text-[var(--bloxs-navy)]">{op.nome}</span>
                        <span className="text-[var(--bloxs-text-muted)] text-[13px] ml-2">{op.volume}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-[var(--bloxs-text-muted)]">{op.docs.length} documento{op.docs.length !== 1 ? 's' : ''}</span>
                      <Badge variant={OP_STATUS_BADGE[op.status]} size="sm">{op.status}</Badge>
                    </div>
                  </div>
                </button>
                {isExpanded && (
                  <div className="p-4 flex flex-col gap-2.5">
                    {op.docs.map(doc => (
                      <DocCard key={doc.id} doc={doc} compact />
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ── ABA 3: COMPLIANCE ── */}
      {tab === 'compliance' && (
        <div>
          <div className="mb-4">
            <InfoBox variant="info" icon={<i className="fas fa-info-circle" />} title="Documentação regulatória">
              Estes documentos são exigidos pela CVM e ANBIMA para a atuação como originador credenciado. Mantenha-os sempre atualizados.
            </InfoBox>
          </div>
          <div className="flex flex-col gap-3">
            {COMPLIANCE.map(doc => (
              <DocCard key={doc.id} doc={docEfetivo(doc)} onAssinar={() => abrirModal(doc)} />
            ))}
          </div>
        </div>
      )}

      {/* ── ABA 4: UPLOAD ── */}
      {tab === 'upload' && (
        <UploadTab />
      )}

      {/* ── MODAL DE ASSINATURA ── */}
      {assinandoDoc && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[700]" onClick={assinaStep !== 1 ? fecharModal : undefined} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] bg-white rounded-2xl shadow-2xl z-[800] overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--bloxs-border)] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--bloxs-blue)] mb-0.5">
                  Assinatura digital
                </div>
                <h3 className="text-[15px] font-semibold text-[var(--bloxs-navy)] leading-snug">
                  {assinandoDoc.nome}
                </h3>
              </div>
              {assinaStep !== 1 && (
                <button onClick={fecharModal} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--bloxs-gray-400)] hover:bg-[var(--bloxs-gray-100)] hover:text-[var(--bloxs-navy)] transition-all">
                  <i className="fas fa-times text-[13px]" />
                </button>
              )}
            </div>

            <div className="p-6">
              {/* Etapa 0 — Confirmação */}
              {assinaStep === 0 && (
                <div>
                  <div className="bg-[var(--bloxs-gray-50)] rounded-xl p-4 border border-[var(--bloxs-border)] mb-5 space-y-2.5">
                    {[
                      { label: 'Documento', value: assinandoDoc.nome },
                      { label: 'Tipo', value: assinandoDoc.meta },
                      { label: 'Signatário', value: 'Rafael Andrade — CPF: 123.456.789-00' },
                      { label: 'Data / hora', value: new Date().toLocaleString('pt-BR') },
                    ].map(r => (
                      <div key={r.label} className="flex gap-2">
                        <span className="text-[11px] font-semibold text-[var(--bloxs-gray-400)] w-[90px] flex-shrink-0 pt-0.5">{r.label}</span>
                        <span className="text-[12.5px] text-[var(--bloxs-navy)] font-medium leading-snug">{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3 text-[12px] text-[#92400e] leading-relaxed mb-5 flex gap-2.5">
                    <i className="fas fa-exclamation-triangle text-[#d97706] mt-0.5 flex-shrink-0" />
                    Ao assinar, você confirma que leu e concorda com os termos deste documento. A assinatura tem validade jurídica conforme MP 2.200-2/2001.
                  </div>
                  <div className="flex gap-3">
                    <button onClick={fecharModal} className="flex-1 py-2.5 border border-[var(--bloxs-border)] text-[var(--bloxs-gray-600)] text-[13px] font-semibold rounded-xl hover:border-[var(--bloxs-gray-400)] transition-all">
                      Cancelar
                    </button>
                    <button onClick={confirmarAssinatura} className="flex-1 py-2.5 bg-[#0b1f3a] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1a6edb] transition-all flex items-center justify-center gap-2">
                      <i className="fas fa-pen-nib text-[11px]" />
                      Confirmar assinatura
                    </button>
                  </div>
                </div>
              )}

              {/* Etapa 1 — Assinando */}
              {assinaStep === 1 && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#1a6edb] border-t-transparent animate-spin" />
                  <div>
                    <h4 className="text-[15px] font-semibold text-[var(--bloxs-navy)] mb-1">Assinando documento…</h4>
                    <p className="text-[12.5px] text-[var(--bloxs-text-muted)]">Aguarde, estamos processando sua assinatura digital.</p>
                  </div>
                </div>
              )}

              {/* Etapa 2 — Assinado */}
              {assinaStep === 2 && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#d1fae5] flex items-center justify-center">
                    <i className="fas fa-check text-[#059669] text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-['Playfair_Display'] text-[20px] font-semibold text-[var(--bloxs-navy)] mb-1">Documento assinado!</h4>
                    <p className="text-[12.5px] text-[var(--bloxs-text-muted)] max-w-[300px] leading-relaxed">
                      Sua assinatura foi registrada com sucesso. O documento está disponível para download.
                    </p>
                  </div>
                  <div className="bg-[var(--bloxs-gray-50)] rounded-xl px-5 py-3 border border-[var(--bloxs-border)] text-left w-full space-y-1.5">
                    <div className="flex gap-2">
                      <span className="text-[10.5px] font-semibold text-[var(--bloxs-gray-400)] w-[80px]">Protocolo</span>
                      <span className="text-[11.5px] font-mono text-[var(--bloxs-navy)]">ASS-{Date.now().toString().slice(-8)}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10.5px] font-semibold text-[var(--bloxs-gray-400)] w-[80px]">Assinado em</span>
                      <span className="text-[11.5px] text-[var(--bloxs-navy)]">{new Date().toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full">
                    <button onClick={fecharModal} className="flex-1 py-2.5 bg-[#0b1f3a] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1a6edb] transition-all">
                      Concluir
                    </button>
                    <button className="py-2.5 px-4 border border-[var(--bloxs-border)] text-[var(--bloxs-gray-600)] text-[13px] font-medium rounded-xl hover:border-[var(--bloxs-navy)] transition-all flex items-center gap-2">
                      <i className="fas fa-download text-[11px]" />
                      Baixar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── DOC CARD ─────────────────────────────────────────────────────────────────

function DocCard({ doc, compact = false, onAssinar }: { doc: Documento; compact?: boolean; onAssinar?: () => void }) {
  const iconMeta = ICON_STYLE[doc.tipo];
  const badgeVariant = STATUS_BADGE[doc.status] ?? 'gray';

  return (
    <div className={`bg-white border border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-lg)] flex items-center gap-4 transition-all hover:shadow-[var(--bloxs-shadow-md)] hover:border-[var(--bloxs-gray-300)] ${compact ? 'px-4 py-3' : 'px-5 py-4'}`}>
      <div
        className={`${compact ? 'w-9 h-9 text-[16px]' : 'w-11 h-11 text-[20px]'} rounded-[var(--bloxs-radius-lg)] flex items-center justify-center flex-shrink-0`}
        style={{ backgroundColor: iconMeta.bg, color: iconMeta.color }}
      >
        <i className={`fas ${iconMeta.icon}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-[var(--bloxs-navy)] leading-snug truncate ${compact ? 'text-[12.5px]' : 'text-[13.5px]'}`}>
          {doc.nome}
        </div>
        <div className="text-[11.5px] text-[var(--bloxs-text-muted)] mt-0.5">{doc.meta}</div>
      </div>

      <Badge variant={badgeVariant} size="sm">
        <i className={`fas ${doc.status === 'Pendente' ? 'fa-clock' : 'fa-check-circle'} text-[9px]`} />
        {doc.status}
      </Badge>

      <div className="flex items-center gap-2 flex-shrink-0">
        {doc.acoes.includes('sign') && (
          <Button variant="secondary" size="sm" icon={<i className="fas fa-pen-nib text-[10px]" />} onClick={onAssinar}>
            Assinar
          </Button>
        )}
        {doc.acoes.includes('view') && (
          <Button variant="ghost" size="sm" icon={<i className="fas fa-eye text-[10px]" />}>
            {compact ? '' : 'Ver'}
          </Button>
        )}
        {doc.acoes.includes('download') && (
          <Button variant="outline" size="sm" icon={<i className="fas fa-download text-[10px]" />} />
        )}
      </div>
    </div>
  );
}

// ─── SEARCH BAR ───────────────────────────────────────────────────────────────

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative max-w-[360px]">
      <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--bloxs-gray-400)] text-[12px]" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-[9px] text-[13px] border-[1.5px] border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-base)] outline-none focus:border-[var(--bloxs-blue)] focus:shadow-[var(--bloxs-shadow-focus)] transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--bloxs-gray-400)] hover:text-[var(--bloxs-navy)] transition-colors"
        >
          <i className="fas fa-times text-[11px]" />
        </button>
      )}
    </div>
  );
}

function EmptySearch() {
  return (
    <div className="text-center py-12">
      <i className="fas fa-search text-[32px] text-[var(--bloxs-gray-300)] mb-3 block" />
      <p className="text-[13px] text-[var(--bloxs-text-muted)]">Nenhum documento encontrado para essa busca.</p>
    </div>
  );
}

// ─── UPLOAD TAB ───────────────────────────────────────────────────────────────

function UploadTab() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [operacao, setOperacao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [enviado, setEnviado] = useState(false);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setFiles(prev => [...prev, ...Array.from(newFiles)]);
  };

  const removeFile = (i: number) =>
    setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) return;
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setFiles([]);
      setOperacao('');
      setCategoria('');
    }, 3000);
  };

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const FILE_ICON: Record<string, string> = {
    'application/pdf': 'fa-file-pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'fa-file-excel',
    'application/vnd.ms-excel': 'fa-file-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word',
    'application/msword': 'fa-file-word',
  };

  return (
    <div className="max-w-[680px]">
      <Card padding="none">
        <CardHeader icon={<i className="fas fa-cloud-upload-alt" />}>
          Enviar novo documento
        </CardHeader>
        <CardBody padding="lg">
          {enviado ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[var(--bloxs-success-light)] flex items-center justify-center">
                <i className="fas fa-check text-[var(--bloxs-success)] text-xl" />
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-[18px] font-semibold text-[var(--bloxs-navy)] mb-1">
                  Documento{files.length > 1 ? 's enviados' : ' enviado'}!
                </h3>
                <p className="text-[13px] text-[var(--bloxs-text-muted)]">
                  {files.length} arquivo{files.length > 1 ? 's' : ''} {files.length > 1 ? 'foram enviados' : 'foi enviado'} com sucesso e {files.length > 1 ? 'estão' : 'está'} em análise.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Operação relacionada"
                  value={operacao}
                  onChange={e => setOperacao(e.target.value)}
                  options={[
                    { value: '',           label: 'Selecione'          },
                    { value: 'logistica',  label: 'Logística RJ'       },
                    { value: 'solar',      label: 'Solar Norte SP'     },
                    { value: 'datacenter', label: 'Data Center MG'     },
                    { value: 'agro_mt',    label: 'Agro Mato Grosso'   },
                    { value: 'telecom',    label: 'Telecom Norte'      },
                  ]}
                />
                <Select
                  label="Categoria"
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                  options={[
                    { value: '',          label: 'Selecione'               },
                    { value: 'empresa',   label: 'Documento de empresa'    },
                    { value: 'financeiro',label: 'Documento financeiro'    },
                    { value: 'garantia',  label: 'Garantia'                },
                    { value: 'societario',label: 'Documento societário'    },
                    { value: 'juridico',  label: 'Documento jurídico'      },
                    { value: 'compliance',label: 'Compliance / Regulatório'},
                  ]}
                />
              </div>

              {/* Drop zone */}
              <div>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                  className="hidden"
                  onChange={e => addFiles(e.target.files)}
                />
                <div
                  onClick={() => inputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-[var(--bloxs-radius-xl)] p-10 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[var(--bloxs-blue)] bg-[var(--bloxs-blue-xxlight)]'
                      : 'border-[var(--bloxs-gray-200)] bg-[var(--bloxs-gray-50)] hover:border-[var(--bloxs-blue)] hover:bg-[var(--bloxs-blue-xxlight)]'
                  }`}
                >
                  <i className={`fas fa-cloud-upload-alt text-[36px] mb-3 block transition-colors ${isDragging ? 'text-[var(--bloxs-blue)]' : 'text-[var(--bloxs-gray-300)]'}`} />
                  <p className={`text-[13.5px] font-semibold mb-1 transition-colors ${isDragging ? 'text-[var(--bloxs-blue)]' : 'text-[var(--bloxs-gray-500)]'}`}>
                    {isDragging ? 'Solte para adicionar' : 'Arraste arquivos ou clique para selecionar'}
                  </p>
                  <p className="text-[12px] text-[var(--bloxs-gray-400)]">
                    PDF, DOC, DOCX, XLSX — máx. 50 MB por arquivo
                  </p>
                </div>
              </div>

              {/* Lista de arquivos selecionados */}
              {files.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[var(--bloxs-gray-400)]">
                    {files.length} arquivo{files.length > 1 ? 's' : ''} selecionado{files.length > 1 ? 's' : ''}
                  </p>
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[var(--bloxs-gray-50)] border border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-lg)] px-4 py-3">
                      <i className={`fas ${FILE_ICON[f.type] ?? 'fa-file'} text-[16px] text-[var(--bloxs-blue)]`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-semibold text-[var(--bloxs-navy)] truncate">{f.name}</p>
                        <p className="text-[11px] text-[var(--bloxs-text-muted)]">{fmtSize(f.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-[var(--bloxs-gray-400)] hover:text-[var(--bloxs-error)] transition-colors"
                      >
                        <i className="fas fa-times text-[12px]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={files.length === 0}
                icon={<i className="fas fa-upload text-[12px]" />}
              >
                {files.length === 0 ? 'Selecione ao menos um arquivo' : `Enviar ${files.length} arquivo${files.length > 1 ? 's' : ''}`}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
