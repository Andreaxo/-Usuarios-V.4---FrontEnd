import axios from "axios";

async function updateCompetition(idCompetition,competitionName,competitionDate,place,imageName,descripcion,competitorsAge) {
            try {
                const response =  await axios.put(`http://localhost:3000/competitions/update/${idCompetition}`, {
                    competitionName: competitionName,
                    competitionDate: competitionDate,
                    place: place,
                    imagenName:imageName,
                    description: descripcion,
                    competitorsAge:competitorsAge
                })

                return response.data;

            } catch (error) {
                console.error('Error al modificar la competicion:', error);
                throw error;
            }
        };


export default updateCompetition;