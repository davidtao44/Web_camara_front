import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import AddUser from './components/AddUser'
import UserList from './components/UserList'
import AttendeeList from './components/AttendeeList'
import AddAttendee from './components/AddAttendee'
import ManageRoles from './components/ManageRoles'
import AdminDashboard from './components/AdminDashboard'
import { ROLE_PERMISSIONS, ROLES } from './utils/roles'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [currentPage, setCurrentPage] = useState('')

  const handleLogin = (role) => {
    setIsLoggedIn(true)
    setUserRole(role)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserRole('')
    setCurrentPage('')
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  // Get permissions based on user role
  const getUserPermissions = () => {
    return ROLE_PERMISSIONS[userRole] || [];
  };

  return (
    <div className="app">
      <Router>
        {isLoggedIn ? (
          <>
            {userRole === ROLES.ADMIN ? (
              <Routes>
                <Route path="/admin/*" element={<AdminDashboard userPermissions={getUserPermissions()} />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            ) : (
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
            )}
          </>
        ) : (
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App
