// ============================================
// NEXUS ADMIN - FESTS MANAGEMENT
// ============================================

// Mock Fests Data
const festsData = [
    {
        id: 1,
        name: "Mood Indigo 2024",
        college: "IIT Bombay",
        host: "Amit Kumar",
        type: "cultural",
        status: "live",
        featured: true,
        startDate: "2024-03-15",
        endDate: "2024-03-17",
        banner: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        totalTickets: 5000,
        soldTickets: 3420,
        revenue: 856000,
        price: 250,
        attendees: 3200,
        rating: 4.8,
        description: "Asia's largest college cultural festival with music, dance, and art events."
    },
    {
        id: 2,
        name: "TechFest 2024",
        college: "IIT Delhi",
        host: "Rahul Verma",
        type: "technical",
        status: "upcoming",
        featured: true,
        startDate: "2024-03-25",
        endDate: "2024-03-27",
        banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        totalTickets: 3000,
        soldTickets: 1850,
        revenue: 555000,
        price: 300,
        attendees: 0,
        rating: 0,
        description: "Annual technical festival featuring hackathons, robotics, and coding competitions."
    },
    {
        id: 3,
        name: "Oasis 2024",
        college: "BITS Pilani",
        host: "Priya Sharma",
        type: "cultural",
        status: "live",
        featured: false,
        startDate: "2024-03-10",
        endDate: "2024-03-12",
        banner: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        totalTickets: 4000,
        soldTickets: 3800,
        revenue: 760000,
        price: 200,
        attendees: 3650,
        rating: 4.9,
        description: "The cultural fest of BITS Pilani featuring pro-nights and competitions."
    },
    {
        id: 4,
        name: "Spring Fest 2024",
        college: "IIT Kharagpur",
        host: "Ananya Gupta",
        type: "cultural",
        status: "completed",
        featured: false,
        startDate: "2024-02-20",
        endDate: "2024-02-22",
        banner: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
        totalTickets: 3500,
        soldTickets: 3500,
        revenue: 700000,
        price: 200,
        attendees: 3400,
        rating: 4.7,
        description: "Annual cultural festival with star performances and competitive events."
    },
    {
        id: 5,
        name: "Hackathon 2024",
        college: "BITS Goa",
        host: "Neha Reddy",
        type: "technical",
        status: "upcoming",
        featured: false,
        startDate: "2024-04-05",
        endDate: "2024-04-07",
        banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
        totalTickets: 800,
        soldTickets: 620,
        revenue: 124000,
        price: 200,
        attendees: 0,
        rating: 0,
        description: "24-hour hackathon with prizes worth ₹5 lakhs."
    },
    {
        id: 6,
        name: "Sports Meet 2024",
        college: "Manipal",
        host: "Rohan Mehta",
        type: "sports",
        status: "draft",
        featured: false,
        startDate: "2024-04-15",
        endDate: "2024-04-18",
        banner: "https://images.unsplash.com/photo-1461896836934- voices-of-children-3273332?w=800",
        totalTickets: 2000,
        soldTickets: 0,
        revenue: 0,
        price: 150,
        attendees: 0,
        rating: 0,
        description: "Inter-college sports tournament with 15+ events."
    },
    {
        id: 7,
        name: "Literary Fest",
        college: "NIT Warangal",
        host: "Divya Nair",
        type: "literary",
        status: "upcoming",
        featured: false,
        startDate: "2024-03-28",
        endDate: "2024-03-30",
        banner: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
        totalTickets: 1500,
        soldTickets: 890,
        revenue: 178000,
        price: 120,
        attendees: 0,
        rating: 0,
        description: "Celebration of literature with debates, poetry, and writing workshops."
    },
    {
        id: 8,
        name: "E-Summit 2024",
        college: "IIT Madras",
        host: "Arjun Verma",
        type: "management",
        status: "cancelled",
        featured: false,
        startDate: "2024-03-01",
        endDate: "2024-03-03",
        banner: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
        totalTickets: 2500,
        soldTickets: 450,
        revenue: 135000,
        price: 300,
        attendees: 0,
        rating: 0,
        description: "Entrepreneurship summit with keynote speakers and startup showcase."
    },
    {
        id: 9,
        name: "Rendezvous 2024",
        college: "IIT Delhi",
        host: "New Host",
        type: "cultural",
        status: "pending",
        featured: false,
        startDate: "2024-04-20",
        endDate: "2024-04-22",
        banner: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800",
        totalTickets: 6000,
        soldTickets: 0,
        revenue: 0,
        price: 350,
        attendees: 0,
        rating: 0,
        description: "Annual cultural festival awaiting approval."
    }
];

