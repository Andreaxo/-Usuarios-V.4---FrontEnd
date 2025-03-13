import '../../styles/root.css';
import Banner from './Banner';
import SliderCompeticiones from './SliderCompeticiones';
import DiscoverMore from './DiscoverMore';
import AboutUs from './AboutUs';
import Divider from './Divider';
import Roadmap from './Roadmap';
import Footer from '../Footer';

function Home() {
    return (
    <>
      <Banner />
      <SliderCompeticiones />
      <DiscoverMore />
      <AboutUs/>
      <Divider />
      <Roadmap/>
      <Footer />
    </>
    );
  }
  
  export default Home;