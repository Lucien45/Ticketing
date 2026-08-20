import type { TicketPriority } from '../types';

const PRIORITY_LABEL: Record<TicketPriority, string> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  urgent: 'URGENT',
};

const PRIORITY_COLOR: Record<TicketPriority, string> = {
  low: 'bg-priority-low',
  medium: 'bg-priority-medium',
  high: 'bg-priority-high',
  urgent: 'bg-priority-urgent',
};

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-slate-600">
      <span className={`h-2 w-2 rounded-full ${PRIORITY_COLOR[priority]}`} aria-hidden="true" />
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
