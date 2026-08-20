import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Layout } from '../components/Layout';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { TicketsPage } from '../pages/TicketsPage';
import { TicketDetailPage } from '../pages/TicketDetailPage';
import { AdminRoute } from '../components/AdminRoute';
import { AdminTicketsPage } from '../pages/AdminTicketsPage';

interface RouteProps {
    setLoading: (value: boolean) => void;
}

const AppRoute = ({ setLoading }: RouteProps) => {

    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const handleComplete = () => setLoading(false);
        const timeout = setTimeout(handleComplete, 500);
    
        return () => clearTimeout(timeout);
    }, [location, setLoading]);

    return (
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="/tickets" element={<TicketsPage />} />
                    <Route path="/tickets/:id" element={<TicketDetailPage />} />
                    <Route element={<AdminRoute />}>
                        <Route path="/admin/tickets" element={<AdminTicketsPage />} />
                    </Route>
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default AppRoute