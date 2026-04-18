'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { expenseSchema, type ExpenseFormValues } from '@/lib/validations/expense.schema'

export async function createExpense(formData: ExpenseFormValues) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const parsed = expenseSchema.safeParse(formData)
  if (!parsed.success) return { error: 'Validation failed' }

  const { recipient_other, ...rest } = parsed.data
  const insertData = {
    ...rest,
    sub_category_id: rest.sub_category_id || null,
    business_unit_id: rest.business_unit_id || null,
    recipient_id: rest.recipient_id === 'other' ? null : (rest.recipient_id || null),
    notes: [recipient_other ? `Paid to: ${recipient_other}` : null, rest.notes || null]
      .filter(Boolean).join('\n') || null,
    entered_by: user.id,
  }

  const { error } = await supabase.from('expenses').insert(insertData)
  if (error) return { error: error.message }
  revalidatePath('/expenses')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateExpense(id: string, formData: ExpenseFormValues) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const parsed = expenseSchema.safeParse(formData)
  if (!parsed.success) return { error: 'Validation failed' }

  const { recipient_other, ...rest } = parsed.data
  const updateData = {
    ...rest,
    sub_category_id: rest.sub_category_id || null,
    business_unit_id: rest.business_unit_id || null,
    recipient_id: rest.recipient_id === 'other' ? null : (rest.recipient_id || null),
    notes: [recipient_other ? `Paid to: ${recipient_other}` : null, rest.notes || null]
      .filter(Boolean).join('\n') || null,
  }

  const { error } = await supabase.from('expenses').update(updateData).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/expenses')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteExpense(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/expenses')
  revalidatePath('/dashboard')
  return { success: true }
}
