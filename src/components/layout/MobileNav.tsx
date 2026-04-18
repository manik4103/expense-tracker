'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, PlusCircle, Menu } from 'lucide-react'
import { useState } from 'react'
import type { Profile } from '@/types/app.types'
import LogoutButton from './LogoutButton'

interface Props { profile: Profile }

export default function MobileNav({ profile }: Props) {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)
  const isAdmin = profile.role === 'admin'

  function isActive(href: string) {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  return (
    <>
      {/* Overlay for More menu */}
      {showMore && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-16 right-0 left-0 mx-4 bg-white rounded-xl shadow-lg border p-2 z-50"
            onClick={e => e.stopPropagation()}>
            {isAdmin && (
              <>
                <Link href="/analytics" onClick={() => setShowMore(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-sm">Analytics</Link>
                <Link href="/reports" onClick={() => setShowMore(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-sm">Reports</Link>
                <Link href="/admin/categories" onClick={() => setShowMore(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-sm">Admin Settings</Link>
                <hr className="my-1" />
              </>
            )}
            <p className="px-4 py-1 text-xs text-muted-foreground">{profile.full_name} · {profile.role}</p>
            <LogoutButton variant="menu" />
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t safe-area-inset-bottom">
        <div className="flex items-center">
          <Link href="/dashboard"
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-500'}`}>
            <LayoutDashboard size={22} />
            <span>Home</span>
          </Link>
          <Link href="/expenses"
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs ${isActive('/expenses') ? 'text-blue-600' : 'text-gray-500'}`}>
            <Receipt size={22} />
            <span>Expenses</span>
          </Link>
          <Link href="/expenses/new"
            className="flex-1 flex flex-col items-center py-2 gap-0.5 text-xs text-blue-600">
            <PlusCircle size={26} className="text-blue-600" />
            <span className="font-medium">Add</span>
          </Link>
          <button onClick={() => setShowMore(v => !v)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs ${showMore ? 'text-blue-600' : 'text-gray-500'}`}>
            <Menu size={22} />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  )
}
