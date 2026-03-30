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

// Mock actions
function viewCollege(id) { alert('View college ' + id); }
function editCollege(id) { alert('Edit college ' + id); }
function deleteCollege(id) { alert('Delete college ' + id); }
