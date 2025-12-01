import { LoginForm } from '~/components/app/admin/login-form'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export default function LoginPage() {
  return (
    <div className="admin-theme flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-zinc-800">Login Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
