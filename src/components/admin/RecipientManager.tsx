'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createRecipient, updateRecipient, deleteRecipient } from '@/lib/actions/admin'
import type { Recipient } from '@/types/app.types'

type RecipientType = 'supplier' | 'agent' | 'utility' | 'individual' | 'other'

const RECIPIENT_TYPES: RecipientType[] = ['supplier', 'agent', 'utility', 'individual', 'other']

const TYPE_BADGE_VARIANTS: Record<RecipientType, string> = {
  supplier: 'bg-blue-100 text-blue-800',
  agent: 'bg-purple-100 text-purple-800',
  utility: 'bg-yellow-100 text-yellow-800',
  individual: 'bg-green-100 text-green-800',
  other: 'bg-gray-100 text-gray-800',
}

interface Props { recipients: Recipient[] }

export default function RecipientManager({ recipients }: Props) {
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<RecipientType>('supplier')

  async function handleAddRecipient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAdding(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await createRecipient({
      name: fd.get('name') as string,
      type: selectedType,
      phone: (fd.get('phone') as string) || undefined,
      notes: (fd.get('notes') as string) || undefined,
    })
    setAdding(false)
    if (result.error) { setError(result.error); return }
    setShowAddForm(false)
    setSelectedType('supplier')
    ;(e.target as HTMLFormElement).reset()
    router.refresh()
  }

  async function handleToggleRecipient(id: string, isActive: boolean) {
    await updateRecipient(id, { is_active: !isActive })
    router.refresh()
  }

  async function handleDeleteRecipient(id: string) {
    if (!window.confirm('Delete recipient?')) return
    await deleteRecipient(id)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recipients</h2>
        <Button size="sm" onClick={() => setShowAddForm(v => !v)}>
          {showAddForm ? 'Cancel' : '+ Add Recipient'}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleAddRecipient} className="space-y-3">
              <Input name="name" placeholder="Recipient name *" required />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <div className="flex gap-2 flex-wrap">
                  {RECIPIENT_TYPES.map(t => (
                    <button key={t} type="button"
                      onClick={() => setSelectedType(t)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${
                        selectedType === t
                          ? 'border-gray-800 bg-gray-800 text-white'
                          : 'border-gray-300 text-gray-600 hover:border-gray-500'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Input name="phone" placeholder="Phone (optional)" />
              <Input name="notes" placeholder="Notes (optional)" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" size="sm" disabled={adding}>
                {adding ? 'Saving...' : 'Save Recipient'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {recipients.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No recipients yet</p>
        )}
        {recipients.map(recipient => {
          const typeBadge = recipient.type ? TYPE_BADGE_VARIANTS[recipient.type as RecipientType] ?? TYPE_BADGE_VARIANTS.other : TYPE_BADGE_VARIANTS.other
          return (
            <Card key={recipient.id} className={recipient.is_active ? '' : 'opacity-60'}>
              <CardContent className="py-3 px-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-medium text-sm truncate">{recipient.name}</span>
                    {recipient.type && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize shrink-0 ${typeBadge}`}>
                        {recipient.type}
                      </span>
                    )}
                    {recipient.phone && (
                      <span className="text-xs text-muted-foreground hidden sm:inline">{recipient.phone}</span>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="ghost" className="text-xs h-7"
                      onClick={() => handleToggleRecipient(recipient.id, recipient.is_active)}>
                      {recipient.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-7 text-red-600"
                      onClick={() => handleDeleteRecipient(recipient.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                {recipient.notes && (
                  <p className="text-xs text-muted-foreground mt-1 pl-0">{recipient.notes}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
