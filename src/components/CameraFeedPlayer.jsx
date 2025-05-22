import { useRef, useEffect, useState } from 'react';

function CameraFeedPlayer({ camera }) {
  const [error, setError] = useState(false);

  // Si la cámara no está activa, mostrar un placeholder
  if (!camera || camera.status !== 'active') {
    return (
      <div className="camera-placeholder" style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <i className="fas fa-video-slash" style={{ fontSize: '2rem', color: '#555' }}></i>
        <p>Cámara no disponible</p>
      </div>
    );
  }

  // Construir la URL del stream directamente sin depender de api_url
  const cameraIdStr = camera.id.toString();
  const streamUrl = `http://172.16.2.231:8000/stream/cam${cameraIdStr}`;
  
  // Si hay un error, mostrar un mensaje
  if (error) {
    return (
      <div className="camera-placeholder" style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: '#ff4444' }}></i>
        <p>Error al cargar el video</p>
        <button 
          onClick={() => setError(false)} 
          style={{ marginTop: '10px', padding: '5px 10px', background: '#30c645', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="camera-container" style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '400px',
      aspectRatio: '16/9',
      overflow: 'hidden',
      position: 'relative',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <iframe
        src={streamUrl}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%', 
          height: '100%', 
          border: 'none'
        }}
        allowFullScreen={true}
        onError={() => setError(true)}
        title={`Cámara ${camera.name}`}
      />
    </div>
  );
}

export default CameraFeedPlayer;