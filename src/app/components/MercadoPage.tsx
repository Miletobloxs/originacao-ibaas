import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, TooltipProps
} from 'recharts';
import { PageHeader, KPICard, Card, CardHeader, CardBody, Badge } from './ds';

// ─── DATA ────────────────────────────────────────────────────────────────────

const INDICADORES = [
  {
    label: 'Selic',
    value: '14,75%',
    subtitle: 'a.a. — Copom abr/26',
    icon: <i className="fas fa-landmark text-[11px]" />,
    trend: 'neutral' as const,
    trendValue: 'Estável',
  },
  {
    label: 'CDI',
    value: '14,65%',
    subtitle: 'a.a.',
    icon: <i className="fas fa-percentage text-[11px]" />,
    trend: 'neutral' as const,
    trendValue: 'Estável',
  },
  {
    label: 'IPCA',
    value: '5,48%',
    subtitle: 'acumulado 12 meses',
    icon: <i className="fas fa-chart-line text-[11px]" />,
    trend: 'down' as const,
    trendValue: '–0,12 p.p.',
  },
  {
    label: 'IHFA (ANBIMA)',
    value: 'CDI+4,2%',
    subtitle: 'spread médio crédito privado',
    icon: <i className="fas fa-chart-bar text-[11px]" />,
    trend: 'up' as const,
    trendValue: '+0,3 p.p.',
  },
];

const EMISSOES = [
  { mes: 'Jan', CRI: 12, CRA: 8,  Debêntures: 20 },
  { mes: 'Fev', CRI: 15, CRA: 10, Debêntures: 22 },
  { mes: 'Mar', CRI: 18, CRA: 12, Debêntures: 25 },
  { mes: 'Abr', CRI: 14, CRA: 9,  Debêntures: 18 },
  { mes: 'Mai', CRI: 20, CRA: 14, Debêntures: 28 },
  { mes: 'Jun', CRI: 22, CRA: 16, Debêntures: 30 },
];

interface Noticia {
  title: string;
  url: string;
  source: string;
  sourceBadge: 'anbima' | 'cvm' | 'valor' | 'infomoney';
  date: string;
}

const NOTICIAS: Noticia[] = [
  {
    title: 'ANBIMA e B3 reúnem líderes para debater evolução do mercado de capitais no MKBR 26',
    url: 'https://www.anbima.com.br/pt_br/noticias/anbima-e-b3-reunem-lideres-para-debater-evolucao-e-oportunidades-para-o-mercado-de-capitais-brasileiro-no-mkbr-26.htm',
    source: 'ANBIMA', sourceBadge: 'anbima', date: '07/04/2026',
  },
  {
    title: 'Gestoras de crédito privado lideram crescimento da indústria de fundos',
    url: 'https://www.anbima.com.br/pt_br/noticias/gestoras-de-credito-privado-lideram-crescimento-da-industria-de-fundos.htm',
    source: 'ANBIMA', sourceBadge: 'anbima', date: '2026',
  },
  {
    title: 'O jogo de sedução do crédito privado está mais arriscado',
    url: 'https://valor.globo.com/financas/noticia/2026/03/19/o-jogo-de-seducao-do-credito-privado-esta-mais-arriscado.ghtml',
    source: 'Valor Econômico', sourceBadge: 'valor', date: '19/03/2026',
  },
  {
    title: 'Mercado de capitais ocupa espaço do BNDES no crédito',
    url: 'https://valor.globo.com/financas/noticia/2026/02/11/mercado-de-capitais-ocupa-espaco-do-bndes-no-credito.ghtml',
    source: 'Valor Econômico', sourceBadge: 'valor', date: '11/02/2026',
  },
  {
    title: 'Resgates em fundos de crédito privado aceleram nos primeiros dias de abril',
    url: 'https://www.infomoney.com.br/onde-investir/resgates-em-fundos-de-credito-privado-aceleram-nos-primeiros-dias-de-abril/',
    source: 'InfoMoney', sourceBadge: 'infomoney', date: 'Abril/2026',
  },
  {
    title: 'Cautela do investidor favorece renda fixa de menores prazos no Q1 2026',
    url: 'https://www.anbima.com.br/pt_br/noticias/cautela-do-investidor-favorece-renda-fixa-de-menores-prazos-no-primeiro-trimestre-de-2026.htm',
    source: 'ANBIMA', sourceBadge: 'anbima', date: '18/03/2026',
  },
];

