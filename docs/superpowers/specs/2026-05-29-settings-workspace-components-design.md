# Design Spec — Settings Workspace Components (M09)

**Date:** 2026-05-29  
**Milestone:** M09 — Multi-empresa  
**Branch:** feat/multi-workspace

---

## Context

Part of M09 multi-workspace milestone. The settings workspace page needs three components to manage workspace members and invitations. The overall M09 plan was approved; this spec covers the visual and interaction design of the three UI components specifically.

---

## Layout

Page: `app/(app)/settings/workspace/page.tsx`  
Pattern: three stacked cards (Option A, approved by user)

```
┌─────────────────────────────┐
│  MemberList                 │  ← Card 1: table of current members
├─────────────────────────────┤
│  InviteMemberForm           │  ← Card 2: inline invite form
├─────────────────────────────┤
│  PendingInviteList          │  ← Card 3: pending invites
└─────────────────────────────┘
```

---

## Component 1: MemberList

**File:** `components/settings/member-list.tsx`  
**Type:** `"use client"` (needs useTransition for remove action)

### Props
```ts
interface Props {
  members: Member[]
  currentUserId: string
  currentRole: 'admin' | 'member'
  workspaceId: string
}
```

### Visual
- Card with header: "Membros" + subtitle "N membros neste workspace"
- Table with columns: Membro (avatar + nome + email) | Papel | Ações
- Avatar: 32px circle, initials from name, color varies by initial letter (blue for admin, slate for others)
- Role badge: `variant="outline"` — Admin: `bg-blue-50 text-blue-700 border-blue-200`; Membro: `bg-slate-50 text-slate-600 border-slate-200`
- Remove button: only shown when `currentRole === 'admin'` AND `member.user_id !== currentUserId`
- Self row: shows "Você" in muted text instead of remove button
- Empty state: "Nenhum membro encontrado" centered

### Remove flow
- Button "Remover" (destructive outline style)
- Clicks open `RemoveMemberDialog` (same pattern as `delete-lead-dialog.tsx`)
- Dialog: "Tem certeza que deseja remover **{name}** do workspace? Esta ação não pode ser desfeita."
- Confirm calls `removeMemberAction({ workspaceId, userId })` via `useTransition`
- On success: `router.refresh()`

### RemoveMemberDialog (inline in same file or separate)
Follows `delete-lead-dialog.tsx` exactly: `Dialog + DialogTrigger + DialogContent + DialogFooter`.

---

## Component 2: InviteMemberForm

**File:** `components/settings/invite-member-form.tsx`  
**Type:** `"use client"`

### Props
```ts
interface Props {
  workspaceId: string
  plan: 'free' | 'pro'
  memberCount: number
}
```

### Visual
- Card with header: "Convidar membro" + subtitle "Envie um convite por e-mail. O link expira em 7 dias."
- Inline form: `[email input] [role select] [Convidar button]` — flex row, aligned at bottom
- Email label: "E-mail" | Role label: "Papel" | Options: "Membro" (default), "Admin"

### Free plan limit
- When `plan === 'free' && memberCount >= 2`:
  - Email input and role select: disabled + `bg-muted`
  - Button: disabled
  - Wrap button in `<Tooltip>` with text "Limite de 2 membros no plano Free. Faça upgrade para Pro."
- Tooltip uses `TooltipProvider > Tooltip > TooltipTrigger > TooltipContent` from shadcn/ui

### Submit flow
- `useState` for email, role, loading, error
- `fetch('POST /api/invites', { email, role, workspaceId })`
- On success: reset form + `router.refresh()` (to update PendingInviteList)
- On error: show error message below form (red text, small)
- Button label: "Convidar" → "Enviando..." while loading

---

## Component 3: PendingInviteList

**File:** `components/settings/pending-invite-list.tsx`  
**Type:** `"use client"` (cancel action)

### Props
```ts
interface Props {
  invites: Invite[]
  isAdmin: boolean
  workspaceId: string
}
```

### Visual
- Card with header: "Convites pendentes" + subtitle "N convites aguardando resposta"
- Each row: `[envelope icon] [email + expiry] [role badge] [Cancelar button]`
- Envelope icon: 32px circle `bg-slate-100`, Lucide `Mail` icon
- Expiry text:
  - Default: "Expira em N dias (DD mmm YYYY)" — `text-muted-foreground`
  - Expiring today: "Expira hoje (DD mmm YYYY)" — `text-amber-500`
- Role badge: same style as MemberList
- "Cancelar" button: shown only when `isAdmin`, outline style, calls `DELETE /api/invites?id=xxx`
- On cancel success: `router.refresh()`

### Empty state
- Centered: Lucide `Mail` icon (28px, muted) + "Nenhum convite pendente"
- Same pattern as other empty states in the codebase (dashed border, centered icon + text)

---

## Shadcn/ui Components Used

All already installed: `Table`, `Badge`, `Button`, `Input`, `Select`, `Tooltip`, `Avatar`, `Dialog`

---

## Verification

1. Admin sees all 3 cards; member sees MemberList read-only (no Remove, no InviteForm, no PendingInviteList)
2. Invite form sends POST → e-mail received → PendingInviteList updates on refresh
3. Cancel invite calls DELETE → row disappears
4. Free plan with 2 members → invite button disabled with tooltip
5. Remove member opens dialog → confirms → member disappears from list
6. Cannot remove yourself (no button on own row)
