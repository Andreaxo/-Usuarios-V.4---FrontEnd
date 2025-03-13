import './index.css';
import senaLogo from '../img/senaLogo.png';
import logoTR from '../img/logoTR.png';
import {useNavigate} from 'react-router-dom';

function Header() {

  const navigate = useNavigate();
  const navigateToLog = () => {
    navigate("/login"); 
};

  return (
  <>
    <header className="header">
      <div className="left-container">
        <img src={senaLogo} alt="Logo" className="logo1" />
        <img src={logoTR} alt="Logo" className="logo2" />
      </div>
      <div className="center-container">
        <nav>
          <ul className="menu">
            <li><button className="menu-btn">Inicio</button></li>
            <li><button className="menu-btn">Competiciones</button></li>
            <li><button className="menu-btn menu-btn1">Quiero Competir</button></li>
            <li><button className="menu-btn menu-btn2" onClick={()=> navigateToLog()} >Ingresar</button></li>
          </ul>
        </nav>
      </div>
      <div className="right-container"></div>
    </header>
  </>
  );
}

export default Header;
