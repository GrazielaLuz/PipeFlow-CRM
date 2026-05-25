'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export function LeadSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', '1')
      if (term) {
        params.set('q', term)
      } else {
        params.delete('q')
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams],
  )

  let debounceTimer: ReturnType<typeof setTimeout>
  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => handleSearch(e.target.value), 300)
  }

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-8"
        placeholder="Buscar por nome, empresa ou e-mail..."
        defaultValue={searchParams.get('q') ?? ''}
        onChange={onInput}
      />
    </div>
  )
}
