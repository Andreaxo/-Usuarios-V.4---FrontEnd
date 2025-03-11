import { useState, useEffect } from "react";
import axios from "axios";

function useSkillsData(idCompetition) {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const GetDatos = async () => {
      try {
        const respuesta = await axios.get(`http://localhost:3000/skills/${idCompetition}`);

        setSkills(
          respuesta.data.map(skill => ({
            id: skill.idSkills,
            name: skill.skillName,
            competitionName: skill.competitionName,
            idCompetition: skill.idCompetition,
            numberOfCompetitors: skill.numberOfCompetitors,
            description: skill.description,
            image: skill.imageName
          }))
        );
      } catch (error) {
        console.error('Error al obtener habilidades del id de competición:', idCompetition, error);
      }
    };

    if (idCompetition) {
      GetDatos();
    }
  }, [idCompetition]);

  return skills;
}

export default useSkillsData;