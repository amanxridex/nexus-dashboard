let restaurants = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchRestaurants();
});

async function fetchRestaurants() {
    try {
        const token = localStorage.getItem('nexus_admin_jwt');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const res = await fetch(`${window.API_BASE_URL}/admin/restaurants`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        
        if (data.success) {
            restaurants = data.data;
            updateStats();
            renderTable();
        } else if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('nexus_admin_jwt');
            window.location.href = 'login.html';
        }
    } catch (err) {
        console.error('Failed to fetch restaurants:', err);
    }
}

function updateStats() {
    const total = restaurants.length;
    const pending = restaurants.filter(r => r.status === 'pending').length;
    const approved = restaurants.filter(r => r.status === 'published' || r.status === 'approved').length;
    const rejected = restaurants.filter(r => r.status === 'rejected').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statApproved').textContent = approved;
    document.getElementById('statRejected').textContent = rejected;
}

function renderTable() {
    const tbody = document.getElementById('restaurantsTableBody');
    tbody.innerHTML = '';

    if (restaurants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No restaurants found.</td></tr>';
        return;
    }

    restaurants.forEach(rest => {
        const hostName = rest.hosts?.full_name || 'Unknown Host';
        
        let statusBadge = '';
        switch(rest.status) {
            case 'pending': statusBadge = '<span class="status-badge status-pending">Pending</span>'; break;
            case 'published':
            case 'approved': statusBadge = '<span class="status-badge status-published">Published</span>'; break;
            case 'rejected': statusBadge = '<span class="status-badge status-rejected">Rejected</span>'; break;
            default: statusBadge = `<span class="status-badge status-pending">${rest.status}</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${rest.name}</strong><br><small style="color:var(--text-secondary)">${rest.address.substring(0,25)}...</small></td>
            <td>${hostName}</td>
            <td>${rest.cuisines || 'N/A'}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="action-btn view" onclick="viewRestaurant('${rest.id}')" title="Review Details"><i class="fas fa-eye"></i></button>
                ${rest.status === 'pending' ? `
                    <button class="action-btn approve" onclick="updateStatus('${rest.id}', 'published')" title="Approve"><i class="fas fa-check"></i></button>
                    <button class="action-btn reject" onclick="updateStatus('${rest.id}', 'rejected')" title="Reject"><i class="fas fa-times"></i></button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateStatus(id, newStatus) {
    if (!confirm(`Are you sure you want to mark this restaurant as ${newStatus}?`)) return;

    try {
        const token = localStorage.getItem('nexus_admin_jwt');
        const res = await fetch(`${window.API_BASE_URL}/admin/restaurants/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await res.json();
        if (data.success) {
            closeModal();
            fetchRestaurants(); 
        } else {
            alert('Error updating status');
        }
    } catch (err) {
        console.error(err);
        alert('Network error while updating the status');
    }
}

function viewRestaurant(id) {
    const r = restaurants.find(x => x.id === id);
    if (!r) return;

    document.getElementById('modalTitle').textContent = `Reviewing: ${r.name}`;
    
    // Generate images preview html quickly
    const imgHtml = (r.images || []).map(img => `<img src="${img}" style="height:60px; border-radius:8px; margin-right:5px;">`).join('');

    document.getElementById('modalBody').innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">
            <div>
                <small style="color:var(--text-secondary)">FSSAI License</small>
                <p><strong>${r.fssai || 'N/A'}</strong></p>
            </div>
            <div>
                <small style="color:var(--text-secondary)">Cost for Two</small>
                <p><strong>₹${r.cost_for_two || 'N/A'}</strong></p>
            </div>
            <div style="grid-column:1/-1;">
                <small style="color:var(--text-secondary)">About</small>
                <p>${r.about || 'No description provided.'}</p>
            </div>
             <div style="grid-column:1/-1;">
                <small style="color:var(--text-secondary)">Address & Location</small>
                <p>${r.address} <br> <a href="${r.location_url}" target="_blank">View Map</a></p>
            </div>
            <div style="grid-column:1/-1;">
                <small style="color:var(--text-secondary)">Attached Images</small><br>
                ${imgHtml || 'No images provided.'}
            </div>
        </div>
    `;

    const actions = document.getElementById('modalActions');
    if (r.status === 'pending') {
        actions.innerHTML = `
            <button class="btn" style="background:#ef4444; color:#fff;" onclick="updateStatus('${r.id}', 'rejected')">Reject Listing</button>
            <button class="btn" style="background:#10b981; color:#fff;" onclick="updateStatus('${r.id}', 'published')">Approve & Publish</button>
        `;
    } else {
        actions.innerHTML = `<button class="btn" onclick="closeModal()">Close Panel</button>`;
    }

    document.getElementById('restaurantModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('restaurantModal').style.display = 'none';
}
