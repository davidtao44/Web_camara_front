import { useState } from 'react';
import './UserList.css';

function UserList() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Usuario 1', role: 'operario' },
    { id: 2, name: 'Usuario 2', role: 'supervisor' },
    // Datos de ejemplo
  ]);

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="user-list-container">
      <h2>Lista de Usuarios</h2>
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button 
              className="delete-button"
              onClick={() => handleDelete(user.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;