import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
} from 'recharts'
import { TrendingUp } from 'lucide-react'

const defaultData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

export default function ChartAreaGradient({ data = defaultData, title, description, footerLabel, footerDate, dataKeys = ['desktop', 'mobile'], colors = ['#14b8a6', '#8b5cf6'] }) {
  const [color1, color2] = colors
  const key1 = dataKeys[0]
  const key2 = dataKeys[1] || dataKeys[0]
  const showSecondArea = key2 !== key1

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="font-display font-semibold text-navy">{title}</h3>}
          {description && <p className="text-sm text-slate-light">{description}</p>}
        </div>
      )}
      <div className="h-64">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Tooltip
            cursor={false}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-border bg-white p-3 shadow-sm">
                    <p className="text-sm font-medium text-navy mb-2">{label}</p>
                    {payload.map((entry, index) => (
                      <p key={index} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                      </p>
                    ))}
                  </div>
                )
              }
              return null
            }}
          />
          <defs>
            <linearGradient id="fillGradient1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color1} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color1} stopOpacity={0.1} />
            </linearGradient>
            {showSecondArea && (
              <linearGradient id="fillGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color2} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color2} stopOpacity={0.1} />
              </linearGradient>
            )}
          </defs>
          {showSecondArea && (
            <Area
              dataKey={key2}
              type="natural"
              fill="url(#fillGradient2)"
              fillOpacity={0.4}
              stroke={color2}
              stackId="a"
              name={key2}
            />
          )}
          <Area
            dataKey={key1}
            type="natural"
            fill={showSecondArea ? 'url(#fillGradient1)' : color1}
            fillOpacity={showSecondArea ? 0.4 : 0.2}
            stroke={color1}
            stackId={showSecondArea ? 'a' : undefined}
            name={key1}
          />
        </AreaChart>
      </div>
      {(footerLabel || footerDate) && (
        <div className="flex w-full items-start gap-2 text-sm mt-4">
          <div className="grid gap-2">
            {footerLabel && (
              <div className="flex items-center gap-2 leading-none font-medium text-navy">
                {footerLabel} <TrendingUp className="h-4 w-4" />
              </div>
            )}
            {footerDate && (
              <div className="flex items-center gap-2 leading-none text-slate-light">
                {footerDate}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
