import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { message } from "antd";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import '../../styles/Competidores/StyleModificarCompetidor.css';

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

const TIPOS_SANGRE = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" }
];

const PREFERENCIAS_DIETA = [
  { value: "Normal", label: "Normal" },
  { value: "Vegetariano", label: "Vegetariano" },
  { value: "Vegano", label: "Vegano" },
  { value: "Sin gluten", label: "Sin gluten" }
];

const ESTADO_CONTRATACION = [
  { value: "Patrocinado", label: "Patrocinado" },
  { value: "No patrocinado", label: "No patrocinado" }
];

const MODALIDAD_ETAPA = [
  { value: "Contrato de aprendizaje", label: "Contrato de aprendizaje" },
  { value: "Pasantía", label: "Pasantía" },
  { value: "Monitoría", label: "Monitoría" }
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

const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div className="competitor-form__field">
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={`competitor-form__input ${error ? 'competitor-form__input--error' : ''}`}
    />
    <label htmlFor={name} className="competitor-form__label">{label}</label>
    {error && <span className="competitor-form__error-message">{error}</span>}
  </div>
);

const SelectField = ({ label, name, options = [], value, onChange, error }) => (
  <div className="competitor-form__field">
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`competitor-form__input ${error ? 'competitor-form__input--error' : ''}`}
    >
      <option value="">Seleccione una opción</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <label htmlFor={name} className="competitor-form__label">{label}</label>
    {error && <span className="competitor-form__error-message">{error}</span>}
  </div>
);

