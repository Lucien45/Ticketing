/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Comment, Ticket, TicketPriority, TicketStatus, User } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { shortId } from '../components/TicketCard';
import { Spinner } from '../components/Spinner';
import { useCurrentUser } from '../context/AuthContext';
import { extractErrorMessage } from '../api/axios';
import { TicketSevice } from '../services/ticket.service';
import { CommentService } from '../services/comment.service';
import { UserService } from '../services/user.service';
import { CommentItem } from '../components/CommentItem';

const STATUS_OPTIONS: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
const PRIORITY_OPTIONS: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useCurrentUser();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [replyContent, setReplyContent] = useState('');
  const [postingReply, setPostingReply] = useState(false);
  const [assigneeId, setAssigneeId] = useState('');
  const [savingField, setSavingField] = useState<string | null>(null);

  const getTicket = (id: string) => TicketSevice.fetchTicket(id);
  const getComment = (id: string) => CommentService.fetchCommentsByTicket(id);

  function load() {
    if (!id) return;

    let ignore = false;
    setLoading(true);
    setError(null);
    Promise.all([getTicket(id), getComment(id)])
      .then(([ticketData, commentsData]) => {
        if (ignore) return;
        setTicket(ticketData);
        setComments(commentsData);
        setAssigneeId(ticketData.assignedToId ?? '');
      })
      .catch((err) => {
        if (!ignore) setError(extractErrorMessage(err))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      });
    return () => {
        ignore =true;
    }
  }

  useEffect(load, [id]);

  useEffect(() => {
    if (isAdmin) {
      UserService.fetchUsers().then(setUsers).catch(() => setUsers([]));
    }
  }, [isAdmin]);

  async function handlePostReply(e: FormEvent) {
    e.preventDefault();
    if (!id || !user || !replyContent.trim()) return;
    setPostingReply(true);
    setError(null);
    try {
      const comment = await CommentService.createComment({
        content: replyContent.trim(),
        ticketId: id,
        authorId: String(user.id),
      });
      setComments((prev) => [...prev, comment]);
      setReplyContent('');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setPostingReply(false);
    }
  }

  async function handleFieldUpdate(field: string, value: unknown) {
    if (!id) return;
    setSavingField(field);
    setError(null);
    try {
      const updated = await TicketSevice.updateTicket(id, { [field]: value });
      
      setTicket(updated);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSavingField(null);
    }
  }

  async function handleCloseTicket() {
    await handleFieldUpdate('status', 'closed');
  }

  if (loading) return <Spinner />;

  if (!ticket) {
    return (
      <div>
        <p className="text-sm text-rose-600">{error || "Ce ticket n'existe pas."}</p>
        <Link to="/app/tickets" className="mt-4 inline-block text-sm text-accent hover:underline">
          ← Retour
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/app/tickets')}
        className="text-sm text-slate-500 transition hover:text-ink"
      >
        ← Retour
      </button>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-sm text-slate-400">#{shortId(ticket.id)}</span>
          <h1 className="mt-1 text-2xl font-semibold text-ink">{ticket.title}</h1>
        </div>
        {ticket.status !== 'closed' && (
          <button
            onClick={handleCloseTicket}
            disabled={savingField === 'status'}
            className="whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Fermer le ticket
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-6 rounded-lg border border-slate-200 bg-white p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</p>
          {isAdmin ? (
            <select
              value={ticket.status}
              disabled={savingField === 'status'}
              onChange={(e) => handleFieldUpdate('status', e.target.value)}
              className="mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          ) : (
            <div className="mt-1">
              <StatusBadge status={ticket.status} />
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Priority</p>
          {isAdmin ? (
            <select
              value={ticket.priority}
              disabled={savingField === 'priority'}
              onChange={(e) => handleFieldUpdate('priority', e.target.value)}
              className="mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p.toUpperCase()}
                </option>
              ))}
            </select>
          ) : (
            <div className="mt-1">
              <PriorityBadge priority={ticket.priority} />
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="min-w-[220px]">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Assigné à
            </p>
            <div className="mt-1 flex gap-2">
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Non assigné</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleFieldUpdate('assignedToId', assigneeId || null)}
                disabled={savingField === 'assignedToId'}
                className="whitespace-nowrap rounded-md bg-accent px-3 py-1 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
              >
                Assigner
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Description
        </h2>
        <div className="mt-2 border-t border-slate-200 pt-3">
          <p className="whitespace-pre-wrap text-sm text-slate-700">{ticket.description}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Commentaires
        </h2>
        <div className="mt-2 border-t border-slate-200">
          {comments.length === 0 ? (
            <p className="py-4 text-sm text-slate-400">Aucun commentaire pour l'instant.</p>
          ) : (
            comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
          )}
        </div>

        <form onSubmit={handlePostReply} className="mt-4">
          <label htmlFor="reply" className="sr-only">
            Écrire une réponse
          </label>
          <textarea
            id="reply"
            rows={3}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Écrire une réponse…"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={postingReply || !replyContent.trim()}
            className="mt-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {postingReply ? 'Envoi…' : 'Écrire une réponse'}
          </button>
        </form>
      </section>
    </div>
  );
}
