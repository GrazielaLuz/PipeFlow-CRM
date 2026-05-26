'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
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
import { ActivityType } from '@/types'

const TYPES = [
  { value: 'call'    as ActivityType, label: 'Ligação',  icon: Phone },
  { value: 'email'   as ActivityType, label: 'E-mail',   icon: Mail },
  { value: 'meeting' as ActivityType, label: 'Reunião',  icon: Users },
  { value: 'note'    as ActivityType, label: 'Nota',     icon: FileText },
]

const DEFAULT_TYPE: ActivityType = 'note'

const initialState: ActivityFormState = {}

function todayLocal() {
  return new Date().toISOString().slice(0, 16)
}

interface ActivityFormProps {
  leadId: string
  onSuccess?: () => void
}

export function ActivityForm({ leadId, onSuccess }: ActivityFormProps) {
  const [state, formAction, pending] = useActionState(createActivity, initialState)
  const [selectedType, setSelectedType] = useState<ActivityType>(DEFAULT_TYPE)
  const formRef = useRef<HTMLFormElement>(null)
  const onSuccessRef = useRef(onSuccess)
  onSuccessRef.current = onSuccess

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      setSelectedType(DEFAULT_TYPE)
      onSuccessRef.current?.()
    }
  }, [state.success])

  const typeLabel = TYPES.find((t) => t.value === selectedType)?.label ?? selectedType

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="lead_id" value={leadId} />
      <input type="hidden" name="type" value={selectedType} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tipo */}
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={selectedType} onValueChange={(v) => setSelectedType(v as ActivityType)}>
            <SelectTrigger>
              <SelectValue>{typeLabel}</SelectValue>
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
