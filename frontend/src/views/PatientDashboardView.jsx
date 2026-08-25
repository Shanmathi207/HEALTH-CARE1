import React, { useState, useEffect } from 'react';
import {
  Activity, Ticket, Calendar, FileText, MessageSquare, Download, Upload,
  Clock, Stethoscope, ChevronRight, AlertCircle, CheckCircle2, User, RefreshCw
} from 'lucide-react';
import { createMatcher } from '../utils/symptomMatcher';

const AI_API_BASE = 'http://127.0.0.1:5001';

export default function PatientDashboardView({ user, navigate }) {
  const patientName = user?.name || localStorage.getItem('smartcare_user_name') || 'Alex Morgan';
  const userEmail = user?.email || localStorage.getItem('smartcare_user_email') || 'patient@example.com';

  const [activeToken, setActiveToken] = useState(null);
  const [symptomInput, setSymptomInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState('');
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [uploadedReports, setUploadedReports] = useState([]);

  // Load active token & localStorage data
  useEffect(() => {
    loadDashboardData();
  }, [userEmail]);

  const loadDashboardData = () => {
    // Token
    const rawToken = localStorage.getItem('currentToken');
    if (rawToken) {
      try { setActiveToken(JSON.parse(rawToken)); } catch (e) { setActiveToken(null); }
    } else {
      setActiveToken(null);
    }

    // Symptom History
    const rawHistory = localStorage.getItem('smartcare_symptom_history');
    if (rawHistory) {
      try { setSymptomHistory(JSON.parse(rawHistory)); } catch (e) { setSymptomHistory([]); }
    } else {
      const defaultHistory = [
        { text: 'Mild fever and dry cough', risk: 'Moderate', date: 'Yesterday, 4:30 PM' },
        { text: 'Headache after working on screen', risk: 'Low', date: '3 days ago' }
      ];
      setSymptomHistory(defaultHistory);
    }

    // Uploaded Reports per user
    const reportKey = `smartcare_uploaded_reports_${userEmail}`;
    const rawReports = localStorage.getItem(reportKey);
    if (rawReports) {
      try { setUploadedReports(JSON.parse(rawReports)); } catch (e) { setUploadedReports([]); }
    } else {
      setUploadedReports([]);
    }
  };

  // AI Symptom Analysis Trigger
  const handleAnalyzeSymptoms = async () => {
    setAiError('');
    setAiResult(null);

    if (!symptomInput.trim()) {
      setAiError('Please enter your symptoms in the box below first.');
      return;
    }

    const extractor = createMatcher([]);
    const matched = extractor(symptomInput);

    if (matched.length < 3) {
      setAiError(`Detected ${matched.length} symptom(s): [${matched.map(s => s.replace(/_/g, ' ')).join(', ')}]. Please enter at least 3 distinct symptoms (e.g. fever, headache, vomiting) for an accurate AI prediction.`);
      return;
    }

    setAnalyzing(true);

    try {
      const res = await fetch(`${AI_API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: matched })
      });

      const data = await res.json();

      if (data.error) {
        setAiError(data.error);
      } else if (data.predictions && data.predictions.length > 0) {
        const top = data.predictions[0];
        setAiResult(top);
        saveHistoryEntry(symptomInput, top);
      }
    } catch (err) {
      // Fallback offline mock prediction if Flask is offline
      const mockResult = {
        disease: 'Seasonal Flu / Viral Infection',
        specialist: 'General Physician',
        confidence: 85.5,
        doctors: [
          { doctor: 'Dr. Selvarani', hospital: 'City General Hospital', location: 'Wing A', availability: 'Available Now' },
          { doctor: 'Dr. Karthik Ravi', hospital: 'Metro Clinic', location: 'Wing C', availability: '10:30 AM' }
        ]
      };
      setAiResult(mockResult);
      saveHistoryEntry(symptomInput, mockResult);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveHistoryEntry = (text, result) => {
    const risk = result.confidence > 60 ? 'High' : result.confidence > 35 ? 'Moderate' : 'Low';
    const newEntry = {
      text: text.slice(0, 70),
      risk,
      date: new Date().toLocaleString()
    };
    const updated = [newEntry, ...symptomHistory].slice(0, 6);
    setSymptomHistory(updated);
    localStorage.setItem('smartcare_symptom_history', JSON.stringify(updated));
  };

  const handleSelectDoctor = (doc, specialist, disease) => {
    localStorage.setItem('selectedDoctor', JSON.stringify(doc));
    localStorage.setItem('suggestedSpecialist', specialist);
    localStorage.setItem('predictedDisease', disease);
    navigate('digital-token');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reportKey = `smartcare_uploaded_reports_${userEmail}`;
    const newReport = {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      date: new Date().toLocaleDateString()
    };
    const updated = [newReport, ...uploadedReports].slice(0, 8);
    setUploadedReports(updated);
    localStorage.setItem(reportKey, JSON.stringify(updated));
    e.target.value = '';
  };

  const downloadReportFile = () => {
    const content = [
      'Smart Care Patient Health Summary Report',
      '==========================================',
      `Patient Name: ${patientName}`,
      `Patient Email: ${userEmail}`,
      `Date Generated: ${new Date().toLocaleString()}`,
      '',
      'Recent Symptom Records:',
      ...(symptomHistory.length ? symptomHistory.map((item, idx) => `${idx + 1}. [${item.risk} Risk] ${item.text} (${item.date})`) : ['No symptom records logged yet.']),
      '',
      'Note: This document is produced for academic demonstration and medical reference.'
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-care-report-${patientName.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '2.5rem 0', background: 'var(--neutral-50)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
              Welcome back, <span className="gradient-text">{patientName}</span>
            </h1>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>Here is your personal health dashboard and live OPD status.</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('symptom-analysis')}>
              <Stethoscope size={18} />
              <span>Full Symptom Chatbot</span>
            </button>
          </div>
        </div>

        {/* Dashboard Top Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Active Token Ticket Card */}
          <div
            className="card"
            onClick={() => navigate('digital-token')}
            style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 700, opacity: 0.9 }}>Live OPD Token</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {activeToken ? 'Active Pass' : 'Demo Pass'}
              </span>
            </div>

            <div style={{ fontSize: '3.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: '0.5rem' }}>
              {activeToken ? activeToken.tokenNumber : '#A-042'}
            </div>

            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.25rem' }}>
              Est. Wait Time: <strong>{activeToken ? `${activeToken.waitMinutes} mins` : '15 mins'}</strong> • Department: {activeToken?.doctor?.hospital || 'General OPD'}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.2)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', background: 'white' }} />
            </div>
          </div>

          {/* Next Visit Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--neutral-800)' }}>Next Appointment</span>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={20} />
              </div>
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
              Tomorrow
            </div>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              10:30 AM • Dr. Selvarani (Cardiology)
            </p>

            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate('doctor-suggestion')}>
              Reschedule Visit
            </button>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--neutral-800)' }}>Health Profile</span>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: 'var(--success-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={20} />
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>
              PID #942
            </div>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Age: 28 • Blood Group: O+ • Verified Patient
            </p>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate('risk-assessment')}>
              Run Risk Calculator
            </button>
          </div>
        </div>

        {/* AI Symptom Suggestion Engine */}
        <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--gradient-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>AI Symptom Suggestion Engine</h3>
              <p style={{ color: 'var(--neutral-500)', fontSize: '0.85rem', margin: 0 }}>Describe your symptoms for an instant machine learning triage match.</p>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <textarea
              className="form-control"
              rows={3}
              placeholder='Enter symptoms e.g. "I have a high fever, headache, and severe vomiting since morning..."'
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              style={{ resize: 'vertical', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button className="btn btn-primary" onClick={handleAnalyzeSymptoms} disabled={analyzing}>
              {analyzing ? <RefreshCw size={18} className="spin" /> : <Activity size={18} />}
              <span>{analyzing ? 'Analyzing Symptoms...' : 'Analyze Symptoms'}</span>
            </button>
            <button className="btn btn-outline" onClick={() => { setSymptomInput(''); setAiResult(null); setAiError(''); }}>
              Clear
            </button>
          </div>

          {aiError && (
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-xl)', background: '#fef2f2', color: 'var(--danger-red)', border: '1px solid #fecaca', fontSize: '0.9rem', fontWeight: 600 }}>
              {aiError}
            </div>
          )}

          {aiResult && (
            <div style={{ background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', animation: 'fadeIn var(--transition-fast)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 700 }}>Predicted Condition</span>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--neutral-900)' }}>{aiResult.disease}</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>{aiResult.confidence}% Match Confidence</span>
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--neutral-700)', marginBottom: '1.25rem' }}>
                Recommended Specialist: <strong>{aiResult.specialist}</strong>
              </p>

              <h5 style={{ fontSize: '0.95rem', color: 'var(--neutral-600)', marginBottom: '0.75rem' }}>Available Doctors & Clinics:</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {aiResult.doctors.map((doc, idx) => (
                  <div key={idx} className="card" style={{ padding: '1rem', background: 'white' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--neutral-900)', marginBottom: '0.2rem' }}>{doc.doctor}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', marginBottom: '0.5rem' }}>{doc.hospital} • {doc.location}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--success-green)', fontWeight: 700 }}>{doc.availability}</span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSelectDoctor(doc, aiResult.specialist, aiResult.disease)}
                      >
                        Book Digital Token
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* History & Reports Double Column */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {/* Symptom History Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Symptom Checks</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {symptomHistory.map((item, idx) => (
                <div key={idx} style={{ padding: '0.85rem 1rem', background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.text}</span>
                    <span className={`badge ${item.risk === 'High' ? 'badge-danger' : item.risk === 'Moderate' ? 'badge-warning' : 'badge-success'}`}>
                      {item.risk} Risk
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health Reports Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Health Reports & Uploads</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Export your symptom log or upload prescriptions and lab reports for doctor review.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <button className="btn btn-primary btn-sm" onClick={downloadReportFile}>
                <Download size={16} />
                <span>Export Report</span>
              </button>

              <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                <Upload size={16} />
                <span>Upload Document</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
            </div>

            {uploadedReports.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {uploadedReports.map((rep, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.85rem', background: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                    <span>📄 {rep.name} <span style={{ color: 'var(--neutral-400)' }}>({rep.size})</span></span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neutral-400)' }}>{rep.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
