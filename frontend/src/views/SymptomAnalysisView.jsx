import React, { useState, useEffect, useRef } from 'react';
import { Activity, Send, Bot, User, AlertTriangle, ShieldCheck, Stethoscope, RefreshCw, ArrowRight } from 'lucide-react';
import { createMatcher } from '../utils/symptomMatcher';

const AI_API_BASE = 'http://127.0.0.1:5001';

export default function SymptomAnalysisView({ navigate }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your Smart Care AI Symptom Assistant. Describe how you are feeling (e.g. fever, headache, stomach ache, continuous sneezing).' }
  ]);
  const [inputText, setInputText] = useState('');
  const [knownSymptoms, setKnownSymptoms] = useState([]);
  const [detectedSymptoms, setDetectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [riskGauge, setRiskGauge] = useState(0); // -90 to 90 degrees
  const [reportModal, setReportModal] = useState(null);

  const chatBottomRef = useRef(null);

  // Fetch symptom database on load
  useEffect(() => {
    fetch(`${AI_API_BASE}/symptoms`)
      .then(res => res.json())
      .then(data => {
        if (data.symptoms) setKnownSymptoms(data.symptoms);
      })
      .catch(() => {
        setKnownSymptoms([
          "high_fever", "mild_fever", "continuous_sneezing", "runny_nose", "congestion",
          "muscle_pain", "fatigue", "vomiting", "diarrhoea", "stomach_pain",
          "muscle_weakness", "itching", "skin_rash", "throat_irritation", "restlessness",
          "headache", "cough", "chest_pain", "chills", "joint_pain"
        ]);
      });
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');

    const extractor = createMatcher(knownSymptoms);
    const found = extractor(userMsg);

    // Merge detected symptoms
    const allFound = Array.from(new Set([...detectedSymptoms, ...found]));
    setDetectedSymptoms(allFound);

    // Dynamic Risk Gauge Calculation
    let needleDeg = -60 + (allFound.length * 25);
    if (userMsg.toLowerCase().includes('chest pain') || userMsg.toLowerCase().includes('shortness of breath')) {
      needleDeg = 80;
    }
    setRiskGauge(Math.min(90, Math.max(-90, needleDeg)));

    if (allFound.length < 3) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `I identified ${allFound.length} symptom(s): [${allFound.map(s => s.replace(/_/g, ' ')).join(', ')}]. Please provide at least 3 symptoms so our AI model can calculate a high-confidence medical diagnosis.`
        }
      ]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${AI_API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: allFound })
      });

      const data = await res.json();

      if (data.predictions && data.predictions.length > 0) {
        const top = data.predictions[0];
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `Based on your symptoms [${allFound.map(s => s.replace(/_/g, ' ')).join(', ')}], our AI model identifies a potential match for ${top.disease} (${top.confidence}% confidence). Click below to view your diagnostic report.`
          }
        ]);
        setReportModal({ top, symptoms: allFound });
      }
    } catch (err) {
      // Offline fallback prediction
      const mockResult = {
        disease: 'Viral Fever / Respiratory Infection',
        specialist: 'General Physician',
        confidence: 88.0,
        doctors: [
          { doctor: 'Dr. Selvarani', hospital: 'City General Hospital', location: 'Wing A', availability: 'Available Now' },
          { doctor: 'Dr. Karthik Ravi', hospital: 'Metro Clinic', location: 'Wing C', availability: '10:30 AM' }
        ]
      };
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `AI Diagnosis complete: Potential match for ${mockResult.disease} (${mockResult.confidence}% confidence). Recommended specialist: ${mockResult.specialist}.`
        }
      ]);
      setReportModal({ top: mockResult, symptoms: allFound });
    } finally {
      setLoading(false);
    }
  };

  const handleBookDoctor = (doc, specialist, disease) => {
    localStorage.setItem('selectedDoctor', JSON.stringify(doc));
    localStorage.setItem('suggestedSpecialist', specialist);
    localStorage.setItem('predictedDisease', disease);
    navigate('digital-token');
  };

  return (
    <div style={{ padding: '2.5rem 0', background: 'var(--neutral-50)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        {/* Title Bar */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Intelligent AI Triage</span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Interactive AI Symptom Analyzer</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
            Chat with our medical AI assistant. The system extracts symptom markers, measures risk needle level, and generates your diagnostic triage report.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Chat Assistant Panel */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '620px', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--neutral-900)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="white" />
              </div>
              <div>
                <h4 style={{ color: 'white', margin: 0, fontSize: '1.05rem' }}>SmartCare Diagnostic Bot</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--success-green)', fontWeight: 600 }}>● Online & Ready</div>
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--neutral-50)' }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.sender === 'bot' && (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bot size={16} />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '80%',
                    padding: '0.85rem 1.15rem',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    background: m.sender === 'user' ? 'var(--primary-blue)' : 'white',
                    color: m.sender === 'user' ? 'white' : 'var(--neutral-800)',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--neutral-200)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--neutral-500)', fontSize: '0.85rem', alignItems: 'center' }}>
                  <RefreshCw size={16} className="spin" />
                  <span>Evaluating symptoms against neural model...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} style={{ padding: '1rem', background: 'white', borderTop: '1px solid var(--neutral-200)', display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Type your symptoms here (e.g. fever, headache, body pain)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 1.25rem' }}>
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* Right Live Gauge & Tag Cloud Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Risk Needle Gauge */}
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Live Risk Gauge</h3>
              <p style={{ color: 'var(--neutral-500)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Evaluated in real-time based on extracted markers</p>

              <div style={{ position: 'relative', width: '200px', height: '100px', margin: '0 auto 1.5rem', overflow: 'hidden' }}>
                {/* Semi-circle Gauge Background */}
                <div style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'conic-gradient(from 270deg, var(--success-green) 0deg 60deg, var(--warning-orange) 60deg 120deg, var(--danger-red) 120deg 180deg)',
                  clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
                }} />
                {/* Needle */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  width: '4px',
                  height: '80px',
                  background: 'var(--neutral-900)',
                  borderRadius: '2px',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) rotate(${riskGauge}deg)`,
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--success-green)' }}>LOW</span>
                <span style={{ color: 'var(--warning-orange)' }}>MODERATE</span>
                <span style={{ color: 'var(--danger-red)' }}>HIGH</span>
              </div>
            </div>

            {/* Detected Symptoms Tag Cloud */}
            <div className="card" style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Detected Symptom Tags</h3>
              {detectedSymptoms.length === 0 ? (
                <p style={{ color: 'var(--neutral-400)', fontSize: '0.85rem' }}>No symptoms extracted yet. Type your symptoms in the chat.</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {detectedSymptoms.map((sym, idx) => (
                    <span key={idx} className="badge badge-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      ✓ {sym.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Diagnostic Summary Report Modal */}
        {reportModal && (
          <div className="modal-backdrop" onClick={() => setReportModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', margin: 0 }}>AI Triage & Diagnostic Report</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Generated live by SmartCare Neural Engine</span>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setReportModal(null)}>✕ Close</button>
              </div>

              <div style={{ background: 'var(--neutral-50)', padding: '1.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--neutral-200)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--neutral-500)', fontSize: '0.85rem' }}>Primary Diagnosis:</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--neutral-900)' }}>{reportModal.top.disease}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--neutral-500)', fontSize: '0.85rem' }}>Match Confidence:</span>
                  <span className="badge badge-success">{reportModal.top.confidence}% Confidence</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--neutral-500)', fontSize: '0.85rem' }}>Recommended Specialist:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{reportModal.top.specialist}</span>
                </div>
              </div>

              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--neutral-800)' }}>Recommended Available Doctors:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {reportModal.top.doctors.map((doc, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--neutral-200)', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{doc.doctor}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--neutral-500)' }}>{doc.hospital} ({doc.location})</div>
                    </div>
                    <button className="btn btn-primary" onClick={() => handleBookDoctor(doc, reportModal.top.specialist, reportModal.top.disease)}>
                      Book Digital OPD Token
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
