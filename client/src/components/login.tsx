import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importez le composant Link
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      const response = await axios.post('/auth/login', { username, password });
      const token = response.data.token;

      localStorage.setItem('token', token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Nom d'utilisateur :
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          Mot de passe :
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
