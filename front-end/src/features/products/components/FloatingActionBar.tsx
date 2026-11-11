import { Edit3, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FloatingActionBarProps {
  selectedCount: number
  onBatchEdit?: () => void
  onExport?: () => void
  onDelete?: () => void
}

export function FloatingActionBar({
  selectedCount,
  onBatchEdit,
  onExport,
  onDelete,
}: FloatingActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 h-14 px-5 rounded-xl bg-surface-elevated/95 backdrop-blur-md border border-border shadow-[0_12px_32px_rgba(0,0,0,0.7),0_0_20px_rgba(47,107,255,0.25)] flex items-center gap-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
        <span className="text-sm font-semibold text-text-primary tracking-tight">
          {selectedCount} {selectedCount === 1 ? 'produto selecionado' : 'produtos selecionados'}
        </span>
      </div>

      <div className="h-5 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onBatchEdit}
          className="h-9 px-3 gap-1.5 text-xs bg-surface-1 border-border hover:bg-surface-2 text-text-primary cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.5} />
          <span>Editar em lote</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onExport}
          className="h-9 px-3 gap-1.5 text-xs bg-surface-1 border-border hover:bg-surface-2 text-text-primary cursor-pointer"
        >
          <Upload className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.5} />
          <span>Exportar</span>
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="h-9 px-3 gap-1.5 text-xs bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>Excluir</span>
        </Button>
      </div>
    </aside>
  )
}
