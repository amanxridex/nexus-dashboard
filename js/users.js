// ============================================
// NEXUS ADMIN - USERS PAGE
// ============================================

// Mock Data
const usersData = [
    { id: 1, name: "Rahul Kumar", email: "rahul@iitd.ac.in", phone: "+91 98765 43210", college: "IIT Delhi", joined: "2024-01-15", bookings: 12, spent: 15400, status: "active", avatar: "RK" },
    { id: 2, name: "Priya Sharma", email: "priya@bits-pilani.ac.in", phone: "+91 98765 43211", college: "BITS Pilani", joined: "2024-02-20", bookings: 8, spent: 9800, status: "active", avatar: "PS" },
    { id: 3, name: "Amit Singh", email: "amit@iitb.ac.in", phone: "+91 98765 43212", college: "IIT Bombay", joined: "2024-03-10", bookings: 15, spent: 22100, status: "active", avatar: "AS" },
    { id: 4, name: "Sneha Patel", email: "sneha@vit.ac.in", phone: "+91 98765 43213", college: "VIT Vellore", joined: "2024-01-25", bookings: 3, spent: 2400, status: "inactive", avatar: "SP" },
    { id: 5, name: "Rohan Mehta", email: "rohan@manipal.edu", phone: "+91 98765 43214", college: "Manipal", joined: "2024-04-05", bookings: 9, spent: 12500, status: "active", avatar: "RM" },
    { id: 6, name: "Ananya Gupta", email: "ananya@iitkgp.ac.in", phone: "+91 98765 43215", college: "IIT Kharagpur", joined: "2024-02-14", bookings: 6, spent: 7800, status: "active", avatar: "AG" },
    { id: 7, name: "Vikram Rao", email: "vikram@nitt.edu", phone: "+91 98765 43216", college: "NIT Trichy", joined: "2024-03-22", bookings: 1, spent: 800, status: "suspended", avatar: "VR" },
    { id: 8, name: "Neha Reddy", email: "neha@bits-goa.ac.in", phone: "+91 98765 43217", college: "BITS Goa", joined: "2024-01-30", bookings: 11, spent: 14200, status: "active", avatar: "NR" },
    { id: 9, name: "Karan Malhotra", email: "karan@iitm.ac.in", phone: "+91 98765 43218", college: "IIT Madras", joined: "2024-04-12", bookings: 0, spent: 0, status: "inactive", avatar: "KM" },
    { id: 10, name: "Divya Nair", email: "divya@nitw.ac.in", phone: "+91 98765 43219", college: "NIT Warangal", joined: "2024-02-28", bookings: 14, spent: 18900, status: "active", avatar: "DN" },
    { id: 11, name: "Arjun Verma", email: "arjun@iitd.ac.in", phone: "+91 98765 43220", college: "IIT Delhi", joined: "2024-03-15", bookings: 7, spent: 8900, status: "active", avatar: "AV" },
    { id: 12, name: "Shreya Iyer", email: "shreya@bits-pilani.ac.in", phone: "+91 98765 43221", college: "BITS Pilani", joined: "2024-04-01", bookings: 4, spent: 5600, status: "active", avatar: "SI" }
];

let currentView = 'grid';
let selectedUsers = new Set();
let currentPage = 1;
const itemsPerPage = 12;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderUsers();
    initEventListeners();
    initMobileMenu();
});

function initEventListeners() {
    // Search
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
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

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    const filtered = usersData.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.college.toLowerCase().includes(term)
    );
    renderUsers(filtered);
}

function renderUsers(data = usersData) {
    if (currentView === 'grid') {
        renderGridView(data);
    } else {
        renderTableView(data);
    }
    updatePagination(data.length);
}

