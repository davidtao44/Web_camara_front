import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ role, onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>{role.charAt(0).toUpperCase() + role.slice(1)}</h3>
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-button">
          <i className={`fas fa-chevron-${isOpen ? 'left' : 'right'}`}></i>
        </button>
      </div>
      
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {/* Dashboard button for all roles */}
          <button className="nav-item" onClick={() => onNavigate('dashboard')}>
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </button>

          {role === 'administrador' && (
            <>
              <button className="nav-item" onClick={() => onNavigate('userList')}>
                <i className="fas fa-users"></i>
                <span>Lista de Usuarios</span>
              </button>
              <button className="nav-item" onClick={() => onNavigate('addUser')}>
                <i className="fas fa-user-plus"></i>
                <span>Agregar Usuario</span>
              </button>
              <button className="nav-item" onClick={() => onNavigate('manageRoles')}>
                <i className="fas fa-user-shield"></i>
                <span>Gestionar Roles</span>
              </button>
            </>
          )}

          {role === 'supervisor' && (
            <button className="nav-item" onClick={() => onNavigate('userList')}>
              <i className="fas fa-users"></i>
              <span>Lista de Usuarios</span>
            </button>
          )}

          {(role === 'administrador' || role === 'supervisor') && (
            <button className="nav-item" onClick={() => onNavigate('attendeeList')}>
              <i className="fas fa-users"></i>
              <span>Lista de Asistentes</span>
            </button>
          )}
        </nav>
      </div>
      
      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;