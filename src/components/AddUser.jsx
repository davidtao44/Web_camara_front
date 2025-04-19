import { useState } from 'react';
import axios from 'axios';
import './AddUser.css';

function AddUser() {
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'operario'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setMessage({ 
          text: 'No estás autenticado. Por favor inicia sesión nuevamente.', 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      // Call the backend API to create a new user
      const response = await axios.post('http://localhost:8000/users/', {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Usuario creado:', response.data);
      setMessage({ 
        text: 'Usuario creado exitosamente', 
        type: 'success' 
      });
      setNewUser({ name: '', username: '', email: '', password: '', role: 'operario' });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setMessage({ 
        text: error.response?.data?.detail || 'Error al crear el usuario', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-container">
      <h2>Agregar Nuevo Usuario</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="add-user-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre completo"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
          >
            <option value="operario">Operario</option>
            <option value="supervisor">Supervisor</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Agregar Usuario'}
        </button>
      </form>
    </div>
  );
}

export default AddUser;