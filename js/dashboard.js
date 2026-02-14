// ============================================
// NEXUS ADMIN - DASHBOARD ONLY
// ============================================

// Mock Data
const activities = [
    { type: 'booking', title: 'New booking by Rahul Kumar', time: '2 minutes ago', value: '₹499' },
    { type: 'user', title: 'New user registered', time: '5 minutes ago', value: null },
    { type: 'fest', title: 'New fest created by IIT Delhi', time: '12 minutes ago', value: null },
    { type: 'payment', title: 'Payment received', time: '18 minutes ago', value: '₹1,299' },
    { type: 'host', title: 'Host verified: Priya Sharma', time: '25 minutes ago', value: null }
];

const topFests = [
    { rank: 1, name: 'IIT Bombay - Mood Indigo', college: 'IIT Bombay', revenue: '₹2.4L', bookings: 890 },
    { rank: 2, name: 'BITS Pilani - Oasis', college: 'BITS Pilani', revenue: '₹1.8L', bookings: 654 },
    { rank: 3, name: 'IIT Delhi - Rendezvous', college: 'IIT Delhi', revenue: '₹1.5L', bookings: 532 }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    loadActivityFeed();
    loadTopFests();
    initMobileMenu();
    startRealTimeUpdates();
});

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
function loadActivityFeed() {
    const container = document.getElementById('activityList');
    if (!container) return;
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item" onclick="viewActivity('${activity.type}')">
            <div class="activity-icon ${activity.type}">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
            ${activity.value ? `<div class="activity-value">${activity.value}</div>` : ''}
        </div>
    `).join('');
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
function loadTopFests() {
    const container = document.getElementById('topFestsList');
    if (!container) return;
    
    container.innerHTML = topFests.map(fest => `
        <div class="fest-item" onclick="viewFestDetails(${fest.rank})">
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
}

// Real-time Updates Simulation
function startRealTimeUpdates() {
    setInterval(() => {
        // Randomly update stats
        const stats = ['totalUsers', 'activeHosts', 'liveFests', 'totalRevenue'];
        const stat = stats[Math.floor(Math.random() * stats.length)];
        const element = document.getElementById(stat);
        if (element) {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => element.style.transform = 'scale(1)', 200);
        }
    }, 5000);
}

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