import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showError, setShowError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()

    const quickLoginCredentials = {
        admin: {
            username: 'admin',
            password: 'admin123',
            description: 'Full system access'
        },
        commander: {
            username: 'commander',
            password: 'commander123',
            description: 'Alpha Base access only'
        },
        logistics: {
            username: 'logistics',
            password: 'logistics123',
            description: 'Bravo Base access only'
        }
    }

    const onQuickLogin = (role) => {
        const credentials = quickLoginCredentials[role]
        setUsername(credentials.username)
        setPassword(credentials.password)
    }

    const onSubmitSuccess = (jwtToken, userData) => {
        Cookies.set('jwt_token', jwtToken, {expires: 30})
        localStorage.setItem('userInfo', JSON.stringify(userData))
        navigate('/dashboard')
    }

    const onSubmitFailure = (errorMsg) => {
        setShowError(true)
        setErrorMsg(errorMsg)
    }

    const submitForm = async (event) => {
        event.preventDefault()
        const userDetails = {username, password}
        const url = 'https://kristalball-backend-assignment.onrender.com/api/login'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDetails)
        }
        
        try {
            const response = await fetch(url, options)
            const data = await response.json()
            
            if (response.ok === true) {
                onSubmitSuccess(data.jwtToken, data.user)
            } else {
                onSubmitFailure(data.error)
            }
        } catch (error) {
            onSubmitFailure('Something went wrong')
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={submitForm} className="login-form">
                <h1 className="login-title">Military Asset Management</h1>
                
                <div className="quick-login-section">
                    <h3 className="quick-login-title">Quick Login</h3>
                    <div className="quick-login-buttons">
                        <button 
                            type="button" 
                            onClick={() => onQuickLogin('admin')} 
                            className="quick-login-btn admin-btn"
                        >
                            <span className="role-name">Admin</span>
                            <span className="role-desc">{quickLoginCredentials.admin.description}</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => onQuickLogin('commander')} 
                            className="quick-login-btn commander-btn"
                        >
                            <span className="role-name">Base Commander</span>
                            <span className="role-desc">{quickLoginCredentials.commander.description}</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => onQuickLogin('logistics')} 
                            className="quick-login-btn logistics-btn"
                        >
                            <span className="role-name">Logistics Officer</span>
                            <span className="role-desc">{quickLoginCredentials.logistics.description}</span>
                        </button>
                    </div>
                </div>
                
                <div className="divider">
                    <span>OR</span>
                </div>
                
                <div className="input-container">
                    <label className="input-label">Username</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                        placeholder="Enter username"
                    />
                </div>
                <div className="input-container">
                    <label className="input-label">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="Enter password"
                    />
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
                {showError && <p className="error-message">{errorMsg}</p>}
                
                <div className="credentials-info">
                    <h4>Test Credentials:</h4>
                    <p>Admin: admin / admin123</p>
                    <p>Commander: commander / commander123</p>
                    <p>Logistics: logistics / logistics123</p>
                </div>
            </form>
        </div>
    )
}

export default Login