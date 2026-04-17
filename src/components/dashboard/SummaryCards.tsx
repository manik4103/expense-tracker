import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR } from '@/lib/utils/currency'

interface SummaryCardsProps {
  today: number
  week: number
  month: number
  year: number
}

export default function SummaryCards({ today, week, month, year }: SummaryCardsProps) {
  const cards = [
    { label: 'Today', value: today, color: 'text-blue-600' },
    { label: 'This Week', value: week, color: 'text-purple-600' },
    { label: 'This Month', value: month, color: 'text-orange-600' },
    { label: 'This Year', value: year, color: 'text-green-600' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(card => (
        <Card key={card.label}>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className={`text-xl font-bold ${card.color} sm:text-2xl`}>{formatINR(card.value)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
