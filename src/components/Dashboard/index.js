import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {ThreeDots} from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE'
}

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({})
    const [bases, setBases] = useState([])
    const [equipmentTypes, setEquipmentTypes] = useState([])
    const [selectedBase, setSelectedBase] = useState('')
    const [selectedEquipment, setSelectedEquipment] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [showMovementPopup, setShowMovementPopup] = useState(false)
    const [movementDetails, setMovementDetails] = useState({})

    useEffect(() => {
        fetchBases()
        fetchEquipmentTypes()
        fetchDashboardData()
    }, [])

    const fetchBases = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/bases', options)
            if (response.ok) {
                const data = await response.json()
                setBases(data)
            }
        } catch (error) {
            console.error('Error fetching bases:', error)
        }
    }

    const fetchEquipmentTypes = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/equipment-types', options)
            if (response.ok) {
                const data = await response.json()
                setEquipmentTypes(data)
            }
        } catch (error) {
            console.error('Error fetching equipment types:', error)
        }
    }

    const fetchDashboardData = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const jwtToken = Cookies.get('jwt_token')
        
        let url = 'https://kristalball-backend-assignment.onrender.com/api/dashboard?'
        if (startDate) url += `startDate=${startDate}&`
        if (endDate) url += `endDate=${endDate}&`
        if (selectedBase) url += `baseId=${selectedBase}&`
        if (selectedEquipment) url += `equipmentTypeId=${selectedEquipment}&`
        
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        
        try {
            const response = await fetch(url, options)
            if (response.ok) {
                const data = await response.json()
                setDashboardData(data)
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            setApiStatus(apiStatusConstants.failure)
        }
    }

    const fetchMovementDetails = async () => {
        const jwtToken = Cookies.get('jwt_token')
        
        let url = 'https://kristalball-backend-assignment.onrender.com/api/dashboard/movement-details?'
        if (startDate) url += `startDate=${startDate}&`
        if (endDate) url += `endDate=${endDate}&`
        if (selectedBase) url += `baseId=${selectedBase}&`
        
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        
        try {
            const response = await fetch(url, options)
            if (response.ok) {
                const data = await response.json()
                setMovementDetails(data)
                setShowMovementPopup(true)
            }
        } catch (error) {
            console.error('Error fetching movement details:', error)
        }
    }

    const onFilterChange = () => {
        fetchDashboardData()
    }

    const renderLoadingView = () => (
        <div className="loader-container">
            <ThreeDots color="#007bff" height="50" width="50" />
        </div>
    )

    const renderFailureView = () => (
        <div className="failure-container">
            <h2>Oops! Something went wrong</h2>
            <button onClick={fetchDashboardData} className="retry-button">
                Retry
            </button>
        </div>
    )

    const renderMovementPopup = () => {
        if (!showMovementPopup) return null
        
        return (
            <div className="popup-overlay">
                <div className="popup-content">
                    <h2 className="popup-title">Net Movement Details</h2>
                    
                    <h3 className="section-title">Purchases</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Equipment</th>
                                <th>Quantity</th>
                                <th>Base</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movementDetails.purchases?.map(purchase => (
                                <tr key={purchase.purchase_id}>
                                    <td>{purchase.purchase_date}</td>
                                    <td>{purchase.type_name}</td>
                                    <td>{purchase.quantity}</td>
                                    <td>{purchase.base_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <h3 className="section-title">Transfers In</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Equipment</th>
                                <th>Quantity</th>
                                <th>From Base</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movementDetails.transfersIn?.map(transfer => (
                                <tr key={transfer.transfer_id}>
                                    <td>{transfer.transfer_date}</td>
                                    <td>{transfer.type_name}</td>
                                    <td>{transfer.quantity}</td>
                                    <td>{transfer.source_base}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <h3 className="section-title">Transfers Out</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Equipment</th>
                                <th>Quantity</th>
                                <th>To Base</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movementDetails.transfersOut?.map(transfer => (
                                <tr key={transfer.transfer_id}>
                                    <td>{transfer.transfer_date}</td>
                                    <td>{transfer.type_name}</td>
                                    <td>{transfer.quantity}</td>
                                    <td>{transfer.destination_base}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <button onClick={() => setShowMovementPopup(false)} className="close-button">
                        Close
                    </button>
                </div>
            </div>
        )
    }

    const renderDashboardView = () => (
        <>
            <div className="filter-container">
                <h2>Filters</h2>
                <div className="filter-grid">
                    <div className="filter-item">
                        <label>Start Date</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                            className="filter-input"
                        />
                    </div>
                    <div className="filter-item">
                        <label>End Date</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                            className="filter-input"
                        />
                    </div>
                    <div className="filter-item">
                        <label>Base</label>
                        <select 
                            value={selectedBase} 
                            onChange={(e) => setSelectedBase(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Bases</option>
                            {bases.map(base => (
                                <option key={base.base_id} value={base.base_id}>{base.base_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Equipment Type</label>
                        <select 
                            value={selectedEquipment} 
                            onChange={(e) => setSelectedEquipment(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Equipment</option>
                            {equipmentTypes.map(equipment => (
                                <option key={equipment.equipment_type_id} value={equipment.equipment_type_id}>{equipment.type_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-item filter-button-container">
                        <button onClick={onFilterChange} className="apply-filter-button">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="metrics-grid">
                <div className="metric-card">
                    <h3>Opening Balance</h3>
                    <p className="metric-value">{dashboardData.openingBalance || 0}</p>
                </div>
                
                <div className="metric-card">
                    <h3>Closing Balance</h3>
                    <p className="metric-value">{dashboardData.closingBalance || 0}</p>
                </div>
                
                <div className="metric-card clickable" onClick={fetchMovementDetails}>
                    <h3>Net Movement</h3>
                    <p className="metric-value">{dashboardData.netMovement || 0}</p>
                    <p className="metric-hint">Click for details</p>
                </div>
                
                <div className="metric-card">
                    <h3>Assigned Assets</h3>
                    <p className="metric-value">{dashboardData.assignedAssets || 0}</p>
                </div>
                
                <div className="metric-card">
                    <h3>Expended Assets</h3>
                    <p className="metric-value">{dashboardData.expendedAssets || 0}</p>
                </div>
            </div>
            {renderMovementPopup()}
        </>
    )

    const renderDashboard = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return renderLoadingView()
            case apiStatusConstants.failure:
                return renderFailureView()
            case apiStatusConstants.success:
                return renderDashboardView()
            default:
                return null
        }
    }

    return (
        <>
            <Header />
            <div className="dashboard-container">
                <h1 className="page-title">Dashboard</h1>
                {renderDashboard()}
            </div>
        </>
    )
}

export default Dashboard