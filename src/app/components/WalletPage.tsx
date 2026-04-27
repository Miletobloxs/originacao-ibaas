import { useState } from 'react';
import { PageHeader, KPICard, Card, CardHeader, CardBody, Badge, Button, InfoBox } from './ds';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type TxType     = 'MINT' | 'BURN' | 'TRANSFER' | 'DEPLOY';
type TokenStatus = 'Ativo' | 'Encerrado';
type Instrumento = 'CRI' | 'CRA' | 'Debênture' | 'FIDC' | 'CCB';

interface Token {
  symbol: string;
  operacao: string;
  instrumento: Instrumento;
  contrato: string;
  emissao: string;
  vencimento: string;
  quantidade: number;
  valor: number;
  status: TokenStatus;
}

interface Transacao {
  hash: string;
  tipo: TxType;
  descricao: string;
  valor: string;
  bloco: number;
  data: string;
}

interface Contrato {
  nome: string;
  symbol: string;
  endereco: string;
  padrao: string;
  deployData: string;
  status: 'Ativo' | 'Encerrado';
  txns: number;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const WALLET_ADDRESS = '0x3F4A8c91B0D2E67F5A8B3C4D9E0F1A2B84C7D9E2';

const trunc = (addr: string, pre = 8, suf = 6) =>
  `${addr.slice(0, pre)}...${addr.slice(-suf)}`;

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TOKENS: Token[] = [
  {
    symbol: 'PAFIDC25', operacao: 'Portfólio Agro FIDC', instrumento: 'FIDC',
    contrato: '0x9A8B7C6D5E4F3021B2C3D4E5F6A7B8C9D0E1F203',
    emissao: 'Jan/2025', vencimento: 'Jan/2030', quantidade: 120, valor: 120, status: 'Ativo',
  },
  {
    symbol: 'ENRSP24', operacao: 'Energia Renovável SP', instrumento: 'Debênture',
    contrato: '0x2B3C4D5E6F708192A3B4C5D6E7F8091023456789',
    emissao: 'Mai/2024', vencimento: 'Mai/2027', quantidade: 88, valor: 88, status: 'Ativo',
  },
  {
    symbol: 'LOGRJ22', operacao: 'Logística RJ S.A.', instrumento: 'Debênture',
    contrato: '0x1A2B3C4D5E6F789012A3B4C5D6E7F80910ABCDEF',
    emissao: 'Abr/2022', vencimento: 'Abr/2026', quantidade: 65, valor: 65, status: 'Ativo',
  },
  {
    symbol: 'BIOMT25', operacao: 'Bioenergia MT', instrumento: 'CRA',
    contrato: '0x5F6E7D8C9B0A1234567890ABCDEF01234567890A',
    emissao: 'Mar/2025', vencimento: 'Set/2027', quantidade: 44, valor: 44, status: 'Ativo',
  },
  {
    symbol: 'AGRCE23', operacao: 'Agro Cerrado LTDA', instrumento: 'CRA',
    contrato: '0x3C4D5E6F7A8B901234ABCDEF0987654321FEDCBA',
    emissao: 'Jul/2023', vencimento: 'Jul/2025', quantidade: 42, valor: 42, status: 'Encerrado',
  },
];

const TRANSACOES: Transacao[] = [
  { hash: '0x7a3b9c2d', tipo: 'MINT',     descricao: 'Emissão BIOMT25',                   valor: '44.000.000 BIOMT25',  bloco: 65481923, data: '10/03/2025' },
  { hash: '0x6a7b8c9d', tipo: 'DEPLOY',   descricao: 'Deploy contrato BIOMT25',            valor: '—',                  bloco: 65481910, data: '10/03/2025' },
  { hash: '0x2c4d5e6f', tipo: 'MINT',     descricao: 'Emissão PAFIDC25',                  valor: '120.000.000 PAFIDC25', bloco: 63108445, data: '15/01/2025' },
  { hash: '0x8b9a0c1d', tipo: 'BURN',     descricao: 'Liquidação SOLNSP — amort. final',   valor: '18.000.000 SOLNSP',  bloco: 59240178, data: '10/12/2024' },
  { hash: '0x4e5f7a8b', tipo: 'TRANSFER', descricao: 'Amort. parcial SOLNSP → custodiante', valor: '9.000.000 SOLNSP',  bloco: 50314290, data: '10/12/2024' },
  { hash: '0x1d2c3b4a', tipo: 'MINT',     descricao: 'Emissão ENRSP24',                   valor: '88.000.000 ENRSP24', bloco: 45902341, data: '15/05/2024' },
];

const CONTRATOS: Contrato[] = [
  { nome: 'Portfólio Agro FIDC',  symbol: 'PAFIDC25', endereco: '0x9A8B7C6D5E4F3021B2C3D4E5F6A7B8C9D0E1F203', padrao: 'ERC-20', deployData: '10/01/2025', status: 'Ativo',    txns: 284  },
  { nome: 'Energia Renovável SP', symbol: 'ENRSP24',  endereco: '0x2B3C4D5E6F708192A3B4C5D6E7F8091023456789', padrao: 'ERC-20', deployData: '10/05/2024', status: 'Ativo',    txns: 1089 },
  { nome: 'Logística RJ S.A.',    symbol: 'LOGRJ22',  endereco: '0x1A2B3C4D5E6F789012A3B4C5D6E7F80910ABCDEF', padrao: 'ERC-20', deployData: '15/04/2022', status: 'Ativo',    txns: 3247 },
  { nome: 'Bioenergia MT',        symbol: 'BIOMT25',  endereco: '0x5F6E7D8C9B0A1234567890ABCDEF01234567890A', padrao: 'ERC-20', deployData: '10/03/2025', status: 'Ativo',    txns: 48   },
  { nome: 'Agro Cerrado LTDA',    symbol: 'AGRCE23',  endereco: '0x3C4D5E6F7A8B901234ABCDEF0987654321FEDCBA', padrao: 'ERC-20', deployData: '01/07/2023', status: 'Encerrado', txns: 892  },
];

// ─── STYLE MAPS ───────────────────────────────────────────────────────────────

const TX_STYLE: Record<TxType, { label: string; icon: string; color: string; bg: string }> = {
  MINT:     { label: 'Emissão',  icon: 'fa-plus-circle',  color: '#059669', bg: '#f0fdf4' },
  BURN:     { label: 'Queima',   icon: 'fa-fire',         color: '#dc2626', bg: '#fef2f2' },
  TRANSFER: { label: 'Transfer', icon: 'fa-arrow-right',  color: '#1a6edb', bg: '#eff6ff' },
  DEPLOY:   { label: 'Deploy',   icon: 'fa-code',         color: '#7c3aed', bg: '#f5f3ff' },
};

const INST_STYLE: Record<Instrumento, string> = {
  CRI:       'bg-[#0b1f3a] text-white',
  CRA:       'bg-[#dcfce7] text-[#15803d]',
  Debênture: 'bg-[#dbeafe] text-[#1a6edb]',
  FIDC:      'bg-[#fef3c7] text-[#d97706]',
  CCB:       'bg-[#f1f5f9] text-[#64748b]',
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function WalletPage() {
  const [copiado, setCopiado] = useState<string | null>(null);

  function copiar(texto: string, chave: string) {
    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(chave);
      setTimeout(() => setCopiado(null), 1800);
    }).catch(() => {});
  }

