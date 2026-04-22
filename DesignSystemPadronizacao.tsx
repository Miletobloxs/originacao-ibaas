import React, { useState } from 'react';
import { Button, Card, CardHeader, CardBody, Input, Select, Textarea, Badge, KPICard, InfoBox, Stepper, PageHeader } from './ds';

export default function DesignSystemPadronizacao() {
  const [activeTab, setActiveTab] = useState<'cores' | 'tipografia' | 'componentes' | 'layouts' | 'tokens'>('cores');

  return (
    <div className="min-h-screen bg-[var(--bloxs-off-white)]">
      {/* Header */}
      <div className="bg-[var(--bloxs-white)] border-b border-[var(--bloxs-border)] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--bloxs-navy)] to-[var(--bloxs-blue)] rounded-xl flex items-center justify-center">
              <i className="fas fa-palette text-white text-xl"></i>
            </div>
            <div>
              <h1 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-4xl)] font-semibold text-[var(--bloxs-navy)] m-0">
                Design System Bloxs
              </h1>
              <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] m-0">
                Padronização visual e componentes baseados no protótipo
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-[var(--bloxs-border)] -mb-[1px]">
            {[
              { id: 'cores', label: 'Cores', icon: 'fa-palette' },
              { id: 'tipografia', label: 'Tipografia', icon: 'fa-font' },
              { id: 'componentes', label: 'Componentes', icon: 'fa-cube' },
              { id: 'layouts', label: 'Layouts', icon: 'fa-th-large' },
              { id: 'tokens', label: 'Tokens CSS', icon: 'fa-code' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  px-6 py-3 font-medium text-[var(--bloxs-text-sm)] rounded-t-lg
                  transition-all duration-[var(--bloxs-transition-base)]
                  ${activeTab === tab.id
                    ? 'bg-[var(--bloxs-white)] text-[var(--bloxs-blue)] border-b-2 border-[var(--bloxs-blue)]'
                    : 'text-[var(--bloxs-text-muted)] hover:text-[var(--bloxs-text)] hover:bg-[var(--bloxs-gray-100)]'
                  }
                `}
              >
                <i className={`fas ${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {activeTab === 'cores' && <CoresTab />}
        {activeTab === 'tipografia' && <TypographyTab />}
        {activeTab === 'componentes' && <ComponentsTab />}
        {activeTab === 'layouts' && <LayoutsTab />}
        {activeTab === 'tokens' && <TokensTab />}
      </div>
    </div>
  );
}

// Tab: Cores
function CoresTab() {
  const colorSections = [
    {
      title: 'Cores Principais',
      subtitle: 'Identidade visual da marca Bloxs',
      colors: [
        { name: 'Navy', var: '--bloxs-navy', value: '#0b1f3a', usage: 'Títulos principais, navegação, elementos de alta hierarquia' },
        { name: 'Blue', var: '--bloxs-blue', value: '#1a6edb', usage: 'CTAs primários, links, elementos interativos' },
        { name: 'Light Blue', var: '--bloxs-light-blue', value: '#e6f2ff', usage: 'Backgrounds de destaque, hover states' }
      ]
    },
    {
      title: 'Cores Neutras',
      subtitle: 'Base para estrutura e conteúdo',
      colors: [
        { name: 'White', var: '--bloxs-white', value: '#ffffff', usage: 'Cards, modais, elementos elevados' },
        { name: 'Off White', var: '--bloxs-off-white', value: '#f7f9fc', usage: 'Background de páginas' },
        { name: 'Gray 100', var: '--bloxs-gray-100', value: '#f0f4f8', usage: 'Backgrounds secundários' },
        { name: 'Gray 200', var: '--bloxs-gray-200', value: '#e2e8f0', usage: 'Bordas, divisores' },
        { name: 'Gray 400', var: '--bloxs-gray-400', value: '#94a3b8', usage: 'Texto desabilitado' },
        { name: 'Gray 600', var: '--bloxs-gray-600', value: '#64748b', usage: 'Texto secundário' }
      ]
    },
    {
      title: 'Cores Semânticas',
      subtitle: 'Feedback e estados do sistema',
      colors: [
        { name: 'Success', var: '--bloxs-success', value: '#059669', usage: 'Sucesso, aprovação, confirmação' },
        { name: 'Success Light', var: '--bloxs-success-light', value: '#d1fae5', usage: 'Background de sucesso' },
        { name: 'Warning', var: '--bloxs-warning', value: '#d97706', usage: 'Atenção, alertas' },
        { name: 'Warning Light', var: '--bloxs-warning-light', value: '#fef3c7', usage: 'Background de aviso' },
        { name: 'Error', var: '--bloxs-error', value: '#dc2626', usage: 'Erros, ações destrutivas' },
        { name: 'Error Light', var: '--bloxs-error-light', value: '#fee2e2', usage: 'Background de erro' },
        { name: 'Info', var: '--bloxs-info', value: '#0284c7', usage: 'Informações, dicas' },
        { name: 'Info Light', var: '--bloxs-info-light', value: '#e0f2fe', usage: 'Background informativo' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {colorSections.map((section, idx) => (
        <Card key={idx}>
          <CardHeader>
            <div>
              <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
                {section.title}
              </h2>
              <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] mt-1 mb-0">
                {section.subtitle}
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.colors.map((color, i) => (
                <div key={i} className="space-y-3">
                  <div
                    className="h-24 rounded-lg shadow-[var(--bloxs-shadow-md)] border border-[var(--bloxs-border)]"
                    style={{ backgroundColor: `var(${color.var})` }}
                  ></div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-[var(--bloxs-text)] text-[var(--bloxs-text-base)] m-0">
                        {color.name}
                      </h3>
                      <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-text-muted)] bg-[var(--bloxs-gray-100)] px-2 py-1 rounded">
                        {color.value}
                      </code>
                    </div>
                    <code className="block text-[var(--bloxs-text-xs)] text-[var(--bloxs-blue)] bg-[var(--bloxs-light-blue)] px-2 py-1 rounded mb-2">
                      var({color.var})
                    </code>
                    <p className="text-[var(--bloxs-text-sm)] text-[var(--bloxs-text-muted)] m-0">
                      {color.usage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}

      {/* Gradientes */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
              Gradientes
            </h2>
            <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] mt-1 mb-0">
              Gradientes para elementos de destaque
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-24 rounded-lg shadow-[var(--bloxs-shadow-md)] bg-gradient-to-r from-[var(--bloxs-navy)] to-[var(--bloxs-blue)]"></div>
              <div>
                <h3 className="font-semibold text-[var(--bloxs-text)] text-[var(--bloxs-text-base)] mb-1">Primary Gradient</h3>
                <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-blue)] bg-[var(--bloxs-light-blue)] px-2 py-1 rounded block">
                  from-[var(--bloxs-navy)] to-[var(--bloxs-blue)]
                </code>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-24 rounded-lg shadow-[var(--bloxs-shadow-md)] bg-gradient-to-br from-[var(--bloxs-blue)] to-[var(--bloxs-navy)]"></div>
              <div>
                <h3 className="font-semibold text-[var(--bloxs-text)] text-[var(--bloxs-text-base)] mb-1">Secondary Gradient</h3>
                <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-blue)] bg-[var(--bloxs-light-blue)] px-2 py-1 rounded block">
                  from-[var(--bloxs-blue)] to-[var(--bloxs-navy)]
                </code>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Tab: Tipografia
function TypographyTab() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div>
            <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
              Famílias Tipográficas
            </h2>
            <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] mt-1 mb-0">
              Fonts utilizadas no sistema
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-[var(--bloxs-gray-100)] rounded-lg">
              <h3 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] text-[var(--bloxs-navy)] mb-2">
                Playfair Display
              </h3>
              <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] mb-4">
                Font display para títulos e elementos de destaque
              </p>
              <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-blue)] bg-[var(--bloxs-white)] px-3 py-1 rounded block w-fit">
                font-[var(--bloxs-font-display)]
              </code>
            </div>
            <div className="p-6 bg-[var(--bloxs-gray-100)] rounded-lg">
              <h3 className="font-[var(--bloxs-font-body)] text-[var(--bloxs-text-xl)] text-[var(--bloxs-navy)] mb-2">
                Inter
              </h3>
              <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] mb-4">
                Font body para texto corrido, labels e UI
              </p>
              <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-blue)] bg-[var(--bloxs-white)] px-3 py-1 rounded block w-fit">
                font-[var(--bloxs-font-body)]
              </code>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
              Escala Tipográfica
            </h2>
            <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] mt-1 mb-0">
              Hierarquia de tamanhos de texto
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            {[
              { size: '4xl', value: '28px', usage: 'Page titles', example: 'Dashboard Principal' },
              { size: '3xl', value: '26px', usage: 'Section titles, KPI values', example: 'Originações Ativas' },
              { size: '2xl', value: '20px', usage: 'Card headers', example: 'Últimas Operações' },
              { size: 'xl', value: '17px', usage: 'Subtitles', example: 'Total de Investidores' },
              { size: 'lg', value: '15px', usage: 'Emphasized text', example: 'Informação Importante' },
              { size: 'md', value: '14px', usage: 'Buttons, tabs', example: 'Salvar Alterações' },
              { size: 'base', value: '13.5px', usage: 'Body text (default)', example: 'Este é o texto padrão usado em parágrafos' },
              { size: 'sm', value: '12.5px', usage: 'Secondary text, captions', example: 'Texto secundário ou legendas' },
              { size: 'xs', value: '11px', usage: 'Labels, small text', example: 'Labels e micro textos' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 p-4 bg-[var(--bloxs-gray-100)] rounded-lg">
                <div className="w-32 flex-shrink-0">
                  <div className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)] mb-1">
                    {item.size.toUpperCase()}
                  </div>
                  <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-blue)] bg-[var(--bloxs-white)] px-2 py-1 rounded block w-fit mb-1">
                    {item.value}
                  </code>
                  <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-text-muted)] block">
                    --bloxs-text-{item.size}
                  </code>
                </div>
                <div className="flex-1">
                  <div className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-xs)] mb-2">
                    {item.usage}
                  </div>
                  <div
                    className={`text-[var(--bloxs-navy)] ${item.size === '4xl' || item.size === '3xl' ? 'font-[var(--bloxs-font-display)]' : 'font-[var(--bloxs-font-body)]'}`}
                    style={{ fontSize: `var(--bloxs-text-${item.size})` }}
                  >
                    {item.example}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
              Pesos de Fonte
            </h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { weight: '400', name: 'Regular', usage: 'Texto corrido, padrão' },
              { weight: '500', name: 'Medium', usage: 'Labels, pequenos destaques' },
              { weight: '600', name: 'Semibold', usage: 'Subtítulos, navegação' },
              { weight: '700', name: 'Bold', usage: 'Títulos, forte destaque' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-4 bg-[var(--bloxs-gray-100)] rounded-lg">
                <div className="w-32">
                  <div className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)]">{item.name}</div>
                  <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-text-muted)]">{item.weight}</code>
                </div>
                <div className="flex-1">
                  <div
                    className="text-[var(--bloxs-text-xl)] text-[var(--bloxs-navy)]"
                    style={{ fontWeight: item.weight }}
                  >
                    The quick brown fox jumps
                  </div>
                  <div className="text-[var(--bloxs-text-sm)] text-[var(--bloxs-text-muted)] mt-1">
                    {item.usage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Tab: Componentes
function ComponentsTab() {
  return (
    <div className="space-y-8">
      {/* Buttons */}
      <Card>
        <CardHeader>
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
            Buttons
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <div>
              <h3 className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)] mb-3">Variantes</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            <div>
              <h3 className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)] mb-3">Tamanhos</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div>
              <h3 className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)] mb-3">Com Ícones</h3>
              <div className="flex flex-wrap gap-3">
                <Button icon={<i className="fas fa-plus" />}>Adicionar</Button>
                <Button variant="secondary" icon={<i className="fas fa-download" />}>Download</Button>
                <Button variant="outline" icon={<i className="fas fa-edit" />} iconPosition="right">Editar</Button>
              </div>
            </div>
            <div>
              <h3 className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)] mb-3">Estados</h3>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
            Badges
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Aprovado</Badge>
              <Badge variant="warning">Pendente</Badge>
              <Badge variant="error">Recusado</Badge>
              <Badge variant="gray">Inativo</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success" icon={<i className="fas fa-check" />}>Com Ícone</Badge>
              <Badge variant="warning" size="sm">Small</Badge>
              <Badge variant="error" size="md">Medium</Badge>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
            Form Inputs
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-6 max-w-2xl">
            <Input
              label="Input Padrão"
              placeholder="Digite algo..."
            />
            <Input
              label="Com Ícone"
              placeholder="seu@email.com"
              leftIcon={<i className="fas fa-envelope" />}
            />
            <Input
              label="Com Erro"
              placeholder="Digite seu CPF"
              error="Campo obrigatório"
            />
            <Select
              label="Select"
              options={[
                { value: '1', label: 'Opção 1' },
                { value: '2', label: 'Opção 2' },
                { value: '3', label: 'Opção 3' }
              ]}
            />
            <Textarea
              label="Textarea"
              placeholder="Digite uma descrição..."
              rows={4}
            />
          </div>
        </CardBody>
      </Card>

      {/* KPI Cards */}
      <Card>
        <CardHeader>
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
            KPI Cards
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              label="Total Originado"
              value="R$ 12,5M"
              icon={<i className="fas fa-chart-line" />}
              trend="up"
              trendValue="+23%"
            />
            <KPICard
              label="Operações Ativas"
              value="127"
              icon={<i className="fas fa-file-invoice-dollar" />}
              trend="up"
              trendValue="+12"
            />
            <KPICard
              label="Taxa Média"
              value="14,2%"
              icon={<i className="fas fa-percent" />}
              trend="neutral"
            />
            <KPICard
              label="Inadimplência"
              value="2,1%"
              icon={<i className="fas fa-exclamation-triangle" />}
              trend="down"
              trendValue="-0,5%"
            />
          </div>
        </CardBody>
      </Card>

      {/* Info Boxes */}
      <Card>
        <CardHeader>
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
            Info Boxes
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <InfoBox variant="info" title="Informação">
              Este é um box informativo para mensagens gerais
            </InfoBox>
            <InfoBox variant="success" title="Sucesso">
              Operação realizada com sucesso!
            </InfoBox>
            <InfoBox variant="warning" title="Atenção">
              Prazo para envio de documentos termina em 3 dias
            </InfoBox>
            <InfoBox variant="error" title="Erro">
              Não foi possível processar a solicitação
            </InfoBox>
          </div>
        </CardBody>
      </Card>

      {/* Stepper */}
      <Card>
        <CardHeader>
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
            Stepper
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-8">
            <div>
              <h3 className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)] mb-4">Horizontal</h3>
              <Stepper
                orientation="horizontal"
                currentStep={2}
                steps={[
                  { label: 'Dados Cadastrais', description: 'KYC e informações básicas' },
                  { label: 'Suitability', description: 'Perfil de investidor' },
                  { label: 'Beneficiários', description: 'Estrutura societária' },
                  { label: 'Conclusão', description: 'Revisão e envio' }
                ]}
              />
            </div>
            <div>
              <h3 className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)] mb-4">Vertical</h3>
              <Stepper
                orientation="vertical"
                currentStep={1}
                steps={[
                  { label: 'Dados Cadastrais', description: 'KYC e informações básicas' },
                  { label: 'Suitability', description: 'Perfil de investidor' },
                  { label: 'Beneficiários', description: 'Estrutura societária' }
                ]}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Tab: Layouts
