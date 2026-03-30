// ============================================
// NEXUS ADMIN - DASHBOARD ONLY
// ============================================

// No mock data - fetching from API

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    loadActivityFeed();
    loadTopFests();
    initMobileMenu();
    fetchDashboardStats();
});

async function fetchDashboardStats() {
    try {
        const res = await fetch(`${window.API_BASE_URL}/dashboard/stats`);
        const result = await res.json();
        if (result.success) {
            const data = result.data;
            animateValue('totalUsers', parseInt(document.getElementById('totalUsers').innerText.replace(/,/g, '')) || 0, data.totalUsers || 0, 1500);
            animateValue('activeHosts', parseInt(document.getElementById('activeHosts').innerText.replace(/,/g, '')) || 0, data.activeHosts || 0, 1500);
            animateValue('liveFests', parseInt(document.getElementById('liveFests').innerText.replace(/,/g, '')) || 0, data.liveFests || 0, 1500);
            
            const revElem = document.getElementById('totalRevenue');
            if (data.totalRevenue) {
                if (data.totalRevenue >= 100000) {
                    revElem.textContent = '₹' + (data.totalRevenue / 100000).toFixed(2) + 'L';
                } else if (data.totalRevenue > 0) {
                    revElem.textContent = '₹' + data.totalRevenue.toLocaleString();
                } else {
                    revElem.textContent = '₹0';
                }
            }
        }
    } catch (err) {
        console.error("Failed to load real dashboard stats:", err);
    }
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Charts
function initCharts() {
    initRevenueChart();
    initUserGrowthChart();
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    window.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue',
                data: [45000, 52000, 48000, 61000, 55000, 67000, 72000],
                borderColor: '#6366f1',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
                    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: (context) => '₹' + context.parsed.y.toLocaleString('en-IN')
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        callback: (value) => '₹' + (value / 1000) + 'K'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            }
        }
    });
}

function initUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart');
    if (!ctx) return;
    
    window.userChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'New Users',
                data: [45, 58, 42, 65, 52, 78, 85],
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
                    gradient.addColorStop(1, 'rgba(236, 72, 153, 0.2)');
                    return gradient;
                },
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            }
        }
    });
}

// Activity Feed
async function loadActivityFeed() {
    const container = document.getElementById('activityList');
    if (!container) return;
    
    container.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); text-align: center;">Loading activity...</div>';
    
    try {
        const res = await fetch(`${window.API_BASE_URL}/dashboard/feed`);
        const data = await res.json();
        const activities = data.activities || [];
        
        if (activities.length === 0) {
            container.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); text-align: center;">No activity found</div>';
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="activity-item" onclick="viewActivity('${activity.type}')">
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-details">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${new Date(activity.time).toLocaleString()}</div>
                </div>
                ${activity.value ? `<div class="activity-value">${activity.value}</div>` : ''}
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load activity feed:', err);
        container.innerHTML = '<div style="padding: 1rem; color: red; text-align: center;">Failed to load</div>';
    }
}

function getActivityIcon(type) {
    const icons = {
        booking: 'fa-ticket-alt',
        user: 'fa-user-plus',
        fest: 'fa-calendar-plus',
        payment: 'fa-rupee-sign',
        host: 'fa-user-check'
    };
    return icons[type] || 'fa-info-circle';
}

// Top Fests
async function loadTopFests() {
    const container = document.getElementById('topFestsList');
    if (!container) return;
    
    container.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); text-align: center;">Loading Top Fests...</div>';

    try {
        const res = await fetch(`${window.API_BASE_URL}/dashboard/top-fests`);
        const data = await res.json();
        const fests = data.topFests || [];
        
        if (fests.length === 0) {
            container.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); text-align: center;">No ranked fests found</div>';
            return;
        }

        container.innerHTML = fests.map(fest => `
            <div class="fest-item" onclick="viewFestDetails('${fest.rank}')">
                <div class="fest-rank">${fest.rank}</div>
                <div class="fest-info">
                    <div class="fest-name">${fest.name}</div>
                    <div class="fest-college">${fest.college}</div>
                </div>
                <div class="fest-stats">
                    <div class="fest-revenue">${fest.revenue}</div>
                    <div class="fest-bookings">${fest.bookings} bookings</div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load top fests:', err);
        container.innerHTML = '<div style="padding: 1rem; color: red; text-align: center;">Failed to load</div>';
    }
}

// Remove simulated startRealTimeUpdates since we have real API calls.

// Navigation Actions
function refreshDashboard() {
    const btn = document.querySelector('.btn-primary');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        location.reload();
    }, 1000);
}

function viewAllActivity() {
    window.location.href = 'analytics.html';
}

function viewAllFests() {
    window.location.href = 'fests.html';
}

function viewActivity(type) {
    console.log('Viewing activity:', type);
}

function viewFestDetails(rank) {
    window.location.href = `fests.html?highlight=${rank}`;
}

function updateRevenueChart(period) {
    if (window.revenueChart) {
        // Simulate data update
        const newData = Array.from({length: 7}, () => Math.floor(Math.random() * 50000) + 30000);
        window.revenueChart.data.datasets[0].data = newData;
        window.revenueChart.update('active');
    }
}

function updateUserChart(period) {
    if (window.userChart) {
        const newData = Array.from({length: 7}, () => Math.floor(Math.random() * 50) + 20);
        window.userChart.data.datasets[0].data = newData;
        window.userChart.update('active');
    }
}

// Mobile Menu
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

function toggleNotifications() {
    alert('🔔 Notifications panel coming in v2.0!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
    }
}

console.log('%c🚀 NEXUS DASHBOARD', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cReal-time analytics at your fingertips', 'font-size: 12px; color: #ec4899;');