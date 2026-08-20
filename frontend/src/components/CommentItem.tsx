import type { Comment } from '../types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CommentItem({ comment }: { comment: Comment }) {
  const authorName = comment.author?.name || 'Utilisateur';
  const isAdmin = comment.author?.role === 'admin';

  return (
    <div className="border-b border-slate-100 py-4 last:border-b-0">
      <div className="flex items-center gap-2">
        <span className="font-medium text-ink">{authorName}</span>
        {isAdmin && (
          <span className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[11px] text-accent">
            ADMIN
          </span>
        )}
        <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{comment.content}</p>
    </div>
  );
}
