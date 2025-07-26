import { redirect } from 'next/navigation'
import { Dashboard } from '~/components/app/admin/dashboard'
import { env } from '~/env'
import { createClient } from '~/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== env.ADMIN_EMAIL) {
    redirect('/login')
  }

  return <Dashboard />
}
