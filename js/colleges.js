// ============================================
// NEXUS ADMIN - COLLEGE MANAGEMENT
// ============================================

// Mock Colleges Data
const collegesData = [
    {
        id: 1,
        name: "Indian Institute of Technology Delhi",
        shortName: "IIT Delhi",
        code: "IITD",
        type: "iit",
        city: "New Delhi",
        state: "Delhi",
        address: "Hauz Khas, New Delhi - 110016",
        email: "info@iitd.ac.in",
        phone: "+91 11 2659 1717",
        website: "https://www.iitd.ac.in",
        ranking: 1,
        established: 1961,
        students: 8000,
        area: 325,
        fests: 12,
        hosts: 45,
        status: "active",
        verified: true,
        logo: null
    },
    {
        id: 2,
        name: "Indian Institute of Technology Bombay",
        shortName: "IIT Bombay",
        code: "IITB",
        type: "iit",
        city: "Mumbai",
        state: "Maharashtra",
        address: "Powai, Mumbai - 400076",
        email: "info@iitb.ac.in",
        phone: "+91 22 2572 2545",
        website: "https://www.iitb.ac.in",
        ranking: 2,
        established: 1958,
        students: 10000,
        area: 550,
        fests: 15,
        hosts: 52,
        status: "active",
        verified: true,
        logo: null
    },
    {
        id: 3,
        name: "Indian Institute of Technology Madras",
        shortName: "IIT Madras",
        code: "IITM",
        type: "iit",
        city: "Chennai",
        state: "Tamil Nadu",
        address: "Guindy, Chennai - 600036",
        email: "info@iitm.ac.in",
        phone: "+91 44 2257 8000",
        website: "https://www.iitm.ac.in",
        ranking: 3,
        established: 1959,
        students: 9000,
        area: 620,
        fests: 14,
        hosts: 48,
        status: "active",
        verified: true,
        logo: null
    },
    {
        id: 4,
        name: "Birla Institute of Technology and Science Pilani",
        shortName: "BITS Pilani",
        code: "BITSP",
        type: "bits",
        city: "Pilani",
        state: "Rajasthan",
        address: "Vidya Vihar, Pilani - 333031",
        email: "info@bits-pilani.ac.in",
        phone: "+91 1596 245 073",
        website: "https://www.bits-pilani.ac.in",
        ranking: 15,
        established: 1964,
        students: 5000,
        area: 328,
        fests: 8,
        hosts: 32,
        status: "active",
        verified: true,
        logo: null
    },
    {
        id: 5,
        name: "National Institute of Technology Trichy",
        shortName: "NIT Trichy",
        code: "NITT",
        type: "nit",
        city: "Tiruchirappalli",
        state: "Tamil Nadu",
        address: "Tanjore Main Road, Trichy - 620015",
        email: "info@nitt.edu",
        phone: "+91 431 250 3000",
        website: "https://www.nitt.edu",
        ranking: 8,
        established: 1964,
        students: 6000,
        area: 800,
        fests: 10,
        hosts: 38,
        status: "active",
        verified: true,
        logo: null
    },
    {
        id: 6,
        name: "International Institute of Information Technology Hyderabad",
        shortName: "IIIT Hyderabad",
        code: "IIITH",
        type: "iiit",
        city: "Hyderabad",
        state: "Telangana",
        address: "Gachibowli, Hyderabad - 500032",
        email: "info@iiit.ac.in",
        phone: "+91 40 6653 1000",
        website: "https://www.iiit.ac.in",
        ranking: 12,
        established: 1998,
        students: 2000,
        area: 66,
        fests: 6,
        hosts: 25,
        status: "active",
        verified: true,
        logo: null
    }
];

// State Management
let currentView = 'grid';
let currentFilter = 'all';
let currentSort = 'ranking';
let selectedColleges = new Set();
let currentPage = 1;
const itemsPerPage = 12;
let editingCollegeId = null;
let deleteCollegeId = null;

