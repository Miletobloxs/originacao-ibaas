import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type DashboardPage = 'dashboard' | 'originar' | 'dealflow' | 'mercado' | 'educacional' | 'comissoes' | 'financeiro' | 'documentos' | 'historico' | 'wallet' | 'perfil';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<DashboardPage>('dashboard');

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-['Inter']">
      {/* TOPBAR */}
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
        <div className="flex items-center gap-4 ml-auto">
          <div className="relative cursor-pointer text-[#64748b] text-[17px]">
            <i className="fas fa-bell"></i>
            <div className="absolute top-[-3px] right-[-3px] w-2 h-2 bg-[#dc2626] rounded-full border-2 border-white"></div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#0b1f3a] text-white flex items-center justify-center text-[13px] font-semibold cursor-pointer">
            RA
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <nav className="fixed top-[60px] left-0 bottom-0 w-[240px] bg-white border-r border-[#e2e8f0] overflow-y-auto z-[100] py-5 max-md:hidden">
        <div className="mb-1.5">
          <div className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-[#94a3b8] px-5 py-3 mb-1.5">
            Principal
          </div>
          {[
            { id: 'dashboard', icon: 'chart-line', label: 'Dashboard' },
            { id: 'originar', icon: 'plus-circle', label: 'Originar Operação' },
            { id: 'dealflow', icon: 'stream', label: 'Deal Flow', badge: '3' }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePage(item.id as DashboardPage)}
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
            { id: 'mercado', icon: 'newspaper', label: 'Resumo de Mercado' },
            { id: 'educacional', icon: 'play-circle', label: 'Educacional' }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePage(item.id as DashboardPage)}
              className={`flex items-center gap-3 py-2.5 px-5 cursor-pointer text-[13px] font-medium transition-all border-l-[3px] ${
                activePage === item.id
                  ? 'bg-[#eef5ff] text-[#1a6edb] border-l-[#1a6edb] font-semibold'
                  : 'text-[#64748b] border-l-transparent hover:bg-[#fafafa] hover:text-[#0b1f3a]'
              }`}
            >
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
            { id: 'comissoes', icon: 'coins', label: 'Comissões' },
            { id: 'financeiro', icon: 'file-invoice', label: 'Área Financeira' }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePage(item.id as DashboardPage)}
              className={`flex items-center gap-3 py-2.5 px-5 cursor-pointer text-[13px] font-medium transition-all border-l-[3px] ${
                activePage === item.id
                  ? 'bg-[#eef5ff] text-[#1a6edb] border-l-[#1a6edb] font-semibold'
                  : 'text-[#64748b] border-l-transparent hover:bg-[#fafafa] hover:text-[#0b1f3a]'
              }`}
            >
              <i className={`fas fa-${item.icon} w-4.5 text-center text-[13px]`}></i>
              {item.label}
            </div>
          ))}
        </div>

        <div className="mb-1.5">
          <div className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-[#94a3b8] px-5 py-3 mb-1.5">
            Gestão
          </div>
          {[
            { id: 'documentos', icon: 'folder-open', label: 'Documentos' },
            { id: 'historico', icon: 'history', label: 'Histórico' },
            { id: 'wallet', icon: 'wallet', label: 'Wallet & Blockchain' },
            { id: 'perfil', icon: 'user-circle', label: 'Perfil' }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePage(item.id as DashboardPage)}
              className={`flex items-center gap-3 py-2.5 px-5 cursor-pointer text-[13px] font-medium transition-all border-l-[3px] ${
                activePage === item.id
                  ? 'bg-[#eef5ff] text-[#1a6edb] border-l-[#1a6edb] font-semibold'
                  : 'text-[#64748b] border-l-transparent hover:bg-[#fafafa] hover:text-[#0b1f3a]'
              }`}
            >
              <i className={`fas fa-${item.icon} w-4.5 text-center text-[13px]`}></i>
              {item.label}
            </div>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="ml-[240px] mt-[60px] min-h-[calc(100vh-60px)] max-md:ml-0">
        <div className="p-10 max-md:p-6">
          {/* DASHBOARD PAGE */}
          {activePage === 'dashboard' && (
            <>
              <div className="mb-8">
                <div className="text-[11px] font-semibold tracking-[0.09em] uppercase text-[#1a6edb] mb-2">
                  Painel do Originador
                </div>
                <h1 className="font-['Playfair_Display'] text-[28px] font-semibold text-[#0b1f3a] tracking-tight mb-1.5">
                  Bem-vindo, Roberto
                </h1>
                <p className="text-sm text-[#64748b]">
                  Acompanhe seu pipeline, comissões e oportunidades em crédito privado e operações estruturadas.
                </p>
                <div className="h-px bg-[#e2e8f0] my-5"></div>
              </div>

              {/* KPI CARDS */}
              <div className="grid grid-cols-4 gap-4.5 mb-8 max-lg:grid-cols-2 max-md:grid-cols-1">
                {[
                  { label: 'Operações no pipeline', value: '7', sub: '+2 desde última semana', icon: 'layer-group' },
                  { label: 'Volume Total (M)', value: 'R$ 42,5', sub: 'R$ 8,2 M no mês', icon: 'chart-pie' },
                  { label: 'Taxa Média', value: '13,4%', sub: 'CDI + 5,2% p.a.', icon: 'percentage' },
                  { label: 'Comissões (mês)', value: 'R$ 126k', sub: '+18,4% vs mês anterior', icon: 'coins' }
                ].map((kpi, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#e2e8f0] rounded-[10px] p-5.5 flex flex-col gap-2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all"
                  >
                    <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#94a3b8] flex items-center gap-1.5">
                      <i className={`fas fa-${kpi.icon} text-[11px]`}></i>
                      {kpi.label}
                    </div>
                    <div className="font-['Playfair_Display'] text-[26px] font-semibold text-[#0b1f3a] tracking-tight leading-none">
                      {kpi.value}
                    </div>
                    <div className="text-xs text-[#64748b] flex items-center gap-1.25">
                      {kpi.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* CHARTS AND LISTS */}
              <div className="grid grid-cols-2 gap-6 mb-6 max-md:grid-cols-1">
                <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
                  <div className="px-6 py-4.5 border-b border-[#e2e8f0] flex items-center justify-between">
                    <div className="text-[13.5px] font-semibold text-[#0b1f3a] flex items-center gap-2">
                      <i className="fas fa-chart-area text-[#1a6edb] text-[13px]"></i>
                      Volume por Setor
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="h-[280px] flex items-center justify-center text-[#94a3b8] text-sm">
                      Gráfico de Volume por Setor
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
                  <div className="px-6 py-4.5 border-b border-[#e2e8f0] flex items-center justify-between">
                    <div className="text-[13.5px] font-semibold text-[#0b1f3a] flex items-center gap-2">
                      <i className="fas fa-stream text-[#1a6edb] text-[13px]"></i>
                      Operações Recentes
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3.5">
                      {[
                        { name: 'FIDC Agro Premium', value: 'R$ 12,5 M', status: 'Em análise', color: 'blue' },
                        { name: 'CRI Logística SP', value: 'R$ 8,2 M', status: 'Aprovado', color: 'success' },
                        { name: 'Debênture Tech Valley', value: 'R$ 15,0 M', status: 'Documentação', color: 'warning' }
                      ].map((op, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-[#e2e8f0] last:border-0">
                          <div className="flex-1">
                            <div className="text-[13px] font-semibold text-[#0b1f3a] mb-0.5">{op.name}</div>
                            <div className="text-xs text-[#64748b]">{op.value}</div>
                          </div>
                          <span
                            className={`text-[11px] font-semibold py-0.75 px-2.5 rounded-full ${
                              op.color === 'blue'
                                ? 'bg-[#d6e8ff] text-[#1a6edb]'
                                : op.color === 'success'
                                ? 'bg-[#d1fae5] text-[#059669]'
                                : 'bg-[#fef3c7] text-[#d97706]'
                            }`}
                          >
                            {op.status}
                          </span>
                        </div>
                      ))}
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
                    { icon: 'plus-circle', label: 'Nova Operação', color: '#0b1f3a' },
                    { icon: 'file-invoice', label: 'Ver Comissões', color: '#1a6edb' },
                    { icon: 'chart-bar', label: 'Relatórios', color: '#059669' },
                    { icon: 'headset', label: 'Suporte', color: '#64748b' }
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={() => i === 0 && setActivePage('originar')}
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

          {/* ORIGINAR OPERAÇÃO PAGE */}
          {activePage === 'originar' && (
            <>
              <div className="mb-8">
                <div className="text-[11px] font-semibold tracking-[0.09em] uppercase text-[#1a6edb] mb-2">
                  Nova Operação
                </div>
                <h1 className="font-['Playfair_Display'] text-[28px] font-semibold text-[#0b1f3a] tracking-tight mb-1.5">
                  Originar Operação
                </h1>
                <p className="text-sm text-[#64748b]">
                  Estruture e distribua operações de crédito privado, CRI, CRA, FIDCs e debêntures.
                </p>
                <div className="h-px bg-[#e2e8f0] my-5"></div>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-8">
                <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[#1a6edb] mb-4 pb-2.5 border-b border-[#e2e8f0]">
                  Informações da Operação
                </div>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-medium text-[#1e293b]">Tipo de Operação *</label>
                    <select className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]">
                      <option>Selecione</option>
                      <option>FIDC</option>
                      <option>CRI</option>
                      <option>CRA</option>
                      <option>Debênture</option>
                      <option>Nota Comercial</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-medium text-[#1e293b]">Setor *</label>
                    <select className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]">
                      <option>Selecione</option>
                      <option>Agronegócio</option>
                      <option>Imobiliário</option>
                      <option>Infraestrutura</option>
                      <option>Tecnologia</option>
                      <option>Saúde</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-medium text-[#1e293b]">Volume Pretendido *</label>
                    <input
                      type="text"
                      placeholder="R$ 0,00"
                      className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-medium text-[#1e293b]">Taxa Pretendida (% a.a.) *</label>
                    <input
                      type="text"
                      placeholder="CDI + 0,00%"
                      className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-medium text-[#1e293b]">Nome do Emissor / Devedor *</label>
                    <input
                      type="text"
                      placeholder="Razão social completa"
                      className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-medium text-[#1e293b]">Descrição da Operação</label>
                    <textarea
                      placeholder="Descreva os principais detalhes da operação..."
                      className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none resize-vertical min-h-[90px] transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#e2e8f0] flex gap-3">
                  <button className="px-7 py-3 bg-[#0b1f3a] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6edb] transition-all">
                    Enviar para Análise
                  </button>
                  <button className="px-7 py-3 border-[1.5px] border-[#e2e8f0] bg-white text-[#64748b] rounded-lg text-sm font-medium hover:border-[#0b1f3a] hover:text-[#0b1f3a] transition-all">
                    Salvar Rascunho
                  </button>
                </div>
              </div>
            </>
          )}

          {/* OTHER PAGES - PLACEHOLDER */}
          {activePage !== 'dashboard' && activePage !== 'originar' && (
            <div className="text-center py-20">
              <i className="fas fa-construction text-[48px] text-[#94a3b8] mb-4"></i>
              <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#0b1f3a] mb-2">
                Página em Desenvolvimento
              </h2>
              <p className="text-sm text-[#64748b]">
                A página <strong>{activePage}</strong> está sendo construída.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
