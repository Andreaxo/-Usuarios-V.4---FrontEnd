import React, { useState } from "react";
import createCompetition from "../../funtions/competitions/createCompetitions";
import { useNavigate } from "react-router-dom";
import './create.css';

const CreateCompetitions = ({ onClose }) => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        competitionName: '',
        competitionDate: '',
        place: '',
        imageName: 'ghgh',
        descripcion: '',
        competitorsAge: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            await createCompetition(
                formData.competitionName,
                formData.competitionDate,
                formData.place,
                formData.imageName,
                formData.descripcion,
                formData.competitorsAge
            );
            alert("Competencia creada exitosamente");
            window.location.reload();
        } catch (error) {
            alert("Hubo un error al crear la competencia");
            console.error("Error al crear la competencia:", error);
        }
    };

    return (
        <div className="create__flotant__window">

            
                <h2>Crear nueva competición</h2>

                <div>
                <input type="text" required name="competitionName" value={formData.competitionName} onChange={handleInputChange} />
                    <label>Nombre de la competencia</label>
                    
                </div>

                <div>
                    
                    <input type="date" required name="competitionDate" value={formData.competitionDate} onChange={handleInputChange} />
                    <label>Fecha de la competencia</label>
                </div>

                <div>
                    
                    <input type="text" required name="place" value={formData.place} onChange={handleInputChange} />
                    <label>Lugar de la competencia</label>
                </div>

                <div >
                    <div className="create__flotant__window-image-box">
                    <img src="/pon" alt="" />
                    
                    </div>
                </div>
                <button>Seleccionar imagen</button>

                <div>
                    
                    <input type="number" required name="competitorsAge" value={formData.competitorsAge} onChange={handleInputChange} />
                    <label>Edad máxima de la competencia</label>
                </div>

                <div>

                    
                    <input className="create__flotant__window-description" type="text" required name="descripcion" value={formData.descripcion} onChange={handleInputChange} />
                    <label>Descripción de la competencia</label>
                </div>

                
            

            <div className="create__flotant__window-buttons-botton"><button onClick={handleSubmit}>Crear</button><button onClick={onClose}>Cancelar</button></div>
        </div>
    );
};

export default CreateCompetitions;










