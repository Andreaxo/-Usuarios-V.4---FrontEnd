import axios from "axios";
import { useState, useEffect } from "react";
import { message } from "antd";
import '../../styles/Expertos/StyleModificarExperto.css';
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { GoChevronLeft } from "react-icons/go";

const TIPOS_DOCUMENTO = [
  { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
  { value: "Tarjeta de identidad", label: "Tarjeta de identidad" },
  { value: "Cédula de extranjería", label: "Cédula de extranjería" }
];

const TIPOS_SANGRE = [
  { value: "O-", label: "O-" },
  { value: "O+", label: "O+" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B-", label: "B-" },
  { value: "B+", label: "B+" },
  { value: "AB-", label: "AB-" },
  { value: "AB+", label: "AB+" }
];

const PREFERENCIAS_ALIMENTARIAS = [
  { value: "Vegetariano", label: "Vegetariano" },
  { value: "Vegano", label: "Vegano" },
  { value: "Ninguna", label: "Ninguna" }
];

const CENTROS_FORMACION = [
  { value: "Centro Atención Sector Agropecuario", label: "Centro Atención Sector Agropecuario" },
  { value: "Centro de Diseño e Innovación Tecnológica Industrial", label: "Centro de Diseño e Innovación Tecnológica Industrial" },
  { value: "Centro de comercio y servicios", label: "Centro de comercio y servicios" }
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

export const ModificarExperto = ({ onClose, expertData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Asegurarse de que el ID se capture correctamente
  const [formData, setFormData] = useState({
    id: expertData?.id || '',
    name: expertData?.name || "",
    lastName: expertData?.lastName || "",
    rol: expertData?.rol || "",
    documentType: expertData?.documentType || "",
    documentNumber: expertData?.documentNumber || "",
    documentDateOfissue: expertData?.documentDateOfissue || "",
    email: expertData?.email || "",
    birthdate: formatearFechaParaInput(expertData?.birthdate) || "",
    phone: expertData?.phone || "",
    area: expertData?.area || "",
    senaVinculation: expertData?.senaVinculation || "",
    formationCenter: expertData?.formationCenter || "",
    bloodType: expertData?.bloodType || "",
    dietPreferences: expertData?.dietPreferences || "",
    competitionName: expertData?.competitionName || "",
  });

  // Actualizar useEffect para manejar mejor el ID
  useEffect(() => {
    if (expertData) {
      console.log("ID recibido:", expertData.id);
      setFormData(prev => ({
        ...prev,
        id: expertData?.id || '', 
        name: expertData?.name || "",
        lastName: expertData?.lastName || "",
        rol: expertData?.rol || "",
        documentType: expertData?.documentType || "",
        documentNumber: expertData?.documentNumber || "",
        documentDateOfissue: expertData?.documentDateOfissue || "",
        email: expertData?.email || "",
        birthdate: formatearFechaParaInput(expertData?.birthdate) || "",
        phone: expertData?.phone || "",
        area: expertData?.area || "",
        senaVinculation: expertData?.senaVinculation || "",
        formationCenter: expertData?.formationCenter || "",
        bloodType: expertData?.bloodType || "",
        dietPreferences: expertData?.dietPreferences || "",
        competitionName: expertData?.competitionName || "",
      }));
    }
  }, [expertData]);

  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    rol: "",
    birthdate: "",
    documentType: "",
    documentNumber: "",
    email: "",
    phone: "",
    area: "",
    senaVinculation: "",
    formationCenter: "",
    competitionName: ""
  });

  const [successMessage, setSuccessMessage] = useState("");

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
      const textFields = ["name", "lastName", "area", "senaVinculation", "competitionName", "rol"];
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

  // Función actualizada para manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Validar el campo modificado
    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
    
    // Registrar que se han realizado cambios
    setHasChanges(true);
  };

  // Función actualizada para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos a la vez
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
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        message.success("Experto modificado exitosamente");
        // Notificamos que hubo cambios y cerramos el modal
        onClose(formData, true);
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

  const handleDelete = async() => {
    setIsLoading(true);
    try{
        await axios.delete(`http://localhost:3000/api/clientes/${formData.id}`);
        message.success('Experto eliminado exitosamente');
        // Notificamos que hubo cambios y cerramos el modal
        onClose(formData, true);
    } catch (error) {
        console.error('Error:', error);
        message.error('Error al eliminar el experto');
    } finally {
      setIsLoading(false);
    }
  };

  // Componente para renderizar inputs con label flotante
  const renderInput = ({ type = "text", name = "", placeholder = "" }) => (
    <div className="view-expert-input-group">
      <input
        type={type}
        name={name}
        id={name}
        value={formData[name] || ""}
        onChange={handleChange}
        className={`view-expert-form-input ${errors[name] ? "input-error" : ""}`}
        placeholder=" "
      />
      <label htmlFor={name} className="view-expert-form-label">
        {placeholder}
      </label>
      {errors[name] && <div className="error-message">{errors[name]}</div>}
    </div>
  );

  // Componente para renderizar selects con label flotante
  const renderSelect = ({ label, name, options }) => (
    <div className="view-expert-input-group">
      <select
        id={name}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        className={`view-expert-form-select ${errors[name] ? "input-error" : ""}`}
      >
        <option value=""></option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor={name} className="view-expert-form-label">
        {label}
      </label>
      {errors[name] && <div className="error-message">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="view-expert-edit-container">
      <button type="button" onClick={() => onClose(null, false)} className="back-button-experto"><GoChevronLeft />Volver atrás</button>

      <h1 className="expert-title-edit"><b>Modificar Experto Regional: </b> {formData.name} {formData.lastName}</h1>
      
      <form onSubmit={handleSubmit} className="expert-form-edit">
        {error && <div className="error-general">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <input 
          type="hidden" 
          name="id" 
          value={formData.id} 
        />

        {renderInput({ name: "name", placeholder: "Nombre" })}
        {renderInput({ name: "lastName", placeholder: "Apellido" })}
        {renderInput({ name: "rol", placeholder: "Rol" })}
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
          label: "Tipo de Sangre",
          name: "bloodType",
          options: TIPOS_SANGRE
        })}
        
        {renderSelect({
          label: "Preferencias alimentarias",
          name: "dietPreferences",
          options: PREFERENCIAS_ALIMENTARIAS
        })}
        
        {renderInput({ name: "area", placeholder: "Área" })}
        
        {renderSelect({
          label: "Centro de formación",
          name: "formationCenter",
          options: CENTROS_FORMACION
        })}
        
        {renderInput({ 
          name: "senaVinculation", 
          placeholder: "Vinculación SENA" 
        })}
        
        {renderInput({ name: "competitionName", placeholder: "Habilidad" })}

        <div className="button-container-edit">
          <button 
            type="submit" 
            className="edit-experto-button"
            disabled={isLoading}
          >
            <PiPencilSimpleLineFill /> 
            {isLoading ? "Modificando..." : "Guardar"}
          </button>
        
          <button 
            type="button" 
            className="delete-expert-button"
            disabled={isLoading}
            onClick={handleDelete} 
          >
            {isLoading ? "Eliminando..." : "Eliminar competidor"}
          </button>
        </div>
      </form>
    </div>
  );
};