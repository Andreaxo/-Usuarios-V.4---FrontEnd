import './index.css';
import worldSkillsInternacional from '../img/discovermore-slider-1.jpg'
import figure1 from '../img/figure2.png'
import {useNavigate} from 'react-router-dom';

function LogIn(){

    const navigate = useNavigate();
    const navigateToComp = () => {
      navigate("/elegirCompeticion"); 
  };

    const backHome = "< Volver al Home";
    return(
        <>
        <div className='container-login'>
            <div className='login__container'>
                <img src={figure1} className="login__container--figure1" alt="imagen de figura decorativa" />
                <img src={figure1} className="login__container--figure2" alt="imagen de figura decorativa" />
                <div className='login__container--login'>
                    <a href="#">{backHome}</a>
                    <h1>Ingresar al Sistema</h1>
                    <div className='login__container--labelsubcontainer standard-input-container'>
                        <label htmlFor="#">Correo electrónico</label>
                        <input type="text" className='login__container-userinput standard-input'/>
                    </div>
                    <div className='login__container--labelsubcontainer'>
                        <label htmlFor="#">Contraseña</label>
                        <input type="password" className='login__container-passwordinput' />
                    </div>
                    <div className='login__container-checkbox'><input type="checkbox" id='remember_me' name='_remember_me' /><label for="remember_me">Recuérdame</label></div>
                    <button className='login__container-submit btn1' type='submit' onClick={()=>navigateToComp()}>Ingresar</button>
                </div>
                <div className='login__container--img'>
                    <img src={worldSkillsInternacional} alt="Imagen de referencia de WorldSkills Internacional" />
                </div>
            </div>
        </div>
        </>
    );
}


export default LogIn;
