import { createClient } from '@/lib/supabase/server'
import RecipientManager from '@/components/admin/RecipientManager'

export default async function AdminRecipientsPage() {
  const supabase = await createClient()
  const { data: recipients } = await supabase.from('recipients').select('*').order('name')
  return <RecipientManager recipients={recipients ?? []} />
}
