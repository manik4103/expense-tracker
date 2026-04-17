'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, BarChart2, FileText, Settings, LogOut } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import type { Profile } from '@/types/app.types'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
]

const adminItems = [
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/admin/categories', label: 'Admin', icon: Settings },
]

interface Props { profile: Profile }

export default function Sidebar({ profile }: Props) {
  const pathname = usePathname()
  const isAdmin = profile.role === 'admin'

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r min-h-screen sticky top-0">
      <div className="p-4 border-b">
        <h1 className="font-bold text-lg text-blue-600">ExpenseTracker</h1>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
        {isAdmin && (
          <>
            <div className="pt-3 pb-1">
              <p className="text-xs text-muted-foreground px-3 uppercase tracking-wide">Admin</p>
            </div>
            {adminItems.map(item => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>
      <div className="p-3 border-t">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium truncate">{profile.full_name}</p>
          <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
        </div>
        <form action={logout}>
          <button type="submit"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 w-full">
            <LogOut size={18} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
