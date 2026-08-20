/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserService } from '../services/user.service';

const RegisterPage = () => {

    const navigate = useNavigate();
    const [UserRegister, setUserRegister] = useState({
        name: '', email: '', password: '', confirmPwd: ''
    });
    const [error, setError] = useState<boolean>(false);
    const [userCreationSuccess, setUserCreationSuccess] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: { target: { name: string; value: string } }) => {
        if (e.target.name === "name") {
            const value = e.target.value;
            if (/^[A-Za-z' ]*$/.test(value)) {
                setUserRegister({ ...UserRegister, name: value});
            }
        }
        if (e.target.name === "email") {
            // Email validation regex pattern
            const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            const value = e.target.value;
            setUserRegister({ ...UserRegister, email: value});
            if (!emailPattern.test(value)) {
                setEmailError(true);
            } else {
                setEmailError(false);
            }
        }
        if (e.target.name === "password") {
        setUserRegister({ ...UserRegister, password: e.target.value});
        }
    };

    const handleConfirmPasswordChange = (e: { target: { value: string } }) => {
        const confirmPwd = e.target.value;
        setUserRegister((prevData) => ({ ...prevData, confirmPwd }));
    
        if (UserRegister.password !== confirmPwd) {
        setError(true);
        } else {
        setError(false);
        }
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await UserService.registerUser(UserRegister);
            console.log("reponse server register: ", response);
            setUserRegister({
                name: '', email: '', password: '', confirmPwd: '' 
            })
            setUserCreationSuccess(true)
            navigate('/login');
        } catch (error: any) {
            console.warn("Erreur lors de l'ajout :", error.response?.data || error.message);
            setUserCreationSuccess(false);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-paper px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <p className="font-mono text-sm font-semibold text-ink">Ticketing</p>
                    <h1 className="mt-2 text-xl font-semibold text-ink">Créer un compte</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    {error && (
                        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">Les deux mots de passe ne sont pas identique</p>
                    )}

                    {emailError && (
                        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">L'adresse email n'a pas un format valide</p>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                        Nom
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            autoComplete="name"
                            name='name'
                            value={UserRegister.name}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            name='email'
                            value={UserRegister.email}
                            onChange={handleChange}
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
                        minLength={6}
                        name='password'
                        autoComplete="new-password"
                        value={UserRegister.password}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                        <p className="mt-1 text-xs text-slate-400">6 caractères minimum.</p>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Confirmer le Mot de passe
                        </label>
                        <input
                        id="confirmPwd"
                        type="password"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        name='confirmPwd'
                        value={UserRegister.confirmPwd}
                        onChange={handleConfirmPasswordChange}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                        <p className="mt-1 text-xs text-slate-400">6 caractères minimum.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
                    >
                        {loading ? 'Création…' : 'Créer mon compte'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-slate-500">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="font-medium text-accent hover:underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage