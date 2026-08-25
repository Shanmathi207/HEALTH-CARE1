import React, { useState, useEffect } from 'react';
import { Stethoscope, MapPin, Clock, Search, Filter, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

const ALL_DOCTORS = [
  { doctor: 'Dr. Selvarani', department: 'General Medicine', hospital: 'City General Hospital', location: 'Wing A - Room 102', experience: '12 Yrs Exp.', rating: 4.9, status: 'Available Now', wait: '15 mins' },
  { doctor: 'Dr. Karthik Ravi', department: 'Pediatrics', hospital: 'Metro Children Hospital', location: 'Wing B - Room 204', experience: '9 Yrs Exp.', rating: 4.8, status: 'Available Now', wait: '10 mins' },
  { doctor: 'Dr. Shalini Rajan', department: 'Cardiology', hospital: 'City Heart Institute', location: 'Wing C - Room 301', experience: '15 Yrs Exp.', rating: 5.0, status: 'On Duty', wait: '25 mins' },
  { doctor: 'Dr. Ananya Sharma', department: 'Neurology', hospital: 'Neuro Care Center', location: 'Block 2 - Room 11', experience: '11 Yrs Exp.', rating: 4.7, status: 'Available Now', wait: '20 mins' },
  { doctor: 'Dr. Vikram Sethi', department: 'Dermatology', hospital: 'Skin & Skin Clinic', location: 'Floor 2 - Suite B', experience: '8 Yrs Exp.', rating: 4.9, status: 'Available Today', wait: '30 mins' },
  { doctor: 'Dr. Rajesh Patel', department: 'Orthopedics', hospital: 'Joint & Bone Hospital', location: 'Wing A - Room 108', experience: '14 Yrs Exp.', rating: 4.8, status: 'Available Now', wait: '12 mins' }
];

export default function DoctorSuggestionView({ navigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [suggestedSpecialist, setSuggestedSpecialist] = useState('');
  const [predictedDisease, setPredictedDisease] = useState('');

  useEffect(() => {
    const specialist = localStorage.getItem('suggestedSpecialist');
    const disease = localStorage.getItem('predictedDisease');
    if (specialist) setSuggestedSpecialist(specialist);
    if (disease) setPredictedDisease(disease);
  }, []);

  const filteredDoctors = ALL_DOCTORS.filter(doc => {
    const matchSearch = doc.doctor.toLowerCase().includes(searchTerm.toLowerCase()) || doc.department.toLowerCase().includes(searchTerm.toLowerCase()) || doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'All' || doc.department.toLowerCase() === selectedDept.toLowerCase();
    return matchSearch && matchDept;
  });

  const handleBookToken = (doc) => {
    localStorage.setItem('selectedDoctor', JSON.stringify(doc));
    if (!localStorage.getItem('suggestedSpecialist')) {
      localStorage.setItem('suggestedSpecialist', doc.department);
    }
    navigate('digital-token');
  };

  return (
    <div style={{ padding: '2.5rem 0', background: 'var(--neutral-50)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        {/* Header & Suggestion Spotlight */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>OPD Directory</span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Find Doctors & Specialists</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
            Book a digital OPD token with top-rated medical specialists and monitor queue wait times.
          </p>
        </div>

        {predictedDisease && (
          <div className="card" style={{ background: 'var(--gradient-card)', border: '1px solid var(--primary-blue-light)', marginBottom: '2.5rem', padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: 700, textTransform: 'uppercase' }}>AI Diagnosis Suggestion</span>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--neutral-900)' }}>
                  Matched Condition: <strong>{predictedDisease}</strong>
                </h3>
                <p style={{ color: 'var(--neutral-600)', fontSize: '0.9rem', margin: 0 }}>
                  Recommended Department: <strong>{suggestedSpecialist}</strong>
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setSelectedDept(suggestedSpecialist)}>
                Filter {suggestedSpecialist} Doctors
              </button>
            </div>
          </div>
        )}

        {/* Search Bar & Department Filter Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by doctor name, specialty, or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.75rem', height: '52px', fontSize: '1rem' }}
            />
            <Search size={20} color="var(--neutral-400)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'General Medicine', 'Pediatrics', 'Cardiology', 'Neurology', 'Dermatology', 'Orthopedics'].map((dept, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDept(dept)}
                className={`btn btn-sm ${selectedDept === dept ? 'btn-primary' : 'btn-outline'}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {filteredDoctors.map((doc, idx) => (
            <div key={idx} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                      {doc.doctor.split(' ')[1]?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{doc.doctor}</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: 700 }}>{doc.department}</span>
                    </div>
                  </div>
                  <span className="badge badge-success">{doc.status}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--neutral-600)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="var(--neutral-400)" />
                    <span>{doc.hospital} ({doc.location})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="var(--neutral-400)" />
                    <span>Est. OPD Wait Time: <strong>{doc.wait}</strong></span>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleBookToken(doc)}>
                <span>Generate Digital OPD Token</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
