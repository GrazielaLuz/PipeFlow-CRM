export default function InvitePage({ params }: { params: { token: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold">Aceitar Convite</h1>
      <p className="text-muted-foreground">Token: {params.token}</p>
    </div>
  )
}
