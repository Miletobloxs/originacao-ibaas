import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'entrar' | 'cadastrar'>('entrar');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotEnviado, setForgotEnviado] = useState(false);
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginSenha: '',
    regNome: '',
    regCpf: '',
    regEmail: '',
    regSenha: '',
    regSenha2: '',
    regEndereco: '',
    regEmpresa: '',
    regCnpj: '',
    regCargo: '',
    regEndEmpresa: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('bloxs_auth', '1');
    navigate('/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('bloxs_auth', '1');
    navigate('/onboarding');
  };

  const handleSocialLogin = () => {
    localStorage.setItem('bloxs_auth', '1');
    setTimeout(() => navigate('/dashboard'), 1400);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };

  return (
    <div className="flex min-h-screen font-['Inter']">
      {/* LEFT PANEL */}
      <div className="w-[44%] bg-[#0b1f3a] flex flex-col justify-between p-14 relative overflow-hidden max-md:hidden">
        <div className="absolute top-[-120px] right-[-120px] w-[480px] h-[480px] rounded-full bg-[rgba(26,110,219,0.07)]"></div>
        <div className="absolute bottom-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full bg-[rgba(79,163,255,0.05)]"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-15">
            <img
              src="https://bloxs.com.br/_next/static/media/logotype-bloxs.24b4579c.svg"
              alt="Bloxs"
              className="h-8 brightness-0 invert"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <span className="font-['Playfair_Display'] text-[26px] font-semibold text-white tracking-tight hidden">
              Bloxs<span className="text-[#4fa3ff]">.</span>
            </span>
          </div>

          <div className="mt-15">
            <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#1a6edb] mb-2.5">
              IBaaS · Investment Banking as a Service
            </div>
            <h1 className="font-['Playfair_Display'] text-4xl font-semibold text-white leading-tight tracking-tight mb-4">
              Estruture e distribua operações de <em className="not-italic text-[#4fa3ff]">crédito privado</em> e operações estruturadas
            </h1>
            <div className="w-12 h-0.5 bg-[#4fa3ff] my-7 opacity-50"></div>
            <p className="text-sm leading-relaxed text-white/60 max-w-[360px]">
              Infraestrutura para originadores no mercado de capitais transformarem suas conexões em valores mobiliários — por meio de operações securitizadas, gestora de recursos e coordenação de ofertas públicas, no âmbito das Resoluções CVM 160 e 88 quando aplicável.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-[10.5px] leading-relaxed text-white/40 border-t border-white/10 pt-5">
            A Bloxs atua por meio de entidades reguladas: Bloxs Securitizadora (RCVM 60), Bloxs Gestora de Recursos (CVM), Bloxs Coordenadora de Ofertas Públicas (RCVM 161). As operações disponibilizadas neste ambiente são restritas a investidores qualificados ou profissionais, conforme RCVM 30, e observam as regras de cadastro e prevenção à lavagem de dinheiro previstas na RCVM 50. O acesso ao portal não constitui oferta ou recomendação de investimento. Ambiente regulado e monitorado pela CVM e pelo Banco Central do Brasil.
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center p-16 bg-white max-md:p-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-9">
            <h2 className="font-['Playfair_Display'] text-[28px] font-semibold text-[#0b1f3a] tracking-tight mb-2">
              Acesse sua conta
            </h2>
            <p className="text-sm text-[#64748b]">Portal exclusivo para originadores credenciados</p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-[#f0f4f8] rounded-lg p-1 mb-7 gap-1">
            <button
              onClick={() => setActiveTab('entrar')}
              className={`flex-1 py-2 text-[13.5px] font-medium rounded-md transition-all ${
                activeTab === 'entrar'
                  ? 'bg-white text-[#0b1f3a] shadow-sm'
                  : 'bg-transparent text-[#64748b]'
              }`}
            >
              Acessar
            </button>
            <button
              onClick={() => setActiveTab('cadastrar')}
              className={`flex-1 py-2 text-[13.5px] font-medium rounded-md transition-all ${
                activeTab === 'cadastrar'
                  ? 'bg-white text-[#0b1f3a] shadow-sm'
                  : 'bg-transparent text-[#64748b]'
              }`}
            >
              Cadastrar-se
            </button>
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-3 mb-5">
            <button
              onClick={handleSocialLogin}
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-lg text-sm font-medium border-[1.5px] border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#4fa3ff] hover:bg-[#d6e8ff] transition-all"
            >
              <span className="w-5 h-5 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cpath%20fill%3D%22%23EA4335%22%20d%3D%22M24%209.5c3.54%200%206.71%201.22%209.21%203.6l6.85-6.85C35.9%202.38%2030.47%200%2024%200%2014.62%200%206.51%205.38%202.56%2013.22l7.98%206.19C12.43%2013.72%2017.74%209.5%2024%209.5z%22%2F%3E%3Cpath%20fill%3D%22%234285F4%22%20d%3D%22M46.98%2024.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58%202.96-2.26%205.48-4.78%207.18l7.73%206c4.51-4.18%207.09-10.36%207.09-17.65z%22%2F%3E%3Cpath%20fill%3D%22%23FBBC05%22%20d%3D%22M10.53%2028.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92%2016.46%200%2020.12%200%2024c0%203.88.92%207.54%202.56%2010.78l7.97-6.19z%22%2F%3E%3Cpath%20fill%3D%22%2334A853%22%20d%3D%22M24%2048c6.48%200%2011.93-2.13%2015.89-5.81l-7.73-6c-2.18%201.48-4.97%202.31-8.16%202.31-6.26%200-11.57-4.22-13.47-9.91l-7.98%206.19C6.51%2042.62%2014.62%2048%2024%2048z%22%2F%3E%3C%2Fsvg%3E')] bg-center bg-contain bg-no-repeat"></span>
              {activeTab === 'entrar' ? 'Continuar com Google' : 'Cadastrar com Google'}
            </button>
            <button
              onClick={handleSocialLogin}
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-lg text-sm font-medium border-[1.5px] border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#4fa3ff] hover:bg-[#d6e8ff] transition-all"
            >
              <span className="w-5 h-5 flex items-center justify-center text-[#0077b5] text-[17px]">
                <i className="fab fa-linkedin"></i>
              </span>
              {activeTab === 'entrar' ? 'Continuar com LinkedIn' : 'Cadastrar com LinkedIn'}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#e2e8f0]"></div>
            <span className="text-xs text-[#94a3b8] whitespace-nowrap">ou continue com e-mail</span>
            <div className="flex-1 h-px bg-[#e2e8f0]"></div>
          </div>

          {/* FORGOT PASSWORD */}
          {activeTab === 'entrar' && showForgot && (
            <div>
              {forgotEnviado ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-[#d1fae5] flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-envelope-open-text text-[#059669] text-xl"></i>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-[20px] font-semibold text-[#0b1f3a] mb-2">
                    Link enviado!
                  </h3>
                  <p className="text-[13px] text-[#64748b] leading-relaxed mb-1">
                    Enviamos um link de recuperação para
                  </p>
                  <p className="text-[13px] font-semibold text-[#0b1f3a] mb-6">{forgotEmail}</p>
                  <p className="text-[11.5px] text-[#94a3b8] mb-6">
                    Verifique sua caixa de entrada e spam. O link expira em 30 minutos.
                  </p>
                  <button
                    onClick={() => { setShowForgot(false); setForgotEnviado(false); setForgotEmail(''); }}
                    className="text-[13px] text-[#1a6edb] font-semibold hover:underline"
                  >
                    ← Voltar ao login
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setShowForgot(false)}
                    className="flex items-center gap-1.5 text-[12.5px] text-[#64748b] hover:text-[#0b1f3a] mb-5 transition-colors"
                  >
                    <i className="fas fa-arrow-left text-[11px]"></i>
                    Voltar ao login
                  </button>
                  <h3 className="font-['Playfair_Display'] text-[20px] font-semibold text-[#0b1f3a] mb-1.5">
                    Recuperar acesso
                  </h3>
                  <p className="text-[13px] text-[#64748b] mb-6 leading-relaxed">
                    Informe o e-mail cadastrado e enviaremos um link para redefinir sua senha.
                  </p>
                  <div className="mb-5">
                    <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">
                      E-mail corporativo
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="seu@email.com.br"
                      className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!forgotEmail) return;
                      setForgotLoading(true);
                      setTimeout(() => { setForgotLoading(false); setForgotEnviado(true); }, 1400);
                    }}
                    disabled={!forgotEmail || forgotLoading}
                    className="w-full py-[13px] bg-[#0b1f3a] text-white rounded-lg text-[14px] font-semibold transition-all hover:bg-[#1a6edb] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <><i className="fas fa-spinner fa-spin text-[13px]"></i> Enviando...</>
                    ) : (
                      <><i className="fas fa-paper-plane text-[13px]"></i> Enviar link de recuperação</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'entrar' && !showForgot && (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">
                  E-mail corporativo
                </label>
                <input
                  type="email"
                  value={formData.loginEmail}
                  onChange={(e) => setFormData({ ...formData, loginEmail: e.target.value })}
                  placeholder="seu@email.com.br"
                  className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">Senha</label>
                <input
                  type="password"
                  value={formData.loginSenha}
                  onChange={(e) => setFormData({ ...formData, loginSenha: e.target.value })}
                  placeholder="••••••••"
                  className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-[13px] bg-[#0b1f3a] text-white rounded-lg text-[14.5px] font-semibold transition-all hover:bg-[#132d54] mt-1.5"
              >
                Acessar o portal
              </button>
              <div className="text-center text-[12.5px] text-[#64748b] mt-4.5">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[#1a6edb] font-medium hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'cadastrar' && (
            <form onSubmit={handleRegister}>
              <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#1a6edb] mb-3.5">
                Dados pessoais
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    value={formData.regNome}
                    onChange={(e) => setFormData({ ...formData, regNome: e.target.value })}
                    placeholder="Nome e sobrenome"
                    className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">CPF *</label>
                  <input
                    type="text"
                    value={formData.regCpf}
                    onChange={(e) =>
                      setFormData({ ...formData, regCpf: formatCPF(e.target.value) })
                    }
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">
                  E-mail corporativo *
                </label>
                <input
                  type="email"
                  value={formData.regEmail}
                  onChange={(e) => setFormData({ ...formData, regEmail: e.target.value })}
                  placeholder="seu@email.com.br"
                  className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">Senha *</label>
                  <input
                    type="password"
                    value={formData.regSenha}
                    onChange={(e) => setFormData({ ...formData, regSenha: e.target.value })}
                    placeholder="Min. 8 caracteres"
                    className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">
                    Confirmar senha *
                  </label>
                  <input
                    type="password"
                    value={formData.regSenha2}
                    onChange={(e) => setFormData({ ...formData, regSenha2: e.target.value })}
                    placeholder="Repita a senha"
                    className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">
                  Endereço residencial completo *
                </label>
                <input
                  type="text"
                  value={formData.regEndereco}
                  onChange={(e) => setFormData({ ...formData, regEndereco: e.target.value })}
                  placeholder="Rua, número, complemento, cidade - UF"
                  className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                />
              </div>

              <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#1a6edb] my-4.5">
                Dados da empresa
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">
                    Razão social *
                  </label>
                  <input
                    type="text"
                    value={formData.regEmpresa}
                    onChange={(e) => setFormData({ ...formData, regEmpresa: e.target.value })}
                    placeholder="Nome da empresa"
                    className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">CNPJ *</label>
                  <input
                    type="text"
                    value={formData.regCnpj}
                    onChange={(e) =>
                      setFormData({ ...formData, regCnpj: formatCNPJ(e.target.value) })
                    }
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">Cargo *</label>
                <input
                  type="text"
                  value={formData.regCargo}
                  onChange={(e) => setFormData({ ...formData, regCargo: e.target.value })}
                  placeholder="Ex: Sócio, Diretor, Assessor de Investimentos"
                  className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[12.5px] font-medium text-[#1e293b] mb-1.5">
                  Endereço da empresa *
                </label>
                <input
                  type="text"
                  value={formData.regEndEmpresa}
                  onChange={(e) => setFormData({ ...formData, regEndEmpresa: e.target.value })}
                  placeholder="Rua, número, complemento, cidade - UF"
                  className="w-full py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-sm outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-[13px] bg-[#0b1f3a] text-white rounded-lg text-[14.5px] font-semibold transition-all hover:bg-[#132d54]"
              >
                Criar conta e iniciar cadastro
              </button>
              <div className="text-center text-[11px] text-[#94a3b8] mt-3">
                Após criar conta, você será direcionado ao cadastro regulatório conforme RCVM 50 e RCVM 30.
              </div>
            </form>
          )}

          {/* Demo Hint */}
          <div className="mt-5 p-4 bg-[#d6e8ff] border border-[#4fa3ff] rounded-lg text-[12.5px] text-[#0b1f3a] leading-relaxed">
            <strong className="font-semibold">Acesso demonstração</strong>
            <br />
            Explore o painel do originador sem cadastro obrigatório.
            <button
              onClick={() => { localStorage.setItem('bloxs_auth', '1'); navigate('/dashboard'); }}
              className="block w-full mt-2.5 py-2.5 bg-[#1a6edb] text-white rounded-[7px] text-[13.5px] font-semibold transition-all hover:bg-[#0b1f3a]"
            >
              Entrar como demonstração →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
