import React, { useState, useEffect } from 'react';
import { Activity, Bell, User, LogOut, Menu, X, Ticket, ShieldAlert, Clock, Stethoscope } from 'lucide-react';

export default function Navbar({ currentRoute, navigate, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeToken, setActiveToken] = useState(null);

  useEffect(() => {
    const tokenData = localStorage.getItem('currentToken');
    if (tokenData) {
      try {
        setActiveToken(JSON.parse(tokenData));
      } catch (e) {
        setActiveToken(null);
      }
    } else {
      setActiveToken(null);
    }
  }, [currentRoute]);

  const getDashboardRoute = () => {
    if (!user) return 'login';
    if (user.userType === 'patient') return 'patient-home';
    if (user.userType === 'doctor') return 'doctor-home';
    if (user.userType === 'hospital') return 'hospital-home';
    return 'patient-home';
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--neutral-200)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => navigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            <Activity size={24} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.35rem',
              color: 'var(--neutral-900)',
              letterSpacing: '-0.02em'
            }}>
              Smart<span style={{ color: 'var(--primary-blue)' }}>Care</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--neutral-500)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              AI OPD Platform
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.75rem'
        }} className="desktop-links">
          <button
            onClick={() => navigate('home')}
            style={navButtonStyle(currentRoute === 'home')}
          >
            Home
          </button>
          <button
            onClick={() => navigate('symptom-analysis')}
            style={navButtonStyle(currentRoute === 'symptom-analysis')}
          >
            AI Symptom Analyzer
          </button>
          <button
            onClick={() => navigate('doctor-suggestion')}
            style={navButtonStyle(currentRoute === 'doctor-suggestion')}
          >
            Find Doctor
          </button>
          <button
            onClick={() => navigate('risk-assessment')}
            style={navButtonStyle(currentRoute === 'risk-assessment')}
          >
            Risk Assessment
          </button>

          {user && (
            <button
              onClick={() => navigate(getDashboardRoute())}
              style={navButtonStyle(currentRoute === getDashboardRoute())}
            >
              Dashboard ({user.userType})
            </button>
          )}
        </div>

        {/* Action Controls & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {activeToken && (
            <button
              onClick={() => navigate('digital-token')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                background: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--primary-blue)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Ticket size={16} />
              <span>Token #{activeToken.tokenNumber}</span>
            </button>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                onClick={() => navigate(getDashboardRoute())}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--neutral-100)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}>
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-900)' }}>
                    {user.name || user.email.split('@')[0]}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--neutral-500)', textTransform: 'capitalize' }}>
                    {user.userType}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Logout"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--neutral-500)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => navigate('login')}
            >
              Get Started
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'none',
              padding: '0.5rem'
            }}
            className="mobile-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div style={{
          padding: '1.5rem',
          background: 'white',
          borderBottom: '1px solid var(--neutral-200)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <button onClick={() => { navigate('home'); setMobileOpen(false); }} style={mobileNavStyle}>Home</button>
          <button onClick={() => { navigate('symptom-analysis'); setMobileOpen(false); }} style={mobileNavStyle}>AI Symptom Analyzer</button>
          <button onClick={() => { navigate('doctor-suggestion'); setMobileOpen(false); }} style={mobileNavStyle}>Find Doctor</button>
          <button onClick={() => { navigate('risk-assessment'); setMobileOpen(false); }} style={mobileNavStyle}>Risk Assessment</button>
          <button onClick={() => { navigate('waiting-time'); setMobileOpen(false); }} style={mobileNavStyle}>Queue Live Monitor</button>
          {user ? (
            <>
              <button onClick={() => { navigate(getDashboardRoute()); setMobileOpen(false); }} style={mobileNavStyle}>
                Dashboard ({user.userType})
              </button>
              <button onClick={() => { onLogout(); setMobileOpen(false); }} style={{ ...mobileNavStyle, color: 'var(--danger-red)' }}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => { navigate('login'); setMobileOpen(false); }} className="btn btn-primary" style={{ width: '100%' }}>
              Log In / Register
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-links { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

const navButtonStyle = (isActive) => ({
  background: 'transparent',
  border: 'none',
  fontSize: '0.9rem',
  fontWeight: isActive ? 700 : 500,
  color: isActive ? 'var(--primary-blue)' : 'var(--neutral-600)',
  cursor: 'pointer',
  padding: '0.5rem 0',
  position: 'relative',
  borderBottom: isActive ? '2px solid var(--primary-blue)' : '2px solid transparent'
});

const mobileNavStyle = {
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  fontSize: '1rem',
  fontWeight: 600,
  padding: '0.5rem 0',
  color: 'var(--neutral-800)',
  cursor: 'pointer'
};
