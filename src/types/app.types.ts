import type { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type BusinessUnit = Database['public']['Tables']['business_units']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type SubCategory = Database['public']['Tables']['sub_categories']['Row']
export type Recipient = Database['public']['Tables']['recipients']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']

export type ExpenseWithRelations = Expense & {
  categories: Pick<Category, 'id' | 'name' | 'color' | 'icon'>
  sub_categories: Pick<SubCategory, 'id' | 'name'> | null
  business_units: Pick<BusinessUnit, 'id' | 'name'> | null
  recipients: Pick<Recipient, 'id' | 'name'> | null
  profiles: Pick<Profile, 'id' | 'full_name'>
}
