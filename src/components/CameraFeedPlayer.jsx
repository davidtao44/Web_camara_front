import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

function CameraFeedPlayer({ camera, cameraStreamMapping }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (camera && camera.status === 'active' && videoRef.current) {
      if (!Hls.isSupported()) {
        console.error(`HLS not supported for camera ${camera.id}`);
        return;
      }

      // Clean up any existing HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      // HLS.js configuration for low latency live streaming
      const hlsConfig = {
        debug: true, // Habilitar logs para depuración
        liveDurationInfinity: true, // Essential for live streams
        liveSyncDurationCount: 1,   // Try to sync if behind by 1 segment
        liveMaxLatencyDurationCount: 2, // If latency exceeds 2 segments, seek to live edge
        maxBufferLength: 10,        // Keep buffer relatively short (seconds)
        maxMaxBufferLength: 20,     // Max buffer (seconds)
        // You might also experiment with these, but start with the above
        // highBufferWatchdogPeriod: 2,
        // nudgeMaxRetry: 3,
      };

      const newHls = new Hls(hlsConfig); // Pass config here
      hlsRef.current = newHls;

      const cameraIdStr = camera.id.toString();
      const cameraStreamId = cameraStreamMapping[cameraIdStr] || 'camara'; // Default if not found
      const streamUrl = `http://localhost:8888/${cameraStreamId}/index.m3u8`;

      console.log(`Loading stream for camera ${camera.name} (ID: ${cameraIdStr}) in grid: ${streamUrl}`);

      newHls.loadSource(streamUrl);
      newHls.attachMedia(videoRef.current);

      newHls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Intentar reproducir automáticamente, pero permitir control manual
        videoRef.current.play().catch(e => {
          console.warn(`Auto-play prevented for camera ${camera.id}:`, e);
          // Attempt to play with mute as a fallback for some browser policies
          videoRef.current.muted = true;
          videoRef.current.play().catch(e2 => console.warn(`Muted auto-play also prevented for camera ${camera.id}:`, e2));
        });
      });

      // Evento para permitir manipulación directa
      videoRef.current.addEventListener('click', (e) => {
        // Evitar que el clic se propague a otros elementos
        e.stopPropagation();
        
        // Si el video está pausado, reproducir; si está reproduciendo, pausar
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      });

      newHls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error(`Fatal HLS error for camera ${camera.id}:`, data);
          newHls.destroy();
        } else {
          console.warn(`Non-fatal HLS error for camera ${camera.id}:`, data);
        }
      });

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
        // Eliminar el event listener al desmontar
        if (videoRef.current) {
          videoRef.current.removeEventListener('click', () => {});
        }
      };
    } else {
      // If camera is not active or videoRef is not available, ensure HLS is destroyed
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    }
  }, [camera, cameraStreamMapping]);

  if (!camera || camera.status !== 'active') {
    return (
      <div className="camera-placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="fas fa-video-slash" style={{ fontSize: '2rem', color: '#555' }}></i>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      playsInline
      controls={true} // Habilitamos los controles nativos del video
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover',
        cursor: 'pointer' // Indicar que es interactivo
      }}
      muted // Es buena práctica iniciar con mute para autoplay
      controlsList="nofullscreen nodownload" // Opcional: restringir algunas funciones si lo deseas
    />
  );
}

export default CameraFeedPlayer;