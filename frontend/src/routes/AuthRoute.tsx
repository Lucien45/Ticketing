import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';

interface RouteProps {
    setLoading: (value: boolean) => void;
}

const AuthRoute = ({ setLoading }: RouteProps) => {
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const handleComplete = () => setLoading(false);
        const timeout = setTimeout(handleComplete, 500);

        return () => clearTimeout(timeout);
    }, [location, setLoading]);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default AuthRoute