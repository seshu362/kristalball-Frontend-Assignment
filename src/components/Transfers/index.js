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

const Transfers = () => {
    const [transfers, setTransfers] = useState([])
    const [equipmentTypes, setEquipmentTypes] = useState([])
    const [bases, setBases] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [formData, setFormData] = useState({
        equipmentTypeId: '',
        quantity: '',
        sourceBaseId: '',
        destinationBaseId: '',
        transferDate: new Date().toISOString().split('T')[0],
        reason: ''
    })
    
    useEffect(() => {
        fetchTransfers()
        fetchEquipmentTypes()
        fetchBases()
    }, [])
    
    const fetchTransfers = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/transfers', options)
            if (response.ok) {
                const data = await response.json()
                setTransfers(data)
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        } catch (error) {
            console.error('Error fetching transfers:', error)
            setApiStatus(apiStatusConstants.failure)
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
    
    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(formData)
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/transfers', options)
            if (response.ok) {
                setShowForm(false)
                setFormData({
                    equipmentTypeId: '',
                    quantity: '',
                    sourceBaseId: '',
                    destinationBaseId: '',
                    transferDate: new Date().toISOString().split('T')[0],
                    reason: ''
                })
                fetchTransfers()
            }
        } catch (error) {
            console.error('Error creating transfer:', error)
        }
    }
    
    const renderLoadingView = () => (
        <div className="loader-container">
            <ThreeDots color="#007bff" height="50" width="50" />
        </div>
    )
    
    const renderFailureView = () => (
        <div className="failure-container">
            <h2>Oops! Something went wrong</h2>
            <button onClick={fetchTransfers} className="retry-button">
                Retry
            </button>
        </div>
    )
    
    const renderTransfersView = () => (
        <>
            <div className="action-container">
                <button onClick={() => setShowForm(!showForm)} className="action-button">
                    {showForm ? 'Cancel' : 'New Transfer'}
                </button>
            </div>
            
            {showForm && (
                <div className="form-container">
                    <h2>Initiate Transfer</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Equipment Type*</label>
                                <select
                                    name="equipmentTypeId"
                                    value={formData.equipmentTypeId}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Select Equipment</option>
                                    {equipmentTypes.map(equipment => (
                                        <option key={equipment.equipment_type_id} value={equipment.equipment_type_id}>
                                            {equipment.type_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Quantity*</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Source Base*</label>
                                <select
                                    name="sourceBaseId"
                                    value={formData.sourceBaseId}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Select Source Base</option>
                                    {bases.map(base => (
                                        <option key={base.base_id} value={base.base_id}>
                                            {base.base_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Destination Base*</label>
                                <select
                                    name="destinationBaseId"
                                    value={formData.destinationBaseId}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Select Destination Base</option>
                                    {bases.map(base => (
                                        <option key={base.base_id} value={base.base_id}>
                                            {base.base_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Transfer Date*</label>
                                <input
                                    type="date"
                                    name="transferDate"
                                    value={formData.transferDate}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Reason</label>
                                <input
                                    type="text"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="submit-button">
                            Submit Transfer
                        </button>
                    </form>
                </div>
            )}
            
            <div className="table-container">
                <h2>Transfer History</h2>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Equipment</th>
                                <th>Quantity</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Status</th>
                                <th>Reason</th>
                                <th>Initiated By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transfers.map(transfer => (
                                <tr key={transfer.transfer_id}>
                                    <td>{transfer.transfer_date}</td>
                                    <td>{transfer.type_name}</td>
                                    <td>{transfer.quantity}</td>
                                    <td>{transfer.source_base}</td>
                                    <td>{transfer.destination_base}</td>
                                    <td>{transfer.status}</td>
                                    <td>{transfer.reason || '-'}</td>
                                    <td>{transfer.initiated_by}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
    
    const renderTransfers = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return renderLoadingView()
            case apiStatusConstants.failure:
                return renderFailureView()
            case apiStatusConstants.success:
                return renderTransfersView()
            default:
                return null
        }
    }
    
    return (
        <>
            <Header />
            <div className="page-container">
                <h1 className="page-title">Transfers</h1>
                {renderTransfers()}
            </div>
        </>
    )
}

export default Transfers