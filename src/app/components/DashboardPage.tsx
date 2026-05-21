import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, TooltipProps
} from 'recharts';
import DealFlowPage, { INITIAL_DEALS } from './DealFlowPage';
import type { Deal } from './DealFlowPage';
import MercadoPage from './MercadoPage';
import EducacionalPage from './EducacionalPage';
import ComissoesPage from './ComissoesPage';
import FinanceiroPage from './FinanceiroPage';
import DocumentosPage from './DocumentosPage';
import HistoricoPage from './HistoricoPage';
import WalletPage from './WalletPage';
import PerfilPage from './PerfilPage';
import OriginacaoWizard from './OriginacaoWizard';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type PageId = 'dashboard' | 'originar' | 'dealflow' | 'mercado' | 'educacional'
  | 'comissoes' | 'financeiro' | 'documentos' | 'historico' | 'wallet' | 'perfil';

// ─── DASHBOARD DATA ───────────────────────────────────────────────────────────

const VOLUME_SETOR = [
  { setor: 'Agronegócio',      volume: 248, color: '#22c55e' },
  { setor: 'Energia Renovável', volume: 150, color: '#1a6edb' },
  { setor: 'Logística',        volume: 65,  color: '#f59e0b' },
  { setor: 'Imobiliário',      volume: 50,  color: '#0b1f3a' },
  { setor: 'Tecnologia',       volume: 35,  color: '#7c3aed' },
  { setor: 'Financeiro',       volume: 15,  color: '#94a3b8' },
];

const RECENT_OPS = [
  { name: 'Data Center MG',  instrumento: 'FIDC',      value: 'R$ 110 MM', stage: 'Estruturação', dot: 'bg-[#1a6edb]' },
  { name: 'Agro Mato Grosso', instrumento: 'CRA',      value: 'R$ 75 MM',  stage: 'Comitê',      dot: 'bg-[#d97706]' },
  { name: 'Solar Norte SP',  instrumento: 'Debênture', value: 'R$ 42 MM',  stage: 'Diligência',  dot: 'bg-[#d97706]' },
];

interface Notif {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  desc: string;
  time: string;
  action?: string;
  page?: PageId;
}

const NOTIFS: Notif[] = [
  { type: 'error',   title: 'Inadimplência ativa',   desc: 'Construtora ABC — Acordo extrajudicial em andamento. Recuperação estimada: R$ 14,2MM.', time: 'há 2 dias',   action: 'Ver operação', page: 'historico'  },
  { type: 'warning', title: 'Assinatura pendente',   desc: 'Mandato Solar Norte SP aguarda sua assinatura no módulo Documentos.',                   time: 'há 3 dias',   action: 'Assinar',      page: 'documentos' },
  { type: 'warning', title: 'NF não emitida',        desc: 'Comissão Logística RJ (R$ 325 mil) aguardando emissão de nota fiscal.',                 time: 'há 5 dias',   action: 'Emitir NF',    page: 'financeiro' },
  { type: 'info',    title: 'Amortização processada', desc: 'Data Center MG — 2ª amortização de R$ 2,3MM creditada com sucesso.',                  time: 'há 1 semana'  },
  { type: 'success', title: 'Análise concluída',      desc: 'Agro Mato Grosso aprovado em comitê. Estruturação iniciada pela equipe Bloxs.',        time: 'há 1 semana', action: 'Ver pipeline', page: 'dealflow' },
];

