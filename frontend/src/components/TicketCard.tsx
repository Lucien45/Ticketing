/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router-dom';
import type { Ticket } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

const PRIORITY_BORDER: Record<Ticket['priority'], string> = {
  low: 'border-l-priority-low',
  medium: 'border-l-priority-medium',
  high: 'border-l-priority-high',
  urgent: 'border-l-priority-urgent',
};

// Les tickets utilisent des UUID côté backend : on affiche les 8 premiers
// caractères comme identifiant court, façon "#a1b2c3d4".
export function shortId(id: string): string {
  return id.slice(0, 8);
}

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Link
      to={`/app/tickets/${ticket.id}`}
      className={`block rounded-lg border border-l-4 border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow ${PRIORITY_BORDER[ticket.priority]}`}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-slate-400">#{shortId(ticket.id)}</span>
        <h3 className="font-medium text-ink">{ticket.title}</h3>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <PriorityBadge priority={ticket.priority} />
        <span className="text-slate-300">|</span>
        <StatusBadge status={ticket.status} />
      </div>
    </Link>
  );
}
