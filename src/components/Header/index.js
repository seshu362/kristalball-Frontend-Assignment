import {Link, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = () => {
    const navigate = useNavigate()
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    
    const onClickLogout = () => {
        Cookies.remove('jwt_token')
        localStorage.removeItem('userInfo')
        navigate('/login')
    }
    
    // Check if user can access purchases/transfers
    const canAccessPurchasesTransfers = userInfo.role === 'Admin' || userInfo.role === 'Logistics Officer'
    
    return (
        <nav className="navbar">
            <div className="nav-left">
                <h2 className="nav-title">Military Asset Management</h2>
                <div className="nav-links">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    {canAccessPurchasesTransfers && (
                        <>
                            <Link to="/purchases" className="nav-link">Purchases</Link>
                            <Link to="/transfers" className="nav-link">Transfers</Link>
                        </>
                    )}
                    <Link to="/assignments" className="nav-link">Assignments</Link>
                </div>
            </div>
            <div className="user-section">
                <div className="user-info-display">
                    <span className="user-name">{userInfo.full_name}</span>
                    <span className="user-role">{userInfo.role}</span>
                </div>
                <button onClick={onClickLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Header