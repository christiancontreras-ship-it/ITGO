'use client';

interface DashboardStatsProps {
  isLoading: boolean;
}

export default function DashboardStats({ isLoading }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Tickets Abiertos',
      value: '12',
      change: '+2 esta semana',
      icon: '📋',
      color: 'primary',
    },
    {
      title: 'Servicios Activos',
      value: '5',
      change: '+1 nuevo',
      icon: '⚙️',
      color: 'success',
    },
    {
      title: 'Gasto Mensual',
      value: '$2,450.00',
      change: '-5% vs mes anterior',
      icon: '💰',
      color: 'warning',
    },
    {
      title: 'SLA Compliance',
      value: '98.5%',
      change: 'Excelente',
      icon: '✅',
      color: 'success',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card hover:shadow-md transition"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? (
                    <div className="skeleton h-8 w-20"></div>
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {stat.change}
                </p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
