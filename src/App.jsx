import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
/* Imporrt de paginas css */
import './styles/root.css';
import Menu from './modules/Menu';
import Home from './modules/Home';

/* import de los componetes */
import ShowSkills from './modules/skills/showSkills';
import ShowCompetitions from './modules/competitions/showCompetitions';
import DetailSkill from './modules/skills/detailsSkill';
import ExitSystem from './modules/menus/singOut';
import LogIn from './modules/LogIn/index';

/* Import componentes de usuarios */
import { ListadoExpertos } from "./components/expertos/ListadoExpertos";
import { ListadoAprendiz } from "./components/aprendiz/ListadoAprendiz";
import { ListadoCompetidor } from "./components/competidores/ListadoCompetidor";

function App() {

  return (
    <Router>
      <Routes>
        {/* Redirigir la ruta raíz a /lista */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LogIn />} />
        <Route path="/elegirCompeticion" element={<ShowCompetitions/>} />
        {/* Rutas principales */}
        <Route path="/listadoExpertos" element={<ListadoExpertos />} />
        <Route path="/listadoAprendiz" element={<ListadoAprendiz />} />
        <Route path="/listadoCompetidores" element={<ListadoCompetidor/>}/>

        {/* Ruta para manejar 404 - páginas no encontradas */}
        <Route path="*" element={<div>Página no encontrada</div>} />
        
        <Route path="/habilidades" element={ <><ExitSystem/><ShowSkills /> </>} />
        <Route path="/habilidadElegida" element={<DetailSkill />} />
        <Route path="/competencias" element={<><ExitSystem/><ShowCompetitions /> </>} />

      </Routes>
    </Router>
  );
}

export default App


