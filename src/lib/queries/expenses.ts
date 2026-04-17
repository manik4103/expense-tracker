import { createClient } from '@/lib/supabase/server'
import type { ExpenseWithRelations } from '@/types/app.types'

export async function getExpenses(filters?: {
  from?: string
  to?: string
  category_id?: string
  business_unit_id?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = supabase
    .from('expenses')
    .select(`*, categories(id,name,color,icon), sub_categories(id,name), business_units(id,name), recipients(id,name), profiles(id,full_name)`)
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (profile?.role !== 'admin') {
    query = query.eq('entered_by', user.id)
  }
  if (filters?.from) query = query.gte('expense_date', filters.from)
  if (filters?.to) query = query.lte('expense_date', filters.to)
  if (filters?.category_id) query = query.eq('category_id', filters.category_id)
  if (filters?.business_unit_id) query = query.eq('business_unit_id', filters.business_unit_id)

  const { data, error } = await query
  if (error) { console.error(error); return [] }
  return data as ExpenseWithRelations[]
}

export async function getExpenseById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expenses')
    .select(`*, categories(id,name,color,icon), sub_categories(id,name), business_units(id,name), recipients(id,name), profiles(id,full_name)`)
    .eq('id', id)
    .single()
  if (error) return null
  return data as ExpenseWithRelations
}
