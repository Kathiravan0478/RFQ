import { useTheme } from '../state/theme'

export function ThemeToggle() {
  const { mode, resolvedMode, toggle, setMode } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className="role-ring rounded-lg bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"
        aria-label="Toggle dark mode"
      >
        {resolvedMode === 'dark' ? 'Dark' : 'Light'}
      </button>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as typeof mode)}
        className="role-ring rounded-lg bg-white px-2 py-2 text-sm dark:bg-slate-900"
        aria-label="Theme preference"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  )
}

