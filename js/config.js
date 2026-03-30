// ============================================
// NEXUS ADMIN - GLOBAL CONFIGURATION
// ============================================

// The base URL of the currently deployed Render backend
const API_BASE_URL = 'https://nexus-dashboard-backend.onrender.com/api';

// Export for global access if using modules
window.API_BASE_URL = API_BASE_URL;

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
