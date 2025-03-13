import React from "react";
import { useNavigate } from "react-router-dom";

function ExitSystem() {
    const navigate = useNavigate();
    const navigateToExit = () => {
        navigate("/"); // Redirigimos
    };

    return (
        <div className="exit__general__box">

<div><a onClick={()=> navigateToExit}>Salir del sistema</a></div>
            
        </div>
    );            
} 

export default ExitSystem;
