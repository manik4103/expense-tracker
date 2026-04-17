import { createClient } from '@/lib/supabase/server'

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return data?.role === 'admin'
}

async function getUserId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

// Summary totals for dashboard cards
export async function getSummaryTotals() {
  const supabase = await createClient()
  const admin = await isAdmin()
  const userId = await getUserId()
  if (!userId) return { today: 0, week: 0, month: 0, year: 0 }

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]

  // Start of week (Monday)
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
  const weekStartStr = weekStart.toISOString().split('T')[0]

  // Start of month
  const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

  // Start of year
  const yearStartStr = `${now.getFullYear()}-01-01`

  async function sumFor(from: string, to: string): Promise<number> {
    let q = supabase.from('expenses').select('amount').gte('expense_date', from).lte('expense_date', to)
    if (!admin) q = q.eq('entered_by', userId!)
    const { data } = await q
    return (data ?? []).reduce((sum, r) => sum + Number(r.amount), 0)
  }

  const [today, week, month, year] = await Promise.all([
    sumFor(todayStr, todayStr),
    sumFor(weekStartStr, todayStr),
    sumFor(monthStartStr, todayStr),
    sumFor(yearStartStr, todayStr),
  ])

  return { today, week, month, year }
}

// Spend by category for current month (pie chart)
export async function getSpendByCategory(monthStr?: string) {
  const supabase = await createClient()
  const admin = await isAdmin()
  const userId = await getUserId()
  if (!userId) return []

  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const from = monthStr ?? `${year}-${month}-01`
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const to = monthStr ? `${monthStr.slice(0, 7)}-${lastDay}` : `${year}-${month}-${lastDay}`

  let q = supabase
    .from('expenses')
    .select('amount, categories(name, color)')
    .gte('expense_date', from)
    .lte('expense_date', to)
  if (!admin) q = q.eq('entered_by', userId)

  const { data } = await q

  // Aggregate by category
  const map = new Map<string, { name: string; color: string | null; total: number }>()
  for (const row of data ?? []) {
    const cat = (row.categories as unknown as { name: string; color: string | null } | null)
    if (!cat) continue
    const key = cat.name
    const existing = map.get(key)
    if (existing) {
      existing.total += Number(row.amount)
    } else {
      map.set(key, { name: cat.name, color: cat.color, total: Number(row.amount) })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

// Monthly spend for last 6 months (line chart)
export async function getMonthlyTrend() {
  const supabase = await createClient()
  const admin = await isAdmin()
  const userId = await getUserId()
  if (!userId) return []

  // Last 6 months
  const months: { label: string; from: string; to: string }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const lastDay = new Date(y, d.getMonth() + 1, 0).getDate()
    months.push({
      label: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }),
      from: `${y}-${m}-01`,
      to: `${y}-${m}-${lastDay}`,
    })
  }

  const results = await Promise.all(
    months.map(async ({ label, from, to }) => {
      let q = supabase.from('expenses').select('amount').gte('expense_date', from).lte('expense_date', to)
      if (!admin) q = q.eq('entered_by', userId!)
      const { data } = await q
      const total = (data ?? []).reduce((sum, r) => sum + Number(r.amount), 0)
      return { month: label, total }
    })
  )
  return results
}

// Recent expenses (last 5) for dashboard quick view
export async function getRecentExpenses() {
  const supabase = await createClient()
  const admin = await isAdmin()
  const userId = await getUserId()
  if (!userId) return []

  let q = supabase
    .from('expenses')
    .select('id, expense_date, amount, notes, categories(name, color), recipients(name)')
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)
  if (!admin) q = q.eq('entered_by', userId)
  const { data } = await q
  return data ?? []
}

// Spend by business unit per month (for comparison chart)
export async function getUnitComparison() {
  const supabase = await createClient()
  const admin = await isAdmin()
  const userId = await getUserId()
  if (!userId) return { data: [], units: [] }

  // Last 6 months
  const months: { label: string; from: string; to: string }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const lastDay = new Date(y, d.getMonth() + 1, 0).getDate()
    months.push({
      label: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }),
      from: `${y}-${m}-01`,
      to: `${y}-${m}-${lastDay}`,
    })
  }

  // Get all business units
  const { data: units } = await supabase.from('business_units').select('id, name').eq('is_active', true)
  const unitList = units ?? []

  const results = await Promise.all(
    months.map(async ({ label, from, to }) => {
      const row: Record<string, string | number> = { month: label }
      await Promise.all(
        unitList.map(async (unit) => {
          let q = supabase.from('expenses').select('amount')
            .eq('business_unit_id', unit.id)
            .gte('expense_date', from).lte('expense_date', to)
          if (!admin) q = q.eq('entered_by', userId!)
          const { data } = await q
          row[unit.name] = (data ?? []).reduce((s, r) => s + Number(r.amount), 0)
        })
      )
      return row
    })
  )
  return { data: results, units: unitList.map(u => u.name) }
}

// Top recipients by spend (for current month or date range)
export async function getTopRecipients(from?: string, to?: string) {
  const supabase = await createClient()
  const admin = await isAdmin()
  const userId = await getUserId()
  if (!userId) return []

  const now = new Date()
  const defaultFrom = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const defaultTo = now.toISOString().split('T')[0]

  let q = supabase
    .from('expenses')
    .select('amount, recipients(name)')
    .gte('expense_date', from ?? defaultFrom)
    .lte('expense_date', to ?? defaultTo)
  if (!admin) q = q.eq('entered_by', userId)
  const { data } = await q

  const map = new Map<string, number>()
  for (const row of data ?? []) {
    const name = (row.recipients as unknown as { name: string } | null)?.name ?? 'Unknown'
    map.set(name, (map.get(name) ?? 0) + Number(row.amount))
  }
  return Array.from(map.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
}

// All expenses for reports page with full filters
export async function getFilteredExpenses(filters: {
  from?: string
  to?: string
  category_id?: string
  business_unit_id?: string
  recipient_id?: string
}) {
  const supabase = await createClient()
  const admin = await isAdmin()
  const userId = await getUserId()
  if (!userId) return []

  let q = supabase
    .from('expenses')
    .select(`id, expense_date, amount, notes,
      categories(name),
      sub_categories(name),
      business_units(name),
      recipients(name),
      profiles(full_name)`)
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (!admin) q = q.eq('entered_by', userId)
  if (filters.from) q = q.gte('expense_date', filters.from)
  if (filters.to) q = q.lte('expense_date', filters.to)
  if (filters.category_id) q = q.eq('category_id', filters.category_id)
  if (filters.business_unit_id) q = q.eq('business_unit_id', filters.business_unit_id)
  if (filters.recipient_id) q = q.eq('recipient_id', filters.recipient_id)

  const { data, error } = await q
  if (error) { console.error(error); return [] }
  return data ?? []
}
