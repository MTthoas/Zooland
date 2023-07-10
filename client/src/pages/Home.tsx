import React from 'react';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">Bienvenue au ZooLand</h1>
                <p className="home-description">
                    Découvrez la faune et la flore incroyables de notre parc zoologique. Promenez-vous à travers
                    nos espaces naturels et admirez une grande variété d'animaux provenant des quatre coins du monde.
                </p>
                <button className="home-button"></button>
            </div>
        </div>
    );
}

export default Home;
