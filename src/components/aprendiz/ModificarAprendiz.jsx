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
  const [successMessage, setSuccessMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  
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
    email: expertData.email,  // Fixed: was using documentNumber instead of email
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

  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    rol: "",
    birthdate: "",
    documentNumber: "",
    email: "",
    phone: "",
    area: "",
    senaVinculation: "",
    competitionName: "",
    strategyCompetition: "",
    programName: "",
  });
 

 // Función de validación mejorada
 const validateField = (fieldName, value) => {
  // Si se proporciona un campo específico, validar solo ese campo
  if (fieldName) {
    let errorMessage = "";
    const safeValue = value !== undefined ? value : formData[fieldName];

    switch (fieldName) {
      case "name":
      case "lastName":
      case "area":
      case "programName":
      case "strategyCompetition":      
      case "senaVinculation":
      case "competitionName":
      case "rol":
        if (!String(safeValue || "").trim()) {
          errorMessage = `El campo es obligatorio`;
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(safeValue)) {
          errorMessage = "Este campo solo debe contener letras";
        }
        break;

      case "documentType":
        if (!safeValue) {
          errorMessage = "Selecciona un tipo de documento";
        }
        break;

      case "documentNumber":
      case "phone":
        if (!String(safeValue || "").trim()) {
          errorMessage = `El número es obligatorio`;
        } else if (!/^\d{10}$/.test(safeValue)) {
          errorMessage = "Debe contener 10 dígitos";
        }
        break;

      case "email":
        if (!String(safeValue || "").trim()) {
          errorMessage = "El correo electrónico es obligatorio";
        } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(safeValue)) {
          errorMessage = "Formato de correo electrónico inválido";
        }
        break;

      case "birthdate":
        if (!safeValue) {
          errorMessage = "La fecha de nacimiento es obligatoria";
        } else {
          const today = new Date();
          const birthDate = new Date(safeValue);
          if (birthDate >= today) {
            errorMessage = "La fecha debe ser en el pasado";
          } else {
            // Verificar edad mínima (18 años)
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              if (age - 1 < 18) {
                errorMessage = "Debe tener al menos 18 años";
              }
            } else if (age < 18) {
              errorMessage = "Debe tener al menos 18 años";
            }
          }
        }
        break;

      case "formationCenter":
        if (!safeValue) {
          errorMessage = "Selecciona un centro de formación";
        }
        break;

      default:
        break;
    }

    return errorMessage;
  } 
  // Si no se proporciona un campo específico, validar todos los campos
  else {
    let newErrors = {};
    
    // Campos con validación de texto (solo letras)
    const textFields = ["name", "lastName", "area", "senaVinculation", "competitionName", "rol", "strategyCompetition", "programName"];
    textFields.forEach(field => {
      if (!String(formData[field] || "").trim()) {
        newErrors[field] = `El campo es obligatorio`;
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData[field])) {
        newErrors[field] = "Este campo solo debe contener letras";
      }
    });
    
    // Campos numéricos (10 dígitos)
    const numericFields = ["documentNumber", "phone"];
    numericFields.forEach(field => {
      if (!String(formData[field] || "").trim()) {
        newErrors[field] = `El número es obligatorio`;
      } else if (!/^\d{10}$/.test(formData[field])) {
        newErrors[field] = "Debe contener 10 dígitos";
      }
    });
    
    // Validación de email
    if (!String(formData.email || "").trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Formato de correo electrónico inválido";
    }
    
    // Validación de fecha de nacimiento
    if (!formData.birthdate) {
      newErrors.birthdate = "La fecha de nacimiento es obligatoria";
    } else {
      const today = new Date();
      const birthDate = new Date(formData.birthdate);
      if (birthDate >= today) {
        newErrors.birthdate = "La fecha debe ser en el pasado";
      } else {
        // Verificar edad mínima (18 años)
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          if (age - 1 < 18) {
            newErrors.birthdate = "Debe tener al menos 18 años";
          }
        } else if (age < 18) {
          newErrors.birthdate = "Debe tener al menos 18 años";
        }
      }
    }
    
    // Campos de selección
    if (!formData.documentType) {
      newErrors.documentType = "Selecciona un tipo de documento";
    }
    
    if (!formData.formationCenter) {
      newErrors.formationCenter = "Selecciona un centro de formación";
    }
    
    return newErrors;
  }
};
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);  // Mark that changes have been made
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateField();
    setErrors(newErrors);

     // Verificar si hay errores de validación
     if (Object.values(newErrors).some(error => error !== "")) {
      message.error("Corrija los errores del formulario");
      return;
    }


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
        onClose(true);  // Pass true to indicate changes were made
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
      <label htmlFor="name" className="login__container-label">
      {label}
      </label>
      {errors[name] && <div className="error-message">{errors[name]}</div>}
    </div>
  );

const renderInput = ({ type = "text", name = "", placeholder = "" }) => (
  <div className="login__container--labelsubcontainer">
    <label htmlFor={name}>{placeholder}</label>
    <input
      type={type}
      name={name}
      id={name}
      placeholder=""
      value={formData[name]}
      onChange={handleChange}
      className={`login_container-userinput ${errors[name] ? "input-error" : ""}`}
    />      
    <label htmlFor="name" className="login__container-label">
    {placeholder}
    </label>
    {errors[name] && <div className="error-message">{errors[name]}</div>}
  </div>
);


  return (
    <div className="crear-experto">
        <button 
          type="button" 
          onClick={() => onClose(false)} 
          className="submit-button-aprendiz"
        >
         <GoChevronLeft /> Volver atrás
        </button>
      <h1 className="titulo_crear"><b>Aspirante:</b> {formData.name} {formData.lastName}</h1>
      
      <form onSubmit={handleSubmit} className="formulario_experto">
      {error && <div className="error-general">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

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
      </form>

      <div className="button-container">
        <button 
          type="submit" 
          className="select-aprendiz-button"
          disabled={isLoading}
          onClick={() => onClose(false)} 
        >
          {isLoading ? "Modificando..." : "Seleccionar competidor"}
        </button>

        <button 
          type="submit" 
          className="submit-button-save"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          <PiPencilSimpleLineFill /> 
          {isLoading ? "Modificando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};