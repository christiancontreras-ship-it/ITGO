'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SLAChart() {
  const data = [
    { month: 'Ene', compliance: 96, target: 99 },
    { month: 'Feb', compliance: 97, target: 99 },
    { month: 'Mar', compliance: 98, target: 99 },
    { month: 'Abr', compliance: 98.5, target: 99 },
    { month: 'May', compliance: 99, target: 99 },
    { month: 'Jun', compliance: 98.8, target: 99 },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold">SLA Compliance</h3>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" />
            <XAxis dataKey="month" stroke="currentColor" />
            <YAxis stroke="currentColor" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="compliance"
              stroke="#0057FF"
              name="Cumplimiento"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#10B981"
              name="Meta"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
