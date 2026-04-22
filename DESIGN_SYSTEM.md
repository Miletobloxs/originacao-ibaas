# Bloxs IBaaS Design System

Sistema de design completo baseado na interface do portal Bloxs IBaaS, garantindo consistência visual e de experiência em toda a aplicação.

## 📐 Princípios de Design

1. **Profissionalismo Financeiro** - Interface séria e confiável para o mercado de capitais
2. **Clareza Regulatória** - Informações claras sobre conformidade CVM
3. **Elegância Moderna** - Combinação de fontes serifadas e sans-serif
4. **Hierarquia Visual** - Uso estratégico de cores e tipografia

## 🎨 Paleta de Cores

### Cores de Marca

```css
--bloxs-navy: #0b1f3a          /* Primary Dark - Títulos e elementos principais */
--bloxs-navy-mid: #132d54      /* Navy Médio - Hover states */
--bloxs-navy-light: #1e3a5f    /* Navy Claro */

--bloxs-blue: #1a6edb          /* Primary Blue - CTAs e links */
--bloxs-blue-mid: #2b7de9      /* Blue Médio */
--bloxs-blue-light: #4fa3ff    /* Blue Claro - Acentos */
--bloxs-blue-xlight: #d6e8ff   /* Blue Extra Claro - Backgrounds */
--bloxs-blue-xxlight: #eef5ff  /* Blue Ultra Claro - Hovers */
```

### Cores Neutras

```css
--bloxs-white: #ffffff
--bloxs-off-white: #f7f9fc     /* Background principal */
--bloxs-gray-50: #fafafa
--bloxs-gray-100: #f0f4f8
--bloxs-gray-200: #e2e8f0      /* Borders */
--bloxs-gray-300: #cbd5e1
--bloxs-gray-400: #94a3b8      /* Text muted */
--bloxs-gray-500: #64748b
--bloxs-gray-600: #475569
--bloxs-gray-800: #1e293b
```

### Cores Semânticas

```css
--bloxs-success: #059669       /* Aprovações, confirmações */
--bloxs-success-light: #d1fae5

--bloxs-warning: #d97706       /* Alertas, pendências */
--bloxs-warning-light: #fef3c7

--bloxs-error: #dc2626         /* Erros, recusas */
--bloxs-error-light: #fee2e2
```

## ✍️ Tipografia

### Famílias de Fonte

```css
--bloxs-font-display: 'Playfair Display'  /* Headings e valores */
--bloxs-font-body: 'Inter'                 /* Body text */
--bloxs-font-mono: 'SF Mono'               /* Code e dados técnicos */
```

### Escala de Tamanhos

| Token | Tamanho | Uso |
|-------|---------|-----|
| `--bloxs-text-xs` | 11px | Labels, badges |
| `--bloxs-text-sm` | 12.5px | Textos secundários |
| `--bloxs-text-base` | 13.5px | Texto padrão |
| `--bloxs-text-md` | 14px | Botões, inputs |
| `--bloxs-text-lg` | 15px | Subtítulos |
| `--bloxs-text-xl` | 19px | Títulos de seção |
| `--bloxs-text-2xl` | 22px | Títulos grandes |
| `--bloxs-text-3xl` | 26px | KPI values |
| `--bloxs-text-4xl` | 28px | Page titles |
| `--bloxs-text-5xl` | 36px | Hero titles |

### Pesos de Fonte

```css
--bloxs-font-light: 300
--bloxs-font-normal: 400
--bloxs-font-medium: 500
--bloxs-font-semibold: 600
--bloxs-font-bold: 700
```

## 📏 Espaçamento

Sistema de espaçamento em múltiplos de 4px:

```css
--bloxs-space-1: 4px
--bloxs-space-2: 8px
--bloxs-space-3: 12px
--bloxs-space-4: 16px
--bloxs-space-5: 20px
--bloxs-space-6: 24px
--bloxs-space-7: 28px
--bloxs-space-8: 32px
--bloxs-space-10: 40px
--bloxs-space-12: 48px
--bloxs-space-14: 56px
--bloxs-space-16: 64px
```

## 🔘 Componentes

### Button

```tsx
import { Button } from '@/components/ds';

<Button variant="primary" size="md">
  Enviar para Análise
</Button>

<Button variant="outline" icon={<i className="fas fa-plus" />}>
  Adicionar
</Button>
```

**Variantes:** `primary` | `secondary` | `outline` | `ghost`  
**Tamanhos:** `sm` | `md` | `lg`

### Card

```tsx
import { Card, CardHeader, CardBody } from '@/components/ds';

<Card hover>
  <CardHeader 
    icon={<i className="fas fa-chart-line" />}
    action={<button>Ver mais</button>}
  >
    Volume por Setor
  </CardHeader>
  <CardBody>
    Conteúdo do card
  </CardBody>
</Card>
```

### Input

```tsx
import { Input, Select, Textarea } from '@/components/ds';

<Input
  label="E-mail corporativo"
  placeholder="seu@email.com.br"
  error="E-mail inválido"
  leftIcon={<i className="fas fa-envelope" />}
/>

<Select
  label="Tipo de operação"
  options={[
    { value: 'fidc', label: 'FIDC' },
    { value: 'cri', label: 'CRI' }
  ]}
/>

<Textarea
  label="Descrição"
  rows={4}
  helperText="Descreva os detalhes da operação"
/>
```

