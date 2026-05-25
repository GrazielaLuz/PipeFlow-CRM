'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Pencil } from 'lucide-react'
import { Lead } from '@/types'
import { LeadForm } from './lead-form'

export function EditLeadDialog({ lead }: { lead: Lead }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil className="mr-1.5 h-3.5 w-3.5" />
        Editar
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Lead</DialogTitle>
        </DialogHeader>
        <LeadForm lead={lead} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
