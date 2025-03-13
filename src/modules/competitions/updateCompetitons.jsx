import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCompetitionssDataById from "../../funtions/competitions/getCompetitionById";
import updateCompetition from "../../funtions/competitions/updateCompetitions";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever, MdTurnLeft } from "react-icons/md";
import DeleteCompetitions from "./deleteCompetitions";

const UpdateCompetitions = ({ onClose }) => {
  const id = localStorage.getItem("selectedUpdateCompetitionId");
  const navigate = useNavigate();
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  // Usamos el hook para obtener la competencia con el id
  const competitionsData = useCompetitionssDataById(id);

  // Usamos useEffect para manejar la actualización de los datos con un retraso
  useEffect(() => {
    const fetchDataWithDelay = async () => {
      if (competitionsData && competitionsData.length > 0) {
        // Esperamos 100ms antes de actualizar el estado
        await new Promise(resolve => setTimeout(resolve, 100));
        // Elige el primer objeto de la lista de competencias si existe
        setSelectedCompetition(competitionsData[0]);
      }
    };
    fetchDataWithDelay(); // Llamamos a la función asíncrona para cargar los datos con retraso

  }, [competitionsData]); // Dependencia de `competitionsData` para que se ejecute cuando se actualicen los datos

  const [formData, setFormData] = useState({
    name: '',
    competitionDate: '',
    place: '',
    imageName: '',
    descripcion: '',
    competitorsAge: ''
  });

  // Sincroniza `formData` con `selectedCompetition` cuando se actualicen los datos
  useEffect(() => {
    if (selectedCompetition) {
      setFormData({
        name: selectedCompetition.name || '',
        competitionDate: formatDate(selectedCompetition.date) || '',
        place: selectedCompetition.place || '',
        imageName: selectedCompetition.image || '',
        descripcion: selectedCompetition.description || '',
        competitorsAge: selectedCompetition.age || ''
      });
    }
  }, [selectedCompetition]); // Se ejecuta cada vez que `selectedCompetition` cambia

  // Función para manejar el cambio de valores en el formulario
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para enviar los datos
  const handleSubmit = async () => {
    try {
      await updateCompetition(
        id,
        formData.name,
        formData.competitionDate,
        formData.place,
        formData.imageName,
        formData.descripcion,
        formData.competitorsAge
      );
      alert("Competencia modificada exitosamente");
      onClose();
      window.location.reload(); // Vuelve a la lista de competencias
    } catch (error) {
      alert("Hubo un error al modificar la competencia");
      console.error(formData, "Error al modificar la competencia:", error);
    }
  };


  // Convertir la fecha al formato "yyyy-MM-dd"
  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date).toISOString().slice(0, 10); // "yyyy-MM-dd"
    return formattedDate;
  };

  if (!selectedCompetition) {
    return <p>Cargando competencia...</p>; // Muestra un mensaje de "Cargando" si los datos aún no están listos
  }

  return (

    <div>
      {/* condicion para el create solo si isModalOpen es true */}
      {isModalDeleteOpen && <DeleteCompetitions onClose={() => setIsModalDeleteOpen(false)} />}

      <div className="create__flotant__window">
        <h2>Modificar competencia</h2>
        <div>
          <input
            type="text"
            required
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
          />
          <label>Nombre de la competencia</label>
        </div>

        <div>
          <input
            type="date"
            required
            name="competitionDate"
            value={formData.competitionDate || ''}
            onChange={handleInputChange}
          />
          <label>Fecha de la competencia</label>
        </div>

        <div>
          <input
            type="text"
            required
            name="place"
            value={formData.place || ''}
            onChange={handleInputChange}
          />
          <label>Lugar de la competencia</label>
        </div>

        <div>
          <div className="create__flotant__window-image-box">
            <img src={formData.imageName || '/pon'} alt="Imagen de la competencia" />
          </div>
        </div>
        <button>Seleccionar imagen</button>

        <div>
          <input
            type="number"
            required
            name="competitorsAge"
            value={formData.competitorsAge || ''}
            onChange={handleInputChange}
          />
          <label>Edad máxima de la competencia</label>
        </div>

        <div>
          <input
            className="create__flotant__window-description"
            type="text"
            required
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleInputChange}
          />
          <label>Descripción de la competencia</label>
        </div>

        <div className="create__flotant__window-buttons-botton">
          <button onClick={handleSubmit} > <CiEdit className="competitions__box-edit-icon-popup" />Guardar</button>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={() => setIsModalDeleteOpen(true)} ><MdDeleteForever className="competitions__box-edit-delete-icon" /></button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCompetitions;
