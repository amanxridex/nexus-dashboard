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
    const pending = restaurants.filter(r => r.status === 'pending' || r.status === 'update_pending').length;
    const approved = restaurants.filter(r => r.status === 'published' || r.status === 'approved' || r.status === 'active').length;
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
            case 'update_pending': statusBadge = '<span class="status-badge" style="background:#fef3c7; color:#d97706; padding:4px 8px; border-radius:4px; font-size:0.8rem; font-weight:600;">Update Pending</span>'; break;
            case 'published':
            case 'active':
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
                ${(rest.status === 'pending' || rest.status === 'update_pending') ? `
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
    const menuImgHtml = (r.menu_images || []).map(img => `<img src="${img}" style="height:60px; border-radius:8px; margin-right:5px;">`).join('');

    let diffHtml = '';
    if (r.status === 'update_pending' && r.pending_changes) {
        const p = r.pending_changes;
        let pendingImgHtml = '';
        if (p.images && p.images.length > 0) {
            pendingImgHtml = p.images.map(img => `<img src="${img}" style="height:60px; border-radius:8px; margin-right:5px; border: 2px solid #059669;">`).join('');
        }
        let pendingMenuHtml = '';
        if (p.menu_images && p.menu_images.length > 0) {
            pendingMenuHtml = p.menu_images.map(img => `<img src="${img}" style="height:60px; border-radius:8px; margin-right:5px; border: 2px solid #059669;">`).join('');
        }
        
        diffHtml = `
            <div style="grid-column:1/-1; background:#fff7ed; padding:15px; border-radius:8px; border-left:4px solid #ea580c; margin-bottom: 15px;">
                <h4 style="margin:0 0 10px 0; color:#ea580c;"><i class="fas fa-exclamation-triangle"></i> Pending Host Modifications</h4>
                <table style="width:100%; border-collapse:collapse; font-size: 0.9rem;">
                    <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);"><td style="padding:5px;"><strong>Field</strong></td><td style="color:var(--text-secondary);">Original Value</td><td></td><td><strong>Requested Change</strong></td></tr>
                    <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);"><td style="padding:5px;"><strong>Name</strong></td><td>${r.name}</td><td><strong>&rarr;</strong></td><td><strong style="color:#059669;">${p.name || r.name}</strong></td></tr>
                    <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);"><td style="padding:5px;"><strong>Average Price</strong></td><td>${r.cost_for_two}</td><td><strong>&rarr;</strong></td><td><strong style="color:#059669;">${p.cost_for_two || r.cost_for_two}</strong></td></tr>
                    <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);"><td style="padding:5px;"><strong>Cuisines</strong></td><td>${r.cuisines || ''}</td><td><strong>&rarr;</strong></td><td><strong style="color:#059669;">${p.cuisines || r.cuisines || ''}</strong></td></tr>
                    <tr style="border-bottom: 1px solid rgba(0,0,0,0.1);"><td style="padding:5px;"><strong>Address</strong></td><td>${r.address || ''}</td><td><strong>&rarr;</strong></td><td><strong style="color:#059669;">${p.address || r.address || ''}</strong></td></tr>
                    <tr><td style="padding:5px;"><strong>Images</strong></td><td style="max-width:150px; overflow-x:auto;">${imgHtml || 'No Image'}</td><td><strong>&rarr;</strong></td><td style="max-width:150px; overflow-x:auto;">${pendingImgHtml || 'No Change'}</td></tr>
                    <tr><td style="padding:5px;"><strong>Menu Images</strong></td><td style="max-width:150px; overflow-x:auto;">${menuImgHtml || 'No Menu'}</td><td><strong>&rarr;</strong></td><td style="max-width:150px; overflow-x:auto;">${pendingMenuHtml || 'No Change'}</td></tr>
                </table>
            </div>
        `;
    }

    document.getElementById('modalBody').innerHTML = `
        ${diffHtml}
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
                <small style="color:var(--text-secondary)">Address & Location (Active)</small>
                <p>${r.address} <br> <a href="${r.location_url}" target="_blank">View Map</a></p>
            </div>
            <div style="grid-column:1/-1;">
                <small style="color:var(--text-secondary)">Attached Images (Active)</small><br>
                ${imgHtml || 'No images provided.'}
            </div>
            <div style="grid-column:1/-1;">
                <small style="color:var(--text-secondary)">Restaurant Menu Scans (Active)</small><br>
                ${menuImgHtml || 'No menu images provided.'}
            </div>
        </div>
    `;

    const actions = document.getElementById('modalActions');
    if (r.status === 'pending' || r.status === 'update_pending') {
        let okText = r.status === 'update_pending' ? 'Accept Updates & Publish' : 'Approve & Publish';
        let rejectText = r.status === 'update_pending' ? 'Reject Updates' : 'Reject Listing';
        let rejectValue = r.status === 'update_pending' ? 'reject_update' : 'rejected';
        
        actions.innerHTML = `
            <button class="btn" style="background:#ef4444; color:#fff;" onclick="updateStatus('${r.id}', '${rejectValue}')">${rejectText}</button>
            <button class="btn" style="background:#10b981; color:#fff;" onclick="updateStatus('${r.id}', 'published')">${okText}</button>
        `;
    } else {
        actions.innerHTML = `<button class="btn" onclick="closeModal()">Close Panel</button>`;
    }

    document.getElementById('restaurantModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('restaurantModal').style.display = 'none';
}
