'use client'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

interface Props {
  variant?: 'sidebar' | 'menu'
}

export default function LogoutButton({ variant = 'sidebar' }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (variant === 'menu') {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-sm text-red-600 w-full disabled:opacity-50"
      >
        {loading ? 'Signing out...' : 'Sign out'}
      </button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 w-full disabled:opacity-50"
    >
      <LogOut size={18} />
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  )
}
