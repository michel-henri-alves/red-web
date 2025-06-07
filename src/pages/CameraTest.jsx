import React, { useEffect, useRef } from 'react';

const CameraTest = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
      }
    };

    startCamera();
  }, []);

  return (
    <div>
      <h2>Teste de câmera</h2>
      <video ref={videoRef} style={{ width: '100%', maxWidth: '600px' }} />
    </div>
  );
};

export default CameraTest;
