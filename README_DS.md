# 🎨 Bloxs IBaaS - Design System

> Sistema de design completo e profissional para o portal Bloxs IBaaS

## 🚀 Quick Start

```tsx
// 1. Importar componentes
import { Button, Card, Input, Badge } from '@/components/ds';

// 2. Usar no código
<Card>
  <Input label="Nome" />
  <Button variant="primary">Salvar</Button>
</Card>
```

## 📚 Documentação

### 📖 Essencial
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Guia completo do design system
- **[Componentes (README)](./src/app/components/ds/README.md)** - Referência de API
- **[Demo Interativa](/design-system)** - Visualize todos os componentes

### 🤝 Contribuição
- **[CONTRIBUTING_DS.md](./CONTRIBUTING_DS.md)** - Como contribuir
- **[DS_INDEX.md](./DS_INDEX.md)** - Índice completo de toda documentação

### 📊 Resumo
- **[DESIGN_SYSTEM_SUMMARY.md](./DESIGN_SYSTEM_SUMMARY.md)** - Resumo executivo

## 🎯 O que está incluído

### Design Tokens
✅ 100+ variáveis CSS  
✅ Sistema de cores completo  
✅ Tipografia (Inter + Playfair Display)  
✅ Espaçamento, bordas, sombras  

### Componentes React
✅ Button (4 variantes)  
✅ Card (estruturado)  
✅ Input, Select, Textarea  
✅ Badge (6 variantes)  
✅ KPICard  
✅ InfoBox (4 variantes)  
✅ Stepper  
✅ PageHeader  
✅ Spinner  

### Documentação
✅ 5 arquivos de documentação  
✅ 1 página de demonstração  
✅ 50+ exemplos de código  

## 🎨 Paleta de Cores

```css
/* Primary */
--bloxs-navy: #0b1f3a
--bloxs-blue: #1a6edb

/* Semantic */
--bloxs-success: #059669
--bloxs-warning: #d97706
--bloxs-error: #dc2626
```

[Ver paleta completa →](./DESIGN_SYSTEM.md#paleta-de-cores)

## 💡 Exemplos Rápidos

### Button
```tsx
<Button variant="primary" size="md">
  Clique aqui
</Button>
```

### Card
```tsx
<Card hover>
  <CardHeader icon={<i className="fas fa-user" />}>
    Título
  </CardHeader>
  <CardBody>
    Conteúdo
  </CardBody>
</Card>
```

### KPI Card
```tsx
<KPICard
  label="Total"
  value="127"
  trend="up"
  trendValue="+12%"
/>
```

[Ver mais exemplos →](./src/app/components/ds/README.md)

## 🔗 Links Rápidos

| Recurso | Link |
|---------|------|
| Documentação Principal | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| API de Componentes | [ds/README.md](./src/app/components/ds/README.md) |
| Guia de Contribuição | [CONTRIBUTING_DS.md](./CONTRIBUTING_DS.md) |
| Índice Completo | [DS_INDEX.md](./DS_INDEX.md) |
| Resumo Executivo | [DESIGN_SYSTEM_SUMMARY.md](./DESIGN_SYSTEM_SUMMARY.md) |
| Demo Interativa | `/design-system` |

## 📦 Instalação

Já está instalado! Os componentes estão em:
```
src/app/components/ds/
```

## 🎓 Aprenda Mais

1. **Iniciante?** → [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
2. **Desenvolvedor?** → [ds/README.md](./src/app/components/ds/README.md)
3. **Contribuindo?** → [CONTRIBUTING_DS.md](./CONTRIBUTING_DS.md)
4. **Explorando?** → [/design-system](http://localhost:5173/design-system)

## ✨ Highlights

- 🎨 **100% Fiel** aos HTMLs originais
- 📱 **Responsivo** em todos os componentes
- ♿ **Acessível** com ARIA e semântica
- 🔒 **Type-Safe** com TypeScript
- 📖 **Documentado** extensivamente
- 🚀 **Pronto** para produção

## 🛠️ Stack

- React 18
- TypeScript
- Tailwind CSS 4
- CSS Variables (Design Tokens)
- Font Awesome 6
- Google Fonts (Inter, Playfair Display)

## 📄 Licença

Proprietário - Bloxs IBaaS

---

**Versão:** 1.0.0 | **Data:** Abril 2026

👉 **Comece aqui:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
