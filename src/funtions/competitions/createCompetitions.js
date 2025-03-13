import axios from "axios";

async function createCompetition(competitionName,competitionDate,place,imageName,descripcion,competitorsAge) {
            try {
                const response =  await axios.post(`http://localhost:3000/competitions/create`, {
                    competitionName: competitionName,
                    competitionDate: competitionDate,
                    place: place,
                    imagenName:imageName,
                    description: descripcion,
                    competitorsAge:competitorsAge
                })

                return response.data;

            } catch (error) {
                console.error('Error al crear la competicion:', error);
                throw error;
            }
        };



export default createCompetition;