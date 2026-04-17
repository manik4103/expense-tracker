import { createClient } from '@/lib/supabase/server'
import BusinessUnitManager from '@/components/admin/BusinessUnitManager'

export default async function AdminBusinessUnitsPage() {
  const supabase = await createClient()
  const { data: units } = await supabase.from('business_units').select('*').order('name')
  return <BusinessUnitManager units={units ?? []} />
}