  const ativos = TOKENS.filter(t => t.status === 'Ativo');
  const volumeAtivo = ativos.reduce((s, t) => s + t.valor, 0);
  const contratosAtivos = CONTRATOS.filter(c => c.status === 'Ativo').length;

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <PageHeader
        breadcrumb="Gestão"
        title="Wallet & Blockchain"
        subtitle="Gestão de ativos tokenizados e contratos inteligentes on-chain."
        action={
          <div className="flex gap-2.5">
            <Button variant="secondary" size="sm" icon={<i className="fas fa-plus"></i>}>
              Tokenizar Operação
            </Button>
            <Button variant="outline" size="sm" icon={<i className="fas fa-external-link-alt"></i>}>
              Polygonscan
            </Button>
          </div>
        }
      />

      {/* WALLET HERO CARD */}
      <div className="relative rounded-2xl overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #0b1f3a 0%, #0f2d5a 50%, #1a3a6e 100%)' }}>
        {/* subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, #fff 39px, #fff 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #fff 39px, #fff 40px)' }}>
        </div>

        <div className="relative p-7">
          <div className="flex items-start justify-between gap-6 max-md:flex-col">
            {/* Left: address + network */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80] animate-pulse"></span>
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#7dd3fc]">
                  Carteira Conectada
                </span>
                <span className="ml-2 text-[10px] bg-[#8247e5] text-white px-2 py-0.5 rounded-full font-semibold tracking-wide">
                  Polygon
                </span>
                <span className="text-[10px] text-[#94a3b8]">Mainnet · Chain 137</span>
              </div>

              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-[18px] font-semibold text-white tracking-tight">
                  {trunc(WALLET_ADDRESS, 10, 8)}
                </span>
                <button
                  onClick={() => copiar(WALLET_ADDRESS, 'wallet')}
                  className="flex items-center gap-1.5 text-[11px] text-[#7dd3fc] hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg"
                >
                  <i className={`fas ${copiado === 'wallet' ? 'fa-check' : 'fa-copy'} text-[10px]`}></i>
                  {copiado === 'wallet' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="text-[11px] font-mono text-[#475569]">{WALLET_ADDRESS}</div>
            </div>

            {/* Right: MATIC balance */}
            <div className="text-right flex-shrink-0">
              <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#7dd3fc] mb-1.5">
                Saldo
              </div>
              <div className="font-['Playfair_Display'] text-[32px] font-semibold text-white leading-none">
                142.30
                <span className="text-[16px] ml-1.5 font-normal text-[#94a3b8]">MATIC</span>
              </div>
              <div className="text-[12px] text-[#94a3b8] mt-1.5">≈ R$ 424,00</div>
            </div>
          </div>

          {/* Bottom stats row */}
          <div className="mt-7 pt-5 border-t border-white/10 grid grid-cols-3 gap-px bg-white/10 rounded-xl overflow-hidden">
            {[
              { label: 'Operações Tokenizadas', value: `${TOKENS.length}`, sub: `${ativos.length} ativas` },
              { label: 'Volume Ativo (tokens)',  value: `R$ ${volumeAtivo} MM`, sub: 'em circulação' },
              { label: 'Última Transação',       value: '10/03/2025',      sub: 'MINT · BIOMT25' },
            ].map(s => (
              <div key={s.label} className="bg-[#0b1f3a]/60 px-5 py-4 text-center">
                <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#64748b] mb-1">{s.label}</div>
                <div className="text-[15px] font-semibold text-white">{s.value}</div>
                <div className="text-[11px] text-[#475569] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-5 mb-8 max-lg:grid-cols-2">
        <KPICard
          label="Tokens em Circulação"
          value={`${(volumeAtivo * 1_000_000).toLocaleString('pt-BR')}`}
          subtitle="unidades ERC-20 ativas"
          icon={<i className="fas fa-coins"></i>}
        />
        <KPICard
          label="Volume Tokenizado"
          value={`R$ ${TOKENS.reduce((s, t) => s + t.valor, 0)} MM`}
          trend="up"
          trendValue="+44 MM"
          subtitle="vs. trimestre anterior"
          icon={<i className="fas fa-layer-group"></i>}
        />
        <KPICard
          label="Contratos Ativos"
          value={`${contratosAtivos} / ${CONTRATOS.length}`}
          subtitle={`${CONTRATOS.reduce((s, c) => s + c.txns, 0).toLocaleString('pt-BR')} transações totais`}
          icon={<i className="fas fa-file-code"></i>}
        />
        <KPICard
          label="Próx. Amortização"
          value="15/mai/2025"
          subtitle="ENRSP24 · R$ 6,1 MM"
          icon={<i className="fas fa-calendar-check"></i>}
        />
      </div>

      {/* DREX InfoBox */}
      <div className="mb-8">
        <InfoBox
          variant="info"
          icon={<i className="fas fa-shield-alt"></i>}
          title="Conformidade Regulatória & Projeto DREX"
        >
          A tokenização das operações está em conformidade com o <strong>Sandbox Regulatório do Banco Central</strong> (LIFT Challenge / Projeto DREX).
          Todos os contratos seguem o padrão <strong>ERC-20</strong> na rede Polygon com bridge planejada para <strong>Hyperledger Besu</strong> na fase 2.
          Custódia digital vinculada à BLOXS DTVM Ltda. (Resolução BCB nº 97/2021).
        </InfoBox>
      </div>

      {/* TOKEN PORTFOLIO */}
      <Card padding="none" className="mb-8">
        <CardHeader icon={<i className="fas fa-wallet"></i>}>
          Portfólio de Tokens
          <span className="ml-auto text-[11px] font-normal text-[#94a3b8]">{TOKENS.length} ativos</span>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                {['Token', 'Operação', 'Instrumento', 'Contrato', 'Emissão / Vto.', 'Qtd. Tokens', 'Valor', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-[10.5px] font-bold tracking-[0.08em] uppercase text-[#94a3b8] px-5 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOKENS.map((t, i) => (
                <tr key={t.symbol} className={`border-b border-[#f1f5f9] ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'} hover:bg-[#f8fafc] transition-colors`}>
                  <td className="px-5 py-3.5">
                    <div className="font-mono text-[13px] font-bold text-[#0b1f3a]">{t.symbol}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-[13px] font-medium text-[#0b1f3a] max-w-[160px] truncate">{t.operacao}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${INST_STYLE[t.instrumento]}`}>
                      {t.instrumento}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#64748b]">{trunc(t.contrato)}</span>
                      <button
                        onClick={() => copiar(t.contrato, t.symbol)}
                        className="text-[#94a3b8] hover:text-[#1a6edb] transition-colors"
                        title="Copiar endereço"
                      >
                        <i className={`fas ${copiado === t.symbol ? 'fa-check text-[#059669]' : 'fa-copy'} text-[10px]`}></i>
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-[12px] text-[#475569]">{t.emissao}</div>
                    <div className="text-[11px] text-[#94a3b8]">vto. {t.vencimento}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] font-semibold text-[#0b1f3a]">
                      {(t.quantidade * 1_000_000).toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-semibold text-[#0b1f3a]">R$ {t.valor} MM</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={t.status === 'Ativo' ? 'success' : 'gray'} size="sm">
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="text-[11px] text-[#1a6edb] hover:underline flex items-center gap-1">
                      Explorar <i className="fas fa-external-link-alt text-[9px]"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#e2e8f0] bg-[#f8fafc]">
                <td colSpan={6} className="px-5 py-3 text-[11px] font-bold tracking-wide uppercase text-[#94a3b8]">
                  Total ({ativos.length} ativos)
                </td>
                <td className="px-5 py-3 text-[13px] font-bold text-[#0b1f3a]">
                  R$ {volumeAtivo} MM
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* TRANSACTIONS + CONTRACTS */}
      <div className="grid grid-cols-12 gap-5">

        {/* Transações Recentes */}
        <Card className="col-span-7 max-lg:col-span-12" padding="none">
          <CardHeader icon={<i className="fas fa-exchange-alt"></i>}>
            Transações Recentes
            <span className="ml-auto text-[11px] font-normal text-[#94a3b8]">últimas 6</span>
          </CardHeader>
          <CardBody padding="sm">
            <div className="space-y-1">
              {TRANSACOES.map(tx => {
                const s = TX_STYLE[tx.tipo];
                return (
                  <div key={tx.hash} className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#f8fafc] transition-colors group">
                    {/* Type icon */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: s.bg }}>
                      <i className={`fas ${s.icon} text-[13px]`} style={{ color: s.color }}></i>
                    </div>

                    {/* Description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-bold px-1.5 py-0.5 rounded text-[10px]"
                          style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                        <span className="text-[13px] font-medium text-[#0b1f3a] truncate">{tx.descricao}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#94a3b8]">
                        <span className="font-mono">{tx.hash}</span>
                        <span>Bloco #{tx.bloco.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>

                    {/* Value + date */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-[12px] font-semibold text-[#0b1f3a]">{tx.valor}</div>
                      <div className="text-[11px] text-[#94a3b8]">{tx.data}</div>
                    </div>

                    {/* Explorer link */}
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[#94a3b8] hover:text-[#1a6edb] ml-1">
                      <i className="fas fa-external-link-alt text-[11px]"></i>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 pt-3 border-t border-[#f1f5f9] text-center">
              <button className="text-[12px] text-[#1a6edb] font-semibold hover:underline">
                Ver todas as transações <i className="fas fa-chevron-right text-[10px] ml-1"></i>
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Smart Contracts */}
        <Card className="col-span-5 max-lg:col-span-12" padding="none">
          <CardHeader icon={<i className="fas fa-file-code"></i>}>
            Smart Contracts
          </CardHeader>
          <CardBody padding="sm">
            <div className="space-y-2">
              {CONTRATOS.map(c => (
                <div key={c.symbol}
                  className="border border-[#e2e8f0] rounded-xl px-4 py-3.5 hover:border-[#1a6edb]/30 hover:bg-[#f8faff] transition-all group">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[12px] font-bold text-[#0b1f3a]">{c.symbol}</span>
                        <span className="text-[10px] bg-[#8247e5]/10 text-[#8247e5] px-1.5 py-0.5 rounded font-semibold">{c.padrao}</span>
                      </div>
                      <div className="text-[11px] text-[#64748b] truncate">{c.nome}</div>
                    </div>
                    <Badge variant={c.status === 'Ativo' ? 'success' : 'gray'} size="sm">
                      {c.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10.5px] text-[#94a3b8] flex-1 truncate">{trunc(c.endereco, 10, 6)}</span>
                    <button
                      onClick={() => copiar(c.endereco, `c-${c.symbol}`)}
                      className="text-[#94a3b8] hover:text-[#1a6edb] transition-colors"
                    >
                      <i className={`fas ${copiado === `c-${c.symbol}` ? 'fa-check text-[#059669]' : 'fa-copy'} text-[10px]`}></i>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f1f5f9]">
                    <span className="text-[10px] text-[#94a3b8]">
                      Deploy: {c.deployData}
                    </span>
                    <span className="text-[10px] font-semibold text-[#475569]">
                      {c.txns.toLocaleString('pt-BR')} txns
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