function renderGridView(users) {
    const grid = document.getElementById('usersGrid');
    const tableView = document.getElementById('usersTableView');
    
    grid.style.display = 'grid';
    tableView.style.display = 'none';
    
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = users.slice(start, start + itemsPerPage);
    
    grid.innerHTML = paginatedUsers.map(user => `
        <div class="user-card" data-id="${user.id}">
            <div class="user-select">
                <input type="checkbox" 
                    ${selectedUsers.has(user.id) ? 'checked' : ''} 
                    onchange="toggleSelection(${user.id})"
                    onclick="event.stopPropagation()">
            </div>
            <div class="user-card-header">
                <span class="status-badge ${user.status}">${user.status}</span>
            </div>
            <div class="user-main" onclick="viewUser(${user.id})">
                <img src="https://ui-avatars.com/api/?name=${user.avatar}&background=random&color=fff&size=128" 
                     alt="${user.name}" class="user-avatar-large">
                <div class="user-details">
                    <h4>${user.name}</h4>
                    <p>${user.email}</p>
                </div>
            </div>
            <div class="user-meta">
                <div class="meta-item">
                    <span class="meta-label">College</span>
                    <span class="meta-value">${user.college}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Joined</span>
                    <span class="meta-value">${formatDate(user.joined)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Bookings</span>
                    <span class="meta-value">${user.bookings}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Spent</span>
                    <span class="meta-value">₹${user.spent.toLocaleString('en-IN')}</span>
                </div>
            </div>
            <div class="user-footer">
                <div class="activity-bar" style="flex: 1; margin-right: 1rem;">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(user.bookings * 5, 100)}%"></div>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="action-icon" onclick="event.stopPropagation(); editUser(${user.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon danger" onclick="event.stopPropagation(); deleteUser(${user.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTableView(users) {
    const grid = document.getElementById('usersGrid');
    const tableView = document.getElementById('usersTableView');
    const tbody = document.getElementById('usersTableBody');
    
    grid.style.display = 'none';
    tableView.style.display = 'block';
    
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = users.slice(start, start + itemsPerPage);
    
    tbody.innerHTML = paginatedUsers.map(user => `
        <tr data-id="${user.id}">
            <td>
                <input type="checkbox" 
                    ${selectedUsers.has(user.id) ? 'checked' : ''} 
                    onchange="toggleSelection(${user.id})">
            </td>
            <td>
                <div class="user-cell">
                    <img src="https://ui-avatars.com/api/?name=${user.avatar}&background=random&color=fff" 
                         alt="${user.name}" class="user-avatar-small">
                    <div class="user-info">
                        <span class="user-name">${user.name}</span>
                        <span class="user-id">#${user.id.toString().padStart(4, '0')}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="contact-cell">
                    <a href="mailto:${user.email}">${user.email}</a>
                    <span style="color: var(--text-muted); font-size: 0.8125rem;">${user.phone}</span>
                </div>
            </td>
            <td>${user.college}</td>
            <td>${formatDate(user.joined)}</td>
            <td>
                <div class="activity-bar">
                    <div class="activity-stats">
                        <span>${user.bookings} bookings</span>
                        <span>₹${user.spent.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(user.bookings * 5, 100)}%"></div>
                    </div>
                </div>
            </td>
            <td>
                <span class="status-badge ${user.status}">${user.status}</span>
            </td>
            <td>
                <div class="user-actions">
                    <button class="action-icon" onclick="viewUser(${user.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-icon" onclick="editUser(${user.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon danger" onclick="deleteUser(${user.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function toggleView(view) {
    currentView = view;
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.toggle-btn').classList.add('active');
    renderUsers();
}

function toggleSelection(id) {
    if (selectedUsers.has(id)) {
        selectedUsers.delete(id);
    } else {
        selectedUsers.add(id);
    }
    updateBulkBar();
}

function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.row-checkbox, #usersGrid input[type="checkbox"]');
    const allChecked = selectedUsers.size === usersData.length;
    
    if (allChecked) {
        selectedUsers.clear();
    } else {
        usersData.forEach(u => selectedUsers.add(u.id));
    }
    
    renderUsers();
    updateBulkBar();
}

function updateBulkBar() {
    const bar = document.getElementById('bulkBar');
    const count = document.getElementById('selectedCount');
    
    if (selectedUsers.size > 0) {
        bar.style.display = 'flex';
        count.textContent = selectedUsers.size;
    } else {
        bar.style.display = 'none';
    }
}

function clearSelection() {
    selectedUsers.clear();
    renderUsers();
    updateBulkBar();
}

function viewUser(id) {
    const user = usersData.find(u => u.id === id);
    const modal = document.getElementById('userModal');
    const body = document.getElementById('modalBody');
    
    body.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <img src="https://ui-avatars.com/api/?name=${user.avatar}&background=random&color=fff&size=200" 
                 alt="${user.name}" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 1rem;">
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${user.name}</h3>
            <span class="status-badge ${user.status}">${user.status}</span>
        </div>
        <div style="display: grid; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 8px;">
                <span style="color: var(--text-muted);">Email</span>
                <span>${user.email}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 8px;">
                <span style="color: var(--text-muted);">Phone</span>
                <span>${user.phone}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 8px;">
                <span style="color: var(--text-muted);">College</span>
                <span>${user.college}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-tertiary); border-radius: 8px;">
                <span style="color: var(--text-muted);">Total Spent</span>
                <span style="color: var(--green); font-weight: 600;">₹${user.spent.toLocaleString('en-IN')}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('userModal').classList.remove('active');
}

