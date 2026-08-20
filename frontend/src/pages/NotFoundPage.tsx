import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <p className="font-mono text-sm text-slate-400">404</p>
      <h1 className="mt-2 text-xl font-semibold text-ink">Page introuvable</h1>
      <Link to="/app" className="mt-4 text-sm text-accent hover:underline">
        Retour au tableau de bord
      </Link>
    </div>
  );
}
