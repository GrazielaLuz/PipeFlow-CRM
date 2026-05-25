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
import { Deal, DealStage, Lead } from '@/types'
import { createDeal, updateDeal, DealFormState } from '@/app/(app)/pipeline/actions'
import { STAGE_CONFIG, STAGE_ORDER } from './stage-config'

type Props = {
  deal?: Deal
  leads?: Pick<Lead, 'id' | 'name' | 'company'>[]
  defaultStage?: DealStage
  onSuccess?: (deal: Deal) => void
}

const initialState: DealFormState = {}

export function DealForm({ deal, leads = [], defaultStage = 'prospecting', onSuccess }: Props) {
  const action = deal
    ? updateDeal.bind(null, deal.id)
    : createDeal

  const [state, formAction, isPending] = useActionState(action, initialState)

  useEffect(() => {
    if (state.success && state.deal) onSuccess?.(state.deal)
  }, [state.success, state.deal, onSuccess])

  return (
    <form action={formAction} className="space-y-4">
      {/* Título */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Ex: Licença Enterprise"
          defaultValue={deal?.title}
          required
        />
        {state.fieldErrors?.title && (
          <p className="text-xs text-destructive">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      {/* Valor */}
      <div className="space-y-1.5">
        <Label htmlFor="value">Valor (R$)</Label>
        <Input
          id="value"
          name="value"
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
          defaultValue={deal?.value ?? 0}
        />
        {state.fieldErrors?.value && (
          <p className="text-xs text-destructive">{state.fieldErrors.value[0]}</p>
        )}
      </div>

      {/* Estágio */}
      <div className="space-y-1.5">
        <Label htmlFor="stage">Estágio</Label>
        <Select name="stage" defaultValue={deal?.stage ?? defaultStage}>
          <SelectTrigger id="stage">
            <SelectValue placeholder="Selecione o estágio" />
          </SelectTrigger>
          <SelectContent>
            {STAGE_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: STAGE_CONFIG[s].color }}
                  />
                  {STAGE_CONFIG[s].label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lead vinculado */}
      {leads.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor="lead_id">Lead vinculado</Label>
          <Select name="lead_id" defaultValue={deal?.lead_id ?? ''}>
            <SelectTrigger id="lead_id">
              <SelectValue placeholder="Selecione um lead (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhum</SelectItem>
              {leads.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}{l.company ? ` — ${l.company}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Prazo */}
      <div className="space-y-1.5">
        <Label htmlFor="deadline">Prazo</Label>
        <Input
          id="deadline"
          name="deadline"
          type="date"
          defaultValue={deal?.deadline?.split('T')[0] ?? ''}
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending
          ? deal ? 'Salvando...' : 'Criando...'
          : deal ? 'Salvar alterações' : 'Criar negócio'}
      </Button>
    </form>
  )
}
