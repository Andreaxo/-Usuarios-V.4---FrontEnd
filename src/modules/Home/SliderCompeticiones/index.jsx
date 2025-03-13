import Header from '../../Header';
import './index.css';
import logoworldskills from '../../img/logo-worldskills.png';
import logosenasoft from '../../img/logo-senasoft.png';
import logoacme from '../../img/logo-acme.png';

function SliderCompeticiones() {
    return (
  <>
    <div id="slidercompeticiones">
    </div>
    <div className='slidercompeticiones__container'>
        <h2 className='slidercompeticiones__title'>Competencias de las que somos parte</h2>
        <div className='slidercompeticiones__track'>
          <div className="slidercompeticiones__slide">
            <img className="competitionLogo" src={logoworldskills} alt="logo competencia worldskills" />
          </div>
          <div className="slidercompeticiones__slide">
            <img className="competitionLogo logoSenaSoft" src={logosenasoft} alt="logo competencia worldskills" />
          </div>
          <div className="slidercompeticiones__slide">
            <img className="competitionLogo" src={logoacme} alt="logo competencia worldskills" />
          </div>
        </div>
    </div>

  </>
  );
}

export default SliderCompeticiones;
