import {
  getCategories,
  getSubCategories,
  getBusinessUnits,
  getRecipients,
} from '@/lib/queries/reference'
import { getExpenseById } from '@/lib/queries/expenses'
import ExpenseForm from '@/components/expenses/ExpenseForm'

interface PageProps {
  params: { id: string }
}

export default async function EditExpensePage({ params }: PageProps) {
  const [expense, categories, subCategories, businessUnits, recipients] = await Promise.all([
    getExpenseById(params.id),
    getCategories(),
    getSubCategories(),
    getBusinessUnits(),
    getRecipients(),
  ])

  if (!expense) {
    return (
      <div className="text-center py-12 text-gray-500">
        Expense not found.
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Expense</h2>
        </div>
        <div className="px-6 py-5">
          <ExpenseForm
            mode="edit"
            initialData={expense}
            categories={categories}
            subCategories={subCategories}
            businessUnits={businessUnits}
            recipients={recipients}
          />
        </div>
      </div>
    </div>
  )
}
