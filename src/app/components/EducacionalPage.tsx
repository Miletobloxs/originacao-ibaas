import { useState } from 'react';
import { PageHeader, Card, CardHeader, CardBody, Badge, Button, InfoBox } from './ds';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Categoria = 'Fundamentos' | 'Instrumentos' | 'Intermediários' | 'Mercado' | 'IBaaS';
type Nivel = 'Básico' | 'Intermediário' | 'Avançado';

interface Video {
  id: string;
  titulo: string;
  categoria: Categoria;
  duracao: string;
  nivel: Nivel;
  descricao: string;
  assistido?: boolean;
  emProgresso?: boolean;
  progressoPct?: number;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const VIDEOS: Video[] = [
  // Fundamentos
  {
    id: 'v1',
    titulo: 'O que é um CRI? Estrutura, lastro e funcionamento',
    categoria: 'Fundamentos', duracao: '18:42', nivel: 'Básico',
    descricao: 'Entenda o Certificado de Recebíveis Imobiliários: como é estruturado, qual é o lastro e como funciona na prática.',
    assistido: true,
  },
  {
    id: 'v2',
    titulo: 'CRA: financiamento do agronegócio via mercado de capitais',
    categoria: 'Fundamentos', duracao: '22:15', nivel: 'Básico',
    descricao: 'O Certificado de Recebíveis do Agronegócio e seu papel como instrumento de captação para o setor.',
    assistido: true,
  },
  {
    id: 'v3',
    titulo: 'Debêntures: tipos, incentivos fiscais e estrutura de emissão',
    categoria: 'Fundamentos', duracao: '20:30', nivel: 'Básico',
    descricao: 'Da debênture simples à incentivada: quando usar cada tipo e como estruturar a emissão.',
    assistido: true,
  },
  // Instrumentos
  {
    id: 'v4',
    titulo: 'CR (Certificado de Recebíveis): o que mudou com a RCVM 60',
    categoria: 'Instrumentos', duracao: '15:30', nivel: 'Intermediário',
    descricao: 'A resolução RCVM 60 unificou os certificados de recebíveis. Entenda as mudanças e os impactos para originadores.',
    assistido: true,
    emProgresso: false,
  },
  {
    id: 'v5',
    titulo: 'FIDC: estrutura, cotas sênior e subordinada, e riscos',
    categoria: 'Instrumentos', duracao: '25:45', nivel: 'Intermediário',
    descricao: 'Como funciona um FIDC, a hierarquia de cotas, a figura do custodiante e os principais riscos da estrutura.',
    emProgresso: true,
    progressoPct: 42,
  },
  {
    id: 'v6',
    titulo: 'Notas Comerciais e CCB: diferenças e quando indicar',
    categoria: 'Instrumentos', duracao: '17:55', nivel: 'Intermediário',
    descricao: 'Comparação prática entre Nota Comercial e Cédula de Crédito Bancário — custos, prazos e perfil de emissores.',
  },
  // Intermediários
  {
    id: 'v7',
    titulo: 'O papel dos intermediários no mercado de capitais',
    categoria: 'Intermediários', duracao: '31:10', nivel: 'Intermediário',
    descricao: 'Coordenadores, agentes fiduciários, escrituradores, custodiantes: quem é quem em uma operação estruturada.',
  },
  {
    id: 'v8',
    titulo: 'Regulação CVM e ANBIMA: o que o originador precisa saber',
    categoria: 'Intermediários', duracao: '33:00', nivel: 'Avançado',
    descricao: 'Instrução CVM 160, RCVM 60, código ANBIMA para distribuição: as regras que todo originador deve dominar.',
  },
  // Mercado
  {
    id: 'v9',
    titulo: 'Spread de crédito: como ler, interpretar e usar no pitch',
    categoria: 'Mercado', duracao: '19:20', nivel: 'Intermediário',
    descricao: 'Entenda o que determina o spread de uma operação e como usar esse dado para embasar o seu pitch de venda.',
  },
  {
    id: 'v10',
    titulo: 'Resumo de mercado: crédito privado em 2026',
    categoria: 'Mercado', duracao: '28:05', nivel: 'Intermediário',
    descricao: 'Panorama do mercado de crédito privado no ano: volumes, spreads, setores em alta e perspectivas.',
  },
  // IBaaS
  {
    id: 'v11',
    titulo: 'Como montar seu IB alternativo com a plataforma Bloxs',
    categoria: 'IBaaS', duracao: '45:00', nivel: 'Avançado',
    descricao: 'Passo a passo completo para estruturar seu negócio de originação usando o IBaaS Bloxs como infraestrutura.',
  },
  {
    id: 'v12',
    titulo: 'Due diligence em operações estruturadas: checklist prático',
    categoria: 'IBaaS', duracao: '38:15', nivel: 'Avançado',
    descricao: 'O que analisar em cada fase de uma operação antes de submetê-la — do checklist jurídico ao financeiro.',
  },
];

const CATEGORIAS: Categoria[] = ['Fundamentos', 'Instrumentos', 'Intermediários', 'Mercado', 'IBaaS'];

const CATEGORY_META: Record<Categoria, { gradient: string; icon: string; badgeVariant: 'primary' | 'secondary' | 'gray' | 'warning' | 'success' }> = {
  Fundamentos:   { gradient: 'linear-gradient(135deg, #0b1f3a 0%, #1a6edb 100%)',   icon: 'fa-book-open',      badgeVariant: 'primary'   },
  Instrumentos:  { gradient: 'linear-gradient(135deg, #1a6edb 0%, #4fa3ff 100%)',   icon: 'fa-file-invoice',   badgeVariant: 'secondary' },
  Intermediários:{ gradient: 'linear-gradient(135deg, #132d54 0%, #2b7de9 100%)',   icon: 'fa-handshake',      badgeVariant: 'gray'      },
  Mercado:       { gradient: 'linear-gradient(135deg, #0b1f3a 0%, #059669 100%)',   icon: 'fa-chart-line',     badgeVariant: 'warning'   },
  IBaaS:         { gradient: 'linear-gradient(135deg, #1d4ed8 0%, #0b1f3a 100%)',   icon: 'fa-building',       badgeVariant: 'success'   },
};

const NIVEL_STYLE: Record<Nivel, string> = {
  'Básico':        'text-[var(--bloxs-success)] bg-[var(--bloxs-success-light)]',
  'Intermediário': 'text-[var(--bloxs-warning)] bg-[var(--bloxs-warning-light)]',
  'Avançado':      'text-[var(--bloxs-blue)]    bg-[var(--bloxs-blue-xxlight)]',
};

const TRILHA = [
  { nivel: 1, nome: 'Fundamentos',   categoria: 'Fundamentos'   as Categoria, total: 3, concluidos: 3, status: 'concluido'   as const },
  { nivel: 2, nome: 'Instrumentos',  categoria: 'Instrumentos'  as Categoria, total: 3, concluidos: 1, status: 'progresso'   as const },
  { nivel: 3, nome: 'Mercado',       categoria: 'Mercado'       as Categoria, total: 2, concluidos: 0, status: 'bloqueado'   as const },
  { nivel: 4, nome: 'IBaaS',         categoria: 'IBaaS'         as Categoria, total: 2, concluidos: 0, status: 'bloqueado'   as const },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function EducacionalPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | 'Todos'>('Todos');
  const [videoExpandido, setVideoExpandido] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<Video | null>(null);

  const videosFiltrados = categoriaAtiva === 'Todos'
    ? VIDEOS
    : VIDEOS.filter(v => v.categoria === categoriaAtiva);

  const totalAssistidos = VIDEOS.filter(v => v.assistido).length;
  const totalMinutos = VIDEOS.reduce((acc, v) => {
    const [m, s] = v.duracao.split(':').map(Number);
    return acc + m + s / 60;
  }, 0);
  const horasTotal = Math.floor(totalMinutos / 60);
  const minutosResto = Math.round(totalMinutos % 60);

  return (
    <div>
      <PageHeader
        breadcrumb="Educacional"
        title="Centro de Aprendizado"
        subtitle="Trilhas de conteúdo sobre instrumentos de crédito privado, operações estruturadas e como montar seu IB alternativo."
        action={
          <div className="flex items-center gap-1.5 mt-1 text-[var(--bloxs-text-xs)] text-[var(--bloxs-text-muted)]">
            <i className="fas fa-play-circle text-[var(--bloxs-blue)]" />
            {totalAssistidos} de {VIDEOS.length} aulas assistidas
          </div>
        }
      />

      {/* STATS INLINE */}
      <div className="flex items-center gap-6 mb-6 flex-wrap">
        {[
          { icon: 'fa-layer-group',  label: `${CATEGORIAS.length} categorias`                  },
          { icon: 'fa-play-circle',  label: `${VIDEOS.length} aulas`                            },
          { icon: 'fa-clock',        label: `${horasTotal}h ${minutosResto}min de conteúdo`      },
          { icon: 'fa-check-circle', label: `${totalAssistidos} aulas concluídas`, highlight: true },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-2 text-[13px] ${s.highlight ? 'text-[var(--bloxs-success)] font-semibold' : 'text-[var(--bloxs-text-muted)]'}`}>
            <i className={`fas ${s.icon} text-[12px]`} />
            {s.label}
            {i < 3 && <span className="ml-4 text-[var(--bloxs-border)]">·</span>}
          </div>
        ))}
      </div>

      {/* TRILHA DE CERTIFICAÇÃO */}
      <Card padding="none" className="mb-6">
        <CardHeader
          icon={<i className="fas fa-route" />}
          action={
            <span className="text-[var(--bloxs-text-xs)] font-normal text-[var(--bloxs-text-muted)]">
              Trilha recomendada · Originador Bloxs IBaaS
            </span>
          }
        >
          Trilha de Certificação
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2">
            {TRILHA.map((etapa, i) => {
              const meta = CATEGORY_META[etapa.categoria];
              const pct = etapa.total > 0 ? Math.round((etapa.concluidos / etapa.total) * 100) : 0;
              const isConcluido = etapa.status === 'concluido';
              const isProgresso = etapa.status === 'progresso';
              const isBloqueado = etapa.status === 'bloqueado';
              return (
                <div
                  key={i}
                  className={`relative rounded-[var(--bloxs-radius-lg)] p-4 border transition-all ${
                    isBloqueado
                      ? 'border-[var(--bloxs-border)] bg-[var(--bloxs-gray-50)] opacity-60'
                      : isConcluido
                      ? 'border-[var(--bloxs-success)] bg-[var(--bloxs-success-light)]'
                      : 'border-[var(--bloxs-blue)] bg-[var(--bloxs-blue-xxlight)]'
                  }`}
                >
                  {/* Step number */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white mb-3"
                    style={{ background: isBloqueado ? 'var(--bloxs-gray-300)' : meta.gradient }}
                  >
                    {isConcluido ? <i className="fas fa-check text-[10px]" /> : etapa.nivel}
                  </div>

                  <div className="text-[12px] font-bold text-[var(--bloxs-navy)] mb-0.5">
                    Nível {etapa.nivel} — {etapa.nome}
                  </div>
                  <div className="text-[11px] text-[var(--bloxs-text-muted)] mb-3">
                    {etapa.total} aulas · {etapa.concluidos} concluídas
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-[var(--bloxs-gray-200)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: isConcluido ? 'var(--bloxs-success)' : isProgresso ? 'var(--bloxs-blue)' : 'var(--bloxs-gray-300)',
                      }}
                    />
                  </div>
                  <div className="mt-1.5 text-[10px] font-semibold text-[var(--bloxs-text-muted)]">
                    {isBloqueado ? (
                      <span className="flex items-center gap-1">
                        <i className="fas fa-lock text-[9px]" /> Bloqueado
                      </span>
                    ) : (
                      `${pct}% concluído`
                    )}
                  </div>

                  {/* Connector arrow */}
                  {i < TRILHA.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center bg-white border border-[var(--bloxs-border)] rounded-full text-[9px] text-[var(--bloxs-gray-400)] shadow-[var(--bloxs-shadow-xs)]">
                      <i className="fas fa-chevron-right" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* FILTRO DE CATEGORIAS */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {(['Todos', ...CATEGORIAS] as (Categoria | 'Todos')[]).map(cat => {
          const isActive = categoriaAtiva === cat;
          const meta = cat !== 'Todos' ? CATEGORY_META[cat] : null;
          return (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[var(--bloxs-radius-full)] text-[12.5px] font-semibold transition-all border ${
                isActive
                  ? 'bg-[var(--bloxs-navy)] text-white border-[var(--bloxs-navy)]'
                  : 'bg-white text-[var(--bloxs-gray-600)] border-[var(--bloxs-border)] hover:border-[var(--bloxs-navy)] hover:text-[var(--bloxs-navy)]'
              }`}
            >
              {meta && <i className={`fas ${meta.icon} text-[11px]`} />}
              {cat}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-[var(--bloxs-gray-100)] text-[var(--bloxs-gray-500)]'
              }`}>
                {cat === 'Todos' ? VIDEOS.length : VIDEOS.filter(v => v.categoria === cat).length}
              </span>
            </button>
          );
        })}
        <span className="ml-auto text-[12px] text-[var(--bloxs-text-muted)]">
          {videosFiltrados.length} aula{videosFiltrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* INFO BOX quando categoria selecionada */}
      {categoriaAtiva !== 'Todos' && (
        <div className="mb-5">
          <InfoBox
            variant="info"
            icon={<i className={`fas ${CATEGORY_META[categoriaAtiva].icon}`} />}
            title={categoriaAtiva}
          >
            {videosFiltrados.length} aula{videosFiltrados.length !== 1 ? 's' : ''} disponível{videosFiltrados.length !== 1 ? 'is' : ''} nessa categoria.
            {' '}
            {videosFiltrados.filter(v => v.assistido).length > 0 &&
              `${videosFiltrados.filter(v => v.assistido).length} já assistida${videosFiltrados.filter(v => v.assistido).length !== 1 ? 's' : ''}.`
            }
          </InfoBox>
        </div>
      )}

      {/* GRID DE VÍDEOS */}
      <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
        {videosFiltrados.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            expandido={videoExpandido === video.id}
            onExpandir={() => setVideoExpandido(videoExpandido === video.id ? null : video.id)}
            onPlay={() => setVideoModal(video)}
          />
        ))}
      </div>

      {/* MODAL DE VÍDEO */}
      {videoModal && (
        <VideoModal video={videoModal} onClose={() => setVideoModal(null)} />
      )}
    </div>
  );
}

// ─── VIDEO CARD ───────────────────────────────────────────────────────────────

function VideoCard({
  video,
  expandido,
  onExpandir,
  onPlay,
}: {
  video: Video;
  expandido: boolean;
  onExpandir: () => void;
  onPlay: () => void;
}) {
  const meta = CATEGORY_META[video.categoria];

  return (
    <div
      className={`bg-white border rounded-[var(--bloxs-radius-xl)] overflow-hidden transition-all hover:shadow-[var(--bloxs-shadow-lg)] ${
        expandido ? 'border-[var(--bloxs-blue)] shadow-[var(--bloxs-shadow-lg)]' : 'border-[var(--bloxs-border)]'
      } ${video.assistido ? 'opacity-80' : ''}`}
    >
      {/* THUMBNAIL */}
      <div
        className="relative h-[140px] flex items-center justify-center cursor-pointer select-none"
        style={{ background: meta.gradient }}
        onClick={onPlay}
      >
        {/* Category icon watermark */}
        <i
          className={`fas ${meta.icon} text-[56px] text-white/10 absolute`}
          style={{ bottom: 12, right: 16 }}
        />

        {/* Play / watched state */}
        {video.assistido ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
              <i className="fas fa-check text-white text-lg" />
            </div>
            <span className="text-white/80 text-[11px] font-medium">Assistido</span>
          </div>
        ) : video.emProgresso ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white flex items-center justify-center hover:bg-white/30 transition-all">
              <i className="fas fa-play text-white text-[18px] ml-0.5" />
            </div>
            <span className="text-white text-[11px] font-semibold">Em andamento</span>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center hover:bg-white/30 transition-all">
            <i className="fas fa-play text-white text-[18px] ml-0.5" />
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px] backdrop-blur-sm">
          {video.duracao}
        </div>

        {/* Nivel badge */}
        <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${NIVEL_STYLE[video.nivel]}`}>
          {video.nivel}
        </div>

        {/* Progress bar for in-progress */}
        {video.emProgresso && video.progressoPct !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${video.progressoPct}%` }}
            />
          </div>
        )}
      </div>

      {/* CARD BODY */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <Badge variant={meta.badgeVariant} size="sm">
            <i className={`fas ${meta.icon} text-[9px]`} />
            {video.categoria}
          </Badge>
          {video.assistido && (
            <Badge variant="success" size="sm">
              <i className="fas fa-check text-[9px]" /> Concluído
            </Badge>
          )}
          {video.emProgresso && (
            <Badge variant="primary" size="sm">
              <i className="fas fa-spinner text-[9px]" /> {video.progressoPct}%
            </Badge>
          )}
        </div>

        <h3
          className="text-[13.5px] font-semibold text-[var(--bloxs-navy)] leading-snug mb-2 cursor-pointer hover:text-[var(--bloxs-blue)] transition-colors line-clamp-2"
          onClick={onExpandir}
        >
          {video.titulo}
        </h3>

        {/* Expandable description */}
        {expandido && (
          <p className="text-[12.5px] text-[var(--bloxs-text-muted)] leading-relaxed mb-3">
            {video.descricao}
          </p>
        )}

        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[var(--bloxs-border)]">
          <span className="text-[11px] text-[var(--bloxs-text-muted)] flex items-center gap-1">
            <i className="fas fa-user-tie text-[10px]" />
            Equipe Bloxs
          </span>
          <Button
            variant={video.assistido ? 'outline' : video.emProgresso ? 'secondary' : 'ghost'}
            size="sm"
            onClick={onPlay}
            icon={
              <i className={`fas ${video.assistido ? 'fa-redo' : video.emProgresso ? 'fa-play' : 'fa-play-circle'} text-[10px]`} />
            }
          >
            {video.assistido ? 'Rever' : video.emProgresso ? 'Continuar' : 'Assistir'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── VIDEO MODAL ──────────────────────────────────────────────────────────────

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const meta = CATEGORY_META[video.categoria];
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(video.emProgresso ? (video.progressoPct ?? 0) : 0);
  const [elapsed, setElapsed] = useState(0);

  const [totalSec] = useState(() => {
    const [m, s] = video.duracao.split(':').map(Number);
    return m * 60 + s;
  });

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  function togglePlay() {
    if (playing) {
      setPlaying(false);
      return;
    }
    setPlaying(true);
    const tick = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        setProgress(Math.min(100, Math.round((next / totalSec) * 100)));
        if (next >= totalSec) { clearInterval(tick); setPlaying(false); }
        return next;
      });
    }, 1000);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[700]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] bg-white rounded-2xl shadow-2xl z-[800] overflow-hidden max-w-[95vw]">

        {/* Player area */}
        <div
          className="relative h-[360px] flex flex-col items-center justify-center cursor-pointer select-none"
          style={{ background: meta.gradient }}
          onClick={togglePlay}
        >
          <i className={`fas ${meta.icon} text-[80px] text-white/8 absolute bottom-8 right-10`} />

          {/* Play / pause button */}
          <div className={`w-16 h-16 rounded-full border-[3px] border-white/80 flex items-center justify-center transition-all ${playing ? 'bg-white/20' : 'bg-white/10 hover:bg-white/25'}`}>
            <i className={`fas ${playing ? 'fa-pause' : 'fa-play'} text-white text-[22px] ${!playing ? 'ml-1' : ''}`} />
          </div>

          {playing && (
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse inline-block" />
              <span className="text-white/90 text-[12px] font-semibold tracking-wide">Reproduzindo</span>
            </div>
          )}

          {!playing && elapsed === 0 && (
            <p className="text-white/70 text-[12px] mt-3">Clique para reproduzir</p>
          )}

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-white transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white/80 text-[11px] font-medium">
            <span>{fmt(elapsed)}</span>
            <span>/</span>
            <span>{video.duracao}</span>
          </div>

          {/* Level badge */}
          <div className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${NIVEL_STYLE[video.nivel]}`}>
            {video.nivel}
          </div>

          {/* Close */}
          <button
            onClick={e => { e.stopPropagation(); onClose(); }}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-all"
          >
            <i className="fas fa-times text-[13px]" />
          </button>
        </div>

        {/* Info */}
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={meta.badgeVariant} size="sm">
                  <i className={`fas ${meta.icon} text-[9px]`} />
                  {video.categoria}
                </Badge>
                <span className="text-[11px] text-[var(--bloxs-text-muted)] flex items-center gap-1">
                  <i className="fas fa-clock text-[10px]" /> {video.duracao}
                </span>
              </div>
              <h3 className="font-['Playfair_Display'] text-[18px] font-semibold text-[var(--bloxs-navy)] leading-snug">
                {video.titulo}
              </h3>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[11px] text-[var(--bloxs-text-muted)] mb-1">Progresso</div>
              <div className="font-['Playfair_Display'] text-[20px] font-semibold text-[var(--bloxs-navy)]">{progress}%</div>
            </div>
          </div>
          <p className="text-[13px] text-[var(--bloxs-text-muted)] leading-relaxed mb-4">
            {video.descricao}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0b1f3a] text-white text-[13px] font-semibold rounded-xl hover:bg-[#1a6edb] transition-all"
            >
              <i className={`fas ${playing ? 'fa-pause' : 'fa-play'} text-[11px]`} />
              {playing ? 'Pausar' : elapsed > 0 ? 'Continuar' : 'Assistir'}
            </button>
            {progress >= 90 && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#d1fae5] text-[#059669] text-[13px] font-semibold rounded-xl hover:bg-[#a7f3d0] transition-all"
              >
                <i className="fas fa-check text-[11px]" />
                Marcar como assistido
              </button>
            )}
            <button onClick={onClose} className="ml-auto text-[12.5px] text-[var(--bloxs-text-muted)] hover:text-[var(--bloxs-navy)] transition-colors">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
