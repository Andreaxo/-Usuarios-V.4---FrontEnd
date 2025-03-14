import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { IoCloseOutline } from "react-icons/io5";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { ModificarCompetidor } from '../competidores/ModificarCompetidor';
import '../../styles/Competidores/StyleVerCompetidor.css';

// Constantes de datos
const TIPOS_DOCUMENTO = [
  { value: "CC", label: "Cédula de ciudadanía" },
  { value: "TI", label: "Tarjeta de identidad" },
  { value: "CE", label: "Cédula de extranjería" }
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

const formatearFechaParaInput = (fechaString) => {
  if (!fechaString) return '';
  
  if (fechaString.includes('T')) {
    const fecha = new Date(fechaString);
    return fecha.toISOString().split('T')[0];
  }
  
  if (fechaString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return fechaString;
  }
  
  const fecha = new Date(fechaString);
  if (isNaN(fecha.getTime())) return '';
  
  return fecha.toISOString().split('T')[0];
};

export const VerCompetidor = ({ onClose, expertData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const competidorRef = useRef(null);
  const [showModificar, setShowModificar] = useState(false);
  
  const [formData, setFormData] = useState({
    id: expertData?.id || '',
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
    strategyCompetition: expertData?.strategyCompetition || ''
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para el eliminar
  const handleDeleteCompetidor = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:3000/api/clientes/${formData.id}`);
      message.success("Competidor eliminado exitosamente");
      // Después de borrar, se cierra este componente y se indica que se hicieron cambios
      onClose(null, true);
    } catch (error) {
      console.error("Error deleting competitor:", error);
      message.error("Error al eliminar el competidor");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejador para abrir el componente de modificación
  const handleModificar = () => {
    setShowModificar(true);
  };
  
  // Manejador para cuando se completa la modificación
  const handleModificacionCompletada = (updatedData, changed = false) => {
    setShowModificar(false);
    // Si hubo cambios, cierra también el componente VerCompetidor y solicita actualización
    if (changed) {
      onClose(updatedData, true);
    }
  };
  
  useEffect(() => {
    if (competidorRef.current) {
      competidorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Componente InputField que sigue el diseño solicitado
  const InputField = ({ label, name, type = "text", value, readOnly = true }) => (
    <div className="login__container--labelsubcontainer">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        className="login_container-userinput"
        readOnly={readOnly}
      />
    </div>
  );

  // Componente SelectField que sigue el diseño solicitado
  const SelectField = ({ label, name, options, value, readOnly = true }) => (
    <div className="login__container--labelsubcontainer">
      <label htmlFor={name}>{label}</label>
      {readOnly ? (
        <input
          id={name}
          name={name}
          value={value}
          className="login_container-userinput"
          readOnly={true}
        />
      ) : (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className="login_container-userinput"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );

  // Si se está mostrando el componente ModificarCompetidor, renderizarlo
  if (showModificar) {
    return (
      <ModificarCompetidor 
        onClose={handleModificacionCompletada} 
        expertData={formData} 
      />
    );
  }

  return (
    <div ref={competidorRef} className="competidor-container">
      <h1 className="competidor-titulo">
        <span>Competidor: </span>
        <strong>{formData.name} {formData.lastName}</strong>
      </h1>
      
      <div className="grid-container">
        <div className="column">
          {/* Primera columna */}
          <InputField 
            label="Nombre Completo" 
            name="fullName" 
            value={`${formData.name} ${formData.lastName}`} 
          />
          
          <InputField 
            label="Correo electrónico" 
            name="email" 
            value={formData.email} 
          />
          
          <InputField 
            label="Fecha de nacimiento" 
            name="birthdate" 
            value={formData.birthdate} 
          />
          
          <InputField 
            label="Programa de formación" 
            name="programName" 
            value={formData.programName} 
          />
          
          <InputField 
            label="Centro de Formación" 
            name="formationCenter" 
            value={formData.formationCenter} 
          />
          
          <InputField 
            label="Competición" 
            name="competitionName" 
            value={formData.competitionName} 
          />
          
          <InputField 
            label="Número de teléfono" 
            name="phone" 
            value={formData.phone} 
          />
        </div>
        
        <div className="column">
          {/* Segunda columna */}
          <SelectField 
            label="Tipo de sangre" 
            name="bloodType" 
            options={TIPOS_SANGRE} 
            value={formData.bloodType} 
          />
          
          <InputField 
            label="Habilidad" 
            name="strategyCompetition" 
            value={formData.strategyCompetition} 
            onChange={handleChange}
          />

          <SelectField 
            label="Ficha" 
            name="indexCourse" 
            value={formData.indexCourse} 
          />
          
          <SelectField 
            label="Preferencia alimenticia" 
            name="dietPreferences" 
            options={PREFERENCIAS_DIETA} 
            value={formData.dietPreferences} 
          />
          
          <SelectField 
            label="Estado de contrato(a)" 
            name="hiringStatus" 
            options={ESTADO_CONTRATACION} 
            value={formData.hiringStatus} 
          />
          
          <InputField 
            label="Fecha de expedición de identificación" 
            name="documentDateOfissue" 
            value={formData.documentDateOfissue} 
          />
          
        </div>
      </div>
      
      <div className="documentos-grid">
        <div className="column">
          {/* Tercera sección - primera columna */}
          <InputField 
            label="Tipo de documento" 
            name="documentType" 
            value={formData.documentType} 
          />
        </div>
        
        <div className="column">
          {/* Tercera sección - segunda columna */}
          <InputField 
            label="Número de documento" 
            name="documentNumber" 
            value={formData.documentNumber} 
          />
        </div>
      </div>

      <h2 className="etapa-titulo">Modalidad de Etapa Productiva</h2>
      <br/>
      
      <div className="grid-container">
        <div className="column">
          {/* Sección etapa productiva - primera columna */}
          <InputField 
            label="Modalidad" 
            name="productiveStageModality" 
            value={formData.productiveStageModality} 
          />
          
          <InputField 
            label="Razón Social Empresa" 
            name="companyName" 
            value={formData.companyName} 
          />
          
          <InputField 
            label="NIT Empresa" 
            name="nit" 
            value={formData.nit} 
          />
        </div>
        
        <div className="column">
          {/* Sección etapa productiva - segunda columna */}
          <InputField 
            label="Jefe inmediato" 
            name="immediateBossName" 
            value={formData.immediateBossName} 
          />
          
          <InputField 
            label="Teléfono Jefe inmediato" 
            name="bossPhone" 
            value={formData.bossPhone} 
          />
          
          <InputField 
            label="Correo Jefe inmediato" 
            name="bossEmail" 
            value={formData.bossEmail} 
          />
        </div>
      </div>

      <div className="botones-container-competidor">
        <button 
          onClick={() => onClose(null, false)} 
          className="boton-cancelar-competidor"
        >
          <IoCloseOutline />
          Cancelar
        </button>
        
        <button 
          className="boton-modificar-competidor"
          onClick={handleModificar}
        >
          <PiPencilSimpleLineFill/>
          Modificar
        </button>
        
        <button 
          className="boton-eliminar-competidor"
          onClick={handleDeleteCompetidor}
          disabled={isLoading}
        >
          {isLoading ? "Eliminando..." : "Eliminar Competidor"}
        </button>
      </div>
    </div>
  );
};