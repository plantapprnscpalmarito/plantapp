'use client'

import React from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend
} from 'recharts'

const data = [
  { month: 'Ene', survival: 98, growth: 12 },
  { month: 'Feb', survival: 95, growth: 15 },
  { month: 'Mar', survival: 92, growth: 22 },
  { month: 'Abr', survival: 90, growth: 28 },
  { month: 'May', survival: 88, growth: 35 },
  { month: 'Jun', survival: 86, growth: 42 },
]

export function SurvivalChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSurvival" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: '#64748b'}}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: '#64748b'}}
            domain={[70, 100]}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="survival" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSurvival)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GrowthChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: '#64748b'}}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: '#64748b'}}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar 
            dataKey="growth" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
