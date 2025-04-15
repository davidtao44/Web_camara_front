import { useState } from 'react';
import './AddAttendee.css';

function AddAttendee() {
  const [newAttendee, setNewAttendee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nuevo asistente:', newAttendee);
    setNewAttendee({ firstName: '', lastName: '', email: '', company: '' });
  };

  return (
    <div className="add-attendee-container">
      <h2>Agregar Nuevo Asistente</h2>
      <form onSubmit={handleSubmit} className="add-attendee-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombres"
            value={newAttendee.firstName}
            onChange={(e) => setNewAttendee({...newAttendee, firstName: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Apellidos"
            value={newAttendee.lastName}
            onChange={(e) => setNewAttendee({...newAttendee, lastName: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Empresa"
            value={newAttendee.company}
            onChange={(e) => setNewAttendee({...newAttendee, company: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={newAttendee.email}
            onChange={(e) => setNewAttendee({...newAttendee, email: e.target.value})}
            required
          />
        </div>
        <button type="submit">Agregar Asistente</button>
      </form>
    </div>
  );
}

export default AddAttendee;