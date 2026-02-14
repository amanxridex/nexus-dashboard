// ============================================
// NEXUS ADMIN PANEL - JAVASCRIPT
// ============================================

// Mock Data
const mockUsers = [
    { id: 1, name: "Rahul Kumar", email: "rahul@gmail.com", college: "IIT Delhi", joined: "2024-01-15", bookings: 5, spent: "₹2,450", status: "active" },
    { id: 2, name: "Priya Sharma", email: "priya@gmail.com", college: "BITS Pilani", joined: "2024-02-20", bookings: 3, spent: "₹1,200", status: "active" },
    { id: 3, name: "Amit Singh", email: "amit@gmail.com", college: "IIT Bombay", joined: "2024-03-10", bookings: 8, spent: "₹4,100", status: "active" },
    { id: 4, name: "Sneha Patel", email: "sneha@gmail.com", college: "VIT Vellore", joined: "2024-01-25", bookings: 2, spent: "₹950", status: "inactive" },
    { id: 5, name: "Rohan Mehta", email: "rohan@gmail.com", college: "Manipal", joined: "2024-04-05", bookings: 6, spent: "₹3,200", status: "active" }
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCharts();
    loadUsersTable();
    initMobileMenu();
});

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items and pages
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding page
            const pageName = item.dataset.page;
            const targetPage = document.querySelector(`.page-section[data-page="${pageName}"]`);
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
            // Load page-specific data
            loadPageData(pageName);
        });
    });
}

function loadPageData(pageName) {
    switch(pageName) {
        case 'users':
            loadUsersTable();
            break;
        case 'hosts':
            loadHostsTable();
            break;
        case 'fests':
            loadFestsTable();
            break;
        case 'bookings':
            loadBookingsTable();
            break;
        case 'payments':
            loadPaymentsTable();
            break;
    }
}

// ============================================
// CHARTS
// ============================================

function initCharts() {
    initRevenueChart();
    initUserGrowthChart();
}

function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue',
                data: [45000, 52000, 48000, 61000, 55000, 67000, 72000],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
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
                        callback: function(value) {
                            return '₹' + (value / 1000) + 'K';
                        }
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
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'New Users',
                data: [45, 58, 42, 65, 52, 78, 85],
                backgroundColor: 'rgba(236, 72, 153, 0.6)',
                borderColor: '#ec4899',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
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

// ============================================
// USERS TABLE
// ============================================

function loadUsersTable() {
    const tableWrapper = document.getElementById('usersTable');
    if (!tableWrapper) return;
    
    const tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>
                        <input type="checkbox" id="selectAll">
                    </th>
                    <th>User</th>
                    <th>Email</th>
                    <th>College</th>
                    <th>Joined</th>
                    <th>Bookings</th>
                    <th>Spent</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${mockUsers.map(user => `
                    <tr>
                        <td>
                            <input type="checkbox" class="row-checkbox" data-id="${user.id}">
                        </td>
                        <td>
                            <div class="user-cell">
                                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff" alt="${user.name}">
                                <span>${user.name}</span>
                            </div>
                        </td>
                        <td>${user.email}</td>
                        <td>${user.college}</td>
                        <td>${formatDate(user.joined)}</td>
                        <td>${user.bookings}</td>
                        <td class="amount">${user.spent}</td>
                        <td>
                            <span class="status-badge ${user.status}">
                                ${user.status}
                            </span>
                        </td>
                        <td>
                            <div class="table-actions">
                                <button class="action-btn" onclick="viewUser(${user.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-btn" onclick="editUser(${user.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn danger" onclick="deleteUser(${user.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    tableWrapper.innerHTML = tableHTML;
    initTableActions();
}

function initTableActions() {
    // Select all checkbox
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.row-checkbox');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });
    }
}

// ============================================
// USER ACTIONS
// ============================================

function viewUser(id) {
    const user = mockUsers.find(u => u.id === id);
    alert(`Viewing details for: ${user.name}\nEmail: ${user.email}\nCollege: ${user.college}`);
}

function editUser(id) {
    const user = mockUsers.find(u => u.id === id);
    alert(`Editing user: ${user.name}`);
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        alert('User deleted successfully!');
        loadUsersTable();
    }
}

// ============================================
// OTHER TABLES (PLACEHOLDER)
// ============================================

function loadHostsTable() {
    console.log('Loading hosts table...');
}

function loadFestsTable() {
    console.log('Loading fests table...');
}

function loadBookingsTable() {
    console.log('Loading bookings table...');
}

function loadPaymentsTable() {
    console.log('Loading payments table...');
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

function toggleNotifications() {
    alert('Notifications panel coming soon!');
}

// ============================================
// LOGOUT
// ============================================

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Implement logout logic
        window.location.href = 'login.html';
    }
}

// ============================================
// UTILITIES
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// ============================================
// TABLE STYLES (Inject dynamically)
// ============================================

const tableStyles = `
<style>
.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table thead {
    background: var(--bg-tertiary);
}

.data-table th {
    padding: 1rem;
    text-align: left;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.data-table tbody tr {
    border-bottom: 1px solid var(--border-color);
    transition: background 0.2s ease;
}

.data-table tbody tr:hover {
    background: var(--bg-tertiary);
}

.data-table td {
    padding: 1rem;
    font-size: 0.9rem;
}

.user-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.user-cell img {
    width: 36px;
    height: 36px;
    border-radius: 8px;
}

.amount {
    font-weight: 600;
    color: var(--green);
}

.status-badge {
    display: inline-block;
    padding: 0.375rem 0.875rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
}

.status-badge.active {
    background: rgba(16, 185, 129, 0.1);
    color: var(--green);
}

.status-badge.inactive {
    background: rgba(239, 68, 68, 0.1);
    color: var(--red);
}

.table-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn:hover {
    background: var(--purple);
    color: white;
}

.action-btn.danger:hover {
    background: var(--red);
}
</style>
`;

// Inject table styles
document.head.insertAdjacentHTML('beforeend', tableStyles);

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c🚀 NEXUS ADMIN PANEL', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cPowered by advanced algorithms & incredible design', 'font-size: 12px; color: #ec4899;');