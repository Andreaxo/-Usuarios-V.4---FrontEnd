import roadmap from '../..//img/roadmap.jpg'
import figure1 from '../..//img/figure1.png';
import figure2 from '../..//img/figure2.png';
import './index.css';

function Roadmap(){
    return(
        <>
            <img src={figure1} alt="decoration 1" className='decorationn1 decorationn'/>
            <img src={figure2} alt="decoration 2" className='decorationn2 decorationn'/>
            <img src={roadmap} className="roadmap" alt="Mapa de como competir" />
        </>
    )

}

export default Roadmap;