// State
let currentView = 'grid';
let selectedFests = new Set();
let currentFilter = 'all';
let currentCategory = 'all';
let currentSort = 'recent';
let currentPage = 1;
const itemsPerPage = 9;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderFests();
    initEventListeners();
    initMobileMenu();
    updateStats();
});

function initEventListeners() {
    const searchInput = document.getElementById('festSearch');
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
    const filtered = festsData.filter(fest => 
        fest.name.toLowerCase().includes(term) ||
        fest.college.toLowerCase().includes(term) ||
        fest.host.toLowerCase().includes(term)
    );
    renderFests(filtered);
}

function getFilteredFests() {
    let filtered = festsData;
    
    // Status filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(f => f.status === currentFilter);
    }
    
    // Category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(f => f.type === currentCategory);
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
        switch(currentSort) {
            case 'popular': return b.soldTickets - a.soldTickets;
            case 'revenue': return b.revenue - a.revenue;
            case 'date': return new Date(a.startDate) - new Date(b.startDate);
            case 'recent': return b.id - a.id;
            default: return 0;
        }
    });
    
    return filtered;
}

function renderFests(data = null) {
    const fests = data || getFilteredFests();
    
    if (currentView === 'grid') {
        renderGridView(fests);
    } else {
        renderListView(fests);
    }
    
    updatePagination(fests.length);
}

