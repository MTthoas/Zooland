import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Spaces from './pages/Spaces';
import Login from './components/login';
import PrivateComponent from './components/privateRoute';
import Register from './components/register';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="body mb-24">
          <Header />
          <Routes>
            <Route path="/" element={<PrivateComponent><Home /></PrivateComponent>} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/spaces" element={<PrivateComponent><Spaces /></PrivateComponent>} /> */}
            <Route path="/spaces" element={<Spaces />} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
