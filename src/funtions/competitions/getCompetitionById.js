import { useState, useEffect } from "react";
import axios from "axios";


function useCompetitionssDataById(idCompetition) {
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    const GetDatos = async () => {
      try {
        const respuesta = await axios.get(`http://localhost:3000/competitions/${idCompetition}`);
 
        setCompetitions(
respuesta.data.map(competition => ({
            id: competition.idCompetitions,
            name: competition.competitionName,
            date: competition.competitionDate,
            place: competition.place,
            numberOfCompetitors: competition.numberOfCompetitors,
            description: competition.description,
            age:competition.competitorsAge,
            image: competition.imageName,
            requirements:competition.competitorRequirements
          }))
        );
      } catch (error) {
        console.error('Error al obtener competiciónes:', error);
      }
    };

GetDatos();

  }, []);

  return competitions;
}

export default useCompetitionssDataById;