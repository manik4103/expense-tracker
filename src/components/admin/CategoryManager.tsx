'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  createCategory, updateCategory, deleteCategory,
  createSubCategory, deleteSubCategory
} from '@/lib/actions/admin'
import type { Category, SubCategory } from '@/types/app.types'

const PRESET_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#F97316', '#6366F1', '#EC4899', '#6B7280']

interface Props { categories: Category[]; subCategories: SubCategory[] }

export default function CategoryManager({ categories, subCategories }: Props) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])

  async function handleAddCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAdding(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await createCategory({
      name: fd.get('name') as string,
      description: (fd.get('description') as string) || undefined,
      color: selectedColor,
    })
    setAdding(false)
    if (result.error) { setError(result.error); return }
    setShowAddForm(false)
    setSelectedColor(PRESET_COLORS[0])
    ;(e.target as HTMLFormElement).reset()
  }

  async function handleAddSubCategory(e: React.FormEvent<HTMLFormElement>, categoryId: string) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get('subname') as string
    if (!name.trim()) return
    await createSubCategory({ category_id: categoryId, name: name.trim() })
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categories</h2>
        <Button size="sm" onClick={() => setShowAddForm(v => !v)}>
          {showAddForm ? 'Cancel' : '+ Add Category'}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleAddCategory} className="space-y-3">
              <Input name="name" placeholder="Category name *" required />
              <Input name="description" placeholder="Description (optional)" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Color</p>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button key={c} type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" size="sm" disabled={adding}>
                {adding ? 'Saving...' : 'Save Category'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No categories yet</p>
        )}
        {categories.map(cat => {
          const subs = subCategories.filter(s => s.category_id === cat.id)
          const isExpanded = expandedId === cat.id
          return (
            <Card key={cat.id} className={cat.is_active ? '' : 'opacity-60'}>
              <CardContent className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {cat.color && <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />}
                    <span className="font-medium text-sm">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{subs.length} sub-cats</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="text-xs h-7"
                      onClick={() => setExpandedId(isExpanded ? null : cat.id)}>
                      {isExpanded ? 'Collapse' : 'Sub-cats'}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-7"
                      onClick={() => updateCategory(cat.id, { is_active: !cat.is_active })}>
                      {cat.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-7 text-red-600"
                      onClick={() => { if (window.confirm('Delete category?')) deleteCategory(cat.id) }}>
                      Delete
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    {subs.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between pl-4">
                        <span className="text-sm">{sub.name}</span>
                        <Button size="sm" variant="ghost" className="text-xs h-6 text-red-600"
                          onClick={() => deleteSubCategory(sub.id)}>Remove</Button>
                      </div>
                    ))}
                    <form onSubmit={(e) => handleAddSubCategory(e, cat.id)} className="flex gap-2 pl-4">
                      <Input name="subname" placeholder="New sub-category" className="h-8 text-sm" />
                      <Button type="submit" size="sm" className="h-8">Add</Button>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
