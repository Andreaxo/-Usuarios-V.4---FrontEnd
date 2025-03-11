import axios from "axios";

async function deleteCompetition(idCompetition) {
            try {
                const response =  await axios.delete(`http://localhost:3000/competitions/delete/${idCompetition}`)
                .then(response => {
                  console.log('Response:', response.data);
                })
                .catch(error => {
                  console.error('Error:', error);
                });
            } catch (error) {
                console.error('Error al eliminar la competicion:', error);
                throw error;
            }
        };


export default deleteCompetition;