const NOTIF_STYLE = {
  error:   { bg: '#fef2f2', border: '#fecaca', dot: 'bg-[#dc2626]', icon: 'fa-exclamation-circle text-[#dc2626]' },
  warning: { bg: '#fffbeb', border: '#fde68a', dot: 'bg-[#d97706]', icon: 'fa-exclamation-triangle text-[#d97706]' },
  info:    { bg: '#eff6ff', border: '#bfdbfe', dot: 'bg-[#1a6edb]', icon: 'fa-info-circle text-[#1a6edb]' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', dot: 'bg-[#059669]', icon: 'fa-check-circle text-[#059669]' },
};

function TooltipSetor({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-lg px-4 py-3 text-[12px]">
      <div className="font-semibold text-[#0b1f3a] mb-1">{label}</div>
      <div className="text-[#1a6edb] font-semibold">R$ {payload[0].value} MM originados</div>
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const activePage = ((location.pathname.replace('/dashboard', '').replace('/', '') || 'dashboard') as PageId);

  const [showNotifications,  setShowNotifications]  = useState(false);
  const [showUserMenu,       setShowUserMenu]       = useState(false);
  const [showSuporte,        setShowSuporte]        = useState(false);
  const [notifRead,          setNotifRead]          = useState(false);
  const [deals,              setDeals]              = useState<Deal[]>(INITIAL_DEALS);
  const [nfPreSelected,      setNfPreSelected]      = useState<{ operacaoValue: string; valor: number } | null>(null);

  function addDeal(deal: Deal) {
    setDeals(prev => [deal, ...prev]);
  }

  function handleGerarNF(operacaoValue: string, valor: number) {
    setNfPreSelected({ operacaoValue, valor });
    nav('financeiro');
  }

  function nav(page: PageId) {
    navigate(page === 'dashboard' ? '/dashboard' : `/dashboard/${page}`);
    setShowNotifications(false);
    setShowUserMenu(false);
  }

  const unreadCount = notifRead ? 0 : NOTIFS.filter(n => n.type === 'error' || n.type === 'warning').length;

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-['Inter']">

      {/* ── TOPBAR ──────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[200] h-[60px] bg-white border-b border-[#e2e8f0] flex items-center px-6 gap-0">
        <div className="w-[240px] flex items-center gap-2.5 px-6 border-r border-[#e2e8f0] h-full flex-shrink-0">
          <img
            src="https://bloxs.com.br/_next/static/media/logotype-bloxs.24b4579c.svg"
            alt="Bloxs"
            className="h-[26px]"
          />
          <span className="font-['Playfair_Display'] text-[19px] font-semibold text-[#0b1f3a] tracking-tight">
            Bloxs
          </span>
        </div>
        <div className="flex-1 px-6 flex items-center gap-2.5">
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase bg-[#d6e8ff] text-[#1a6edb] py-1 px-3 rounded-full">
            IBaaS · Originador
          </span>
        </div>

        <div className="flex items-center gap-4 ml-auto pr-2">
          {/* Bell */}
          <button
            onClick={() => { setShowNotifications(v => !v); setShowUserMenu(false); }}
            className="relative w-9 h-9 flex items-center justify-center text-[#64748b] hover:text-[#0b1f3a] hover:bg-[#f1f5f9] rounded-lg transition-all"
          >
            <i className="fas fa-bell text-[16px]"></i>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#dc2626] rounded-full border-2 border-white text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="relative z-[600]">
            <button
              onClick={() => { setShowUserMenu(v => !v); setShowNotifications(false); }}
              className="w-9 h-9 rounded-full bg-[#0b1f3a] text-white flex items-center justify-center text-[13px] font-semibold hover:bg-[#1a6edb] transition-colors"
            >
              RA
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-[590]" onClick={() => setShowUserMenu(false)} />
                <div className="absolute top-11 right-0 w-[220px] bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl z-[600] overflow-hidden py-1">
                  {/* User info */}
                  <div className="px-4 py-3.5 border-b border-[#f1f5f9]">
                    <div className="text-[13px] font-semibold text-[#0b1f3a]">Rafael Andrade</div>
                    <div className="text-[11px] text-[#94a3b8]">Originador IBaaS · Gold</div>
                  </div>
                  {/* Menu items */}
                  {[
                    { icon: 'fa-user-circle',   label: 'Meu Perfil',      page: 'perfil'   as PageId },
                    { icon: 'fa-cog',           label: 'Configurações',   page: 'perfil'   as PageId },
                    { icon: 'fa-wallet',        label: 'Wallet',          page: 'wallet'   as PageId },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => nav(item.page)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#475569] hover:bg-[#f8fafc] hover:text-[#0b1f3a] transition-colors"
                    >
                      <i className={`fas ${item.icon} text-[12px] w-4 text-center text-[#94a3b8]`}></i>
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-[#f1f5f9] mt-1 pt-1">
                    <button
                      onClick={() => { setShowUserMenu(false); setShowSuporte(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#475569] hover:bg-[#f8fafc] transition-colors"
                    >
                      <i className="fas fa-headset text-[12px] w-4 text-center text-[#94a3b8]"></i>
                      Suporte
                    </button>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
                    >
                      <i className="fas fa-sign-out-alt text-[12px] w-4 text-center"></i>
                      Sair
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── SUPORTE MODAL ───────────────────────────────────────────────── */}
      {showSuporte && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[700]" onClick={() => setShowSuporte(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-white rounded-2xl shadow-2xl z-[800] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[#0b1f3a]">Central de Suporte</h3>
                <p className="text-[12px] text-[#94a3b8] mt-0.5">Seg–Sex · 9h às 18h (Horário de Brasília)</p>
              </div>
              <button onClick={() => setShowSuporte(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                <div className="w-10 h-10 rounded-full bg-[#0b1f3a] text-white flex items-center justify-center text-[13px] font-semibold flex-shrink-0">MO</div>
                <div>
                  <div className="text-[13px] font-semibold text-[#0b1f3a]">Mariana Oliveira</div>
                  <div className="text-[11px] text-[#94a3b8]">Gestora de conta — IBaaS Originação</div>
                </div>
              </div>
              {[
                { icon: 'fa-whatsapp fab', label: 'WhatsApp', value: '+55 (11) 99876-5432', color: '#25D366' },
                { icon: 'fa-envelope',     label: 'E-mail',   value: 'originadores@bloxs.com.br', color: '#1a6edb' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3 px-4 py-3 border border-[#e2e8f0] rounded-xl hover:border-[#1a6edb]/30 hover:bg-[#f8faff] transition-all">
                  <i className={`${c.icon} text-[15px]`} style={{ color: c.color }}></i>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-[#94a3b8]">{c.label}</div>
                    <div className="text-[13px] font-semibold text-[#0b1f3a]">{c.value}</div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowSuporte(false)}
                className="w-full py-3 bg-[#0b1f3a] text-white rounded-xl text-[13px] font-semibold hover:bg-[#1a6edb] transition-all"
              >
                Abrir Chamado de Suporte
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── NOTIFICAÇÕES DRAWER ─────────────────────────────────────────── */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 bg-black/20 z-[300]" onClick={() => setShowNotifications(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-[420px] bg-white z-[400] shadow-[-6px_0_40px_rgba(0,0,0,0.10)] flex flex-col">
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-[#e2e8f0] flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-[16px] font-semibold text-[#0b1f3a]">Notificações</h2>
                {unreadCount > 0 && !notifRead && (
                  <p className="text-[11.5px] text-[#94a3b8] mt-0.5">{unreadCount} não lidas</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {!notifRead && (
                  <button onClick={() => setNotifRead(true)} className="text-[11px] text-[#1a6edb] font-semibold hover:underline">
                    Marcar todas como lidas
                  </button>
                )}
                <button onClick={() => setShowNotifications(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#0b1f3a] transition-all">
                  <i className="fas fa-times text-[14px]"></i>
                </button>
              </div>
            </div>

            {/* Notif list */}
            <div className="flex-1 overflow-y-auto">
              {NOTIFS.map((n, i) => {
                const s = NOTIF_STYLE[n.type];
                const isUnread = !notifRead && (n.type === 'error' || n.type === 'warning');
                return (
                  <div
                    key={i}
                    className="px-6 py-4 border-b border-[#f1f5f9] hover:bg-[#fafbfc] transition-colors"
                    style={{ backgroundColor: isUnread ? s.bg : undefined }}
                  >
                    <div className="flex gap-3.5">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: s.bg, border: `1.5px solid ${s.border}` }}
                      >
                        <i className={`fas ${s.icon} text-[13px]`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <div className="text-[13px] font-semibold text-[#0b1f3a] leading-snug">{n.title}</div>
                          {isUnread && <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${s.dot}`}></span>}
                        </div>
                        <div className="text-[12px] text-[#64748b] leading-relaxed mb-2">{n.desc}</div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10.5px] text-[#94a3b8]">{n.time}</span>
                          {n.action && n.page && (
                            <button
                              onClick={() => nav(n.page!)}
                              className="text-[11.5px] text-[#1a6edb] font-semibold hover:underline"
                            >
                              {n.action} →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#e2e8f0] flex-shrink-0 bg-[#fafbfc]">
              <p className="text-[11.5px] text-[#94a3b8] text-center">
                Mostrando {NOTIFS.length} notificações · <button className="text-[#1a6edb] font-semibold hover:underline" onClick={() => setShowNotifications(false)}>Fechar</button>
              </p>
            </div>
          </div>
        </>
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-[60px] left-0 bottom-0 w-[240px] bg-white border-r border-[#e2e8f0] overflow-y-auto z-[100] py-5 max-md:hidden">
        <div className="mb-1.5">
          <div className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-[#94a3b8] px-5 py-3 mb-1.5">
            Principal
          </div>
          {[
            { id: 'dashboard', icon: 'chart-line',  label: 'Dashboard' },
            { id: 'originar',  icon: 'plus-circle', label: 'Originar Operação' },
            { id: 'dealflow',  icon: 'stream',      label: 'Deal Flow', badge: '3' }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => nav(item.id as PageId)}
              className={`flex items-center gap-3 py-2.5 px-5 cursor-pointer text-[13px] font-medium transition-all border-l-[3px] ${
                activePage === item.id
                  ? 'bg-[#eef5ff] text-[#1a6edb] border-l-[#1a6edb] font-semibold'
                  : 'text-[#64748b] border-l-transparent hover:bg-[#fafafa] hover:text-[#0b1f3a]'
              }`}
            >
              <i className={`fas fa-${item.icon} w-4.5 text-center text-[13px]`}></i>
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-[#1a6edb] text-white text-[10px] font-bold py-0.5 px-1.75 rounded-[10px]">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mb-1.5">
          <div className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-[#94a3b8] px-5 py-3 mb-1.5">
            Inteligência
          </div>
          {[
            { id: 'mercado',     icon: 'newspaper',   label: 'Resumo de Mercado' },
            { id: 'educacional', icon: 'play-circle', label: 'Educacional' }
          ].map((item) => (
            <div key={item.id} onClick={() => nav(item.id as PageId)}
              className={`flex items-center gap-3 py-2.5 px-5 cursor-pointer text-[13px] font-medium transition-all border-l-[3px] ${
                activePage === item.id ? 'bg-[#eef5ff] text-[#1a6edb] border-l-[#1a6edb] font-semibold' : 'text-[#64748b] border-l-transparent hover:bg-[#fafafa] hover:text-[#0b1f3a]'
              }`}>
              <i className={`fas fa-${item.icon} w-4.5 text-center text-[13px]`}></i>
              {item.label}
            </div>
          ))}
        </div>

        <div className="mb-1.5">
          <div className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-[#94a3b8] px-5 py-3 mb-1.5">
            Financeiro
          </div>
          {[
            { id: 'comissoes',  icon: 'coins',        label: 'Comissões',     badge: '2' },
            { id: 'financeiro', icon: 'file-invoice', label: 'Área Financeira' }
          ].map((item) => (
            <div key={item.id} onClick={() => nav(item.id as PageId)}
              className={`flex items-center gap-3 py-2.5 px-5 cursor-pointer text-[13px] font-medium transition-all border-l-[3px] ${
                activePage === item.id ? 'bg-[#eef5ff] text-[#1a6edb] border-l-[#1a6edb] font-semibold' : 'text-[#64748b] border-l-transparent hover:bg-[#fafafa] hover:text-[#0b1f3a]'
              }`}>
              <i className={`fas fa-${item.icon} w-4.5 text-center text-[13px]`}></i>
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-[#d97706] text-white text-[10px] font-bold py-0.5 px-1.75 rounded-[10px]">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mb-1.5">
          <div className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-[#94a3b8] px-5 py-3 mb-1.5">
            Gestão
          </div>
          {[
            { id: 'documentos', icon: 'folder-open',  label: 'Documentos',       badge: '3' },
            { id: 'historico',  icon: 'history',      label: 'Histórico' },
            { id: 'wallet',     icon: 'wallet',       label: 'Wallet & Blockchain' },
            { id: 'perfil',     icon: 'user-circle',  label: 'Perfil' }
          ].map((item) => (
            <div key={item.id} onClick={() => nav(item.id as PageId)}
              className={`flex items-center gap-3 py-2.5 px-5 cursor-pointer text-[13px] font-medium transition-all border-l-[3px] ${
                activePage === item.id ? 'bg-[#eef5ff] text-[#1a6edb] border-l-[#1a6edb] font-semibold' : 'text-[#64748b] border-l-transparent hover:bg-[#fafafa] hover:text-[#0b1f3a]'
              }`}>
              <i className={`fas fa-${item.icon} w-4.5 text-center text-[13px]`}></i>
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-[#dc2626] text-white text-[10px] font-bold py-0.5 px-1.75 rounded-[10px]">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <div className="ml-[240px] mt-[60px] min-h-[calc(100vh-60px)] max-md:ml-0">
        <div className="p-10 max-md:p-6">

          {/* ── DASHBOARD HOME ──────────────────────────────────────────── */}
          {activePage === 'dashboard' && (
            <>
              <div className="mb-8">
                <div className="text-[11px] font-semibold tracking-[0.09em] uppercase text-[#1a6edb] mb-2">
                  Painel do Originador
                </div>
                <h1 className="font-['Playfair_Display'] text-[28px] font-semibold text-[#0b1f3a] tracking-tight mb-1.5">
                  Bem-vindo, Rafael Andrade
                </h1>
                <p className="text-sm text-[#64748b]">
                  Acompanhe seu pipeline, comissões e oportunidades em crédito privado e operações estruturadas.
                </p>
                <div className="h-px bg-[#e2e8f0] my-5"></div>
              </div>

              {/* KPI CARDS */}
              <div className="grid grid-cols-4 gap-5 mb-8 max-lg:grid-cols-2 max-md:grid-cols-1">
                {[
                  { label: 'Operações no Pipeline', value: '7',          sub: '+1 esta semana',                  icon: 'layer-group',  trend: '+' },
                  { label: 'Volume em Pipeline',    value: 'R$ 407 MM',  sub: '+R$ 45 MM vs. mês anterior',      icon: 'chart-pie',    trend: '+' },
                  { label: 'Taxa Média Pretendida', value: 'CDI + 4,8%', sub: 'spread médio das propostas ativas', icon: 'percentage',  trend: '~' },
                  { label: 'Próximos à Emissão',    value: 'R$ 185 MM',  sub: '2 ops em Comitê / Estruturação',   icon: 'rocket',       trend: '+' },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-white border border-[#e2e8f0] rounded-[10px] p-5.5 flex flex-col gap-2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all"
                  >
                    <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#94a3b8] flex items-center gap-1.5">
                      <i className={`fas fa-${kpi.icon} text-[11px]`}></i>
                      {kpi.label}
                    </div>
                    <div className="font-['Playfair_Display'] text-[24px] font-semibold text-[#0b1f3a] tracking-tight leading-none">
                      {kpi.value}
                    </div>
                    <div className="text-xs flex items-center gap-1">
                      <span className={`font-semibold ${kpi.trend === '+' ? 'text-[#059669]' : 'text-[#94a3b8]'}`}>
                        {kpi.trend === '+' ? '↑ ' : ''}{kpi.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CHARTS + RECENT OPS */}
              <div className="grid grid-cols-2 gap-6 mb-6 max-md:grid-cols-1">

                {/* Volume por Setor (Histórico) */}
                <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
                    <div className="text-[13.5px] font-semibold text-[#0b1f3a] flex items-center gap-2">
                      <i className="fas fa-chart-bar text-[#1a6edb] text-[13px]"></i>
                      Volume Histórico por Setor
                    </div>
                    <span className="text-[11px] text-[#94a3b8]">R$ MM · 12 operações</span>
                  </div>
                  <div className="p-5 pt-4">
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart
                        data={VOLUME_SETOR}
                        layout="vertical"
                        barSize={16}
                        margin={{ top: 0, right: 16, bottom: 0, left: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="setor" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={110} />
                        <Tooltip content={<TooltipSetor />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="volume" radius={[0, 6, 6, 0]}>
                          {VOLUME_SETOR.map((d, i) => (
                            <Cell key={i} fill={d.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Operações Recentes */}
                <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
                    <div className="text-[13.5px] font-semibold text-[#0b1f3a] flex items-center gap-2">
                      <i className="fas fa-stream text-[#1a6edb] text-[13px]"></i>
                      Operações Recentes
                    </div>
                    <button onClick={() => nav('dealflow')} className="text-[11px] text-[#1a6edb] font-semibold hover:underline">
                      Ver todas →
                    </button>
                  </div>
                  <div className="divide-y divide-[#f1f5f9]">
                    {RECENT_OPS.map((op) => (
                      <div key={op.name} className="flex items-center justify-between px-6 py-4 hover:bg-[#fafbfc] transition-colors cursor-pointer" onClick={() => nav('dealflow')}>
                        <div className="flex-1">
                          <div className="text-[13px] font-semibold text-[#0b1f3a] mb-0.5">{op.name}</div>
                          <div className="text-[11px] text-[#94a3b8]">{op.instrumento} · {op.value}</div>
                        </div>
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                          <span className={`w-1.5 h-1.5 rounded-full inline-block ${op.dot}`}></span>
                          <span className="text-[#475569]">{op.stage}</span>
                        </span>
                      </div>
                    ))}
                    {/* Agro Cerrado — concluído */}
                    <div className="flex items-center justify-between px-6 py-4 hover:bg-[#fafbfc] transition-colors cursor-pointer" onClick={() => nav('historico')}>
                      <div className="flex-1">
                        <div className="text-[13px] font-semibold text-[#0b1f3a] mb-0.5">Agro Cerrado</div>
                        <div className="text-[11px] text-[#94a3b8]">CRA · R$ 120 MM</div>
                      </div>
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full inline-block bg-[#059669]"></span>
                        <span className="text-[#475569]">Concluído</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-6">
                <h3 className="text-[13.5px] font-semibold text-[#0b1f3a] mb-4 flex items-center gap-2">
                  <i className="fas fa-bolt text-[#1a6edb]"></i>
                  Ações Rápidas
                </h3>
                <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
                  {[
                    { icon: 'plus-circle',  label: 'Nova Operação', color: '#0b1f3a', onClick: () => nav('originar')   },
                    { icon: 'file-invoice', label: 'Ver Comissões', color: '#1a6edb', onClick: () => nav('comissoes')  },
                    { icon: 'chart-bar',    label: 'Relatórios',    color: '#059669', onClick: () => nav('historico')  },
                    { icon: 'headset',      label: 'Suporte',       color: '#64748b', onClick: () => setShowSuporte(true) },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className="flex items-center gap-3 py-3.5 px-4 border-[1.5px] border-[#e2e8f0] rounded-lg hover:border-[#1a6edb] hover:bg-[#eef5ff] transition-all"
                      style={{ color: action.color }}
                    >
                      <i className={`fas fa-${action.icon} text-lg`}></i>
                      <span className="text-[13px] font-semibold">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── ORIGINAR ──────────────────────────────────────────────────── */}
          {activePage === 'originar' && (
            <OriginacaoWizard onNavigate={(p) => nav(p as PageId)} onNewDeal={addDeal} />
          )}

          {/* ── OTHER PAGES ───────────────────────────────────────────────── */}
          {activePage === 'dealflow'    && <DealFlowPage deals={deals} />}
          {activePage === 'mercado'     && <MercadoPage />}
          {activePage === 'educacional' && <EducacionalPage />}
          {activePage === 'comissoes'   && <ComissoesPage onGerarNF={handleGerarNF} deals={deals} />}
          {activePage === 'financeiro'  && <FinanceiroPage nfPreSelected={nfPreSelected} onNFSubmit={() => setNfPreSelected(null)} />}
          {activePage === 'documentos'  && <DocumentosPage />}
          {activePage === 'historico'   && <HistoricoPage />}
          {activePage === 'wallet'      && <WalletPage />}
          {activePage === 'perfil'      && <PerfilPage />}

        </div>
      </div>
    </div>
  );
}
