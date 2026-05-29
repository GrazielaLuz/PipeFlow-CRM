import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendInviteEmail({
  to,
  workspaceName,
  inviteUrl,
  role,
}: {
  to: string
  workspaceName: string
  inviteUrl: string
  role: string
}) {
  const roleLabel = role === 'admin' ? 'Administrador' : 'Membro'

  return getResend().emails.send({
    from: 'PipeFlow CRM <noreply@pipeflow.app>',
    to,
    subject: `Você foi convidado para ${workspaceName} no PipeFlow CRM`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111827;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Convite para o PipeFlow CRM</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">
          Você foi convidado para participar do workspace <strong>${workspaceName}</strong> como <strong>${roleLabel}</strong>.
        </p>
        <a href="${inviteUrl}"
           style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none;
                  padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Aceitar convite
        </a>
        <p style="margin-top: 24px; font-size: 13px; color: #9ca3af;">
          Este link expira em 7 dias. Se você não esperava este convite, ignore este e-mail.
        </p>
      </div>
    `,
  })
}

export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  return getResend().emails.send({
    from: 'PipeFlow CRM <noreply@pipeflow.app>',
    to,
    subject: 'Bem-vindo ao PipeFlow CRM!',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111827;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Bem-vindo, ${name}!</h1>
        <p style="color: #6b7280;">
          Sua conta no PipeFlow CRM está pronta. Gerencie seus leads, pipeline e equipe em um só lugar.
        </p>
      </div>
    `,
  })
}
