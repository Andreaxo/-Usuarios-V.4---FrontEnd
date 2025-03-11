import { useState, useEffect } from "react";
import { message } from "antd";
import '../../styles/Aprendiz/StyleVerAprendiz.css';
import { GoChevronLeft } from "react-icons/go";

const TIPOS_DOCUMENTO = [
  { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
  { value: "Tarjeta de identidad", label: "Tarjeta de identidad" },
  { value: "Cédula de extranjería", label: "Cédula de extranjería" }
];


const formatearFechaParaInput = (fechaString) => {
  if (!fechaString) return '';
  if (fechaString.includes('T')) {
    const fecha = new Date(fechaString);
    return fecha.toISOString().split('T')[0];
  }
  if (fechaString.match(/^\d{4}-\d{2}-\d{2}$/)) return fechaString;
  const fecha = new Date(fechaString);
  if (isNaN(fecha.getTime())) return '';
  return fecha.toISOString().split('T')[0];
};

export const VerAprendiz = ({ onClose, expertData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: expertData?.id || '',
    name: expertData?.name || "",
    lastName: expertData?.lastName || "",
    competitionName: expertData.competitionName,
    formationCenter: expertData.formationCenter,
    rol: expertData.rol,
    birthdate: formatearFechaParaInput(expertData?.birthdate) || "",
    documentType: expertData.documentType,
    documentNumber: expertData.documentNumber,
    email: expertData.documentNumber,
    phone: expertData.phone,
    programName: expertData.programName,
    indexCourse: expertData.indexCourse,
    strategyCompetition: expertData.strategyCompetition,
  });

  useEffect(() => {
    if (expertData) {
      setFormData(prev => ({
        ...prev,
        ...expertData,
        birthdate: formatearFechaParaInput(expertData.birthdate)
      }));
    }
  }, [expertData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id) {
      message.error('ID no encontrado');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/clientes/${formData.id}`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      if (response.data) {
        message.success("Experto modificado exitosamente");
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error al modificar:', error);
      message.error(
        error.response?.data?.message || 'Error al modificar el experto'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = ({ type = "text", name = "", placeholder = "", hidden = false }) => (
    <div className="login__container--labelsubcontainer">
      <label htmlFor={name}>{placeholder}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`login_container-${type === 'password' ? 'password' : 'user'}input`}
        style={{ display: hidden ? 'none' : 'block' }}
        readOnly={true}
      />
    </div>
  );

  return (
    <div className="crear-experto">
      <button type="button" onClick={onClose} className="submit-button-aprendiz"><GoChevronLeft />Volver atrás</button>
    
    
      <h1 className="titulo_crear"><b>Aspirante: </b> {formData.name} {formData.lastName}</h1>
    
      <form onSubmit={handleSubmit} className="formulario_experto">
        <input type="hidden" name="id" value={formData.id} />
        
        {renderInput({ name: "name", placeholder: "Nombre" })}
        {renderInput({ name: "lastName", placeholder: "Apellido" })}
        {renderInput({ type: "date", name: "birthdate", placeholder: "Fecha de nacimiento" })}
        
        {renderInput({ label: "Tipo de documento", name: "documentType", options: TIPOS_DOCUMENTO })}
        {renderInput({ name: "documentNumber", placeholder: "Número de documento" })}
        {renderInput({ name: "email", placeholder: "Correo electrónico", type: "email" })}
        {renderInput({ name: "phone", placeholder: "Número de teléfono" })}
        
        {renderInput({ placeholder: "Centro de formación", name: "formationCenter"})}
        {renderInput({ placeholder: "Programa de formación",  name: "programName"})}
        
        {renderInput({ name: "strategyCompetition", placeholder: "Competencia" })}
        {renderInput({ name: "competitionName", placeholder: "Habilidad" })}
        <br/>
      <button type="button" onClick={onClose} className="select-button-aprendiz">Seleccionar a competidor</button>
        <br />
      </form>
    </div>
  );
};
