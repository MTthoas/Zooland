import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Spaces from './pages/Spaces';
// import Login from './components/login';
import PrivateComponent from './components/privateRoute';
// import Register from './components/register';
import Stats from './pages/Stats';
import Users from './pages/User';
import Management from './pages/Management';
import Tickets from './pages/Ticket';

import Login from './components/modal/Login';
import Register from './components/modal/Register';

function App() {

  const [showModalLogin, setShowModalLogin] = React.useState(false);
  const [showModalRegister, setShowModalRegister] = React.useState(false);
  const [userName, setUserName] = React.useState('');
  

  return (
    <div className="App">
      <Router>
        <div className="pt-22">
          <Header setShowModalLogin={setShowModalLogin} setShowModalRegister={setShowModalRegister} username={userName} />
          {showModalLogin ? <Login setShowModalLogin={setShowModalLogin} setShowModalRegister={setShowModalRegister} setUserName={setUserName} /> : null}
          {showModalRegister ? <Register setShowModalRegister={setShowModalRegister} setUserName={setUserName} /> : null}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/spaces" element={<PrivateComponent><Spaces /></PrivateComponent>} />
            <Route path="/stats" element={<PrivateComponent><Stats /></PrivateComponent>} />
            <Route path="/users" element={<PrivateComponent><Users /></PrivateComponent>} />
            <Route path="/tickets" element={<PrivateComponent><Tickets /></PrivateComponent>} />
            <Route path="/management" element={<PrivateComponent><Management /></PrivateComponent>} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
