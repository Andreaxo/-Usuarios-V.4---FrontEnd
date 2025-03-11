import axios from "axios";
import { useState } from "react";
import '../../styles/Expertos/StyleCrearExperto.css';


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

export const CrearAprendiz = ( { onClose } ) => {
    
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        rol: "Aprendiz",
        birthdate: "",
        documentType: "Cédula de ciudadanía",
        documentNumber: "",
        email: "",
        phone: "",
        area: "",
        formationCenter: "Centro de Diseño e Innovación Tecnológica Industrial",
        competitionName: "",
        programName: "",
        indexCourse: 0,
        strategyCompetition: "",
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");
    window.location.reload();

    try {
      const response = await axios.post('http://localhost:3000/api/clientes', formData);
      
      setSuccessMessage("Experto creado exitosamente");
      console.log('Respuesta del servidor:', response.data);
      
      // Limpiar el formulario después de éxito
      setFormData({
        name: "",
        rol: "Aprendiz",
        birthdate: "",
        documentType: "Cédula de ciudadanía",
        documentNumber: "",
        email: "",
        phone: "",
        area: "",
        formationCenter: "Centro de Diseño e Innovación Tecnológica Industrial",
        competitionName: "",
        programName: "",
        indexCourse: 0,
        strategyCompetition: "",
      });

      console.log('Información: ', response.data);

    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Hubo un error al crear el aprendiz'
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
        value={formData[name] || ""}
        onChange={handleChange}
        className="form-select"
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
  
  const renderInput = ({ type = "text", name = "", placeholder = "", hidden = false}) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={formData[name] || ""}
      onChange={handleChange}
      className="form-input"
      style={{ display: hidden ? 'none' : 'block' }}
    />
  );

  return (
    <div className="crear-experto">
      <h1 className="titulo_crear">Crear Experto</h1>
      
      <form onSubmit={handleSubmit} className="formulario_experto">
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
        {renderInput({ 
          name: "rol", 
          placeholder: "Rol",
          hidden: true
        })}

        <br/>
        <button type="submit" className="submit-button">
          Crear Aprendiz
        </button>
        
        <button type="button" onClick={onClose} className="submit-button">
          X
        </button>
      </form>
    </div>
  );
};