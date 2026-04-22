# Bloxs IBaaS Design System - Guia de Uso

## 📦 Estrutura

```
src/app/components/ds/
├── Button.tsx          # Componente de botão
├── Card.tsx            # Cards e containers
├── Input.tsx           # Inputs, selects e textareas
├── Badge.tsx           # Badges e tags
├── KPICard.tsx         # Cards de KPI/métricas
├── InfoBox.tsx         # Caixas de informação/alerta
├── Stepper.tsx         # Steppers de navegação
├── index.ts            # Exports centralizados
└── README.md           # Este arquivo
```

## 🚀 Quick Start

### 1. Importar Componentes

```tsx
// Importação individual
import { Button } from '@/components/ds';

// Múltiplas importações
import { Button, Card, Input, Badge } from '@/components/ds';
```

### 2. Usar Variáveis CSS

```tsx
// Inline com Tailwind
<div className="bg-[var(--bloxs-white)] text-[var(--bloxs-navy)]">

// Em CSS modules
.myClass {
  color: var(--bloxs-blue);
  padding: var(--bloxs-space-4);
}
```

## 📚 Componentes

### Button

Botão com múltiplas variantes e tamanhos.

```tsx
<Button 
  variant="primary"    // primary | secondary | outline | ghost
  size="md"            // sm | md | lg
  fullWidth={false}
  loading={false}
  disabled={false}
  icon={<i className="fas fa-plus" />}
  iconPosition="left"  // left | right
  onClick={() => {}}
>
  Texto do Botão
</Button>
```

**Exemplos:**

```tsx
// Botão primário padrão
<Button variant="primary">
  Enviar
</Button>

// Botão com ícone
<Button 
  variant="secondary" 
  icon={<i className="fas fa-download" />}
>
  Download
</Button>

// Botão em loading
<Button variant="primary" loading>
  Processando...
</Button>
```

### Card, CardHeader, CardBody

Containers com cabeçalho e corpo estruturados.

```tsx
<Card 
  padding="md"         // none | sm | md | lg
  hover={true}         // Efeito hover
>
  <CardHeader 
    icon={<i className="fas fa-chart-line" />}
    action={<button>Ação</button>}
  >
    Título do Card
  </CardHeader>
  
  <CardBody padding="lg">
    Conteúdo do card
  </CardBody>
</Card>
```

**Exemplos:**

```tsx
// Card simples
<Card>
  <CardBody>
    Conteúdo aqui
  </CardBody>
</Card>

// Card completo com hover
<Card hover padding="none">
  <CardHeader 
    icon={<i className="fas fa-user" />}
    action={<Button size="sm">Editar</Button>}
  >
    Perfil do Usuário
  </CardHeader>
  <CardBody>
    <p>Informações do usuário...</p>
  </CardBody>
</Card>
```

### Input, Select, Textarea

Campos de formulário com labels e mensagens.

```tsx
// Input
<Input
  label="E-mail"
  placeholder="Digite seu e-mail"
  error="E-mail inválido"
  helperText="Use seu e-mail corporativo"
  leftIcon={<i className="fas fa-envelope" />}
  rightIcon={<i className="fas fa-check" />}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// Select
<Select
  label="Escolha uma opção"
  options={[
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' }
  ]}
  error="Campo obrigatório"
/>

// Textarea
<Textarea
  label="Descrição"
  rows={4}
  helperText="Máximo 500 caracteres"
  placeholder="Digite aqui..."
/>
```

### Badge

Tags e indicadores de status.

```tsx
<Badge 
  variant="success"    // primary | secondary | success | warning | error | gray
  size="md"            // sm | md
  icon={<i className="fas fa-check" />}
>
  Aprovado
</Badge>
```

**Exemplos:**

```tsx
<Badge variant="success">Ativo</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="error">Cancelado</Badge>
<Badge variant="primary" icon={<i className="fas fa-star" />}>
  Premium
</Badge>
```

### KPICard

Cards para exibição de métricas e KPIs.

```tsx
<KPICard
  label="Operações Ativas"
  value="127"
  subtitle="último mês"
  icon={<i className="fas fa-layer-group" />}
  trend="up"           // up | down | neutral
  trendValue="+15%"
/>
```

**Exemplos:**

```tsx
// KPI positivo
<KPICard
  label="Receita Total"
  value="R$ 1,2M"
  icon={<i className="fas fa-dollar-sign" />}
  trend="up"
  trendValue="+23%"
/>

// KPI neutro
<KPICard
  label="Clientes Ativos"
  value="450"
  subtitle="sem alteração"
  trend="neutral"
/>
```

### InfoBox

Caixas de informação, avisos e alertas.

```tsx
<InfoBox
  variant="info"       // info | warning | success | error
  title="Título"
  icon={<i className="fas fa-info-circle" />}
>
  Mensagem de informação aqui.
</InfoBox>
```

**Exemplos:**

