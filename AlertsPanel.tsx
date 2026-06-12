'use client';

import Link from 'next/link';

export default function AlertsPanel() {
  const alerts = [
    {
      id: 1,
      title: 'CPU Alto en PROD-SERVER-01',
      severity: 'warning',
      time: 'hace 15 minutos',
    },
    {
      id: 2,
      title: 'Ticket crítico asignado',
      severity: 'critical',
      time: 'hace 2 horas',
    },
    {
      id: 3,
      title: 'Backup completado exitosamente',
      severity: 'info',
      time: 'hace 4 horas',
    },
  ];

  const severityColors = {
    critical: 'border-error text-error',
    warning: 'border-warning text-warning',
    info: 'border-primary-700 text-primary-700',
  };

  const severityBg = {
    critical: 'bg-error bg-opacity-10',
    warning: 'bg-warning bg-opacity-10',
    info: 'bg-primary-700 bg-opacity-10',
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="text-lg font-semibold">Alertas</h3>
        <Link href="/dashboard/monitoring" className="text-sm text-primary-700 hover:text-primary-800">
          Ver todas
        </Link>
      </div>
      <div className="space-y-3 card-body">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 ${severityColors[alert.severity as keyof typeof severityColors]} ${severityBg[alert.severity as keyof typeof severityBg]} p-3 rounded`}
          >
            <p className="font-medium text-sm">{alert.title}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {alert.time}
            </p>
          </div>
        ))}
        
        {alerts.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400 py-4">
            No hay alertas
          </p>
        )}
      </div>
    </div>
  );
}
