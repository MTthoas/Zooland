import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      const response = await axios.post('/auth/login', { username, password });
      const token = response.data.token;

      // Stockez le token dans le local storage
      localStorage.setItem('token', token);

      // Redirigez l'utilisateur vers la page d'accueil
      // Vous pouvez utiliser l'API history de React Router pour cela
    } catch (error) {
      // Gérez les erreurs (par exemple, affichez un message d'erreur à l'utilisateur)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
}

export default Login;
