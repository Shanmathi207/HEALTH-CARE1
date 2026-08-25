import React from 'react';
import { Activity, ShieldCheck, Heart, Mail, MapPin } from 'lucide-react';

export default function Footer({ navigate }) {
  return (
    <footer style={{
      background: 'var(--neutral-900)',
      color: 'var(--white)',
      paddingTop: '4rem',
      paddingBottom: '2.5rem',
      borderTop: '1px solid var(--neutral-800)',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Activity size={22} />
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.3rem',
                color: 'white'
              }}>
                Smart<span style={{ color: 'var(--primary-blue-light)' }}>Care</span>
              </span>
            </div>
            <p style={{
              color: 'var(--neutral-400)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '1.25rem'
            }}>
              Next-generation healthcare ecosystem combining Machine Learning symptom evaluation with digital OPD queue orchestration.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--neutral-400)', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="var(--success-green)" /> Encrypted & Secure
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.25rem', fontSize: '1.05rem' }}>Platform Features</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <button onClick={() => navigate('symptom-analysis')} style={footerLinkStyle}>
                  AI Symptom Analyzer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('doctor-suggestion')} style={footerLinkStyle}>
                  Doctor & Specialist Matching
                </button>
              </li>
              <li>
                <button onClick={() => navigate('digital-token')} style={footerLinkStyle}>
                  Digital OPD Token Ticket
                </button>
              </li>
              <li>
                <button onClick={() => navigate('risk-assessment')} style={footerLinkStyle}>
                  Risk & Emergency Triage
                </button>
              </li>
              <li>
                <button onClick={() => navigate('waiting-time')} style={footerLinkStyle}>
                  Queue Wait-Time Monitor
                </button>
              </li>
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.25rem', fontSize: '1.05rem' }}>Portals & Roles</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <button onClick={() => navigate('login')} style={footerLinkStyle}>
                  Patient Portal Access
                </button>
              </li>
              <li>
                <button onClick={() => navigate('login')} style={footerLinkStyle}>
                  Doctor Workspace Login
                </button>
              </li>
              <li>
                <button onClick={() => navigate('login')} style={footerLinkStyle}>
                  Hospital Admin Console
                </button>
              </li>
              <li>
                <button onClick={() => navigate('risk-assessment')} style={footerLinkStyle}>
                  Emergency Priority Routing
                </button>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.25rem', fontSize: '1.05rem' }}>Contact & Demo</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'var(--neutral-400)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="var(--primary-blue-light)" />
                <span>smartcare@healthcare.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} color="var(--primary-blue-light)" />
                <span>College Project / Hackathon Build</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
                Designed for educational demonstration & smart queue optimization.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{
          borderTop: '1px solid var(--neutral-800)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--neutral-500)'
        }}>
          <div>
            © 2026 Smart Care. Built with React for intelligent healthcare management.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Medical Disclaimer: Demo environment for academic evaluation.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerLinkStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--neutral-400)',
  fontSize: '0.9rem',
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left',
  transition: 'color var(--transition-fast)'
};
