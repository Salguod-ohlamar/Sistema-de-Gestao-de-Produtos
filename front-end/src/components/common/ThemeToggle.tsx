import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { applyTheme, getStoredTheme, type Theme } from '@/lib/theme'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())
  const next: Theme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next)
        setTheme(next)
      }}
      aria-label={next === 'dark' ? 'Ativar tema escuro' : 'Ativar tema claro'}
      title={next === 'dark' ? 'Tema escuro' : 'Tema claro'}
      className="p-2 rounded-lg bg-surface-2 border border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  )
}
