// ============================================
// NEXUS ADMIN - GLOBAL CONFIGURATION
// ============================================

// The base URL of the currently deployed Render backend
const API_BASE_URL = 'https://nexus-dashboard-backend.onrender.com/api';

// Export for global access if using modules
window.API_BASE_URL = API_BASE_URL;

// === GLOBAL SECURITY VAULT INTERCEPTOR ===
const isLoginPage = window.location.pathname.includes('login.html');
const secureToken = localStorage.getItem('nexus_admin_jwt');

if (!isLoginPage && !secureToken) {
    // Immediate vault redirection if standard page is accessed without token
    window.location.replace('login.html');
}

// Proxy native fetch to ALWAYS attach Bearer token and handle 401 Force-outs
const nativeFetch = window.fetch;
window.fetch = async function(...args) {
    let [resource, config] = args;
    config = config || {};
    
    // Only intercept if targeting our Secure Backend API
    if (typeof resource === 'string' && resource.startsWith(window.API_BASE_URL)) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${localStorage.getItem('nexus_admin_jwt')}`
        };
    }

    try {
        const response = await nativeFetch(resource, config);
        if (response.status === 401) {
            localStorage.removeItem('nexus_admin_jwt');
            if (!isLoginPage) window.location.replace('login.html');
        }
        return response;
    } catch (error) {
        throw error;
    }
};
// === END SECURITY INTERCEPTOR ===

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch(`${window.API_BASE_URL}/dashboard/stats`);
        const result = await res.json();
        const data = result.stats || result.data || result;
        if (data) {
            updateBadge('.fa-users', data.totalUsers);
            updateBadge('.fa-user-tie', data.totalHosts);
            updateBadge('.fa-calendar-alt', data.totalFests);
        }
    } catch(e) {}
    
    // Fetch colleges separately since dashboard stats may not include it
    try {
        const res = await fetch(`${window.API_BASE_URL}/admin/colleges`);
        const result = await res.json();
        if (result.colleges) {
            updateBadge('.fa-university', result.colleges.length);
        }
    } catch(e) {}
});

function updateBadge(iconClass, val) {
    const icon = document.querySelector(`.sidebar-nav .nav-item ${iconClass}`);
    if (icon && icon.parentElement) {
        const badge = icon.parentElement.querySelector('.badge');
        if (badge) {
            badge.innerText = val > 999 ? (val/1000).toFixed(1) + 'K' : val;
        }
    }
}
