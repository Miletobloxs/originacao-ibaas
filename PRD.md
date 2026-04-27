# PRD — Bloxs IBaaS · Módulo de Originação
**Versão do protótipo:** 1.0  
**Data:** Abril 2026  
**Público:** Equipe de desenvolvimento (frontend, backend, produto)

---

## 1. Visão Geral

O **Bloxs IBaaS Originação** é o portal exclusivo para originadores credenciados pela Bloxs. Ele permite que o usuário origine operações de crédito privado (CRI, CRA, CR, FIDC, Debêntures, Notas Comerciais), acompanhe o pipeline via Kanban, gerencie comissões, documentos e sua carteira blockchain — tudo dentro de um ambiente regulado (RCVM 160, CVM, ANBIMA).

Este repositório é um **protótipo funcional de alta fidelidade** em React + TypeScript. Todos os dados são mockados. O objetivo é validar fluxos, regras de negócio e design system antes da implementação com backend real.

**Persona principal:** Rafael Andrade — Originador credenciado IBaaS, tier Gold, empresa própria de assessoria.

---

## 2. Stack Técnica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | React | 18.3.1 |
| Linguagem | TypeScript | 6.x |
| Build | Vite | 6.3.5 |
| Estilos | Tailwind CSS | 4.1.12 |
| Roteamento | React Router DOM | 7.14.x |
| Gráficos | Recharts | 2.15.2 |
| UI Primitives | Radix UI | múltiplas |
| Gerenciador de pacotes | pnpm | — |
| Ícones | FontAwesome 6 (CDN) | via `<link>` no index.html |
| Tipografia display | Playfair Display (Google Fonts) | via `<link>` no index.html |
| Tipografia corpo | Inter (Google Fonts) | via `<link>` no index.html |

**Dependências instaladas mas não utilizadas no protótipo:**  
`@mui/material`, `react-hook-form`, `react-dnd`, `vaul`, `sonner`, `cmdk`, `embla-carousel-react` — estão no `package.json` mas não foram integradas. Podem ser removidas ou aproveitadas na implementação real.

---

## 3. Estrutura de Arquivos

```
src/
├── main.tsx                        # Entry point React
└── app/
    ├── App.tsx                     # BrowserRouter + Routes
    └── components/
        ├── LoginPage.tsx           # / — Autenticação
        ├── OnboardingPage.tsx      # /onboarding — Cadastro regulatório
        ├── DashboardPage.tsx       # /dashboard — Shell principal (estado global)
        │
        ├── OriginacaoPage.tsx      # Módulo: Originar Operação
        ├── DealFlowPage.tsx        # Módulo: Deal Flow (Kanban)
        ├── HistoricoPage.tsx       # Módulo: Histórico de Operações
        ├── ComissoesPage.tsx       # Módulo: Comissões e Remuneração
        ├── FinanceiroPage.tsx      # Módulo: Pagamentos e Nota Fiscal
        ├── DocumentosPage.tsx      # Módulo: Gestão de Documentos
        ├── MercadoPage.tsx         # Módulo: Resumo de Mercado
        ├── EducacionalPage.tsx     # Módulo: Centro de Aprendizado
        ├── WalletPage.tsx          # Módulo: Wallet & Blockchain
        ├── PerfilPage.tsx          # Módulo: Perfil do Originador
        │
        └── ds/                     # Design System proprietário
            ├── index.ts
            ├── Button.tsx
            ├── Card.tsx
            ├── Input.tsx           # Input, Select, Textarea
            ├── Badge.tsx
            ├── KPICard.tsx
            ├── InfoBox.tsx
            ├── Stepper.tsx
            ├── PageHeader.tsx
            └── Spinner.tsx
```

---

## 4. Roteamento

```
/              → LoginPage
/onboarding    → OnboardingPage
/dashboard     → DashboardPage (contém todos os módulos via estado interno)
/design-system → DesignSystemDemo (uso interno / referência)
/padronizacao  → DesignSystemPadronizacao (uso interno / referência)
*              → redirect para /
```

**Importante:** a navegação entre módulos dentro do dashboard é feita via **estado React** (`activePage: PageId`), não via sub-rotas. Cada módulo é renderizado condicionalmente no mesmo mount. Na implementação real, considere migrar para sub-rotas (`/dashboard/dealflow`, `/dashboard/originar`, etc.) para suportar deep linking, botão voltar do browser e bookmarks.

---

## 5. Arquitetura de Estado

O `DashboardPage` é o **único componente com estado compartilhado**. Ele gerencia:

| Estado | Tipo | Propósito |
|--------|------|-----------|
| `activePage` | `PageId` | Qual módulo está ativo |
| `deals` | `Deal[]` | Array de operações do pipeline (Deal Flow) |
| `nfPreSelected` | `{ operacaoValue, valor } \| null` | Pré-preenche formulário de NF ao vir de Comissões |
| `showNotifications` | `boolean` | Controle do drawer de notificações |
| `showUserMenu` | `boolean` | Controle do dropdown do usuário |
| `showSuporte` | `boolean` | Controle do modal de suporte |
| `notifRead` | `boolean` | Se as notificações foram marcadas como lidas |

### Fluxos de estado entre módulos

```
OriginacaoPage ──onNewDeal──→ DashboardPage (deals) ──deals──→ DealFlowPage
ComissoesPage ──onGerarNF──→ DashboardPage (nfPreSelected + nav) → FinanceiroPage
DashboardPage ──onNavigate──→ OriginacaoPage (navegação pós-envio)
```

### Padrão de props entre módulos

```tsx
// Originar → Deal Flow
<OriginacaoPage
  onNavigate={(page) => nav(page as PageId)}
  onNewDeal={(deal) => setDeals(prev => [deal, ...prev])}
/>
<DealFlowPage deals={deals} />

// Comissões → Financeiro
<ComissoesPage onGerarNF={handleGerarNF} />
<FinanceiroPage nfPreSelected={nfPreSelected} />
```

---

## 6. Design System (`ds/`)

O protótipo usa um design system proprietário simples, com tokens via CSS custom properties e componentes React tipados.

### 6.1 Tokens de Cor (CSS variables)

| Token | Valor | Uso |
|-------|-------|-----|
| `--bloxs-navy` | `#0b1f3a` | Cor primária, títulos, botão primary |
| `--bloxs-blue` | `#1a6edb` | Cor de destaque, links, botão secondary |
| `--bloxs-blue-mid` | `#1558b0` | Hover do blue |
| `--bloxs-navy-mid` | `#132d54` | Hover do navy |
| `--bloxs-blue-light` | `#d6e8ff` | Background de destaque suave |
| `--bloxs-blue-xxlight` | `#eef5ff` | Background de seleção |
| `--bloxs-success` | `#059669` | Verde — sucesso, aprovado |
| `--bloxs-success-light` | `#d1fae5` | Background verde |
| `--bloxs-warning` | `#d97706` | Âmbar — atenção, pendente |
| `--bloxs-warning-light` | `#fef3c7` | Background âmbar |
| `--bloxs-error` | `#dc2626` | Vermelho — erro, inadimplente |
| `--bloxs-border` | `#e2e8f0` | Bordas padrão |
| `--bloxs-gray-50` | `#f8fafc` | Background alternado |
| `--bloxs-text-muted` | `#64748b` | Textos secundários |

### 6.2 Tipografia

- **Display / Títulos:** `font-['Playfair_Display']` — usado em `<h1>`, KPI values, modais
- **Corpo:** `font-['Inter']` — todo o resto
- **Código / IDs:** `font-mono` — endereços blockchain, protocolo de assinatura

### 6.3 Componentes do DS

#### `Button`
```tsx
<Button
  variant="primary" | "secondary" | "outline" | "ghost"
  size="sm" | "md" | "lg"
  icon={<i className="fas fa-..." />}
  iconPosition="left" | "right"
  fullWidth={false}
  loading={false}
  onClick={...}
>
  Label
</Button>
```

#### `Card`, `CardHeader`, `CardBody`
```tsx
<Card padding="none" | "sm" | "md" | "lg" hover>
  <CardHeader icon={<i className="fas fa-..." />} action={<Button />}>
    Título do card
  </CardHeader>
  <CardBody padding="sm" | "md" | "lg">
    Conteúdo
  </CardBody>
</Card>
```

#### `Input`, `Select`, `Textarea`
```tsx
<Input
  label="Campo *"
  value={form.campo}
  onChange={e => setForm(...)}
  error={errors.campo}
  helperText="Texto auxiliar"
  leftIcon={<i className="fas fa-..." />}
  rightIcon={<span>MM</span>}
  placeholder="..."
/>

<Select
  label="Campo *"
  value={form.campo}
  onChange={e => setForm(...)}
  options={[{ value: '', label: 'Selecione' }, ...]}
  error={errors.campo}
/>
```

#### `Badge`
```tsx
<Badge variant="primary" | "secondary" | "success" | "warning" | "error" | "gray" size="sm" | "md">
  Conteúdo
</Badge>
```

#### `KPICard`
```tsx
<KPICard
  label="Rótulo"
  value="R$ 100 MM"
  subtitle="subtexto"
  icon={<i className="fas fa-..." />}
  trend="up" | "down" | "neutral"
  trendValue="+15%"
/>
```

#### `InfoBox`
```tsx
<InfoBox variant="info" | "warning" | "error" | "success" icon={<i />} title="Título">
  Conteúdo do alerta
</InfoBox>
```

#### `Stepper`
```tsx
<Stepper
  steps={[{ label: 'Nome', description: 'Desc' }]}
  currentStep={1}
  orientation="vertical" | "horizontal"
/>
```

#### `PageHeader`
```tsx
<PageHeader
  breadcrumb="Módulo"
  title="Título da página"
  subtitle="Descrição breve"
  action={<Button />}
/>
```

### 6.4 Z-index layers

| Camada | z-index | Uso |
|--------|---------|-----|
| Sidebar | 100 | Navegação lateral |
| Topbar | 200 | Barra superior fixa |
| Side panels (detail) | 300 backdrop / 400 panel | Deal detail, Notificações drawer |
| Dropdowns topbar | 590 backdrop / 600 panel | Menu do usuário |
| Modais | 700 backdrop / 800 panel | Suporte, Assinatura, Video Player |

---

## 7. Módulos — Especificação Completa

### 7.1 `LoginPage` — `/`

**Funcionalidades implementadas:**
- Tab toggle: **Acessar** / **Cadastrar-se**
- Login social: Google, LinkedIn (ambos navegam para `/dashboard`)
- Login por e-mail/senha (qualquer valor navega para `/dashboard`)
- Cadastro por e-mail (navega para `/onboarding`)
- **"Esqueci minha senha"**: exibe tela inline com campo de e-mail → loading 1.4s → tela de confirmação "Link enviado para [email]" com botão de voltar
- Banner de acesso demo (navega direto para `/dashboard`)

**Implementação real necessária:**
- Integração com provedor OAuth (Google, LinkedIn)
- Endpoint de autenticação com JWT/session
- Endpoint de recuperação de senha (envio de e-mail real)
- Guards de rota (redirect para `/` se não autenticado)

---

### 7.2 `OnboardingPage` — `/onboarding`

**Fluxo:** 4 etapas de cadastro regulatório conforme RCVM 50 e RCVM 30.

| Etapa | Conteúdo |
|-------|----------|
| 1 | Dados pessoais (nome, CPF, data nascimento, endereço, PEP, FATCA) |
| 2 | Suitability — 6 perguntas com pontuação → cálculo automático do perfil (Conservador / Moderado / Arrojado) |
| 3 | Declarações regulatórias (PLD/FTP, FATCA/CRS, suitability), adição de beneficiários |
| 4 | Confirmação + botão "Acessar o portal" → navega para `/dashboard` |

**Implementação real necessária:**
- Persistência dos dados entre etapas (Context ou form state manager)
- Envio ao backend com versionamento de formulário regulatório
- Upload de documentos (identidade, comprovante de endereço)
- Assinatura digital das declarações (mesma infraestrutura de Documentos)

---

### 7.3 `DashboardPage` — `/dashboard` (shell)

Shell do aplicativo. Não é um módulo de conteúdo — é o container que renderiza todos os outros.

**Estrutura visual:**
- **Topbar** (`h-[60px]`, `z-200`, `fixed`): logo + badge IBaaS + sino de notificações + avatar/menu do usuário
- **Sidebar** (`w-[240px]`, `z-100`, `fixed`): navegação por seção com badges de contagem
- **Main content** (`ml-[240px]`, `mt-[60px]`): área de conteúdo dos módulos

**Seções da sidebar:**

| Seção | Itens | Badge |
|-------|-------|-------|
| Principal | Dashboard, Originar Operação, Deal Flow | Deal Flow: `3` (azul) |
| Inteligência | Resumo de Mercado, Educacional | — |
| Financeiro | Comissões, Área Financeira | Comissões: `2` (âmbar) |
| Gestão | Documentos, Histórico, Wallet & Blockchain, Perfil | Documentos: `3` (vermelho) |

**Topbar — Notificações (drawer lateral):**
- Abre drawer `w-[420px]` da direita (`z-400`) com backdrop `z-300`
- 5 notificações mockadas com tipos: `error`, `warning`, `info`, `success`
- Contagem de não lidas: apenas `error` e `warning` contam (3 não lidas)
- Botão "Marcar todas como lidas" zera o badge
- Cada notificação tem botão de ação que navega para o módulo correspondente

**Topbar — Menu do usuário:**
- Avatar `RA` abre dropdown `w-[220px]` (`z-600`)
- Links: Meu Perfil, Configurações, Wallet
- Suporte: abre modal central com contato da gestora Mariana Oliveira (WhatsApp + e-mail)
- Sair: `window.location.href = '/'`

**Dashboard Home (KPIs):**
| KPI | Valor mock | Derivação real |
|-----|-----------|----------------|
| Operações no Pipeline | 7 | `deals.filter(d => d.stage !== 'concluido').length` |
| Volume em Pipeline | R$ 407 MM | Soma dos valores das deals ativas |
| Taxa Média Pretendida | CDI + 4,8% | Média dos spreads das propostas ativas |
| Próximos à Emissão | R$ 185 MM | Deals em `comite` + `estruturacao` |

**Dashboard Home — Gráficos:**
- **Volume Histórico por Setor**: `BarChart` horizontal (Recharts), `layout="vertical"`, cores por setor, 6 setores
- **Operações Recentes**: lista das 4 operações mais recentes com etapa e instrumento, clicáveis → navigam para `dealflow` ou `historico`

**Dashboard Home — Ações Rápidas:**
| Ação | Destino |
|------|---------|
| Nova Operação | `nav('originar')` |
| Ver Comissões | `nav('comissoes')` |
| Relatórios | `nav('historico')` |
| Suporte | `setShowSuporte(true)` |

---

### 7.4 `OriginacaoPage` — `originar`

Formulário multi-etapas para originação de uma nova operação.

**Props:**
```tsx
interface Props {
  onNavigate?: (page: string) => void;  // navega após submissão
  onNewDeal?: (deal: Deal) => void;     // adiciona deal ao pipeline
}
```

**4 etapas (Stepper vertical à esquerda):**

| Etapa | Campos | Validação obrigatória |
|-------|--------|----------------------|
| 1 — Dados da Operação | Instrumento, Setor, Volume (MM), Prazo (meses), Indexador, Spread, Amortização, Descrição | Instrumento, Setor, Volume, Spread, Prazo, Amortização |
| 2 — Emissor & Estrutura | Razão Social, CNPJ (com máscara), Endereço, Contato, E-mail, Telefone (com máscara), Uso dos Recursos, Rating | Razão Social, CNPJ (14 dígitos) |
| 3 — Garantias | Tipo de Garantia, Valor da Garantia (MM), Descrição, Upload (visual) | — |
| 4 — Revisão & Envio | Review cards das 3 etapas (com botões "Editar"), InfoBox, checkbox de confirmação | `confirmado === true` |

**LTV (Etapa 3):**
```
LTV = Math.round((valorGarantia / volume) * 100)
verde ≥ 100% · âmbar ≥ 70% · vermelho < 70%
```

**Fluxo de submissão:**
1. Clique em "Enviar para Análise" → valida `confirmado`
2. Loading 1.5s (spinner no botão)
3. Tela de sucesso: ID `OP-013`, resumo da operação
4. `onNewDeal` é chamado com objeto `Deal` construído do formulário
5. Botão "Acompanhar no Deal Flow" → `onNavigate('dealflow')`
6. Botão "Nova Operação" → reseta form e volta ao Step 1

**Mapeamento de instrumento para Deal:**
Instrumentos do form não presentes no tipo `Instrument` do DealFlow (`CCB`, `CPR`) são mapeados para `'A definir'`.

---

### 7.5 `DealFlowPage` — `dealflow`

Kanban board do pipeline de operações.

**Props:**
```tsx
interface Props { deals?: Deal[] }
// fallback: INITIAL_DEALS (8 deals hardcoded)
```

**Tipos exportados** (usados por DashboardPage e OriginacaoPage):
```tsx
export type Stage = 'originacao' | 'analise' | 'diligencia' | 'comite' | 'estruturacao' | 'concluido'
export type Instrument = 'CRI' | 'CRA' | 'CR' | 'FIDC' | 'Debênture' | 'Nota Comercial' | 'A definir'
export interface DealEvent { date: string; event: string; author: string }
export interface Deal { id, title, value, location, instrument, sector, stage, responsible, submittedAt, lastUpdate, description, timeline }
export const INITIAL_DEALS: Deal[]
```

**6 colunas (estágios):**

| Coluna | Cor do header | Deals iniciais |
|--------|--------------|----------------|
| Originação | `#475569` | 2 |
| Análise | `#1a6edb` | 2 |
| Diligência | `#d97706` | 1 |
| Comitê | `#374151` | 1 |
| Estruturação | `#1d4ed8` | 1 |
| Concluído | `#059669` | 1 |

**Filtros:** busca por título, filtro por instrumento, filtro por setor

**KPI Bar:** Operações ativas · Volume em pipeline · Em fase final · Volume fase final

**Detail Panel:** clique em um card abre painel lateral fixo (`w-[440px]`, `z-400`) com timeline de atividades, dados completos e ações (Editar / HubSpot / Arquivar — visuais, sem lógica real)

---

### 7.6 `HistoricoPage` — `historico`

Tabela completa de operações históricas com gráficos e painel de detalhe.

**12 operações mockadas** (OP-001 a OP-012) com status:
- `Liquidada` (verde), `Em Andamento` (azul), `Inadimplente` (vermelho), `Antecipada` (âmbar), `Cancelada` (cinza)

**KPIs:**
- 12 operações totais · R$ 563 MM volume · CDI + 3,6% taxa média · R$ 2,46 MM comissões acumuladas

**Gráficos:**
- Volume trimestral: `BarChart` com 8 períodos (Q1 2024 → Q2 2026)
- Distribuição por instrumento: `PieChart` (donut) com 5 tipos

**Tabela:** filtro por instrumento/setor/status + busca + ordenação por qualquer coluna (clique no header)

**Detail Panel:** mesmo padrão do DealFlow — painel lateral com timeline de eventos, dados ISIN, datas de emissão e vencimento, comissão da operação

---

### 7.7 `ComissoesPage` — `comissoes`

**Props:**
```tsx
interface Props { onGerarNF?: (operacaoValue: string, valor: number) => void }
```

**7 comissões mockadas** com status: `Pago` (2), `A receber` (3), `Em análise` (2)

**KPI Banner (3 colunas):**
- Total acumulado 2026: R$ 312.000
- A receber: R$ 535.000
- Projeção total: R$ 847.000

**Gráficos:**
- Evolução trimestral: `BarChart` com Q1/2025 → Q2/2026* (projetado)
- Status das comissões: `PieChart` donut (Pago / A receber / Em análise)
- Por operação ativa: `BarChart` horizontal

**Coluna NF na tabela:**
- `nf === '—'`: traço (Em análise, sem NF possível)
- `nf === 'Pendente'`: botão **"Gerar NF"** âmbar → chama `onGerarNF(operacaoValue, valor)` → DashboardPage navega para `financeiro` com dados pré-preenchidos
- `nf === 'NF 001'` etc.: badge azul

**Mapeamento de operação para select do Financeiro:**
```ts
const OP_TO_VALUE = {
  'Data Center MG': 'datacenter',
  'Logística RJ':   'logistica',
  'Telecom Norte':  'telecom',
}
```

---

### 7.8 `FinanceiroPage` — `financeiro`

**Props:**
```tsx
interface Props { nfPreSelected?: { operacaoValue: string; valor: number } | null }
```

O `useState` do form inicializa com os valores da prop:
```tsx
const [form, setForm] = useState({
  operacao: nfPreSelected?.operacaoValue ?? '',
  valorNF:  nfPreSelected?.valor ? String(nfPreSelected.valor) : '',
  ...
})
```

**Formulário de emissão de NF:** Operação (select), CNPJ do prestador (com máscara), Valor da NF, Número da NF (opcional), Chave NF-e (44 dígitos, com máscara de espaçamento a cada 4)

**Validações:** operação obrigatória, CNPJ completo (14 dígitos), valor obrigatório

**Submissão:** loading 1.2s → tela de sucesso "NF enviada!" → botão "Emitir outra NF" reseta

**Histórico de pagamentos:** 6 linhas com status (`Pago`, `Aguardando NF`, `Em análise`)

**Dados bancários e tributários:** exibe dados fixos do originador + status de habilitação (5 itens, 1 pendente: Declaração FATCA)

---

### 7.9 `DocumentosPage` — `documentos`

**4 abas:**

| Aba | Conteúdo |
|-----|----------|
| Contratos & Mandatos | 6 documentos (3 Assinados, 3 Pendentes) |
| Por Operação | 4 operações accordion com 2–3 docs cada |
| Compliance | 4 documentos KYC/Suitability/PLD/FATCA |
| Upload | Formulário drag-and-drop |

**Modal de Assinatura (3 etapas):**

| Etapa | Conteúdo | Duração |
|-------|----------|---------|
| 0 — Confirmação | Tabela com nome do doc, tipo, signatário, data/hora + aviso legal | — |
| 1 — Assinando | Spinner circular + texto "Assinando documento…" | 2 segundos |
| 2 — Assinado | Check verde + protocolo gerado (`ASS-XXXXXXXX`) + data/hora | — |

**Atualização de estado pós-assinatura:**
- `assinadosIds: string[]` armazena IDs dos documentos assinados
- `docEfetivo(doc)`: retorna o doc com `status: 'Assinado'`, `tipo: 'signed'`, `acoes: ['download']` se o ID estiver na lista
- O badge e ícone do `DocCard` atualizam automaticamente

**Upload (aba 4):** drag-and-drop com `useRef<HTMLInputElement>`, lista de arquivos com tamanho formatado, seleção de operação e categoria, estado de sucesso 3s

---

### 7.10 `MercadoPage` — `mercado`

Resumo de mercado com dados simulados de renda fixa e crédito privado.

