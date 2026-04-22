# Changelog - Bloxs IBaaS Design System

Todas as mudanças notáveis do design system serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-04-21

### 🎉 Release Inicial

Primeira versão do Bloxs IBaaS Design System, criado a partir dos arquivos HTML de referência.

### ✨ Adicionado

#### Design Tokens
- Sistema completo de variáveis CSS (`design-tokens.css`)
- 25+ variáveis de cores (brand, neutras, semânticas)
- Sistema de tipografia (famílias, tamanhos, pesos, line-heights, letter-spacing)
- Escala de espaçamento (12 níveis, múltiplos de 4px)
- Border radius padronizados (7 variações)
- Sistema de sombras (6 níveis)
- Variáveis de transição e duração
- Z-index layers organizados
- Variáveis específicas de componentes

#### Componentes React

**Button** (`Button.tsx`)
- 4 variantes: primary, secondary, outline, ghost
- 3 tamanhos: sm, md, lg
- Suporte a ícones (esquerda/direita)
- Estado de loading
- Estado disabled
- Opção fullWidth

**Card** (`Card.tsx`)
- Card container principal
- CardHeader com suporte a ícone e ação
- CardBody com padding customizável
- Efeito hover opcional

**Input** (`Input.tsx`)
- Input de texto com label e validação
- Select/dropdown com opções
- Textarea multilinha
- Suporte a ícones (esquerda/direita)
- Mensagens de erro e helper text

**Badge** (`Badge.tsx`)
- 6 variantes: primary, secondary, success, warning, error, gray
- 2 tamanhos: sm, md
- Suporte a ícones

**KPICard** (`KPICard.tsx`)
- Display de métricas e KPIs
- Suporte a ícone
- Indicadores de trend (up/down/neutral)
- Valor de trend
- Subtitle opcional

**InfoBox** (`InfoBox.tsx`)
- 4 variantes: info, warning, success, error
- Suporte a título e ícone
- Formatação de texto rich (strong tags)

**Stepper** (`Stepper.tsx`)
- 2 orientações: vertical, horizontal
- Estados: pending, active, done
- Suporte a descrições opcionais
- Check marks em etapas concluídas

**PageHeader** (`PageHeader.tsx`)
- Breadcrumb opcional
- Título e subtítulo
- Área de ação (botões, etc)
- Divider opcional

**Spinner** (`Spinner.tsx`)
- 4 tamanhos: sm, md, lg, xl
- 4 cores: primary, secondary, white, muted
- SpinnerOverlay com mensagem customizável

#### Estilos Customizados (`custom.css`)
- Scrollbar personalizada (webkit e firefox)
- Animações (@keyframes: fadeIn, slideUp, slideDown, spin)
- Utility classes (text-display, text-body, container-*)
- Focus styles customizados
- Selection styling
- Print styles
- Acessibilidade (.sr-only, .skip-link)
- Suporte a reduced motion
- Preparação para dark mode

#### Documentação

**DESIGN_SYSTEM.md**
- Princípios de design
- Paleta completa de cores
- Sistema de tipografia
- Escala de espaçamento
- Documentação de componentes com exemplos
- Bordas, sombras e transições
- Breakpoints responsivos
- Convenções de nomenclatura
- Exemplos de uso

**CONTRIBUTING_DS.md**
- Guia de como adicionar componentes
- Guia de como modificar componentes
- Como adicionar tokens CSS
- Padrões de código TypeScript
- Checklist de contribuição
- Exemplos de boas práticas
- Anti-padrões a evitar

**src/app/components/ds/README.md**
- Quick start guide
- Referência de API de cada componente
- Variáveis CSS disponíveis
- Boas práticas de uso
- Como customizar componentes
- Troubleshooting

**DS_INDEX.md**
- Índice completo de toda documentação
- Navegação por categoria
- Referência rápida de tokens
- Busca por necessidade ("Preciso de...")
- Links para todos os recursos

