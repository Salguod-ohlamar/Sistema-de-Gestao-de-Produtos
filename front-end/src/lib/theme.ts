export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'nexora-theme'

/** Preferência visual (não é dado de autenticação, então pode ficar no navegador). */
export function getStoredTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // armazenamento indisponível: o tema vale só nesta sessão
  }
}
