import { useState } from 'react';
import './ManageRoles.css';

function ManageRoles() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Usuario 1', currentRole: 'operario' },
    { id: 2, name: 'Usuario 2', currentRole: 'supervisor' },
  ]);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, currentRole: newRole } : user
    ));
  };

  return (
    <div className="manage-roles-container">
      <h2>Gestionar Roles</h2>
      <div className="roles-list">
        {users.map(user => (
          <div key={user.id} className="role-card">
            <span className="user-name">{user.name}</span>
            <select
              value={user.currentRole}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
              className="role-select"
            >
              <option value="operario">Operario</option>
              <option value="supervisor">Supervisor</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageRoles;