import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Purchases from './components/Purchases'
import Transfers from './components/Transfers'
import Assignments from './components/Assignments'
import NotFound from './components/NotFound'
import './App.css'

const ProtectedRoute = ({children}) => {
    const token = Cookies.get('jwt_token')
    if (!token) {
        return <Navigate to="/login" replace />
    }
    return children
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/purchases" element={
                    <ProtectedRoute>
                        <Purchases />
                    </ProtectedRoute>
                } />
                <Route path="/transfers" element={
                    <ProtectedRoute>
                        <Transfers />
                    </ProtectedRoute>
                } />
                <Route path="/assignments" element={
                    <ProtectedRoute>
                        <Assignments />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App