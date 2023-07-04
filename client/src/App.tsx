import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Spaces from './pages/Spaces';
import Login from './pages/login';



function App() {

  return (
  <div className="App">
    <Router>
        <div className="body mb-24">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/spaces" element={<Spaces />} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </Router>
  </div>
  );
}

export default App;
