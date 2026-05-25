'use client'

import { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Lead, LeadStatus } from '@/types'
import { createLead, updateLead, LeadFormState } from '@/app/(app)/leads/actions'

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new',       label: 'Novo' },
  { value: 'contacted', label: 'Contatado' },
  { value: 'qualified', label: 'Qualificado' },
  { value: 'lost',      label: 'Perdido' },
  { value: 'won',       label: 'Ganho' },
]

interface LeadFormProps {
  lead?: Lead
  onSuccess?: () => void
}

const initialState: LeadFormState = {}

export function LeadForm({ lead, onSuccess }: LeadFormProps) {
  const action = lead
    ? updateLead.bind(null, lead.id)
    : createLead

  const [state, formAction, isPending] = useActionState(action, initialState)

  useEffect(() => {
    if (state.success) {
      onSuccess?.()
    }
  }, [state.success, onSuccess])

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            name="name"
            defaultValue={lead?.name}
            placeholder="João Silva"
            aria-describedby={state.fieldErrors?.name ? 'name-error' : undefined}
          />
          {state.fieldErrors?.name && (
            <p id="name-error" className="text-xs text-destructive">
              {state.fieldErrors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={lead?.email}
            placeholder="joao@empresa.com"
            aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
          />
          {state.fieldErrors?.email && (
            <p id="email-error" className="text-xs text-destructive">
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={lead?.phone}
            placeholder="+55 11 99999-0000"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            name="company"
            defaultValue={lead?.company}
            placeholder="Acme Corp"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">Cargo</Label>
          <Input
            id="role"
            name="role"
            defaultValue={lead?.role}
            placeholder="Diretor de Compras"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={lead?.status ?? 'new'}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : lead ? 'Salvar alterações' : 'Criar lead'}
        </Button>
      </div>
    </form>
  )
}
