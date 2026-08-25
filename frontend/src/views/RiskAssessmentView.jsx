import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Activity, ArrowRight, PhoneCall, Ticket } from 'lucide-react';

export default function RiskAssessmentView({ navigate }) {
  const [chestPain, setChestPain] = useState(false);
  const [breathingDistress, setBreathingDistress] = useState(false);
  const [highFever, setHighFever] = useState(false);
  const [fainting, setFainting] = useState(false);
  const [duration, setDuration] = useState('Less than 24 hours');
  const [ageGroup, setAgeGroup] = useState('Adult (18-60)');

  const [evaluatedRisk, setEvaluatedRisk] = useState(null);

  const handleEvaluate = (e) => {
    e.preventDefault();

    let score = 0;
    if (chestPain) score += 5;
    if (breathingDistress) score += 4;
    if (fainting) score += 3;
    if (highFever) score += 2;

    let riskLevel = 'LOW';
    let recommendation = 'Standard OPD Visit recommended. Generate a digital OPD token for consultation.';

    if (score >= 5) {
      riskLevel = 'EMERGENCY';
      recommendation = 'CRITICAL: Immediate medical emergency detected. Bypass standard queue and report directly to Triage Desk or call Emergency.';
    } else if (score >= 3) {
      riskLevel = 'HIGH';
      recommendation = 'HIGH PRIORITY: Urgent consultation recommended today. Priority OPD token generated.';
    } else if (score >= 2) {
      riskLevel = 'MODERATE';
      recommendation = 'MODERATE RISK: General OPD visit advised within 24 hours.';
    }

    setEvaluatedRisk({ riskLevel, score, recommendation });
  };

  return (
    <div style={{ padding: '3rem 0', background: 'var(--neutral-50)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
          <span className="badge badge-danger" style={{ marginBottom: '0.5rem' }}>Emergency Triage</span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Medical Risk Assessment Tool</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
            Answer these quick clinical indicators for immediate triage classification and priority queue routing.
          </p>
        </div>

        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '2.25rem' }}>
            <form onSubmit={handleEvaluate}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Severe Red-Flag Symptoms:</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                <label style={checkboxCardStyle(chestPain)}>
                  <input type="checkbox" checked={chestPain} onChange={(e) => setChestPain(e.target.checked)} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--neutral-900)' }}>Severe Chest Pain or Pressure</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>Radiating to neck, jaw, or left arm</div>
                  </div>
                </label>

                <label style={checkboxCardStyle(breathingDistress)}>
                  <input type="checkbox" checked={breathingDistress} onChange={(e) => setBreathingDistress(e.target.checked)} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--neutral-900)' }}>Sudden Shortness of Breath</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>Difficulty speaking full sentences</div>
                  </div>
                </label>

                <label style={checkboxCardStyle(fainting)}>
                  <input type="checkbox" checked={fainting} onChange={(e) => setFainting(e.target.checked)} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--neutral-900)' }}>Fainting, Dizziness, or Confusion</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>Loss of consciousness or disorientation</div>
                  </div>
                </label>

                <label style={checkboxCardStyle(highFever)}>
                  <input type="checkbox" checked={highFever} onChange={(e) => setHighFever(e.target.checked)} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--neutral-900)' }}>High Fever (&gt; 102°F)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>Persisting despite medication</div>
                  </div>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <label className="form-label">Symptom Duration</label>
                  <select className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option value="Sudden Onset">Sudden Onset (&lt; 1 hour)</option>
                    <option value="Less than 24 hours">Less than 24 hours</option>
                    <option value="1-3 Days">1-3 Days</option>
                    <option value="More than 3 Days">More than 3 Days</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Patient Age Group</label>
                  <select className="form-control" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                    <option value="Pediatric (< 12)">Pediatric (&lt; 12)</option>
                    <option value="Adult (18-60)">Adult (18-60)</option>
                    <option value="Senior (60+)">Senior (60+)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}>
                <Activity size={18} />
                <span>Evaluate Clinical Triage Score</span>
              </button>
            </form>

            {evaluatedRisk && (
              <div style={{ marginTop: '2rem', padding: '1.75rem', borderRadius: 'var(--radius-xl)', border: '2px solid', borderColor: evaluatedRisk.riskLevel === 'EMERGENCY' ? 'var(--danger-red)' : evaluatedRisk.riskLevel === 'HIGH' ? 'var(--warning-orange)' : 'var(--success-green)', background: evaluatedRisk.riskLevel === 'EMERGENCY' ? '#fef2f2' : '#f0fdf4', animation: 'slideUp var(--transition-base)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-600)', textTransform: 'uppercase' }}>Triage Classification</span>
                  <span className={`badge ${evaluatedRisk.riskLevel === 'EMERGENCY' ? 'badge-danger' : evaluatedRisk.riskLevel === 'HIGH' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                    {evaluatedRisk.riskLevel} PRIORITY
                  </span>
                </div>

                <p style={{ fontSize: '1rem', color: 'var(--neutral-900)', fontWeight: 600, lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {evaluatedRisk.recommendation}
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {evaluatedRisk.riskLevel === 'EMERGENCY' ? (
                    <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => alert('Dispatching emergency priority alert to hospital triage team!')}>
                      <PhoneCall size={18} />
                      <span>Contact Hospital Triage Desk (108 / Emergency)</span>
                    </button>
                  ) : (
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('digital-token')}>
                      <Ticket size={18} />
                      <span>Generate OPD Token Pass</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const checkboxCardStyle = (checked) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1rem 1.25rem',
  borderRadius: 'var(--radius-xl)',
  border: checked ? '2px solid var(--primary-blue)' : '1px solid var(--neutral-200)',
  background: checked ? 'rgba(37,99,235,0.05)' : 'var(--white)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)'
});
