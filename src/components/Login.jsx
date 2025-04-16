import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de usuarios
    if (username === 'MASTER' && password === '789456123') {
      onLogin('administrador');
      setError('');
    } else if (username === 'BETA' && password === '123456789') {
      onLogin('supervisor');
      setError('');
    } else {
      setError('Usuario o contraseña incorrectos');
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
          <Link to="/register">¿No tienes una cuenta? Regístrate aquí</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;