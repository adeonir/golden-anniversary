import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { LogoutButton } from './logout-button'

export function Dashboard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-zinc-800">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  )
}
