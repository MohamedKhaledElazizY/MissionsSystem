import './home.css';
import Image from '../../assets/images/oooo.png';

const Home = () => {
    return (
        <div className="container home__container">
            <div className="home__imag">
                <img src={Image} alt="" />
            </div>
        </div>
    );
};
export default Home;
