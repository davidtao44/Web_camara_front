import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/logo2-2.png';
import './Login.css';
import { API_BASE_URL } from '../utils/apiConfig';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Call the backend API to authenticate the user
      const response = await axios.post(`${API_BASE_URL}/users/token`, 
        new URLSearchParams({
          'username': username,
          'password': password
        }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      // Store the token in localStorage
      localStorage.setItem('accessToken', response.data.access_token);
      
      // Call the onLogin function with the user's role
      onLogin(response.data.role);
      setError('');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(error.response?.data?.detail || 'Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
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
        <button type="submit" disabled={loading}>
          {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Log In'}
        </button>
        <div className="forgot-password">
          <Link to="/register">¿No tienes una cuenta? Regístrate aquí</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;