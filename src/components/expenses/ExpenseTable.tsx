'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteExpense } from '@/lib/actions/expenses'
import { formatINR } from '@/lib/utils/currency'
import { formatDate } from '@/lib/utils/date'
import type { ExpenseWithRelations } from '@/types/app.types'

interface ExpenseTableProps {
  expenses: ExpenseWithRelations[]
  isAdmin: boolean
}

export default function ExpenseTable({ expenses, isAdmin }: ExpenseTableProps) {
  const router = useRouter()

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No expenses found.
      </div>
    )
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this expense? This cannot be undone.')) return
    await deleteExpense(id)
    router.refresh()
  }

  return (
    <>
      {/* Desktop table — hidden on mobile */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Sub-cat</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Unit</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Paid To</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Notes</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {formatDate(exp.expense_date)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1">
                    {exp.categories?.icon && (
                      <span>{exp.categories.icon}</span>
                    )}
                    <span className="font-medium text-gray-800">{exp.categories?.name}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {exp.sub_categories?.name ?? <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {exp.business_units?.name ?? <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {exp.recipients?.name ?? <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                  {formatINR(exp.amount)}
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                  {exp.notes ?? <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/expenses/${exp.id}`}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Edit
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card stack — shown only on mobile */}
      <div className="sm:hidden space-y-3">
        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="rounded-lg border border-gray-200 bg-white p-4 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 font-medium text-gray-900">
                  {exp.categories?.icon && <span>{exp.categories.icon}</span>}
                  {exp.categories?.name}
                </span>
                {exp.sub_categories?.name && (
                  <span className="ml-1 text-xs text-gray-500">/ {exp.sub_categories.name}</span>
                )}
              </div>
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                {formatINR(exp.amount)}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span>{formatDate(exp.expense_date)}</span>
              {exp.business_units?.name && <span>{exp.business_units.name}</span>}
              {exp.recipients?.name && <span>To: {exp.recipients.name}</span>}
            </div>

            {exp.notes && (
              <p className="text-xs text-gray-600 line-clamp-2">{exp.notes}</p>
            )}

            <div className="flex gap-3 pt-1">
              <Link
                href={`/expenses/${exp.id}`}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Edit
              </Link>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
