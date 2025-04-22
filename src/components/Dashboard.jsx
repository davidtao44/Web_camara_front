import { useState, useEffect } from 'react';
import './Dashboard.css';
import Hls from 'hls.js';
import axios from 'axios';

function Dashboard({ userRole }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [poweringOff, setPoweringOff] = useState(false);
  const [poweringOn, setPoweringOn] = useState(false);

  // This mapping connects camera IDs from Firestore to MediaMTX path names
  // Update this mapping as you add more cameras to MediaMTX
  const cameraStreamMapping = {
    // Firestore ID : MediaMTX path
    'aKxbATH3Um1RzQSrCvxa': 'camara',
    'camera2Id': 'camara2',
    'camera3Id': 'camara3',
    // Add more mappings as needed
    
    // For mock cameras (by ID number)
    '1': 'camara',
    '2': 'camara2',
    '3': 'camara3',
    '4': 'camara',
    '5': 'camara2',
    '6': 'camara3',
  };

  useEffect(() => {
    // Fetch real cameras from backend
    const fetchData = async () => {
      try {
        // Try to fetch real cameras from backend
        try {
          const response = await axios.get('http://localhost:8000/cameras/');
          if (response.data && response.data.length > 0) {
            // Transform API response to match our camera format
            const apiCameras = response.data.map(cam => ({
              id: cam.id,
              name: cam.name,
              location: cam.location,
              status: cam.isActive ? 'active' : 'inactive',
              lastActivity: 'N/A', // You might want to add this field to your API
              api_url: cam.api_url // Store the RTSP URL
            }));
            setCameras(apiCameras);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn('Could not fetch cameras from API, using mock data:', error);
        }

        // Fallback to mock data if API fails
        // Mock data for cameras
        const mockCameras = [
          { id: 1, name: 'Cámara 1', location: 'Entrada Principal', status: 'active', lastActivity: '2 min ago' },
          { id: 2, name: 'Cámara 2', location: 'Estacionamiento', status: 'inactive', lastActivity: '1 hr ago' },
          { id: 3, name: 'Cámara 3', location: 'Pasillo A', status: 'inactive', lastActivity: '5 min ago' },
          { id: 4, name: 'Cámara 4', location: 'Almacén', status: 'inactive', lastActivity: '2 days ago' },
          { id: 5, name: 'Cámara 5', location: 'Oficina Principal', status: 'inactive', lastActivity: 'Just now' },
          { id: 6, name: 'Cámara 6', location: 'Sala de Juntas', status: 'inactive', lastActivity: '10 min ago' },
        ];
        setCameras(mockCameras);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCamera && selectedCamera.status === 'active') {
      const video = document.getElementById('camera-video');
      if (!video || !Hls.isSupported()) {
        console.error('Video element not found or HLS not supported');
        return;
      }

      // Clean up any existing HLS instance
      let hls = new Hls();
      
      // Get the MediaMTX path for this camera
      const cameraId = selectedCamera.id.toString();
      const cameraStreamId = cameraStreamMapping[cameraId] || 'camara'; // Default to 'camara' if not found
      
      // Build the HLS URL
      const streamUrl = `http://localhost:8888/${cameraStreamId}/index.m3u8`;
      console.log(`Loading stream for camera ${selectedCamera.name} (ID: ${cameraId}) from: ${streamUrl}`);
      
      // Load the stream
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => {
          console.warn('Auto-play prevented:', e);
        });
      });
      
      // Handle errors
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('Fatal HLS error:', data);
          hls.destroy();
        }
      });
      
      return () => {
        hls.destroy();
      };
    }
  }, [selectedCamera]);

  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
  };

  const closeModal = () => {
    setSelectedCamera(null);
  };

  // Function to handle powering off a camera
  const handlePowerOff = async () => {
    if (!selectedCamera) return;
    
    setPoweringOff(true);
    
    try {
      // For real implementation, uncomment this code to call your backend API
      /*
      await axios.post(`http://localhost:8000/cameras/${selectedCamera.id}/power`, {
        action: 'off'
      });
      */
      
      // For now, simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update camera status in the local state
      setCameras(prevCameras => 
        prevCameras.map(cam => 
          cam.id === selectedCamera.id 
            ? { ...cam, status: 'inactive' } 
            : cam
        )
      );
      
      // Show success message
      alert(`Cámara ${selectedCamera.name} apagada exitosamente.`);
      
      // Close the modal
      closeModal();
    } catch (error) {
      console.error('Error powering off camera:', error);
      alert('Error al apagar la cámara. Por favor intente nuevamente.');
    } finally {
      setPoweringOff(false);
    }
  };

  // Function to handle powering on a camera
  const handlePowerOn = async () => {
    if (!selectedCamera) return;
    
    setPoweringOn(true);
    
    try {
      // For real implementation, uncomment this code to call your backend API
      /*
      await axios.post(`http://localhost:8000/cameras/${selectedCamera.id}/power`, {
        action: 'on'
      });
      */
      
      // For now, simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update camera status in the local state
      setCameras(prevCameras => 
        prevCameras.map(cam => 
          cam.id === selectedCamera.id 
            ? { ...cam, status: 'active' } 
            : cam
        )
      );
      
      // Update the selected camera to reflect the new status
      setSelectedCamera({
        ...selectedCamera,
        status: 'active'
      });
      
      // Show success message
      alert(`Cámara ${selectedCamera.name} encendida exitosamente.`);
    } catch (error) {
      console.error('Error powering on camera:', error);
      alert('Error al encender la cámara. Por favor intente nuevamente.');
    } finally {
      setPoweringOn(false);
    }
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
                  <button className="refresh-btn" onClick={() => window.location.reload()}>
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
                        {camera.status === 'active' ? 'Activa' : 'Inactiva'}
                      </div>
                    </div>
                    <div className="camera-info">
                      <h3>{camera.name}</h3>
                      <p><i className="fas fa-map-marker-alt"></i> {camera.location}</p>
                      <p><i className="fas fa-clock"></i> {camera.lastActivity || 'N/A'}</p>
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
                <video
                  id="camera-video"
                  playsInline
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  style={{ width: '100%', maxHeight: '480px' }}
                />
              </div>
              <div className="camera-details">
                <div className="detail-item">
                  <span className="label">Ubicación:</span>
                  <span className="value">{selectedCamera.location}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Estado:</span>
                  <span className={`value status-${selectedCamera.status}`}>
                    {selectedCamera.status === 'active' ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Última actividad:</span>
                  <span className="value">{selectedCamera.lastActivity || 'N/A'}</span>
                </div>
                {selectedCamera.api_url && (
                  <div className="detail-item">
                    <span className="label">RTSP URL:</span>
                    <span className="value">{selectedCamera.api_url}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              {userRole === 'administrador' && (
                <>
                  {selectedCamera.status === 'active' && (
                    <button 
                      className="action-btn danger"
                      onClick={handlePowerOff}
                      disabled={poweringOff}
                    >
                      {poweringOff ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Apagando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-power-off"></i> Apagar
                        </>
                      )}
                    </button>
                  )}
                  
                  {selectedCamera.status === 'inactive' && (
                    <button 
                      className="action-btn success"
                      onClick={handlePowerOn}
                      disabled={poweringOn}
                    >
                      {poweringOn ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Encendiendo...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-play-circle"></i> Encender
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;