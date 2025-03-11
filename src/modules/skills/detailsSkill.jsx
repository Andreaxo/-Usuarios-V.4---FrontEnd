import React, { useState } from "react";
import useSkillByIdsData from "../../funtions/skillls/detailSkillById"; // Asegúrate de importar correctamente
import { useNavigate } from "react-router-dom";


function DetailSkill() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const skills = useSkillByIdsData(); //hook con toda la data del parametro (id competicion)
    const navigate = useNavigate();

    const navigateToSkills = () => {
        navigate("/habilidades"); // Redirigimos
    };

    return (
        <div>
            <button onClick={() => navigateToSkills()} >Volver a habilidades</button>
            <h1>Habilidad</h1>
            <ul>
                {skills.map((skill) => (
                    <div key={skill.id}>
                        <div></div>
                        <div><img src={`${skill.imageName}`} alt="" /></div>
                        <div><h3>{skill.name}</h3></div>
                        <div><h3>{skill.description}</h3></div>
                        <div>0/{skill.numberOfCompetitors}</div>


                    </div>

                ))}
            </ul>
            <button >Modificar una habilidad</button>
        </div>
    );
}

export default DetailSkill;