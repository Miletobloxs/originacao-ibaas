# Contribuindo para o Bloxs IBaaS Design System

Guia para contribuir com o design system e manter a consistência da interface.

## 📋 Sumário

- [Adicionando Novos Componentes](#adicionando-novos-componentes)
- [Modificando Componentes Existentes](#modificando-componentes-existentes)
- [Adicionando Tokens CSS](#adicionando-tokens-css)
- [Padrões de Código](#padrões-de-código)
- [Checklist de Contribuição](#checklist-de-contribuição)

## 🆕 Adicionando Novos Componentes

### 1. Estrutura do Componente

Crie um novo arquivo em `src/app/components/ds/`:

```tsx
// NomeDoComponente.tsx
import { ReactNode } from 'react';

interface NomeDoComponenteProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NomeDoComponente({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}: NomeDoComponenteProps) {
  return (
    <div className={`[estilos-base] ${className}`}>
      {children}
    </div>
  );
}
```

### 2. Use Variáveis CSS

Sempre use as variáveis do design system:

```tsx
// ✅ CORRETO
<div className="bg-[var(--bloxs-white)] text-[var(--bloxs-navy)]">

// ❌ INCORRETO
<div className="bg-white text-gray-900">
```

### 3. Exporte o Componente

Adicione a exportação em `src/app/components/ds/index.ts`:

```tsx
export { NomeDoComponente } from './NomeDoComponente';
```

### 4. Documente o Componente

Adicione um exemplo em `DesignSystemDemo.tsx`:

```tsx
<section className="mb-12">
  <h2>Nome do Componente</h2>
  <Card padding="lg">
    <NomeDoComponente variant="primary">
      Exemplo de uso
    </NomeDoComponente>
  </Card>
</section>
```

## 🔧 Modificando Componentes Existentes

### 1. Preservar Compatibilidade

Ao modificar, mantenha as props existentes:

```tsx
// ✅ CORRETO - Adicionar nova prop opcional
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // existente
  newProp?: boolean; // nova
}

// ❌ INCORRETO - Remover ou renomear prop existente
interface ButtonProps {
  type?: 'primary' | 'secondary'; // mudou o nome de 'variant'
}
```

### 2. Deprecar Gradualmente

Se precisar remover uma prop:

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  /** @deprecated Use 'variant' ao invés de 'type' */
  type?: 'primary' | 'secondary';
}

export function Button({ variant, type, ...props }: ButtonProps) {
  // Suportar ambos temporariamente
  const finalVariant = variant || type || 'primary';
  
  if (type) {
    console.warn('Button: "type" está deprecated, use "variant"');
  }
  
  // ... resto do código
}
```

## 🎨 Adicionando Tokens CSS

### 1. Adicione em design-tokens.css

```css
:root {
  /* Grupo apropriado */
  --bloxs-novo-token: valor;
}
```

### 2. Siga as Convenções de Nomenclatura

```css
/* Estrutura: --bloxs-[categoria]-[nome]-[variação] */

/* Cores */
--bloxs-color-brand-primary: #1a6edb;
--bloxs-color-semantic-success: #059669;

/* Espaçamento */
--bloxs-space-4: 16px;

/* Tipografia */
--bloxs-text-xl: 19px;
--bloxs-font-display: 'Playfair Display';

/* Bordas */
--bloxs-radius-lg: 8px;
--bloxs-border-medium: 1.5px;
```

### 3. Documente no DESIGN_SYSTEM.md

Adicione o novo token na documentação:

```markdown
### Novos Tokens

\`\`\`css
--bloxs-novo-token: valor     /* Descrição do uso */
\`\`\`
```

## 📝 Padrões de Código

### 1. TypeScript

- Use interfaces para props
- Tipos explícitos sempre que possível
- Evite `any`

```tsx
// ✅ CORRETO
interface ComponentProps {
  onClick: () => void;
  items: Array<{ id: string; name: string }>;
}

// ❌ INCORRETO
interface ComponentProps {
  onClick: any;
  items: any[];
}
```

### 2. Props Padrão

Use valores padrão nos parâmetros:

```tsx
// ✅ CORRETO
export function Component({
  variant = 'primary',
  size = 'md',
  disabled = false
}: ComponentProps) {
  // ...
}

// ❌ INCORRETO
export function Component(props: ComponentProps) {
  const variant = props.variant || 'primary';
  // ...
}
```

### 3. Composição

Permita composição através de `children`:

```tsx
// ✅ CORRETO - Flexível
<Card>
  <CardHeader>Título</CardHeader>
  <CardBody>Conteúdo</CardBody>
</Card>

// ❌ INCORRETO - Rígido
<Card title="Título" content="Conteúdo" />
```

### 4. Acessibilidade

Sempre considere acessibilidade:

```tsx
// ✅ CORRETO
<button
  aria-label="Fechar"
  onClick={onClose}
>
  <i className="fas fa-times" aria-hidden="true" />
</button>

// ❌ INCORRETO
<div onClick={onClose}>
  <i className="fas fa-times" />
</div>
```

### 5. Responsividade

Use classes responsivas quando apropriado:

```tsx
// ✅ CORRETO
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// ❌ INCORRETO (fixo)
<div className="grid grid-cols-4 gap-4">
```

## ✅ Checklist de Contribuição

Antes de submeter uma mudança no design system:

### Para Novos Componentes

- [ ] Componente criado em `src/app/components/ds/`
- [ ] Interface TypeScript definida com JSDoc
- [ ] Usa variáveis CSS do design system
- [ ] Props têm valores padrão apropriados
- [ ] Exportado em `index.ts`
- [ ] Exemplo adicionado em `DesignSystemDemo.tsx`
- [ ] Documentado em `README.md` do componente
- [ ] Testado em diferentes tamanhos de tela
- [ ] Testado com diferentes estados (hover, disabled, etc.)

### Para Modificações

- [ ] Compatibilidade com código existente mantida
- [ ] Props deprecadas marcadas com `@deprecated`
- [ ] Documentação atualizada
- [ ] Changelog atualizado
- [ ] Testado em todas as páginas que usam o componente

### Para Tokens CSS

- [ ] Token adicionado em `design-tokens.css`
- [ ] Nomenclatura segue o padrão
- [ ] Documentado em `DESIGN_SYSTEM.md`
- [ ] Usado em pelo menos um componente

## 🎯 Exemplos de Boas Práticas

### Exemplo 1: Componente Simples

```tsx
// Tooltip.tsx
import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * Tooltip para exibir informações adicionais ao passar o mouse
 * 
 * @example
 * <Tooltip content="Informação adicional" position="top">
 *   <button>Hover me</button>
 * </Tooltip>
 */
export function Tooltip({
  children,
  content,
  position = 'top',
  className = ''
}: TooltipProps) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className={`relative inline-block group ${className}`}>
      {children}
      <div 
        className={`
          absolute ${positions[position]}
          hidden group-hover:block
          px-[var(--bloxs-space-3)] py-[var(--bloxs-space-2)]
          bg-[var(--bloxs-navy)] text-[var(--bloxs-white)]
          text-[var(--bloxs-text-xs)] rounded-[var(--bloxs-radius-md)]
          whitespace-nowrap z-[var(--bloxs-z-tooltip)]
          pointer-events-none
        `}
        role="tooltip"
      >
        {content}
      </div>
    </div>
  );
}
```

### Exemplo 2: Componente Composto

```tsx
// Accordion.tsx
import { ReactNode, useState } from 'react';

interface AccordionProps {
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  expanded?: boolean;
  onChange?: (expanded: boolean) => void;
}

/**
 * Container para AccordionItems
 */
export function Accordion({ children, className = '' }: AccordionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Item individual do accordion
 */
export function AccordionItem({
  title,
  children,
  expanded: controlledExpanded,
  onChange
}: AccordionItemProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded ?? internalExpanded;

  const handleToggle = () => {
    const newState = !isExpanded;
    setInternalExpanded(newState);
    onChange?.(newState);
  };

  return (
    <div className="border border-[var(--bloxs-border)] rounded-[var(--bloxs-radius-lg)] overflow-hidden">
      <button
        onClick={handleToggle}
        className="
          w-full px-[var(--bloxs-space-6)] py-[var(--bloxs-space-4)]
          flex items-center justify-between
          bg-[var(--bloxs-white)] hover:bg-[var(--bloxs-gray-50)]
          text-left font-medium text-[var(--bloxs-navy)]
          transition-colors duration-[var(--bloxs-transition-base)]
        "
        aria-expanded={isExpanded}
      >
        <span>{title}</span>
        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[var(--bloxs-gray-400)]`} />
      </button>

      {isExpanded && (
        <div className="px-[var(--bloxs-space-6)] py-[var(--bloxs-space-4)] bg-[var(--bloxs-gray-50)] border-t border-[var(--bloxs-border)]">
          {children}
        </div>
      )}
    </div>
  );
}
```

## 🚫 Anti-Padrões

### ❌ Não Faça

```tsx
// Valores hardcoded
<div className="bg-blue-500 text-white p-4">

// Props sem tipos
function Component(props: any) {

// Estilos inline sem usar variáveis
<div style={{ color: '#0b1f3a', padding: '16px' }}>

// Div clicável sem semântica
<div onClick={handleClick}>Clique aqui</div>

// Sem acessibilidade
<i className="fas fa-times" onClick={onClose} />
```

### ✅ Faça

```tsx
// Use variáveis CSS
<div className="bg-[var(--bloxs-blue)] text-[var(--bloxs-white)] p-[var(--bloxs-space-4)]">

// Props tipadas
function Component({ variant }: { variant: 'primary' | 'secondary' }) {

// Variáveis CSS inline quando necessário
<div style={{ color: 'var(--bloxs-navy)', padding: 'var(--bloxs-space-4)' }}>

// Elementos semânticos
<button onClick={handleClick}>Clique aqui</button>

// Com acessibilidade
<button onClick={onClose} aria-label="Fechar">
  <i className="fas fa-times" aria-hidden="true" />
</button>
```

## 📞 Perguntas?

Se tiver dúvidas sobre contribuições para o design system:

1. Consulte a documentação completa em `/DESIGN_SYSTEM.md`
2. Veja exemplos em `/design-system` (página de demonstração)
3. Abra uma issue no repositório

---

**Obrigado por contribuir para o Bloxs IBaaS Design System!** 🎨
