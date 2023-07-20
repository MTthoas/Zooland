import React from 'react';
import './Home.css';

import Robin from '../../assets/robin.mp4'

function Home() {
    return (
    <main className="relative h-screen bg-grayDorian">
        <section className="absolute inset-0 flex items-center justify-center text-center text-white p-3">
            <div className="absolute inset-0">
                <video className="min-w-full min-h-full absolute object-cover" src={Robin} autoPlay muted loop></video>
            </div>
            <div className="absolute top-1/3 right-40 transform -translate-y-1/2 space-y-5 text-right pr-10">
                <div className='space-y-2'>
                    <h1 className="text-white text-6xl font-medium">Bienvenue à Zooland</h1>
                    <h3 className=" text-lg mb-4">Découvrez la faune et la flore incroyables de notre parc zoologique. </h3>
                </div>
                <div className="flex items-center space-x-6 ml-32">
                <button type="button" className="py-4 text-black bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
                    Choose plan
                    <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </button>
                <p> +  More informations </p>
                </div>
            </div>
        </section>
    </main>
    
        // <div className="home-container">
        //     <div className="home-content">
        //         <h1 className="home-title">Bienvenue au ZooLand</h1>
        //         <p className="home-description">
        //             Découvrez la faune et la flore incroyables de notre parc zoologique. Promenez-vous à travers
        //             nos espaces naturels et admirez une grande variété d'animaux provenant des quatre coins du monde.
        //         </p>
        //         <button className="home-button"></button>
        //     </div>
        // </div>
    );
}

export default Home;
