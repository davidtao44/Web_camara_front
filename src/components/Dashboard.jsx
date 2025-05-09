import { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
import CameraFeedPlayer from './CameraFeedPlayer';
import { API_BASE_URL } from '../utils/apiConfig';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function Dashboard({ userRole }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridLayout, setGridLayout] = useState('2x2');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCamera, setSelectedCamera] = useState(null);
  
  // Estados para datos de alarma
  const [alarmData, setAlarmData] = useState({
    current_detection: {},
    history: [],
    stats: {
      total_detections: 0,
      unknown_detections: 0,
      identified_detections: 0,
      recognition_percentage: 0
    }
  });
  const [alarmLoading, setAlarmLoading] = useState(false);
  const [alarmError, setAlarmError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // This mapping connects camera IDs from Firestore to MediaMTX path names
  const cameraStreamMapping = {
    // For mock cameras (by ID number)
    '1': 'camara',
    '2': 'camara2',
    '3': 'camara3',
    '4': 'camara4',
    '5': 'camara5',
    '6': 'camara6',
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
          { id: 3, name: 'Cámara 3', location: 'Pasillo A', status: 'active', lastActivity: '5 min ago' },
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

  // Función para obtener datos de alarma
  const fetchAlarmData = async () => {
    setAlarmLoading(true);
    setAlarmError('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/alarmcamera`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAlarmData(response.data);
    } catch (error) {
      console.error('Error al obtener datos de alarma:', error);
      setAlarmError('Error al obtener datos de alarma. Por favor intente nuevamente.');
    } finally {
      setAlarmLoading(false);
    }
  };

  // Función para resetear contadores
  const resetAlarmCounters = async () => {
    setAlarmLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_BASE_URL}/alarmcamera/reset`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAlarmData({
        ...alarmData,
        stats: response.data.stats,
        history: []
      });
      alert('Contadores reiniciados correctamente');
    } catch (error) {
      console.error('Error al resetear contadores:', error);
      setAlarmError('Error al resetear contadores. Por favor intente nuevamente.');
    } finally {
      setAlarmLoading(false);
    }
  };

  // Cargar datos de alarma al montar el componente y cada 10 segundos
  useEffect(() => {
    fetchAlarmData();
    
    // Actualizar datos cada 10 segundos
    const interval = setInterval(() => {
      fetchAlarmData();
    }, 10000);
    
    return () => clearInterval(interval);
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

  // Filtrar historial por búsqueda y rango de fechas
  const filteredHistory = alarmData.history.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      (entry.name && entry.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const entryDate = new Date(entry.timestamp);
    const matchesStartDate = dateRange.start === '' || 
      entryDate >= new Date(dateRange.start);
    const matchesEndDate = dateRange.end === '' || 
      entryDate <= new Date(new Date(dateRange.end).setHours(23, 59, 59));
    
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  // Preparar datos para la gráfica
  const prepareChartData = () => {
    // Agrupar por hora/día
    const groupedData = {};
    const unknownData = {};
    
    alarmData.history.forEach(entry => {
      const date = new Date(entry.timestamp);
      const key = date.toLocaleDateString() + ' ' + date.getHours() + ':00';
      
      if (!groupedData[key]) {
        groupedData[key] = 0;
        unknownData[key] = 0;
      }
      
      groupedData[key]++;
      if (entry.is_unknown) {
        unknownData[key]++;
      }
    });
    
    const labels = Object.keys(groupedData).sort();
    const totalData = labels.map(key => groupedData[key]);
    const unknownValues = labels.map(key => unknownData[key]);
    const identifiedValues = labels.map((key, index) => totalData[index] - unknownValues[index]);
    
    return {
      labels,
      datasets: [
        {
          label: 'Total Detecciones',
          data: totalData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Personas Registradas',
          data: identifiedValues,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'No Identificadas',
          data: unknownValues,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ],
    };
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {/* Contadores en tiempo real */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              margin: '0 0 20px 0',
              padding: '15px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <div style={{ 
                flex: 1, 
                textAlign: 'center', 
                padding: '15px', 
                backgroundColor: '#fff',
                margin: '0 10px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Total Detecciones</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#4CAF50' }}>
                  {alarmData.stats.total_detections}
                </p>
              </div>
              
              <div style={{ 
                flex: 1, 
                textAlign: 'center', 
                padding: '15px', 
                backgroundColor: '#fff',
                margin: '0 10px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No Identificadas</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#F44336' }}>
                  {alarmData.stats.unknown_detections}
                </p>
              </div>
              
              <div style={{ 
                flex: 1, 
                textAlign: 'center', 
                padding: '15px', 
                backgroundColor: '#fff',
                margin: '0 10px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>% Reconocimiento</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#2196F3' }}>
                  {alarmData.stats.recognition_percentage}%
                </p>
              </div>
              
              <button 
                onClick={resetAlarmCounters}
                style={{
                  backgroundColor: '#F44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '40px',
                  alignSelf: 'center'
                }}
                disabled={alarmLoading}
              >
                {alarmLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <>
                    <i className="fas fa-redo-alt" style={{ marginRight: '5px' }}></i>
                    Resetear
                  </>
                )}
              </button>
            </div>
            
            {/* Cámaras */}
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
          </div>
        );
        
      case 'single-camera':
        return (
          <div style={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
            {/* Vista de cámara individual */}
            <div style={{ flex: 3, padding: '20px' }}>
              <select 
                value={selectedCamera || ''} 
                onChange={(e) => setSelectedCamera(e.target.value)}
                style={{
                  marginBottom: '20px',
                  padding: '8px',
                  borderRadius: '4px',
                  width: '100%'
                }}
              >
                <option value="">Seleccione una cámara</option>
                {cameras.map(camera => (
                  <option key={camera.id} value={camera.id}>
                    {camera.name} - {camera.location}
                  </option>
                ))}
              </select>
              
              {selectedCamera ? (
                <div style={{ height: 'calc(100% - 60px)' }}>
                  <CameraFeedPlayer 
                    camera={cameras.find(c => c.id === parseInt(selectedCamera))} 
                    cameraStreamMapping={cameraStreamMapping}
                  />
                </div>
              ) : (
                <div style={{
                  height: 'calc(100% - 60px)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}>
                  <p>Seleccione una cámara para visualizar</p>
                </div>
              )}
            </div>
            
            {/* Panel lateral con registros */}
            <div style={{ 
              flex: 1, 
              backgroundColor: '#f5f5f5', 
              padding: '20px',
              borderLeft: '1px solid #ddd',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: 'rgb(39, 39, 38)' }}>Personas Identificadas</h3>
              
              {/* Filtros */}
              <div style={{ marginBottom: '15px', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Buscar por nombre..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    color: '#333',
                    width: '100%',
                    padding: '12px 5px 12px 5px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    marginBottom: '10px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#f8f9fa',
                    outline: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    '&:focus': {
                      border: '2px solid #4CAF50',
                      boxShadow: '0 2px 8px rgba(76,175,80,0.1)',
                      backgroundColor: '#fff'
                    }
                  }}
                />
                <i className="fas fa-search" style={{
                  position: 'absolute',
                  right: '7px',
                  top: '40%',
                  transform: 'translateY(-50%)',
                  color: '#9e9e9e',
                  fontSize: '14px'
                }}></i>
              </div>
              
              {/* Lista de personas */}
              <div style={{ 
                color: 'rgb(39, 39, 38)',
                flex: 1, 
                overflowY: 'auto',
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '10px'
              }}>
                {alarmLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#4CAF50' }}></i>
                    <p>Cargando datos...</p>
                  </div>
                ) : filteredHistory.length > 0 ? (
                  filteredHistory.map((entry, index) => (
                    <div key={index} style={{
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      backgroundColor: entry.is_unknown ? '#fff3f3' : '#f0f8ff',
                      marginBottom: '8px',
                      borderRadius: '4px'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>
                        {entry.name || 'Desconocido'}
                        {entry.age && ` - ${entry.age} años`}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: '#666' }}>
                    No hay registros disponibles
                  </p>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'analytics':
        return (
          <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Análisis de Detecciones</h2>
              
              <button 
                onClick={fetchAlarmData}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                disabled={alarmLoading}
              >
                {alarmLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <>
                    <i className="fas fa-sync-alt"></i>
                    Actualizar
                  </>
                )}
              </button>
            </div>
            
            {/* Gráfica de líneas */}
            <div style={{ marginBottom: '30px' }}>
              <h3>Tendencia de Detecciones</h3>
              <div style={{ height: '300px' }}>
                {alarmData.history.length > 0 ? (
                  <Line 
                    data={prepareChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Detecciones a lo largo del tiempo'
                        }
                      }
                    }}
                  />
                ) : (
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px'
                  }}>
                    <p>No hay datos suficientes para mostrar la gráfica</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Estadísticas generales */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '30px',
              backgroundColor: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{color :'#333'}}>Total Detecciones</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                  {alarmData.stats.total_detections}
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{color :'#333'}}>Identificadas</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
                  {alarmData.stats.identified_detections}
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{color :'#333'}}>No Identificadas</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F44336' }}>
                  {alarmData.stats.unknown_detections}
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{color :'#333'}}>% Reconocimiento</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
                  {alarmData.stats.recognition_percentage}%
                </p>
              </div>
            </div>
            
            {/* Gráfica de barras */}
            <div>
              <h3>Comparativa de Detecciones</h3>
              <div style={{ height: '300px' }}>
                {alarmData.stats.total_detections > 0 ? (
                  <Bar 
                    data={{
                      labels: ['Detecciones'],
                      datasets: [
                        {
                          label: 'Identificadas',
                          data: [alarmData.stats.identified_detections],
                          backgroundColor: 'rgba(33, 150, 243, 0.6)',
                        },
                        {
                          label: 'No Identificadas',
                          data: [alarmData.stats.unknown_detections],
                          backgroundColor: 'rgba(244, 67, 54, 0.6)',
                        }
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Comparativa de tipos de detecciones'
                        }
                      },
                      scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          stacked: true
                        }
                      }
                    }}
                  />
                ) : (
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px'
                  }}>
                    <p>No hay datos suficientes para mostrar la gráfica</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
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
      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd'
      }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'dashboard' ? '#4CAF50' : '#fff',
            color: activeTab === 'dashboard' ? '#fff' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('single-camera')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'single-camera' ? '#4CAF50' : '#fff',
            color: activeTab === 'single-camera' ? '#fff' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cámara Individual
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'analytics' ? '#4CAF50' : '#fff',
            color: activeTab === 'analytics' ? '#fff' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Análisis
        </button>
      </div>

      {/* Layout Menu Button */}
      {activeTab === 'dashboard' && (
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
      )}

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
        renderTabContent()
      )}
    </div>
  );
}

export default Dashboard;