// ===================================
// Smart Care - Login Page JavaScript
// ===================================

// === Tab Switching ===
const tabButtons = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('loginForm');
const locationGroup = document.getElementById('locationGroup');
const locationInput = document.getElementById('location');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked tab
        button.classList.add('active');

        // Get the selected user type
        const userType = button.getAttribute('data-tab');
        console.log(`Switched to ${userType} login`);

        // Update form placeholder based on user type
        updatePlaceholders(userType);
    });
});

// Update placeholders based on user type
function updatePlaceholders(userType) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    switch (userType) {
        case 'patient':
            emailInput.placeholder = 'patient@example.com';
            if (locationGroup) locationGroup.style.display = 'flex';
            detectLocation();
            break;
        case 'doctor':
            emailInput.placeholder = 'doctor@hospital.com';
            if (locationGroup) locationGroup.style.display = 'none';
            break;
        case 'hospital':
            emailInput.placeholder = 'admin@hospital.com';
            if (locationGroup) locationGroup.style.display = 'none';
            break;
    }
}

// === Demo Login (no backend required) ===
const DEMO_ACCOUNTS = {
    patient: { email: 'patient@demo.com', password: 'password123', name: 'Demo Patient' },
    doctor: { email: 'doctor@demo.com', password: 'password123', name: 'Demo Doctor' },
    hospital: { email: 'admin@demo.com', password: 'password123', name: 'Demo Admin' }
};

function performDemoLogin(email, password, userType) {
    const demo = DEMO_ACCOUNTS[userType];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const matchesDemo = demo && email === demo.email && password === demo.password;
    const acceptsAnyValid = emailRegex.test(email) && password.length >= 6;

    if (!matchesDemo && !acceptsAnyValid) {
        return null;
    }

    return {
        token: `demo-token-${Date.now()}`,
        user: {
            email,
            userType,
            name: demo && email === demo.email ? demo.name : email.split('@')[0]
        }
    };
}

function completeLogin(data, email) {
    const userName = (data.user?.name || data.user?.email || email).toString().split('@')[0];
    localStorage.setItem('smartcare_token', data.token);
    localStorage.setItem('smartcare_user_email', data.user.email);
    localStorage.setItem('smartcare_user_type', data.user.userType);
    localStorage.setItem('smartcare_user_name', userName);
    localStorage.removeItem('Smart Care_token');
    localStorage.removeItem('Smart Care_user_email');
    localStorage.removeItem('Smart Care_user_type');

    const loginButtonText = document.querySelector('.login-button span');
    if (loginButtonText) loginButtonText.textContent = 'Success! Redirecting...';

    setTimeout(() => {
        if (data.user.userType === 'patient') {
            window.location.href = 'patient-home.html';
        } else if (data.user.userType === 'doctor') {
            window.location.href = 'doctor-home.html';
        } else if (data.user.userType === 'hospital') {
            window.location.href = 'hospital-home.html';
        }
    }, 800);
}

function fillDemoCredentials(userType) {
    const demo = DEMO_ACCOUNTS[userType];
    if (!demo) return;

    emailInput.value = demo.email;
    passwordInput.value = demo.password;
    emailInput.classList.add('success');
    passwordInput.classList.add('success');
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
}

// === Password Toggle ===
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle icon (you can add different SVG for eye-slash if needed)
        togglePassword.style.color = type === 'text' ? 'var(--primary-blue)' : 'var(--neutral-400)';
    });
}
// === Form Validation ===
const emailInput = document.getElementById('email');
const loginButton = document.querySelector('.login-button');

// Email validation
emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        emailInput.classList.add('error');
        emailInput.classList.remove('success');
        showError(emailInput, 'Please enter a valid email address');
    } else if (email) {
        emailInput.classList.remove('error');
        emailInput.classList.add('success');
        removeError(emailInput);
    }
});

// Password validation
passwordInput.addEventListener('blur', () => {
    const password = passwordInput.value;

    if (password && password.length < 6) {
        passwordInput.classList.add('error');
        passwordInput.classList.remove('success');
        showError(passwordInput, 'Password must be at least 6 characters');
    } else if (password) {
        passwordInput.classList.remove('error');
        passwordInput.classList.add('success');
        removeError(passwordInput);
    }
});

// Show error message
function showError(input, message) {
    // Remove existing error message
    removeError(input);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.parentElement.appendChild(errorDiv);
}

// Remove error message
function removeError(input) {
    const errorMessage = input.parentElement.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// === Form Submission ===
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const activeTab = document.querySelector('.tab-btn.active');
    const userType = activeTab ? activeTab.getAttribute('data-tab') : 'patient';

    // Validate inputs
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        emailInput.focus();
        return;
    }

    // Password validation
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        passwordInput.focus();
        return;
    }

    // Show loading state
    loginButton.classList.add('loading');
    loginButton.disabled = true;

    setTimeout(() => {
        loginButton.classList.remove('loading');
        loginButton.disabled = false;

        const data = performDemoLogin(email, password, userType);
        if (data) {
            completeLogin(data, email);
            return;
        }

        alert('Login failed. Use the demo credentials shown above, or any valid email with a 6+ character password.');
    }, 500);
});

