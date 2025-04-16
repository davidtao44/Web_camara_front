import { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AddUser from './components/AddUser';
import UserList from './components/UserList';
import AttendeeList from './components/AttendeeList';
import AddAttendee from './components/AddAttendee';
import ManageRoles from './components/ManageRoles';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [currentPage, setCurrentPage] = useState('');

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setCurrentPage('');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <>
          <Sidebar 
            role={userRole} 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
          <div className="main-content">
            {currentPage === 'addUser' && <AddUser />}
            {currentPage === 'userList' && <UserList />}
            {currentPage === 'attendeeList' && <AttendeeList />}
            {currentPage === 'addAttendee' && <AddAttendee />}
            {currentPage === 'manageRoles' && <ManageRoles />}
          </div>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
