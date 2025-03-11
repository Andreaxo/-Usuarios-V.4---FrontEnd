import React, { useState, useEffect } from 'react';
import './index.css';

function DocumentosPopUp({ state }) {
  const [isVisible, setIsVisible] = useState(state);

  // Establecer la visibilidad al cerrar el popup
  useEffect(() => {
    if (!state) {
      setTimeout(() => setIsVisible(false), 400); // Esperar 400ms para la animación de salida
    } else {
      setIsVisible(true); // Mostrar el popup
    }
  }, [state]);

  return (
    <div className='body__documentosPopUp'>
      {isVisible && (
        <div className={`documentosPopUp__container ${state ? 'documentosPopUp__container--in' : 'documentosPopUp__container--out'}`}>
          <h1>this is a popup</h1>
        </div>
      )}
    </div>
  );
}

export default DocumentosPopUp;