function LayoutsTab() {
  return (
    <div className="space-y-8">
      {/* Grid KPIs */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
              Grid de KPIs
            </h2>
            <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] mt-1 mb-0">
              Layout padrão para dashboard com métricas
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-4">
            <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-blue)] bg-[var(--bloxs-light-blue)] px-3 py-2 rounded block">
              &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"&gt;
            </code>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard label="KPI 1" value="100" icon={<i className="fas fa-chart-line" />} />
            <KPICard label="KPI 2" value="250" icon={<i className="fas fa-users" />} />
            <KPICard label="KPI 3" value="75%" icon={<i className="fas fa-percent" />} />
            <KPICard label="KPI 4" value="R$ 1M" icon={<i className="fas fa-dollar-sign" />} />
          </div>
        </CardBody>
      </Card>

      {/* Grid Cards */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
              Grid de Cards
            </h2>
            <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] mt-1 mb-0">
              Layout responsivo para conteúdo em cards
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-4">
            <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-blue)] bg-[var(--bloxs-light-blue)] px-3 py-2 rounded block">
              &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
            </code>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} hover>
                <CardHeader icon={<i className="fas fa-file-alt" />}>
                  Card {i}
                </CardHeader>
                <CardBody>
                  <p className="text-[var(--bloxs-text-sm)] text-[var(--bloxs-text-muted)] m-0">
                    Conteúdo do card com informações relevantes
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
              Layout de Formulário
            </h2>
            <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] mt-1 mb-0">
              Grid responsivo para inputs
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="max-w-4xl">
            <div className="mb-4">
              <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-blue)] bg-[var(--bloxs-light-blue)] px-3 py-2 rounded block">
                &lt;div className="grid grid-cols-1 md:grid-cols-2 gap-4"&gt;
              </code>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input label="Nome Completo" placeholder="Digite o nome" />
              <Input label="CPF/CNPJ" placeholder="000.000.000-00" />
              <Input label="E-mail" placeholder="seu@email.com" />
              <Input label="Telefone" placeholder="(00) 00000-0000" />
              <div className="md:col-span-2">
                <Input label="Endereço" placeholder="Rua, número, bairro" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth>Cancelar</Button>
              <Button variant="primary" fullWidth>Salvar</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Sidebar + Content */}
      <Card>
        <CardHeader>
          <div>
            <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
              Sidebar + Content
            </h2>
            <p className="text-[var(--bloxs-text-muted)] text-[var(--bloxs-text-sm)] mt-1 mb-0">
              Layout com navegação lateral
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="mb-4">
            <code className="text-[var(--bloxs-text-xs)] text-[var(--bloxs-blue)] bg-[var(--bloxs-light-blue)] px-3 py-2 rounded block">
              &lt;div className="flex gap-6"&gt; ... &lt;/div&gt;
            </code>
          </div>
          <div className="flex gap-6 bg-[var(--bloxs-gray-100)] p-6 rounded-lg">
            {/* Sidebar */}
            <div className="w-64 bg-[var(--bloxs-white)] rounded-lg p-4 space-y-2">
              <div className="px-3 py-2 bg-[var(--bloxs-light-blue)] text-[var(--bloxs-blue)] rounded font-medium text-[var(--bloxs-text-sm)]">
                <i className="fas fa-home mr-2"></i> Dashboard
              </div>
              <div className="px-3 py-2 text-[var(--bloxs-text-muted)] hover:bg-[var(--bloxs-gray-100)] rounded text-[var(--bloxs-text-sm)]">
                <i className="fas fa-chart-line mr-2"></i> Relatórios
              </div>
              <div className="px-3 py-2 text-[var(--bloxs-text-muted)] hover:bg-[var(--bloxs-gray-100)] rounded text-[var(--bloxs-text-sm)]">
                <i className="fas fa-cog mr-2"></i> Configurações
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 bg-[var(--bloxs-white)] rounded-lg p-6">
              <h3 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-xl)] font-semibold text-[var(--bloxs-navy)] mb-3">
                Conteúdo Principal
              </h3>
              <p className="text-[var(--bloxs-text-sm)] text-[var(--bloxs-text-muted)]">
                Área de conteúdo com informações e componentes
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Tab: Tokens CSS
function TokensTab() {
  const tokenGroups = [
    {
      title: 'Cores',
      tokens: [
        { name: '--bloxs-navy', value: '#0b1f3a' },
        { name: '--bloxs-blue', value: '#1a6edb' },
        { name: '--bloxs-white', value: '#ffffff' },
        { name: '--bloxs-off-white', value: '#f7f9fc' },
        { name: '--bloxs-success', value: '#059669' },
        { name: '--bloxs-warning', value: '#d97706' },
        { name: '--bloxs-error', value: '#dc2626' }
      ]
    },
    {
      title: 'Tipografia',
      tokens: [
        { name: '--bloxs-font-display', value: 'Playfair Display' },
        { name: '--bloxs-font-body', value: 'Inter' },
        { name: '--bloxs-text-xs', value: '11px' },
        { name: '--bloxs-text-sm', value: '12.5px' },
        { name: '--bloxs-text-base', value: '13.5px' },
        { name: '--bloxs-text-md', value: '14px' },
        { name: '--bloxs-text-lg', value: '15px' },
        { name: '--bloxs-text-xl', value: '17px' },
        { name: '--bloxs-text-2xl', value: '20px' },
        { name: '--bloxs-text-3xl', value: '26px' },
        { name: '--bloxs-text-4xl', value: '28px' }
      ]
    },
    {
      title: 'Espaçamento',
      tokens: [
        { name: '--bloxs-space-1', value: '4px' },
        { name: '--bloxs-space-2', value: '8px' },
        { name: '--bloxs-space-3', value: '12px' },
        { name: '--bloxs-space-4', value: '16px' },
        { name: '--bloxs-space-5', value: '20px' },
        { name: '--bloxs-space-6', value: '24px' },
        { name: '--bloxs-space-8', value: '32px' },
        { name: '--bloxs-space-10', value: '40px' }
      ]
    },
    {
      title: 'Bordas & Sombras',
      tokens: [
        { name: '--bloxs-radius-sm', value: '4px' },
        { name: '--bloxs-radius-base', value: '7px' },
        { name: '--bloxs-radius-lg', value: '8px' },
        { name: '--bloxs-radius-xl', value: '10px' },
        { name: '--bloxs-shadow-sm', value: '0 1px 2px rgba(0,0,0,0.05)' },
        { name: '--bloxs-shadow-md', value: '0 2px 8px rgba(0,0,0,0.04)' },
        { name: '--bloxs-shadow-lg', value: '0 4px 16px rgba(0,0,0,0.06)' }
      ]
    },
    {
      title: 'Transições',
      tokens: [
        { name: '--bloxs-transition-base', value: '0.18s cubic-bezier(0.4, 0, 0.2, 1)' },
        { name: '--bloxs-transition-fast', value: '0.12s cubic-bezier(0.4, 0, 0.2, 1)' },
        { name: '--bloxs-transition-slow', value: '0.3s cubic-bezier(0.4, 0, 0.2, 1)' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <InfoBox variant="info">
        <strong>Todas as variáveis CSS</strong> estão definidas em <code className="text-[var(--bloxs-blue)] bg-[var(--bloxs-light-blue)] px-2 py-1 rounded">src/styles/design-tokens.css</code>
      </InfoBox>

      {tokenGroups.map((group, idx) => (
        <Card key={idx}>
          <CardHeader>
            <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
              {group.title}
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {group.tokens.map((token, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[var(--bloxs-gray-100)] rounded hover:bg-[var(--bloxs-gray-200)] transition-colors"
                >
                  <code className="text-[var(--bloxs-text-sm)] text-[var(--bloxs-blue)] font-mono">
                    var({token.name})
                  </code>
                  <span className="text-[var(--bloxs-text-sm)] text-[var(--bloxs-text-muted)]">
                    {token.value}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}

      {/* Exemplo de Uso */}
      <Card>
        <CardHeader>
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-2xl)] font-semibold text-[var(--bloxs-navy)] m-0">
            Como Usar os Tokens
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <h3 className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)] mb-2">
                Em Tailwind CSS
              </h3>
              <pre className="bg-[var(--bloxs-navy)] text-[var(--bloxs-white)] p-4 rounded-lg overflow-x-auto text-[var(--bloxs-text-sm)]">
{`<div className="bg-[var(--bloxs-blue)] text-[var(--bloxs-white)] p-[var(--bloxs-space-4)] rounded-[var(--bloxs-radius-lg)]">
  Conteúdo
</div>`}
              </pre>
            </div>
            <div>
              <h3 className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)] mb-2">
                Em CSS Puro
              </h3>
              <pre className="bg-[var(--bloxs-navy)] text-[var(--bloxs-white)] p-4 rounded-lg overflow-x-auto text-[var(--bloxs-text-sm)]">
{`.meu-componente {
  background: var(--bloxs-blue);
  color: var(--bloxs-white);
  padding: var(--bloxs-space-4);
  border-radius: var(--bloxs-radius-lg);
  transition: var(--bloxs-transition-base);
}`}
              </pre>
            </div>
            <div>
              <h3 className="text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-navy)] mb-2">
                Em Inline Style
              </h3>
              <pre className="bg-[var(--bloxs-navy)] text-[var(--bloxs-white)] p-4 rounded-lg overflow-x-auto text-[var(--bloxs-text-sm)]">
{`<div style={{
  backgroundColor: 'var(--bloxs-blue)',
  padding: 'var(--bloxs-space-4)'
}}>
  Conteúdo
</div>`}
              </pre>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