function editUser(id) {
    const user = usersData.find(u => u.id === id);
    const newName = prompt('Edit user name:', user.name);
    if (newName && newName !== user.name) {
        user.name = newName;
        renderUsers();
        showToast('User updated successfully!', 'success');
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        const index = usersData.findIndex(u => u.id === id);
        if (index > -1) {
            usersData.splice(index, 1);
            selectedUsers.delete(id);
            renderUsers();
            updateBulkBar();
            showToast('User deleted successfully!', 'success');
        }
    }
}

function bulkDelete() {
    if (confirm(`Delete ${selectedUsers.size} selected users?`)) {
        selectedUsers.forEach(id => {
            const index = usersData.findIndex(u => u.id === id);
            if (index > -1) usersData.splice(index, 1);
        });
        selectedUsers.clear();
        renderUsers();
        updateBulkBar();
        showToast('Selected users deleted!', 'success');
    }
}

function bulkEmail() {
    const emails = Array.from(selectedUsers).map(id => usersData.find(u => u.id === id).email);
    window.location.href = `mailto:${emails.join(',')}`;
}

function bulkStatus() {
    const newStatus = prompt('Enter new status (active/inactive/suspended):', 'active');
    if (newStatus && ['active', 'inactive', 'suspended'].includes(newStatus)) {
        selectedUsers.forEach(id => {
            const user = usersData.find(u => u.id === id);
            if (user) user.status = newStatus;
        });
        renderUsers();
        showToast('Status updated for selected users!', 'success');
    }
}

function addNewUser() {
    const name = prompt('Enter user name:');
    if (name) {
        const newUser = {
            id: Math.max(...usersData.map(u => u.id)) + 1,
            name: name,
            email: name.toLowerCase().replace(' ', '.') + '@college.edu',
            phone: '+91 98765 ' + Math.floor(10000 + Math.random() * 90000),
            college: 'New College',
            joined: new Date().toISOString().split('T')[0],
            bookings: 0,
            spent: 0,
            status: 'active',
            avatar: name.split(' ').map(n => n[0]).join('')
        };
        usersData.unshift(newUser);
        renderUsers();
        showToast('New user added successfully!', 'success');
    }
}

function exportUsers() {
    showToast('Preparing CSV export...', 'info');
    setTimeout(() => {
        showToast('Download started!', 'success');
    }, 1500);
}

function applyFilters() {
    const status = document.getElementById('statusFilter').value;
    const college = document.getElementById('collegeFilter').value;
    
    let filtered = usersData;
    
    if (status) {
        filtered = filtered.filter(u => u.status === status);
    }
    if (college) {
        filtered = filtered.filter(u => u.college.includes(college) || (college === 'Other' && !u.college.match(/IIT|BITS|NIT|VIT/)));
    }
    
    renderUsers(filtered);
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalItems);
    
    document.getElementById('startRange').textContent = start;
    document.getElementById('endRange').textContent = end;
    document.getElementById('totalItems').textContent = totalItems.toLocaleString();
    
    // Update page numbers
    const pageContainer = document.getElementById('pageNumbers');
    let html = '';
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    pageContainer.innerHTML = html;
}

function changePage(direction) {
    const totalPages = Math.ceil(usersData.length / itemsPerPage);
    
    if (direction === 'first') currentPage = 1;
    else if (direction === 'last') currentPage = totalPages;
    else if (direction === 'prev') currentPage = Math.max(1, currentPage - 1);
    else if (direction === 'next') currentPage = Math.min(totalPages, currentPage + 1);
    
    renderUsers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPage(page) {
    currentPage = page;
    renderUsers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icons[type]} toast-icon"></i>
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

function toggleNotifications() {
    showToast('No new notifications', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
    }
}

// Close modal on outside click
document.getElementById('userModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

console.log('%c👥 NEXUS USERS MANAGEMENT', 'font-size: 20px; color: #8b5cf6; font-weight: bold;');
console.log('%cManage your users with style', 'color: #ec4899;');