export const ModificarCompetidor = ({ onClose, expertData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const competidorRef = useRef(null);

  //Para guardar los nombres y que no cambien cuando lo estoy modificando.
  const [nombreOriginal, setNombreOriginal] = useState('');
  const [apellidoOriginal, setApellidoOriginal] = useState('');

  const [formData, setFormData] = useState({
    id: expertData?.id || '',
    rol: expertData?.rol || '',
    password: expertData?.password || '',
    name: expertData?.name || '',
    lastName: expertData?.lastName || '',
    documentType: expertData?.documentType || '',
    documentNumber: expertData?.documentNumber || '',
    documentDateOfissue: expertData?.documentDateOfissue || '',
    email: expertData?.email || '',
    birthdate: formatearFechaParaInput(expertData?.birthdate) || '',
    phone: expertData?.phone || '',
    programName: expertData?.programName || '',
    indexCourse: expertData?.indexCourse || '',
    formationCenter: expertData?.formationCenter || '',
    bloodType: expertData?.bloodType || '',
    dietPreferences: expertData?.dietPreferences || '',
    hiringStatus: expertData?.hiringStatus || '',
    productiveStageModality: expertData?.productiveStageModality || '',
    companyName: expertData?.companyName || '',
    nit: expertData?.nit || '',
    immediateBossName: expertData?.immediateBossName || '',
    bossEmail: expertData?.bossEmail || '',
    bossPhone: expertData?.bossPhone || '',
    competitionName: expertData?.competitionName || '',
    strategyCompetition: expertData?.strategyCompetition || null,
    habilidad: expertData?.habilidad || ''
  });

  // Se crea una constante para entregar los datos que se necesitan -> FormData manda un dato extra que no permitía el cambio.
  const dataToSend = {
    id: formData.id,
    rol: formData.rol,
    password: formData.password,
    name: formData.name,
    lastName: formData.lastName,
    documentType: formData.documentType,
    documentNumber: formData.documentNumber,
    documentDateOfissue: formData.documentDateOfissue,
    email: formData.email,
    birthdate: formatearFechaParaInput(formData?.birthdate),
    phone: formData.phone,
    area: formData.area,
    senaVinculation: formData.senaVinculation,
    permissions: formData.permissions,
    programName: formData.programName,
    indexCourse: formData.indexCourse,
    formationCenter: formData.formationCenter,
    bloodType: formData.bloodType,
    dietPreferences: formData.dietPreferences,
    hiringStatus: formData.hiringStatus,
    productiveStageModality: formData.productiveStageModality,
    companyName: formData.companyName,
    nit: formData.nit,
    immediateBossName: formData.immediateBossName,
    bossEmail: formData.bossEmail,
    bossPhone: formData.bossPhone,
    competitionName: formData.competitionName,
    photo_url: formData.photo_url,
    strategyCompetition: formData.strategyCompetition
  };

  useEffect(() => {
    if (expertData) {
      setNombreOriginal(expertData.name || '');
      setApellidoOriginal(expertData.lastName || '');
      setFormData(prev => ({
        ...prev,
        ...expertData,
        birthdate: formatearFechaParaInput(expertData.birthdate)
      }));
    }
  }, [expertData]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    rol: "",
    birthdate: "",
    documentNumber: "",
    email: "",
    phone: "",
    area: "",
    indexCourse: "",
    documentDateOfissue: "",
    competitionName: "",
    companyName: "" ,
    immediateBossName: "",
    bossEmail: "",
    bossPhone: "",
    nit: "",
    strategyCompetition: "", 
  });

// Función de validación actualizada para manejar diferentes tipos de valores de forma segura
const validateField = (name, value) => {
  let errorMessage = "";
  
  // Convertir el valor a string para usar trim() y otros métodos de string
  // Esto maneja null, undefined y valores no string como números
  const safeValue = value === null || value === undefined ? '' : String(value);

  switch (name) {
    case "name":
      if (!safeValue.trim()) {
        errorMessage = "El nombre es obligatorio";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(safeValue)) {
        errorMessage = "El nombre solo debe contener letras";
      }
      break;
    case "lastName":
      if (!safeValue.trim()) {
        errorMessage = "El apellido es obligatorio";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(safeValue)) {
        errorMessage = "El apellido solo debe contener letras";
      }
      break;
    case "rol":
      if (!safeValue.trim()) {
        errorMessage = "El rol es obligatorio";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(safeValue)) {
        errorMessage = "El rol solo debe contener letras";
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
      if (!safeValue.trim()) {
        errorMessage = "El número de documento es obligatorio";
      } else if (!/^\d+$/.test(safeValue)) {
        errorMessage = "El documento debe contener solo números";
      } else if (safeValue.length < 8 || safeValue.length > 12) {
        errorMessage = "El documento debe tener entre 8 y 12 dígitos";
      }
      break;
    case "documentDateOfissue":
        if (!safeValue) {
          errorMessage = "La fecha de expedición es obligatoria";
        } else {
          const today = new Date();
          const documentDateOfissue = new Date(safeValue);
          if (documentDateOfissue >= today) {
            errorMessage = "La fecha debe ser en el pasado";
          }
          // Verificar edad mínima (18 años)
          const age = today.getFullYear() - documentDateOfissue.getFullYear();
          const monthDiff = today.getMonth() - documentDateOfissue.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < documentDateOfissue.getDate())) {
            if (age - 1 < 18) {
              errorMessage = "Debe tener al menos 18 años";
            }
          } else if (age < 18) {
            errorMessage = "Debe tener al menos 18 años";
          }
        }
        break;
    case "email":
      if (!safeValue.trim()) {
        errorMessage = "El correo electrónico es obligatorio";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(safeValue)) {
          errorMessage = "Correo electrónico inválido";
        }
      }
      break;
    case "phone":
      if (!safeValue.trim()) {
        errorMessage = "El número de teléfono es obligatorio";
      } else if (!/^\d+$/.test(safeValue)) {
        errorMessage = "El teléfono debe contener solo números";
      } else if (safeValue.length < 7 || safeValue.length > 10) {
        errorMessage = "El teléfono debe tener entre 7 y 10 dígitos";
      }
      break;
    case "area":
      if (!safeValue.trim()) {
        errorMessage = "El área es obligatoria";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(safeValue)) {
        errorMessage = "El área solo debe contener letras";
      }
      break;
    case "indexCourse":
      if (!safeValue.trim()) {
        errorMessage = "La ficha es obligatoria";
      } else if (!/^\d+$/.test(safeValue)) {
        errorMessage = "La ficha solo debe contener números";
      }
      break;
    case "competitionName":
      if (!safeValue.trim()) {
        errorMessage = "El nombre de la competencia es obligatoria";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(safeValue)) {
        errorMessage = "La habilidad solo debe contener letras";
      }
      break;
    case "strategyCompetition":
      if (!safeValue.trim()) {
        errorMessage = "La habilidad es obligatoria";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(safeValue)) {
        errorMessage = "El nombre de la competencia solo debe contener letras";
      }
      break;
    case "nit":
      if (!safeValue.trim()) {
        errorMessage = "El nit es obligatorio";
      } else if (!/^\d+$/.test(safeValue)) {
        errorMessage = "El nit solo debe contener números";
      }
      break;
    case "companyName":
      if (!safeValue.trim()) {
        errorMessage = "La razón social es obligatorio";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(safeValue)) {
        errorMessage = "La razón social solo debe contener letras";
      }
      break;
    case "immediateBossName":
      if (!safeValue.trim()) {
        errorMessage = "El nombre del jefe inmediato es obligatorio";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(safeValue)) {
        errorMessage = "El nombre del jefe inmediato solo debe contener letras";
      }
      break;
    case "bossEmail":
      if (!safeValue.trim()) {
        errorMessage = "El email es obligatorio";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(safeValue)) {
          errorMessage = "Correo electrónico inválido";
        }
      }
      break;
    case "bossPhone":
      if (!safeValue.trim()) {
        errorMessage = "El número de teléfono es obligatorio";
      } else if (!/^\d+$/.test(safeValue)) {
        errorMessage = "El teléfono debe contener solo números";
      } else if (safeValue.length < 7 || safeValue.length > 10) {
        errorMessage = "El teléfono debe tener entre 7 y 10 dígitos";
      }
      break;
    case "documentType":
      if (!safeValue.trim()) {
        errorMessage = "El tipo de documento es obligatorio";
      }
      break;
    case "formationCenter":
      if (!safeValue.trim()) {
        errorMessage = "El centro de formación es obligatorio";
      }
      break;
    case "programName":
      if (!safeValue.trim()) {
        errorMessage = "El programa de formación es obligatorio";
      }
      break;
    case "bloodType":
      if (!safeValue.trim()) {
        errorMessage = "El tipo de sangre es obligatorio";
      }
      break;
    case "dietPreferences":
      if (!safeValue.trim()) {
        errorMessage = "La preferencia alimenticia es obligatoria";
      }
      break;
    case "hiringStatus":
      if (!safeValue.trim()) {
        errorMessage = "El estado de contratación es obligatorio";
      }
      break;
    case "productiveStageModality":
      if (formData.hiringStatus === "Patrocinado" && !safeValue.trim()) {
        errorMessage = "La modalidad de etapa productiva es obligatoria";
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

  // Función para validar todo el formulario antes de enviar
  const validateForm = () => {
    // Objeto para almacenar errores
    const newErrors = {};
    let isValid = true;
    
    // Campos obligatorios para validar
    const requiredFields = {
      name: "nombre",
      lastName: "apellido",
      documentType: "tipo de documento",
      documentNumber: "número de documento",
      documentDateOfissue: "fecha de expedición",
      email: "correo electrónico",
      birthdate: "fecha de nacimiento",
      phone: "teléfono",
      programName: "programa de formación",
      indexCourse: "ficha",
      formationCenter: "centro de formación",
      bloodType: "tipo de sangre",
      dietPreferences: "preferencia alimenticia",
      competitionName: "competición",
      strategyCompetition: "habilidad",
      hiringStatus: "estado de contratación"
    };
    
    // Validar campos obligatorios
    Object.entries(requiredFields).forEach(([field, label]) => {
      const value = formData[field];
      const errorMessage = validateField(field, value);
      
      if (errorMessage) {
        newErrors[field] = errorMessage;
        isValid = false;
      }
    });
    
    // Validar campos condicionales según el estado de contratación
    if (formData.hiringStatus === "Patrocinado") {
      const patrocinioFields = {
        productiveStageModality: "modalidad de etapa productiva",
        companyName: "razón social",
        nit: "NIT",
        immediateBossName: "jefe inmediato",
        bossEmail: "correo de jefe inmediato",
        bossPhone: "teléfono de jefe inmediato"
      };
      
      Object.entries(patrocinioFields).forEach(([field, label]) => {
        const value = formData[field];
        if (!value || String(value).trim() === "") {
          newErrors[field] = `El campo ${label} es obligatorio`;
          isValid = false;
        } else {
          const errorMessage = validateField(field, value);
          if (errorMessage) {
            newErrors[field] = errorMessage;
            isValid = false;
          }
        }
      });
    }
    
    // Actualizar el estado de errores
    setErrors(newErrors);
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      message.error("Por favor, corrija los errores del formulario antes de guardar");
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
        message.success("Competidor modificado exitosamente");
        // Notificar el cambio exitoso y enviar los datos actualizados
        onClose(response.data, true);
      }
    } catch (error) {
      console.error('Error al modificar:', error);
      message.error(
        error.response?.data?.message || 
        'Error al modificar el competidor'
      );
    } finally {
      setIsLoading(false);
    }
  };

  //Función para el eliminar
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:3000/api/clientes/${formData.id}`);
      message.success("Competidor eliminado exitosamente");
      // Después de borra, se cierra este componente y se refresca la lista
      onClose(formData, true);
    } catch (error) {
      console.error("Error deleting expert:", error);
      setError("Error al eliminar el experto");
      message.error(
        error.response?.data?.message || 
        'Error al eliminar el competidor'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Cerrar sin cambios
    onClose(null, false);
  };

  useEffect(() => {
    if (competidorRef.current) {
      competidorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div ref={competidorRef} className="competidor-container">
      <h1 className="competidor-titulo">
        <span>Competidor: </span>
        <strong>{formData.name} {formData.lastName}</strong>
      </h1>
      
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <h2 className="etapa-titulo">Datos personales</h2>
      <br/>
      <div className="grid-container">
        <div className="column">
          <InputField 
            label="Nombre Completo" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            error={errors.name}
          />

          <SelectField 
            label="Tipo de documento" 
            name="documentType" 
            options={TIPOS_DOCUMENTO}
            value={formData.documentType} 
            onChange={handleChange}
            error={errors.documentType}
          />

          <InputField 
            label="Fecha de expedición de identificación" 
            name="documentDateOfissue" 
            type="date"
            value={formData.documentDateOfissue} 
            onChange={handleChange}
            error={errors.documentDateOfissue}
          />
          
          <InputField 
            label="Correo electrónico" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            error={errors.email}
          />
        </div>
        
        <div className="column">
          <InputField 
            label="Apellido" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange}
            error={errors.lastName}
          />

          <InputField 
            label="Número de documento" 
            name="documentNumber" 
            value={formData.documentNumber} 
            onChange={handleChange}
            error={errors.documentNumber}
          />
          
          <InputField 
            label="Fecha de nacimiento" 
            name="birthdate" 
            type="date"
            value={formData.birthdate} 
            onChange={handleChange}
            error={errors.birthdate}
          />

          <InputField 
            label="Número de teléfono" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
            error={errors.phone}
          />
        </div>
      </div>


      <h2 className="etapa-titulo">Datos de formación</h2>
      <br/>
      <div className="grid-container">
        <div className="column">
          <SelectField 
            label="Centro de Formación" 
            name="formationCenter" 
            options={CENTROS_FORMACION}
            value={formData.formationCenter} 
            onChange={handleChange}
            error={errors.formationCenter}
          />
          
          <InputField 
            label="Ficha" 
            name="indexCourse" 
            value={formData.indexCourse} 
            onChange={handleChange}
            error={errors.indexCourse}
          />
        </div>

        <div className="column">
          <SelectField 
            label="Programa de formación" 
            name="programName" 
            options={PROGRAMAS_FORMACION}
            value={formData.programName} 
            onChange={handleChange}
            error={errors.programName}
          />
          
          <SelectField 
            label="Estado de contrato(a)" 
            name="hiringStatus" 
            options={ESTADO_CONTRATACION} 
            value={formData.hiringStatus} 
            onChange={handleChange}
            error={errors.hiringStatus}
          />
        </div>
      </div>
      

      <h2 className="etapa-titulo">Datos de competición</h2>
      <br/>
      <div className="grid-container">
        <div className="column">
          <InputField 
            label="Competición" 
            name="competitionName" 
            value={formData.competitionName} 
            onChange={handleChange}
            error={errors.competitionName}
          />
          
          <SelectField 
            label="Tipo de sangre" 
            name="bloodType" 
            options={TIPOS_SANGRE} 
            value={formData.bloodType} 
            onChange={handleChange}
            error={errors.bloodType}
          />
        </div>
        
        <div className="column">
          <InputField 
            label="Habilidad" 
            name="strategyCompetition" 
            value={formData.strategyCompetition} 
            onChange={handleChange}
            error={errors.strategyCompetition}
          />

          <SelectField 
            label="Preferencia alimenticia" 
            name="dietPreferences" 
            options={PREFERENCIAS_DIETA} 
            value={formData.dietPreferences} 
            onChange={handleChange}
            error={errors.dietPreferences}
          />
        </div>
      </div>
      
      <h2 className="etapa-titulo">Modalidad de Etapa Productiva</h2>
      <br/>
      <div className="grid-container">
        <div className="column">
          <SelectField 
            label="Modalidad" 
            name="productiveStageModality" 
            options={MODALIDAD_ETAPA}
            value={formData.productiveStageModality} 
            onChange={handleChange}
            error={errors.productiveStageModality}
          />
          
          <InputField 
            label="Jefe inmediato" 
            name="immediateBossName" 
            value={formData.immediateBossName} 
            onChange={handleChange}
            error={errors.immediateBossName}
          />
          
          <InputField 
            label="Correo Jefe inmediato" 
            name="bossEmail" 
            value={formData.bossEmail} 
            onChange={handleChange}
            error={errors.bossEmail}
          />
        </div>
        
        <div className="column">
          <InputField 
            label="Razón Social Empresa" 
            name="companyName" 
            value={formData.companyName} 
            onChange={handleChange}
            error={errors.companyName}
          />
          
          <InputField 
            label="Teléfono Jefe inmediato" 
            name="bossPhone" 
            value={formData.bossPhone} 
            onChange={handleChange}
            error={errors.bossPhone}
          />
          
          <InputField 
            label="NIT Empresa" 
            name="nit" 
            value={formData.nit} 
            onChange={handleChange}
            error={errors.nit}
          />
        </div>
      </div>

      <div className="button-container-competidor">
        <button 
          type="button" 
          className="select-button-competidor"
          onClick={handleCancel} 
        >
          Cancelar
        </button>

        <button 
          type="submit" 
          className="save-button-competidor"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          <PiPencilSimpleLineFill /> 
          {isLoading ? "Modificando..." : "Guardar"}
        </button>

        <button 
          type="submit" 
          className="delete-button-competidor"
          disabled={isLoading}
          onClick={handleDelete}
        >
          {isLoading ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </div>
  );
};