**Seções:**
- Indicadores macro (SELIC, CDI, IPCA, spread IG)
- Destaque de setor (Agronegócio em alta)
- Tabela de emissões recentes do mercado
- Notícias/análises da equipe Bloxs

---

### 7.11 `EducacionalPage` — `educacional`

Centro de aprendizado com trilha de certificação e vídeos.

**12 vídeos mockados** em 5 categorias: Fundamentos, Instrumentos, Intermediários, Mercado, IBaaS

**Trilha de certificação (4 níveis):**
- Nível 1 Fundamentos: 3/3 concluídas ✓
- Nível 2 Instrumentos: 1/3 — em progresso
- Nível 3 Mercado: bloqueado
- Nível 4 IBaaS: bloqueado

**Modal de Player de Vídeo:**
- Abre ao clicar no thumbnail ou botão Assistir/Continuar/Rever
- Player simulado: `play/pause` toggle, barra de progresso que avança 1% por segundo de `elapsed`, timer `MM:SS`
- Estado visual "Reproduzindo" com dot vermelho piscando
- Botão "Marcar como assistido" aparece quando `progress >= 90%`
- Progresso inicial respeitado: vídeos `emProgresso` iniciam no `progressoPct` do vídeo

---

### 7.12 `WalletPage` — `wallet`

Módulo blockchain com tokens e contratos inteligentes.

**Endereço mockado:** `0x3F4A8c91B0D2E67F5A8B3C4D9E0F1A2B84C7D9E2`

**5 tokens tokenizados:**

| Token | Valor | Instrumento |
|-------|-------|-------------|
| PAFIDC25 | R$ 120 MM | FIDC |
| ENRSP24 | R$ 88 MM | Debênture |
| LOGRJ22 | R$ 65 MM | CR |
| BIOMT25 | R$ 44 MM | CRI |
| AGRCE23 | R$ 42 MM | CRA |

**Copy de endereços:** `navigator.clipboard.writeText()` com feedback visual temporário "Copiado!" por 2s

**6 transações mockadas** (Emissão, Transferência, Amortização, Liquidação, Rendimento)

**5 contratos inteligentes** com endereço, data de deploy e contagem de transações

**InfoBox DREX:** nota informativa sobre a infraestrutura blockchain e integração futura com DREX

---

### 7.13 `PerfilPage` — `perfil`

Perfil do originador com configurações e acesso à API.

**Seções:**
- Hero card: avatar RA, nome, empresa, tier Gold, botão Editar Perfil (visual)
- Tier progress: Gold → Platinum (R$ 563 MM de R$ 600 MM), barra 93,8%
- Dados pessoais e empresariais (somente leitura no protótipo)
- Status de documentação (6 itens: 5 OK, 1 pendente — FATCA)
- 3 Responsáveis registrados na estrutura
- Toggle de configurações (6 switches animados): notificações e-mail, push, relatório semanal, visibilidade no hub, 2FA, modo escuro
- API Key: toggle de visibilidade, copy com feedback, badges de permissões, barra de uso (67%)

---

## 8. Fluxos de Usuário Completos

### 8.1 Originar uma operação e ver no pipeline
```
Login → Dashboard → "Nova Operação" (sidebar ou quick action)
→ Preencher Step 1 (instrumento, volume, taxa)
→ Step 2 (dados do emissor, CNPJ)
→ Step 3 (garantia + LTV automático)
→ Step 4 (revisar + confirmar checkbox)
→ "Enviar para Análise" → loading → tela de sucesso com OP-013
→ "Acompanhar no Deal Flow" → DealFlow com novo card na coluna "Originação"
```

### 8.2 Gerar nota fiscal a partir de comissão pendente
```
Dashboard → Comissões
→ Tabela: linha "Data Center MG" status "A receber", NF "Pendente"
→ Clicar em "Gerar NF" (botão âmbar)
→ Navega para Área Financeira com operação "Data Center MG" e valor R$ 165.000 pré-preenchidos
→ Preencher CNPJ + enviar → NF registrada
```

### 8.3 Assinar documento pendente
```
Dashboard → Documentos → aba "Contratos & Mandatos"
→ Documento "Mandato de Originação — Solar Norte SP" (Pendente)
→ Clicar "Assinar"
→ Modal: ler dados + clicar "Confirmar assinatura"
→ Spinner 2s ("Assinando documento…")
→ Tela de sucesso: protocolo ASS-XXXXXXXX + botão Concluir
→ Card do documento muda para "Assinado" com ícone de assinatura
```

### 8.4 Recuperar senha
```
Login → "Esqueci minha senha"
→ Tela inline: campo de e-mail + "Enviar link de recuperação"
→ Loading 1.4s → "Link enviado!" para o e-mail informado
→ "← Voltar ao login"
```

