import axios from "axios";
import { useState } from "react";
import '../../styles/Expertos/StyleCrearExperto.css';
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { GoChevronLeft } from "react-icons/go";
import { message } from "antd";

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

export const CrearExperto = ({ onClose }) => {

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    lastName: "",
    rol: "",
    birthdate: "",
    documentType: "Cédula de ciudadanía",
    documentNumber: "",
    email: "",
    phone: "",
    bloodType: "O+",
    dietPreferences: "Ninguna",
    area: "",
    formationCenter: "Centro de Diseño e Innovación Tecnológica Industrial",
    senaVinculation: "",
    competitionName: ""
  });

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
    competitionName: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          errorMessage = "El nombre es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El nombre solo debe contener letras";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          errorMessage = "El apellido es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El apellido solo debe contener letras";
        }
        break;
      case "rol":
        if (!value.trim()) {
          errorMessage = "El rol es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El rol solo debe contener letras";
        }
        break;
      case "birthdate":
        if (!value) {
          errorMessage = "La fecha de nacimiento es obligatoria";
        } else {
          const today = new Date();
          const birthDate = new Date(value);
          if (birthDate >= today) {
            errorMessage = "La fecha debe ser en el pasado";
          }
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
        break;
      case "documentNumber":
        if (!value.trim()) {
          errorMessage = "El número de documento es obligatorio";
        } else if (!/^\d+$/.test(value)) {
          errorMessage = "El documento debe contener solo números";
        } else if (value.length < 8 || value.length > 12) {
          errorMessage = "El documento debe tener entre 8 y 12 dígitos";
        }
        break;
      case "email":
        if (!value.trim()) {
          errorMessage = "El correo electrónico es obligatorio";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = "Correo electrónico inválido";
          }
        }
        break;
      case "phone":
        if (!value.trim()) {
          errorMessage = "El número de teléfono es obligatorio";
        } else if (!/^\d+$/.test(value)) {
          errorMessage = "El teléfono debe contener solo números";
        } else if (value.length < 7 || value.length > 10) {
          errorMessage = "El teléfono debe tener entre 7 y 10 dígitos";
        }
        break;
      case "area":
        if (!value.trim()) {
          errorMessage = "El área es obligatoria";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El área solo debe contener letras";
        }
        break;
      case "senaVinculation":
        if (!value.trim()) {
          errorMessage = "La vinculación SENA es obligatoria";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "La vinculación SENA solo debe contener letras";
        }
        break;
      case "competitionName":
        if (!value.trim()) {
          errorMessage = "La habilidad es obligatoria";
        }else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "La habilidad solo debe contener letras";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Validación en tiempo real
    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validar todos los campos
    Object.keys(formData).forEach(field => {
      if (field !== 'id' && field !== 'bloodType' && field !== 'dietPreferences' && 
          field !== 'documentType' && field !== 'formationCenter') {
        const errorMessage = validateField(field, formData[field]);
        if (errorMessage) {
          newErrors[field] = errorMessage;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      message.error("Corrija los errores del formulario");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await axios.post('http://localhost:3000/api/clientes', formData);
      
      setSuccessMessage("Experto creado exitosamente");
      console.log('Respuesta del servidor:', response.data);
      onClose(formData, true);
      
      // Limpiar el formulario después de éxito
      setFormData({
        id: 0,
        name: "",
        lastName: "",
        rol: "",
        birthdate: "",
        documentType: "Cédula de ciudadanía",
        documentNumber: "",
        email: "",
        phone: "",
        bloodType: "O+",
        dietPreferences: "Ninguna",
        area: "",
        formationCenter: "Centro de Diseño e Innovación Tecnológica Industrial",
        senaVinculation: "",
        competitionName: ""
      });

      console.log('Información: ', response.data);

    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Hubo un error al crear el experto'
      );
      console.error('Error detallado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelect = ({ label, name, options }) => (
    <div className="input-group">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="form-select"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderInput = ({ type = "text", name, placeholder }) => (
    <div className="input-container" style={{ position: 'relative' }}>
      <input
        type={type}
        name={name}
        placeholder=" "
        value={formData[name]}
        onChange={handleChange}
        className={`form-input ${errors[name] ? 'input-error' : ''}`}
        readOnly={false}
      />
      <span>{placeholder}</span>
      {errors[name] && <div className="error-message">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="create-expert-container">
      <button type="button" onClick={onClose} className="submit-button-expert">
        <GoChevronLeft />Volver atrás
      </button>

      <div className="titulo_create">
        <h1>Crear Experto</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="formulario_experto">
        {error && <div className="error-general">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        {renderInput({ name: "name", placeholder: "Nombre" })}
        {renderInput({ name: "lastName", placeholder: "Apellido" })}
        {renderInput({ name: "rol", placeholder: "Rol" })}
        {renderInput({ 
          type: "date", 
          name: "birthdate", 
          placeholder: "Fecha de nacimiento" 
        })}
        
        {renderSelect({
          label: "Tipo de documento ",
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

        <div className="button-container">
          <button 
            type="submit" 
            className="submit-button-guardar"
            disabled={isLoading}
          >
            <PiPencilSimpleLineFill /> 
            {isLoading ? "Creando..." : "Crear Experto"}
          </button>
        </div>
      </form>
    </div>
  );
};