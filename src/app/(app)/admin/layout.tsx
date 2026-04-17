import { requireAdmin } from '@/lib/actions/auth'
import Link from 'next/link'

const navLinks = [
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/recipients', label: 'Recipients' },
  { href: '/admin/business-units', label: 'Business Units' },
  { href: '/admin/users', label: 'Users' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin</h1>
        <nav className="flex gap-4 mt-2 border-b pb-2">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  )
}
