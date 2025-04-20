import { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageRoles.css';

function ManageRoles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('No estás autenticado. Por favor inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      // Call the backend API to get all users
      const response = await axios.get('http://localhost:8000/users/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setError(error.response?.data?.detail || 'Error al obtener la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setSuccessMessage('');
      setError('');
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('No estás autenticado. Por favor inicia sesión nuevamente.');
        return;
      }

      // Call the backend API to update the user's role
      await axios.patch(`http://localhost:8000/users/${userId}/role`, 
        { role: newRole },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setSuccessMessage(`Rol actualizado correctamente para el usuario`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      setError(error.response?.data?.detail || 'Error al actualizar el rol del usuario');
    }
  };

  return (
    <div className="manage-roles-container">
      <h2>Gestionar Roles</h2>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      {loading ? (
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Cargando usuarios...
        </div>
      ) : (
        <div className="roles-list">
          {users.length === 0 ? (
            <div className="no-users">No hay usuarios registrados</div>
          ) : (
            users.map(user => (
              <div key={user.id} className="role-card">
                <div className="user-details">
                  <span className="user-name">{user.username}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="role-select"
                >
                  <option value="operario">Operario</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            ))
          )}
        </div>
      )}
      
      <button className="refresh-button" onClick={fetchUsers} disabled={loading}>
        <i className="fas fa-sync-alt"></i> Actualizar
      </button>
    </div>
  );
}

export default ManageRoles;