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

        // Update form placeholder based on user type
        updatePlaceholders(userType);
    });
});

// Update placeholders based on user type
function updatePlaceholders(userType) {
    const emailInput = document.getElementById('email');

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

const AUTH_ENDPOINT = 'http://127.0.0.1:5000/api/auth/login';

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

function detectLocation() {
    if (!locationInput) return;

    if (!navigator.geolocation) {
        locationInput.value = 'Location not supported by browser';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            locationInput.value = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
        },
        (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                locationInput.value = 'Location access denied';
            } else {
                locationInput.value = 'Unable to detect location';
            }
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
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

    fetch(AUTH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType })
    })
    .then(async response => {
        loginButton.classList.remove('loading');
        loginButton.disabled = false;

            const data = await response.json().catch(() => null);
            console.log('Login response:', response.status, data);

            if (!response.ok) {
                const message = data?.message || data?.error || 'Login failed. Please check your credentials.';
                alert(message);
                return;
            }

            if (!data || !data.user) {
                alert('Login failed: invalid server response. Please try again.');
                return;
            }

            completeLogin(data, email);
    })
    .catch(() => {
        loginButton.classList.remove('loading');
        loginButton.disabled = false;
        alert('Unable to reach the authentication server. Please make sure the backend is running.');
    });
});

// === Social Login Handlers ===
const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.classList.contains('google') ? 'Google' : 'Phone';

        alert(`🔐 ${provider} Login\n\nThis feature is not available in this build. Please contact support for account access options.`);
    });
});

// === Signup Link Handler ===
const signupLink = document.getElementById('signupLink');

if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('📝 Sign Up\n\nRegistration is not available in this version. Please contact support or use an existing account to sign in.');
    });
}

const forgotLink = document.querySelector('.forgot-link');

if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();

        const email = prompt('Enter your email address to reset password:');

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(email)) {
                alert(`✅ Password Reset Requested\n\nIf this email is registered, you will receive instructions to reset your password.`);
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

        const activeTab = document.querySelector('.tab-btn.active');
        const userType = activeTab ? activeTab.getAttribute('data-tab') : 'patient';
        updatePlaceholders(userType);
    }, 500);
});


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

console.log('%c✅ Login page initialized successfully!', 'color: #10b981; font-weight: bold;');
