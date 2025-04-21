import { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';
import { API_BASE_URL } from '../utils/apiConfig';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('No estás autenticado. Por favor inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      // Call the backend API to get all users
      const response = await axios.get(`${API_BASE_URL}/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setError(error.response?.data?.detail || 'Error al obtener la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('No estás autenticado. Por favor inicia sesión nuevamente.');
        return;
      }

      // Call the backend API to delete the user
      await axios.delete(`http://localhost:8000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update the users list
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError(error.response?.data?.detail || 'Error al eliminar el usuario');
    }
  };

  return (
    <div className="user-list-container">
      <h2>Lista de Usuarios</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Cargando usuarios...
        </div>
      ) : (
        <div className="user-list">
          {users.length === 0 ? (
            <div className="no-users">No hay usuarios registrados</div>
          ) : (
            users.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-info">
                  <span className="user-name">{user.username}</span>
                  <span className="user-email">{user.email}</span>
                  <span className="user-role">{user.role}</span>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(user.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
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

export default UserList;