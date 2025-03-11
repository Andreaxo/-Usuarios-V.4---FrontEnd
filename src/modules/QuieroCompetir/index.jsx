import React, { useState } from "react";
import "./index.css";
import figure1 from "../img/figure2.png";

function QuieroCompetir() {
  
  const [ formData, setFormData ] = useState({
    name: "",
    lastname: "",
    phone: "",
    documentType: "",
    documentNumber: "",
    email: "",
    birthday: "",
    indexCourse: "",
    programName: "",
    formationCenter: "",
    competition: "",
    skill: ""
  });

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch("http://localhost:4000/api/formulario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Formulario enviado exitosamente: ", data);
      alert("Formulario enviado exitosamente");
    } catch(error){
      console.error("Ha habido un error: ", error);
      alert("Ha habido un error, intentalo de nuevo");
    }
  }

  return (
    <div className="formulario__container">
      <img
        src={figure1}
        className="formulario__container--figure1"
        alt="imagen decorativa"
      />
      <img
        src={figure1}
        className="formulario__container--figure2"
        alt="imagen decorativa"
      />
      <div className="formulario__container--formulario">
        <a href="#">&lt; Volver al Home</a>
        <h1>Envía tu solicitud</h1>
        <form onSubmit={handleSubmit}>
          <div className="formulario__division1 formulario__division">
            <div className="formulario__container--labelsubcontainer standard-input-container">
              <div className="formulario__division3 formulario__division">
                <div className="formulario__container--labelsubcontainer">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="formulario__container-userinput standard-input"
                  />
                </div>
                <div className="formulario__container--labelsubcontainer">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="formulario__container-userinput standard-input"
                  />
                </div>
              </div>
            </div>
            <div className="formulario__division3 formulario__division">
              <div className="formulario__container--labelsubcontainer">
                <label>Tipo de documento *</label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="formulario__container-passwordinput"
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                </select>
              </div>
              <div className="formulario__container--labelsubcontainer">
                <label>Número de documento *</label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  className="formulario__container-passwordinput"
                  required
                />
              </div>
            </div>
            <div className="formulario__division3 formulario__division">
              <div className="formulario__container--labelsubcontainer">
                <label>Fecha de nacimiento *</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="formulario__container-passwordinput"
                  required
                />
              </div>
              <div className="formulario__container--labelsubcontainer">
                <label>N° de Ficha *</label>
                <input
                  type="number"
                  name="indexCourse"
                  value={formData.indexCourse}
                  onChange={handleChange}
                  className="formulario__container-passwordinput"
                  required
                />
              </div>
            </div>
            <div className="formulario__container--labelsubcontainer standard-input-container">
              <label>Programa de formación *</label>
              <input
                type="text"
                name="programName"
                value={formData.programName}
                onChange={handleChange}
                className="formulario__container-userinput standard-input"
                required
              />
            </div>
            <div className="formulario__container--labelsubcontainer standard-input-container">
              <label>Centro de formación *</label>
              <input
                type="text"
                name="formationCenter"
                value={formData.formationCenter}
                onChange={handleChange}
                className="formulario__container-passwordinput"
                required
              />
            </div>
            <div className="formulario__division3 formulario__division">
              <div className="formulario__container--labelsubcontainer">
                <label>Competición *</label>
                <select
                  className="formulario__container-passwordinput"
                  name="competition"
                  value={formData.competition}
                  onChange={handleChange}
                  required
                >
                    <option value="">Seleccione</option>
                  <option value="CC">Opción 1</option>
                  <option value="TI">Opción 2</option>
                  <option value="TI">Opción 3</option>
                </select>
              </div>
              <div className="formulario__container--labelsubcontainer">
                <label>Habilidad *</label>
                <select
                  className="formulario__container-userinput standard-input"
                  name="skill"
                  value={formData.skill}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="TI">Opción 1</option>
                  <option value="TI">Opción 2</option>
                  <option value="TI">Opción 3</option>
                </select>
                
              </div>
            </div>
            <button className="formulario__container-submit btn1" type="submit">
              Enviar solicitud
            </button>
            <h2>Cada aprendiz solo puede enviar una solicitud por competencia</h2>
          </div>
          <div className="formulario_division2 formulario__division">
            <div className="formulario__container--labelsubcontainer">
              <label>Número de teléfono *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="formulario__container-userinput standard-input"
                required
              />
            </div>
            <div className="formulario__container--labelsubcontainer">
              <label>Correo electrónico *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="formulario__container-passwordinput"
                required
              />
            </div>
          </div>
        </form>
      </div>
      <div className="banner__perspective--text">
        <h1 id="banner__container--title">
          Impulsa<br />tu talento
        </h1>
      </div>
    </div>
  );
}

export default QuieroCompetir;
