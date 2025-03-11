import axios from "axios";

async function createSkill(idCompetition,skillName,competitionName,numberOfCompetitors,imageName,description) {
            try {
                const response =  await axios.post(`http://localhost:3000/skills/${idCompetition}/create`, {
                    skillName: skillName,
                    competitionName: competitionName,
                    numberOfCompetitors: numberOfCompetitors,
                    imageName:imageName,
                    description: description
                })

                return response.data;

            } catch (error) {
                console.error('Error al crear la competicion:', error);
                throw error;
            }
        };



export default createSkill;