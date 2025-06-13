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

const Purchases = () => {
    const [purchases, setPurchases] = useState([])
    const [equipmentTypes, setEquipmentTypes] = useState([])
    const [bases, setBases] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [formData, setFormData] = useState({
        equipmentTypeId: '',
        quantity: '',
        unitCost: '',
        totalCost: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        supplierInfo: '',
        receivingBaseId: '',
        purchaseOrderNumber: ''
    })
    
    useEffect(() => {
        fetchPurchases()
        fetchEquipmentTypes()
        fetchBases()
    }, [])
    
    useEffect(() => {
        if (formData.quantity && formData.unitCost) {
            setFormData(prev => ({
                ...prev,
                totalCost: (parseFloat(prev.quantity) * parseFloat(prev.unitCost)).toFixed(2)
            }))
        }
    }, [formData.quantity, formData.unitCost])
    
    const fetchPurchases = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/purchases', options)
            if (response.ok) {
                const data = await response.json()
                setPurchases(data)
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        } catch (error) {
            console.error('Error fetching purchases:', error)
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
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/purchases', options)
            if (response.ok) {
                setShowForm(false)
                setFormData({
                    equipmentTypeId: '',
                    quantity: '',
                    unitCost: '',
                    totalCost: '',
                    purchaseDate: new Date().toISOString().split('T')[0],
                    supplierInfo: '',
                    receivingBaseId: '',
                    purchaseOrderNumber: ''
                })
                fetchPurchases()
            }
        } catch (error) {
            console.error('Error creating purchase:', error)
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
            <button onClick={fetchPurchases} className="retry-button">
                Retry
            </button>
        </div>
    )
    
    const renderPurchasesView = () => (
        <>
            <div className="action-container">
                <button onClick={() => setShowForm(!showForm)} className="action-button">
                    {showForm ? 'Cancel' : 'New Purchase'}
                </button>
            </div>
            
            {showForm && (
                <div className="form-container">
                    <h2>Record New Purchase</h2>
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
                                <label>Unit Cost</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="unitCost"
                                    value={formData.unitCost}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Total Cost</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="totalCost"
                                    value={formData.totalCost}
                                    readOnly
                                    className="form-input readonly"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Purchase Date*</label>
                                <input
                                    type="date"
                                    name="purchaseDate"
                                    value={formData.purchaseDate}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Receiving Base*</label>
                                <select
                                    name="receivingBaseId"
                                    value={formData.receivingBaseId}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Select Base</option>
                                    {bases.map(base => (
                                        <option key={base.base_id} value={base.base_id}>
                                            {base.base_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Supplier Info</label>
                                <input
                                    type="text"
                                    name="supplierInfo"
                                    value={formData.supplierInfo}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Purchase Order Number</label>
                                <input
                                    type="text"
                                    name="purchaseOrderNumber"
                                    value={formData.purchaseOrderNumber}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="submit-button">
                            Submit Purchase
                        </button>
                    </form>
                </div>
            )}
            
            <div className="table-container">
                <h2>Purchase History</h2>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Equipment</th>
                                <th>Quantity</th>
                                <th>Total Cost</th>
                                <th>Base</th>
                                <th>Supplier</th>
                                <th>Recorded By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map(purchase => (
                                <tr key={purchase.purchase_id}>
                                    <td>{purchase.purchase_date}</td>
                                    <td>{purchase.type_name}</td>
                                    <td>{purchase.quantity}</td>
                                    <td>${purchase.total_cost || '-'}</td>
                                    <td>{purchase.base_name}</td>
                                    <td>{purchase.supplier_info || '-'}</td>
                                    <td>{purchase.recorded_by}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
    
    const renderPurchases = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return renderLoadingView()
            case apiStatusConstants.failure:
                return renderFailureView()
            case apiStatusConstants.success:
                return renderPurchasesView()
            default:
                return null
        }
    }
    
    return (
        <>
            <Header />
            <div className="page-container">
                <h1 className="page-title">Purchases</h1>
                {renderPurchases()}
            </div>
        </>
    )
}

export default Purchases