'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from './auth'

// ── Categories ────────────────────────────────────────────────
export async function createCategory(data: { name: string; description?: string; color?: string; icon?: string }) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('categories').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function updateCategory(id: string, data: { name?: string; description?: string; color?: string; icon?: string; is_active?: boolean }) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('categories').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  // Soft delete
  const { error } = await supabase.from('categories').update({ is_active: false }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}

// ── Sub-categories ────────────────────────────────────────────
export async function createSubCategory(data: { category_id: string; name: string }) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('sub_categories').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteSubCategory(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('sub_categories').update({ is_active: false }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}

// ── Recipients ────────────────────────────────────────────────
type RecipientType = 'supplier' | 'agent' | 'utility' | 'individual' | 'other'

export async function createRecipient(data: { name: string; type?: RecipientType; phone?: string; notes?: string }) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('recipients').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/recipients')
  return { success: true }
}

export async function updateRecipient(id: string, data: { name?: string; type?: RecipientType; phone?: string; notes?: string; is_active?: boolean }) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('recipients').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/recipients')
  return { success: true }
}

export async function deleteRecipient(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('recipients').update({ is_active: false }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/recipients')
  return { success: true }
}

// ── Business Units ────────────────────────────────────────────
export async function createBusinessUnit(data: { name: string; description?: string }) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('business_units').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/business-units')
  return { success: true }
}

export async function updateBusinessUnit(id: string, data: { name?: string; description?: string; is_active?: boolean }) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('business_units').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/business-units')
  return { success: true }
}

// ── Users ─────────────────────────────────────────────────────
export async function updateUserRole(userId: string, role: 'admin' | 'staff') {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}

export async function toggleUserActive(userId: string, is_active: boolean) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ is_active }).eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}
