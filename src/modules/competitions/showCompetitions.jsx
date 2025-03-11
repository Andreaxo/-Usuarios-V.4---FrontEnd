import React, { useState } from "react";
import useCompetitionssData from "../../funtions/competitions/getCompetitions";
import CreateCompetitions from "./createCompetitions";
import UpdateCompetitions from "./updateCompetitons";
import { useNavigate } from "react-router-dom";
import iconGes from '../../icons/logoTR.png';
import iconSena from '../../icons/senaLogo.png';
import imgEjemplo from '../../icons/logo-worldskills.png';
import { CiEdit } from "react-icons/ci";
import './showCompetitions.css';

const backgroundimagne = {
    backgroundImage: `url(${imgEjemplo})`,  // Reemplaza `url_de_imagen` con la URL de la imagen
    backgroundSize: 'contain',  // Opcional, para que la imagen cubra el espacio
    backgroundPosition: 'center',  // Opcional, para centrar la imagen
    backgroundRepeat: 'no-repeat'
 };

function ShowCompetitions() {
    const competitions = useCompetitionssData(); //hook competicion
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false); // Estado modulos crear
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false); // Estado modulo modificar
    const navigate = useNavigate();

    const navigateToSkill = (index, name) => {
        localStorage.setItem("selectedCompetitionName", name);
        localStorage.setItem("selectedCompetitionId", index); // Guardamos el id en localStorage
        navigate("/menu"); // Redirigimos
    };

    const navigateToUpdate = (event,index) => {
        localStorage.setItem("selectedUpdateCompetitionId", index);
        event.stopPropagation();
        setIsModalUpdateOpen(true)
        console.log(index)
        
    };

    return (
        <div className="competitions__box-general">


            <div className="competitions__box-icons">
                <div className="competitions__box-icons-list">
                    <img src={iconGes} alt="" />
                </div>
                <div className="competitions__box-icons-list">
                    <img src={iconSena} alt="" />
                </div>


            </div>

            <div className="competitions__box-title"><h1>Competiciones</h1></div>


            {/* condicion para el create solo si isModalOpen es true */}
            {isModalCreateOpen && <CreateCompetitions onClose={() => setIsModalCreateOpen(false)} />}

              {/* condicion para el create solo si isModalOpen es true */}
              {isModalUpdateOpen && <UpdateCompetitions onClose={() => setIsModalUpdateOpen(false)} />}


            <div className="competitions__box-list">
                {competitions.map((competition) => (
                    <div key={competition.id} className="competitions__box-item" style={backgroundimagne} onClick={() => navigateToSkill(competition.id, competition.name)}>
                        <div><p className="competitions__box-name">{competition.name}</p></div>

                        <button onClick={(event) => navigateToUpdate(event, competition.id)} className="competitions__box-edit"> <CiEdit className="competitions__box-edit-icon"/><p className="competitions__box-edit-title">Modificar</p></button>
                    </div>
                ))}

                {/* Botón para abrir el modal */}
                <button className="competitions__box-button" onClick={() => setIsModalCreateOpen(true)}>Crear nueva competición</button>
            </div>
        </div>
    );
}

export default ShowCompetitions;



