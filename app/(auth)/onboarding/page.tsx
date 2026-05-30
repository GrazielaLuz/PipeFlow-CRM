'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, LogOut, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Stepper } from '@/components/onboarding/stepper'
import { WorkspaceForm } from '@/components/onboarding/workspace-form'
import { InviteForm } from '@/components/onboarding/invite-form'
import { createWorkspaceAction } from '@/app/actions/workspace'
import { createFirstLeadAction } from '@/app/actions/lead'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  { label: 'Workspace' },
  { label: 'Time' },
  { label: 'Primeiro lead' },
]

interface WorkspaceData {
  name: string
  slug: string
}

interface Invite {
  email: string
  role: 'admin' | 'member'
}

interface LeadData {
  name: string
  email: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setChecking(false); return }
      const { data } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)
        .order('workspace_id')
        .limit(1)
      if (data?.[0]?.workspace_id) {
        document.cookie = `pipeflow-workspace-id=${data[0].workspace_id}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
        window.location.href = '/dashboard'
        return
      }
      setChecking(false)
    })
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    document.cookie = 'pipeflow-workspace-id=; path=/; max-age=0'
    window.location.href = '/login'
  }

  if (checking) return null
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const [workspace, setWorkspace] = useState<WorkspaceData>({ name: '', slug: '' })
  const [invites, setInvites] = useState<Invite[]>([])
  const [lead, setLead] = useState<LeadData>({ name: '', email: '' })
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)

  function canAdvance(): boolean {
    if (step === 0) return workspace.name.trim().length > 0
    if (step === 1) return true
    if (step === 2) return lead.name.trim().length > 0
    return false
  }

  async function handleNext() {
    setServerError(null)

    if (step === 0) {
      setLoading(true)
      const result = await createWorkspaceAction(workspace)
      setLoading(false)
      if (result.error) {
        setServerError(result.error)
        return
      }
      const wsId = result.workspace!.id
      // Set cookie client-side immediately so middleware sees it on next navigation
      document.cookie = `pipeflow-workspace-id=${wsId}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
      setWorkspaceId(wsId)
      setStep(1)
      return
    }

    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
      return
    }

    handleFinish()
  }

  async function handleFinish() {
    setLoading(true)
    setServerError(null)

    if (lead.name.trim() && workspaceId) {
      const result = await createFirstLeadAction({
        name: lead.name,
        email: lead.email,
        workspaceId,
      })
      if (result.error) {
        setServerError(result.error)
        setLoading(false)
        return
      }
    }

    window.location.assign('/dashboard')
  }

  const isLastStep = step === STEPS.length - 1

  return (
    <div className="w-full max-w-lg space-y-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Vamos configurar seu CRM</h1>
        <p className="text-sm text-muted-foreground">
          Leva menos de 2 minutos. Você pode ajustar tudo depois.
        </p>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={handleSignOut}>
          <LogOut className="h-3.5 w-3.5" />
          Sair
        </Button>
      </div>

      <Stepper steps={STEPS} currentStep={step} />

      <div className="rounded-xl border bg-background p-6 shadow-sm">
        {step === 0 && (
          <WorkspaceForm data={workspace} onChange={setWorkspace} />
        )}

        {step === 1 && (
          <InviteForm invites={invites} onChange={setInvites} />
        )}

        {step === 2 && (
          <Step3Lead data={lead} onChange={setLead} />
        )}

        {serverError && (
          <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={loading}
            >
              Voltar
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            {step === 1 && (
              <Button variant="outline" onClick={handleNext} disabled={loading}>
                Pular por agora
              </Button>
            )}

            <Button onClick={handleNext} disabled={!canAdvance() || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLastStep ? (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Entrar no CRM
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Passo {step + 1} de {STEPS.length}
      </p>
    </div>
  )
}

function Step3Lead({ data, onChange }: { data: LeadData; onChange: (d: LeadData) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Rocket className="h-7 w-7 text-primary" />
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-center text-base font-medium">Crie seu primeiro lead</h2>
        <p className="text-center text-sm text-muted-foreground">
          Já tem um contato em mente? Adicione agora.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-name">Nome do contato</Label>
        <Input
          id="lead-name"
          placeholder="João da Silva"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          autoFocus
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-email">
          E-mail
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">opcional</span>
        </Label>
        <Input
          id="lead-email"
          type="email"
          placeholder="joao@empresa.com"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
        />
      </div>
    </div>
  )
}
