// import { Resend } from 'resend'

// const resend = new Resend(process.env.RESEND_API_KEY)

// export async function sendInviteEmail({
//   to,
//   workspaceName,
//   inviteUrl,
// }: {
//   to: string
//   workspaceName: string
//   inviteUrl: string
// }) {
//   return resend.emails.send({
//     from: 'PipeFlow CRM <noreply@pipeflow.app>',
//     to,
//     subject: `Você foi convidado para ${workspaceName} no PipeFlow`,
//     html: `<p>Clique <a href="${inviteUrl}">aqui</a> para aceitar o convite.</p>`,
//   })
// }

// export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
//   return resend.emails.send({
//     from: 'PipeFlow CRM <noreply@pipeflow.app>',
//     to,
//     subject: 'Bem-vindo ao PipeFlow CRM!',
//     html: `<p>Olá ${name}, bem-vindo ao PipeFlow CRM!</p>`,
//   })
// }

export {}
