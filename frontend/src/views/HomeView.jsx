import React, { useState, useEffect } from 'react';
import {
  Sparkles, ArrowRight, Shield, Zap, Clock, Users,
  Activity, CheckCircle2, AlertTriangle, FileText,
  Calendar, Stethoscope, ChevronRight, MessageSquare
} from 'lucide-react';

export default function HomeView({ navigate }) {
  const [activeTab, setActiveTab] = useState('patients');
  const [typedText, setTypedText] = useState('');
  const fullText = "High fever, headache, severe chills...";
  const [tokenNum, setTokenNum] = useState('#A-042');

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        setTimeout(() => { index = 0; }, 2000);
      }
    }, 90);

    const tokenInterval = setInterval(() => {
      const tokens = ['#A-042', '#A-043', '#A-044', '#A-045'];
      setTokenNum(prev => {
        const idx = tokens.indexOf(prev);
        return tokens[(idx + 1) % tokens.length];
      });
    }, 4000);

    return () => {
      clearInterval(typingInterval);
      clearInterval(tokenInterval);
    };
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 6rem',
        background: 'var(--gradient-hero)',
        borderBottom: '1px solid var(--neutral-200)'
      }}>
        {/* Background Glowing Orbs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.15)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '5%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(124, 58, 237, 0.12)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Left Hero Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--primary-blue)',
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(37, 99, 235, 0.2)'
              }}>
                <Sparkles size={16} />
                <span>AI-Powered Healthcare Ecosystem</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
                color: 'var(--neutral-900)'
              }}>
                Smart Healthcare Starts with{' '}
                <span className="gradient-text">Smart Care</span>
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: 'var(--neutral-600)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '560px'
              }}>
                AI-driven symptom triage meets intelligent OPD queue management. Get instant diagnostic insights, specialist matching, and eliminate hospital waiting room chaos with digital OPD tokens.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => navigate('symptom-analysis')}
                >
                  <span>Try Symptom Analyzer</span>
                  <ArrowRight size={20} />
                </button>
                <button
                  className="btn btn-outline btn-large"
                  onClick={() => navigate('login')}
                >
                  <span>Portal Sign In</span>
                </button>
              </div>

              {/* Live Statistics Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: 'var(--radius-2xl)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-blue)', fontFamily: 'var(--font-display)' }}>95%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Triage Match Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success-green)', fontFamily: 'var(--font-display)' }}>60%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>Wait Time Reduced</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary-violet)', fontFamily: 'var(--font-display)' }}>24/7</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', fontWeight: 600 }}>AI Availability</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* AI Analysis Floating Card */}
              <div className="card card-glass card-hover" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success-green)', animation: 'pulseGlow 2s infinite' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--neutral-800)' }}>AI Live Analysis</span>
                  </div>
                  <span className="badge badge-primary">Model Active</span>
                </div>

                <div style={{
                  background: 'var(--neutral-900)',
                  color: '#38bdf8',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-xl)',
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  marginBottom: '1rem',
                  minHeight: '52px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {typedText}<span style={{ animation: 'fadeIn 0.5s infinite' }}>|</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--neutral-50)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--neutral-200)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>Identified Specialist:</span>
                    <div style={{ fontWeight: 700, color: 'var(--neutral-900)' }}>General Physician / Internal Medicine</div>
                  </div>
                  <span className="badge badge-warning">Moderate Risk</span>
                </div>
              </div>

              {/* Digital Token Ticket Preview */}
              <div className="card" style={{
                background: 'var(--gradient-primary)',
                color: 'white',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-2xl)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Digital OPD Token</span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Live Queue</span>
                </div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                  {tokenNum}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', opacity: 0.9, marginTop: '1rem' }}>
                  <span>Queue Position: <strong>3rd in line</strong></span>
                  <span>Est. Wait: <strong>15 mins</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '6rem 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Process Flow</span>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>How Smart Care Works</h2>
            <p style={{ color: 'var(--neutral-500)', fontSize: '1.05rem' }}>
              A seamless patient journey from initial symptom entry to expert consultation.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.75rem'
          }}>
            <ProcessCard step="1" icon={<FileText size={24} color="var(--primary-blue)" />} title="Enter Symptoms" desc="Describe how you feel in plain conversational language." tags={['Natural Input', 'Instant']} />
            <ProcessCard step="2" icon={<Activity size={24} color="var(--secondary-violet)" />} title="AI Analysis" desc="Machine learning engine analyzes condition & assigns risk level." tags={['ML Prediction', 'Triage']} />
            <ProcessCard step="3" icon={<Stethoscope size={24} color="var(--accent-teal)" />} title="Doctor Matching" desc="Matches you with the right available specialist nearby." tags={['Smart Route', 'Doctor Finder']} />
            <ProcessCard step="4" icon={<Zap size={24} color="var(--warning-orange)" />} title="Digital OPD Token" desc="Generates live paperless token with instant wait calculations." tags={['QR Pass', 'Real-Time']} />
            <ProcessCard step="5" icon={<CheckCircle2 size={24} color="var(--success-green)" />} title="Track & Consult" desc="Monitor live position from home and arrive right on time." tags={['Zero Crowd', 'Notifications']} />
          </div>
        </div>
      </section>

      {/* Interactive Features Tab Matrix */}
      <section style={{ padding: '6rem 0', background: 'var(--neutral-50)', borderTop: '1px solid var(--neutral-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Tailored Experiences</span>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Powerful Features for Everyone</h2>
          </div>

          {/* Role Filter Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '3rem'
          }}>
            <TabButton active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} label="For Patients" />
            <TabButton active={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} label="For Doctors" />
            <TabButton active={activeTab === 'hospitals'} onClick={() => setActiveTab('hospitals')} label="For Hospitals" />
          </div>

          {/* Tab Content Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {activeTab === 'patients' && (
              <>
                <FeatureCard title="Risk Level Detection" desc="Clear triage categorization (Low, Moderate, High, Emergency)." action={() => navigate('risk-assessment')} icon={<Shield color="var(--primary-blue)" />} />
                <FeatureCard title="Specialist Recommendation" desc="Smart algorithm matches symptoms to ideal medical department." action={() => navigate('doctor-suggestion')} icon={<Stethoscope color="var(--secondary-violet)" />} />
                <FeatureCard title="Digital OPD Tickets" desc="Paperless QR code tokens managed entirely on your smartphone." action={() => navigate('digital-token')} icon={<Zap color="var(--warning-orange)" />} />
                <FeatureCard title="Live Wait Estimates" desc="Calculates remaining wait minutes based on real doctor consultation pace." action={() => navigate('waiting-time')} icon={<Clock color="var(--success-green)" />} />
              </>
            )}

            {activeTab === 'doctors' && (
              <>
                <FeatureCard title="Patient Queue Dashboard" desc="View and call incoming patients in real-time with automated queue step controls." action={() => navigate('login')} icon={<Users color="var(--primary-blue)" />} />
                <FeatureCard title="Pre-Consultation Insights" desc="Review AI-extracted symptom history before patient enters consultation." action={() => navigate('login')} icon={<Activity color="var(--secondary-violet)" />} />
                <FeatureCard title="Priority Flag Alerts" desc="Emergency cases automatically bump to top of consultation schedule." action={() => navigate('login')} icon={<AlertTriangle color="var(--danger-red)" />} />
                <FeatureCard title="Interactive Calendar" desc="Manage consultation appointments, shifts, and scheduled visits." action={() => navigate('login')} icon={<Calendar color="var(--success-green)" />} />
              </>
            )}

            {activeTab === 'hospitals' && (
              <>
                <FeatureCard title="Multi-Department Console" desc="Manage active queue limits, duty doctors, and emergency overrides across departments." action={() => navigate('login')} icon={<Activity color="var(--primary-blue)" />} />
                <FeatureCard title="Staff Availability Controls" desc="Update doctor shift status (Available, On Duty, Off Duty) dispatching live notifications." action={() => navigate('login')} icon={<Users color="var(--success-green)" />} />
                <FeatureCard title="Emergency Swap Support" desc="One-click doctor emergency swap for high-traffic departments." action={() => navigate('login')} icon={<Zap color="var(--warning-orange)" />} />
                <FeatureCard title="Digital Transformation" desc="Completely eliminate physical OPD paper queues and front-desk overcrowding." action={() => navigate('login')} icon={<Shield color="var(--secondary-violet)" />} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Emergency Alert Priority Section */}
      <section style={{ padding: '5rem 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: 'var(--radius-2xl)',
            padding: '3.5rem 2.5rem',
            color: 'white',
            boxShadow: 'var(--shadow-2xl)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1rem'
              }}>
                <AlertTriangle size={18} />
                <span>Urgent Care Triage</span>
              </div>

              <h2 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '1rem' }}>
                Emergency Detection & Priority Queue Bypass
              </h2>

              <p style={{ color: 'var(--neutral-300)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Our AI continuously evaluates high-risk indicators (such as chest pain or breathing distress). When detected, the system immediately flags the digital token as <strong>URGENT</strong>, alerts medical staff, and routes the patient directly.
              </p>

              <button
                className="btn btn-danger btn-large"
                onClick={() => navigate('risk-assessment')}
              >
                <span>Check Symptoms Now</span>
                <ArrowRight size={20} />
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1.25rem'
            }}>
              <EmergencyFeature title="Instant Critical Detection" desc="Rule-based & ML classification detects emergency red flags immediately." />
              <EmergencyFeature title="Automated Priority Routing" desc="Emergency tokens bypass standard queues directly to triage desk." />
              <EmergencyFeature title="Staff Notification Broadcast" desc="Alerts on-duty clinical team with real-time patient symptom summary." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProcessCard({ step, icon, title, desc, tags }) {
  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--neutral-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-300)', fontFamily: 'var(--font-display)' }}>0{step}</span>
      </div>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>{desc}</p>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {tags.map((t, idx) => (
          <span key={idx} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.75rem 1.75rem',
        borderRadius: 'var(--radius-full)',
        fontWeight: 700,
        fontSize: '0.95rem',
        cursor: 'pointer',
        border: '1px solid',
        transition: 'all var(--transition-fast)',
        borderColor: active ? 'var(--primary-blue)' : 'var(--neutral-200)',
        background: active ? 'var(--primary-blue)' : 'var(--white)',
        color: active ? 'var(--white)' : 'var(--neutral-700)',
        boxShadow: active ? '0 4px 14px var(--primary-glow)' : 'none'
      }}
    >
      {label}
    </button>
  );
}

function FeatureCard({ title, desc, action, icon }) {
  return (
    <div
      className="card card-hover"
      onClick={action}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--neutral-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          {icon}
        </div>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>{desc}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.85rem' }}>
        <span>Explore Feature</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
}

function EmergencyFeature({ title, desc }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h4 style={{ color: 'white', fontSize: '1.05rem', marginBottom: '0.35rem' }}>{title}</h4>
      <p style={{ color: 'var(--neutral-300)', fontSize: '0.85rem' }}>{desc}</p>
    </div>
  );
}
