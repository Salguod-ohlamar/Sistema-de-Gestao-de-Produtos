import { useState } from 'react'
import { Building2, RefreshCw, Shield, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/context'
import {
  useAdminCompanies,
  useAdminContacts,
  useAssignCompanyPlan,
  useSetAdminCollaboratorActive,
  useSetAdminCompanyActive,
  useSetContactHandled,
} from '@/features/admin/hooks/useAdmin'
import { ApiError, type AdminCompany, type ContactRequest } from '@/lib/api'
import { toast } from 'sonner'

type AdminTab = 'companies' | 'contacts'

function formatDate(value: string | null) {
  if (!value) return 'Não informado'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Não informado'
    : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date)
}

function segmentLabel(value: string) {
  const labels: Record<string, string> = {
    technology: 'Tecnologia',
    retail: 'Varejo',
    services: 'Serviços',
    industry: 'Indústria',
  }
  return labels[value] ?? value
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

interface CompanyCardProps {
  company: AdminCompany
  termMonths: string
  isUpdating: boolean
  onTermMonthsChange: (value: string) => void
  onAssignPlan: () => void
  onToggleActive: () => void
  onToggleCollaborator: (id: number, isActive: boolean) => void
}

function CompanyCard({
  company,
  termMonths,
  isUpdating,
  onTermMonthsChange,
  onAssignPlan,
  onToggleActive,
  onToggleCollaborator,
}: CompanyCardProps) {
  return (
    <Card className="space-y-5 border-border bg-surface-1 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-headline text-lg font-semibold text-text-primary">
            {company.trade_name}
          </h2>
          <p className="text-sm text-text-secondary">{company.legal_name}</p>
          <p className="mt-1 text-xs text-text-muted">{company.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={company.is_active ? 'success' : 'secondary'}>
            {company.is_active
              ? 'Ativa'
              : company.approved_at
                ? 'Inativa'
                : 'Aguardando aprovação'}
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUpdating}
            onClick={onToggleActive}
          >
            {company.is_active ? 'Desativar empresa' : 'Ativar empresa'}
          </Button>
        </div>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs text-text-muted">CNPJ</dt>
          <dd className="mt-1 text-text-primary">{company.cnpj}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">Telefone</dt>
          <dd className="mt-1 text-text-primary">{company.phone}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">Segmento</dt>
          <dd className="mt-1 text-text-primary">{segmentLabel(company.segment)}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">Cadastro</dt>
          <dd className="mt-1 text-text-primary">{formatDate(company.created_at)}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-2 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-text-primary">
            Plano {company.plan_code ?? 'não atribuído'}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {company.plan_started_at
              ? `Vigência: ${formatDate(company.plan_started_at)} a ${formatDate(company.plan_end_date)}`
              : 'Sem vigência cadastrada'}
          </p>
        </div>
        <div className="flex items-end gap-2">
          <label className="text-xs text-text-secondary">
            Prazo (meses)
            <Input
              type="number"
              min={1}
              max={120}
              value={termMonths}
              onChange={(event) => onTermMonthsChange(event.target.value)}
              className="mt-1 w-28"
            />
          </label>
          <Button type="button" variant="secondary" disabled={isUpdating} onClick={onAssignPlan}>
            Atribuir plano
          </Button>
        </div>
      </div>

      <details className="rounded-lg border border-border">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-text-primary">
          Colaboradores ({company.active_collaborator_count} ativos de {company.collaborator_count})
        </summary>
        <div className="divide-y divide-border border-t border-border">
          {company.collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm text-text-primary">{collaborator.name}</p>
                <p className="text-xs text-text-muted">
                  {collaborator.email} · {collaborator.role}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={collaborator.is_active ? 'success' : 'secondary'}>
                  {collaborator.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() => onToggleCollaborator(collaborator.id, !collaborator.is_active)}
                >
                  {collaborator.is_active ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            </div>
          ))}
          {company.collaborators.length === 0 && (
            <p className="px-4 py-3 text-sm text-text-muted">Nenhum colaborador cadastrado.</p>
          )}
        </div>
      </details>
    </Card>
  )
}

