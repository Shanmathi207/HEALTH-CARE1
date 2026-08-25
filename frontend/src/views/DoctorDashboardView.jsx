import React, { useState, useEffect } from 'react';
import {
  Users, Ticket, Calendar, MessageSquare, Clock, CheckCircle2,
  AlertTriangle, Search, Send, UserCheck, ChevronRight, RefreshCw, X
} from 'lucide-react';

export default function DoctorDashboardView({ user, navigate }) {
  const doctorName = user?.name || localStorage.getItem('smartcare_user_name') || 'Dr. Selvarani';
  const doctorDept = user?.department || 'Cardiology & General OPD';

  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [patients, setPatients] = useState([
    { token: 'A-35', name: 'Alex Morgan', reason: 'High fever, severe chills & cough', time: '09:15 AM', status: 'Consulting', priority: false },
    { token: 'A-36', name: 'Priya Sharma', reason: 'Routine ECG & Chest discomfort', time: '09:30 AM', status: 'Waiting', priority: true },
    { token: 'A-37', name: 'Rahul Verma', reason: 'Stomach pain & nausea', time: '09:45 AM', status: 'Waiting', priority: false },
    { token: 'A-38', name: 'Emily Watson', reason: 'Dizziness & mild fever', time: '10:00 AM', status: 'Waiting', priority: false },
    { token: 'A-39', name: 'David Miller', reason: 'Blood pressure checkup', time: '10:15 AM', status: 'Waiting', priority: false }
  ]);

  const [calendarModal, setCalendarModal] = useState(false);
  const [messageModal, setMessageModal] = useState(null); // patient object
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const currentServing = patients[currentTokenIndex] || patients[0];

  const handleCallNext = () => {
    if (currentTokenIndex < patients.length - 1) {
      const updated = [...patients];
      updated[currentTokenIndex].status = 'Completed';
      updated[currentTokenIndex + 1].status = 'Consulting';
      setPatients(updated);
      setCurrentTokenIndex(prev => prev + 1);
    } else {
      alert('All queue tokens for today have been completed!');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgBody.trim()) return;

    alert(`Message sent to ${messageModal.name}: "${msgSubject} - ${msgBody}"`);
    setMessageModal(null);
    setMsgSubject('');
    setMsgBody('');
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.token.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2.5rem 0', background: 'var(--neutral-50)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        {/* Welcome Top Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary">Doctor Clinical Portal</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)' }}>{doctorDept}</span>
            </div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>
              Welcome, <span className="gradient-text">{doctorName}</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={() => setCalendarModal(true)}>
              <Calendar size={18} />
              <span>Doctor Schedule Calendar</span>
            </button>
          </div>
        </div>

        {/* Live Queue Command Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {/* Currently Serving Token Highlight */}
          <div className="card" style={{ background: 'var(--gradient-primary)', color: 'white', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.9 }}>Currently Serving</span>
              {currentServing.priority && (
                <span className="badge" style={{ background: 'var(--danger-red)', color: 'white' }}>URGENT PRIORITY</span>
              )}
            </div>

            <div style={{ fontSize: '4rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: '0.5rem' }}>
              #{currentServing.token}
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              {currentServing.name}
            </div>
            <p style={{ opacity: 0.9, fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Reason: {currentServing.reason}
            </p>

            <button className="btn btn-secondary" style={{ width: '100%', background: 'white', color: 'var(--neutral-900)' }} onClick={handleCallNext}>
              <UserCheck size={18} />
              <span>Call Next Token</span>
            </button>
          </div>

          {/* OPD Queue Quick Stats */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Queue Summary Today</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '1rem', background: 'var(--neutral-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--neutral-200)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-blue)', fontFamily: 'var(--font-display)' }}>
                    {patients.length - (currentTokenIndex + 1)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Patients Remaining</div>
                </div>

                <div style={{ padding: '1rem', background: 'var(--neutral-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--neutral-200)' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success-green)', fontFamily: 'var(--font-display)' }}>
                    14
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Completed Visits</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: '#eff6ff', borderRadius: 'var(--radius-lg)', border: '1px solid #bfdbfe', fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
              ⚡ Average Consultation Speed: 8 mins / patient (On Schedule)
            </div>
          </div>
        </div>

        {/* Patients Queue Directory */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>OPD Patient Queue Table</h3>
            <div style={{ position: 'relative', width: '280px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search patient name or token..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem', height: '40px', fontSize: '0.88rem' }}
              />
              <Search size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Patient Name</th>
                  <th>Symptom Summary</th>
                  <th>Arrival Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p, idx) => (
                  <tr key={idx} style={{ background: idx === currentTokenIndex ? 'rgba(37,99,235,0.05)' : 'transparent' }}>
                    <td>
                      <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--neutral-900)' }}>#{p.token}</span>
                      {p.priority && <span className="badge badge-danger" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>PRIORITY</span>}
                    </td>
                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                    <td style={{ color: 'var(--neutral-600)', fontSize: '0.85rem' }}>{p.reason}</td>
                    <td>{p.time}</td>
                    <td>
                      <span className={`badge ${p.status === 'Consulting' ? 'badge-primary' : p.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setMessageModal(p)}
                        >
                          <MessageSquare size={14} />
                          <span>Message</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Schedule Calendar Modal */}
        {calendarModal && (
          <div className="modal-backdrop" onClick={() => setCalendarModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Doctor Schedule Calendar</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setCalendarModal(false)}>✕ Close</button>
              </div>

              <div style={{ padding: '1.5rem', background: 'var(--neutral-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--neutral-200)' }}>
                <h4 style={{ marginBottom: '1rem' }}>Today's OPD Hours (9:00 AM - 5:00 PM)</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <li style={{ padding: '0.75rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-200)' }}>
                    ⏰ <strong>09:00 AM - 01:00 PM:</strong> Morning OPD Consultation (Room 102)
                  </li>
                  <li style={{ padding: '0.75rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-200)' }}>
                    🥗 <strong>01:00 PM - 02:00 PM:</strong> Lunch & Medical Staff Briefing
                  </li>
                  <li style={{ padding: '0.75rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-200)' }}>
                    ⏰ <strong>02:00 PM - 05:00 PM:</strong> Evening Priority Rounds & Follow-ups
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Patient Message Modal */}
        {messageModal && (
          <div className="modal-backdrop" onClick={() => setMessageModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Send Message to {messageModal.name}</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setMessageModal(null)}>✕ Close</button>
              </div>

              <form onSubmit={handleSendMessage}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Appointment Update / Test Instructions"
                    value={msgSubject}
                    onChange={(e) => setMsgSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message Content</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Type your message to patient..."
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  <Send size={16} />
                  <span>Send Notification Message</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
