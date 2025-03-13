import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { IoCloseOutline } from "react-icons/io5";

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
  const [showPopup, setShowPopup] = useState(false);
  const [documentos, setDocumentos] = useState({
    documentoIdentidad: null,
    hojaVida: null,
    certificadoMedico: null
  });

  const competidorRef = useRef(null);
  
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
    strategyCompetition: expertData?.strategyCompetition || '',
    habilidad: expertData?.habilidad || ''
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setDocumentos(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id) {
      message.error('ID no encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/clientes/${formData.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        message.success("Competidor consultado exitosamente");
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error al consultar:', error);
      message.error(
        error.response?.data?.message || 
        'Error al consultar el competidor'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocuments = async (e) => {
    e.preventDefault();
    
    // Verificar que al menos un documento haya sido seleccionado
    if (!documentos.documentoIdentidad && !documentos.hojaVida && !documentos.certificadoMedico) {
      message.warning('Por favor seleccione al menos un documento para subir');
      return;
    }
    
    setIsLoading(true);
    
    // Crear un FormData para enviar los archivos
    const formDataToSend = new FormData();
    if (documentos.documentoIdentidad) {
      formDataToSend.append('documentoIdentidad', documentos.documentoIdentidad);
    }
    if (documentos.hojaVida) {
      formDataToSend.append('hojaVida', documentos.hojaVida);
    }
    if (documentos.certificadoMedico) {
      formDataToSend.append('certificadoMedico', documentos.certificadoMedico);
    }
    formDataToSend.append('competidorId', formData.id);
    
    try {
      // Simulamos la carga (reemplazar con llamada API real)
      setTimeout(() => {
        message.success('Documentos subidos exitosamente');
        setIsLoading(false);
        togglePopup();
      }, 1500);
      
      // EN ESTE PUNTO FLATA QUE ANDRÉS COLOQUE SU ENDPOINT DE DOCUMENTOS
      
      const response = await axios.post(
        'http://localhost:3000/api/documentos/upload',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data) {
        message.success('Documentos subidos exitosamente');
        togglePopup();
      }
      
    } catch (error) {
      console.error('Error al subir documentos:', error);
      message.error(
        error.response?.data?.message || 
        'Error al subir los documentos'
      );
    } finally {
      setIsLoading(false);
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

  // Componente FileInputField para el popup
  const FileInputField = ({ label, name, accept = ".pdf,.doc,.docx" }) => (
    <div className="document-upload-field">
      <label>{label}</label>
      <input
        type="file"
        name={name}
        onChange={handleFileChange}
        accept={accept}
        className="document-file-input"
      />
      {documentos[name] && (
        <p className="selected-file">
          {documentos[name].name}
        </p>
      )}
    </div>
  );

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
          
          <InputField 
            label="Habilidad" 
            name="habilidad" 
            value={formData.habilidad} 
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


      <div className="botones-container">
      <button 
         onClick={onClose} 
         className="boton-accion boton-cancelar"
          >
           <IoCloseOutline />
           Cancelar
            </button>

        <button className="boton-accion boton-subir" onClick={togglePopup}>
          <span>Subir documentación</span>
        </button>
        
        <button className="boton-accion boton-modificar">
          <span>Modificar</span>
        </button>
        
        <button className="boton-accion boton-eliminar">
          Eliminar Competidor
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Subir Documentación</h2>
            <p>Por favor seleccione los archivos para el competidor <strong>{formData.name} {formData.lastName}</strong></p>
            
            <form onSubmit={handleUploadDocuments} className="document-upload-form">
              <FileInputField 
                label="Documento de Identidad" 
                name="documentoIdentidad"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              
              <FileInputField 
                label="Hoja de Vida" 
                name="hojaVida" 
              />
              
              <FileInputField 
                label="Certificado Médico" 
                name="certificadoMedico" 
              />
              
              <div className="popup-buttons">
                <button 
                  type="button"
                  onClick={togglePopup}
                  className="boton-accion boton-cancelar"
                >
                  Cancelar
                </button>


                <button 
                  type="submit"
                  className="boton-accion boton-subir"
                  disabled={isLoading}
                >
                  {isLoading ? 'Subiendo...' : 'Subir Documentos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};