import { useState } from 'react';
import './AddUser.css';

function AddUser() {
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    password: '',
    role: 'operario'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica para agregar el usuario
    console.log('Nuevo usuario:', newUser);
    setNewUser({ name: '', username: '', password: '', role: 'operario' });
  };

  return (
    <div className="add-user-container">
      <h2>Agregar Nuevo Usuario</h2>
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
        <button type="submit">Agregar Usuario</button>
      </form>
    </div>
  );
}

export default AddUser;