function ContactCard({
  contact,
  isUpdating,
  onToggle,
  onApprove,
}: {
  contact: ContactRequest
  isUpdating: boolean
  onToggle: () => void
  onApprove: (companyId: number) => void
}) {
  const sourceLabel = {
    contact: 'Entre em contato',
    company_registration: 'Cadastro de empresa',
    password_reset: 'Recuperação de senha',
  }[contact.source]
  const companyId =
    contact.source === 'company_registration' ? contact.company_id : null

  return (
    <Card className="flex flex-col gap-4 border-border bg-surface-1 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-text-primary">{contact.name || sourceLabel}</h2>
          <Badge variant={contact.handled ? 'success' : 'warning'}>
            {contact.handled ? 'Atendido' : 'Pendente'}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-text-secondary">{sourceLabel}</p>
        {contact.company_name && (
          <p className="mt-1 text-sm text-text-secondary">{contact.company_name}</p>
        )}
        <p className="mt-1 text-xs text-text-muted">
          {[contact.email, contact.phone].filter(Boolean).join(' · ')} · {formatDate(contact.created_at)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {!contact.handled && companyId !== null && (
          <Button
            type="button"
            disabled={isUpdating}
            onClick={() => onApprove(companyId)}
          >
            Aprovar empresa
          </Button>
        )}
        <Button type="button" variant="outline" disabled={isUpdating} onClick={onToggle}>
          {contact.handled ? 'Reabrir contato' : 'Marcar como atendido'}
        </Button>
      </div>
    </Card>
  )
}

export function AdminView() {
  const { user } = useAuth()
  const isRoot = user?.principalType === 'root'
  const companiesQuery = useAdminCompanies(isRoot)
  const contactsQuery = useAdminContacts(isRoot)
  const companyActiveMutation = useSetAdminCompanyActive()
  const collaboratorActiveMutation = useSetAdminCollaboratorActive()
  const assignPlanMutation = useAssignCompanyPlan()
  const contactHandledMutation = useSetContactHandled()
  const [tab, setTab] = useState<AdminTab>('companies')
  const [terms, setTerms] = useState<Record<number, string>>({})

  if (!isRoot) {
    return (
      <div className="p-8 text-center text-sm text-text-muted">
        Esta área é restrita à administração central.
      </div>
    )
  }

  const runAction = async (action: () => Promise<unknown>, successMessage: string) => {
    try {
      await action()
      toast.success(successMessage)
    } catch (error) {
      toast.error(errorMessage(error, 'Não foi possível concluir a operação.'))
    }
  }

  const updating =
    companyActiveMutation.isPending ||
    collaboratorActiveMutation.isPending ||
    assignPlanMutation.isPending

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="font-headline text-2xl font-bold text-text-primary">
              Administração central
            </h1>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            Empresas cadastradas, acessos e solicitações de contato.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            void companiesQuery.refetch()
            void contactsQuery.refetch()
          }}
          disabled={companiesQuery.isFetching || contactsQuery.isFetching}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </header>

      <div className="flex gap-2 border-b border-border">
        <button
          type="button"
          aria-pressed={tab === 'companies'}
          onClick={() => setTab('companies')}
          className={`px-4 py-3 text-sm ${
            tab === 'companies'
              ? 'border-b-2 border-primary font-semibold text-text-primary'
              : 'text-text-muted'
          }`}
        >
          <Building2 className="mr-2 inline h-4 w-4" />
          Empresas ({companiesQuery.data?.length ?? 0})
        </button>
        <button
          type="button"
          aria-pressed={tab === 'contacts'}
          onClick={() => setTab('contacts')}
          className={`px-4 py-3 text-sm ${
            tab === 'contacts'
              ? 'border-b-2 border-primary font-semibold text-text-primary'
              : 'text-text-muted'
          }`}
        >
          Contatos ({contactsQuery.data?.filter((contact) => !contact.handled).length ?? 0} pendentes)
        </button>
      </div>

      {tab === 'companies' ? (
        companiesQuery.isLoading ? (
          <p className="p-8 text-center text-sm text-text-secondary" role="status">
            Carregando empresas...
          </p>
        ) : companiesQuery.isError ? (
          <div role="alert" className="rounded-lg border border-status-error/30 p-5">
            <p className="text-sm text-status-error">
              {errorMessage(companiesQuery.error, 'Não foi possível carregar as empresas.')}
            </p>
            <Button className="mt-3" variant="outline" onClick={() => void companiesQuery.refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {companiesQuery.data?.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                termMonths={terms[company.id] ?? String(company.plan_term_months ?? 12)}
                isUpdating={updating}
                onTermMonthsChange={(value) =>
                  setTerms((current) => ({ ...current, [company.id]: value }))
                }
                onAssignPlan={() => {
                  const termMonths = Number(terms[company.id] ?? company.plan_term_months ?? 12)
                  if (!Number.isInteger(termMonths) || termMonths < 1 || termMonths > 120) {
                    toast.error('O prazo deve ser de 1 a 120 meses.')
                    return
                  }
                  void runAction(
                    () => assignPlanMutation.mutateAsync({ id: company.id, termMonths }),
                    'Plano atribuído à empresa.'
                  )
                }}
                onToggleActive={() =>
                  void runAction(
                    () =>
                      companyActiveMutation.mutateAsync({
                        id: company.id,
                        isActive: !company.is_active,
                      }),
                    company.is_active ? 'Empresa desativada.' : 'Empresa ativada.'
                  )
                }
                onToggleCollaborator={(id, isActive) =>
                  void runAction(
                    () => collaboratorActiveMutation.mutateAsync({ id, isActive }),
                    isActive ? 'Colaborador ativado.' : 'Colaborador desativado.'
                  )
                }
              />
            ))}
            {companiesQuery.data?.length === 0 && (
              <Card className="p-8 text-center text-sm text-text-muted">
                Nenhuma empresa cadastrada.
              </Card>
            )}
          </div>
        )
      ) : contactsQuery.isLoading ? (
        <p className="p-8 text-center text-sm text-text-secondary" role="status">
          Carregando contatos...
        </p>
      ) : contactsQuery.isError ? (
        <div role="alert" className="rounded-lg border border-status-error/30 p-5">
          <p className="text-sm text-status-error">
            {errorMessage(contactsQuery.error, 'Não foi possível carregar os contatos.')}
          </p>
          <Button className="mt-3" variant="outline" onClick={() => void contactsQuery.refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {contactsQuery.data?.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isUpdating={contactHandledMutation.isPending || companyActiveMutation.isPending}
              onToggle={() =>
                void runAction(
                  () =>
                    contactHandledMutation.mutateAsync({
                      id: contact.id,
                      handled: !contact.handled,
                    }),
                  contact.handled ? 'Contato reaberto.' : 'Contato marcado como atendido.'
                )
              }
              onApprove={(companyId) =>
                void runAction(
                  () => companyActiveMutation.mutateAsync({ id: companyId, isActive: true }),
                  'Cadastro aprovado. Empresa ativada.'
                )
              }
            />
          ))}
          {contactsQuery.data?.length === 0 && (
            <Card className="p-8 text-center text-sm text-text-muted">
              Nenhuma solicitação de contato.
            </Card>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Users className="h-4 w-4" />
        Ações administrativas são validadas também pelo backend.
      </div>
    </div>
  )
}
