import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Spaces from './pages/Spaces';
import Login from './components/login';
import PrivateComponent from './components/privateRoute';
import Register from './components/register';
import DailyStats from './pages/DailyStats';
import WeeklyStats from './pages/WeeklyStats';
import Users from './pages/User';
import Management from './pages/Management';

function App() {
  useEffect(() => {
    // localStorage.removeItem('token');
}, []);
  return (
    <div className="App">
      <Router>
        <div className="body mb-24">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/spaces" element={<PrivateComponent><Spaces /></PrivateComponent>} />
            <Route path="/statsDaily" element={<PrivateComponent><DailyStats /></PrivateComponent>} />
            <Route path="/statsWeekly" element={<PrivateComponent><WeeklyStats /></PrivateComponent>} />
            <Route path="/users" element={<PrivateComponent><Users /></PrivateComponent>} />
            <Route path="/management" element={<PrivateComponent><Management /></PrivateComponent>} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
