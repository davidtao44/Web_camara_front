import { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
import CameraFeedPlayer from './CameraFeedPlayer';

function Dashboard({ userRole }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridLayout, setGridLayout] = useState('2x2'); // Opciones: '1x1', '2x2', '2x3'
  const [menuOpen, setMenuOpen] = useState(false);

  // This mapping connects camera IDs from Firestore to MediaMTX path names
  const cameraStreamMapping = {
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
              lastActivity: 'N/A',
              api_url: cam.api_url
            }));
            setCameras(apiCameras);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn('Could not fetch cameras from API, using mock data:', error);
        }

        // Fallback to mock data if API fails
        const mockCameras = [
          { id: 1, name: 'Cámara 1', location: 'Entrada Principal', status: 'active', lastActivity: '2 min ago' },
          { id: 2, name: 'Cámara 2', location: 'Estacionamiento', status: 'active', lastActivity: '1 hr ago' },
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

  // Función para obtener la configuración de la cuadrícula según el diseño seleccionado
  const getGridConfig = () => {
    switch (gridLayout) {
      case '1x1':
        return {
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
          maxCameras: 1
        };
      case '2x2':
        return {
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          maxCameras: 4
        };
      case '2x3':
        return {
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          maxCameras: 6
        };
      default:
        return {
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          maxCameras: 4
        };
    }
  };

  const gridConfig = getGridConfig();
  // Limitar el número de cámaras según la configuración de la cuadrícula
  const visibleCameras = cameras.slice(0, gridConfig.maxCameras);

  // Función para cambiar el diseño y cerrar el menú
  const changeLayout = (layout) => {
    setGridLayout(layout);
    setMenuOpen(false);
  };

  return (
    <div className="dashboard-container" style={{ 
      padding: 0,
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'relative'
    }}>
      {/* Botón para abrir el menú desplegable */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000
      }}>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          <i className="fas fa-th"></i>
        </button>
      </div>

      {/* Menú desplegable */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '10px',
          backgroundColor: '#333',
          borderRadius: '4px',
          padding: '10px',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <button 
              onClick={() => changeLayout('1x1')}
              style={{
                padding: '8px 15px',
                backgroundColor: gridLayout === '1x1' ? '#4CAF50' : '#555',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              1 Cámara
            </button>
            <button 
              onClick={() => changeLayout('2x2')}
              style={{
                padding: '8px 15px',
                backgroundColor: gridLayout === '2x2' ? '#4CAF50' : '#555',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              2x2 (4 Cámaras)
            </button>
            <button 
              onClick={() => changeLayout('2x3')}
              style={{
                padding: '8px 15px',
                backgroundColor: gridLayout === '2x3' ? '#4CAF50' : '#555',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              2x3 (6 Cámaras)
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <div className="cameras-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: gridConfig.gridTemplateColumns,
          gridTemplateRows: gridConfig.gridTemplateRows,
          gap: '4px',
          flex: 1,
          width: '100%',
          margin: 0,
          padding: 0,
          backgroundColor: '#fff'
        }}>
          {visibleCameras.map(camera => (
            <div 
              key={camera.id} 
              className="camera-card"
              style={{
                margin: 0,
                padding: 0,
                borderRadius: 0,
                boxShadow: 'none',
                height: '100%',
                border: '2px solid #fff'
              }}
            >
              <div className="camera-feed" style={{ 
                height: '100%', 
                position: 'relative',
                margin: 0,
                padding: 0
              }}>
                {camera.status === 'active' ? (
                  <CameraFeedPlayer camera={camera} cameraStreamMapping={cameraStreamMapping} />
                ) : (
                  <div className="camera-placeholder" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    backgroundColor: '#000'
                  }}>
                    <i className="fas fa-video-slash" style={{ fontSize: '3rem', color: '#555' }}></i>
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '5px',
                  borderRadius: '3px',
                  fontSize: '0.8rem'
                }}>
                  {camera.name} - {camera.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;