// ============================================
// NEXUS ADMIN - HOSTS MANAGEMENT
// ============================================

// Mock Hosts Data
const hostsData = [
    {
        id: 1,
        name: "Rahul Verma",
        email: "rahul.v@iitd.ac.in",
        college: "IIT Delhi",
        avatar: "RV",
        status: "verified",
        eventsHosted: 12,
        totalEarnings: 245000,
        rating: 4.9,
        totalBookings: 1250,
        joined: "2023-08-15",
        phone: "+91 98765 43210",
        department: "Computer Science",
        year: "3rd Year",
        bio: "Passionate about organizing technical fests and hackathons. Led TechFest 2024 with 5000+ participants."
    },
    {
        id: 2,
        name: "Priya Sharma",
        email: "priya.s@bits-pilani.ac.in",
        college: "BITS Pilani",
        avatar: "PS",
        status: "verified",
        eventsHosted: 8,
        totalEarnings: 189000,
        rating: 4.8,
        totalBookings: 980,
        joined: "2023-09-20",
        phone: "+91 98765 43211",
        department: "Electronics",
        year: "4th Year",
        bio: "Cultural fest coordinator with expertise in managing large-scale events and artist bookings."
    },
    {
        id: 3,
        name: "Amit Kumar",
        email: "amit.k@iitb.ac.in",
        college: "IIT Bombay",
        avatar: "AK",
        status: "verified",
        eventsHosted: 15,
        totalEarnings: 320000,
        rating: 4.9,
        totalBookings: 2100,
        joined: "2023-07-10",
        phone: "+91 98765 43212",
        department: "Mechanical",
        year: "4th Year",
        bio: "Founder of Mood Indigo Tech Team. Specializes in sponsorship and corporate relations."
    },
    {
        id: 4,
        name: "Sneha Patel",
        email: "sneha.p@vit.ac.in",
        college: "VIT Vellore",
        avatar: "SP",
        status: "pending",
        eventsHosted: 0,
        totalEarnings: 0,
        rating: 0,
        totalBookings: 0,
        joined: "2024-01-25",
        phone: "+91 98765 43213",
        department: "Business",
        year: "2nd Year",
        bio: "New host applicant looking to organize cultural events and workshops."
    },
    {
        id: 5,
        name: "Rohan Mehta",
        email: "rohan.m@manipal.edu",
        college: "Manipal",
        avatar: "RM",
        status: "verified",
        eventsHosted: 6,
        totalEarnings: 145000,
        rating: 4.7,
        totalBookings: 720,
        joined: "2023-10-05",
        phone: "+91 98765 43214",
        department: "Civil",
        year: "3rd Year",
        bio: "Sports fest coordinator. Organized inter-college tournaments with 50+ colleges participation."
    },
    {
        id: 6,
        name: "Ananya Gupta",
        email: "ananya.g@iitkgp.ac.in",
        college: "IIT Kharagpur",
        avatar: "AG",
        status: "verified",
        eventsHosted: 9,
        totalEarnings: 198000,
        rating: 4.8,
        totalBookings: 1100,
        joined: "2023-08-22",
        phone: "+91 98765 43215",
        department: "Chemical",
        year: "4th Year",
        bio: "Literary fest head. Conducted poetry slams, debates, and writing workshops."
    },
    {
        id: 7,
        name: "Vikram Rao",
        email: "vikram.r@nitt.edu",
        college: "NIT Trichy",
        avatar: "VR",
        status: "suspended",
        eventsHosted: 3,
        totalEarnings: 45000,
        rating: 3.2,
        totalBookings: 180,
        joined: "2023-11-15",
        phone: "+91 98765 43216",
        department: "ECE",
        year: "3rd Year",
        bio: "Account suspended due to policy violations. Under review."
    },
    {
        id: 8,
        name: "Neha Reddy",
        email: "neha.r@bits-goa.ac.in",
        college: "BITS Goa",
        avatar: "NR",
        status: "verified",
        eventsHosted: 11,
        totalEarnings: 234000,
        rating: 4.9,
        totalBookings: 1400,
        joined: "2023-09-12",
        phone: "+91 98765 43217",
        department: "Computer Science",
        year: "4th Year",
        bio: "Full-stack developer and event manager. Organized Goa' s largest student hackathon."
    },
    {
        id: 9,
        name: "Karan Malhotra",
        email: "karan.m@iitm.ac.in",
        college: "IIT Madras",
        avatar: "KM",
        status: "pending",
        eventsHosted: 0,
        totalEarnings: 0,
        rating: 0,
        totalBookings: 0,
        joined: "2024-02-10",
        phone: "+91 98765 43218",
        department: "Aerospace",
        year: "2nd Year",
        bio: "Aspiring event manager. Looking to organize technical workshops and seminars."
    },
    {
        id: 10,
        name: "Divya Nair",
        email: "divya.n@nitw.ac.in",
        college: "NIT Warangal",
        avatar: "DN",
        status: "verified",
        eventsHosted: 14,
        totalEarnings: 278000,
        rating: 4.8,
        totalBookings: 1650,
        joined: "2023-07-28",
        phone: "+91 98765 43219",
        department: "IT",
        year: "4th Year",
        bio: "Fest coordinator for 3 consecutive years. Expert in logistics and crowd management."
    },
    {
        id: 11,
        name: "Arjun Verma",
        email: "arjun.v@iitd.ac.in",
        college: "IIT Delhi",
        avatar: "AV",
        status: "verified",
        eventsHosted: 7,
        totalEarnings: 156000,
        rating: 4.6,
        totalBookings: 890,
        joined: "2023-10-18",
        phone: "+91 98765 43220",
        department: "Electrical",
        year: "3rd Year",
        bio: "Music fest organizer. Brought international artists to campus events."
    },
    {
        id: 12,
        name: "Shreya Iyer",
        email: "shreya.i@bits-pilani.ac.in",
        college: "BITS Pilani",
        avatar: "SI",
        status: "pending",
        eventsHosted: 0,
        totalEarnings: 0,
        rating: 0,
        totalBookings: 0,
        joined: "2024-02-15",
        phone: "+91 98765 43221",
        department: "Biology",
        year: "2nd Year",
        bio: "Science fest enthusiast. Wants to organize research symposiums and science exhibitions."
    }
];

