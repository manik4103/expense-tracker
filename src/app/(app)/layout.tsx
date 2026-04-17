import { getProfile } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-4 py-6 pb-24 md:pb-6 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
      <MobileNav profile={profile} />
    </div>
  )
}
