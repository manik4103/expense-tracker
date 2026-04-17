import { z } from 'zod'

export const expenseSchema = z.object({
  expense_date:     z.string().min(1, 'Date is required'),
  category_id:      z.string().min(1, 'Category is required'),
  sub_category_id:  z.string().nullable().optional(),
  business_unit_id: z.string().nullable().optional(),
  recipient_id:     z.string().nullable().optional(),
  recipient_other:  z.string().max(200).nullable().optional(),
  amount:           z.coerce.number().positive('Amount must be greater than 0'),
  notes:            z.string().max(500).optional(),
})

// Output type — amount is number after coercion (used in server actions)
export type ExpenseFormValues = z.infer<typeof expenseSchema>

// Input type — amount may be string/number from form input
export type ExpenseFormInput = z.input<typeof expenseSchema>