// State
let currentView = 'grid';
let selectedHosts = new Set();
let currentFilter = 'all';
let currentPage = 1;
let currentSort = 'recent';
const itemsPerPage = 9;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderHosts();
    initEventListeners();
    initMobileMenu();
    updateStats();
});

function initEventListeners() {
    // Search with debounce
    const searchInput = document.getElementById('hostSearch');
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
    const filtered = hostsData.filter(host => 
        host.name.toLowerCase().includes(term) ||
        host.email.toLowerCase().includes(term) ||
        host.college.toLowerCase().includes(term)
    );
    renderHosts(filtered);
}

function getFilteredHosts() {
    let filtered = hostsData;
    
    if (currentFilter !== 'all') {
        filtered = hostsData.filter(h => h.status === currentFilter);
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
        switch(currentSort) {
            case 'earnings': return b.totalEarnings - a.totalEarnings;
            case 'rating': return b.rating - a.rating;
            case 'events': return b.eventsHosted - a.eventsHosted;
            case 'recent': return new Date(b.joined) - new Date(a.joined);
            default: return 0;
        }
    });
    
    return filtered;
}

function renderHosts(data = null) {
    const hosts = data || getFilteredHosts();
    
    if (currentView === 'grid') {
        renderGridView(hosts);
    } else {
        renderListView(hosts);
    }
    
    updatePagination(hosts.length);
}

