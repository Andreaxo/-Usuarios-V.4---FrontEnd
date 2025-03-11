import '../style/root.css';
import Footer from '../Footer';
import BannerCompeticiones from './BannerCompeticiones';
import CategoriasCompeticiones from './CategoriasCompeticiones';

function Competiciones() {
    return (
    <>
        <BannerCompeticiones />
        <CategoriasCompeticiones />
        <Footer />
    </>
    );
  }
  
  export default Competiciones;