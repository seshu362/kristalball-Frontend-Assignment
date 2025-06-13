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

const Assignments = () => {
    const [assignments, setAssignments] = useState([])
    const [expenditures, setExpenditures] = useState([])
    const [assets, setAssets] = useState([])
    const [users, setUsers] = useState([])
    const [bases, setBases] = useState([])
    const [equipmentTypes, setEquipmentTypes] = useState([])
    const [showAssignmentForm, setShowAssignmentForm] = useState(false)
    const [showExpenditureForm, setShowExpenditureForm] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [activeTab, setActiveTab] = useState('assignments')
    
    const [assignmentFormData, setAssignmentFormData] = useState({
        assetId: '',
        assignedToUserId: '',
        assignmentDate: new Date().toISOString().split('T')[0],
        baseOfAssignmentId: '',
        purpose: '',
        expectedReturnDate: ''
    })
    
    const [expenditureFormData, setExpenditureFormData] = useState({
        equipmentTypeId: '',
        quantityExpended: '',
        expenditureDate: new Date().toISOString().split('T')[0],
        baseId: '',
        reason: ''
    })
    
    useEffect(() => {
        fetchData()
    }, [activeTab])
    
    const fetchData = () => {
        if (activeTab === 'assignments') {
            fetchAssignments()
            fetchAssets()
            fetchUsers()
            fetchBases()
        } else {
            fetchExpenditures()
            fetchEquipmentTypes()
            fetchBases()
        }
    }
    
    const fetchAssignments = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/assignments', options)
            if (response.ok) {
                const data = await response.json()
                setAssignments(data)
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        } catch (error) {
            console.error('Error fetching assignments:', error)
            setApiStatus(apiStatusConstants.failure)
        }
    }
    
    const fetchExpenditures = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/expenditures', options)
            if (response.ok) {
                const data = await response.json()
                setExpenditures(data)
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }
        } catch (error) {
            console.error('Error fetching expenditures:', error)
            setApiStatus(apiStatusConstants.failure)
        }
    }
    
        const fetchAssets = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/assets', options)
            if (response.ok) {
                const data = await response.json()
                setAssets(data)
            }
        } catch (error) {
            console.error('Error fetching assets:', error)
        }
    }
    
    const fetchUsers = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/users', options)
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
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
    
    const handleAssignmentInputChange = (e) => {
        const {name, value} = e.target
        setAssignmentFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleExpenditureInputChange = (e) => {
        const {name, value} = e.target
        setExpenditureFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleAssignmentSubmit = async (e) => {
        e.preventDefault()
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(assignmentFormData)
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/assignments', options)
            if (response.ok) {
                setShowAssignmentForm(false)
                setAssignmentFormData({
                    assetId: '',
                    assignedToUserId: '',
                    assignmentDate: new Date().toISOString().split('T')[0],
                    baseOfAssignmentId: '',
                    purpose: '',
                    expectedReturnDate: ''
                })
                fetchAssignments()
            }
        } catch (error) {
            console.error('Error creating assignment:', error)
        }
    }
    
    const handleExpenditureSubmit = async (e) => {
        e.preventDefault()
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(expenditureFormData)
        }
        
        try {
            const response = await fetch('https://kristalball-backend-assignment.onrender.com/api/expenditures', options)
            if (response.ok) {
                setShowExpenditureForm(false)
                setExpenditureFormData({
                    equipmentTypeId: '',
                    quantityExpended: '',
                    expenditureDate: new Date().toISOString().split('T')[0],
                    baseId: '',
                    reason: ''
                })
                fetchExpenditures()
            }
        } catch (error) {
            console.error('Error creating expenditure:', error)
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
            <button onClick={fetchData} className="retry-button">
                Retry
            </button>
        </div>
    )
    
    const renderAssignmentsTab = () => (
        <>
            <div className="action-container">
                <button onClick={() => setShowAssignmentForm(!showAssignmentForm)} className="action-button">
                    {showAssignmentForm ? 'Cancel' : 'New Assignment'}
                </button>
            </div>
            
            {showAssignmentForm && (
                <div className="form-container">
                    <h2>Assign Asset</h2>
                    <form onSubmit={handleAssignmentSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Asset*</label>
                                <select
                                    name="assetId"
                                    value={assignmentFormData.assetId}
                                    onChange={handleAssignmentInputChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Select Asset</option>
                                    {assets.map(asset => (
                                        <option key={asset.asset_id} value={asset.asset_id}>
                                            {asset.type_name} - {asset.model_name} {asset.serial_number ? `(${asset.serial_number})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Assign To*</label>
                                <select
                                    name="assignedToUserId"
                                    value={assignmentFormData.assignedToUserId}
                                    onChange={handleAssignmentInputChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Select Person</option>
                                    {users.map(user => (
                                        <option key={user.user_id} value={user.user_id}>
                                            {user.full_name} ({user.username})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Assignment Date*</label>
                                <input
                                    type="date"
                                    name="assignmentDate"
                                    value={assignmentFormData.assignmentDate}
                                    onChange={handleAssignmentInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Base*</label>
                                <select
                                    name="baseOfAssignmentId"
                                    value={assignmentFormData.baseOfAssignmentId}
                                    onChange={handleAssignmentInputChange}
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
                                <label>Purpose</label>
                                <input
                                    type="text"
                                    name="purpose"
                                    value={assignmentFormData.purpose}
                                    onChange={handleAssignmentInputChange}
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Expected Return Date</label>
                                <input
                                    type="date"
                                    name="expectedReturnDate"
                                    value={assignmentFormData.expectedReturnDate}
                                    onChange={handleAssignmentInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="submit-button">
                            Submit Assignment
                        </button>
                    </form>
                </div>
            )}
            
            <div className="table-container">
                <h2>Assignment History</h2>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Asset</th>
                                <th>Assigned To</th>
                                <th>Base</th>
                                <th>Purpose</th>
                                <th>Expected Return</th>
                                <th>Status</th>
                                <th>Recorded By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(assignment => (
                                <tr key={assignment.assignment_id}>
                                    <td>{assignment.assignment_date}</td>
                                    <td>{assignment.model_name} {assignment.serial_number ? `(${assignment.serial_number})` : ''}</td>
                                    <td>{assignment.assigned_to}</td>
                                    <td>{assignment.base_name}</td>
                                    <td>{assignment.purpose || '-'}</td>
                                    <td>{assignment.expected_return_date || '-'}</td>
                                    <td>{assignment.is_active ? 'Active' : 'Returned'}</td>
                                    <td>{assignment.recorded_by}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
    
    const renderExpendituresTab = () => (
        <>
            <div className="action-container">
                <button onClick={() => setShowExpenditureForm(!showExpenditureForm)} className="action-button">
                    {showExpenditureForm ? 'Cancel' : 'New Expenditure'}
                </button>
            </div>
            
            {showExpenditureForm && (
                <div className="form-container">
                    <h2>Record Expenditure</h2>
                    <form onSubmit={handleExpenditureSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Equipment Type*</label>
                                <select
                                    name="equipmentTypeId"
                                    value={expenditureFormData.equipmentTypeId}
                                    onChange={handleExpenditureInputChange}
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
                                <label>Quantity Expended*</label>
                                <input
                                    type="number"
                                    name="quantityExpended"
                                    value={expenditureFormData.quantityExpended}
                                    onChange={handleExpenditureInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Expenditure Date*</label>
                                <input
                                    type="date"
                                    name="expenditureDate"
                                    value={expenditureFormData.expenditureDate}
                                    onChange={handleExpenditureInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Base*</label>
                                <select
                                    name="baseId"
                                    value={expenditureFormData.baseId}
                                    onChange={handleExpenditureInputChange}
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
                                <label>Reason*</label>
                                <select
                                    name="reason"
                                    value={expenditureFormData.reason}
                                    onChange={handleExpenditureInputChange}
                                    required
                                    className="form-input"
                                >
                                    <option value="">Select Reason</option>
                                    <option value="Training">Training</option>
                                    <option value="Combat Operation">Combat Operation</option>
                                    <option value="Damage">Damage</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        
                        <button type="submit" className="submit-button">
                            Submit Expenditure
                        </button>
                    </form>
                </div>
            )}
            
            <div className="table-container">
                <h2>Expenditure History</h2>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Equipment</th>
                                <th>Quantity</th>
                                <th>Base</th>
                                <th>Reason</th>
                                <th>Reported By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenditures.map(expenditure => (
                                <tr key={expenditure.expenditure_id}>
                                    <td>{expenditure.expenditure_date}</td>
                                    <td>{expenditure.type_name}</td>
                                    <td>{expenditure.quantity_expended}</td>
                                    <td>{expenditure.base_name}</td>
                                    <td>{expenditure.reason}</td>
                                    <td>{expenditure.reported_by}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
    
    const renderAssignmentsView = () => (
        <>
            <div className="tabs-container">
                <button 
                    className={`tab-button ${activeTab === 'assignments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('assignments')}
                >
                    Assignments
                </button>
                <button 
                    className={`tab-button ${activeTab === 'expenditures' ? 'active' : ''}`}
                    onClick={() => setActiveTab('expenditures')}
                >
                    Expenditures
                </button>
            </div>
            {activeTab === 'assignments' ? renderAssignmentsTab() : renderExpendituresTab()}
        </>
    )
    
    const renderAssignments = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return renderLoadingView()
            case apiStatusConstants.failure:
                return renderFailureView()
            case apiStatusConstants.success:
                return renderAssignmentsView()
            default:
                return null
        }
    }
    
    return (
        <>
            <Header />
            <div className="page-container">
                <h1 className="page-title">Assignments & Expenditures</h1>
                {renderAssignments()}
            </div>
        </>
    )
}

export default Assignments