function getStoredDepartments() {
  return JSON.parse(localStorage.getItem('smartcare_departments') || '[]');
}

function getStoredStaff() {
  return JSON.parse(localStorage.getItem('smartcare_staff') || '[]');
}

function saveDepartments(departments) {
  localStorage.setItem('smartcare_departments', JSON.stringify(departments));
}

function saveStaff(staff) {
  localStorage.setItem('smartcare_staff', JSON.stringify(staff));
}

function formatDoctorBadge(name) {
  return name.split(' ').slice(0, 2).join(' ');
}

function renderDepartments() {
  const tbody = document.getElementById('departments-tbody');
  const departments = getStoredDepartments();
  if (!tbody) return;

  tbody.innerHTML = departments.map((dept, index) => {
    return `
      <tr class="dept-row" data-index="${index}">
        <td>
          <div style="font-weight: 600; color: var(--neutral-900);">${dept.name}</div>
          <div style="font-size: 0.75rem; color: var(--neutral-500);">Code: ${dept.code}</div>
        </td>
        <td>${dept.startTime} - ${dept.endTime}</td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 0.8rem;">${dept.headDoctor}${dept.isHead ? ' (Head)' : ''}</span>
            <span style="font-size: 0.75rem; color: var(--primary-blue); cursor: pointer;" onclick="showEmergencySwapModal('${dept.name}')">⇄ Emergency Swap</span>
          </div>
        </td>
        <td>${dept.queueLimit} / session</td>
        <td>
          <span class="badge ${dept.active ? 'badge-success' : ''}" style="background: ${dept.active ? '' : '#fecaca'}; color: ${dept.active ? '' : 'var(--danger-red)'};">${dept.active ? 'ACTIVE' : 'DISABLED'}</span>
        </td>
        <td>
          <label class="switch">
            <input type="checkbox" ${dept.emergency ? 'checked' : ''} onchange="handleDeptEmergency(this, '${dept.name}')">
            <span class="slider"></span>
          </label>
        </td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="editDept(${index})">Edit</button>
          <button class="btn btn-outline btn-sm" style="color: var(--danger-red); border-color: var(--danger-red);" onclick="toggleDeptStatus(this, ${index})">${dept.active ? 'Disable' : 'Enable'}</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderStaff() {
  const tbody = document.getElementById('staff-tbody');
  const staff = getStoredStaff();
  if (!tbody) return;

  tbody.innerHTML = staff.map((member, index) => {
    return `
      <tr class="staff-row ${member.role.toLowerCase()}" data-index="${index}">
        <td>
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.8rem; background: var(--primary-blue);">${member.name.charAt(0).toUpperCase()}</div>
            <span style="font-weight: 600;">${member.name}</span>
          </div>
        </td>
        <td><span style="background: rgba(37, 99, 235, 0.1); color: var(--primary-blue); padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700;">${member.role.toUpperCase()}</span></td>
        <td>${member.department}</td>
        <td>
          <select onchange="updateRowStatus(this)">
            <option value="available" ${member.status === 'available' ? 'selected' : ''}>● Available</option>
            <option value="duty" ${member.status === 'duty' ? 'selected' : ''}>● On Duty</option>
            <option value="off" ${member.status === 'off' ? 'selected' : ''}>● Off Duty</option>
          </select>
        </td>
        <td>${member.shiftStart} - ${member.shiftEnd}</td>
        <td><span class="badge ${member.active ? 'badge-success' : ''}" style="background: ${member.active ? '' : '#e2e8f0'}; color: ${member.active ? '' : '#64748b'};">${member.active ? 'ACTIVE' : 'INACTIVE'}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="editStaff(${index})">Edit</button>
          <button class="btn btn-outline btn-sm" style="color: ${member.active ? 'var(--danger-red)' : 'var(--success-green)'}; border-color: ${member.active ? 'var(--danger-red)' : 'var(--success-green)'};" onclick="toggleAccount(this, ${index})">${member.active ? 'Suspend' : 'Activate'}</button>
        </td>
      </tr>
    `;
  }).join('');
}

function initDefaultAdminData() {
  const existingDepartments = getStoredDepartments();
  const existingStaff = getStoredStaff();

  if (!existingDepartments.length) {
    saveDepartments([
      { name: 'Cardiology', code: 'CARD-001', startTime: '09:00', endTime: '17:00', headDoctor: 'Dr. Shalini Rajan', queueLimit: 50, active: true, emergency: true, isHead: true },
      { name: 'Pediatrics', code: 'PED-002', startTime: '10:00', endTime: '18:00', headDoctor: 'Dr. Karthik Ravi', queueLimit: 40, active: true, emergency: false }
    ]);
  }

  if (!existingStaff.length) {
    saveStaff([
      { name: 'Dr. Selvarani', role: 'Doctor', department: 'General Medicine', status: 'available', shiftStart: '09:00', shiftEnd: '17:00', active: true },
      { name: 'Dr. Karthik Ravi', role: 'Doctor', department: 'Pediatrics', status: 'duty', shiftStart: '10:00', shiftEnd: '18:00', active: true }
    ]);
  }
}

function handleDeptEmergency(checkbox, deptName) {
  const departments = getStoredDepartments();
  const dept = departments.find(d => d.name === deptName);
  if (dept) {
    dept.emergency = checkbox.checked;
    saveDepartments(departments);
    alert(`Emergency support for ${deptName} is now ${checkbox.checked ? 'ENABLED' : 'DISABLED'}.`);
  }
}

function updateRowStatus(select) {
  const row = select.closest('tr');
  const index = Number(row.dataset.index);
  const staff = getStoredStaff();
  const member = staff[index];
  if (!member) return;

  member.status = select.value;
  saveStaff(staff);

  if (select.value === 'available') select.style.color = 'var(--success-green)';
  else if (select.value === 'duty') select.style.color = 'var(--warning-orange)';
  else select.style.color = 'var(--neutral-400)';

  const notifications = JSON.parse(localStorage.getItem('smartcare_notifications') || '[]');
  notifications.unshift({
    id: Date.now(),
    doctor: member.name,
    status: member.status === 'available' ? 'Available' : member.status === 'duty' ? 'On Duty' : 'Off Duty',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: 'Today'
  });
  localStorage.setItem('smartcare_notifications', JSON.stringify(notifications.slice(0, 10)));

  alert(`Status for ${member.name} updated to ${member.status === 'available' ? 'Available' : member.status === 'duty' ? 'On Duty' : 'Off Duty'}. Notification sent to patients.`);
}

function toggleAccount(btn, index) {
  const staff = getStoredStaff();
  const member = staff[index];
  if (!member) return;

  const badge = btn.closest('tr').querySelector('.badge');
  member.active = !member.active;
  saveStaff(staff);
  renderStaff();
}

function toggleDeptStatus(btn, index) {
  const departments = getStoredDepartments();
  const dept = departments[index];
  if (!dept) return;
  dept.active = !dept.active;
  saveDepartments(departments);
  renderDepartments();
}

function editStaff(index) {
  const staff = getStoredStaff();
  const member = staff[index];
  if (!member) return;
  document.getElementById('staff-name-input').value = member.name;
  document.getElementById('staff-role-input').value = member.role;
  document.getElementById('staff-dept-input').value = member.department;
  document.getElementById('staff-start-input').value = member.shiftStart;
  document.getElementById('staff-end-input').value = member.shiftEnd;
  document.getElementById('staff-edit-index').value = index;
  document.getElementById('modal-overlay').style.display = 'block';
  document.getElementById('staff-modal').style.display = 'block';
}

function editDept(index) {
  const departments = getStoredDepartments();
  const dept = departments[index];
  if (!dept) return;
  document.getElementById('dept-name-input').value = dept.name;
  document.getElementById('dept-code-input').value = dept.code;
  document.getElementById('dept-start-input').value = dept.startTime;
  document.getElementById('dept-end-input').value = dept.endTime;
  document.getElementById('dept-limit-input').value = dept.queueLimit;
  document.getElementById('dept-head-input').value = dept.headDoctor;
  document.getElementById('dept-emergency-input').checked = dept.emergency;
  document.getElementById('dept-edit-index').value = index;
  document.getElementById('dept-modal-title').innerText = 'Edit Department';
  document.getElementById('modal-overlay').style.display = 'block';
  document.getElementById('dept-modal').style.display = 'block';
}

function saveDept() {
  const name = document.getElementById('dept-name-input').value.trim();
  const code = document.getElementById('dept-code-input').value.trim();
  const startTime = document.getElementById('dept-start-input').value;
  const endTime = document.getElementById('dept-end-input').value;
  const queueLimit = Number(document.getElementById('dept-limit-input').value) || 0;
  const headDoctor = document.getElementById('dept-head-input').value;
  const emergency = document.getElementById('dept-emergency-input').checked;
  const editIndex = document.getElementById('dept-edit-index').value;

  if (!name || !code) {
    alert('Please provide both department name and code.');
    return;
  }

  const departments = getStoredDepartments();
  const record = { name, code, startTime, endTime, headDoctor, queueLimit, emergency };
  if (editIndex !== '') {
    const existing = departments[Number(editIndex)];
    departments[Number(editIndex)] = { ...existing, ...record, active: existing.active, isHead: existing.isHead };
  } else {
    departments.push({ ...record, active: true, isHead: false });
  }

  saveDepartments(departments);
  renderDepartments();
  closeModal();
}

function saveStaff() {
  const name = document.getElementById('staff-name-input').value.trim();
  const role = document.getElementById('staff-role-input').value;
  const department = document.getElementById('staff-dept-input').value.trim();
  const shiftStart = document.getElementById('staff-start-input').value;
  const shiftEnd = document.getElementById('staff-end-input').value;
  const editIndex = document.getElementById('staff-edit-index').value;

  if (!name || !department) {
    alert('Please provide staff name and department.');
    return;
  }

  const staff = getStoredStaff();
  const record = { name, role, department, shiftStart, shiftEnd };
  if (editIndex !== '') {
    const existing = staff[Number(editIndex)];
    staff[Number(editIndex)] = { ...existing, ...record };
  } else {
    staff.push({ ...record, status: 'available', active: true });
  }

  saveStaff(staff);
  renderStaff();
  // Ensure department exists and add if missing
  const departments = getStoredDepartments();
  const deptExists = departments.some(d => d.name.toLowerCase() === department.toLowerCase());
  if (!deptExists) {
    // generate a simple dept code
    const code = department.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0,4) + '-' + String(Date.now()).slice(-4);
    departments.push({ name: department, code, startTime: shiftStart || '09:00', endTime: shiftEnd || '17:00', headDoctor: name, queueLimit: 30, active: true, emergency: false });
    saveDepartments(departments);
    renderDepartments();
  }

  // If the staff is a doctor, add to dept-head select options for new departments
  try {
    const headSelect = document.getElementById('dept-head-input');
    if (headSelect && role.toLowerCase().includes('doctor')) {
      // avoid duplicates
      const existsOption = Array.from(headSelect.options).some(o => o.text === name);
      if (!existsOption) {
        const opt = document.createElement('option');
        opt.text = name;
        headSelect.add(opt);
      }
    }
  } catch (e) {
    // ignore UI update errors
  }

  closeModal();
}

window.addEventListener('load', () => {
  initDefaultAdminData();
  renderDepartments();
  renderStaff();
  // Attach save button handler in case inline onclick is not fired
  try {
    const saveBtn = document.getElementById('staff-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        saveStaff();
      });
    }
  } catch (e) {
    console.error('Failed to attach staff save handler', e);
  }
});
