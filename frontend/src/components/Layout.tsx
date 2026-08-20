import { NavLink, Outlet } from 'react-router-dom';
import { logout, useCurrentUser } from '../context/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-accent-soft text-accent' : 'text-slate-600 hover:bg-slate-100'
  }`;

export function Layout() {
    const { user, isAdmin } = useCurrentUser();

    return (
        <div className="min-h-screen bg-paper">
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-6">
                <NavLink to="/app" className="font-mono text-sm font-semibold text-ink">
                Ticketing
                </NavLink>
                <nav className="flex items-center gap-1">
                <NavLink to="/app" className={navLinkClass}>
                    Tableau de bord
                </NavLink>
                <NavLink to="/app/tickets" className={navLinkClass}>
                    Mes tickets
                </NavLink>
                {isAdmin && (
                    <NavLink to="/app/admin/tickets" className={navLinkClass}>
                    Administration
                    </NavLink>
                )}
                </nav>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">
                {user?.name}
                {isAdmin && (
                    <span className="ml-1.5 rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[11px] text-accent">
                    ADMIN
                    </span>
                )}
                </span>
                <button
                onClick={logout}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100"
                >
                Déconnexion
                </button>
            </div>
            </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">
            <Outlet />
        </main>
        </div>
    );
}
