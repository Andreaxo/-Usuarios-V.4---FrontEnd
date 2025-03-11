import React, { useState } from "react";
import useSkillsData from "../../funtions/skillls/getSkills"; // Asegúrate de importar correctamente
import { useNavigate } from "react-router-dom";
import CreateSkills from "./createSkills";
import { CiEdit } from "react-icons/ci";
import { FaPerson } from "react-icons/fa6";
import './skills.css'


function ShowSkills() {
    const id = localStorage.getItem("selectedCompetitionId");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const skills = useSkillsData(id); //hook con toda la data del parametro (id competicion)
    const navigate = useNavigate();

    const navigateToSkillById = (skillId) => {
        localStorage.setItem("selectedSkillId", skillId); 
        navigate("/habilidadElegida"); // Redirigimos
    };

    return (
        <div className="Skills__box-general">
            
        
            <div className="skills__box-general-header">

                <div className="skills__box-general-titles"><h1>Habilidades</h1>
                <h2>Escoge una habilidad</h2></div>
                

                <div className="skills__box-general_container-button"><button className="skills__box-button" onClick={() => setIsModalOpen(true)}>Crear habilidad</button></div>

            </div>
            
            

            {/* condicion para el create solo si isModalOpen es true */}
            {isModalOpen && <CreateSkills onClose={() => setIsModalOpen(false)} />}
            <div className="skills__box-list">
                {skills.map((skill) => (
                    <div key={skill.id} className="skills__box-item" onClick={() => navigateToSkillById(skill.id)}>
                        <div></div>
                        <div><h3>{skill.name}</h3></div>
                        
                        <div className="skills__box-item-info"><FaPerson />0/{skill.numberOfCompetitors}</div>

                        <button onClick={(event) => navigateToUpdate(event, competition.id)} className="competitions__box-edit"> <CiEdit className="competitions__box-edit-icon"/><p className="competitions__box-edit-title">Modificar</p></button>

                    </div>
                    
                ))}
               



            </div>
        </div>
    );
}

export default ShowSkills;