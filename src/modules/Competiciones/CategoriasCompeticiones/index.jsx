import Header from '../../Header';
import './index.css';
import figure2 from '../../img/figure2.png';
import figure3 from '../../img/img-category.jpg';


function SliderCompeticiones() {
  const seleccione = "> Selecciona una categoría";
    return (
  <>
    <div id="slidercompeticiones">
    </div>
    <div className="slidercompeticiones-container">
      <div className="slidercompeticiones-subcontainer">
        <select className="select">
          <option>{seleccione}</option>
          <option>World Skills</option>
          <option>Sena Soft</option>
          <option>AcmeSkills</option>
        </select>
        <input type="text" placeholder="Buscar una habilidad" className="searchskills" />
      </div>
    </div>
    <img src={figure2} alt="decoration 3" className='decoration3 decoration'/>
    <div>
    <div className="slidercompeticiones-skills">
      <div className='slidercompeticiones-skill'>
        <img src={figure3} alt="Imagen representativa de la habilidad en competencia" className='slidercompeticones-skill-img'/>
        <h1>This is a title</h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At ducimus eligendi eaque, libero, maiores quia rerum animi tempore fugiat harum, porro veniam repudiandae ad ut explicabo! Debitis sint autem accusamus.</p>
        <br /> <a href="#">Descubre más</a>

      </div>
      <div className='slidercompeticiones-skill'>
        <img src={figure3} alt="Imagen representativa de la habilidad en competencia" className='slidercompeticones-skill-img'/>
        <h1>This is a title</h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At ducimus eligendi eaque, libero, maiores quia rerum animi tempore fugiat harum, porro veniam repudiandae ad ut explicabo! Debitis sint autem accusamus.</p>
        <br /> <a href="#">Descubre más</a>

      </div>
      <div className='slidercompeticiones-skill'>
        <img src={figure3} alt="Imagen representativa de la habilidad en competencia" className='slidercompeticones-skill-img'/>
        <h1>This is a title</h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At ducimus eligendi eaque, libero, maiores quia rerum animi tempore fugiat harum, porro veniam repudiandae ad ut explicabo! Debitis sint autem accusamus.</p>
        <br /> <a href="#">Descubre más</a>

      </div>
      <div className='slidercompeticiones-skill'>
        <img src={figure3} alt="Imagen representativa de la habilidad en competencia" className='slidercompeticones-skill-img'/>
        <h1>This is a title</h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At ducimus eligendi eaque, libero, maiores quia rerum animi tempore fugiat harum, porro veniam repudiandae ad ut explicabo! Debitis sint autem accusamus.</p>
        <br /> <a href="#">Descubre más</a>

      </div>
      <div className='slidercompeticiones-skill'>
        <img src={figure3} alt="Imagen representativa de la habilidad en competencia" className='slidercompeticones-skill-img'/>
        <h1>This is a title</h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At ducimus eligendi eaque, libero, maiores quia rerum animi tempore fugiat harum, porro veniam repudiandae ad ut explicabo! Debitis sint autem accusamus.</p>
        <br /> <a href="#">Descubre más</a>

      </div>
      <div className='slidercompeticiones-skill'>
        <img src={figure3} alt="Imagen representativa de la habilidad en competencia" className='slidercompeticones-skill-img'/>
        <h1>This is a title</h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At ducimus eligendi eaque, libero, maiores quia rerum animi tempore fugiat harum, porro veniam repudiandae ad ut explicabo! Debitis sint autem accusamus.</p>
        <br /> <a href="#">Descubre más</a>

      </div>
      <div className='slidercompeticiones-skill'>
        <img src={figure3} alt="Imagen representativa de la habilidad en competencia" className='slidercompeticones-skill-img'/>
        <h1>This is a title</h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At ducimus eligendi eaque, libero, maiores quia rerum animi tempore fugiat harum, porro veniam repudiandae ad ut explicabo! Debitis sint autem accusamus.</p>
        <br /> <a href="#">Descubre más</a>

      </div>
      <div className='slidercompeticiones-skill'>
        <img src={figure3} alt="Imagen representativa de la habilidad en competencia" className='slidercompeticones-skill-img'/>
        <h1>This is a title</h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At ducimus eligendi eaque, libero, maiores quia rerum animi tempore fugiat harum, porro veniam repudiandae ad ut explicabo! Debitis sint autem accusamus.</p>
        <br /> <a href="#">Descubre más</a>

      </div>
      <div className='slidercompeticiones-skill'>
        <img src={figure3} alt="Imagen representativa de la habilidad en competencia" className='slidercompeticones-skill-img'/>
        <h1>This is a title</h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At ducimus eligendi eaque, libero, maiores quia rerum animi tempore fugiat harum, porro veniam repudiandae ad ut explicabo! Debitis sint autem accusamus.</p>
        <br /> <a href="#">Descubre más</a>

      </div>
    </div>
    </div>
  </>
  );
}

export default SliderCompeticiones;
