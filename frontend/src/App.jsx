import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Views
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import PatientDashboardView from './views/PatientDashboardView';
import SymptomAnalysisView from './views/SymptomAnalysisView';
import DoctorSuggestionView from './views/DoctorSuggestionView';
import DigitalTokenView from './views/DigitalTokenView';
import DoctorDashboardView from './views/DoctorDashboardView';
import HospitalDashboardView from './views/HospitalDashboardView';
import RiskAssessmentView from './views/RiskAssessmentView';
import WaitingTimeView from './views/WaitingTimeView';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [user, setUser] = useState(null);

  // Check stored login state on initial load
  useEffect(() => {
    const token = localStorage.getItem('smartcare_token');
    const email = localStorage.getItem('smartcare_user_email');
    const userType = localStorage.getItem('smartcare_user_type');
    const name = localStorage.getItem('smartcare_user_name');

    if (token && email && userType) {
      setUser({ token, email, userType, name: name || email.split('@')[0] });
    }
  }, []);

  const navigate = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('smartcare_token');
    localStorage.removeItem('smartcare_user_email');
    localStorage.removeItem('smartcare_user_type');
    localStorage.removeItem('smartcare_user_name');
    setUser(null);
    navigate('home');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--neutral-50)' }}>
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        user={user}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {currentRoute === 'home' && <HomeView navigate={navigate} />}
        {currentRoute === 'login' && <LoginView navigate={navigate} onLoginSuccess={handleLoginSuccess} />}
        {currentRoute === 'patient-home' && <PatientDashboardView user={user} navigate={navigate} />}
        {currentRoute === 'symptom-analysis' && <SymptomAnalysisView navigate={navigate} />}
        {currentRoute === 'doctor-suggestion' && <DoctorSuggestionView navigate={navigate} />}
        {currentRoute === 'digital-token' && <DigitalTokenView navigate={navigate} />}
        {currentRoute === 'doctor-home' && <DoctorDashboardView user={user} navigate={navigate} />}
        {currentRoute === 'hospital-home' && <HospitalDashboardView navigate={navigate} />}
        {currentRoute === 'risk-assessment' && <RiskAssessmentView navigate={navigate} />}
        {currentRoute === 'waiting-time' && <WaitingTimeView navigate={navigate} />}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}
