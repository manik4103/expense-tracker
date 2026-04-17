'use client'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createBusinessUnit, updateBusinessUnit } from '@/lib/actions/admin'
import type { BusinessUnit } from '@/types/app.types'

interface Props { units: BusinessUnit[] }

export default function BusinessUnitManager({ units }: Props) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAddUnit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAdding(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await createBusinessUnit({
      name: fd.get('name') as string,
      description: (fd.get('description') as string) || undefined,
    })
    setAdding(false)
    if (result.error) { setError(result.error); return }
    setShowAddForm(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Business Units</h2>
        <Button size="sm" onClick={() => setShowAddForm(v => !v)}>
          {showAddForm ? 'Cancel' : '+ Add Business Unit'}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleAddUnit} className="space-y-3">
              <Input name="name" placeholder="Business unit name *" required />
              <Input name="description" placeholder="Description (optional)" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" size="sm" disabled={adding}>
                {adding ? 'Saving...' : 'Save Business Unit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {units.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No business units yet</p>
        )}
        {units.map(unit => (
          <Card key={unit.id} className={unit.is_active ? '' : 'opacity-60'}>
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-medium text-sm">{unit.name}</span>
                  {unit.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{unit.description}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="ghost" className="text-xs h-7"
                    onClick={() => updateBusinessUnit(unit.id, { is_active: !unit.is_active })}>
                    {unit.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
