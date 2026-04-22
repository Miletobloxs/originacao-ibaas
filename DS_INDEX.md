# Bloxs IBaaS Design System - Índice Completo

Navegação completa de toda a documentação do design system.

## 📚 Documentação Principal

### [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
**Guia Completo do Design System**
- Princípios de Design
- Paleta de Cores (Brand, Neutras, Semânticas)
- Tipografia (Famílias, Tamanhos, Pesos)
- Espaçamento
- Componentes (Documentação de uso)
- Bordas e Sombras
- Transições
- Breakpoints
- Exemplos de Uso

### [CONTRIBUTING_DS.md](./CONTRIBUTING_DS.md)
**Guia de Contribuição**
- Como Adicionar Novos Componentes
- Como Modificar Componentes Existentes
- Como Adicionar Tokens CSS
- Padrões de Código
- Checklist de Contribuição
- Exemplos de Boas Práticas
- Anti-Padrões

### [src/app/components/ds/README.md](./src/app/components/ds/README.md)
**Guia de Uso Rápido**
- Quick Start
- Documentação de Componentes Individuais
- Variáveis CSS Disponíveis
- Boas Práticas
- Customização
- Troubleshooting

## 🎨 Arquivos de Código

### Design Tokens
**[src/styles/design-tokens.css](./src/styles/design-tokens.css)**
```
├── Cores (Brand, Neutras, Semânticas)
├── Tipografia (Famílias, Tamanhos, Pesos, Line Heights, Letter Spacing)
├── Espaçamento (scale de 4px)
├── Bordas & Radius
├── Sombras
├── Transições
├── Z-Index Layers
└── Component Specific Variables
```

### Componentes

**[src/app/components/ds/](./src/app/components/ds/)**

#### Estruturais
- `Button.tsx` - Botões com variantes e tamanhos
- `Card.tsx` - Cards, CardHeader, CardBody
- `PageHeader.tsx` - Cabeçalho de página padronizado

#### Formulários
- `Input.tsx` - Input, Select, Textarea

#### Feedback & Status
- `Badge.tsx` - Tags e indicadores de status
- `InfoBox.tsx` - Caixas de informação/alerta

#### Dados & Métricas
- `KPICard.tsx` - Cards de KPI e métricas

#### Navegação
- `Stepper.tsx` - Indicadores de progresso

#### Exports
- `index.ts` - Exports centralizados de todos os componentes

## 🎯 Páginas de Demonstração

### [src/app/components/DesignSystemDemo.tsx](./src/app/components/DesignSystemDemo.tsx)
**Página Interativa de Demonstração**

Acesse em: `/design-system`

Demonstra:
- ✅ Paleta de Cores
- ✅ Tipografia
- ✅ Botões (variantes, tamanhos, estados)
- ✅ Badges (todas as variantes)
- ✅ Inputs e Formulários
- ✅ KPI Cards
- ✅ Info Boxes
- ✅ Cards
- ✅ Steppers (vertical e horizontal)

## 📖 Referência Rápida

### Componentes por Categoria

#### 🔘 **Ações**
```tsx
<Button variant="primary" size="md" />
```

#### 📦 **Containers**
```tsx
<Card>
  <CardHeader />
  <CardBody />
</Card>
```

#### 📝 **Formulários**
```tsx
<Input label="Campo" />
<Select options={[]} />
<Textarea />
```

#### 🏷️ **Status**
```tsx
<Badge variant="success" />
<InfoBox variant="info" />
```

#### 📊 **Dados**
```tsx
<KPICard label="Métrica" value="100" />
```

#### 🧭 **Navegação**
```tsx
<Stepper currentStep={2} steps={[]} />
<PageHeader title="Título" />
```

### Tokens CSS Mais Usados

#### Cores
```css
var(--bloxs-navy)          /* #0b1f3a */
var(--bloxs-blue)          /* #1a6edb */
var(--bloxs-white)         /* #ffffff */
var(--bloxs-gray-100)      /* #f0f4f8 */
var(--bloxs-success)       /* #059669 */
var(--bloxs-warning)       /* #d97706 */
var(--bloxs-error)         /* #dc2626 */
```

#### Tipografia
```css
var(--bloxs-font-display)  /* Playfair Display */
var(--bloxs-font-body)     /* Inter */
var(--bloxs-text-sm)       /* 12.5px */
var(--bloxs-text-base)     /* 13.5px */
var(--bloxs-text-3xl)      /* 26px */
var(--bloxs-text-4xl)      /* 28px */
```

#### Espaçamento
```css
var(--bloxs-space-2)       /* 8px */
var(--bloxs-space-4)       /* 16px */
var(--bloxs-space-6)       /* 24px */
var(--bloxs-space-8)       /* 32px */
```

