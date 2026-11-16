import { useState } from 'react'
import {
  Camera,
  Shield,
  FolderSync,
  Tag,
  Boxes,
  CheckCircle2,
  Send,
  Loader2,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface UserDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

type RoleType = 'admin' | 'gerente' | 'vendedor' | 'estoquista'

export function UserDrawer({ open, onOpenChange, onSuccess }: UserDrawerProps) {
  const [role, setRole] = useState<RoleType>('gerente')
  const [name, setName] = useState('Mariana Siqueira')
  const [email, setEmail] = useState('mariana.s@nexora.io')
  const [phone, setPhone] = useState('(11) 98765-4321')
  const [sendInvite, setSendInvite] = useState(true)
  const [requirePasswordChange, setRequirePasswordChange] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Matriz de permissões
  const [permissions, setPermissions] = useState({
    dashboard: { view: true, create: false, edit: true, delete: false },
    produtos: { view: true, create: true, edit: true, delete: false },
    usuarios: { view: true, create: true, edit: true, delete: false },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      toast.success(`Convite institucional enviado para ${email}`)
      onSuccess?.()
      onOpenChange(false)
    }, 700)
  }

  const roleOptions = [
    {
      id: 'admin' as RoleType,
      title: 'Administrador',
      desc: 'Acesso irrestrito a todos os módulos e faturamento',
      icon: Shield,
    },
    {
      id: 'gerente' as RoleType,
      title: 'Gerente',
      desc: 'Relatórios, produtos e gestão de equipe operacional',
      icon: FolderSync,
    },
    {
      id: 'vendedor' as RoleType,
      title: 'Vendedor',
      desc: 'Frente de caixa (PDV) e consulta de pedidos',
      icon: Tag,
    },
    {
      id: 'estoquista' as RoleType,
      title: 'Estoquista',
      desc: 'Movimentação física e controle de estoque',
      icon: Boxes,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[440px] bg-surface-2 border-l border-border p-0 flex flex-col justify-between"
      >
        {/* Cabeçalho do Drawer */}
        <SheetHeader className="h-[72px] px-6 bg-surface-2 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex flex-col text-left">
            <SheetTitle className="font-headline text-lg font-bold text-text-primary tracking-tight">
              Novo usuário
            </SheetTitle>
            <SheetDescription className="text-xs text-text-muted mt-0.5">
              Envie um convite institucional por e-mail
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Upload de Avatar */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-1 border border-border shadow-sm">
            <div className="w-[72px] h-[72px] rounded-full bg-surface-elevated border border-border flex flex-col items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors shrink-0 cursor-pointer">
              <Camera className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-semibold text-text-primary">
                Foto de perfil
              </span>
              <p className="text-xs text-text-muted">PNG, JPG até 2MB</p>
              <button
                type="button"
                className="text-left text-xs text-primary hover:underline font-medium cursor-pointer"
              >
                Adicionar foto
              </button>
            </div>
          </div>

          {/* Campos Básicos de Informação */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="user-fullname"
                className="block text-xs font-medium text-text-secondary"
              >
                Nome completo
              </label>
              <Input
                id="user-fullname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mariana Siqueira"
                className="h-10 bg-surface-1 border-border text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="user-email"
                className="block text-xs font-medium text-text-secondary"
              >
                E-mail corporativo
              </label>
              <Input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mariana.s@nexora.io"
                className="h-10 bg-surface-1 border-border font-mono text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="user-phone"
                className="block text-xs font-medium text-text-secondary"
              >
                Telefone celular
              </label>
              <Input
                id="user-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="h-10 bg-surface-1 border-border text-sm"
              />
            </div>
          </div>

          {/* Seleção de Perfil (Cards Clicáveis) */}
          <div className="space-y-2.5">
            <span className="block text-xs font-medium text-text-secondary">
              Perfil de Acesso
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {roleOptions.map((opt) => {
                const Icon = opt.icon
                const isSelected = role === opt.id

                return (
                  <div
                    key={opt.id}
                    onClick={() => setRole(opt.id)}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-[0_0_12px_rgba(47,107,255,0.18)]'
                        : 'bg-surface-1 border-border hover:bg-surface-elevated/60 hover:border-border-highlight'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 mt-0.5 shrink-0 ${
                        isSelected ? 'text-primary' : 'text-text-muted'
                      }`}
                      strokeWidth={1.5}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? 'text-primary' : 'text-text-primary'
                          }`}
                        >
                          {opt.title}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Matriz de Permissões Compacta */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                Permissões Específicas
              </span>
              <Badge
                variant="outline"
                className="text-[10px] font-mono text-primary bg-primary/10 border-primary/30 font-bold uppercase tracking-wider"
              >
                Perfil Gerente
              </Badge>
            </div>

            <div className="rounded-xl bg-surface-1 border border-border overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-elevated text-text-muted font-mono border-b border-border">
                    <th className="py-2.5 pl-3 font-medium">Módulo</th>
                    <th className="py-2.5 text-center font-medium">Ver</th>
                    <th className="py-2.5 text-center font-medium">Criar</th>
                    <th className="py-2.5 text-center font-medium">Editar</th>
                    <th className="py-2.5 pr-3 text-center font-medium">Excluir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono">
                  {/* Linha Dashboard */}
                  <tr>
                    <td className="py-2.5 pl-3 text-text-primary font-medium font-sans">
                      Dashboard
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissions.dashboard.view}
                          onCheckedChange={(c) =>
                            setPermissions((p) => ({
                              ...p,
                              dashboard: { ...p.dashboard, view: !!c },
                            }))
                          }
                        />
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <Checkbox checked={false} disabled className="opacity-30" />
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissions.dashboard.edit}
                          onCheckedChange={(c) =>
                            setPermissions((p) => ({
                              ...p,
                              dashboard: { ...p.dashboard, edit: !!c },
                            }))
                          }
                        />
                      </div>
                    </td>
                    <td className="text-center pr-3">
                      <div className="flex justify-center">
                        <Checkbox checked={false} disabled className="opacity-30" />
                      </div>
                    </td>
                  </tr>

                  {/* Linha Produtos */}
                  <tr>
                    <td className="py-2.5 pl-3 text-text-primary font-medium font-sans">
                      Produtos
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissions.produtos.view}
                          onCheckedChange={(c) =>
                            setPermissions((p) => ({
                              ...p,
                              produtos: { ...p.produtos, view: !!c },
                            }))
                          }
                        />
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissions.produtos.create}
                          onCheckedChange={(c) =>
                            setPermissions((p) => ({
                              ...p,
                              produtos: { ...p.produtos, create: !!c },
                            }))
                          }
                        />
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissions.produtos.edit}
                          onCheckedChange={(c) =>
                            setPermissions((p) => ({
                              ...p,
                              produtos: { ...p.produtos, edit: !!c },
                            }))
                          }
                        />
                      </div>
                    </td>
                    <td className="text-center pr-3">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissions.produtos.delete}
                          onCheckedChange={(c) =>
                            setPermissions((p) => ({
                              ...p,
                              produtos: { ...p.produtos, delete: !!c },
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Linha Usuários */}
                  <tr>
                    <td className="py-2.5 pl-3 text-text-primary font-medium font-sans">
                      Usuários
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissions.usuarios.view}
                          onCheckedChange={(c) =>
                            setPermissions((p) => ({
                              ...p,
                              usuarios: { ...p.usuarios, view: !!c },
                            }))
                          }
                        />
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissions.usuarios.create}
                          onCheckedChange={(c) =>
                            setPermissions((p) => ({
                              ...p,
                              usuarios: { ...p.usuarios, create: !!c },
                            }))
                          }
                        />
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissions.usuarios.edit}
                          onCheckedChange={(c) =>
                            setPermissions((p) => ({
                              ...p,
                              usuarios: { ...p.usuarios, edit: !!c },
                            }))
                          }
                        />
                      </div>
                    </td>
                    <td className="text-center pr-3">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissions.usuarios.delete}
                          onCheckedChange={(c) =>
                            setPermissions((p) => ({
                              ...p,
                              usuarios: { ...p.usuarios, delete: !!c },
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Switches de Configuração */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">
                  Enviar convite por e-mail
                </span>
                <span className="text-xs text-text-muted">
                  Gera token com 48h de validade
                </span>
              </div>
              <Switch checked={sendInvite} onCheckedChange={setSendInvite} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-primary">
                  Exigir troca de senha
                </span>
                <span className="text-xs text-text-muted">
                  Obrigatório no primeiro login
                </span>
              </div>
              <Switch
                checked={requirePasswordChange}
                onCheckedChange={setRequirePasswordChange}
              />
            </div>
          </div>
        </div>

        {/* Rodapé fixo do Drawer */}
        <SheetFooter className="h-[72px] px-6 bg-surface-2 border-t border-border flex flex-row items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 text-text-secondary hover:text-text-primary cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-10 px-5 gap-2 font-medium cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" strokeWidth={1.5} />
                <span>Enviar convite</span>
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
