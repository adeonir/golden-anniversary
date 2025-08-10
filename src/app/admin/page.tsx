import { Dashboard } from '~/components/app/admin/dashboard'
import { requireAuth } from '~/lib/auth/utils'

export default async function AdminPage() {
  await requireAuth()

  return <Dashboard />
}
