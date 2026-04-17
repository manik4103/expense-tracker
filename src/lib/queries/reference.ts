import { createClient } from '@/lib/supabase/server'
import type { Category, SubCategory, BusinessUnit, Recipient } from '@/types/app.types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('name')
  return data ?? []
}

export async function getSubCategories(): Promise<SubCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('sub_categories').select('*').eq('is_active', true).order('name')
  return data ?? []
}

export async function getBusinessUnits(): Promise<BusinessUnit[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('business_units').select('*').eq('is_active', true).order('name')
  return data ?? []
}

export async function getRecipients(): Promise<Recipient[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('recipients').select('*').eq('is_active', true).order('name')
  return data ?? []
}