### 8.5 Assistir uma aula
```
Dashboard → Educacional
→ Clicar em qualquer thumbnail ou botão "Assistir"
→ Modal 720px com player simulado
→ Clicar no player → "Reproduzindo" (progresso avança em tempo real)
→ Ao atingir 90% → botão "Marcar como assistido" aparece
→ Fechar modal
```

### 8.6 Ver detalhes de uma operação no Deal Flow
```
Dashboard → Deal Flow
→ Clicar em qualquer card Kanban
→ Painel lateral direito com: estágio, instrumento, volume, setor, timeline de atividades
→ Clicar no backdrop ou no X para fechar
```

---

## 9. Dados Mock — O Que Precisa de API Real

| Dado | Arquivo | Endpoint sugerido |
|------|---------|-------------------|
| Autenticação | `LoginPage` | `POST /auth/login`, `POST /auth/oauth/{provider}` |
| Recuperação de senha | `LoginPage` | `POST /auth/forgot-password` |
| Cadastro regulatório | `OnboardingPage` | `POST /onboarding/submit` |
| Deals do pipeline | `DealFlowPage.INITIAL_DEALS` | `GET /deals` |
| Nova deal (originar) | `DashboardPage.addDeal` | `POST /deals` |
| Histórico de operações | `HistoricoPage.OPERACOES` | `GET /operations?status=all` |
| Comissões | `ComissoesPage.COMISSOES` | `GET /commissions` |
| Emissão de NF | `FinanceiroPage.handleSubmit` | `POST /invoices` |
| Documentos | `DocumentosPage.CONTRATOS, COMPLIANCE` | `GET /documents` |
| Assinatura de documento | `DocumentosPage.confirmarAssinatura` | `POST /documents/{id}/sign` |
| Upload de documentos | `UploadTab.handleSubmit` | `POST /documents/upload` |
| Vídeos educacionais | `EducacionalPage.VIDEOS` | `GET /educational/videos` |
| Progresso de vídeos | `VideoModal` | `PATCH /educational/videos/{id}/progress` |
| Tokens blockchain | `WalletPage.TOKENS` | `GET /wallet/tokens` |
| Transações blockchain | `WalletPage.TRANSACOES` | `GET /wallet/transactions` |
| Contratos inteligentes | `WalletPage.CONTRATOS` | `GET /wallet/contracts` |
| Notificações | `DashboardPage.NOTIFS` | `GET /notifications` |
| Perfil do usuário | `PerfilPage` | `GET /profile`, `PATCH /profile` |
| API Key | `PerfilPage` | `GET /api-keys`, `POST /api-keys/rotate` |

---

## 10. Padrões de Código

### Nomenclatura
- Componentes: `PascalCase` — ex: `DealFlowPage`, `VideoModal`
- Tipos/interfaces: `PascalCase` — ex: `Deal`, `FormState`, `StatusComissao`
- Constantes de dados: `SCREAMING_SNAKE_CASE` — ex: `INITIAL_DEALS`, `COMISSOES`, `NOTIFS`
- Funções/handlers: `camelCase` — ex: `handleSubmit`, `addDeal`, `handleGerarNF`
- Props callbacks: `on` + ação — ex: `onNewDeal`, `onGerarNF`, `onNavigate`, `onClose`

### Padrão de formulários
```tsx
// Estado tipado com chaves espelhando os campos
const [form, setForm] = useState<FormState>(EMPTY);
const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

// Helper genérico de campo (limpa o erro ao editar)
function field<K extends keyof FormState>(key: K, val: FormState[K]) {
  setForm(f => ({ ...f, [key]: val }));
  if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
}

// Validação por step
function validate(step: number): boolean {
  const e: Partial<Record<keyof FormState, string>> = {};
  if (step === 1) { ... }
  setErrors(e);
  return Object.keys(e).length === 0;
}
```

### Padrão de modais/painéis
```tsx
// Backdrop + panel sempre em pares
{showModal && (
  <>
    <div className="fixed inset-0 bg-black/30 z-[700]" onClick={fecharModal} />
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] bg-white rounded-2xl shadow-2xl z-[800]">
      ...
    </div>
  </>
)}
```

### Máscaras de input
```tsx
const maskCNPJ = (v: string) =>
  v.replace(/\D/g,'').slice(0,14)
   .replace(/(\d{2})(\d)/,'$1.$2')
   .replace(/(\d{3})(\d)/,'$1.$2')
   .replace(/(\d{3})(\d)/,'$1/$2')
   .replace(/(\d{4})(\d{1,2})$/,'$1-$2');

const maskPhone = (v: string) =>
  v.replace(/\D/g,'').slice(0,11)
   .replace(/(\d{2})(\d)/,'($1) $2')
   .replace(/(\d{5})(\d{4})$/,'$1-$2');
```

