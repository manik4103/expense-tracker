import { createClient } from '@/lib/supabase/server'
import CategoryManager from '@/components/admin/CategoryManager'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const [{ data: categories }, { data: subCategories }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('sub_categories').select('*').order('name'),
  ])
  return <CategoryManager categories={categories ?? []} subCategories={subCategories ?? []} />
}