**DESIGN_SYSTEM_SUMMARY.md**
- Resumo executivo
- O que foi criado
- Como usar
- Estatísticas completas
- Estrutura de arquivos
- Exemplo completo de uso

**README_DS.md**
- Quick start
- Links rápidos
- Paleta resumida
- Exemplos básicos

**CHANGELOG_DS.md**
- Este arquivo
- Histórico de versões

#### Demo & Exemplos

**DesignSystemDemo.tsx**
- Página interativa em `/design-system`
- Demonstração de todas as cores
- Demonstração de tipografia
- Todos os componentes visíveis
- Todas as variantes demonstradas
- Estados interativos (hover, focus)
- Exemplos de composição

### 🎨 Design

- Design 100% baseado nos HTMLs originais (onboarding.html, dashboard.html, index_(5).html)
- Paleta de cores Navy + Blue com acentos semânticos
- Tipografia: Playfair Display (headings) + Inter (body)
- Espaçamento consistente em múltiplos de 4px
- Border radius arredondados e modernos
- Sombras sutis e profissionais
- Transições suaves (150-200ms)

### 🔧 Técnico

- TypeScript completo com interfaces tipadas
- Props com valores padrão
- Acessibilidade (ARIA labels, semântica HTML)
- Responsividade mobile-first
- CSS Variables para todos os valores
- Tailwind CSS 4 para utilidades
- Font Awesome 6 para ícones
- Google Fonts (Inter, Playfair Display)

### 📦 Arquitetura

```
src/
├── styles/
│   ├── design-tokens.css    # Tokens CSS
│   ├── custom.css            # Estilos customizados
│   └── index.css             # Entry point
└── app/
    └── components/
        ├── ds/                # Design System
        │   ├── Button.tsx
        │   ├── Card.tsx
        │   ├── Input.tsx
        │   ├── Badge.tsx
        │   ├── KPICard.tsx
        │   ├── InfoBox.tsx
        │   ├── Stepper.tsx
        │   ├── PageHeader.tsx
        │   ├── Spinner.tsx
        │   ├── index.ts
        │   └── README.md
        └── DesignSystemDemo.tsx
```

### 📊 Estatísticas

- **Componentes:** 9 principais + 2 auxiliares = 11 total
- **Variantes:** 30+ combinações
- **Tokens CSS:** 100+ variáveis
- **Documentação:** 7 arquivos, ~15000 palavras
- **Exemplos:** 50+ code snippets
- **Linhas de Código:** ~2500

### 🎯 Compatibilidade

- React 18+
- TypeScript 5+
- Tailwind CSS 4+
- Navegadores modernos (Chrome, Firefox, Safari, Edge)

---

## [Unreleased]

### 🚧 Em Desenvolvimento

Nenhuma feature em desenvolvimento no momento.

### 💡 Planejado

Componentes futuros:
- Tooltip
- Modal/Dialog
- Accordion
- Dropdown Menu
- Tabs
- Toast/Notification
- Data Table
- Charts (integração Recharts)

Melhorias planejadas:
- Temas (dark mode)
- Animações avançadas
- Mais variantes de componentes
- Testes automatizados
- Storybook

---

## Como Contribuir

Consulte [CONTRIBUTING_DS.md](./CONTRIBUTING_DS.md) para diretrizes de contribuição.

## Versionamento

Este projeto usa [Semantic Versioning](https://semver.org/lang/pt-BR/):

- **MAJOR** (1.x.x): Mudanças incompatíveis na API
- **MINOR** (x.1.x): Novos recursos compatíveis
- **PATCH** (x.x.1): Correções de bugs compatíveis

## Manutenção

**Mantido por:** Equipe Bloxs IBaaS  
**Contato:** Veja CONTRIBUTING_DS.md

---

[1.0.0]: https://github.com/bloxs/design-system/releases/tag/v1.0.0
