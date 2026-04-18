'use client'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateUserRole, toggleUserActive } from '@/lib/actions/admin'
import type { Profile } from '@/types/app.types'

interface Props { users: Profile[] }

export default function UserManager({ users }: Props) {
  const router = useRouter()

  async function handleRoleChange(userId: string, currentRole: string) {
    await updateUserRole(userId, currentRole === 'admin' ? 'staff' : 'admin')
    router.refresh()
  }

  async function handleToggleActive(userId: string, isActive: boolean) {
    await toggleUserActive(userId, !isActive)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Users</h2>
      </div>

      <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        New users sign up via the login page — share the app URL with your staff.
      </div>

      <div className="space-y-2">
        {users.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No users found</p>
        )}
        {users.map(user => (
          <Card key={user.id} className={user.is_active ? '' : 'opacity-60'}>
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-medium text-sm truncate">{user.full_name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                    user.role === 'admin'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'Staff'}
                  </span>
                  {!user.is_active && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 shrink-0">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="ghost" className="text-xs h-7"
                    onClick={() => handleRoleChange(user.id, user.role)}>
                    {user.role === 'admin' ? 'Make Staff' : 'Make Admin'}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs h-7"
                    onClick={() => handleToggleActive(user.id, user.is_active)}>
                    {user.is_active ? 'Deactivate' : 'Activate'}
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
