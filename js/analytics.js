document.addEventListener('DOMContentLoaded', () => {
    fetchAnalytics();
});

async function fetchAnalytics() {
    try {
        const res = await fetch(`${window.API_BASE_URL}/admin/analytics`);
        const data = await res.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        const analytics = data.analytics;
        if (!analytics) return;

        // Update mini stats mapped to 30 days
        const totalUsers = analytics.users.reduce((a, b) => a + b, 0);
        const totalRevenue = analytics.revenue.reduce((a, b) => a + b, 0);
        
        const bookingsElem = document.getElementById('thirtyDayBookings');
        if (bookingsElem) bookingsElem.innerText = totalUsers; // Using users as a proxy or we can fetch bookings count
        
        const revElem = document.getElementById('thirtyDayRevenue');
        if (revElem) revElem.innerText = '₹' + totalRevenue.toLocaleString();

        renderCharts(analytics);
    } catch (err) {
        console.error('Failed to load analytics:', err);
    }
}

function renderCharts(analytics) {
    const revCtx = document.getElementById('analyticsRevenueChart');
    if (revCtx) {
        new Chart(revCtx, {
            type: 'line',
            data: {
                labels: analytics.labels,
                datasets: [{
                    label: 'Revenue (₹)',
                    data: analytics.revenue,
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
                    pointRadius: 4
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
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                        borderWidth: 1,
                        padding: 12
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
                    }
                }
            }
        });
    }

    const userCtx = document.getElementById('analyticsUserChart');
    if (userCtx) {
        new Chart(userCtx, {
            type: 'bar',
            data: {
                labels: analytics.labels,
                datasets: [{
                    label: 'New Users',
                    data: analytics.users,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
                        gradient.addColorStop(1, 'rgba(236, 72, 153, 0.2)');
                        return gradient;
                    },
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
                    }
                }
            }
        });
    }
}
