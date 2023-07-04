import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Importez votre fichier CSS

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      await axios.post('/auth/register', { username, password });

      // Redirigez l'utilisateur vers la page de connexion
      // Vous pouvez utiliser l'API history de React Router pour cela
    } catch (error) {
      // Gérez les erreurs (par exemple, affichez un message d'erreur à l'utilisateur)
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          Nom d'utilisateur :
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          Mot de passe :
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default Register;
