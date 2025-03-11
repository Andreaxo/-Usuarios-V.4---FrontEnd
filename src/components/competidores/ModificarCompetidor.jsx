import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { message, Select } from "antd";
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

const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div className="login__container--labelsubcontainer">
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="login_container-userinput"
    />
  </div>
);

const SelectField = ({ label, name, options = [], value, onChange }) => (
  <div className="login__container--labelsubcontainer">
    <label htmlFor={name}>{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="login_container-userinput"
    >
      {options.length > 0 ? (
        options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))
      ) : (
        <option value="">No hay opciones</option>
      )}
    </select>
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
    strategyCompetition: expertData?.strategyCompetition || null
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
    birthdate: formData.birthdate,
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
  console.log(expertData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
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
        message.success("Competidor modificado exitosamente");
        if (onClose) {
          onClose();
        }
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

  useEffect(() => {
    if (competidorRef.current) {
      competidorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div ref={competidorRef} className="competidor-container">
      <h1 className="competidor-titulo">
        <span>Competidor: </span>
        <strong>{nombreOriginal} {apellidoOriginal}</strong>
      </h1>
      
      <div className="grid-container">
        <div className="column">
          <InputField 
            label="Nombre Completo" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
          />
          <InputField 
            label="Nombre Completo" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange}
          />
          
          <InputField 
            label="Correo electrónico" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
          />
          
          <InputField 
            label="Fecha de nacimiento" 
            name="birthdate" 
            value={formData.birthdate} 
            onChange={handleChange}
          />
          
          <SelectField 
            label="Programa de formación" 
            name="programName" 
            options={PROGRAMAS_FORMACION}
            value={formData.programName} 
            onChange={handleChange}
          />
          
          <SelectField 
            label="Centro de Formación" 
            name="formationCenter" 
            options={CENTROS_FORMACION}
            value={formData.formationCenter} 
            onChange={handleChange}
          />
          
          <InputField 
            label="Competición" 
            name="competitionName" 
            value={formData.competitionName} 
            onChange={handleChange}
          />
          
          <InputField 
            label="Número de teléfono" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
          />
        </div>
        
        <div className="column">
          <SelectField 
            label="Tipo de sangre" 
            name="bloodType" 
            options={TIPOS_SANGRE} 
            value={formData.bloodType} 
            onChange={handleChange}
          />
          
          <InputField 
            label="Ficha" 
            name="indexCourse" 
            value={formData.indexCourse} 
            onChange={handleChange}
          />
          
          <SelectField 
            label="Preferencia alimenticia" 
            name="dietPreferences" 
            options={PREFERENCIAS_DIETA} 
            value={formData.dietPreferences} 
            onChange={handleChange}
          />
          
          <SelectField 
            label="Estado de contrato(a)" 
            name="hiringStatus" 
            options={ESTADO_CONTRATACION} 
            value={formData.hiringStatus} 
            onChange={handleChange}
          />
          
          <InputField 
            label="Fecha de expedición de identificación" 
            name="documentDateOfissue" 
            value={formData.documentDateOfissue} 
            onChange={handleChange}
          />
          
          <InputField 
            label="Habilidad" 
            name="habilidad" 
            value={formData.habilidad} 
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="documentos-grid">
        <div className="column">
          <SelectField 
            label="Tipo de documento" 
            name="documentType" 
            options={TIPOS_DOCUMENTO}
            value={formData.documentType} 
            onChange={handleChange}
          />
        </div>
        
        <div className="column">
          <InputField 
            label="Número de documento" 
            name="documentNumber" 
            value={formData.documentNumber} 
            onChange={handleChange}
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
          />
          
          <InputField 
            label="Razón Social Empresa" 
            name="companyName" 
            value={formData.companyName} 
            onChange={handleChange}
          />
          
          <InputField 
            label="NIT Empresa" 
            name="nit" 
            value={formData.nit} 
            onChange={handleChange}
          />
        </div>
        
        <div className="column">
          <InputField 
            label="Jefe inmediato" 
            name="immediateBossName" 
            value={formData.immediateBossName} 
            onChange={handleChange}
          />
          
          <InputField 
            label="Teléfono Jefe inmediato" 
            name="bossPhone" 
            value={formData.bossPhone} 
            onChange={handleChange}
          />
          
          <InputField 
            label="Correo Jefe inmediato" 
            name="bossEmail" 
            value={formData.bossEmail} 
            onChange={handleChange}
          />
        </div>
      </div>

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

    </div>
  );
};