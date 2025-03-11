import React, { useState } from "react";
import createSkill from "../../funtions/skillls/createSkills";
import './createSkills.css'

const CreateSkills = ({ onClose }) => {
    const name = localStorage.getItem("selectedCompetitionName");
    const id = localStorage.getItem("selectedCompetitionId");
    
    const [formData, setFormData] = useState({

        skillName: '',
        competitionName: name,
        numberOfCompetitors: '',
        imageName: '',
        description: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {

        console.log(formData)
        try {
            await createSkill(
                id,
                formData.skillName,
                formData.competitionName,
                formData.numberOfCompetitors,
                formData.imageName,
                formData.description
            );
            alert("Habilidad creada exitosamente");
            window.location.reload();
        } catch (error) {
            alert("Hubo un error al crear la Habilidad");
            console.error("Error al crear la Habilidad:", error);
        }
    };

    return (
        <div className="create__flotant__window">
            
            <div>
                <div className="create__flotant__window_tittles">
                <h2>Crear habilidades</h2>
                <button onClick={onClose}>  Volver atras </button>
                </div>
                

                <div>
                    <h2>Ingrese el nombre de habilidad</h2>
                    <input type="text" name="skillName" value={formData.skillName} onChange={handleInputChange} />
                </div>

                <div>
                    <h2>Cargar imagen de competencia</h2>
                    <div><img src="/pon" alt="" /></div>
                    <input type="text" placeholder="heee" name="imageName" value={formData.imageName} onChange={handleInputChange} />
                    <button>Seleccionar imagen</button>
                </div>

                <div>
                    <h2>Ingrese la descripción de la competencia</h2>
                    <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
                </div>

                <div>
                    <h2>Ingrese numero de competidores</h2>
                    <input type="number" name="numberOfCompetitors" value={formData.numberOfCompetitors} onChange={handleInputChange} />
                </div>

            </div>

            <button onClick={handleSubmit}> Crear competencia </button>
        </div>
    );
};

export default CreateSkills;