const SOURCE_STYLE: Record<string, { bg: string; text: string }> = {
  anbima:    { bg: '#dbeafe', text: '#1d4ed8' },
  cvm:       { bg: '#0b1f3a', text: '#ffffff' },
  valor:     { bg: '#f1f5f9', text: '#475569' },
  infomoney: { bg: '#d1fae5', text: '#065f46' },
};

const SPREADS = [
  { instrumento: 'CRI',            benchmark: 'CDI+',   spread: '3,5%',  prazo: '5–12 anos', rating: 'AA',  delta: 'neutral' },
  { instrumento: 'CRA',            benchmark: 'CDI+',   spread: '4,0%',  prazo: '5–10 anos', rating: 'A+',  delta: 'up' },
  { instrumento: 'FIDC',           benchmark: 'CDI+',   spread: '4,5%',  prazo: '3–5 anos',  rating: 'A',   delta: 'up' },
  { instrumento: 'Debênture',      benchmark: 'IPCA+',  spread: '7,2%',  prazo: '5–10 anos', rating: 'AA–', delta: 'neutral' },
  { instrumento: 'Nota Comercial', benchmark: 'CDI+',   spread: '5,0%',  prazo: '1–3 anos',  rating: 'A–',  delta: 'down' },
];

const AGENDA = [
  { data: '07/05/2026', evento: 'COPOM — Decisão de juros',      relevancia: 'alta' },
  { data: '09/05/2026', evento: 'IPCA — Divulgação de abril',    relevancia: 'alta' },
  { data: '12/05/2026', evento: 'Reunião ANBIMA — Emissões Q1',  relevancia: 'media' },
  { data: '16/05/2026', evento: 'IGP-M — Prévia de maio',        relevancia: 'media' },
  { data: '20/05/2026', evento: 'Ata do COPOM',                  relevancia: 'alta' },
  { data: '28/05/2026', evento: 'PIB — 1º trimestre 2026',       relevancia: 'media' },
];

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-lg)] shadow-[var(--bloxs-shadow-xl)] px-4 py-3 text-[12px]">
      <div className="font-semibold text-[var(--bloxs-navy)] mb-2">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill as string }} />
          <span className="text-[var(--bloxs-gray-500)]">{p.name}:</span>
          <span className="font-semibold text-[var(--bloxs-navy)]">R$ {p.value} Bi</span>
        </div>
      ))}
    </div>
  );
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function MercadoPage() {
  return (
    <div>
      <PageHeader
        breadcrumb="Resumo de Mercado"
        title="Inteligência de Mercado"
        subtitle="Indicadores, notícias e dados atualizados do mercado de capitais e crédito privado."
        action={
          <div className="flex items-center gap-2 text-[var(--bloxs-text-xs)] text-[var(--bloxs-text-muted)] mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--bloxs-success)] inline-block animate-pulse" />
            Atualizado em 23/04/2026 às 09:00
          </div>
        }
      />

      {/* KPI BAR */}
      <div className="grid grid-cols-4 gap-4 mb-6 max-lg:grid-cols-2">
        {INDICADORES.map((ind, i) => (
          <KPICard
            key={i}
            label={ind.label}
            value={ind.value}
            subtitle={ind.subtitle}
            icon={ind.icon}
            trend={ind.trend}
            trendValue={ind.trendValue}
          />
        ))}
      </div>

      {/* EMISSÕES + NOTÍCIAS */}
      <div className="grid grid-cols-2 gap-5 mb-5 max-lg:grid-cols-1">

        {/* Emissões chart */}
        <Card padding="none" hover>
          <CardHeader icon={<i className="fas fa-chart-bar" />}>
            Emissões de crédito privado — 2026
            <span className="ml-auto text-[var(--bloxs-text-xs)] font-normal text-[var(--bloxs-text-muted)]">
              R$ Bilhões
            </span>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={EMISSOES} barSize={18} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="var(--bloxs-gray-100)" />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: 'var(--bloxs-gray-500)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--bloxs-gray-400)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}`}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(241,245,249,0.8)' }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: 'var(--bloxs-gray-600)', paddingTop: 12 }}
                />
                <Bar dataKey="CRI"        stackId="a" fill="#0b1f3a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="CRA"        stackId="a" fill="#1a6edb" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Debêntures" stackId="a" fill="#4fa3ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Notícias */}
        <Card padding="none" hover>
          <CardHeader
            icon={<i className="fas fa-newspaper" />}
            action={
              <span className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-text-muted)]">
                Fontes verificadas · 23/04/2026
              </span>
            }
          >
            Notícias recentes
          </CardHeader>
          <CardBody padding="sm">
            <div className="divide-y divide-[var(--bloxs-border)]">
              {NOTICIAS.map((n, i) => (
                <NoticiaItem key={i} noticia={n} />
              ))}
            </div>
          </CardBody>
        </Card>

      </div>

      {/* SPREADS + AGENDA */}
      <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">

        {/* Spreads por instrumento */}
        <Card padding="none" hover>
          <CardHeader icon={<i className="fas fa-sliders-h" />}>
            Spreads por instrumento
            <span className="ml-auto text-[var(--bloxs-text-xs)] font-normal text-[var(--bloxs-text-muted)]">
              Mercado secundário · Abr/26
            </span>
          </CardHeader>
          <CardBody padding="sm">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="text-[var(--bloxs-text-xs)] font-semibold tracking-[0.07em] uppercase text-[var(--bloxs-gray-400)]">
                  <th className="text-left px-4 py-2.5 font-semibold">Instrumento</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Spread atual</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Prazo</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Rating mín.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bloxs-border)]">
                {SPREADS.map((s, i) => (
                  <tr key={i} className="hover:bg-[var(--bloxs-gray-50)] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[var(--bloxs-navy)]">
                      {s.instrumento}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-[var(--bloxs-navy)]">{s.benchmark}</span>
                      <span className="text-[var(--bloxs-blue)] font-bold">{s.spread}</span>
                      {s.delta !== 'neutral' && (
                        <i
                          className={`fas fa-arrow-${s.delta === 'up' ? 'up' : 'down'} text-[10px] ml-1.5 ${
                            s.delta === 'up' ? 'text-[var(--bloxs-warning)]' : 'text-[var(--bloxs-success)]'
                          }`}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--bloxs-text-muted)]">
                      {s.prazo}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant="gray" size="sm">{s.rating}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        {/* Agenda econômica */}
        <Card padding="none" hover>
          <CardHeader icon={<i className="fas fa-calendar-alt" />}>
            Agenda econômica
            <span className="ml-auto text-[var(--bloxs-text-xs)] font-normal text-[var(--bloxs-text-muted)]">
              Próximos 30 dias
            </span>
          </CardHeader>
          <CardBody padding="sm">
            <div className="divide-y divide-[var(--bloxs-border)]">
              {AGENDA.map((ev, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3.5 hover:bg-[var(--bloxs-gray-50)] transition-colors">
                  <div className="w-[88px] flex-shrink-0">
                    <div className="text-[var(--bloxs-text-xs)] font-semibold text-[var(--bloxs-blue)] uppercase tracking-[0.07em]">
                      {ev.data.split('/').slice(0, 2).join('/')}
                    </div>
                    <div className="text-[10px] text-[var(--bloxs-text-muted)]">
                      {ev.data.split('/')[2]}
                    </div>
                  </div>
                  <div className="flex-1 text-[12.5px] font-medium text-[var(--bloxs-navy)]">
                    {ev.evento}
                  </div>
                  <div className="flex-shrink-0">
                    <Badge
                      variant={
                        ev.relevancia === 'alta' ? 'error'
                        : ev.relevancia === 'media' ? 'warning'
                        : 'gray'
                      }
                      size="sm"
                    >
                      {ev.relevancia === 'alta' ? 'Alta' : ev.relevancia === 'media' ? 'Média' : 'Baixa'}
                    </Badge>
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

// ─── NEWS ITEM ────────────────────────────────────────────────────────────────

function NoticiaItem({ noticia }: { noticia: Noticia }) {
  const style = SOURCE_STYLE[noticia.sourceBadge];
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 hover:bg-[var(--bloxs-gray-50)] transition-colors group">
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 whitespace-nowrap"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {noticia.source}
      </span>
      <div className="flex-1 min-w-0">
        <a
          href={noticia.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12.5px] font-medium text-[var(--bloxs-navy)] leading-snug hover:text-[var(--bloxs-blue)] transition-colors line-clamp-2 block"
        >
          {noticia.title}
        </a>
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[var(--bloxs-text-muted)]">
          <span>{noticia.date}</span>
          <span>·</span>
          <a
            href={noticia.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--bloxs-blue)] hover:underline flex items-center gap-1 transition-opacity opacity-0 group-hover:opacity-100"
          >
            <i className="fas fa-external-link-alt text-[10px]" />
            Ver fonte
          </a>
        </div>
      </div>
    </div>
  );
}
