let currentColleges = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchColleges();
});

async function fetchColleges() {
    const grid = document.getElementById('collegesGrid');
    if (!grid) return;

    grid.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">Loading colleges...</div>';

    try {
        const res = await fetch(`${window.API_BASE_URL}/admin/colleges`);
        const data = await res.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        currentColleges = data.colleges || [];
        
        // Update Stats
        const statTotal = document.getElementById('statTotalColleges');
        const statIITs = document.getElementById('statTotalIITs');
        const statBITS = document.getElementById('statTotalBITS');
        const statNITs = document.getElementById('statTotalNITs');
        const statVerified = document.getElementById('statVerifiedColleges');
        const statStudents = document.getElementById('statTotalStudents');

        if (statTotal) statTotal.innerText = currentColleges.length;
        if (statIITs) {
            statIITs.innerText = currentColleges.filter(c => c.name && c.name.toLowerCase().includes('iit')).length;
        }
        if (statBITS) {
            statBITS.innerText = currentColleges.filter(c => c.name && c.name.toLowerCase().includes('bits')).length;
        }
        if (statNITs) {
            statNITs.innerText = currentColleges.filter(c => c.name && c.name.toLowerCase().includes('nit')).length;
        }
        if (statVerified) {
            // Treat all as verified for now or add a custom flag check if needed
            statVerified.innerText = currentColleges.length;
        }
        if (statStudents) {
            // Proxy value unless actual total student metric exists
            statStudents.innerText = '0';
        }

        renderColleges();
    } catch (err) {
        console.error('Failed to load colleges:', err);
        grid.innerHTML = '<div style="padding: 2rem; color: red; text-align: center;">Failed to load colleges.</div>';
    }
}

function renderColleges() {
    const grid = document.getElementById('collegesGrid');
    if (!grid) return;

    if (currentColleges.length === 0) {
        grid.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No colleges found.</div>';
        return;
    }

    grid.innerHTML = currentColleges.map(college => `
        <div class="college-card">
            <div class="college-banner" style="background-image: url('${college.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80'}'); background-size: cover; background-position: center; height: 120px; border-radius: 12px 12px 0 0;">
                <div class="status-badge" style="position: absolute; top: 10px; right: 10px; background: var(--green); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">
                    Active
                </div>
            </div>
            <div class="college-content" style="padding: 1rem; background: rgba(26,26,26,0.6); backdrop-filter: blur(10px); border-radius: 0 0 12px 12px; border: 1px solid rgba(255,255,255,0.1);">
                <h3 style="margin-bottom: 0.5rem; font-size: 1.1rem; color: var(--text-primary);">${college.name}</h3>
                <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">
                    <i class="fas fa-map-marker-alt" style="color: var(--purple);"></i> ${college.campus || ''} ${college.location || 'Unknown Location'}
                </div>
                <div style="display: flex; gap: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                    <button class="btn btn-sm btn-ghost" onclick="viewCollege('${college.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-ghost" onclick="editCollege('${college.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" style="margin-left: auto;" onclick="deleteCollege('${college.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Update stats text
    const showTotal = document.getElementById('showTotal');
    const selectedCount = document.getElementById('selectedCount');
    if (showTotal) showTotal.innerText = currentColleges.length;
}

// CRUD Actions
function openAddCollegeModal() {
    document.getElementById('collegeId').value = '';
    document.getElementById('collegeForm').reset();
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-university"></i> Add New College';
    
    document.getElementById('logoPreview').style.backgroundImage = 'none';
    document.getElementById('logoPreview').innerHTML = '<i class="fas fa-university"></i>';
    
    const modal = document.getElementById('collegeModal');
    if (modal) modal.classList.add('active');
}

function closeCollegeModal() {
    const modal = document.getElementById('collegeModal');
    if (modal) modal.classList.remove('active');
}

async function saveCollege(event) {
    event.preventDefault();
    
    const id = document.getElementById('collegeId').value;
    const name = document.getElementById('collegeName').value;
    const campus = document.getElementById('collegeShortName').value || document.getElementById('collegeCode').value || '';
    const location = document.getElementById('collegeCity').value || 'Unknown Location';
    const image_url = document.getElementById('collegeImageUrl').value || '';
    
    // Default mock avatar if no image provided
    const finalImageUrl = image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80';

    const payload = { name, campus, location, image_url: finalImageUrl };
    
    try {
        let url = `${window.API_BASE_URL}/admin/colleges`;
        let method = 'POST';
        
        if (id) {
            url += `/${id}`;
            method = 'PUT';
        }

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        
        if (!res.ok) {
            throw new Error(result.error || 'Failed to save college');
        }

        closeCollegeModal();
        if (typeof showToast === 'function') {
            showToast(id ? 'College updated successfully!' : 'College added successfully!', 'success');
        } else {
            alert(id ? 'College updated successfully!' : 'College added successfully!');
        }
        
        fetchColleges(); // reload grid
    } catch (err) {
        console.error('Save college error:', err);
        if (typeof showToast === 'function') {
            showToast(err.message, 'error');
        } else {
            alert(err.message);
        }
    }
}

function editCollege(id) {
    const college = currentColleges.find(c => c.id == id);
    if (!college) return;
    
    document.getElementById('collegeId').value = college.id;
    document.getElementById('collegeName').value = college.name || '';
    document.getElementById('collegeShortName').value = college.campus || '';
    document.getElementById('collegeCity').value = college.location || '';
    document.getElementById('collegeImageUrl').value = college.image_url || '';
    
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit College';
    
    if (college.image_url) {
        document.getElementById('logoPreview').style.backgroundImage = `url(${college.image_url})`;
        document.getElementById('logoPreview').innerHTML = '';
    } else {
        document.getElementById('logoPreview').style.backgroundImage = 'none';
        document.getElementById('logoPreview').innerHTML = '<i class="fas fa-university"></i>';
    }

    const modal = document.getElementById('collegeModal');
    if (modal) modal.classList.add('active');
}

async function deleteCollege(id) {
    if (!confirm('Are you sure you want to delete this college? This action cannot be undone.')) {
        return;
    }

    try {
        const res = await fetch(`${window.API_BASE_URL}/admin/colleges/${id}`, {
            method: 'DELETE'
        });
        
        const result = await res.json();
        
        if (!res.ok) {
            throw new Error(result.error || 'Failed to delete college');
        }
        
        if (typeof showToast === 'function') {
            showToast('College deleted successfully!', 'success');
        } else {
            alert('College deleted successfully!');
        }
        
        fetchColleges();
    } catch (err) {
        console.error('Delete college error:', err);
        if (typeof showToast === 'function') {
            showToast(err.message, 'error');
        } else {
            alert(err.message);
        }
    }
}

function viewCollege(id) {
    // For now, view is identical to edit
    editCollege(id);
}

// Ensure simple toast exists locally if it's missing from a global util
function showToast(msg, type) {
    const c = document.getElementById('toastContainer');
    if (!c) { alert(msg); return; }
    
    const div = document.createElement('div');
    div.className = `toast toast-${type === 'error' ? 'danger' : type}`;
    div.style.padding = '1rem';
    div.style.background = type === 'error' ? 'var(--red)' : 'var(--green)';
    div.style.color = 'white';
    div.style.marginBottom = '10px';
    div.style.borderRadius = '8px';
    div.innerHTML = `<strong>${type.toUpperCase()}:</strong> ${msg}`;
    c.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}
