'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Phone, Mail, Users, FileText, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createActivity, ActivityFormState } from '@/app/(app)/activities/actions'

const TYPES = [
  { value: 'call',    label: 'Ligação',  icon: Phone },
  { value: 'email',   label: 'E-mail',   icon: Mail },
  { value: 'meeting', label: 'Reunião',  icon: Users },
  { value: 'note',    label: 'Nota',     icon: FileText },
] as const

const initialState: ActivityFormState = {}

function todayLocal() {
  return new Date().toISOString().slice(0, 16) // "YYYY-MM-DDTHH:mm"
}

interface ActivityFormProps {
  leadId: string
  onSuccess?: () => void
}

export function ActivityForm({ leadId, onSuccess }: ActivityFormProps) {
  const [state, formAction, pending] = useActionState(createActivity, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const onSuccessRef = useRef(onSuccess)
  onSuccessRef.current = onSuccess

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      onSuccessRef.current?.()
    }
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="lead_id" value={leadId} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tipo */}
        <div className="space-y-1.5">
          <Label htmlFor="type">Tipo</Label>
          <Select name="type" defaultValue="note" required>
            <SelectTrigger id="type">
              <SelectValue placeholder="Selecionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <span className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.fieldErrors?.type && (
            <p className="text-xs text-destructive">{state.fieldErrors.type[0]}</p>
          )}
        </div>

        {/* Data */}
        <div className="space-y-1.5">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            name="date"
            type="datetime-local"
            defaultValue={todayLocal()}
            required
          />
          {state.fieldErrors?.date && (
            <p className="text-xs text-destructive">{state.fieldErrors.date[0]}</p>
          )}
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Descreva o que aconteceu…"
          rows={3}
          required
        />
        {state.fieldErrors?.description && (
          <p className="text-xs text-destructive">{state.fieldErrors.description[0]}</p>
        )}
      </div>

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} size="sm">
        {pending ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-1.5 h-4 w-4" />
        )}
        Registrar atividade
      </Button>
    </form>
  )
}