// Show login success
function showLoginSuccess(userType, email) {
    // Store user session
    const userName = email.split('@')[0];
    localStorage.setItem('smartcare_user_email', email);
    localStorage.setItem('smartcare_user_type', userType);
    localStorage.setItem('smartcare_user_name', userName);
    localStorage.removeItem('Smart Care_user_email');
    localStorage.removeItem('Smart Care_user_type');

    if (userType === 'patient') {
        // Redirect to patient dashboard
        const loginButton = document.querySelector('.login-button');
        loginButton.innerHTML = '<span>Success! Redirecting...</span>';
        setTimeout(() => {
            window.location.href = 'patient-home.html';
        }, 500);
    } else if (userType === 'doctor') {
        // Redirect to doctor dashboard
        const loginButton = document.querySelector('.login-button');
        loginButton.innerHTML = '<span>Success! Redirecting...</span>';
        setTimeout(() => {
            window.location.href = 'doctor-home.html';
        }, 500);
    } else if (userType === 'hospital') {
        // Redirect to hospital admin dashboard
        const loginButton = document.querySelector('.login-button');
        loginButton.innerHTML = '<span>Success! Redirecting...</span>';
        setTimeout(() => {
            window.location.href = 'hospital-home.html';
        }, 500);
    } else {
        const userTypeLabel = userType.charAt(0).toUpperCase() + userType.slice(1);
        alert(`🎉 Login Successful!\n\nUser Type: ${userTypeLabel}\nEmail: ${email}\n\nThis is a demo version. In a full implementation, you would be redirected to:\n\n• Patient Dashboard - View symptoms, tokens, appointments\n• Doctor Dashboard - Manage queue, view patients\n• Hospital Admin - Analytics, staff management\n\nThank you for exploring Smart Care!`);
    }
}

// === Social Login Handlers ===
const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.classList.contains('google') ? 'Google' : 'Phone';

        alert(`🔐 ${provider} Login\n\nThis feature would integrate with:\n• Google OAuth 2.0 (for Google login)\n• OTP verification (for Phone login)\n\nDemo version - Feature not implemented.`);
    });
});

// === Signup Link Handler ===
const signupLink = document.getElementById('signupLink');

if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();

        alert('📝 Sign Up\n\nIn a full implementation, this would open a registration form with:\n\n• Personal information\n• Contact details\n• User type selection\n• Email verification\n• Terms acceptance\n\nDemo version - Feature not implemented.');
    });
}

// === Forgot Password Handler ===
const forgotLink = document.querySelector('.forgot-link');

if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();

        const email = prompt('Enter your email address to reset password:');

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                alert(`✅ Password Reset Email Sent!\n\nA password reset link has been sent to:\n${email}\n\n(Demo version - No actual email sent)`);
            } else {
                alert('❌ Invalid email address. Please try again.');
            }
        }
    });
}

// === Input Focus Effects ===
const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.01)';
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

// === Keyboard Shortcuts ===
document.addEventListener('keydown', (e) => {
    // Alt + 1, 2, 3 to switch tabs
    if (e.altKey && e.key >= '1' && e.key <= '3') {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        tabButtons[index].click();
    }

    // ESC to clear form
    if (e.key === 'Escape') {
        if (confirm('Clear the login form?')) {
            loginForm.reset();
            emailInput.classList.remove('error', 'success');
            passwordInput.classList.remove('error', 'success');
            document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        }
    }
});

// === Auto-fill Detection ===
window.addEventListener('load', () => {
    setTimeout(() => {
        inputs.forEach(input => {
            if (input.value) {
                input.classList.add('success');
            }
        });
    }, 500);
});

// === Demo Credentials Helper ===
document.querySelectorAll('[data-demo-fill]').forEach(button => {
    button.addEventListener('click', () => {
        const userType = button.getAttribute('data-demo-fill');
        const tab = document.querySelector(`.tab-btn[data-tab="${userType}"]`);
        if (tab) tab.click();
        fillDemoCredentials(userType);
    });
});

console.log('%c🔐 Smart Care Login Demo', 'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cDemo mode: backend not required. Use the buttons on the page or any valid email + 6+ char password.', 'color: #64748b; font-size: 12px;');

// === Page Load Animation ===
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-out';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// === Remember Me Functionality ===
const rememberCheckbox = document.querySelector('input[name="remember"]');

// Load saved email if exists
window.addEventListener('load', () => {
    const savedEmail = localStorage.getItem('Smart Care_saved_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
        emailInput.classList.add('success');
    }
});

// Save email when remember me is checked
loginForm.addEventListener('submit', () => {
    if (rememberCheckbox.checked) {
        localStorage.setItem('Smart Care_saved_email', emailInput.value);
    } else {
        localStorage.removeItem('Smart Care_saved_email');
    }
});

// === Input Animation on Type ===
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value) {
            input.parentElement.querySelector('.input-icon').style.color = 'var(--primary-blue)';
        } else {
            input.parentElement.querySelector('.input-icon').style.color = 'var(--neutral-400)';
        }
    });
});

// === Accessibility Announcements ===
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => announcement.remove(), 1000);
}

// Add screen reader only class
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(style);

// Announce tab changes
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const userType = button.getAttribute('data-tab');
        announceToScreenReader(`Switched to ${userType} login`);
    });
});

// === Geolocation Logic ===
function detectLocation() {
    if (!locationInput) return;

    if ("geolocation" in navigator) {
        locationInput.value = "Detecting location...";
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                locationInput.value = `Lat: ${lat}, Lon: ${lon}`;

                // Optional: Reverse geocoding could go here if we had an API key
                // For demo, we just show coordinates
            },
            (error) => {
                console.error("Error detecting location:", error);
                locationInput.value = "Location access denied";
            }
        );
    } else {
        locationInput.value = "Geolocation not supported";
    }
}

// Initialize location if patient tab is active
if (document.querySelector('.tab-btn[data-tab="patient"]').classList.contains('active')) {
    detectLocation();
}

console.log('%c✅ Login page initialized successfully!', 'color: #10b981; font-weight: bold;');
