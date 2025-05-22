import { useRef, useEffect, useState } from 'react';

function CameraFeedPlayer({ camera }) {
  const [error, setError] = useState(false);

  // Si la cámara no está activa, mostrar un placeholder
  if (!camera || camera.status !== 'active') {
    return (
      <div className="camera-placeholder" style={{ 
        width: '100%', 
        height: '100%', 
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
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      <img
        src={streamUrl}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          display: 'block'
        }}
        onError={() => setError(true)}
        alt={`Cámara ${camera.name}`}
      />
    </div>
  );
}

export default CameraFeedPlayer;