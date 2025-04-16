import { useState } from 'react';
import './AttendeeList.css';

function AttendeeList() {
  const [attendees, setAttendees] = useState([
    { id: 1, name: 'Asistente 1', email: 'asistente1@email.com' },
    { id: 2, name: 'Asistente 2', email: 'asistente2@email.com' },
  ]);

  const handleDelete = (id) => {
    setAttendees(attendees.filter(attendee => attendee.id !== id));
  };

  return (
    <div className="attendee-list-container">
      <h2>Lista de Asistentes</h2>
      <div className="attendee-list">
        {attendees.map(attendee => (
          <div key={attendee.id} className="attendee-card">
            <div className="attendee-info">
              <span className="attendee-name">{attendee.name}</span>
              <span className="attendee-email">{attendee.email}</span>
            </div>
            <button 
              className="delete-button"
              onClick={() => handleDelete(attendee.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendeeList;