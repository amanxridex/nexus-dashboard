let revenueChartInstance = null;
let deviceChartInstance = null;
let cityChartInstance = null;
let livePollingInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch
    fetchAnalytics(true);
    
    // Start Cron Job Live Polling (every 5 seconds)
    startLivePolling();
});

function startLivePolling() {
    if (livePollingInterval) clearInterval(livePollingInterval);
    livePollingInterval = setInterval(() => {
        fetchAnalytics(false); // false means don't trigger heavy loading animations
    }, 5000);
}

async function fetchAnalytics(isInitial = false) {
    try {
        if (isInitial) {
            document.getElementById('lastSyncTime').innerText = "Syncing with intelligence database...";
        }

        const res = await fetch(`${window.API_BASE_URL}/admin/analytics`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('nexus_admin_jwt')}`
            }
        });
        
        const data = await res.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        const analytics = data.analytics;
        if (!analytics) return;

        updateStatsUI(analytics);
        
        // Only rerender charts heavily on initial or manual sync to prevent flickering
        if (isInitial || !revenueChartInstance) {
            renderCharts(analytics);
        } else {
            // For live polling, just update data silently if we wanted dynamic charts, 
            // but since charts are aggregated historically, they don't need 5s rerenders.
        }

        const now = new Date();
        document.getElementById('lastSyncTime').innerHTML = `<i class="fas fa-circle" style="color:var(--green); font-size:10px; margin-right:5px;"></i> Live monitoring active | Last ping: ${now.toLocaleTimeString()}`;

    } catch (err) {
        console.error('Failed to load analytics:', err);
        document.getElementById('lastSyncTime').innerHTML = `<i class="fas fa-exclamation-triangle" style="color:var(--orange);"></i> Connection interrupted`;
    }
}

function updateStatsUI(data) {
    document.getElementById('statLiveUsers').innerText = data.liveUsers || 0;
    document.getElementById('statTotalUsers').innerText = (data.totalUsersCount || 0).toLocaleString();
    document.getElementById('thirtyDayRevenue').innerText = '₹' + (data.totalRevenue30Days || 0).toLocaleString();
    
    const minutes = Math.floor((data.avgSessionTime || 0) / 60);
    const seconds = (data.avgSessionTime || 0) % 60;
    document.getElementById('statAvgSession').innerText = `${minutes}m ${seconds}s`;

    // ARPU = Total Revenue / Total Users
    const arpu = data.totalUsersCount > 0 ? (data.totalRevenue30Days / data.totalUsersCount) : 0;
    document.getElementById('statARPU').innerText = `₹${Math.round(arpu).toLocaleString()}`;

    // AOV Approximation = Total Revenue / Users who paid (or total transactions)
    // Here we approximate based on revenue users
    const payingUsersCount = data.revenue && data.revenue.filter(r => r > 0).length || 1; 
    const aov = data.totalRevenue30Days / payingUsersCount;
    document.getElementById('statAvgOrder').innerText = `₹${Math.round(aov).toLocaleString()}`;
}

function renderCharts(analytics) {
    // 1. REVENUE CHART (Line)
    const revCtx = document.getElementById('analyticsRevenueChart');
    if (revCtx) {
        if(revenueChartInstance) revenueChartInstance.destroy();
        revenueChartInstance = new Chart(revCtx, {
            type: 'line',
            data: {
                labels: analytics.labels,
                datasets: [{
                    label: 'Gross Volume (₹)',
                    data: analytics.revenue,
                    borderColor: '#8b5cf6', // Premium Purple
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
                        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.6)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.6)', maxTicksLimit: 10 }
                    }
                }
            }
        });
    }

    // 2. DEVICE DOUGHNUT CHART
    const deviceCtx = document.getElementById('analyticsDeviceChart');
    if (deviceCtx && analytics.devices) {
        if(deviceChartInstance) deviceChartInstance.destroy();
        deviceChartInstance = new Chart(deviceCtx, {
            type: 'doughnut',
            data: {
                labels: analytics.devices.labels,
                datasets: [{
                    data: analytics.devices.data,
                    backgroundColor: [
                        '#10b981', // Android Green
                        '#3b82f6', // iOS Blue
                        '#6366f1'  // Web/Other Purple
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: 'rgba(255, 255, 255, 0.7)', padding: 20, usePointStyle: true }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        padding: 12,
                        cornerRadius: 8
                    }
                }
            }
        });
    }

    // 3. TOP CITIES HORIZONTAL BAR CHART
    const cityCtx = document.getElementById('analyticsCityChart');
    if (cityCtx && analytics.cities) {
        if(cityChartInstance) cityChartInstance.destroy();
        cityChartInstance = new Chart(cityCtx, {
            type: 'bar',
            data: {
                labels: analytics.cities.labels,
                datasets: [{
                    label: 'Active Users',
                    data: analytics.cities.data,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 400, 0);
                        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
                        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.9)');
                        return gradient;
                    },
                    borderRadius: 4,
                    borderWidth: 0
                }]
            },
            options: {
                indexAxis: 'y', // Makes it horizontal
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.6)' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.9)', font: { weight: 'bold' } }
                    }
                }
            }
        });
    }
}
