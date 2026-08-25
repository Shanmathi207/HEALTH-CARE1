import React, { useState, useEffect } from 'react';
import { Building2, Users, Plus, Edit, ShieldAlert, RefreshCw, CheckCircle2, XCircle, Bell, Zap } from 'lucide-react';

export default function HospitalDashboardView({ navigate }) {
  const [departments, setDepartments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [deptModal, setDeptModal] = useState(false);
  const [editingDeptIndex, setEditingDeptIndex] = useState(null);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptStart, setDeptStart] = useState('09:00');
  const [deptEnd, setDeptEnd] = useState('17:00');
  const [deptHead, setDeptHead] = useState('Dr. Shalini Rajan');
  const [deptLimit, setDeptLimit] = useState(50);
  const [deptEmergency, setDeptEmergency] = useState(false);

  const [staffModal, setStaffModal] = useState(false);
  const [editingStaffIndex, setEditingStaffIndex] = useState(null);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Doctor');
  const [staffDept, setStaffDept] = useState('General Medicine');
  const [staffStart, setStaffStart] = useState('09:00');
  const [staffEnd, setStaffEnd] = useState('17:00');

  useEffect(() => {
    initDefaultAdminData();
  }, []);

  const initDefaultAdminData = () => {
    const rawDepts = localStorage.getItem('smartcare_departments');
    const rawStaff = localStorage.getItem('smartcare_staff');
    const rawNotifs = localStorage.getItem('smartcare_notifications');

    let loadedDepts = [];
    let loadedStaff = [];

    if (rawDepts) {
      try { loadedDepts = JSON.parse(rawDepts); } catch (e) { loadedDepts = []; }
    }
    if (!loadedDepts.length) {
      loadedDepts = [
        { name: 'Cardiology', code: 'CARD-001', startTime: '09:00', endTime: '17:00', headDoctor: 'Dr. Shalini Rajan', queueLimit: 50, active: true, emergency: true, isHead: true },
        { name: 'Pediatrics', code: 'PED-002', startTime: '10:00', endTime: '18:00', headDoctor: 'Dr. Karthik Ravi', queueLimit: 40, active: true, emergency: false }
      ];
      localStorage.setItem('smartcare_departments', JSON.stringify(loadedDepts));
    }
    setDepartments(loadedDepts);

    if (rawStaff) {
      try { loadedStaff = JSON.parse(rawStaff); } catch (e) { loadedStaff = []; }
    }
    if (!loadedStaff.length) {
      loadedStaff = [
        { name: 'Dr. Selvarani', role: 'Doctor', department: 'General Medicine', status: 'available', shiftStart: '09:00', shiftEnd: '17:00', active: true },
        { name: 'Dr. Karthik Ravi', role: 'Doctor', department: 'Pediatrics', status: 'duty', shiftStart: '10:00', shiftEnd: '18:00', active: true }
      ];
      localStorage.setItem('smartcare_staff', JSON.stringify(loadedStaff));
    }
    setStaff(loadedStaff);

    if (rawNotifs) {
      try { setNotifications(JSON.parse(rawNotifs)); } catch (e) { setNotifications([]); }
    }
  };

  const handleDeptEmergencyToggle = (index) => {
    const updated = [...departments];
    updated[index].emergency = !updated[index].emergency;
    setDepartments(updated);
    localStorage.setItem('smartcare_departments', JSON.stringify(updated));
  };

  const handleToggleDeptActive = (index) => {
    const updated = [...departments];
    updated[index].active = !updated[index].active;
    setDepartments(updated);
    localStorage.setItem('smartcare_departments', JSON.stringify(updated));
  };

  const handleStaffStatusChange = (index, newStatus) => {
    const updated = [...staff];
    const member = updated[index];
    member.status = newStatus;
    setStaff(updated);
    localStorage.setItem('smartcare_staff', JSON.stringify(updated));

    // Dispatch notification
    const newNotif = {
      id: Date.now(),
      doctor: member.name,
      status: newStatus === 'available' ? 'Available' : newStatus === 'duty' ? 'On Duty' : 'Off Duty',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today'
    };
    const updatedNotifs = [newNotif, ...notifications].slice(0, 10);
    setNotifications(updatedNotifs);
    localStorage.setItem('smartcare_notifications', JSON.stringify(updatedNotifs));
  };

  const handleToggleStaffActive = (index) => {
    const updated = [...staff];
    updated[index].active = !updated[index].active;
    setStaff(updated);
    localStorage.setItem('smartcare_staff', JSON.stringify(updated));
  };

  const openAddDeptModal = () => {
    setEditingDeptIndex(null);
    setDeptName('');
    setDeptCode('');
    setDeptStart('09:00');
    setDeptEnd('17:00');
    setDeptHead('Dr. Shalini Rajan');
    setDeptLimit(50);
    setDeptEmergency(false);
    setDeptModal(true);
  };

  const openEditDeptModal = (index) => {
    const d = departments[index];
    setEditingDeptIndex(index);
    setDeptName(d.name);
    setDeptCode(d.code);
    setDeptStart(d.startTime);
    setDeptEnd(d.endTime);
    setDeptHead(d.headDoctor);
    setDeptLimit(d.queueLimit);
    setDeptEmergency(d.emergency);
    setDeptModal(true);
  };

  const handleSaveDept = (e) => {
    e.preventDefault();
    if (!deptName || !deptCode) return;

    const record = {
      name: deptName,
      code: deptCode,
      startTime: deptStart,
      endTime: deptEnd,
      headDoctor: deptHead,
      queueLimit: Number(deptLimit) || 30,
      emergency: deptEmergency,
      active: true
    };

    let updated;
    if (editingDeptIndex !== null) {
      updated = [...departments];
      updated[editingDeptIndex] = { ...updated[editingDeptIndex], ...record };
    } else {
      updated = [...departments, record];
    }

    setDepartments(updated);
    localStorage.setItem('smartcare_departments', JSON.stringify(updated));
    setDeptModal(false);
  };

  const openAddStaffModal = () => {
    setEditingStaffIndex(null);
    setStaffName('');
    setStaffRole('Doctor');
    setStaffDept('General Medicine');
    setStaffStart('09:00');
    setStaffEnd('17:00');
    setStaffModal(true);
  };

  const openEditStaffModal = (index) => {
    const s = staff[index];
    setEditingStaffIndex(index);
    setStaffName(s.name);
    setStaffRole(s.role);
    setStaffDept(s.department);
    setStaffStart(s.shiftStart);
    setStaffEnd(s.shiftEnd);
    setStaffModal(true);
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!staffName || !staffDept) return;

    const record = {
      name: staffName,
      role: staffRole,
      department: staffDept,
      shiftStart: staffStart,
      shiftEnd: staffEnd,
      status: 'available',
      active: true
    };

    let updated;
    if (editingStaffIndex !== null) {
      updated = [...staff];
      updated[editingStaffIndex] = { ...updated[editingStaffIndex], ...record };
    } else {
      updated = [...staff, record];
    }

    setStaff(updated);
    localStorage.setItem('smartcare_staff', JSON.stringify(updated));
    setStaffModal(false);
  };

  return (
    <div style={{ padding: '2.5rem 0', background: 'var(--neutral-50)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary">Hospital Management Console</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)' }}>City General Hospital</span>
            </div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>
              Hospital Operations Console
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={openAddDeptModal}>
              <Plus size={18} />
              <span>Add Department</span>
            </button>
            <button className="btn btn-primary" onClick={openAddStaffModal}>
              <Plus size={18} />
              <span>Add Staff Member</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase' }}>Active Departments</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary-blue)', fontFamily: 'var(--font-display)', margin: '0.25rem 0' }}>
              {departments.filter(d => d.active).length} / {departments.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--success-green)', fontWeight: 600 }}>All Systems Operational</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase' }}>Total Medical Staff</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary-violet)', fontFamily: 'var(--font-display)', margin: '0.25rem 0' }}>
              {staff.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Doctors & Clinical Personnel</div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase' }}>Emergency Support</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--danger-red)', fontFamily: 'var(--font-display)', margin: '0.25rem 0' }}>
              {departments.filter(d => d.emergency).length} Depts
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--danger-red)', fontWeight: 600 }}>Priority Routing Enabled</div>
          </div>
        </div>

        {/* Departments Management Table */}
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Department Directory & Limits</h3>
            <button className="btn btn-outline btn-sm" onClick={openAddDeptModal}>+ New Department</button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Department & Code</th>
                  <th>OPD Timings</th>
                  <th>Department Head</th>
                  <th>Session Limit</th>
                  <th>Status</th>
                  <th>Emergency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--neutral-900)' }}>{d.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Code: {d.code}</div>
                    </td>
                    <td>{d.startTime} - {d.endTime}</td>
                    <td>{d.headDoctor}</td>
                    <td>{d.queueLimit} / session</td>
                    <td>
                      <span className={`badge ${d.active ? 'badge-success' : 'badge-danger'}`}>
                        {d.active ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={d.emergency}
                          onChange={() => handleDeptEmergencyToggle(idx)}
                        />
                        <span className="slider" />
                      </label>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEditDeptModal(idx)}>Edit</button>
                        <button className="btn btn-outline btn-sm" style={{ color: d.active ? 'var(--danger-red)' : 'var(--success-green)', borderColor: d.active ? '#fecaca' : '#bbf7d0' }} onClick={() => handleToggleDeptActive(idx)}>
                          {d.active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Management Table */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Staff & Doctor Roster</h3>
            <button className="btn btn-primary btn-sm" onClick={openAddStaffModal}>+ New Staff Member</button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Live Duty Status</th>
                  <th>Shift Hours</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{s.name}</td>
                    <td>
                      <span className="badge badge-primary">{s.role}</span>
                    </td>
                    <td>{s.department}</td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                        value={s.status}
                        onChange={(e) => handleStaffStatusChange(idx, e.target.value)}
                      >
                        <option value="available">● Available</option>
                        <option value="duty">● On Duty</option>
                        <option value="off">● Off Duty</option>
                      </select>
                    </td>
                    <td>{s.shiftStart} - {s.shiftEnd}</td>
                    <td>
                      <span className={`badge ${s.active ? 'badge-success' : 'badge-danger'}`}>
                        {s.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEditStaffModal(idx)}>Edit</button>
                        <button className="btn btn-outline btn-sm" style={{ color: s.active ? 'var(--danger-red)' : 'var(--success-green)', borderColor: s.active ? '#fecaca' : '#bbf7d0' }} onClick={() => handleToggleStaffActive(idx)}>
                          {s.active ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Modal */}
        {deptModal && (
          <div className="modal-backdrop" onClick={() => setDeptModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{editingDeptIndex !== null ? 'Edit Department' : 'Add Department'}</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setDeptModal(false)}>✕ Close</button>
              </div>

              <form onSubmit={handleSaveDept}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Department Name</label>
                    <input type="text" className="form-control" placeholder="Cardiology" value={deptName} onChange={(e) => setDeptName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department Code</label>
                    <input type="text" className="form-control" placeholder="CARD-001" value={deptCode} onChange={(e) => setDeptCode(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input type="time" className="form-control" value={deptStart} onChange={(e) => setDeptStart(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input type="time" className="form-control" value={deptEnd} onChange={(e) => setDeptEnd(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Department Head Doctor</label>
                  <input type="text" className="form-control" value={deptHead} onChange={(e) => setDeptHead(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Queue Limit / Session</label>
                  <input type="number" className="form-control" value={deptLimit} onChange={(e) => setDeptLimit(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  Save Department
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Staff Modal */}
        {staffModal && (
          <div className="modal-backdrop" onClick={() => setStaffModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{editingStaffIndex !== null ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setStaffModal(false)}>✕ Close</button>
              </div>

              <form onSubmit={handleSaveStaff}>
                <div className="form-group">
                  <label className="form-label">Staff Full Name</label>
                  <input type="text" className="form-control" placeholder="Dr. Selvarani" value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-control" value={staffRole} onChange={(e) => setStaffRole(e.target.value)}>
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Receptionist">Receptionist</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input type="text" className="form-control" placeholder="General Medicine" value={staffDept} onChange={(e) => setStaffDept(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Shift Start</label>
                    <input type="time" className="form-control" value={staffStart} onChange={(e) => setStaffStart(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shift End</label>
                    <input type="time" className="form-control" value={staffEnd} onChange={(e) => setStaffEnd(e.target.value)} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  Save Staff Member
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
