"use client";

import React, { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const data = [
  { name: "Lun", amount: 4000 },
  { name: "Mar", amount: 3000 },
  { name: "Mer", amount: 5000 },
  { name: "Jeu", amount: 2780 },
  { name: "Ven", amount: 1890 },
  { name: "Sam", amount: 2390 },
  { name: "Dim", amount: 3490 },
];

export default function RecoveryChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-64 mt-4 bg-slate-50/50 animate-pulse rounded-3xl" />;

  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
              color: '#fff'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#ffffff" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
