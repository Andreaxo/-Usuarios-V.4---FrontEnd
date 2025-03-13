import './index.css';
import logoTR from '../img/logoTR-green.png';
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <>
        <div id='footer-container'>
            <img id="footer-logo" src={logoTR} alt="logo" />
                <div className='footer-talentoRisaralda'>
                    <h1>Talento Risaralda</h1>
                    <a href="#">Home</a>
                    <a href="#">Competiciones</a>
                    <a href="#">Quiero Competir</a>
                    <a href="#">Ingresar al sistema</a>
                </div>
                <div className='footer-competiciones'>
                    <h1>Competiciones</h1>
                    <a href="#">World Skills</a>
                    <a href="#">Sena Soft</a>
                    <a href="#">Acme Skills</a>
                </div>
                <div className='footer-redesSociales'>
                    <h1>Redes Sociales</h1>
                    <a href="#"><FaFacebookF />Facebook</a>
                    <a href="#"><FaXTwitter /> X</a>
                    <a href="#"><FaInstagram /> Instagram</a>
                    <a href="#"><FaTiktok /> TikTok</a>
                </div>
        </div>
    </>
  );
}

export default Footer;
