import {
  getCategories,
  getSubCategories,
  getBusinessUnits,
  getRecipients,
} from '@/lib/queries/reference'
import ExpenseForm from '@/components/expenses/ExpenseForm'

export default async function NewExpensePage() {
  const [categories, subCategories, businessUnits, recipients] = await Promise.all([
    getCategories(),
    getSubCategories(),
    getBusinessUnits(),
    getRecipients(),
  ])

  return (
    <div className="max-w-lg mx-auto">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Add Expense</h2>
        </div>
        <div className="px-6 py-5">
          <ExpenseForm
            mode="create"
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
