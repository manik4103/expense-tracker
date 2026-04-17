'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { expenseSchema, type ExpenseFormValues, type ExpenseFormInput } from '@/lib/validations/expense.schema'
import { createExpense, updateExpense } from '@/lib/actions/expenses'
import type { Expense, Category, SubCategory, BusinessUnit, Recipient } from '@/types/app.types'

interface ExpenseFormProps {
  mode: 'create' | 'edit'
  initialData?: Expense
  categories: Category[]
  subCategories: SubCategory[]
  businessUnits: BusinessUnit[]
  recipients: Recipient[]
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function ExpenseForm({
  mode,
  initialData,
  categories,
  subCategories,
  businessUnits,
  recipients,
}: ExpenseFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expense_date:     initialData?.expense_date ?? todayISO(),
      category_id:      initialData?.category_id ?? '',
      sub_category_id:  initialData?.sub_category_id ?? '',
      business_unit_id: initialData?.business_unit_id ?? '',
      recipient_id:     initialData?.recipient_id ?? '',
      recipient_other:  '',
      amount:           initialData?.amount ?? '',
      notes:            initialData?.notes ?? '',
    },
  })

  const selectedCategoryId = watch('category_id')
  const selectedRecipientId = watch('recipient_id')

  const filteredSubCategories = subCategories.filter(
    (sc) => sc.category_id === selectedCategoryId,
  )
  const showSubCategory = filteredSubCategories.length > 0
  const showRecipientOther = selectedRecipientId === 'other'

  const onSubmit = async (values: ExpenseFormInput) => {
    setServerError(null)
    // At this point the schema has validated & coerced, so it's safe to cast
    const coerced = values as unknown as ExpenseFormValues
    let result: { error?: string; success?: boolean }
    if (mode === 'edit' && initialData) {
      result = await updateExpense(initialData.id, coerced)
    } else {
      result = await createExpense(coerced)
    }
    if (result.error) {
      setServerError(result.error)
      return
    }
    router.push('/expenses')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Date */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor="expense_date">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          id="expense_date"
          type="date"
          {...register('expense_date')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.expense_date && (
          <p className="text-xs text-red-600">{errors.expense_date.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor="category_id">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category_id"
          {...register('category_id')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Select category…</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon ? `${cat.icon} ` : ''}{cat.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-xs text-red-600">{errors.category_id.message}</p>
        )}
      </div>

      {/* Sub-category — only shown when category has sub-categories */}
      {showSubCategory && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="sub_category_id">
            Sub-category
          </label>
          <select
            id="sub_category_id"
            {...register('sub_category_id')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">None</option>
            {filteredSubCategories.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Business Unit */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor="business_unit_id">
          Business Unit
        </label>
        <select
          id="business_unit_id"
          {...register('business_unit_id')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">None</option>
          {businessUnits.map((bu) => (
            <option key={bu.id} value={bu.id}>
              {bu.name}
            </option>
          ))}
        </select>
      </div>

      {/* Paid To / Recipient */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor="recipient_id">
          Paid To
        </label>
        <select
          id="recipient_id"
          {...register('recipient_id')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">None</option>
          {recipients.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
          <option value="other">Other (not in list)</option>
        </select>
      </div>

      {/* Free-text recipient name when "Other" selected */}
      {showRecipientOther && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="recipient_other">
            Recipient Name
          </label>
          <input
            id="recipient_other"
            type="text"
            placeholder="Enter recipient name"
            {...register('recipient_other')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">
            Ask admin to add if used regularly.
          </p>
          {errors.recipient_other && (
            <p className="text-xs text-red-600">{errors.recipient_other.message}</p>
          )}
        </div>
      )}

      {/* Amount */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor="amount">
          Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm pointer-events-none">
            ₹
          </span>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            {...register('amount')}
            className="w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {errors.amount && (
          <p className="text-xs text-red-600">{errors.amount.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          maxLength={500}
          placeholder="Optional notes…"
          {...register('notes')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {errors.notes && (
          <p className="text-xs text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving…' : mode === 'edit' ? 'Update Expense' : 'Add Expense'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/expenses')}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