#### Outros
```css
var(--bloxs-radius-base)   /* 7px */
var(--bloxs-radius-xl)     /* 10px */
var(--bloxs-shadow-lg)     /* 0 4px 16px rgba(0,0,0,0.06) */
var(--bloxs-transition-base) /* 0.18s */
```

## 🚀 Como Começar

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Importar Componentes
```tsx
import { Button, Card, Input } from '@/components/ds';
```

### 3. Usar no Código
```tsx
<Card>
  <CardHeader icon={<i className="fas fa-user" />}>
    Meu Card
  </CardHeader>
  <CardBody>
    <Input label="Nome" />
    <Button variant="primary">Salvar</Button>
  </CardBody>
</Card>
```

### 4. Ver Demonstração
```
http://localhost:5173/design-system
```

## 📋 Checklist para Desenvolvedores

Ao criar uma nova tela/componente:

- [ ] Usar componentes do DS sempre que possível
- [ ] Usar variáveis CSS (`var(--bloxs-*)`)
- [ ] Seguir hierarquia de tipografia (Display para títulos, Body para texto)
- [ ] Usar espaçamento consistente (múltiplos de 4px via tokens)
- [ ] Aplicar cores semânticas (success, warning, error)
- [ ] Garantir responsividade
- [ ] Testar estados (hover, focus, disabled)
- [ ] Verificar acessibilidade (aria-labels, semântica)

## 🔍 Busca Rápida

### Preciso de...

**Um botão?** → `Button.tsx`  
**Um card?** → `Card.tsx`  
**Um campo de texto?** → `Input.tsx`  
**Um select/dropdown?** → `Input.tsx` (componente Select)  
**Uma tag de status?** → `Badge.tsx`  
**Uma mensagem de alerta?** → `InfoBox.tsx`  
**Um indicador de métrica?** → `KPICard.tsx`  
**Um stepper de processo?** → `Stepper.tsx`  
**Um cabeçalho de página?** → `PageHeader.tsx`  

### Preciso saber...

**Quais cores usar?** → `DESIGN_SYSTEM.md` → Paleta de Cores  
**Que tamanhos de fonte?** → `DESIGN_SYSTEM.md` → Tipografia  
**Como espaçar elementos?** → `DESIGN_SYSTEM.md` → Espaçamento  
**Como contribuir?** → `CONTRIBUTING_DS.md`  
**Exemplos de uso?** → `ds/README.md` ou `/design-system` (demo)  

## 🎓 Recursos de Aprendizado

### Para Iniciantes
1. Leia `DESIGN_SYSTEM.md` (Visão Geral)
2. Veja `/design-system` (Demonstração Interativa)
3. Consulte `ds/README.md` (Guia de Uso Rápido)

### Para Desenvolvedores
1. `ds/README.md` (Referência de API)
2. `CONTRIBUTING_DS.md` (Boas Práticas)
3. `design-tokens.css` (Tokens Disponíveis)

### Para Designers
1. `DESIGN_SYSTEM.md` (Princípios e Paletas)
2. `/design-system` (Visualização de Componentes)
3. Figma HTMLs de Referência em `src/imports/`

## 📞 Suporte

- 📖 **Documentação:** Consulte os arquivos acima
- 🎨 **Demo Interativa:** `/design-system`
- 🐛 **Issues:** Abra uma issue no repositório
- 💬 **Dúvidas:** Consulte `CONTRIBUTING_DS.md`

## 📊 Estatísticas do Design System

- **Componentes:** 8 principais + variações
- **Tokens CSS:** 100+ variáveis
- **Cores:** 25+ tokens de cor
- **Tamanhos de Fonte:** 10 níveis
- **Espaçamento:** 12 níveis
- **Documentação:** 4 arquivos principais
- **Exemplos:** 1 página demo completa

## 🗺️ Roadmap

### Versão Atual (1.0.0)
- ✅ Design Tokens completos
- ✅ 8 componentes principais
- ✅ Documentação completa
- ✅ Página de demonstração

### Próximas Versões
- ⏳ Tooltip
- ⏳ Modal/Dialog
- ⏳ Accordion
- ⏳ Dropdown Menu
- ⏳ Tabs
- ⏳ Toast/Notification
- ⏳ Data Table
- ⏳ Charts (integração com Recharts)

## 📝 Changelog

### v1.0.0 (2026-04-21)
- Design System inicial
- Componentes base (Button, Card, Input, Badge, etc.)
- Design Tokens completos
- Documentação completa
- Página de demonstração

---

**Versão:** 1.0.0  
**Última Atualização:** 21 de Abril, 2026  
**Mantido por:** Equipe Bloxs IBaaS

Para começar, acesse: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
