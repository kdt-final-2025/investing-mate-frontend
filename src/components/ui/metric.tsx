import { Card } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface MetricProps {
  title: string
  value: string
  description: string
  isPositive?: boolean
  data?: number[]
  trend?: 'up' | 'down'
}

export function Metric({ title, value, description, isPositive, data, trend }: MetricProps) {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-neutral-300';
  const chartColor = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#6b7280';

  const chartData = data?.map((value) => ({ value })) || [];

  return (
    <Card className="p-6 bg-black/[0.96] border border-neutral-800 hover:border-neutral-700 transition-colors">
      <h3 className="text-lg font-medium text-neutral-300">{title}</h3>
      <div className="flex items-center justify-between mt-2 gap-4">
        <p className={`text-3xl font-bold ${trendColor}`}>{value}</p>
        {data && data.length > 0 && (
          <div className="h-[40px] w-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  fill={chartColor}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <p className={`mt-2 text-sm ${isPositive === undefined ? 'text-gray-500' : isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {description}
      </p>
    </Card>
  )
} 