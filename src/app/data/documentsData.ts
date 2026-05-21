export interface DocItem {
  id: string;
  label: string;
  required: boolean;
}

export const DOCS_GERAIS: DocItem[] = [
  { id: 'contrato_social', label: 'Contrato Social / Estatuto Consolidado', required: true },
  { id: 'ultima_alteracao', label: 'Última Alteração Contratual', required: true },
  { id: 'cnpj_cartao', label: 'Cartão CNPJ', required: true },
  { id: 'balanco_3anos', label: 'Balanço Patrimonial (3 exercícios)', required: true },
  { id: 'dre_3anos', label: 'DRE (3 exercícios)', required: true },
  { id: 'fluxo_caixa', label: 'Projeção de Fluxo de Caixa', required: true },
  { id: 'relatorio_auditoria', label: 'Relatório de Auditoria Independente', required: false },
  { id: 'rg_cpf_socios', label: 'RG/CPF dos Sócios Administradores', required: true },
  { id: 'certidao_negativa', label: 'Certidão Negativa de Débitos (Federal, Estadual, Municipal)', required: true },
  { id: 'certidao_trabalhista', label: 'Certidão Negativa Trabalhista (TST)', required: true },
  { id: 'relatorio_endividamento', label: 'Relatório de Endividamento Atual', required: false },
];

export const DOCS_ESPECIFICOS: Record<string, DocItem[]> = {
  'Imobiliário': [
    { id: 'matricula_imovel', label: 'Matrícula do Imóvel Atualizada', required: true },
    { id: 'laudo_avaliacao', label: 'Laudo de Avaliação (ABNT NBR 14653)', required: true },
    { id: 'habite_se', label: 'Habite-se / Alvará de Construção', required: false },
    { id: 'contrato_locacao', label: 'Contratos de Locação Vigentes', required: false },
    { id: 'cri_emitido', label: 'CRI / CRA Emitidos Anteriormente', required: false },
  ],
  'Agronegócio': [
    { id: 'car', label: 'CAR — Cadastro Ambiental Rural', required: true },
    { id: 'ccir', label: 'CCIR — Certificado de Cadastro de Imóvel Rural', required: true },
    { id: 'matricula_rural', label: 'Matrícula da Propriedade Rural', required: true },
    { id: 'contrato_comercializacao', label: 'Contratos de Comercialização / Off-take', required: false },
    { id: 'laudo_producao', label: 'Laudo Técnico de Produtividade', required: false },
    { id: 'seguro_rural', label: 'Apólice de Seguro Rural', required: false },
  ],
  'Energia Solar': [
    { id: 'licenca_instalacao', label: 'Licença de Instalação (LI)', required: true },
    { id: 'outorga_aneel', label: 'Outorga / Autorização ANEEL', required: true },
    { id: 'contrato_energia', label: 'PPA / Contrato de Venda de Energia', required: true },
    { id: 'estudo_irradiacao', label: 'Estudo de Irradiação Solar', required: false },
    { id: 'orcamento_epc', label: 'Orçamento EPC / Contrato de Construção', required: false },
    { id: 'conexao_distribuidora', label: 'Parecer de Acesso da Distribuidora', required: false },
  ],
  'Energia Eólica': [
    { id: 'licenca_previa', label: 'Licença Prévia / Instalação (LP/LI)', required: true },
    { id: 'outorga_aneel_eolica', label: 'Outorga / Autorização ANEEL', required: true },
    { id: 'ppa_eolico', label: 'PPA / Contrato de Venda de Energia', required: true },
    { id: 'estudo_ventos', label: 'Relatório de Medição de Ventos', required: false },
    { id: 'contrato_turbinas', label: 'Contrato de Fornecimento de Turbinas', required: false },
    { id: 'conexao_ons', label: 'Aprovação de Conexão ONS / Distribuidora', required: false },
  ],
  'Infraestrutura': [
    { id: 'contrato_concessao', label: 'Contrato de Concessão / PPP', required: true },
    { id: 'licencas_ambientais', label: 'Licenças Ambientais (LP, LI, LO)', required: true },
    { id: 'cronograma_obra', label: 'Cronograma Físico-Financeiro', required: true },
    { id: 'contrato_epc_infra', label: 'Contrato de EPC / Construção', required: false },
    { id: 'estudo_viabilidade', label: 'Estudo de Viabilidade Técnica e Econômica', required: false },
  ],
  'Transportes': [
    { id: 'antt_autorizacao', label: 'Autorização ANTT / ANAC / Autoridade Portuária', required: true },
    { id: 'contratos_frete', label: 'Contratos de Frete / Clientes Ancora', required: false },
    { id: 'inventario_frota', label: 'Inventário e Laudo de Avaliação da Frota', required: false },
    { id: 'seguro_operacional', label: 'Apólice de Seguro Operacional', required: false },
  ],
  'Data Center': [
    { id: 'tier_certificacao', label: 'Certificação Tier (Uptime Institute)', required: false },
    { id: 'contratos_colocation', label: 'Contratos de Colocation / Hyperscalers', required: true },
    { id: 'lgpd_politica', label: 'Política de Privacidade e Conformidade LGPD', required: true },
    { id: 'redundancia_energia', label: 'Laudo Técnico de Redundância Elétrica/Cooling', required: false },
  ],
  'Telecom': [
    { id: 'licenca_anatel', label: 'Licença ANATEL (SCM / SMP / SRA)', required: true },
    { id: 'plano_expansao', label: 'Plano de Expansão de Rede', required: false },
    { id: 'mapa_cobertura', label: 'Mapa de Cobertura Atual', required: false },
    { id: 'contratos_b2b', label: 'Contratos B2B Âncora', required: false },
  ],
  'Varejo': [
    { id: 'carteira_recebiveis', label: 'Relatório de Carteira de Recebíveis', required: true },
    { id: 'historico_inadimplencia', label: 'Histórico de Inadimplência (24 meses)', required: true },
    { id: 'contratos_locacao_pv', label: 'Contratos de Locação dos Pontos de Venda', required: false },
    { id: 'gestao_estoque', label: 'Relatório de Gestão de Estoque', required: false },
  ],
  'Criptoeconomia': [
    { id: 'smart_contract_audit', label: 'Relatório de Auditoria de Smart Contracts', required: true },
    { id: 'politica_kyc_aml', label: 'Política de KYC/AML', required: true },
    { id: 'licenca_bacen', label: 'Licença Banco Central (se aplicável)', required: false },
    { id: 'whitepaper', label: 'Whitepaper / Documentação do Protocolo', required: false },
    { id: 'custodia_ativos', label: 'Política de Custódia de Ativos Digitais', required: true },
  ],
  'Serviços': [
    { id: 'contratos_servico', label: 'Contratos de Prestação de Serviços Vigentes', required: true },
    { id: 'backlog_receita', label: 'Backlog de Receita Contratada', required: false },
    { id: 'quadro_funcionarios', label: 'Quadro de Funcionários e Folha de Pagamento', required: false },
  ],
  'Outro': [
    { id: 'descricao_projeto', label: 'Memorando Descritivo do Projeto', required: true },
    { id: 'garantias_ofertadas', label: 'Inventário de Garantias Ofertadas', required: true },
    { id: 'plano_negocios', label: 'Plano de Negócios', required: false },
  ],
};
