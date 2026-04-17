import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return new NextResponse('Forbidden', { status: 403 })

  const { searchParams } = request.nextUrl
  const from = searchParams.get('from') ?? '2020-01-01'
  const to = searchParams.get('to') ?? new Date().toISOString().split('T')[0]
  const category_id = searchParams.get('category_id')
  const business_unit_id = searchParams.get('business_unit_id')
  const recipient_id = searchParams.get('recipient_id')

  let q = supabase
    .from('expenses')
    .select(`expense_date, amount, notes,
      categories(name), sub_categories(name),
      business_units(name), recipients(name), profiles(full_name)`)
    .gte('expense_date', from)
    .lte('expense_date', to)
    .order('expense_date', { ascending: false })

  if (category_id) q = q.eq('category_id', category_id)
  if (business_unit_id) q = q.eq('business_unit_id', business_unit_id)
  if (recipient_id) q = q.eq('recipient_id', recipient_id)

  const { data, error } = await q
  if (error) return new NextResponse('Query failed', { status: 500 })

  const header = 'Date,Category,Sub-Category,Business Unit,Recipient,Amount (INR),Notes,Entered By\n'
  const rows = (data ?? []).map(e => {
    const cols = [
      e.expense_date,
      (e.categories as unknown as { name: string } | null)?.name ?? '',
      (e.sub_categories as unknown as { name: string } | null)?.name ?? '',
      (e.business_units as unknown as { name: string } | null)?.name ?? '',
      (e.recipients as unknown as { name: string } | null)?.name ?? '',
      e.amount,
      `"${(e.notes ?? '').replace(/"/g, '""')}"`,
      (e.profiles as unknown as { full_name: string } | null)?.full_name ?? '',
    ]
    return cols.join(',')
  })

  const csv = header + rows.join('\n')
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="expenses-${from}-to-${to}.csv"`,
    },
  })
}