function renderGridView(fests) {
    const grid = document.getElementById('festsGrid');
    const list = document.getElementById('festsList');
    
    grid.style.display = 'grid';
    list.style.display = 'none';
    
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = fests.slice(start, start + itemsPerPage);
    
    grid.innerHTML = paginated.map(fest => `
        <div class="fest-card" data-id="${fest.id}">
            <div class="fest-banner">
                <img src="${fest.banner}" alt="${fest.name}">
                <div class="fest-overlay">
                    <div class="fest-badges">
                        ${fest.featured ? '<span class="badge-tag featured"><i class="fas fa-star"></i> Featured</span>' : ''}
                        ${getStatusBadge(fest.status)}
                        <span class="badge-tag category">${fest.type}</span>
                    </div>
                </div>
                <div class="fest-select">
                    <input type="checkbox" 
                        ${selectedFests.has(fest.id) ? 'checked' : ''} 
                        onchange="toggleSelection(${fest.id})"
                        onclick="event.stopPropagation()">
                </div>
            </div>
            <div class="fest-content">
                <div class="fest-header">
                    <h3 class="fest-title">
                        ${fest.name}
                        ${fest.rating > 0 ? `<i class="fas fa-star" title="${fest.rating}"></i>` : ''}
                    </h3>
                    <p class="fest-college">
                        <i class="fas fa-university"></i> ${fest.college}
                    </p>
                </div>
                <div class="fest-stats">
                    <div class="fest-stat">
                        <h5>${fest.soldTickets.toLocaleString()}</h5>
                        <span>Sold</span>
                    </div>
                    <div class="fest-stat">
                        <h5>₹${(fest.revenue / 1000).toFixed(1)}K</h5>
                        <span>Revenue</span>
                    </div>
                    <div class="fest-stat">
                        <h5>${fest.attendees > 0 ? fest.attendees.toLocaleString() : '-'}</h5>
                        <span>Attended</span>
                    </div>
                </div>
                <div class="fest-progress">
                    <div class="progress-header">
                        <span>Ticket Sales</span>
                        <span>${Math.round((fest.soldTickets / fest.totalTickets) * 100)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(fest.soldTickets / fest.totalTickets) * 100}%"></div>
                    </div>
                </div>
                <div class="fest-footer">
                    <div class="fest-date">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDateRange(fest.startDate, fest.endDate)}</span>
                    </div>
                    <div class="fest-actions">
                        <button class="action-btn" onclick="event.stopPropagation(); viewFest(${fest.id})" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="event.stopPropagation(); editFest(${fest.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn danger" onclick="event.stopPropagation(); deleteFest(${fest.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderListView(fests) {
    const grid = document.getElementById('festsGrid');
    const list = document.getElementById('festsList');
    
    grid.style.display = 'none';
    list.style.display = 'block';
    
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = fests.slice(start, start + itemsPerPage);
    
    list.innerHTML = `
        <div class="list-header">
            <div></div>
            <div>Event</div>
            <div>College</div>
            <div>Date</div>
            <div>Tickets</div>
            <div>Revenue</div>
            <div>Status</div>
            <div>Actions</div>
        </div>
        ${paginated.map(fest => `
            <div class="list-row" data-id="${fest.id}">
                <div class="list-cell">
                    <input type="checkbox" 
                        ${selectedFests.has(fest.id) ? 'checked' : ''} 
                        onchange="toggleSelection(${fest.id})">
                </div>
                <div class="list-cell">
                    <div class="list-fest-info">
                        <img src="${fest.banner}" alt="${fest.name}" class="list-fest-img">
                        <div class="list-fest-details">
                            <h5>${fest.name}</h5>
                            <span>${fest.type} • ${fest.host}</span>
                        </div>
                    </div>
                </div>
                <div>${fest.college}</div>
                <div>${formatDateShort(fest.startDate)}</div>
                <div>${fest.soldTickets}/${fest.totalTickets}</div>
                <div style="color: var(--green); font-weight: 600;">₹${fest.revenue.toLocaleString()}</div>
                <div>
                    <span class="status-pill ${fest.status}">${fest.status}</span>
                </div>
                <div class="fest-actions">
                    <button class="action-btn" onclick="viewFest(${fest.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editFest(${fest.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('')}`;
}

function getStatusBadge(status) {
    const badges = {
        live: '<span class="badge-tag live"><i class="fas fa-circle"></i> Live</span>',
        upcoming: '<span class="badge-tag upcoming">Upcoming</span>',
        completed: '<span class="badge-tag completed">Completed</span>',
        draft: '<span class="badge-tag draft">Draft</span>',
        cancelled: '<span class="badge-tag cancelled">Cancelled</span>',
        pending: '<span class="badge-tag pending">Pending</span>'
    };
    return badges[status] || '';
}

function toggleView(view) {
    currentView = view;
    document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.toggle-btn').classList.add('active');
    renderFests();
}

function filterFests(filter) {
    currentFilter = filter;
    currentPage = 1;
    
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.closest('.filter-tab').classList.add('active');
    
    renderFests();
}

function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1;
    
    document.querySelectorAll('.pill').forEach(pill => pill.classList.remove('active'));
    event.target.closest('.pill').classList.add('active');
    
    renderFests();
}

function sortFests() {
    currentSort = document.getElementById('sortFests').value;
    renderFests();
}

function toggleSelection(id) {
    if (selectedFests.has(id)) {
        selectedFests.delete(id);
    } else {
        selectedFests.add(id);
    }
    updateBulkBar();
}

function updateBulkBar() {
    const bar = document.getElementById('bulkBar');
    const count = document.getElementById('selectedCount');
    
    if (selectedFests.size > 0) {
        bar.style.display = 'flex';
        count.textContent = selectedFests.size;
    } else {
        bar.style.display = 'none';
    }
}

function clearSelection() {
    selectedFests.clear();
    renderFests();
    updateBulkBar();
}

function viewFest(id) {
    const fest = festsData.find(f => f.id === id);
    const modal = document.getElementById('festModal');
    const body = document.getElementById('modalBody');
    
    const progress = Math.round((fest.soldTickets / fest.totalTickets) * 100);
    
    body.innerHTML = `
        <div class="fest-modal-banner">
            <img src="${fest.banner}" alt="${fest.name}">
            <div class="fest-modal-overlay"></div>
        </div>
        <div class="fest-modal-header">
            <div class="fest-modal-title">
                <h2>${fest.name}</h2>
                <p>
                    <i class="fas fa-university"></i> ${fest.college} • 
                    <i class="fas fa-user"></i> Hosted by ${fest.host}
                </p>
            </div>
        </div>
        <div class="fest-modal-stats">
            <div class="modal-stat">
                <h4>${fest.soldTickets.toLocaleString()}</h4>
                <span>Tickets Sold</span>
            </div>
            <div class="modal-stat">
                <h4>₹${(fest.revenue / 100000).toFixed(2)}L</h4>
                <span>Revenue</span>
            </div>
            <div class="modal-stat">
                <h4>${fest.attendees > 0 ? fest.attendees.toLocaleString() : '-'}</h4>
                <span>Attendees</span>
            </div>
            <div class="modal-stat">
                <h4>${fest.rating > 0 ? fest.rating.toFixed(1) : '-'}</h4>
                <span>Rating</span>
            </div>
        </div>
        <div class="fest-modal-details">
            <div class="detail-section">
                <h4>About Event</h4>
                <p style="color: var(--text-secondary); line-height: 1.7;">${fest.description}</p>
            </div>
            <div class="detail-section">
                <h4>Event Details</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Type</span>
                        <span class="detail-value" style="text-transform: capitalize;">${fest.type}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status</span>
                        <span class="detail-value" style="text-transform: capitalize; color: ${getStatusColor(fest.status)};">${fest.status}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Start Date</span>
                        <span class="detail-value">${formatDate(fest.startDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">End Date</span>
                        <span class="detail-value">${formatDate(fest.endDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Ticket Price</span>
                        <span class="detail-value">₹${fest.price}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total Tickets</span>
                        <span class="detail-value">${fest.totalTickets.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Sales Progress</h4>
                <div class="progress-bar" style="height: 10px; margin-top: 0.5rem;">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <p style="text-align: center; margin-top: 0.75rem; color: var(--text-muted);">
                    ${fest.soldTickets.toLocaleString()} of ${fest.totalTickets.toLocaleString()} tickets sold (${progress}%)
                </p>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function getStatusColor(status) {
    const colors = {
        live: 'var(--green)',
        upcoming: 'var(--blue)',
        completed: 'var(--purple)',
        draft: 'var(--gold)',
        cancelled: 'var(--red)',
        pending: 'var(--orange)'
    };
    return colors[status] || 'var(--text-primary)';
}

function closeModal() {
    document.getElementById('festModal').classList.remove('active');
}

function editFest(id) {
    const fest = festsData.find(f => f.id === id);
    const newName = prompt('Edit fest name:', fest.name);
    if (newName && newName !== fest.name) {
        fest.name = newName;
        renderFests();
        showToast('Fest updated successfully!', 'success');
    }
}

function deleteFest(id) {
    if (confirm('Are you sure you want to delete this fest?')) {
        const index = festsData.findIndex(f => f.id === id);
        if (index > -1) {
            festsData.splice(index, 1);
            selectedFests.delete(id);
            renderFests();
            updateBulkBar();
            updateStats();
            showToast('Fest deleted successfully!', 'success');
        }
    }
}

function bulkFeature() {
    selectedFests.forEach(id => {
        const fest = festsData.find(f => f.id === id);
        if (fest) fest.featured = true;
    });
    selectedFests.clear();
    renderFests();
    updateBulkBar();
    showToast('Fests featured!', 'success');
}

function bulkPromote() {
    showToast('Promotional campaign started for selected fests!', 'success');
    selectedFests.clear();
    updateBulkBar();
}

function bulkCancel() {
    if (confirm(`Cancel ${selectedFests.size} selected fests?`)) {
        selectedFests.forEach(id => {
            const fest = festsData.find(f => f.id === id);
            if (fest) fest.status = 'cancelled';
        });
        selectedFests.clear();
        renderFests();
        updateBulkBar();
        updateStats();
        showToast('Selected fests cancelled', 'warning');
    }
}

function createFest() {
    const name = prompt('Enter fest name:');
    if (name) {
        const newFest = {
            id: Math.max(...festsData.map(f => f.id)) + 1,
            name: name,
            college: 'New College',
            host: 'New Host',
            type: 'cultural',
            status: 'draft',
            featured: false,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            totalTickets: 1000,
            soldTickets: 0,
            revenue: 0,
            price: 200,
            attendees: 0,
            rating: 0,
            description: 'New fest description.'
        };
        festsData.unshift(newFest);
        renderFests();
        updateStats();
        showToast('New fest created!', 'success');
    }
}

function exportFests() {
    showToast('Preparing export...', 'info');
    setTimeout(() => showToast('Download started!', 'success'), 1500);
}

// Pending Approvals
function openPendingApprovals() {
    const modal = document.getElementById('approvalModal');
    const list = document.getElementById('approvalList');
    
    const pending = festsData.filter(f => f.status === 'pending');
    
    list.innerHTML = pending.map(fest => `
        <div class="approval-item">
            <img src="${fest.banner}" alt="${fest.name}">
            <div class="approval-info">
                <h4>${fest.name}</h4>
                <p>${fest.college} • ${fest.host}</p>
                <div class="approval-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(fest.startDate)}</span>
                    <span><i class="fas fa-ticket-alt"></i> ₹${fest.price}</span>
                </div>
            </div>
            <div class="approval-actions">
                <button class="btn-approve" onclick="approveFest(${fest.id})" title="Approve">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn-reject" onclick="rejectFest(${fest.id})" title="Reject">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('') || '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No pending approvals</p>';
    
    modal.classList.add('active');
}

function closeApprovalModal() {
    document.getElementById('approvalModal').classList.remove('active');
}

function approveFest(id) {
    const fest = festsData.find(f => f.id === id);
    if (fest) {
        fest.status = 'upcoming';
        renderFests();
        updateStats();
        openPendingApprovals();
        showToast(`${fest.name} approved!`, 'success');
    }
}

function rejectFest(id) {
    const fest = festsData.find(f => f.id === id);
    if (confirm(`Reject ${fest.name}?`)) {
        fest.status = 'cancelled';
        renderFests();
        updateStats();
        openPendingApprovals();
        showToast('Fest rejected', 'info');
    }
}

// Calendar View
function toggleCalendarView() {
    const modal = document.getElementById('calendarModal');
    const body = document.getElementById('calendarBody');
    
    // Generate simple calendar
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    body.innerHTML = `
        <div class="calendar-grid">
            ${days.map(d => `<div class="calendar-day-header">${d}</div>`).join('')}
            ${generateCalendarDays(currentYear, currentMonth)}
        </div>
    `;
    
    modal.classList.add('active');
}

function generateCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    let html = '';
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasEvent = festsData.some(f => f.startDate === dateStr || f.endDate === dateStr);
        const isToday = day === new Date().getDate() && month === new Date().getMonth();
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
                ${day}
                ${hasEvent ? '<div class="event-dots"><div class="event-dot" style="background: var(--pink);"></div></div>' : ''}
            </div>
        `;
    }
    
    return html;
}

function closeCalendarModal() {
    document.getElementById('calendarModal').classList.remove('active');
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
    
    html += `<button class="page-btn" onclick="changePage('prev')" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    html += `<button class="page-btn" onclick="changePage('next')" ${currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    pagination.innerHTML = html;
}

function changePage(direction) {
    const totalPages = Math.ceil(getFilteredFests().length / itemsPerPage);
    if (direction === 'prev') currentPage = Math.max(1, currentPage - 1);
    if (direction === 'next') currentPage = Math.min(totalPages, currentPage + 1);
    renderFests();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPage(page) {
    currentPage = page;
    renderFests();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Stats
function updateStats() {
    const total = festsData.length;
    const live = festsData.filter(f => f.status === 'live').length;
    const upcoming = festsData.filter(f => f.status === 'upcoming').length;
    const completed = festsData.filter(f => f.status === 'completed').length;
    const draft = festsData.filter(f => f.status === 'draft').length;
    const cancelled = festsData.filter(f => f.status === 'cancelled').length;
    
    // Update tab counts
    document.querySelector('[data-filter="all"] .count').textContent = total;
    document.querySelector('[data-filter="live"] .count').textContent = live;
    document.querySelector('[data-filter="upcoming"] .count').textContent = upcoming;
    document.querySelector('[data-filter="completed"] .count').textContent = completed;
    document.querySelector('[data-filter="draft"] .count').textContent = draft;
    document.querySelector('[data-filter="cancelled"] .count').textContent = cancelled;
}

// Utilities
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateRange(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    if (s.getMonth() === e.getMonth()) {
        return `${s.getDate()}-${e.getDate()} ${s.toLocaleString('default', { month: 'short' })}`;
    }
    return `${formatDateShort(start)} - ${formatDateShort(end)}`;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle',
        error: 'times-circle'
    };
    
    const colors = {
        success: 'var(--green)',
        warning: 'var(--orange)',
        info: 'var(--blue)',
        error: 'var(--red)'
    };
    
    toast.style.borderLeftColor = colors[type] || colors.info;
    toast.innerHTML = `
        <i class="fas fa-${icons[type]} toast-icon" style="color: ${colors[type] || colors.info}"></i>
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

function openDatePicker() {
    showToast('Date picker coming soon!', 'info');
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
        closeApprovalModal();
        closeCalendarModal();
    }
});

console.log('%c🎉 NEXUS FESTS MANAGEMENT', 'font-size: 20px; color: #ec4899; font-weight: bold;');
console.log('%cManage your college events', 'color: #8b5cf6;');