import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [suitabilityScores, setSuitabilityScores] = useState<Record<string, number>>({});
  const [perfil, setPerfil] = useState('');
  const [beneficiarios, setBeneficiarios] = useState([1]);

  const goStep = (step: Step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calcSuitability = () => {
    const scores = Object.values(suitabilityScores);
    const total = scores.reduce((a, b) => a + b, 0);
    let result;
    if (total <= 7) result = 'Conservador';
    else if (total <= 11) result = 'Moderado';
    else result = 'Arrojado';

    setPerfil(result);
    setTimeout(() => goStep(3), 800);
  };

  const addBeneficiario = () => {
    setBeneficiarios([...beneficiarios, beneficiarios.length + 1]);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-['Inter']">
      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-white border-b border-[#e2e8f0] px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="https://bloxs.com.br/_next/static/media/logotype-bloxs.24b4579c.svg"
            alt="Bloxs"
            className="h-7"
          />
          <span className="font-['Playfair_Display'] text-[22px] font-semibold text-[#0b1f3a] tracking-tight">
            Bloxs
          </span>
        </div>
        <div className="text-xs text-[#64748b]">
          Cadastro Regulatório — IBaaS · Portal do Originador
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-65px)]">
        {/* SIDEBAR */}
        <nav className="w-[280px] bg-white border-r border-[#e2e8f0] p-10 flex-shrink-0 max-md:hidden">
          <h3 className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[#1a6edb] mb-6">
            Etapas do cadastro
          </h3>
          <div className="flex flex-col gap-1.5">
            {[
              { num: 1, title: 'KYC / CVM 50', desc: 'Identificação e perfil empresarial' },
              { num: 2, title: 'Suitability / CVM 30', desc: 'Adequação ao perfil de investidor' },
              { num: 3, title: 'Beneficiários Finais', desc: 'Estrutura societária e controle' },
              { num: 4, title: 'Conclusão', desc: 'Acesso ao painel liberado' }
            ].map((step) => (
              <div
                key={step.num}
                className={`flex items-start gap-3.5 py-3.5 px-4 rounded-lg cursor-default transition-all ${
                  currentStep === step.num
                    ? 'bg-[#d6e8ff]'
                    : currentStep > step.num
                    ? 'bg-[#f0f4f8]'
                    : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${
                    currentStep === step.num
                      ? 'bg-[#1a6edb] text-white'
                      : currentStep > step.num
                      ? 'bg-[#059669] text-white'
                      : 'bg-[#e2e8f0] text-[#64748b]'
                  }`}
                >
                  {currentStep > step.num ? '✓' : step.num}
                </div>
                <div className="flex-1">
                  <strong
                    className={`block text-[13px] font-semibold ${
                      currentStep === step.num ? 'text-[#1a6edb]' : 'text-[#0b1f3a]'
                    }`}
                  >
                    {step.title}
                  </strong>
                  <span className="text-[11.5px] text-[#64748b] leading-tight block mt-0.5">
                    {step.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-12 max-w-[820px]">
          {/* STEP 1: KYC */}
          {currentStep === 1 && (
            <div>
              <div className="mb-9 pb-6 border-b border-[#e2e8f0]">
                <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#1a6edb] mb-2.5">
                  Etapa 1 de 4 · RCVM 50 — KYC / KYB
                </div>
                <h2 className="font-['Playfair_Display'] text-[26px] font-semibold text-[#0b1f3a] tracking-tight mb-2">
                  Identificação e dados da empresa
                </h2>
                <p className="text-sm text-[#64748b] leading-relaxed max-w-[560px]">
                  Conformidade com a Resolução CVM 50 — prevenção à lavagem de dinheiro e cadastro regulatório completo.
                </p>
              </div>

              <div className="bg-[#d6e8ff] border border-[#4fa3ff] rounded-lg p-4 text-[13px] text-[#0b1f3a] leading-relaxed mb-6">
                <strong className="font-semibold">Por que esses dados são obrigatórios?</strong> A Resolução CVM 50 exige que todos os participantes do mercado de capitais sejam plenamente identificados, incluindo a cadeia de controle societário e verificação de Pessoas Expostas Politicamente (PEP).
              </div>

              <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[#1a6edb] my-7 pb-2.5 border-b border-[#e2e8f0]">
                Dados da pessoa jurídica
              </div>
              <div className="grid grid-cols-2 gap-4.5 mb-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-[#1e293b]">Tipo de pessoa jurídica *</label>
                  <select className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]">
                    <option>Selecione</option>
                    <option>Empresa (LTDA / S.A.)</option>
                    <option>Holding Patrimonial</option>
                    <option>Family Office</option>
                    <option>Fundo de Investimento</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-[#1e293b]">CNPJ *</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-[#1e293b]">Razão social *</label>
                  <input
                    type="text"
                    placeholder="Razão social completa conforme Receita Federal"
                    className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-[#1e293b]">Atividade principal (CNAE) *</label>
                  <input
                    type="text"
                    placeholder="Código CNAE ou descrição"
                    className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-[#1e293b]">Faturamento médio mensal (últ. 12 meses) *</label>
                  <select className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]">
                    <option>Selecione a faixa</option>
                    <option>Até R$ 500 mil</option>
                    <option>R$ 500 mil – R$ 5 mi</option>
                    <option>R$ 5 mi – R$ 50 mi</option>
                    <option>Acima de R$ 50 mi</option>
                  </select>
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-[#1e293b]">Endereço completo da sede *</label>
                  <input
                    type="text"
                    placeholder="Logradouro, número, complemento, cidade – UF, CEP"
                    className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
              </div>

              <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[#1a6edb] my-7 pb-2.5 border-b border-[#e2e8f0]">
                Representante legal
              </div>
              <div className="grid grid-cols-2 gap-4.5 mb-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-[#1e293b]">Nome completo *</label>
                  <input
                    type="text"
                    placeholder="Nome e sobrenome"
                    className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-[#1e293b]">CPF *</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-[#1e293b]">Cargo / Função *</label>
                  <input
                    type="text"
                    placeholder="Ex: Sócio-Administrador, Diretor"
                    className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-[#1e293b]">E-mail corporativo *</label>
                  <input
                    type="email"
                    placeholder="cargo@empresa.com.br"
                    className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                  />
                </div>
              </div>

              <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[#1a6edb] my-7 pb-2.5 border-b border-[#e2e8f0]">
                Verificações regulatórias
              </div>
              <div className="flex items-start gap-3 py-3.5 px-4 border-[1.5px] border-[#e2e8f0] rounded-lg mb-2.5 cursor-pointer hover:border-[#4fa3ff] hover:bg-[#d6e8ff] transition-all">
                <input type="checkbox" className="mt-0.5 accent-[#1a6edb]" />
                <label className="text-[13.5px] leading-relaxed cursor-pointer">
                  Algum administrador, controlador ou sócio com influência significativa é Pessoa Politicamente Exposta (PEP) nos termos do Anexo A da RCVM 50?
                </label>
              </div>
              <div className="flex items-start gap-3 py-3.5 px-4 border-[1.5px] border-[#e2e8f0] rounded-lg mb-2.5 cursor-pointer hover:border-[#4fa3ff] hover:bg-[#d6e8ff] transition-all">
                <input type="checkbox" className="mt-0.5 accent-[#1a6edb]" />
                <label className="text-[13.5px] leading-relaxed cursor-pointer">
                  Declaro que a empresa e seus representantes não constam em listas de sanções do Conselho de Segurança da ONU (CSNU) ou demais listas de restrição aplicáveis.
                </label>
              </div>

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#e2e8f0]">
                <div></div>
                <button
                  onClick={() => goStep(2)}
                  className="flex items-center gap-2 py-3 px-8 bg-[#0b1f3a] text-white rounded-[7px] text-sm font-semibold transition-all hover:bg-[#1a6edb]"
                >
                  Próxima etapa <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Suitability */}
          {currentStep === 2 && (
            <div>
              <div className="mb-9 pb-6 border-b border-[#e2e8f0]">
                <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#1a6edb] mb-2.5">
                  Etapa 2 de 4 · RCVM 30 — Suitability
                </div>
                <h2 className="font-['Playfair_Display'] text-[26px] font-semibold text-[#0b1f3a] tracking-tight mb-2">
                  Adequação ao perfil de investidor
                </h2>
                <p className="text-sm text-[#64748b] leading-relaxed max-w-[560px]">
                  As respostas a seguir determinam seu perfil de risco e garantem a adequação dos produtos disponibilizados à sua realidade financeira e experiência de mercado.
                </p>
              </div>

              {[
                {
                  q: '1. Qual é o horizonte temporal dos seus investimentos?',
                  options: ['Curto prazo (até 1 ano)', 'Médio prazo (1 a 3 anos)', 'Longo prazo (acima de 3 anos)']
                },
                {
                  q: '2. Qual é a sua tolerância ao risco?',
                  options: [
                    'Conservador — priorizo a preservação do capital',
                    'Moderado — aceito algum risco por melhores retornos',
                    'Arrojado — aceito alta volatilidade buscando retornos elevados'
                  ]
                },
                {
                  q: '3. Qual é o seu patrimônio líquido estimado?',
                  options: ['Até R$ 1 milhão', 'R$ 1 mi a R$ 10 mi', 'Acima de R$ 10 mi']
                },
                {
                  q: '4. Com quais tipos de ativos você já operou?',
                  options: [
                    'Apenas renda fixa bancária (CDB, LCI, LCA)',
                    'Fundos de investimento e títulos privados (CRI, CRA, Debêntures)',
                    'Operações estruturadas, FIDCs, equity e derivativos'
                  ]
                },
                {
                  q: '5. Qual é a sua formação e experiência profissional no mercado financeiro?',
                  options: [
                    'Sem experiência formal no setor financeiro',
                    'Formação ou atuação profissional correlata (economia, contabilidade, direito)',
                    'Experiência direta no mercado de capitais (banco, gestora, distribuidora)'
                  ]
                }
              ].map((item, idx) => (
                <div key={idx} className="mb-7">
                  <label className="block text-sm font-medium text-[#0b1f3a] mb-3">{item.q}</label>
                  <div className="flex flex-col gap-2">
                    {item.options.map((opt, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-3 py-3 px-4 border-[1.5px] border-[#e2e8f0] rounded-lg cursor-pointer transition-all hover:border-[#4fa3ff] hover:bg-[#d6e8ff]"
                      >
                        <input
                          type="radio"
                          name={`q${idx + 1}`}
                          value={i + 1}
                          onChange={(e) =>
                            setSuitabilityScores({ ...suitabilityScores, [`q${idx + 1}`]: parseInt(e.target.value) })
                          }
                          className="accent-[#1a6edb]"
                        />
                        <span className="text-[13.5px]">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {perfil && (
                <div className="inline-flex items-center gap-2 py-2.5 px-4.5 rounded-lg bg-[#d6e8ff] text-[#0b1f3a] border-[1.5px] border-[#4fa3ff] text-[13px] font-semibold mt-5">
                  <i className="fas fa-user-check"></i>
                  <span>Perfil identificado: {perfil}</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#e2e8f0]">
                <button
                  onClick={() => goStep(1)}
                  className="py-[11px] px-6 border-[1.5px] border-[#e2e8f0] rounded-[7px] bg-white text-[#64748b] text-sm font-medium transition-all hover:border-[#0b1f3a] hover:text-[#0b1f3a]"
                >
                  <i className="fas fa-arrow-left mr-2"></i> Voltar
                </button>
                <button
                  onClick={calcSuitability}
                  className="flex items-center gap-2 py-3 px-8 bg-[#0b1f3a] text-white rounded-[7px] text-sm font-semibold transition-all hover:bg-[#1a6edb]"
                >
                  Próxima etapa <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Beneficiários Finais */}
          {currentStep === 3 && (
            <div>
              <div className="mb-9 pb-6 border-b border-[#e2e8f0]">
                <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#1a6edb] mb-2.5">
                  Etapa 3 de 4 · RCVM 50 — Art. 13
                </div>
                <h2 className="font-['Playfair_Display'] text-[26px] font-semibold text-[#0b1f3a] tracking-tight mb-2">
                  Beneficiários finais e estrutura societária
                </h2>
                <p className="text-sm text-[#64748b] leading-relaxed max-w-[560px]">
                  Identifique os sócios ou acionistas com participação direta ou indireta superior a 25% do capital social, conforme exigência da RCVM 50, Art. 13.
                </p>
              </div>

              <div className="bg-[#d6e8ff] border border-[#4fa3ff] rounded-lg p-4 text-[13px] text-[#0b1f3a] leading-relaxed mb-6">
                <strong className="font-semibold">Definição de Beneficiário Final:</strong> Pessoa natural que detém, direta ou indiretamente, mais de 25% do capital social da empresa, ou que exerce influência significativa sobre as decisões da organização. O processo deve alcançar a pessoa natural ao final da cadeia de controle.
              </div>

              {beneficiarios.map((num) => (
                <div key={num} className="bg-[#f0f4f8] border border-[#e2e8f0] rounded-[10px] p-5 mb-4 relative">
                  <h4 className="text-[13px] font-semibold text-[#0b1f3a] mb-3.5">
                    Beneficiário Final #{num}
                  </h4>
                  <div className="grid grid-cols-2 gap-4.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12.5px] font-medium text-[#1e293b]">Nome completo *</label>
                      <input
                        type="text"
                        placeholder="Nome completo"
                        className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] bg-white outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12.5px] font-medium text-[#1e293b]">CPF *</label>
                      <input
                        type="text"
                        placeholder="000.000.000-00"
                        className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] bg-white outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12.5px] font-medium text-[#1e293b]">% de participação *</label>
                      <input
                        type="text"
                        placeholder={num === 1 ? 'Ex: 51%' : 'Ex: 25%'}
                        className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] bg-white outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12.5px] font-medium text-[#1e293b]">Vínculo societário *</label>
                      <select className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] bg-white outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]">
                        <option>Selecione</option>
                        <option>Sócio / Acionista</option>
                        <option>Controlador indireto</option>
                        <option>Representante legal</option>
                        <option>Influência significativa</option>
                      </select>
                    </div>
                    <div className="col-span-2 flex flex-col gap-1.5">
                      <label className="text-[12.5px] font-medium text-[#1e293b]">É Pessoa Politicamente Exposta (PEP)?</label>
                      <select className="py-[11px] px-3.5 border-[1.5px] border-[#e2e8f0] rounded-[7px] text-[13.5px] bg-white outline-none transition-all focus:border-[#1a6edb] focus:shadow-[0_0_0_3px_rgba(26,110,219,0.1)]">
                        <option>Não</option>
                        <option>Sim</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addBeneficiario}
                className="py-2.5 px-5 bg-white border-[1.5px] border-[#e2e8f0] text-[#0b1f3a] rounded-[7px] text-[13px] font-semibold transition-all hover:border-[#0b1f3a] mb-7"
              >
                <i className="fas fa-plus mr-1.5"></i> Adicionar beneficiário
              </button>

              <div className="flex items-start gap-3 py-3.5 px-4 border-[1.5px] border-[#e2e8f0] rounded-lg cursor-pointer hover:border-[#4fa3ff] hover:bg-[#d6e8ff] transition-all">
                <input type="checkbox" className="mt-0.5 accent-[#1a6edb]" />
                <label className="text-[13.5px] leading-relaxed cursor-pointer">
                  Declaro que as informações prestadas são verídicas e me responsabilizo por sua atualização em prazo não superior a 5 (cinco) anos, conforme art. 4º da RCVM 50.
                </label>
              </div>

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#e2e8f0]">
                <button
                  onClick={() => goStep(2)}
                  className="py-[11px] px-6 border-[1.5px] border-[#e2e8f0] rounded-[7px] bg-white text-[#64748b] text-sm font-medium transition-all hover:border-[#0b1f3a] hover:text-[#0b1f3a]"
                >
                  <i className="fas fa-arrow-left mr-2"></i> Voltar
                </button>
                <button
                  onClick={() => goStep(4)}
                  className="flex items-center gap-2 py-3 px-8 bg-[#0b1f3a] text-white rounded-[7px] text-sm font-semibold transition-all hover:bg-[#1a6edb]"
                >
                  Finalizar cadastro <i className="fas fa-check"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {currentStep === 4 && (
            <div className="text-center py-15 px-10">
              <div className="w-[72px] h-[72px] bg-[#059669] rounded-full flex items-center justify-center text-[32px] text-white mx-auto mb-7">
                <i className="fas fa-check"></i>
              </div>
              <h2 className="font-['Playfair_Display'] text-[28px] font-semibold text-[#0b1f3a] mb-3.5">
                Cadastro concluído com sucesso
              </h2>
              <p className="text-[15px] text-[#64748b] leading-relaxed max-w-[480px] mx-auto mb-8">
                Seu perfil regulatório foi registrado conforme as Resoluções CVM 50 e 30. Agora você tem acesso ao Painel do Originador Bloxs IBaaS.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 py-3 px-8 bg-[#0b1f3a] text-white rounded-[7px] text-sm font-semibold transition-all hover:bg-[#1a6edb]"
              >
                Acessar o Painel <i className="fas fa-arrow-right"></i>
              </button>
              <div className="mt-6 text-[11.5px] text-[#64748b] leading-relaxed max-w-[480px] mx-auto">
                Seus dados cadastrais foram protocolados e serão analisados pela equipe de Compliance da Bloxs. Em caso de pendências, você será notificado por e-mail. O acesso ao painel é imediato, mas operações estão sujeitas à aprovação final do cadastro.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