### Copy to clipboard
```tsx
const [copiado, setCopiado] = useState<string | null>(null);

function copiar(id: string, texto: string) {
  navigator.clipboard.writeText(texto);
  setCopiado(id);
  setTimeout(() => setCopiado(null), 2000);
}
// No JSX: {copiado === id ? 'Copiado!' : 'Copiar'}
```

---

## 11. Variáveis de Ambiente

Nenhuma variável de ambiente é usada no protótipo. Na implementação real, criar `.env`:

```bash
VITE_API_BASE_URL=https://api.bloxs.com.br
VITE_AUTH_PROVIDER_URL=...
VITE_BLOCKCHAIN_RPC_URL=...
VITE_SENTRY_DSN=...
```

---

## 12. Como Rodar o Projeto

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev
# → http://localhost:5173

# Build de produção
pnpm build

# Acesso direto ao dashboard (sem login)
# Clique em "Entrar como demonstração" na tela de login
# Ou acesse diretamente: http://localhost:5173/dashboard
```

---

## 13. Pontos de Atenção para o Dev Handoff

### Navegação
- A navegação entre módulos **não usa React Router** — é estado local em `DashboardPage`. Migrar para sub-rotas é recomendado para permitir deep linking e histórico do browser.
- `window.location.href = '/'` no "Sair" deve ser substituído por `navigate('/')` + limpeza de sessão/token.

### Estado compartilhado
- `DashboardPage` faz lifting state de `deals` e `nfPreSelected`. Na escala real, considerar **React Context** ou **Zustand** para evitar prop drilling.
- O reset de `nfPreSelected` não está implementado: ao navegar de volta para Financeiro sem vir de Comissões, o form ainda pode estar pré-preenchido. Implementar `useEffect` com reset ao desmontar, ou limpar o estado ao confirmar o envio.

### Autenticação
- Não há guards de rota. Qualquer URL `/dashboard` é acessível sem autenticação.
- Implementar `ProtectedRoute` wrapper verificando token/sessão antes de renderizar o dashboard.

### Dados inconsistentes a corrigir
- `FinanceiroPage` exibe "Roberto Alves Assessoria" nos dados bancários/tributários — deve ser "Rafael Andrade Assessoria" (ou o nome real da empresa do usuário logado).
- `DocumentosPage` linha 38: `'Contrato de Originação — Bloxs × Roberto Alves'` — deve ser atualizado com o nome do usuário real.
- O número da operação no sucesso de originar está hardcoded como `OP-013` — deve ser gerado pelo backend.

### Blockchain / Wallet
- O endereço de carteira é um placeholder fixo. A integração real dependerá do provider blockchain escolhido (Ethereum, Drex, etc.).
- A seção de tokens e transações precisará de indexação on-chain ou um serviço de custódia.

### Vídeos educacionais
- Os vídeos não têm URL real. O player simulado usa um timer de `setInterval`. Na implementação, substituir pelo player de vídeo real (YouTube embed, Vimeo, ou player próprio com CDN).
- O progresso local (no `VideoModal`) não persiste ao fechar o modal — nenhum estado externo é atualizado.

### TypeScript
- `pnpm exec tsc --noEmit` passa sem erros em toda a base de código.
- Warnings de hints (variáveis declaradas mas não lidas) são resolvidos ao conectar props no JSX.

---

## 14. Checklist de Implementação Real

- [ ] Configurar autenticação (OAuth Google/LinkedIn + e-mail)
- [ ] Implementar guards de rota
- [ ] Migrar navegação interna para sub-rotas React Router
- [ ] Criar Context/Zustand para estado global (user, deals, notifications)
- [ ] Conectar todas as chamadas de API (ver seção 9)
- [ ] Implementar upload real de documentos (S3 ou equivalente)
- [ ] Integrar assinatura digital com provedor (DocuSign, ClickSign, D4Sign)
- [ ] Substituir player simulado por player de vídeo real
- [ ] Conectar blockchain/Drex para Wallet
- [ ] Implementar WebSocket ou polling para notificações em tempo real
- [ ] Adicionar testes (React Testing Library + Vitest)
- [ ] Configurar CI/CD com type check e testes
- [ ] Configurar Sentry para monitoramento de erros
- [ ] Revisar e remover dependências não utilizadas do `package.json`
- [ ] Corrigir dados mock inconsistentes (nome, IDs hardcoded)
- [ ] Implementar persistência de progresso de vídeos
- [ ] Implementar sub-rotas para deep linking

---

*Protótipo desenvolvido por Bloxs · Módulo IBaaS Originação · Abril 2026*
