/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../context/AuthContext';
import type { Ticket, TicketPriority } from '../types';
import { TicketSevice } from '../services/ticket.service';
import { TicketCard } from '../components/TicketCard';
import { Spinner } from '../components/Spinner';

export function TicketsPage() {
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const [dataTickets, setDataTickets] = useState({
        title: '', description: '',
    })
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    // const [title, setTitle] = useState('');
    // const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TicketPriority>('medium');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
  
    const myTickets = tickets
      .filter((t) => t.userId === user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
    async function handleCreate(e: FormEvent) {
      e.preventDefault();
      if (!user) return;
      setError(null);
      setSubmitting(true);
      try {
        const data = {
            title : dataTickets.title,
            description: dataTickets.description,
            priority: priority,
            userId: user.id
        }
        const ticket = await TicketSevice.createTicket(data);
        setShowForm(false);
        setDataTickets({
            title: '', description: ''
        })
        // setTitle('');
        // setDescription('');
        setPriority('medium');
        navigate(`/app/tickets/${ticket.id}`);
      } catch (err: any) {
        setError(`erreur. ${err.response?.data || err.message}`);
      } finally {
        setSubmitting(false);
      }
    }
  
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-ink">Mes tickets</h1>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            {showForm ? 'Annuler' : '+ Nouveau ticket'}
          </button>
        </div>
  
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mt-4 space-y-4 rounded-lg border border-slate-200 bg-white p-5"
          >
            {error && (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
            )}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                Titre
              </label>
              <input
                id="title"
                required
                value={dataTickets.title}
                onChange={(e) => setDataTickets({ ...dataTickets, title: e.target.value})}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Impossible de me connecter"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={dataTickets.description}
                onChange={(e) => setDataTickets({ ...dataTickets, description: e.target.value})}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Décrivez le problème rencontré…"
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-700">
                Priorité
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
            >
              {submitting ? 'Création…' : 'Créer le ticket'}
            </button>
          </form>
        )}
  
        <div className="mt-6 space-y-3">
          {loading ? (
            <Spinner />
          ) : myTickets.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400">
              Aucun ticket pour l'instant. Créez-en un pour commencer.
            </p>
          ) : (
            myTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
          )}
        </div>
      </div>
    );
  }