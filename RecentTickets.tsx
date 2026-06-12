'use client';

import Link from 'next/link';
import type { Ticket } from '@/types';

interface RecentTicketsProps {
  tickets: Ticket[];
  isLoading: boolean;
}

export default function RecentTickets({ tickets, isLoading }: RecentTicketsProps) {
  const priorityColors = {
    low: 'badge-primary',
    medium: 'badge-warning',
    high: 'badge-warning',
    critical: 'badge-danger',
  };

  const statusLabels = {
    new: 'Nuevo',
    published: 'Publicado',
    in_evaluation: 'En Evaluación',
    assigned: 'Asignado',
    in_progress: 'En Progreso',
    waiting_client: 'Esperando Cliente',
    resolved: 'Resuelto',
    closed: 'Cerrado',
    canceled: 'Cancelado',
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tickets Recientes</h3>
        <Link href="/dashboard/tickets" className="text-sm text-primary-700 hover:text-primary-800">
          Ver todos
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Categoría</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td><div className="skeleton h-6 w-32"></div></td>
                    <td><div className="skeleton h-6 w-24"></div></td>
                    <td><div className="skeleton h-6 w-20"></div></td>
                    <td><div className="skeleton h-6 w-20"></div></td>
                    <td><div className="skeleton h-6 w-8"></div></td>
                  </tr>
                ))}
              </>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-600 dark:text-gray-400">
                  No hay tickets
                </td>
              </tr>
            ) : (
              tickets.slice(0, 5).map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <Link
                      href={`/dashboard/tickets/${ticket.id}`}
                      className="text-primary-700 hover:text-primary-800 font-medium"
                    >
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="text-sm text-gray-600 dark:text-gray-400">
                    {ticket.category}
                  </td>
                  <td>
                    <span className={`badge ${priorityColors[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {statusLabels[ticket.status as keyof typeof statusLabels]}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/dashboard/tickets/${ticket.id}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
