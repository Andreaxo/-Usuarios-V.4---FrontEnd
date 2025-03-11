import './index.css';
import imageslider1 from '../../img/discovermore-slider-1.jpg';
import imageslider2 from '../../img/discovermore-slider-2.jpg';
import imageslider3 from '../../img/discovermore-slider-3.jpg';
import { useState, useEffect } from 'react';

function DiscoverMore() {
    const [ competitors, setCompetitors ] = useState(0);
    const [ skills, setSkills ] = useState(0);
    const [ podios, setPodios ] = useState(0);
    useEffect(() => {
        const interval1 = setInterval(() => {
            setCompetitors((prevCompetitors) => {
                if (prevCompetitors >= 120) {
                clearInterval(interval1);
                    return prevCompetitors;
                }
                return prevCompetitors + 1;
            });
        }, 50);
        const interval2 = setInterval(() => {
            setSkills((prevSkills) => {
                if (prevSkills >= 100) {
                    clearInterval(interval2);
                    return prevSkills;
                }
                return prevSkills + 1;
            });
        }, 60);
        const interval3 = setInterval(() => {
            setPodios((prevPodios) => {
                if (prevPodios >= 80) {
                    clearInterval(interval3);
                    return prevPodios;
                }
                return prevPodios + 1;
            });
        }, 70);
    }, []);
    return (
  <>
    <div className='discovermore__container'>
        <div className='discovermore__estadisticas'>
            <div className='discovermore_estadisticas--1'>
                <h1 className='discovermore__estadistica--text'>+<span>{competitors}</span></h1>
                <p>COMPETIDORES</p>
            </div>
            <hr />
            <div className='discovermore_estadisticas--2'>
                <h1 className='discovermore__estadistica--text'>+<span>{skills}</span></h1>
                <p>HABILIDADES</p>
            </div>
            <hr />
            <div className='discovermore__estadisticas--3'>
                <h1 className='discovermore__estadistica--text'>+<span>{podios}</span></h1>
                <p>PODIOS</p>
            </div>
        </div>
        <div className='discovermore__slider'>
            <div className='discovermore__slider--container--button'>
                <button className='discovermore__slider--button btn1'>Descubre más</button>
            </div>
            <img src={imageslider1} alt="Fotos de competencias" />
        </div>
    </div>
  </>
  );
}

export default DiscoverMore;