### Badge

```tsx
import { Badge } from '@/components/ds';

<Badge variant="success">Aprovado</Badge>
<Badge variant="warning" icon={<i className="fas fa-clock" />}>
  Pendente
</Badge>
```

**Variantes:** `primary` | `secondary` | `success` | `warning` | `error` | `gray`

### KPICard

```tsx
import { KPICard } from '@/components/ds';

<KPICard
  label="Operações no pipeline"
  value="7"
  subtitle="desde última semana"
  icon={<i className="fas fa-layer-group" />}
  trend="up"
  trendValue="+2"
/>
```

### InfoBox

```tsx
import { InfoBox } from '@/components/ds';

<InfoBox variant="info" title="Informação Importante">
  A Resolução CVM 50 exige identificação completa...
</InfoBox>

<InfoBox variant="warning">
  Prazo de atualização cadastral expira em 30 dias.
</InfoBox>
```

**Variantes:** `info` | `warning` | `success` | `error`

### Stepper

```tsx
import { Stepper } from '@/components/ds';

<Stepper
  currentStep={2}
  orientation="vertical"
  steps={[
    { label: 'KYC / CVM 50', description: 'Identificação empresarial' },
    { label: 'Suitability / CVM 30', description: 'Perfil de investidor' },
    { label: 'Beneficiários Finais', description: 'Estrutura societária' },
    { label: 'Conclusão', description: 'Acesso liberado' }
  ]}
/>
```

**Orientações:** `horizontal` | `vertical`

## 🎯 Bordas e Sombras

### Border Radius

```css
--bloxs-radius-sm: 4px
--bloxs-radius-md: 6px
--bloxs-radius-base: 7px
--bloxs-radius-lg: 8px
--bloxs-radius-xl: 10px
--bloxs-radius-2xl: 12px
--bloxs-radius-full: 9999px
```

### Shadows

```css
--bloxs-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05)
--bloxs-shadow-sm: 0 1px 4px rgba(0, 0, 0, 0.1)
--bloxs-shadow-md: 0 2px 12px rgba(0, 0, 0, 0.06)
--bloxs-shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.06)
--bloxs-shadow-xl: 0 4px 20px rgba(0, 0, 0, 0.08)
--bloxs-shadow-focus: 0 0 0 3px rgba(26, 110, 219, 0.1)
```

## ⚡ Transições

```css
--bloxs-transition-fast: 0.15s
--bloxs-transition-base: 0.18s
--bloxs-transition-slow: 0.2s
--bloxs-transition-ease: cubic-bezier(0.4, 0, 0.2, 1)
```

Uso:

```css
transition: all var(--bloxs-transition-base) var(--bloxs-transition-ease);
```

## 📱 Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
```

## 🔒 Uso de Variáveis CSS

Sempre use as variáveis CSS do design system:

```css
/* ✅ Correto */
.button {
  background: var(--bloxs-navy);
  color: var(--bloxs-white);
  border-radius: var(--bloxs-radius-base);
  padding: var(--bloxs-space-3) var(--bloxs-space-6);
}

/* ❌ Evite valores hardcoded */
.button {
  background: #0b1f3a;
  color: #ffffff;
  border-radius: 7px;
  padding: 12px 24px;
}
```

## 📋 Convenções de Nomenclatura

### Componentes

- PascalCase: `Button`, `CardHeader`, `KPICard`
- Props descritivas: `variant`, `size`, `fullWidth`

### Classes CSS

- Prefixo: `bloxs-`
- BEM quando apropriado: `bloxs-button__icon--left`

### Tokens

- Namespace: `--bloxs-`
- Categoria: `--bloxs-color-`, `--bloxs-space-`, etc.
- Valor: `--bloxs-color-navy`, `--bloxs-space-4`

## 🎨 Exemplos de Uso

### Página Completa

```tsx
import { Card, CardHeader, CardBody, Button, KPICard, InfoBox } from '@/components/ds';

export default function DashboardPage() {
  return (
    <div className="p-10 bg-[var(--bloxs-off-white)]">
      <h1 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-4xl)] text-[var(--bloxs-navy)] mb-6">
        Painel do Originador
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard
          label="Operações no pipeline"
          value="7"
          trend="up"
          trendValue="+2"
        />
        {/* ... mais KPIs */}
      </div>

      <InfoBox variant="info">
        Seus dados cadastrais estão em conformidade com RCVM 50.
      </InfoBox>

      <Card hover>
        <CardHeader icon={<i className="fas fa-chart-line" />}>
          Volume por Setor
        </CardHeader>
        <CardBody>
          {/* Conteúdo */}
        </CardBody>
      </Card>
    </div>
  );
}
```

## 🚀 Começando

1. Importe os componentes necessários:

```tsx
import { Button, Card, Input } from '@/components/ds';
```

2. Use as variáveis CSS nos seus estilos:

```tsx
<div className="bg-[var(--bloxs-white)] border border-[var(--bloxs-border)]">
```

3. Siga as convenções de espaçamento e tipografia

## 📚 Recursos

- Tokens CSS: `src/styles/design-tokens.css`
- Componentes: `src/app/components/ds/`
- Fontes: Google Fonts (Inter, Playfair Display)
- Ícones: Font Awesome 6

---

**Versão:** 1.0.0  
**Última Atualização:** Abril 2026  
**Mantido por:** Equipe Bloxs IBaaS
