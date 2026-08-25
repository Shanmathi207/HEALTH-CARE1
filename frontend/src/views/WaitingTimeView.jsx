import React, { useState, useEffect } from 'react';
import { Clock, Ticket, Users, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export default function WaitingTimeView({ navigate }) {
  const [activeToken, setActiveToken] = useState(null);
  const [servingToken, setServingToken] = useState('A-35');
  const [minsRemaining, setMinsRemaining] = useState(15);
  const [patientsAhead, setPatientsAhead] = useState(3);

  useEffect(() => {
    const raw = localStorage.getItem('currentToken');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setActiveToken(parsed);
        setMinsRemaining(parsed.waitMinutes || 15);
        setPatientsAhead(parsed.queuePosition || 3);
      } catch (e) {}
    }

    const timer = setInterval(() => {
      setMinsRemaining(prev => Math.max(1, prev - 1));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '3rem 0', background: 'var(--neutral-50)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Live Queue Monitor</span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Real-Time Wait Estimates</h1>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.95rem' }}>
            Track OPD queue movement and estimated consultation timing live from anywhere.
          </p>
        </div>

        {/* Live Wait Time Counter Card */}
        <div className="card card-hover" style={{ maxWidth: '600px', margin: '0 auto 2.5rem', textAlignment: 'center', padding: '2.5rem', background: 'var(--gradient-card)', border: '1px solid var(--primary-blue-light)' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--neutral-500)', fontWeight: 700 }}>Your Digital Token</span>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--neutral-900)', margin: '0.2rem 0 1rem' }}>
              {activeToken ? activeToken.tokenNumber : '#A-042'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.5rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--neutral-200)', marginBottom: '1.75rem' }}>
              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary-blue)', fontFamily: 'var(--font-display)' }}>
                  {minsRemaining} mins
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Estimated Wait</div>
              </div>

              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--secondary-violet)', fontFamily: 'var(--font-display)' }}>
                  {patientsAhead}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Patients Ahead</div>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--neutral-600)', marginBottom: '1.5rem' }}>
              Currently Serving in OPD Room 102: <strong style={{ color: 'var(--neutral-900)' }}>#{servingToken}</strong>
            </p>

            <button className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }} onClick={() => navigate('digital-token')}>
              <Ticket size={18} />
              <span>View Full Digital Ticket Pass</span>
            </button>
          </div>
        </div>

        {/* Live OPD Status Board */}
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>OPD Live Display Board</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <StatusRow token="A-33" patient="R. Sharma" status="Completed" time="09:15 AM" color="var(--neutral-400)" />
            <StatusRow token="A-34" patient="M. Gupta" status="Completed" time="09:30 AM" color="var(--neutral-400)" />
            <StatusRow token="A-35" patient="Alex Morgan" status="IN CONSULTATION ROOM" time="09:45 AM" color="var(--primary-blue)" isServing />
            <StatusRow token="A-36" patient="Priya Sharma" status="Next in Line (Waiting)" time="10:00 AM" color="var(--warning-orange)" />
            <StatusRow token="A-37" patient="Rahul Verma" status="Waiting in Lobby" time="10:15 AM" color="var(--neutral-600)" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ token, patient, status, time, color, isServing }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.9rem 1.25rem',
      borderRadius: 'var(--radius-xl)',
      background: isServing ? 'rgba(37,99,235,0.08)' : 'var(--neutral-50)',
      border: isServing ? '2px solid var(--primary-blue)' : '1px solid var(--neutral-200)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--neutral-900)' }}>#{token}</span>
        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--neutral-800)' }}>{patient}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: color }}>{status}</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--neutral-400)' }}>{time}</span>
      </div>
    </div>
  );
}
