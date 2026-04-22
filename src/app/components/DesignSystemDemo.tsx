/**
 * Design System Demo Page
 * Demonstra todos os componentes do Design System Bloxs IBaaS
 */

import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  Textarea,
  Badge,
  KPICard,
  InfoBox,
  Stepper,
  Spinner
} from './ds';

export default function DesignSystemDemo() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen bg-[var(--bloxs-off-white)] p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-5xl)] font-semibold text-[var(--bloxs-navy)] tracking-tight mb-2">
            Bloxs IBaaS Design System
          </h1>
          <p className="text-[var(--bloxs-text-base)] text-[var(--bloxs-text-muted)]">
            Sistema de design completo para o portal de originadores
          </p>
        </div>

        {/* Colors Section */}
        <section className="mb-12">
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] font-semibold text-[var(--bloxs-navy)] mb-6">
            Paleta de Cores
          </h2>

          <div className="grid grid-cols-5 gap-4 mb-8">
            <div>
              <div className="h-20 bg-[var(--bloxs-navy)] rounded-lg mb-2"></div>
              <p className="text-xs text-[var(--bloxs-text-muted)]">Navy</p>
            </div>
            <div>
              <div className="h-20 bg-[var(--bloxs-blue)] rounded-lg mb-2"></div>
              <p className="text-xs text-[var(--bloxs-text-muted)]">Blue</p>
            </div>
            <div>
              <div className="h-20 bg-[var(--bloxs-success)] rounded-lg mb-2"></div>
              <p className="text-xs text-[var(--bloxs-text-muted)]">Success</p>
            </div>
            <div>
              <div className="h-20 bg-[var(--bloxs-warning)] rounded-lg mb-2"></div>
              <p className="text-xs text-[var(--bloxs-text-muted)]">Warning</p>
            </div>
            <div>
              <div className="h-20 bg-[var(--bloxs-error)] rounded-lg mb-2"></div>
              <p className="text-xs text-[var(--bloxs-text-muted)]">Error</p>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-12">
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] font-semibold text-[var(--bloxs-navy)] mb-6">
            Tipografia
          </h2>

          <Card padding="lg">
            <div className="space-y-4">
              <div>
                <h1 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-5xl)] font-semibold text-[var(--bloxs-navy)]">
                  Display XL - Playfair Display
                </h1>
              </div>
              <div>
                <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-4xl)] font-semibold text-[var(--bloxs-navy)]">
                  Display L - Playfair Display
                </h2>
              </div>
              <div>
                <p className="font-[var(--bloxs-font-body)] text-[var(--bloxs-text-base)] text-[var(--bloxs-text)]">
                  Body Text - Inter Regular - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <div>
                <p className="font-[var(--bloxs-font-body)] text-[var(--bloxs-text-sm)] font-semibold text-[var(--bloxs-text-muted)]">
                  Small Text - Inter Semibold - Informações secundárias
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] font-semibold text-[var(--bloxs-navy)] mb-6">
            Botões
          </h2>

          <Card padding="lg">
            <div className="flex flex-wrap gap-4 mb-6">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                icon={<i className="fas fa-plus"></i>}
                iconPosition="left"
              >
                Com Ícone
              </Button>
              <Button variant="primary" loading>
                Loading...
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </Card>
        </section>

        {/* Badges Section */}
        <section className="mb-12">
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] font-semibold text-[var(--bloxs-navy)] mb-6">
            Badges
          </h2>

          <Card padding="lg">
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Aprovado</Badge>
              <Badge variant="warning">Pendente</Badge>
              <Badge variant="error">Recusado</Badge>
              <Badge variant="gray">Inativo</Badge>
              <Badge variant="success" icon={<i className="fas fa-check"></i>}>
                Com Ícone
              </Badge>
            </div>
          </Card>
        </section>

        {/* Form Inputs Section */}
        <section className="mb-12">
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] font-semibold text-[var(--bloxs-navy)] mb-6">
            Inputs e Formulários
          </h2>

          <Card padding="lg">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="E-mail corporativo"
                placeholder="seu@email.com.br"
                helperText="Use seu e-mail profissional"
              />

              <Input
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                leftIcon={<i className="fas fa-building"></i>}
              />

              <Select
                label="Tipo de operação"
                options={[
                  { value: '', label: 'Selecione' },
                  { value: 'fidc', label: 'FIDC' },
                  { value: 'cri', label: 'CRI' },
                  { value: 'cra', label: 'CRA' }
                ]}
              />

              <Input
                label="Valor da operação"
                placeholder="R$ 0,00"
                rightIcon={<i className="fas fa-dollar-sign"></i>}
              />

              <div className="col-span-2">
                <Textarea
                  label="Descrição"
                  placeholder="Descreva os detalhes da operação..."
                  helperText="Máximo 500 caracteres"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* KPI Cards Section */}
        <section className="mb-12">
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] font-semibold text-[var(--bloxs-navy)] mb-6">
            KPI Cards
          </h2>

          <div className="grid grid-cols-4 gap-4">
            <KPICard
              label="Operações Ativas"
              value="7"
              subtitle="último mês"
              icon={<i className="fas fa-layer-group"></i>}
              trend="up"
              trendValue="+2"
            />
            <KPICard
              label="Volume Total"
              value="R$ 42,5M"
              subtitle="acumulado"
              icon={<i className="fas fa-chart-pie"></i>}
              trend="up"
              trendValue="+18%"
            />
            <KPICard
              label="Taxa Média"
              value="13,4%"
              subtitle="CDI + 5,2%"
              icon={<i className="fas fa-percentage"></i>}
              trend="neutral"
              trendValue="0%"
            />
            <KPICard
              label="Comissões"
              value="R$ 126k"
              subtitle="este mês"
              icon={<i className="fas fa-coins"></i>}
              trend="down"
              trendValue="-5%"
            />
          </div>
        </section>

        {/* InfoBox Section */}
        <section className="mb-12">
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] font-semibold text-[var(--bloxs-navy)] mb-6">
            Info Boxes
          </h2>

          <div className="space-y-4">
            <InfoBox variant="info" title="Informação Importante">
              A Resolução CVM 50 exige que todos os participantes do mercado de capitais sejam plenamente identificados.
            </InfoBox>

            <InfoBox variant="warning">
              <strong>Atenção:</strong> Seu cadastro regulatório precisa ser atualizado em até 30 dias.
            </InfoBox>

            <InfoBox variant="success" icon={<i className="fas fa-check-circle"></i>}>
              Cadastro aprovado com sucesso! Você já pode acessar todas as funcionalidades.
            </InfoBox>

            <InfoBox variant="error">
              Erro ao processar a operação. Por favor, verifique os dados e tente novamente.
            </InfoBox>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-12">
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] font-semibold text-[var(--bloxs-navy)] mb-6">
            Cards
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <Card hover>
              <CardHeader
                icon={<i className="fas fa-chart-line"></i>}
                action={<button className="text-[var(--bloxs-blue)] text-sm hover:underline">Ver mais</button>}
              >
                Volume por Setor
              </CardHeader>
              <CardBody>
                <p className="text-[var(--bloxs-text-muted)] text-sm">
                  Distribuição do volume de operações por setor econômico.
                </p>
              </CardBody>
            </Card>

            <Card hover>
              <CardHeader icon={<i className="fas fa-coins"></i>}>
                Comissões Recentes
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">FIDC Agro Premium</span>
                    <Badge variant="success">R$ 12,5k</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CRI Logística SP</span>
                    <Badge variant="success">R$ 8,2k</Badge>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Stepper Section */}
        <section className="mb-12">
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] font-semibold text-[var(--bloxs-navy)] mb-6">
            Steppers
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[var(--bloxs-navy)] mb-4">Vertical Stepper</h3>
              <Stepper
                currentStep={currentStep}
                orientation="vertical"
                steps={[
                  { label: 'KYC / CVM 50', description: 'Identificação empresarial' },
                  { label: 'Suitability', description: 'Perfil de investidor' },
                  { label: 'Beneficiários', description: 'Estrutura societária' },
                  { label: 'Conclusão', description: 'Acesso liberado' }
                ]}
              />
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                >
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                >
                  Próximo
                </Button>
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[var(--bloxs-navy)] mb-4">Horizontal Stepper</h3>
              <Stepper
                currentStep={currentStep}
                orientation="horizontal"
                steps={[
                  { label: 'Dados Básicos' },
                  { label: 'Documentos' },
                  { label: 'Revisão' },
                  { label: 'Conclusão' }
                ]}
              />
            </Card>
          </div>
        </section>

        {/* Spinner Section */}
        <section className="mb-12">
          <h2 className="font-[var(--bloxs-font-display)] text-[var(--bloxs-text-3xl)] font-semibold text-[var(--bloxs-navy)] mb-6">
            Loading Spinners
          </h2>

          <Card padding="lg">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-[var(--bloxs-navy)] mb-4">Tamanhos</h3>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="sm" />
                    <span className="text-xs text-[var(--bloxs-text-muted)]">Small</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="md" />
                    <span className="text-xs text-[var(--bloxs-text-muted)]">Medium</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="lg" />
                    <span className="text-xs text-[var(--bloxs-text-muted)]">Large</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="xl" />
                    <span className="text-xs text-[var(--bloxs-text-muted)]">Extra Large</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[var(--bloxs-navy)] mb-4">Cores</h3>
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner color="primary" />
                    <span className="text-xs text-[var(--bloxs-text-muted)]">Primary</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner color="secondary" />
                    <span className="text-xs text-[var(--bloxs-text-muted)]">Secondary</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 bg-[var(--bloxs-navy)] p-4 rounded">
                    <Spinner color="white" />
                    <span className="text-xs text-white">White</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Spinner color="muted" />
                    <span className="text-xs text-[var(--bloxs-text-muted)]">Muted</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[var(--bloxs-navy)] mb-4">Em Botões</h3>
                <div className="flex gap-3">
                  <Button variant="primary" loading>
                    Carregando...
                  </Button>
                  <Button variant="secondary" loading>
                    Processando...
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[var(--bloxs-border)]">
          <p className="text-[var(--bloxs-text-sm)] text-[var(--bloxs-text-muted)] text-center">
            Bloxs IBaaS Design System v1.0.0 · Última atualização: Abril 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
