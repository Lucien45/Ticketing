/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Ticket } from '../types';
import { useCurrentUser } from '../context/AuthContext';
import { TicketSevice } from '../services/ticket.service';
import LoadingSpinner from '../components/LoadingSpinner';

export function DashboardPage() {
  const { user, isAdmin } = useCurrentUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const getTickets = async() => {
    try {
       const response = await TicketSevice.fetchTickets();
       console.log('liste ticket: ', response);
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

  const myTickets = tickets.filter((t) => t.userId === user?.id);
  const openCount = myTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;
  const resolvedCount = myTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Bonjour {user?.name}</h1>
      <p className="mt-1 text-sm text-slate-500">Voici un aperçu de votre activité.</p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Mes tickets
            </p>
            <p className="mt-2 font-mono text-3xl font-semibold text-ink">{myTickets.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              En cours
            </p>
            <p className="mt-2 font-mono text-3xl font-semibold text-status-progress">
              {openCount}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Résolus
            </p>
            <p className="mt-2 font-mono text-3xl font-semibold text-status-resolved">
              {resolvedCount}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/app/tickets"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
        >
          Voir mes tickets
        </Link>
        {isAdmin && (
          <Link
            to="/app/admin/tickets"
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-slate-50"
          >
            Administration des tickets
          </Link>
        )}
      </div>
    </div>
  );
}
