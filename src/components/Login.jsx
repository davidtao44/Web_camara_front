import { useState } from 'react';
import logo from '../assets/images/logo.png';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // En tu componente Login.jsx
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificación básica
    if (!username || !password) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }
    
    // Aquí simularemos que cualquier usuario que contenga "admin" es administrador
    if (username.includes('admin')) {
      onLogin('administrador'); // Asegúrate de usar el mismo valor que está en ROLES.ADMIN
    } else if (username.includes('super')) {
      onLogin('supervisor');
    } else {
      onLogin('operario');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
        <h2>Login Here</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            <i className={showPassword ? "fas fa-unlock" : "fas fa-lock"}></i>
          </span>
        </div>
        <button type="submit">Log In</button>
        <div className="forgot-password">
          <a href="/register">No tiene cuenta?, Registrese.</a>
        </div>
      </form>
    </div>
  );
}

export default Login;