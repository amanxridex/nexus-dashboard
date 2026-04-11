let allGyms = [];

document.addEventListener('DOMContentLoaded', () => {
    loadGyms();
});

async function loadGyms() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/admin/gyms`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('nexus_admin_jwt')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            allGyms = data.data;
            updateStats();
            renderGymsTable();
        } else {
            console.error('Failed to load gyms');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateStats() {
    let total = allGyms.length;
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    
    allGyms.forEach(g => {
        if (g.status === 'pending') pending++;
        else if (g.status === 'approved') approved++;
        else if (g.status === 'rejected') rejected++;
    });

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statApproved').textContent = approved;
    document.getElementById('statRejected').textContent = rejected;
}

function renderGymsTable() {
    const tbody = document.getElementById('gymsTableBody');
    tbody.innerHTML = '';
    
    if (allGyms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No gyms found</td></tr>';
        return;
    }
    
    allGyms.forEach(gym => {
        const hostName = gym.hosts ? (gym.hosts.business_name || gym.hosts.full_name) : 'Unknown';
        // Gym address split fallback
        const cityStr = gym.address ? gym.address.split(',').pop().trim() : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight: 500">${gym.name}</div>
            </td>
            <td>${hostName}</td>
            <td>${cityStr}</td>
            <td><span class="status-badge status-${gym.status}">${gym.status}</span></td>
            <td>
                <button class="action-btn view" onclick="viewGym('${gym.id}')"><i class="fas fa-eye"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function viewGym(id) {
    const gym = allGyms.find(g => g.id === id);
    if (!gym) return;
    
    const modal = document.getElementById('gymModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const actions = document.getElementById('modalActions');
    
    title.textContent = gym.name;
    
    const amenities = gym.amenities ? gym.amenities.join(', ') : 'None listed';
    const imagesHtml = gym.images && gym.images.length > 0 
        ? gym.images.map(img => `<img src="${img}" style="width:100px; height:100px; object-fit:cover; border-radius:8px; margin-right:10px;">`).join('')
        : '<p>No images</p>';

    // Parse pricing JSON
    let pricingHtml = '';
    if (gym.pricing) {
        pricingHtml = '<ul>';
        Object.keys(gym.pricing).forEach(key => {
            const plan = gym.pricing[key];
            const original = plan.original || plan.actual || 'N/A';
            const dict = plan.discount || 'N/A';
            pricingHtml += `<li><strong>${key}:</strong> ₹${dict} <span style="text-decoration:line-through;color:gray;font-size:0.8rem">₹${original}</span></li>`;
        });
        pricingHtml += '</ul>';
    } else {
        pricingHtml = 'No pricing plans set';
    }

    body.innerHTML = `
        <div style="margin-bottom: 20px;">
            <strong>Host:</strong> ${gym.hosts ? (gym.hosts.business_name || gym.hosts.full_name) : 'Unknown'} <br>
            <strong>Contact:</strong> ${gym.hosts ? gym.hosts.phone : 'N/A'}<br>
            <strong>Location:</strong> ${gym.address}<br>
            <strong>Map Embed URL:</strong> ${gym.map_url ? `<a href="${gym.map_url}" target="_blank">Google Map</a>` : 'Not provided'}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Amenities:</strong> <br>
            ${amenities}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Pricing Plans:</strong> <br>
            ${pricingHtml}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Description:</strong> <br>
            <p style="font-size:0.9rem; color:var(--text-secondary); margin-top:5px;">${gym.description}</p>
        </div>
        <div>
            <strong>Images:</strong> <br>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
                ${imagesHtml}
            </div>
        </div>
    `;

    if (gym.status === 'pending') {
        actions.innerHTML = `
            <button onclick="updateStatus('${gym.id}', 'rejected')" style="padding: 10px 20px; border:none; background:#ef4444; color:white; border-radius:6px; cursor:pointer;">Reject</button>
            <button onclick="updateStatus('${gym.id}', 'approved')" style="padding: 10px 20px; border:none; background:#10b981; color:white; border-radius:6px; cursor:pointer;">Approve</button>
        `;
    } else {
        actions.innerHTML = `
            <span class="status-badge status-${gym.status}">Currently ${gym.status.toUpperCase()}</span>
            <button onclick="updateStatus('${gym.id}', 'pending')" style="padding: 8px 15px; border:1px solid #ccc; background:transparent; color:var(--text-primary); border-radius:6px; cursor:pointer;">Move to Pending</button>
        `;
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('gymModal').style.display = 'none';
}

async function updateStatus(id, newStatus) {
    if(!confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;
    
    try {
        const response = await fetch(`${window.API_BASE_URL}/admin/gyms/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('nexus_admin_jwt')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeModal();
            loadGyms(); 
        } else {
            alert('Failed to update status: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Action failed due to server error');
    }
}

// Sidebar toggle logic reusing from index if needed
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('mainContent').classList.toggle('expanded');
});
