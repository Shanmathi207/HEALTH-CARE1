import React, { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle2, AlertTriangle, ArrowRight, XCircle, RefreshCw } from 'lucide-react';

export default function DigitalTokenView({ navigate }) {
  const [tokenData, setTokenData] = useState(null);
  const [urgent, setUrgent] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Booked, 2: Checked In, 3: In Room, 4: Completed

  useEffect(() => {
    loadOrCreateToken();
  }, []);

  const loadOrCreateToken = () => {
    const raw = localStorage.getItem('currentToken');
    const docRaw = localStorage.getItem('selectedDoctor');
    const patientName = localStorage.getItem('smartcare_user_name') || 'Alex Morgan';

    if (raw) {
      try {
        setTokenData(JSON.parse(raw));
      } catch (e) {
        generateNewToken(docRaw, patientName);
      }
    } else {
      generateNewToken(docRaw, patientName);
    }
  };

  const generateNewToken = (docRaw, patientName) => {
    const doc = docRaw ? JSON.parse(docRaw) : { doctor: 'Dr. Selvarani', hospital: 'City General Hospital', department: 'Cardiology' };
    const randomSeed = Math.floor((Math.random() * Date.now()) % 90) + 10;
    const tokenNumber = 'A-' + randomSeed;
    const queuePosition = Math.floor(Math.random() * 6) + 1;
    const waitMinutes = queuePosition * 5;
    const now = new Date();

    const newToken = {
      tokenNumber,
      queuePosition,
      waitMinutes,
      doctor: doc,
      patientName,
      generatedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    };

    localStorage.setItem('currentToken', JSON.stringify(newToken));
    setTokenData(newToken);
  };

  const handleAdvanceQueue = () => {
    if (!tokenData) return;
    if (tokenData.queuePosition > 1) {
      const updated = {
        ...tokenData,
        queuePosition: tokenData.queuePosition - 1,
        waitMinutes: Math.max(0, (tokenData.queuePosition - 1) * 5)
      };
      if (updated.queuePosition === 1) setCurrentStep(2);
      setTokenData(updated);
      localStorage.setItem('currentToken', JSON.stringify(updated));
    } else if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleCancelToken = () => {
    if (window.confirm("Are you sure you want to cancel your digital OPD token?")) {
      localStorage.removeItem('currentToken');
      navigate('patient-home');
    }
  };

  if (!tokenData) return null;

  return (
    <div style={{ padding: '3rem 1.5rem', background: 'var(--neutral-50)', minHeight: 'calc(100vh - 76px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: '440px', width: '100%', position: 'relative' }}>
        {/* Urgent Priority Flag */}
        {urgent && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '-1rem',
            background: 'var(--danger-red)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.35rem 2rem',
            transform: 'rotate(45deg)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 10
          }}>
            URGENT
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-2xl)', borderRadius: 'var(--radius-2xl)' }}>
          {/* Hospital Top Banner */}
          <div style={{ background: 'var(--primary-blue)', color: 'white', padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem' }}>
              <Ticket size={24} />
              <span>Smart Care Health</span>
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              {tokenData.doctor?.hospital || 'City General Hospital'} • OPD Pass
            </div>
          </div>

          {/* Date & Priority Ribbon */}
          <div style={{ background: urgent ? '#fef2f2' : '#f0fdf4', color: urgent ? 'var(--danger-red)' : '#15803d', padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            <span>Valid Today • {tokenData.date}</span>
            <button
              onClick={() => setUrgent(!urgent)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {urgent ? 'Priority: Urgent' : 'Set Urgent Flag'}
            </button>
          </div>

          {/* Token Ticket Body */}
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
              {tokenData.doctor?.department || 'General OPD'} Department
            </span>

            <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 700, textTransform: 'uppercase' }}>Digital Token Number</div>
            <div style={{ fontSize: '4.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--neutral-900)', lineHeight: 1, margin: '0.3rem 0 1.5rem', letterSpacing: '-0.03em' }}>
              {tokenData.tokenNumber}
            </div>

            {/* Queue Progress Steps */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0.75rem', background: 'var(--neutral-100)', borderRadius: 'var(--radius-xl)' }}>
              <StepItem label="Booked" active={currentStep >= 1} />
              <StepItem label="Check-In" active={currentStep >= 2} />
              <StepItem label="In Room" active={currentStep >= 3} />
              <StepItem label="Complete" active={currentStep >= 4} />
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', textAlign: 'left', background: 'var(--neutral-50)', padding: '1.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--neutral-200)', marginBottom: '1.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 700 }}>Patient</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neutral-900)' }}>{tokenData.patientName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 700 }}>Assigned Doctor</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neutral-900)' }}>{tokenData.doctor?.doctor || 'Dr. Selvarani'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 700 }}>Generated At</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neutral-900)' }}>{tokenData.generatedAt}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 700 }}>Est. Wait Time</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{tokenData.waitMinutes} mins</div>
              </div>
            </div>

            {/* QR Code */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '2px dashed var(--neutral-200)' }}>
              <div style={{ padding: '0.5rem', background: 'white', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-lg)' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=SmartCare-Token-${tokenData.tokenNumber}`}
                  alt="Token QR Code"
                  style={{ width: '130px', height: '130px', display: 'block' }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>Scan at reception for instant check-in</span>
            </div>

            {/* Actions Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }} onClick={() => navigate('waiting-time')}>
                <span>Track Live Queue Progress</span>
                <ArrowRight size={18} />
              </button>

              <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleAdvanceQueue}>
                <RefreshCw size={16} />
                <span>Simulate Queue Advance (Next)</span>
              </button>

              <button className="btn btn-outline" style={{ width: '100%', color: 'var(--danger-red)', borderColor: '#fecaca' }} onClick={handleCancelToken}>
                <XCircle size={16} />
                <span>Cancel / Skip Token</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({ label, active }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: active ? 'var(--primary-blue)' : 'var(--neutral-300)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.65rem',
        fontWeight: 800
      }}>
        {active ? '✓' : ''}
      </div>
      <span style={{ fontSize: '0.7rem', fontWeight: active ? 700 : 500, color: active ? 'var(--neutral-900)' : 'var(--neutral-400)' }}>{label}</span>
    </div>
  );
}