// DOM Elements
const collegesGrid = document.getElementById('collegesGrid');
const collegesList = document.getElementById('collegesList');
const collegesMap = document.getElementById('collegesMap');
const pagination = document.getElementById('pagination');
const selectedInfo = document.getElementById('selectedInfo');
const selectedCount = document.getElementById('selectedCount');
const searchInput = document.getElementById('collegeSearch');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderColleges();
    updateStats();
    
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Mobile menu toggle
    document.getElementById('mobileMenuToggle').addEventListener('click', toggleSidebar);
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
});

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderColleges() {
    const filtered = getFilteredColleges();
    const paginated = getPaginatedData(filtered);
    
    if (currentView === 'grid') {
        renderGridView(paginated);
        collegesGrid.style.display = 'grid';
        collegesList.style.display = 'none';
        collegesMap.style.display = 'none';
    } else if (currentView === 'list') {
        renderListView(paginated);
        collegesGrid.style.display = 'none';
        collegesList.style.display = 'block';
        collegesMap.style.display = 'none';
    } else {
        collegesGrid.style.display = 'none';
        collegesList.style.display = 'none';
        collegesMap.style.display = 'flex';
    }
    
    renderPagination(filtered.length);
    updateShowingText(filtered.length);
}

function renderGridView(colleges) {
    collegesGrid.innerHTML = colleges.map(college => `
        <div class="college-card ${selectedColleges.has(college.id) ? 'selected' : ''}" data-id="${college.id}">
            <div class="college-select">
                <input type="checkbox" ${selectedColleges.has(college.id) ? 'checked' : ''} 
                    onchange="toggleSelection(${college.id})">
            </div>
            <div class="college-header">
                <div class="college-logo">
                    <i class="fas fa-university"></i>
                </div>
                <div class="college-info">
                    <h3>${college.shortName}</h3>
                    <span class="college-type">${college.type.toUpperCase()}</span>
                    <div class="college-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${college.city}, ${college.state}</span>
                    </div>
                </div>
            </div>
            <div class="college-body">
                <div class="college-stats">
                    <div class="college-stat">
                        <h4>${college.fests}</h4>
                        <span>Fests</span>
                    </div>
                    <div class="college-stat">
                        <h4>${college.hosts}</h4>
                        <span>Hosts</span>
                    </div>
                    <div class="college-stat">
                        <h4>${(college.students / 1000).toFixed(1)}K</h4>
                        <span>Students</span>
                    </div>
                </div>
                <div class="college-ranking">
                    <i class="fas fa-trophy"></i>
                    <span>NIRF Ranking</span>
                    <strong>#${college.ranking}</strong>
                </div>
            </div>
            <div class="college-footer">
                <div class="college-status">
                    <span class="status-dot ${college.status}"></span>
                    <span>${college.verified ? 'Verified' : 'Pending'}</span>
                </div>
                <div class="college-actions">
                    <button class="action-btn" onclick="viewCollege(${college.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editCollege(${college.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn danger" onclick="deleteCollege(${college.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderListView(colleges) {
    const header = `
        <div class="list-header">
            <div></div>
            <div>Logo</div>
            <div>College</div>
            <div>Type</div>
            <div>Location</div>
            <div>Ranking</div>
            <div>Status</div>
            <div>Actions</div>
        </div>
    `;
    
    const rows = colleges.map(college => `
        <div class="list-row ${selectedColleges.has(college.id) ? 'selected' : ''}" data-id="${college.id}">
            <div class="list-cell">
                <input type="checkbox" ${selectedColleges.has(college.id) ? 'checked' : ''} 
                    onchange="toggleSelection(${college.id})">
            </div>
            <div class="list-cell">
                <div class="list-logo">
                    <i class="fas fa-university"></i>
                </div>
            </div>
            <div class="list-cell">
                <div class="list-info">
                    <h4>${college.shortName}</h4>
                    <span>${college.name}</span>
                </div>
            </div>
            <div class="list-cell">
                <span class="college-type">${college.type.toUpperCase()}</span>
            </div>
            <div class="list-cell">
                <i class="fas fa-map-marker-alt"></i> ${college.city}, ${college.state}
            </div>
            <div class="list-cell">
                <strong>#${college.ranking}</strong>
            </div>
            <div class="list-cell">
                <span class="status-dot ${college.status}"></span> ${college.status}
            </div>
            <div class="list-cell college-actions">
                <button class="action-btn" onclick="viewCollege(${college.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="editCollege(${college.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn danger" onclick="deleteCollege(${college.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    collegesList.innerHTML = header + rows;
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="page-btn">...</span>`;
        }
    }
    
    // Next button
    html += `<button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    pagination.innerHTML = html;
}

// ============================================
// FILTER & SORT FUNCTIONS
// ============================================

function getFilteredColleges() {
    let filtered = [...collegesData];
    
    // Filter by type
    if (currentFilter !== 'all') {
        filtered = filtered.filter(c => c.type === currentFilter);
    }
    
    // Filter by search
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(searchTerm) ||
            c.shortName.toLowerCase().includes(searchTerm) ||
            c.code.toLowerCase().includes(searchTerm) ||
            c.city.toLowerCase().includes(searchTerm) ||
            c.state.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'students':
                return b.students - a.students;
            case 'fests':
                return b.fests - a.fests;
            case 'recent':
                return b.id - a.id;
            case 'ranking':
            default:
                return a.ranking - b.ranking;
        }
    });
    
    return filtered;
}

function getPaginatedData(data) {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
}

function filterByType(type) {
    currentFilter = type;
    currentPage = 1;
    
    // Update active filter chip
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.closest('.filter-chip').classList.add('active');
    
    renderColleges();
}

function sortColleges() {
    currentSort = document.getElementById('sortColleges').value;
    renderColleges();
}

function handleSearch() {
    currentPage = 1;
    renderColleges();
}

// ============================================
// VIEW & NAVIGATION FUNCTIONS
// ============================================

function setView(view) {
    currentView = view;
    
    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.view-btn').classList.add('active');
    
    renderColleges();
}

function changePage(page) {
    currentPage = page;
    renderColleges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateShowingText(total) {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);
    document.getElementById('showStart').textContent = total === 0 ? 0 : start;
    document.getElementById('showEnd').textContent = end;
    document.getElementById('showTotal').textContent = total;
}

function updateStats() {
    // Stats are static in mock data, but could be calculated dynamically
    const total = collegesData.length;
    const verified = collegesData.filter(c => c.verified).length;
    const active = collegesData.filter(c => c.status === 'active').length;
    
    // Update overview cards if needed
    console.log(`Stats: ${total} total, ${verified} verified, ${active} active`);
}

// ============================================
// SELECTION FUNCTIONS
// ============================================

function toggleSelection(id) {
    if (selectedColleges.has(id)) {
        selectedColleges.delete(id);
    } else {
        selectedColleges.add(id);
    }
    updateSelectionUI();
    renderColleges();
}

function updateSelectionUI() {
    const count = selectedColleges.size;
    selectedCount.textContent = count;
    selectedInfo.style.display = count > 0 ? 'flex' : 'none';
}

function clearSelection() {
    selectedColleges.clear();
    updateSelectionUI();
    renderColleges();
}

function bulkDelete() {
    if (selectedColleges.size === 0) return;
    
    const names = Array.from(selectedColleges).map(id => {
        const college = collegesData.find(c => c.id === id);
        return college ? college.shortName : '';
    }).join(', ');
    
    document.getElementById('deleteCollegeName').textContent = `${selectedColleges.size} colleges (${names})`;
    document.getElementById('deleteModal').classList.add('active');
}

// ============================================
// COLLEGE CRUD FUNCTIONS
// ============================================

function openAddCollegeModal() {
    editingCollegeId = null;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-university"></i> Add New College';
    document.getElementById('collegeForm').reset();
    document.getElementById('collegeId').value = '';
    document.getElementById('logoPreview').innerHTML = '<i class="fas fa-university"></i>';
    document.getElementById('collegeModal').classList.add('active');
}

function editCollege(id) {
    const college = collegesData.find(c => c.id === id);
    if (!college) return;
    
    editingCollegeId = id;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit College';
    
    // Fill form
    document.getElementById('collegeId').value = college.id;
    document.getElementById('collegeName').value = college.name;
    document.getElementById('collegeShortName').value = college.shortName;
    document.getElementById('collegeCode').value = college.code;
    document.getElementById('collegeType').value = college.type;
    document.getElementById('collegeCity').value = college.city;
    document.getElementById('collegeState').value = college.state;
    document.getElementById('collegeAddress').value = college.address || '';
    document.getElementById('collegeEmail').value = college.email || '';
    document.getElementById('collegePhone').value = college.phone || '';
    document.getElementById('collegeWebsite').value = college.website || '';
    document.getElementById('collegeRanking').value = college.ranking || '';
    document.getElementById('collegeEstablished').value = college.established || '';
    document.getElementById('collegeStudents').value = college.students || '';
    document.getElementById('collegeArea').value = college.area || '';
    document.getElementById('collegeActive').checked = college.status === 'active';
    document.getElementById('collegeVerified').checked = college.verified;
    
    document.getElementById('collegeModal').classList.add('active');
}

function saveCollege(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('collegeName').value,
        shortName: document.getElementById('collegeShortName').value,
        code: document.getElementById('collegeCode').value,
        type: document.getElementById('collegeType').value,
        city: document.getElementById('collegeCity').value,
        state: document.getElementById('collegeState').value,
        address: document.getElementById('collegeAddress').value,
        email: document.getElementById('collegeEmail').value,
        phone: document.getElementById('collegePhone').value,
        website: document.getElementById('collegeWebsite').value,
        ranking: parseInt(document.getElementById('collegeRanking').value) || 0,
        established: parseInt(document.getElementById('collegeEstablished').value) || 0,
        students: parseInt(document.getElementById('collegeStudents').value) || 0,
        area: parseFloat(document.getElementById('collegeArea').value) || 0,
        status: document.getElementById('collegeActive').checked ? 'active' : 'inactive',
        verified: document.getElementById('collegeVerified').checked
    };
    
    if (editingCollegeId) {
        // Update existing
        const index = collegesData.findIndex(c => c.id === editingCollegeId);
        if (index !== -1) {
            collegesData[index] = { ...collegesData[index], ...formData };
            showToast('College updated successfully!', 'success');
        }
    } else {
        // Create new
        const newId = Math.max(...collegesData.map(c => c.id)) + 1;
        const newCollege = {
            id: newId,
            ...formData,
            fests: 0,
            hosts: 0,
            logo: null
        };
        collegesData.push(newCollege);
        showToast('College added successfully!', 'success');
    }
    
    closeCollegeModal();
    renderColleges();
    updateStats();
}

function viewCollege(id) {
    const college = collegesData.find(c => c.id === id);
    if (!college) return;
    
    const detailBody = document.getElementById('detailBody');
    detailBody.innerHTML = `
        <div class="detail-header">
            <div class="detail-logo">
                <i class="fas fa-university"></i>
            </div>
            <div class="detail-title">
                <h2>${college.shortName}</h2>
                <p>${college.name}</p>
            </div>
        </div>
        <div class="detail-content">
            <div class="detail-stats">
                <div class="detail-stat">
                    <h4>${college.fests}</h4>
                    <span>Active Fests</span>
                </div>
                <div class="detail-stat">
                    <h4>${college.hosts}</h4>
                    <span>Registered Hosts</span>
                </div>
                <div class="detail-stat">
                    <h4>${(college.students / 1000).toFixed(1)}K</h4>
                    <span>Total Students</span>
                </div>
                <div class="detail-stat">
                    <h4>#${college.ranking}</h4>
                    <span>NIRF Ranking</span>
                </div>
            </div>
            <div class="detail-section">
                <h4>College Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">College Code</span>
                        <span class="detail-value">${college.code}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Type</span>
                        <span class="detail-value">${college.type.toUpperCase()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Established</span>
                        <span class="detail-value">${college.established}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Campus Area</span>
                        <span class="detail-value">${college.area} acres</span>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Contact Details</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${college.email || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${college.phone || 'N/A'}</span>
                    </div>
                    <div class="detail-item" style="grid-column: span 2;">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${college.address || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h4>Status</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Platform Status</span>
                        <span class="detail-value">
                            <span class="status-dot ${college.status}"></span> ${college.status}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Verification</span>
                        <span class="detail-value">
                            ${college.verified ? '<i class="fas fa-check-circle" style="color: var(--green);"></i> Verified' : '<i class="fas fa-clock" style="color: var(--orange);"></i> Pending'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('detailModal').classList.add('active');
}

function deleteCollege(id) {
    deleteCollegeId = id;
    const college = collegesData.find(c => c.id === id);
    document.getElementById('deleteCollegeName').textContent = college ? college.shortName : 'this college';
    document.getElementById('deleteModal').classList.add('active');
}

function confirmDelete() {
    if (selectedColleges.size > 0) {
        // Bulk delete
        selectedColleges.forEach(id => {
            const index = collegesData.findIndex(c => c.id === id);
            if (index > -1) collegesData.splice(index, 1);
        });
        showToast(`${selectedColleges.size} colleges deleted successfully`, 'success');
        selectedColleges.clear();
        updateSelectionUI();
    } else if (deleteCollegeId) {
        // Single delete
        const index = collegesData.findIndex(c => c.id === deleteCollegeId);
        if (index > -1) {
            collegesData.splice(index, 1);
            showToast('College deleted successfully', 'success');
        }
        deleteCollegeId = null;
    }
    
    closeDeleteModal();
    renderColleges();
    updateStats();
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function closeCollegeModal() {
    document.getElementById('collegeModal').classList.remove('active');
    editingCollegeId = null;
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deleteCollegeId = null;
}

function openImportModal() {
    document.getElementById('importModal').classList.add('active');
}

function closeImportModal() {
    document.getElementById('importModal').classList.remove('active');
}

function openFilterModal() {
    document.getElementById('filterModal').classList.add('active');
}

function closeFilterModal() {
    document.getElementById('filterModal').classList.remove('active');
}

// ============================================
// IMPORT/EXPORT FUNCTIONS
// ============================================

function importFromCSV() {
    showToast('CSV import feature coming soon!', 'info');
    closeImportModal();
}

function importFromExcel() {
    showToast('Excel import feature coming soon!', 'info');
    closeImportModal();
}

function importFromAPI() {
    showToast('API integration coming soon!', 'info');
    closeImportModal();
}

function downloadTemplate() {
    showToast('Template download started', 'success');
}

function exportColleges() {
    const dataStr = JSON.stringify(collegesData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'colleges_export.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Colleges exported successfully!', 'success');
}

// ============================================
// FILTER MODAL FUNCTIONS
// ============================================

function resetFilters() {
    document.querySelectorAll('.filter-checkboxes input').forEach(cb => cb.checked = true);
    document.getElementById('filterState').value = '';
    document.querySelectorAll('.range-inputs input').forEach(input => input.value = '');
}

function applyFilters() {
    showToast('Filters applied', 'success');
    closeFilterModal();
    // Add actual filter logic here
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function uploadLogo() {
    showToast('Logo upload feature coming soon!', 'info');
}

function removeLogo() {
    document.getElementById('logoPreview').innerHTML = '<i class="fas fa-university"></i>';
}

function toggleNotifications() {
    showToast('No new notifications', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showToast('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const colors = {
        success: 'var(--green)',
        error: 'var(--red)',
        warning: 'var(--orange)',
        info: 'var(--teal)'
    };
    
    toast.style.borderLeftColor = colors[type];
    toast.innerHTML = `
        <i class="fas fa-${icons[type]} toast-icon" style="color: ${colors[type]}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
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

// Close modals on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCollegeModal();
        closeDetailModal();
        closeDeleteModal();
        closeImportModal();
        closeFilterModal();
    }
});
