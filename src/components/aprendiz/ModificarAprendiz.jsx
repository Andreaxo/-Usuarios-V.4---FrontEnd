import axios from "axios";
import { useState, useEffect } from "react";
import { message } from "antd";
import '../../styles/Aprendiz/StyleModificarAprendiz.css';
import { GoChevronLeft } from "react-icons/go";
import { PiPencilSimpleLineFill } from "react-icons/pi";


const TIPOS_DOCUMENTO = [
    { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
    { value: "Tarjeta de identidad", label: "Tarjeta de identidad" },
    { value: "Cédula de extranjería", label: "Cédula de extranjería" }
  ];
  
  const CENTROS_FORMACION = [
    { value: "Centro Atención Sector Agropecuario", label: "Centro Atención Sector Agropecuario" },
    { value: "Centro de Diseño e Innovación Tecnológica Industrial", label: "Centro de Diseño e Innovación Tecnológica Industrial" },
    { value: "Centro de comercio y servicios", label: "Centro de comercio y servicios" }
  ];
  
  const PROGRAMAS_FORMACION = [
    { value: "Análisis y desarrollo de software", label: "Análisis y desarrollo de software" },
    { value: "Multimedia", label: "Multimedia" },
    { value: "Infraestructura", label: "Infraestructura" }
  ];

  // Función auxiliar para formatear la fecha
const formatearFechaParaInput = (fechaString) => {
  if (!fechaString) return '';
  
  // Maneja cadenas de fecha ISO
  if (fechaString.includes('T')) {
      const fecha = new Date(fechaString);
      return fecha.toISOString().split('T')[0];
  }
  
  // Si ya está en formato YYYY-MM-DD, devuélvela tal cual
  if (fechaString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return fechaString;
  }
  
  // Para cualquier otro formato, intenta convertir a YYYY-MM-DD
  const fecha = new Date(fechaString);
  if (isNaN(fecha.getTime())) return ''; // Devuelve cadena vacía si la fecha es inválida
  
  return fecha.toISOString().split('T')[0];
};


export const ModificarAprendiz = ({ onClose, expertData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Asegurarse de que el ID se capture correctamente
  const [formData, setFormData] = useState({
    id: expertData?.id || '',  // Cambiado de 0 a ''
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
    programName: expertData?.programName,
    indexCourse: expertData.indexCourse,
    strategyCompetition: expertData.strategyCompetition,
    

  });

  const dataToSend = {
    id: formData.id,
    rol: formData.rol,
    name: formData.name,
    lastName: formData.lastName,
    documentType: formData.documentType,
    documentNumber: formData.documentNumber,
    documentDateOfissue: formData.documentDateOfissue,
    email: formData.email,
    birthdate: formData.birthdate,
    phone: formData.phone,
    programName: formData.programName,
    indexCourse: formData.indexCourse,
    formationCenter: formData.formationCenter,
    competitionName: formData.competitionName,
    strategyCompetition: formData.strategyCompetition
};

  // Actualizar useEffect para manejar mejor el ID
  useEffect(() => {
    if (expertData) {
        setFormData(prev => ({
            ...prev,
            ...expertData,
            birthdate: formatearFechaParaInput(expertData.birthdate)
        }));
    }
}, [expertData]);
  console.log(expertData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.location.reload();
    
 if (!formData.id) {
      message.error('ID no encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/clientes/${formData.id}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        message.success("Aspirante modificado exitosamente");
        if (onClose) {
          onClose();
        }
      }

    } catch (error) {
      console.error('Error al modificar:', error);
      message.error(
        error.response?.data?.message || 
        'Error al modificar el experto'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelect = ({ label, name, options }) => (
    <div className="login__container--labelsubcontainer">
      <label htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="login_container-userinput"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderInput = ({ type = "text", name = "", placeholder = "", hidden = false}) => (
    <div className="login__container--labelsubcontainer">
      <label htmlFor={name}>
        {placeholder}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder=""
        value={formData[name]}
        onChange={handleChange}
        className="login_container-userinput"
        style={{ display: hidden ? 'none' : 'block' }}
      />
    </div>
  );

  return (
    <div className="crear-experto">
        <button 
          type="button" 
          onClick={onClose} 
          className="submit-button-aprendiz"
        >
         <GoChevronLeft /> Volver atrás
        </button>
      <h1 className="titulo_crear">Modificar Aprendiz</h1>
      
      <form onSubmit={handleSubmit} className="formulario_experto">

      <input 
          type="hidden" 
          name="id" 
          value={formData.id} 
        />

        {renderInput({ name: "name", placeholder: "Nombre" })}
        {renderInput({ name: "lastName", placeholder: "Apellido" })}
        {renderInput({ 
          type: "date", 
          name: "birthdate", 
          placeholder: "Fecha de nacimiento" 
        })}
        
        {renderSelect({
          label: "Tipo de documento",
          name: "documentType",
          options: TIPOS_DOCUMENTO
        })}
        
        {renderInput({ 
          name: "documentNumber", 
          placeholder: "Número de documento" 
        })}
        {renderInput({ 
          name: "email", 
          placeholder: "Correo electrónico",
          type: "email"
        })}
        {renderInput({ 
          name: "phone", 
          placeholder: "Número de teléfono" 
        })}
        
        {renderSelect({
          label: "Centro de formación",
          name: "formationCenter",
          options: CENTROS_FORMACION
        })}
        {renderSelect({
          label: "Programa de formación",
          name: "programName",
          options: PROGRAMAS_FORMACION
        })}
        
        {renderInput({ 
          name: "strategyCompetition", 
          placeholder: "Competencia" 
        })}
        {renderInput({ 
          name: "competitionName", 
          placeholder: "Habilidad" 
        })}
        {/* {renderInput({ 
          name: "Rol", 
          placeholder: "rol" 
        })} */}

        <br/>

        <div className="button-container">
  <button 
    type="submit" 
    className="select-button-aprendiz"
    disabled={isLoading}
    onClick={onClose} 
  >
    {isLoading ? "Modificando..." : "Seleccionar competidor"}
  </button>

  <button 
    type="submit" 
    className="submit-button-guardar"
    disabled={isLoading}
    onClick={handleSubmit}
  >
    <PiPencilSimpleLineFill /> 
    {isLoading ? "Modificando..." : "Guardar"}
  </button>
</div>

      </form>
    </div>
  );
};