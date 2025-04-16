import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import './Login.css'; // Reusing the same CSS file as Login

function Register() {
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
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return;
    }

    // Here you would typically call your API to register the user
    try {
      // Placeholder for API call
      console.log('Registering user:', formData);
      // Redirect to login after successful registration
      window.location.href = '/login';
    } catch (err) {
      setError('Error al registrar usuario. Por favor intente nuevamente.');
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
        
        <button type="submit">Registrarse</button>
        
        <div className="forgot-password">
          <Link to="/login">¿Ya tienes una cuenta? Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;