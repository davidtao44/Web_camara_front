import { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ userRole }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(null);

  // Mock data for cameras
  const mockCameras = [
    { id: 1, name: 'Cámara 1', location: 'Entrada Principal', status: 'active', lastActivity: '2 min ago' },
    { id: 2, name: 'Cámara 2', location: 'Estacionamiento', status: 'inactive', lastActivity: '1 hr ago' },
    { id: 3, name: 'Cámara 3', location: 'Pasillo A', status: 'active', lastActivity: '5 min ago' },
    { id: 4, name: 'Cámara 4', location: 'Almacén', status: 'maintenance', lastActivity: '2 days ago' },
    { id: 5, name: 'Cámara 5', location: 'Oficina Principal', status: 'active', lastActivity: 'Just now' },
    { id: 6, name: 'Cámara 6', location: 'Sala de Juntas', status: 'active', lastActivity: '10 min ago' },
  ];

  useEffect(() => {
    // Simulate API calls to fetch data
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setCameras(mockCameras);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
  };

  const closeModal = () => {
    setSelectedCamera(null);
  };

  return (
    <div className="dashboard-container">
      {loading ? (
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <>
          <div className="dashboard-header">
            <h1>Panel de Control</h1>
            <div className="dashboard-stats">
              <div className="stat-card">
                <i className="fas fa-video"></i>
                <div className="stat-info">
                  <h3>{cameras.filter(c => c.status === 'active').length}</h3>
                  <p>Cámaras Activas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-content-full">
            <div className="cameras-section">
              <div className="section-header">
                <h2>Cámaras de Vigilancia</h2>
                <div className="section-actions">
                  <button className="refresh-btn">
                    <i className="fas fa-sync-alt"></i> Actualizar
                  </button>
                </div>
              </div>
              <div className="cameras-grid">
                {cameras.map(camera => (
                  <div 
                    key={camera.id} 
                    className={`camera-card ${camera.status}`}
                    onClick={() => handleCameraClick(camera)}
                  >
                    <div className="camera-feed">
                      <div className="camera-placeholder">
                        <i className="fas fa-video"></i>
                      </div>
                      <div className="camera-status">
                        {camera.status === 'active' ? 'Activa' : 
                         camera.status === 'inactive' ? 'Inactiva' : 'Mantenimiento'}
                      </div>
                    </div>
                    <div className="camera-info">
                      <h3>{camera.name}</h3>
                      <p><i className="fas fa-map-marker-alt"></i> {camera.location}</p>
                      <p><i className="fas fa-clock"></i> {camera.lastActivity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {selectedCamera && (
        <div className="camera-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedCamera.name}</h2>
              <button className="close-btn" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="camera-live-feed">
                <div className="camera-placeholder large">
                  <i className="fas fa-video"></i>
                  <p>Transmisión en vivo</p>
                </div>
              </div>
              <div className="camera-details">
                <div className="detail-item">
                  <span className="label">Ubicación:</span>
                  <span className="value">{selectedCamera.location}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Estado:</span>
                  <span className={`value status-${selectedCamera.status}`}>
                    {selectedCamera.status === 'active' ? 'Activa' : 
                     selectedCamera.status === 'inactive' ? 'Inactiva' : 'En mantenimiento'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Última actividad:</span>
                  <span className="value">{selectedCamera.lastActivity}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {userRole === 'administrador' && (
                <>
                  <button className="action-btn">
                    <i className="fas fa-cog"></i> Configurar
                  </button>
                  <button className="action-btn danger">
                    <i className="fas fa-power-off"></i> Apagar
                  </button>
                </>
              )}
              <button className="action-btn">
                <i className="fas fa-download"></i> Descargar grabación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;