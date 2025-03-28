import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import '../../styles/Eventos/StyleEventos.css';

export const CrearEvento = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState({
        id: 0,
        nameEvent: "",
        descriptionEvent: "",
        dateEvent: ""
    });

    const [errors, setErrors] = useState({
        nameEvent: "",
        descriptionEvent: "",
        dateEvent: ""
    });

    const validateField = (name, value) => {
        const safeValue = value === null || value === undefined ? '' : String(value).trim();
        let errorMessage = "";

        switch (name) {
            case "nameEvent":
                if (!safeValue) {
                    errorMessage = "El nombre del evento es obligatorio";
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(safeValue)) {
                    errorMessage = "El nombre solo debe contener letras";
                }
                break;
            case "descriptionEvent":
                if (!safeValue) {
                    errorMessage = "La descripción del evento es obligatoria";
                }
                break;
            case "dateEvent":
                if (!safeValue) {
                    errorMessage = "La fecha del evento es obligatoria";
                } else {
                    const eventDate = new Date(safeValue);
                    const today = new Date();
                    if (eventDate < today) {
                        errorMessage = "La fecha debe ser en el futuro";
                    }
                }
                break;
            default:
                break;
        }

        return errorMessage;
    };

    // Este es el manejador de cambios, asegúrate de que actualice el estado correctamente
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validaciones específicas por campo
        let processedValue = value;
        
        if (name === 'nameEvent') {
            // Permitir solo letras y espacios
            processedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: processedValue
        }));

        // Limpiar el error del campo cuando se escribe
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        const requiredFields = ["nameEvent", "descriptionEvent", "dateEvent"];

        requiredFields.forEach((field) => {
            const value = formData[field];
            const errorMessage = validateField(field, value);
            if (errorMessage) {
                newErrors[field] = errorMessage;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            message.error("Por favor, corrija los errores del formulario antes de guardar");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const responseEventos = await axios.post('http://localhost:3000/api/eventos', formData);
            message.success("Evento creado exitosamente");
            console.log(responseEventos)
            
            onClose(responseEventos.data, true);
        } catch (error) {
            console.error('Error al crear:', error);
            message.error(
                error.responseEventos?.data?.message
            );
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleCancel = () => {
        onClose(null, false);
    };

    return (
        <div className="competidor-container">
            <h1 className="competidor-titulo">Crear Nuevo Evento</h1>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

        <form onSubmit={handleSubmit} className="formulario_experto">
        {error && <div className="error-general">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        
        {renderInput({ name: "nameEvent", placeholder: "Nombre del Evento" })}
        {renderInput({ name: "descriptionEvent", placeholder: "Descripción del evento" })}
        {renderInput({ type: "date", name: "dateEvent", placeholder: "Fecha del Evento" })}

            </form>

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
                    {isLoading ? "Creando..." : "Crear Evento"}
                </button>
            </div>
        </div>
    );
};
