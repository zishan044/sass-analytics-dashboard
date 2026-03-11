'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
} from 'recharts';

import { AnalyticsEntry } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsChartProps {
  data: AnalyticsEntry[];
  title: string;
  dataKey: "events" | "revenue";
  color: string;
}

export function AnalyticsChart({ data, title, dataKey, color }: AnalyticsChartProps) {
  // Simple date formatter for the axis labels
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center p-0 pb-4">
        <AreaChart
          responsive
          style={{ 
            width: '100%', 
            maxWidth: '100%', 
            maxHeight: '400px', 
            aspectRatio: 1.618 
          }}
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            fontSize={12}
            niceTicks="snap125"
          />
          <YAxis 
            width="auto"
            fontSize={12}
            niceTicks="snap125"
            tickFormatter={(val) => dataKey === "revenue" ? `$${val}` : val}
          />
          <Tooltip 
             contentStyle={{ 
               backgroundColor: 'hsl(var(--background))', 
               borderColor: 'hsl(var(--border))',
               borderRadius: '8px' 
             }}
             labelFormatter={(label) => formatDate(label as string)}
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            fill={color} 
            fillOpacity={0.2} 
            strokeWidth={2}
          />
        </AreaChart>
      </CardContent>
    </Card>
  );
}