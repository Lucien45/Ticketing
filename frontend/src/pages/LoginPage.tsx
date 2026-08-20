/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserService } from '../services/user.service';
import { Token } from '../utils/Token';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [UserLogin, setUserLogin] = useState({
        email: '', password: ''
    })
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const redirectTo = (location.state as { from?: Location })?.from?.pathname || '/dashboard';

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await UserService.loginUser(UserLogin);
            Token.AddToken('access_token', response.access_token);
            Token.AddToken('user', JSON.stringify(response.user));
            setUserLogin({ email: '', password: '' })
            navigate(redirectTo, { replace: true });
        } catch (error: any) {
            console.log("impossible de se connecter. ", error.response?.data || error.message);
            
            setError(true);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-paper px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                <p className="font-mono text-sm font-semibold text-ink">Ticketing</p>
                <h1 className="mt-2 text-xl font-semibold text-ink">Connexion</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    {error && (
                        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">Impossible de se connecter</p>
                    )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={UserLogin.email}
                        onChange={(e) => setUserLogin({ ...UserLogin, email: e.target.value})}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={UserLogin.password}
                        onChange={(e) => setUserLogin({ ...UserLogin, password: e.target.value})}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
                >
                    {loading ? 'Connexion…' : 'Se connecter'}
                </button>
                </form>

                <p className="mt-4 text-center text-sm text-slate-500">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="font-medium text-accent hover:underline">
                        S'inscrire
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage