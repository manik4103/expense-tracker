import { createClient } from '@/lib/supabase/server'
import UserManager from '@/components/admin/UserManager'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase.from('profiles').select('*').order('full_name')
  return <UserManager users={users ?? []} />
}