function renderGridView(hosts) {
    const grid = document.getElementById('hostsGrid');
    const list = document.getElementById('hostsList');
    
    grid.style.display = 'grid';
    list.style.display = 'none';
    
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = hosts.slice(start, start + itemsPerPage);
    
    grid.innerHTML = paginated.map(host => `
        <div class="host-card" data-id="${host.id}">
            <div class="host-select">
                <input type="checkbox" 
                    ${selectedHosts.has(host.id) ? 'checked' : ''} 
                    onchange="toggleSelection(${host.id})"
                    onclick="event.stopPropagation()">
            </div>
            <div class="host-card-header">
                <div class="host-profile" onclick="viewHost(${host.id})">
                    <div class="host-avatar-wrap">
                        <img src="https://ui-avatars.com/api/?name=${host.avatar}&background=random&color=fff&size=128" 
                             alt="${host.name}" class="host-avatar">
                        ${getVerificationBadge(host.status)}
                    </div>
                    <div class="host-title">
                        <h4>${host.name}</h4>
                        <p>${host.college}</p>
                    </div>
                </div>
            </div>
            <div class="host-stats">
                <div class="stat-box">
                    <h5>${host.eventsHosted}</h5>
                    <span>Events</span>
                </div>
                <div class="stat-box">
                    <h5>₹${(host.totalEarnings / 1000).toFixed(1)}K</h5>
                    <span>Earnings</span>
                </div>
                <div class="stat-box">
                    <h5>${host.totalBookings}</h5>
                    <span>Bookings</span>
                </div>
            </div>
            <div class="host-footer">
                <div class="host-rating">
                    <div class="rating-stars">
                        ${generateStars(host.rating)}
                    </div>
                    <span class="rating-value">${host.rating > 0 ? host.rating.toFixed(1) : 'N/A'}</span>
                </div>
                <div class="host-actions">
                    <button class="action-btn" onclick="event.stopPropagation(); viewHost(${host.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); editHost(${host.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn danger" onclick="event.stopPropagation(); deleteHost(${host.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderListView(hosts) {
    const grid = document.getElementById('hostsGrid');
    const list = document.getElementById('hostsList');
    
    grid.style.display = 'none';
    list.style.display = 'block';
    
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = hosts.slice(start, start + itemsPerPage);
    
    list.innerHTML = `
        <div class="list-header">
            <div></div>
            <div>Host</div>
            <div>College</div>
            <div>Events</div>
            <div>Earnings</div>
            <div>Rating</div>
            <div>Actions</div>
        </div>
        ${paginated.map(host => `
            <div class="list-row" data-id="${host.id}">
                <div class="list-cell">
                    <input type="checkbox" 
                        ${selectedHosts.has(host.id) ? 'checked' : ''} 
                        onchange="toggleSelection(${host.id})">
                </div>
                <div class="list-cell">
                    <img src="https://ui-avatars.com/api/?name=${host.avatar}&background=random&color=fff" 
                         alt="${host.name}" class="list-avatar">
                    <div class="list-info">
                        <h5>${host.name}</h5>
                        <span>${host.email}</span>
                    </div>
                </div>
                <div>${host.college}</div>
                <div>${host.eventsHosted}</div>
                <div class="earnings">₹${host.totalEarnings.toLocaleString('en-IN')}</div>
                <div>
                    <span style="color: var(--gold);">
                        <i class="fas fa-star"></i> ${host.rating > 0 ? host.rating.toFixed(1) : '-'}
                    </span>
                </div>
                <div class="host-actions">
                    <button class="action-btn" onclick="viewHost(${host.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editHost(${host.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('')}
    `;
}

function getVerificationBadge(status) {
    const icons = {
        verified: '<i class="fas fa-check"></i>',
        pending: '<i class="fas fa-clock"></i>',
        suspended: '<i class="fas fa-ban"></i>'
    };
    return `<div class="verification-badge ${status}">${icons[status]}</div>`;
}

function generateStars(rating) {
    if (rating === 0) return '<i class="far fa-star"></i>'.repeat(5);
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) stars += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt"></i>';
        else stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

function toggleView(view) {
    currentView = view;
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.toggle-btn').classList.add('active');
    renderHosts();
}

function filterHosts(filter) {
    currentFilter = filter;
    currentPage = 1;
    
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.closest('.filter-tab').classList.add('active');
    
    renderHosts();
}

function sortHosts() {
    currentSort = document.getElementById('sortHosts').value;
    renderHosts();
}

function toggleSelection(id) {
    if (selectedHosts.has(id)) {
        selectedHosts.delete(id);
    } else {
        selectedHosts.add(id);
    }
    updateBulkBar();
}

function updateBulkBar() {
    const bar = document.getElementById('bulkBar');
    const count = document.getElementById('selectedCount');
    
    if (selectedHosts.size > 0) {
        bar.style.display = 'flex';
        count.textContent = selectedHosts.size;
    } else {
        bar.style.display = 'none';
    }
}

function clearSelection() {
    selectedHosts.clear();
    renderHosts();
    updateBulkBar();
}

function viewHost(id) {
    const host = hostsData.find(h => h.id === id);
    const modal = document.getElementById('hostModal');
    const body = document.getElementById('modalBody');
    
    body.innerHTML = `
        <div class="host-modal-header">
            <img src="https://ui-avatars.com/api/?name=${host.avatar}&background=random&color=fff&size=200" 
                 alt="${host.name}" class="host-modal-avatar">
            <div class="host-modal-title">
                <h2>${host.name}</h2>
                <p style="color: var(--text-muted);">${host.college} • ${host.department}</p>
                <span class="status-badge ${host.status}" style="margin-top: 0.5rem; display: inline-block;">
                    ${host.status}
                </span>
            </div>
        </div>
        <div class="host-modal-stats">
            <div class="modal-stat">
                <h4>${host.eventsHosted}</h4>
                <span>Events Hosted</span>
            </div>
            <div class="modal-stat">
                <h4>₹${(host.totalEarnings / 100000).toFixed(2)}L</h4>
                <span>Total Earnings</span>
            </div>
            <div class="modal-stat">
                <h4>${host.totalBookings}</h4>
                <span>Total Bookings</span>
            </div>
        </div>
        <div class="host-modal-details">
            <div class="detail-row">
                <span class="detail-label">Email</span>
                <span class="detail-value">${host.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value">${host.phone}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Year</span>
                <span class="detail-value">${host.year}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Member Since</span>
                <span class="detail-value">${formatDate(host.joined)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Rating</span>
                <span class="detail-value" style="color: var(--gold);">
                    ${generateStars(host.rating)} ${host.rating > 0 ? host.rating.toFixed(1) : 'No ratings yet'}
                </span>
            </div>
            <div class="detail-row" style="flex-direction: column; gap: 0.5rem;">
                <span class="detail-label">Bio</span>
                <span class="detail-value" style="line-height: 1.6; color: var(--text-secondary);">${host.bio}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('hostModal').classList.remove('active');
}

function editHost(id) {
    const host = hostsData.find(h => h.id === id);
    const newName = prompt('Edit host name:', host.name);
    if (newName && newName !== host.name) {
        host.name = newName;
        host.avatar = newName.split(' ').map(n => n[0]).join('');
        renderHosts();
        showToast('Host updated successfully!', 'success');
    }
}

function deleteHost(id) {
    if (confirm('Are you sure you want to delete this host?')) {
        const index = hostsData.findIndex(h => h.id === id);
        if (index > -1) {
            hostsData.splice(index, 1);
            selectedHosts.delete(id);
            renderHosts();
            updateBulkBar();
            updateStats();
            showToast('Host deleted successfully!', 'success');
        }
    }
}

function bulkVerify() {
    selectedHosts.forEach(id => {
        const host = hostsData.find(h => h.id === id);
        if (host) host.status = 'verified';
    });
    selectedHosts.clear();
    renderHosts();
    updateBulkBar();
    updateStats();
    showToast('Selected hosts verified!', 'success');
}

function bulkMessage() {
    const emails = Array.from(selectedHosts).map(id => hostsData.find(h => h.id === id).email);
    window.location.href = `mailto:${emails.join(',')}`;
}

function bulkSuspend() {
    selectedHosts.forEach(id => {
        const host = hostsData.find(h => h.id === id);
        if (host) host.status = 'suspended';
    });
    selectedHosts.clear();
    renderHosts();
    updateBulkBar();
    updateStats();
    showToast('Selected hosts suspended!', 'warning');
}

function addNewHost() {
    const name = prompt('Enter host name:');
    if (name) {
        const newHost = {
            id: Math.max(...hostsData.map(h => h.id)) + 1,
            name: name,
            email: name.toLowerCase().replace(' ', '.') + '@college.edu',
            college: 'New College',
            avatar: name.split(' ').map(n => n[0]).join(''),
            status: 'pending',
            eventsHosted: 0,
            totalEarnings: 0,
            rating: 0,
            totalBookings: 0,
            joined: new Date().toISOString().split('T')[0],
            phone: '+91 98765 ' + Math.floor(10000 + Math.random() * 90000),
            department: 'General',
            year: '3rd Year',
            bio: 'New host on the platform.'
        };
        hostsData.unshift(newHost);
        renderHosts();
        updateStats();
        showToast('New host added! Pending verification.', 'success');
    }
}

function exportHosts() {
    showToast('Preparing export...', 'info');
    setTimeout(() => showToast('Download started!', 'success'), 1500);
}

// Verification Queue
function openVerificationQueue() {
    const modal = document.getElementById('verificationModal');
    const list = document.getElementById('verificationList');
    
    const pending = hostsData.filter(h => h.status === 'pending');
    
    list.innerHTML = pending.map(host => `
        <div class="verification-item">
            <img src="https://ui-avatars.com/api/?name=${host.avatar}&background=random&color=fff" alt="${host.name}">
            <div class="verification-info">
                <h4>${host.name}</h4>
                <p>${host.college} • Applied ${formatDate(host.joined)}</p>
            </div>
            <div class="verification-actions">
                <button class="btn-approve" onclick="approveHost(${host.id})" title="Approve">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn-reject" onclick="rejectHost(${host.id})" title="Reject">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('') || '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No pending verifications</p>';
    
    modal.classList.add('active');
}

function closeVerificationModal() {
    document.getElementById('verificationModal').classList.remove('active');
}

function approveHost(id) {
    const host = hostsData.find(h => h.id === id);
    if (host) {
        host.status = 'verified';
        renderHosts();
        updateStats();
        openVerificationQueue(); // Refresh list
        showToast(`${host.name} approved!`, 'success');
    }
}

function rejectHost(id) {
    const host = hostsData.find(h => h.id === id);
    if (confirm(`Reject ${host.name}'s application?`)) {
        host.status = 'suspended';
        renderHosts();
        updateStats();
        openVerificationQueue();
        showToast('Application rejected', 'info');
    }
}

// Pagination
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, totalItems);
    
    document.getElementById('showStart').textContent = start;
    document.getElementById('showEnd').textContent = end;
    document.getElementById('showTotal').textContent = totalItems;
    
    const pagination = document.getElementById('pagination');
    let html = '';
    
    // Prev
    html += `<button class="page-btn" onclick="changePage('prev')" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Pages
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span style="color: var(--text-muted); padding: 0 0.5rem;">...</span>`;
        }
    }
    
    // Next
    html += `<button class="page-btn" onclick="changePage('next')" ${currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    pagination.innerHTML = html;
}

function changePage(direction) {
    const totalPages = Math.ceil(getFilteredHosts().length / itemsPerPage);
    if (direction === 'prev') currentPage = Math.max(1, currentPage - 1);
    if (direction === 'next') currentPage = Math.min(totalPages, currentPage + 1);
    renderHosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPage(page) {
    currentPage = page;
    renderHosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Stats
function updateStats() {
    const total = hostsData.length;
    const verified = hostsData.filter(h => h.status === 'verified').length;
    const pending = hostsData.filter(h => h.status === 'pending').length;
    const suspended = hostsData.filter(h => h.status === 'suspended').length;
    const totalEarnings = hostsData.reduce((sum, h) => sum + h.totalEarnings, 0);
    
    // Update tab counts
    document.querySelector('[data-filter="all"] .count').textContent = total;
    document.querySelector('[data-filter="verified"] .count').textContent = verified;
    document.querySelector('[data-filter="pending"] .count').textContent = pending;
    document.querySelector('[data-filter="suspended"] .count').textContent = suspended;
    
    // Update overview cards (simplified)
    document.querySelector('.overview-card.featured h3').textContent = total;
}

// Utilities
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const colors = {
        success: 'var(--green)',
        warning: 'var(--orange)',
        info: 'var(--blue)',
        error: 'var(--red)'
    };
    
    toast.style.borderLeftColor = colors[type] || colors.info;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} toast-icon" 
           style="color: ${colors[type] || colors.info}"></i>
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
        toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
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

// Close modals on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeVerificationModal();
    }
});

console.log('%c👔 NEXUS HOSTS MANAGEMENT', 'font-size: 20px; color: #fbbf24; font-weight: bold;');
console.log('%cManage your event organizers', 'color: #8b5cf6;');