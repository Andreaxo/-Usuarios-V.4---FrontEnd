import React from "react";
import deleteCompetition from "../../funtions/competitions/delete";
const DeleteCompetitions = ({ onClose }) => {

    const id = localStorage.getItem("selectedUpdateCompetitionId");

    const handleSubmit = async () => {
        try {
            await deleteCompetition(id);
            onClose();
            window.location.reload();
            alert("Competencia eliminada exitosamenteeee");
        }
        catch (error) {
            console.error("Error al eliminar la competenciaaaaa:", error);
        }
    };

    return (
        <div className="delete__flotant__window">

            <div className="delete__flotant__window__box" ><h2>¿Esta seguro de eliminar esta competencia?</h2>

                <div className="create__flotant__window-buttons-botton">
                    <button onClick={handleSubmit}>Eliminar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>

            </div>



        </div>
    );
};

export default DeleteCompetitions;
