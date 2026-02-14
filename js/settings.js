// ============================================
// NEXUS ADMIN - SETTINGS PAGE
// ============================================

// State
let unsavedChanges = false;
let currentTab = 'profile';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initFormListeners();
    loadSettings();
});

function initFormListeners() {
    // Listen for changes on all inputs
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('change', markUnsaved);
        input.addEventListener('input', debounce(markUnsaved, 500));
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function markUnsaved() {
    if (!unsavedChanges) {
        unsavedChanges = true;
        document.getElementById('unsavedIndicator').style.display = 'flex';
        document.getElementById('saveBar').style.display = 'flex';
    }
}

// Tab Switching
function switchTab(tabName) {
    // Update nav
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Update content
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    currentTab = tabName;
    
    // Hide save bar when switching tabs (but keep unsaved state)
    if (!unsavedChanges) {
        document.getElementById('saveBar').style.display = 'none';
    }
}

// Profile Functions
function changeAvatar() {
    // Simulate file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('profileAvatar').src = event.target.result;
                markUnsaved();
                showToast('Profile photo updated', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function removeAvatar() {
    document.getElementById('profileAvatar').src = 'https://ui-avatars.com/api/?name=Super+Admin&background=6366f1&color=fff&size=200';
    markUnsaved();
    showToast('Profile photo removed', 'info');
}

// Social Connections
function connectSocial(provider) {
    showToast(`Connecting to ${provider}...`, 'info');
    setTimeout(() => {
        showToast(`Successfully connected to ${provider}!`, 'success');
    }, 1500);
}

function disconnectSocial(provider) {
    if (confirm(`Disconnect from ${provider}?`)) {
        showToast(`Disconnected from ${provider}`, 'info');
    }
}

// Password Functions
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    
    // Update icon
    const button = input.parentElement.querySelector('button i');
    button.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.querySelector('.strength-bar::after') || document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.password-strength strong');
    
    let strength = 0;
    if (password.length > 6) strength++;
    if (password.length > 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const widths = ['20%', '40%', '60%', '80%', '100%'];
    const colors = ['var(--red)', 'var(--orange)', 'var(--yellow)', 'var(--green)', 'var(--green)'];
    const texts = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    
    const index = Math.min(strength, 4);
    
    // Update visual strength indicator
    const bar = document.querySelector('.strength-bar');
    bar.style.setProperty('--strength-width', widths[index]);
    bar.style.setProperty('--strength-color', colors[index]);
    
    // Add inline style for immediate feedback
    bar.innerHTML = `<div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${widths[index]}; background: ${colors[index]}; border-radius: 2px; transition: all 0.3s ease;"></div>`;
    
    if (strengthText) {
        strengthText.textContent = texts[index];
        strengthText.style.color = colors[index];
    }
}

function changePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    
    if (!current || !newPass || !confirm) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    if (newPass !== confirm) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (newPass.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    
    showToast('Password updated successfully!', 'success');
    
    // Clear fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// 2FA Functions
function configure2FA() {
    showToast('Opening 2FA configuration...', 'info');
}

function disable2FA() {
    if (confirm('Are you sure you want to disable 2FA? This makes your account less secure.')) {
        showToast('2FA has been disabled', 'warning');
    }
}

function enableSMS() {
    showToast('SMS authentication enabled', 'success');
}

// Danger Zone
function logoutAllSessions() {
    if (confirm('This will sign you out from all devices. Continue?')) {
        showToast('All sessions logged out', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

function deleteAccount() {
    const confirmation = prompt('This action is irreversible. Type "DELETE" to confirm:');
    if (confirmation === 'DELETE') {
        showToast('Account deletion requested', 'info');
    }
}

// Platform Settings
function loadSettings() {
    // Load saved settings from localStorage or API
    const savedSettings = localStorage.getItem('nexus_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        // Apply settings to form elements
        console.log('Settings loaded:', settings);
    }
}

function saveSettings() {
    // Collect all settings
    const settings = {
        profile: {
            fullName: document.getElementById('fullName')?.value,
            username: document.getElementById('username')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            bio: document.getElementById('bio')?.value,
            role: document.getElementById('role')?.value,
            department: document.getElementById('department')?.value
        },
        platform: {
            name: document.getElementById('platformName')?.value,
            supportEmail: document.getElementById('supportEmail')?.value,
            timezone: document.getElementById('timezone')?.value,
            dateFormat: document.getElementById('dateFormat')?.value,
            currency: document.getElementById('currency')?.value
        },
        features: {
            allowRegistration: document.getElementById('allowRegistration')?.checked,
            allowHostApps: document.getElementById('allowHostApps')?.checked,
            allowEventCreation: document.getElementById('allowEventCreation')?.checked,
            maintenanceMode: document.getElementById('maintenanceMode')?.checked,
            emailVerification: document.getElementById('emailVerification')?.checked
        }
    };
    
    // Save to localStorage (in real app, send to API)
    localStorage.setItem('nexus_settings', JSON.stringify(settings));
    
    unsavedChanges = false;
    document.getElementById('unsavedIndicator').style.display = 'none';
    document.getElementById('saveBar').style.display = 'none';
    
    showToast('Settings saved successfully!', 'success');
}

function discardChanges() {
    if (confirm('Discard all unsaved changes?')) {
        location.reload();
    }
}

// Payment Functions
function configureGateway(gateway) {
    showToast(`Opening ${gateway} configuration...`, 'info');
}

function disableGateway(gateway) {
    if (confirm(`Disable ${gateway}?`)) {
        showToast(`${gateway} disabled`, 'warning');
    }
}

// Appearance Functions
function setTheme(theme) {
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    markUnsaved();
    
    showToast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`, 'success');
}

function setAccentColor(color) {
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    markUnsaved();
    
    // Apply color to CSS variables
    document.documentElement.style.setProperty('--indigo', color);
    
    showToast('Accent color updated', 'success');
}

// Integration Functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    });
}

function regenerateKey(type) {
    if (confirm(`Regenerate ${type} API key? The old key will stop working immediately.`)) {
        showToast(`${type} API key regenerated`, 'success');
    }
}

// Backup Functions
function createBackup() {
    showToast('Creating backup... This may take a few minutes.', 'info');
    setTimeout(() => {
        showToast('Backup created successfully!', 'success');
    }, 3000);
}

function restoreBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip,.sql';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            showToast(`Restoring from ${file.name}...`, 'info');
        }
    };
    input.click();
}

function downloadLogs() {
    showToast('Preparing log download...', 'info');
    setTimeout(() => {
        showToast('Logs downloaded!', 'success');
    }, 1500);
}

// Utility Functions
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const colors = {
        success: 'var(--green)',
        error: 'var(--red)',
        warning: 'var(--orange)',
        info: 'var(--indigo)'
    };
    
    toast.style.borderLeftColor = colors[type] || colors.info;
    toast.innerHTML = `
        <i class="fas fa-${icons[type]} toast-icon" style="color: ${colors[type] || colors.info}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}

function showHelp() {
    showToast('Help documentation coming soon!', 'info');
}

function toggleNotifications() {
    showToast('No new notifications', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
    }
}

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', (e) => {
    if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

console.log('%c⚙️ NEXUS SETTINGS', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('%cCustomize your platform', 'color: #8b5cf6;');