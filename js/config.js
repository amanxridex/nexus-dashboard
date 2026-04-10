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
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
}

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
        let response = await nativeFetch(resource, config);
        
        if (response.status === 401 && !isLoginPage && !resource.includes('/admin/auth/')) {
            // Attempt Silent Refresh
            const refreshToken = localStorage.getItem('nexus_admin_refresh');
            if(!refreshToken) throw new Error('No refresh token');

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const rfRes = await nativeFetch(`${window.API_BASE_URL}/admin/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken })
                    });
                    
                    const rfData = await rfRes.json();
                    
                    if (rfRes.ok && rfData.success) {
                        localStorage.setItem('nexus_admin_jwt', rfData.token);
                        isRefreshing = false;
                        onRefreshed(rfData.token);
                        
                        // Retry original request
                        config.headers['Authorization'] = `Bearer ${rfData.token}`;
                        return await nativeFetch(resource, config);
                    } else {
                        throw new Error('Refresh rejected');
                    }
                } catch(e) {
                    isRefreshing = false;
                    localStorage.removeItem('nexus_admin_jwt');
                    localStorage.removeItem('nexus_admin_refresh');
                    window.location.replace('login.html');
                    return response;
                }
            } else {
                // Wait for existing refresh to finish, then retry
                return new Promise(resolve => {
                    refreshSubscribers.push((newToken) => {
                        config.headers['Authorization'] = `Bearer ${newToken}`;
                        resolve(nativeFetch(resource, config));
                    });
                });
            }
        } else if (response.status === 401 && isLoginPage) {
            // If we are actually trying to login and it fails, just return it so UI handles it.
            return response;
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
