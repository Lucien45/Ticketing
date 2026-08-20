import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner';
import { isAuthenticated } from './context/AuthContext';
import AuthRoute from './routes/AuthRoute';
import AppRoute from './routes/AppRoute';

function App() {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <BrowserRouter>
        {loading && <LoadingSpinner/>}
        {/* <ToastContainer position='top-center'/> */}
        <Routes>
          <Route path='/app/*' element={<AppRoute setLoading={setLoading}/>}/>
          <Route path='/*' element={
            isAuthenticated() ? <Navigate to="/app" replace /> : <AuthRoute setLoading={setLoading}/>
          }/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
