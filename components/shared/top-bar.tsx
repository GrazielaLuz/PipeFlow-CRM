import { ReactNode } from 'react'

interface TopBarProps {
  title: string
  actions?: ReactNode
}

export function TopBar({ title, actions }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-6">
      <h1 className="text-base font-semibold">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
