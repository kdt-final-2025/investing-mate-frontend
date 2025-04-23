'use client';

import React from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface MetricProps {
  title: string;
  value: string | number;
  data?: number[];
  trend?: 'up' | 'down';
  className?: string;
}

export function Metric({ title, value, data, trend, className }: MetricProps) {
  const chartColor = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#6b7280';
  const textColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const chartData = data?.map((value) => ({ value })) || [];

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
          {data && data.length > 0 && (
            <div className="h-[40px] w-[100px]">
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
      </CardContent>
    </Card>
  );
} 