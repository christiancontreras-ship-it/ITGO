'use client';

import { useEffect, useState } from 'react';
import { useTicketStore } from '@/store/ticketStore';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentTickets from '@/components/dashboard/RecentTickets';
import SLAChart from '@/components/dashboard/SLAChart';
import AlertsPanel from '@/components/dashboard/AlertsPanel';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { tickets, fetchTickets } = useTicketStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchTickets();
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bienvenido a ITGO - Tu panel de control
        </p>
      </div>

      {/* Stats */}
      <DashboardStats isLoading={isLoading} />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tickets */}
        <div className="lg:col-span-2">
          <RecentTickets tickets={tickets} isLoading={isLoading} />
        </div>

        {/* Alerts */}
        <div>
          <AlertsPanel />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SLAChart />
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Actividad Reciente</h3>
          </div>
          <div className="card-body">
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No hay actividad reciente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
