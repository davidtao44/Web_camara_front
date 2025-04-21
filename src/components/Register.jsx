import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/logo2-2.png';
import './Login.css'; // Reusing the same CSS file as Login
import { API_BASE_URL } from '../utils/apiConfig';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'operario'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor complete todos los campos');
      setLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingrese un correo electrónico válido');
      setLoading(false);
      return;
    }

    try {
      // Call the backend API to register the user
      const response = await axios.post(`${API_BASE_URL}/users/`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      console.log('Usuario registrado exitosamente:', response.data);
      
      // Redirect to login after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Error al registrar usuario');
      } else {
        setError('Error al conectar con el servidor. Por favor intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form register-form">
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
        <h2>Registro de Usuario</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Nombre de Usuario"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            <i className={showPassword ? "fas fa-unlock" : "fas fa-lock"}></i>
          </span>
        </div>
        
        <div className="form-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            <i className={showConfirmPassword ? "fas fa-unlock" : "fas fa-lock"}></i>
          </span>
        </div>
        
        <div className="form-group">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="operario">Operario</option>
            <option value="supervisor">Supervisor</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Registrarse'}
        </button>
        
        <div className="forgot-password">
          <Link to="/login">¿Ya tienes una cuenta? Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;