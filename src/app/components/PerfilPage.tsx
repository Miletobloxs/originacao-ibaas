import { useState } from 'react';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button, InfoBox } from './ds';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Responsavel {
  nome: string;
  cargo: string;
  email: string;
  iniciais: string;
  cor: string;
}

interface DocStatus {
  label: string;
  validade: string;
  ok: boolean;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const RESPONSAVEIS: Responsavel[] = [
  { nome: 'Rafael Andrade',  cargo: 'CEO & Originador',      email: 'r.andrade@bloxscapital.com.br',  iniciais: 'RA', cor: '#0b1f3a' },
  { nome: 'Ana Ribeiro',     cargo: 'Head of Compliance',    email: 'a.ribeiro@bloxscapital.com.br',   iniciais: 'AR', cor: '#1a6edb' },
  { nome: 'Pedro Costa',     cargo: 'Operations Manager',    email: 'p.costa@bloxscapital.com.br',     iniciais: 'PC', cor: '#059669' },
];

const DOCS_STATUS: DocStatus[] = [
  { label: 'Contrato de Originação Bloxs',  validade: 'Dez/2026', ok: true  },
  { label: 'Certificado ANCORD Ativo',       validade: 'Nov/2026', ok: true  },
  { label: 'Compliance KYC / PLD-FT',        validade: 'Jun/2025', ok: true  },
  { label: 'Declaração de Suitability',      validade: 'Jun/2025', ok: true  },
  { label: 'Seguro D&O Vigente',             validade: 'Mar/2026', ok: true  },
  { label: 'Renovação Regulatória CVM',      validade: 'A definir', ok: false },
];

const API_KEY = 'sk-blx-live-4f8a2c91b0d3e7f5a8b3c4d9e0f1a2b84c7d9e2f3';

const TIER_VOLUME = 563;
const TIER_NEXT   = 600;
const TIER_LABEL  = 'Gold';
const TIER_NEXT_LABEL = 'Platinum';

// ─── TOGGLE ITEM ──────────────────────────────────────────────────────────────

function ToggleRow({
  icon, label, desc, enabled, onChange,
}: { icon: string; label: string; desc: string; enabled: boolean; onChange: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3.5 border-b border-[#f1f5f9] last:border-0">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#eef5ff] flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className={`fas ${icon} text-[12px] text-[#1a6edb]`}></i>
        </div>
        <div>
          <div className="text-[13px] font-semibold text-[#0b1f3a]">{label}</div>
          <div className="text-[11px] text-[#94a3b8] mt-0.5">{desc}</div>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 mt-1 ${enabled ? 'bg-[#1a6edb]' : 'bg-[#e2e8f0]'}`}
        style={{ width: '40px', height: '22px' }}
        aria-checked={enabled}
        role="switch"
      >
        <span
          className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
          style={{ left: enabled ? '20px' : '3px' }}
        />
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function PerfilPage() {
  const [apiVisible,   setApiVisible]   = useState(false);
  const [copiado,      setCopiado]      = useState(false);
  const [settings, setSettings] = useState({
    email2fa:     true,
    notifEmail:   true,
    relSemanal:   true,
    alertaVcto:   true,
    modoEscuro:   false,
    loginBiometria: false,
  });

  function toggle(key: keyof typeof settings) {
    setSettings(s => ({ ...s, [key]: !s[key] }));
  }

  function copiarKey() {
    navigator.clipboard.writeText(API_KEY).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    }).catch(() => {});
  }

  const tierPct = Math.min((TIER_VOLUME / TIER_NEXT) * 100, 100);

  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      <PageHeader
        breadcrumb="Gestão"
        title="Meu Perfil"
        subtitle="Dados cadastrais, credenciamento e configurações da conta."
        action={
          <Button variant="secondary" size="sm" icon={<i className="fas fa-pen"></i>}>
            Editar Perfil
          </Button>
        }
      />

      {/* ── HERO CARD ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden border border-[#e2e8f0] bg-white mb-8 shadow-sm">
        {/* Banner */}
        <div className="h-[100px] relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0b1f3a 0%, #1a3a6e 60%, #1a6edb 100%)' }}>
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 24px, #fff 24px, #fff 25px)' }}>
          </div>
        </div>

        <div className="px-8 pb-7">
          <div className="flex items-end justify-between gap-6 -mt-10 mb-5">
            {/* Avatar */}
            <div className="w-[80px] h-[80px] rounded-2xl bg-[#0b1f3a] text-white flex items-center justify-center text-[26px] font-['Playfair_Display'] font-semibold border-4 border-white shadow-lg flex-shrink-0">
              RA
            </div>
            <div className="flex gap-2.5 mb-1">
              <Button variant="outline" size="sm" icon={<i className="fas fa-file-download"></i>}>
                Exportar Dados
              </Button>
              <Button variant="primary" size="sm" icon={<i className="fas fa-pen"></i>}>
                Editar Perfil
              </Button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-6 max-md:flex-col">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1.5">
                <h2 className="font-['Playfair_Display'] text-[24px] font-semibold text-[#0b1f3a]">
                  Rafael Andrade
                </h2>
                <Badge variant="success" size="md">
                  <i className="fas fa-check-circle mr-1"></i>Credenciado
                </Badge>
                <Badge variant="secondary" size="sm">Originador IBaaS</Badge>
              </div>
              <div className="text-[13px] text-[#64748b]">
                Bloxs Capital Partners LTDA &nbsp;·&nbsp; CNPJ 42.345.678/0001-90
              </div>
              <div className="flex items-center gap-4 mt-2 text-[12px] text-[#94a3b8]">
                <span><i className="fas fa-map-marker-alt mr-1.5"></i>São Paulo, SP</span>
                <span><i className="fas fa-calendar-alt mr-1.5"></i>Membro desde Jan/2022</span>
                <span><i className="fas fa-id-card mr-1.5"></i>ANCORD nº 4.521</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 text-center flex-shrink-0 max-sm:hidden">
              {[
                { label: 'Operações',        value: '12'       },
                { label: 'Volume Originado', value: 'R$ 563 MM' },
                { label: 'Comissões',        value: 'R$ 2,46 MM' },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-['Playfair_Display'] text-[20px] font-semibold text-[#0b1f3a] leading-tight">{s.value}</div>
                  <div className="text-[10px] font-semibold tracking-wide uppercase text-[#94a3b8] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3-COLUMN GRID ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-2 max-lg:grid-cols-1">

        {/* ── COL 1 ─────────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Dados da Empresa */}
          <Card padding="none">
            <CardHeader icon={<i className="fas fa-building"></i>}>Dados da Empresa</CardHeader>
            <CardBody padding="md">
              <dl className="space-y-3.5">
                {[
                  { label: 'Razão Social',   value: 'Bloxs Capital Partners LTDA' },
                  { label: 'CNPJ',           value: '42.345.678/0001-90' },
                  { label: 'Endereço',       value: 'Av. Brig. Faria Lima, 3.477 — Itaim Bibi, SP' },
                  { label: 'Telefone',       value: '+55 (11) 98765-4321' },
                  { label: 'Website',        value: 'bloxscapital.com.br' },
                  { label: 'Segmento',       value: 'Gestão de Recursos / Mercado de Capitais' },
                  { label: 'Registro CVM',   value: 'Agente Autônomo nº 4.521 (ANCORD)' },
                ].map(row => (
                  <div key={row.label} className="flex gap-3">
                    <dt className="text-[11px] font-semibold tracking-wide uppercase text-[#94a3b8] w-[100px] flex-shrink-0 mt-0.5">
                      {row.label}
                    </dt>
                    <dd className="text-[13px] text-[#0b1f3a] flex-1">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </CardBody>
          </Card>

          {/* Equipe */}
          <Card padding="none">
            <CardHeader icon={<i className="fas fa-users"></i>}>
              Equipe
              <span className="ml-auto">
                <button className="text-[11px] text-[#1a6edb] font-semibold hover:underline">
                  + Convidar
                </button>
              </span>
            </CardHeader>
            <CardBody padding="sm">
              <div className="space-y-1">
                {RESPONSAVEIS.map(r => (
                  <div key={r.nome} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#f8fafc] transition-colors">
                    <div
                      className="w-9 h-9 rounded-xl text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                      style={{ background: r.cor }}
                    >
                      {r.iniciais}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[#0b1f3a] truncate">{r.nome}</div>
                      <div className="text-[11px] text-[#94a3b8] truncate">{r.cargo}</div>
                    </div>
                    <a
                      href={`mailto:${r.email}`}
                      className="text-[#94a3b8] hover:text-[#1a6edb] transition-colors flex-shrink-0"
                      title={r.email}
                    >
                      <i className="fas fa-envelope text-[12px]"></i>
                    </a>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── COL 2 ─────────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Performance */}
          <Card padding="none">
            <CardHeader icon={<i className="fas fa-chart-line"></i>}>
              Performance na Plataforma
            </CardHeader>
            <CardBody padding="md">
              {/* Stats grid 2×2 */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Operações',      value: '12',          sub: '4 em andamento'  },
                  { label: 'Volume Total',   value: 'R$ 563 MM',   sub: 'desde Jan/2022'  },
                  { label: 'Comissões',      value: 'R$ 2,46 MM',  sub: 'acumuladas'       },
                  { label: 'Taxa Média',     value: 'CDI + 3,6%',  sub: 'spread histórico' },
                ].map(s => (
                  <div key={s.label} className="bg-[#f8fafc] rounded-xl p-3.5">
                    <div className="text-[10px] font-semibold tracking-wide uppercase text-[#94a3b8] mb-1">{s.label}</div>
                    <div className="font-['Playfair_Display'] text-[17px] font-semibold text-[#0b1f3a] leading-tight">{s.value}</div>
                    <div className="text-[10px] text-[#94a3b8] mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Tier progress */}
              <div className="bg-gradient-to-br from-[#fef3c7] to-[#fffbeb] border border-[#fde68a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-star text-[#d97706] text-[13px]"></i>
                    <span className="text-[12px] font-bold text-[#92400e]">Tier {TIER_LABEL}</span>
                  </div>
                  <span className="text-[11px] text-[#92400e] font-semibold">
                    R$ {TIER_VOLUME} / {TIER_NEXT} MM → {TIER_NEXT_LABEL}
                  </span>
                </div>
                <div className="h-2 bg-[#fde68a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] transition-all"
                    style={{ width: `${tierPct}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#92400e] mt-1.5">
                  Faltam R$ {TIER_NEXT - TIER_VOLUME} MM para alcançar o tier {TIER_NEXT_LABEL}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Credenciamento */}
          <Card padding="none">
            <CardHeader icon={<i className="fas fa-shield-alt"></i>}>
              Credenciamento & Compliance
              <span className="ml-auto">
                <Badge variant="success" size="sm">
                  <i className="fas fa-check-circle mr-1"></i>Aprovado
                </Badge>
              </span>
            </CardHeader>
            <CardBody padding="md">
              <div className="space-y-2.5 mb-4">
                {DOCS_STATUS.map(d => (
                  <div key={d.label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${d.ok ? 'bg-[#f0fdf4]' : 'bg-[#fef2f2]'}`}>
                      <i className={`fas ${d.ok ? 'fa-check text-[#059669]' : 'fa-clock text-[#dc2626]'} text-[9px]`}></i>
                    </div>
                    <div className="flex-1 text-[12.5px] text-[#0b1f3a]">{d.label}</div>
                    <div className={`text-[11px] font-semibold ${d.ok ? 'text-[#64748b]' : 'text-[#dc2626]'}`}>
                      {d.validade}
                    </div>
                  </div>
                ))}
              </div>

              <InfoBox variant="info" icon={<i className="fas fa-info-circle"></i>}>
                <span className="text-[12px]">
                  Próxima auditoria interna Bloxs em <strong>Jun/2025</strong>.
                  Mantenha os documentos atualizados para evitar restrições operacionais.
                </span>
              </InfoBox>
            </CardBody>
          </Card>
        </div>

        {/* ── COL 3 ─────────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Preferências & Segurança */}
          <Card padding="none">
            <CardHeader icon={<i className="fas fa-cog"></i>}>
              Preferências & Segurança
            </CardHeader>
            <CardBody padding="md">
              <ToggleRow
                icon="fa-lock"
                label="Autenticação 2 fatores"
                desc="OTP via aplicativo autenticador"
                enabled={settings.email2fa}
                onChange={() => toggle('email2fa')}
              />
              <ToggleRow
                icon="fa-bell"
                label="Notificações por e-mail"
                desc="Alertas de operações e vencimentos"
                enabled={settings.notifEmail}
                onChange={() => toggle('notifEmail')}
              />
              <ToggleRow
                icon="fa-file-alt"
                label="Relatório semanal automático"
                desc="Enviado toda segunda-feira às 08h"
                enabled={settings.relSemanal}
                onChange={() => toggle('relSemanal')}
              />
              <ToggleRow
                icon="fa-calendar-times"
                label="Alertas de vencimento (30 dias)"
                desc="Notifica amortizações e renovações"
                enabled={settings.alertaVcto}
                onChange={() => toggle('alertaVcto')}
              />
              <ToggleRow
                icon="fa-fingerprint"
                label="Login biométrico (mobile)"
                desc="Desbloqueio por Face ID / Touch ID"
                enabled={settings.loginBiometria}
                onChange={() => toggle('loginBiometria')}
              />

              {/* Last login */}
              <div className="mt-4 pt-4 border-t border-[#f1f5f9]">
                <div className="text-[10px] font-bold tracking-wider uppercase text-[#94a3b8] mb-2.5">
                  Sessões Recentes
                </div>
                {[
                  { device: 'MacBook Pro — Chrome 124', local: 'São Paulo, SP', data: 'Agora' },
                  { device: 'iPhone 15 — Safari Mobile', local: 'São Paulo, SP', data: '10/03/2025' },
                ].map(s => (
                  <div key={s.data} className="flex items-center justify-between py-2 text-[12px]">
                    <div>
                      <div className="font-medium text-[#0b1f3a]">{s.device}</div>
                      <div className="text-[11px] text-[#94a3b8]">{s.local}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${s.data === 'Agora' ? 'text-[#059669]' : 'text-[#64748b]'}`}>
                        {s.data}
                      </div>
                      {s.data !== 'Agora' && (
                        <button className="text-[10px] text-[#dc2626] hover:underline mt-0.5">Encerrar</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* API Access */}
          <Card padding="none">
            <CardHeader icon={<i className="fas fa-code"></i>}>
              Acesso via API
              <span className="ml-auto">
                <Badge variant="success" size="sm">Ativo</Badge>
              </span>
            </CardHeader>
            <CardBody padding="md">
              {/* API Key */}
              <div className="mb-4">
                <div className="text-[10px] font-bold tracking-wider uppercase text-[#94a3b8] mb-2">
                  Chave de API (Live)
                </div>
                <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3.5 py-2.5">
                  <i className="fas fa-key text-[11px] text-[#94a3b8]"></i>
                  <code className="flex-1 text-[11px] text-[#0b1f3a] truncate font-mono">
                    {apiVisible ? API_KEY : `sk-blx-live-${'•'.repeat(32)}`}
                  </code>
                  <button
                    onClick={() => setApiVisible(v => !v)}
                    className="text-[#94a3b8] hover:text-[#1a6edb] transition-colors ml-1"
                    title={apiVisible ? 'Ocultar' : 'Revelar'}
                  >
                    <i className={`fas ${apiVisible ? 'fa-eye-slash' : 'fa-eye'} text-[12px]`}></i>
                  </button>
                  <button
                    onClick={copiarKey}
                    className="text-[#94a3b8] hover:text-[#1a6edb] transition-colors"
                    title="Copiar chave"
                  >
                    <i className={`fas ${copiado ? 'fa-check text-[#059669]' : 'fa-copy'} text-[12px]`}></i>
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <div className="text-[10px] font-bold tracking-wider uppercase text-[#94a3b8] mb-2">
                  Permissões
                </div>
                <div className="flex flex-wrap gap-2">
                  {['read:operations', 'write:originations', 'read:reports', 'read:documents'].map(p => (
                    <span key={p} className="text-[10px] font-mono bg-[#eef5ff] text-[#1a6edb] px-2 py-1 rounded-lg font-semibold">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-[12px] mb-4">
                <div>
                  <div className="text-[10px] uppercase font-semibold tracking-wide text-[#94a3b8] mb-1">Último Acesso</div>
                  <div className="font-semibold text-[#0b1f3a]">10/03/2025</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold tracking-wide text-[#94a3b8] mb-1">Req. Mensais</div>
                  <div className="font-semibold text-[#0b1f3a]">2.847 / 10.000</div>
                </div>
              </div>

              {/* Usage bar */}
              <div className="mb-5">
                <div className="flex justify-between text-[10px] text-[#94a3b8] mb-1">
                  <span>Uso do limite mensal</span>
                  <span className="font-semibold">28,5%</span>
                </div>
                <div className="h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div className="h-full w-[28.5%] bg-[#1a6edb] rounded-full"></div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                icon={<i className="fas fa-sync-alt"></i>}
              >
                Regenerar Chave de API
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
