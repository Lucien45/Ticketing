/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import type { Ticket, TicketPriority, TicketStatus } from '../types';
import { TicketCard } from '../components/TicketCard';
import { Spinner } from '../components/Spinner';
import { TicketSevice } from '../services/ticket.service';

const STATUS_ORDER: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
const PRIORITY_ORDER: TicketPriority[] = ['urgent', 'high', 'medium', 'low'];

const STATUS_LABEL: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'En cours',
  resolved: 'Résolus',
  closed: 'Fermés',
};

export function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

    const getTickets = async() => {
        try {
        const response = await TicketSevice.fetchTickets();
            setTickets(response);
        } catch (error) {
            console.warn(error);
        } finally {
            setLoading(false);
        }
    }

  useEffect(() => {
    getTickets();
  }, []);

  const statusCounts = useMemo(() => {
    const counts: Record<TicketStatus, number> = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    tickets.forEach((t) => counts[t.status]++);
    return counts;
  }, [tickets]);

  const priorityCounts = useMemo(() => {
    const counts: Record<TicketPriority, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
    tickets.forEach((t) => counts[t.priority]++);
    return counts;
  }, [tickets]);

  const filteredTickets = tickets
    .filter((t) => statusFilter === 'all' || t.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Administration des tickets</h1>
      <p className="mt-1 text-sm text-slate-500">
        Vue d'ensemble de tous les tickets, tous utilisateurs confondus.
      </p>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Statistiques
            </h2>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATUS_ORDER.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                  className={`rounded-lg border p-4 text-left transition ${
                    statusFilter === status
                      ? 'border-accent bg-accent-soft'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {STATUS_LABEL[status]}
                  </p>
                  <p className="mt-1 font-mono text-2xl font-semibold text-ink">
                    {statusCounts[status]}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-white p-4">
              {PRIORITY_ORDER.map((priority) => (
                <div key={priority} className="text-sm text-slate-600">
                  <span className="font-mono uppercase text-slate-400">{priority}</span>{' '}
                  <span className="font-mono font-semibold text-ink">
                    {priorityCounts[priority]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Tickets ({filteredTickets.length})
              </h2>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="text-sm text-accent hover:underline"
                >
                  Réinitialiser le filtre
                </button>
              )}
            </div>
            <div className="mt-3 space-y-3">
              {filteredTickets.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400">
                  Aucun ticket ne correspond à ce filtre.
                </p>
              ) : (
                filteredTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