```tsx
// Informação
<InfoBox variant="info" title="Atenção">
  Seus dados estão sendo processados.
</InfoBox>

// Aviso
<InfoBox variant="warning">
  <strong>Prazo:</strong> Atualize seu cadastro até 30/04.
</InfoBox>

// Sucesso
<InfoBox variant="success" icon={<i className="fas fa-check" />}>
  Operação concluída com sucesso!
</InfoBox>

// Erro
<InfoBox variant="error">
  Erro ao processar. Tente novamente.
</InfoBox>
```

### Stepper

Indicador de progresso em etapas.

```tsx
<Stepper
  currentStep={2}
  orientation="vertical"    // vertical | horizontal
  steps={[
    { 
      label: 'Etapa 1', 
      description: 'Descrição opcional' 
    },
    { label: 'Etapa 2' },
    { label: 'Etapa 3' }
  ]}
/>
```

**Exemplos:**

```tsx
// Vertical (sidebar)
<Stepper
  currentStep={2}
  orientation="vertical"
  steps={[
    { label: 'Cadastro', description: 'Dados básicos' },
    { label: 'Documentos', description: 'Upload de arquivos' },
    { label: 'Revisão', description: 'Conferência final' }
  ]}
/>

// Horizontal (wizard)
<Stepper
  currentStep={1}
  orientation="horizontal"
  steps={[
    { label: 'Início' },
    { label: 'Processo' },
    { label: 'Conclusão' }
  ]}
/>
```

## 🎨 Variáveis CSS Disponíveis

### Cores

```css
/* Brand */
var(--bloxs-navy)
var(--bloxs-blue)
var(--bloxs-blue-light)

/* Neutros */
var(--bloxs-white)
var(--bloxs-gray-100)
var(--bloxs-gray-400)

/* Semânticas */
var(--bloxs-success)
var(--bloxs-warning)
var(--bloxs-error)

/* Text */
var(--bloxs-text)
var(--bloxs-text-muted)
```

### Tipografia

```css
/* Famílias */
var(--bloxs-font-display)  /* Playfair Display */
var(--bloxs-font-body)     /* Inter */

/* Tamanhos */
var(--bloxs-text-xs)       /* 11px */
var(--bloxs-text-sm)       /* 12.5px */
var(--bloxs-text-base)     /* 13.5px */
var(--bloxs-text-3xl)      /* 26px */

/* Pesos */
var(--bloxs-font-medium)
var(--bloxs-font-semibold)
```

### Espaçamento

```css
var(--bloxs-space-2)       /* 8px */
var(--bloxs-space-4)       /* 16px */
var(--bloxs-space-6)       /* 24px */
var(--bloxs-space-8)       /* 32px */
```

### Outros

```css
/* Bordas */
var(--bloxs-border)
var(--bloxs-radius-base)
var(--bloxs-radius-xl)

/* Sombras */
var(--bloxs-shadow-sm)
var(--bloxs-shadow-lg)
var(--bloxs-shadow-focus)

/* Transições */
var(--bloxs-transition-base)
```

## 💡 Boas Práticas

### 1. Sempre Use os Componentes

```tsx
// ✅ BOM
import { Button } from '@/components/ds';
<Button variant="primary">Clique</Button>

// ❌ EVITE
<button className="bg-blue-500 text-white px-4 py-2">
  Clique
</button>
```

### 2. Use Variáveis CSS

```tsx
// ✅ BOM
<div className="bg-[var(--bloxs-white)] text-[var(--bloxs-navy)]">

// ❌ EVITE
<div className="bg-white text-[#0b1f3a]">
```

### 3. Consistência de Espaçamento

```tsx
// ✅ BOM - Use os tokens
<div className="p-[var(--bloxs-space-6)] gap-[var(--bloxs-space-4)]">

// ❌ EVITE - Valores aleatórios
<div className="p-7 gap-3.5">
```

### 4. Hierarquia de Títulos

```tsx
// ✅ BOM
<h1 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-4xl)]">
  Título Principal
</h1>

// ❌ EVITE
<div className="text-3xl font-bold">Título Principal</div>
```

## 🔧 Customização

Para customizar um componente, você pode:

1. **Passar className adicional:**

```tsx
<Button className="mt-4 w-full">
  Customizado
</Button>
```

2. **Sobrescrever variáveis CSS:**

```tsx
<div style={{ '--bloxs-navy': '#000000' } as React.CSSProperties}>
  <Button variant="primary">Botão Escuro</Button>
</div>
```

3. **Estender o componente:**

```tsx
import { Button } from '@/components/ds';

export function PrimaryButton(props) {
  return <Button variant="primary" {...props} />;
}
```

## 📖 Documentação Completa

Para documentação completa, consulte:
- `/DESIGN_SYSTEM.md` - Guia completo do design system
- `/design-system` - Página de demonstração interativa

## 🐛 Troubleshooting

**Problema:** Variáveis CSS não funcionam  
**Solução:** Verifique se `design-tokens.css` está importado em `index.css`

**Problema:** Componentes não encontrados  
**Solução:** Certifique-se de importar de `@/components/ds` ou do caminho correto

**Problema:** Estilos não aplicados  
**Solução:** Verifique se o Tailwind CSS está processando as classes corretamente

---

**Versão:** 1.0.0  
**Mantido por:** Equipe Bloxs IBaaS
