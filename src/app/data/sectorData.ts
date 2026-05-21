export interface SectorRisk {
  label: string;
  lvl: 'high' | 'med' | 'low';
  pct: number;
  desc: string;
}

export interface SectorData {
  risks: SectorRisk[];
  investors: string[];
  radarData: number[];
  radarLabels: string[];
}

export const RADAR_LABELS = ['Mercado', 'Crédito', 'Regulatório', 'Liquidez', 'Execução', 'Jurídico/Outro'];

export const SECTOR_DATA: Record<string, SectorData> = {
  'Imobiliário': {
    radarLabels: RADAR_LABELS,
    radarData: [65, 55, 30, 50, 35, 25],
    risks: [
      { label: 'Risco de mercado',    lvl: 'med', pct: 65, desc: 'Variação de preços de ativos imobiliários e taxas de juros' },
      { label: 'Risco de crédito',    lvl: 'med', pct: 55, desc: 'Inadimplência dos recebíveis imobiliários' },
      { label: 'Risco regulatório',   lvl: 'low', pct: 30, desc: 'Mudanças nas normas do SFI e ABECIP' },
      { label: 'Risco de liquidez',   lvl: 'med', pct: 50, desc: 'Mercado secundário de CRI ainda em desenvolvimento' },
      { label: 'Risco de execução',   lvl: 'low', pct: 35, desc: 'Complexidade de projetos de construção civil' },
      { label: 'Risco jurídico',      lvl: 'low', pct: 25, desc: 'Segurança do regime fiduciário e patrimônio separado' },
    ],
    investors: ['FII Residencial', 'FIAGRO-Imob', 'Fundos de Pensão', 'Family Offices', 'Gestoras de Crédito Privado'],
  },
  'Agronegócio': {
    radarLabels: RADAR_LABELS,
    radarData: [80, 75, 35, 55, 40, 30],
    risks: [
      { label: 'Risco climático',       lvl: 'high', pct: 80, desc: 'Exposição a eventos climáticos extremos e safras' },
      { label: 'Risco de commodities',  lvl: 'high', pct: 75, desc: 'Volatilidade internacional de preços agrícolas' },
      { label: 'Risco regulatório',     lvl: 'low',  pct: 35, desc: 'Legislação ambiental e licenças agrícolas' },
      { label: 'Risco de liquidez',     lvl: 'med',  pct: 55, desc: 'Sazonalidade das safras' },
      { label: 'Risco de execução',     lvl: 'low',  pct: 40, desc: 'Logística e escoamento da produção' },
      { label: 'Risco de câmbio',       lvl: 'med',  pct: 65, desc: 'Exportações e dívidas dolarizadas' },
    ],
    investors: ['FIAGRO', 'Fundos de Renda Fixa', 'Gestoras Especializadas', 'Investidores Institucionais', 'Cooperativas de Crédito'],
  },
  'Energia Solar': {
    radarLabels: RADAR_LABELS,
    radarData: [30, 60, 55, 35, 35, 25],
    risks: [
      { label: 'Risco de irradiação',        lvl: 'low', pct: 30, desc: 'Variação de irradiação solar e eficiência dos painéis' },
      { label: 'Risco de crédito (off-taker)', lvl: 'med', pct: 60, desc: 'Capacidade de pagamento do comprador de energia' },
      { label: 'Risco regulatório',           lvl: 'med', pct: 55, desc: 'Mudanças na regulação da ANEEL e incentivos' },
      { label: 'Risco de liquidez',           lvl: 'low', pct: 35, desc: 'Mercado secundário de debêntures verdes' },
      { label: 'Risco de execução',           lvl: 'low', pct: 35, desc: 'Cronograma de instalação e comissionamento' },
      { label: 'Risco tecnológico',           lvl: 'low', pct: 25, desc: 'Obsolescência e desempenho dos equipamentos' },
    ],
    investors: ['Fundos de Infraestrutura', 'BNDES', 'Gestoras ESG', 'Family Offices', 'Debenturistas Incentivados'],
  },
  'Energia Eólica': {
    radarLabels: RADAR_LABELS,
    radarData: [35, 60, 55, 40, 40, 25],
    risks: [
      { label: 'Risco de ventos',             lvl: 'low', pct: 35, desc: 'Variação de regime de ventos e capacity factor' },
      { label: 'Risco de crédito (off-taker)', lvl: 'med', pct: 60, desc: 'Capacidade de pagamento do comprador de energia' },
      { label: 'Risco regulatório',           lvl: 'med', pct: 55, desc: 'Regulação da ANEEL e leilões de energia' },
      { label: 'Risco de liquidez',           lvl: 'med', pct: 40, desc: 'Mercado secundário de debêntures de infraestrutura' },
      { label: 'Risco de execução',           lvl: 'med', pct: 40, desc: 'Logística de transporte e montagem de turbinas' },
      { label: 'Risco ambiental',             lvl: 'low', pct: 25, desc: 'Licenças ambientais e impacto na fauna local' },
    ],
    investors: ['Fundos de Infraestrutura', 'BNDES', 'Gestoras ESG', 'Fundos de Pensão', 'Debenturistas Incentivados'],
  },
  'Infraestrutura': {
    radarLabels: RADAR_LABELS,
    radarData: [55, 50, 60, 45, 65, 40],
    risks: [
      { label: 'Risco de mercado',    lvl: 'med',  pct: 55, desc: 'Variação de demanda e tarifas de concessão' },
      { label: 'Risco de crédito',    lvl: 'med',  pct: 50, desc: 'Capacidade fiscal do poder concedente' },
      { label: 'Risco regulatório',   lvl: 'med',  pct: 60, desc: 'Alterações em contratos de concessão e PPP' },
      { label: 'Risco de liquidez',   lvl: 'med',  pct: 45, desc: 'Prazo longo das concessões e liquidez secundária' },
      { label: 'Risco de execução',   lvl: 'high', pct: 65, desc: 'Complexidade de obras e atrasos em grandes projetos' },
      { label: 'Risco jurídico',      lvl: 'med',  pct: 40, desc: 'Litígios contratuais e rescisões de concessão' },
    ],
    investors: ['Fundos de Infraestrutura', 'BNDES', 'Fundos de Pensão', 'Soberanos Internacionais', 'Gestoras Especializadas'],
  },
  'Transportes': {
    radarLabels: RADAR_LABELS,
    radarData: [60, 55, 50, 50, 60, 35],
    risks: [
      { label: 'Risco de demanda',    lvl: 'med',  pct: 60, desc: 'Variação de volumes e ciclos econômicos' },
      { label: 'Risco de crédito',    lvl: 'med',  pct: 55, desc: 'Inadimplência de embarcadores e clientes' },
      { label: 'Risco regulatório',   lvl: 'med',  pct: 50, desc: 'Regulação do setor de transportes e ANTT' },
      { label: 'Risco de liquidez',   lvl: 'med',  pct: 50, desc: 'Concentração de receita em poucos clientes' },
      { label: 'Risco de execução',   lvl: 'high', pct: 60, desc: 'Manutenção de frota e infraestrutura logística' },
      { label: 'Risco jurídico',      lvl: 'low',  pct: 35, desc: 'Passivos trabalhistas e regulatórios do setor' },
    ],
    investors: ['Fundos de Crédito Privado', 'FIDCs', 'Gestoras Especializadas', 'Family Offices'],
  },
  'Data Center': {
    radarLabels: RADAR_LABELS,
    radarData: [40, 50, 45, 40, 50, 20],
    risks: [
      { label: 'Risco tecnológico',   lvl: 'med', pct: 40, desc: 'Obsolescência de infraestrutura e equipamentos' },
      { label: 'Risco de crédito',    lvl: 'med', pct: 50, desc: 'Dependência de contratos de longo prazo (colocation)' },
      { label: 'Risco regulatório',   lvl: 'med', pct: 45, desc: 'Regulação de dados (LGPD) e conformidade setorial' },
      { label: 'Risco de liquidez',   lvl: 'med', pct: 40, desc: 'Alta intensidade de capital e payback longo' },
      { label: 'Risco de execução',   lvl: 'med', pct: 50, desc: 'Prazo de construção e uptime dos sistemas críticos' },
      { label: 'Risco jurídico',      lvl: 'low', pct: 20, desc: 'Contratos de SLA e responsabilidade de dados' },
    ],
    investors: ['Fundos de Tecnologia', 'FIDCs', 'Gestoras de Crédito Privado', 'Investidores Internacionais'],
  },
  'Telecom': {
    radarLabels: RADAR_LABELS,
    radarData: [50, 55, 65, 45, 45, 30],
    risks: [
      { label: 'Risco de mercado',    lvl: 'med',  pct: 50, desc: 'Competição intensa e compressão de margens' },
      { label: 'Risco de crédito',    lvl: 'med',  pct: 55, desc: 'Inadimplência de clientes B2B e B2C' },
      { label: 'Risco regulatório',   lvl: 'high', pct: 65, desc: 'Regulação da ANATEL e obrigações de cobertura' },
      { label: 'Risco de liquidez',   lvl: 'med',  pct: 45, desc: 'Alto Capex e longos ciclos de retorno' },
      { label: 'Risco de execução',   lvl: 'med',  pct: 45, desc: 'Implantação de redes 5G e expansão de cobertura' },
      { label: 'Risco jurídico',      lvl: 'low',  pct: 30, desc: 'Litígios regulatórios e penalidades da ANATEL' },
    ],
    investors: ['Fundos de Infraestrutura', 'Gestoras Especializadas', 'Fundos de Pensão', 'Family Offices'],
  },
  'Varejo': {
    radarLabels: RADAR_LABELS,
    radarData: [70, 65, 40, 60, 45, 30],
    risks: [
      { label: 'Risco de mercado',    lvl: 'high', pct: 70, desc: 'Alta sensibilidade ao ciclo econômico e consumo' },
      { label: 'Risco de crédito',    lvl: 'high', pct: 65, desc: 'Inadimplência no crediário e carteira de recebíveis' },
      { label: 'Risco regulatório',   lvl: 'med',  pct: 40, desc: 'Regulação tributária e fiscal do setor' },
      { label: 'Risco de liquidez',   lvl: 'high', pct: 60, desc: 'Sazonalidade e concentração em datas comemorativas' },
      { label: 'Risco de execução',   lvl: 'med',  pct: 45, desc: 'Gestão de estoque e cadeia de suprimentos' },
      { label: 'Risco jurídico',      lvl: 'low',  pct: 30, desc: 'Passivos de relações de consumo e trabalhistas' },
    ],
    investors: ['FIDCs de Recebíveis', 'Fundos Multimercado', 'Gestoras de Crédito Privado', 'Investidores Qualificados'],
  },
  'Criptoeconomia': {
    radarLabels: RADAR_LABELS,
    radarData: [90, 70, 80, 85, 55, 60],
    risks: [
      { label: 'Risco de mercado',    lvl: 'high', pct: 90, desc: 'Extrema volatilidade de preços de criptoativos' },
      { label: 'Risco de crédito',    lvl: 'high', pct: 70, desc: 'Ausência de garantias tradicionais e histórico curto' },
      { label: 'Risco regulatório',   lvl: 'high', pct: 80, desc: 'Marco regulatório em formação no Brasil e exterior' },
      { label: 'Risco de liquidez',   lvl: 'high', pct: 85, desc: 'Mercados com profundidade limitada fora de BTC/ETH' },
      { label: 'Risco de execução',   lvl: 'med',  pct: 55, desc: 'Segurança de smart contracts e custódia de ativos' },
      { label: 'Risco jurídico',      lvl: 'high', pct: 60, desc: 'Incerteza jurídica e enquadramento tributário' },
    ],
    investors: ['Fundos de Venture Capital', 'Family Offices Tech', 'Investidores Qualificados', 'Gestoras Especializadas em DeFi'],
  },
  'Serviços': {
    radarLabels: RADAR_LABELS,
    radarData: [55, 60, 40, 50, 35, 30],
    risks: [
      { label: 'Risco de mercado',    lvl: 'med', pct: 55, desc: 'Sensibilidade ao ciclo econômico e concorrência' },
      { label: 'Risco de crédito',    lvl: 'med', pct: 60, desc: 'Concentração de receita em poucos clientes' },
      { label: 'Risco regulatório',   lvl: 'med', pct: 40, desc: 'Regulação setorial e tributação de serviços' },
      { label: 'Risco de liquidez',   lvl: 'med', pct: 50, desc: 'Capital de giro e sazonalidade de contratos' },
      { label: 'Risco de execução',   lvl: 'low', pct: 35, desc: 'Dependência de capital humano e churn de equipes' },
      { label: 'Risco jurídico',      lvl: 'low', pct: 30, desc: 'Passivos trabalhistas e disputas contratuais' },
    ],
    investors: ['Gestoras de Crédito Privado', 'Fundos Multimercado', 'Family Offices', 'Investidores Qualificados'],
  },
  'Outro': {
    radarLabels: RADAR_LABELS,
    radarData: [55, 60, 40, 50, 35, 30],
    risks: [
      { label: 'Risco de mercado',    lvl: 'med', pct: 55, desc: 'Exposição às condições macroeconômicas' },
      { label: 'Risco de crédito',    lvl: 'med', pct: 60, desc: 'Capacidade de pagamento do tomador' },
      { label: 'Risco regulatório',   lvl: 'med', pct: 40, desc: 'Mudanças normativas setoriais' },
      { label: 'Risco de liquidez',   lvl: 'med', pct: 50, desc: 'Disponibilidade de recursos no setor' },
      { label: 'Risco de execução',   lvl: 'low', pct: 35, desc: 'Complexidade operacional do projeto' },
      { label: 'Risco jurídico',      lvl: 'low', pct: 30, desc: 'Segurança jurídica das garantias' },
    ],
    investors: ['Gestoras de Crédito Privado', 'Fundos Multimercado', 'Investidores Qualificados', 'Family Offices'],
  },
};
