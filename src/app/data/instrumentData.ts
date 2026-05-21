export interface Instrument {
  id: string;
  label: string;
  desc: string;
  tag: string;
  suitableSectors: string[];
  minVolume: number;
  maxVolume: number;
}

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'cri',
    label: 'CRI',
    desc: 'Certificado de Recebíveis Imobiliários — regime fiduciário com patrimônio separado',
    tag: 'Renda Fixa',
    suitableSectors: ['Imobiliário'],
    minVolume: 10_000_000,
    maxVolume: 500_000_000,
  },
  {
    id: 'cra',
    label: 'CRA',
    desc: 'Certificado de Recebíveis do Agronegócio — lastro em CPR, duplicatas rurais ou recebíveis',
    tag: 'Renda Fixa',
    suitableSectors: ['Agronegócio'],
    minVolume: 10_000_000,
    maxVolume: 300_000_000,
  },
  {
    id: 'debenture_incentivada',
    label: 'Debênture Incentivada',
    desc: 'Debênture de Infraestrutura (Lei 12.431) — isenção de IR para PF, captação de longo prazo',
    tag: 'Infraestrutura',
    suitableSectors: ['Energia Solar', 'Energia Eólica', 'Infraestrutura', 'Transportes', 'Telecom'],
    minVolume: 30_000_000,
    maxVolume: 1_000_000_000,
  },
  {
    id: 'debenture_simples',
    label: 'Debênture Simples',
    desc: 'Instrumento de dívida corporativa flexível, sem incentivo fiscal, para qualquer setor',
    tag: 'Dívida Corporativa',
    suitableSectors: ['Varejo', 'Serviços', 'Data Center', 'Criptoeconomia', 'Outro'],
    minVolume: 5_000_000,
    maxVolume: 200_000_000,
  },
  {
    id: 'fidc',
    label: 'FIDC',
    desc: 'Fundo de Investimento em Direitos Creditórios — securitização de recebíveis com tranches',
    tag: 'Securitização',
    suitableSectors: ['Varejo', 'Serviços', 'Agronegócio', 'Transportes', 'Imobiliário'],
    minVolume: 20_000_000,
    maxVolume: 500_000_000,
  },
  {
    id: 'cce_nce',
    label: 'CCE / NCE',
    desc: 'Cédula/Nota de Crédito à Exportação — indicada para empresas exportadoras',
    tag: 'Crédito Estruturado',
    suitableSectors: ['Agronegócio', 'Infraestrutura', 'Outro'],
    minVolume: 5_000_000,
    maxVolume: 300_000_000,
  },
  {
    id: 'fii',
    label: 'FII',
    desc: 'Fundo de Investimento Imobiliário — veículo de equity ou dívida para ativos imobiliários',
    tag: 'Fundo',
    suitableSectors: ['Imobiliário'],
    minVolume: 50_000_000,
    maxVolume: 2_000_000_000,
  },
  {
    id: 'fiagro',
    label: 'FIAGRO',
    desc: 'Fundo de Investimento nas Cadeias Produtivas Agroindustriais',
    tag: 'Fundo',
    suitableSectors: ['Agronegócio'],
    minVolume: 30_000_000,
    maxVolume: 500_000_000,
  },
];

export const COMMISSION_RATES: Record<string, number> = {
  cri: 0.018,
  cra: 0.018,
  debenture_incentivada: 0.015,
  debenture_simples: 0.020,
  fidc: 0.022,
  cce_nce: 0.016,
  fii: 0.020,
  fiagro: 0.019,
};

export function suggestInstruments(sector: string, volumeM: number): string[] {
  return INSTRUMENTS.filter(
    (inst) =>
      inst.suitableSectors.includes(sector) &&
      volumeM * 1_000_000 >= inst.minVolume &&
      volumeM * 1_000_000 <= inst.maxVolume
  ).map((i) => i.id);
}
