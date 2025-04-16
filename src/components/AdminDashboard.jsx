import { useState, useEffect } from 'react';
import { PERMISSIONS } from '../utils/roles';
import '../styles/AdminDashboard.css';

// Mock data for cameras (replace with API calls in production)
const mockCameras = [
  { id: 1, name: 'Cámara 1', location: 'Entrada Principal', status: 'active' },
  { id: 2, name: 'Cámara 2', location: 'Estacionamiento', status: 'inactive' },
  { id: 3, name: 'Cámara 3', location: 'Pasillo A', status: 'active' },
  { id: 4, name: 'Cámara 4', location: 'Almacén', status: 'maintenance' },
];

function AdminDashboard({ userPermissions = [] }) {
  const [activeTab, setActiveTab] = useState('cameras');
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameraFormData, setCameraFormData] = useState({
    name: '',
    location: '',
    ipAddress: '',
    username: '',
    password: '',
  });
  const [showAddCameraForm, setShowAddCameraForm] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch cameras
    const fetchCameras = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setCameras(mockCameras);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching cameras:', error);
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  const handleCameraFormChange = (e) => {
    const { name, value } = e.target;
    setCameraFormData({
      ...cameraFormData,
      [name]: value,
    });
  };

  const handleAddCamera = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call
    const newCamera = {
      id: cameras.length + 1,
      ...cameraFormData,
      status: 'active',
    };
    
    setCameras([...cameras, newCamera]);
    setCameraFormData({
      name: '',
      location: '',
      ipAddress: '',
      username: '',
      password: '',
    });
    setShowAddCameraForm(false);
  };

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
  };

  const handleCameraDelete = (cameraId) => {
    // In a real app, this would be an API call
    setCameras(cameras.filter(camera => camera.id !== cameraId));
    if (selectedCamera && selectedCamera.id === cameraId) {
      setSelectedCamera(null);
    }
  };

  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  const renderCameraManagement = () => {
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>Gestión de Cámaras</h2>
          {hasPermission(PERMISSIONS.MANAGE_CAMERAS) && (
            <button 
              className="add-button"
              onClick={() => setShowAddCameraForm(!showAddCameraForm)}
            >
              {showAddCameraForm ? 'Cancelar' : 'Agregar Cámara'}
            </button>
          )}
        </div>

        {showAddCameraForm && (
          <div className="form-container">
            <h3>Agregar Nueva Cámara</h3>
            <form onSubmit={handleAddCamera}>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={cameraFormData.name}
                  onChange={handleCameraFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Ubicación</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={cameraFormData.location}
                  onChange={handleCameraFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ipAddress">Dirección IP</label>
                <input
                  type="text"
                  id="ipAddress"
                  name="ipAddress"
                  value={cameraFormData.ipAddress}
                  onChange={handleCameraFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Usuario</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={cameraFormData.username}
                  onChange={handleCameraFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={cameraFormData.password}
                  onChange={handleCameraFormChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">Guardar</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddCameraForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="camera-container">
          <div className="camera-list">
            <h3>Cámaras Disponibles</h3>
            {loading ? (
              <p>Cargando cámaras...</p>
            ) : cameras.length === 0 ? (
              <p>No hay cámaras disponibles</p>
            ) : (
              <ul>
                {cameras.map((camera) => (
                  <li 
                    key={camera.id} 
                    className={`camera-item ${selectedCamera && selectedCamera.id === camera.id ? 'selected' : ''}`}
                    onClick={() => handleCameraSelect(camera)}
                  >
                    <div className="camera-info">
                      <span className="camera-name">{camera.name}</span>
                      <span className="camera-location">{camera.location}</span>
                      <span className={`camera-status ${camera.status}`}>
                        {camera.status === 'active' ? 'Activa' : 
                         camera.status === 'inactive' ? 'Inactiva' : 'Mantenimiento'}
                      </span>
                    </div>
                    {hasPermission(PERMISSIONS.MANAGE_CAMERAS) && (
                      <div className="camera-actions">
                        <button className="edit-button">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCameraDelete(camera.id);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="camera-details">
            {selectedCamera ? (
              <div>
                <h3>{selectedCamera.name}</h3>
                <div className="camera-preview">
                  <div className="camera-feed">
                    <div className="camera-placeholder">
                      <i className="fas fa-video"></i>
                      <p>Vista previa de cámara</p>
                    </div>
                  </div>
                  <div className="camera-info-details">
                    <p><strong>ID:</strong> {selectedCamera.id}</p>
                    <p><strong>Ubicación:</strong> {selectedCamera.location}</p>
                    <p><strong>Estado:</strong> {
                      selectedCamera.status === 'active' ? 'Activa' : 
                      selectedCamera.status === 'inactive' ? 'Inactiva' : 'Mantenimiento'
                    }</p>
                    <p><strong>Dirección IP:</strong> {selectedCamera.ipAddress || 'No disponible'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-camera-selected">
                <i className="fas fa-video-slash"></i>
                <p>Seleccione una cámara para ver detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderUserManagement = () => {
    return (
      <div className="admin-section">
        <h2>Gestión de Usuarios</h2>
        <p>Aquí irá la gestión de usuarios (crear, editar, eliminar usuarios)</p>
        {/* User management functionality would go here */}
      </div>
    );
  };

  const renderReports = () => {
    return (
      <div className="admin-section">
        <h2>Reportes</h2>
        <p>Aquí irán los reportes del sistema</p>
        {/* Reports functionality would go here */}
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="admin-section">
        <h2>Configuración</h2>
        <p>Aquí irá la configuración del sistema</p>
        {/* Settings functionality would go here */}
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Panel de Administración</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === 'cameras' ? 'active' : ''}
              onClick={() => setActiveTab('cameras')}
            >
              <i className="fas fa-video"></i>
              <span>Cámaras</span>
            </li>
            {hasPermission(PERMISSIONS.CREATE_USER) && (
              <li 
                className={activeTab === 'users' ? 'active' : ''}
                onClick={() => setActiveTab('users')}
              >
                <i className="fas fa-users"></i>
                <span>Usuarios</span>
              </li>
            )}
            {hasPermission(PERMISSIONS.VIEW_REPORTS) && (
              <li 
                className={activeTab === 'reports' ? 'active' : ''}
                onClick={() => setActiveTab('reports')}
              >
                <i className="fas fa-chart-bar"></i>
                <span>Reportes</span>
              </li>
            )}
            <li 
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i>
              <span>Configuración</span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="admin-content">
        {activeTab === 'cameras' && renderCameraManagement()}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
}

export default AdminDashboard;