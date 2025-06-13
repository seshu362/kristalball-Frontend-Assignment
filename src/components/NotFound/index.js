import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
    <div className="not-found-container">
        <h1 className="not-found-heading">404</h1>
        <h2 className="not-found-subheading">Page Not Found</h2>
        <p className="not-found-text">
            The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="back-button">
            Go to Dashboard
        </Link>
    </div>
)

export default NotFound