let allProperties = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProperties();
});

async function loadProperties() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/admin/properties`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('nexus_admin_jwt')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            allProperties = data.data;
            updateStats();
            renderPropertiesTable();
        } else {
            console.error('Failed to load properties');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateStats() {
    let total = allProperties.length;
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let uniqueOwners = new Set();
    
    allProperties.forEach(p => {
        if (p.status === 'pending') pending++;
        else if (p.status === 'approved') approved++;
        else if (p.status === 'rejected') rejected++;
        
        if (p.host_id) {
            uniqueOwners.add(p.host_id);
        }
    });

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statApproved').textContent = approved;
    document.getElementById('statRejected').textContent = rejected;
    document.getElementById('statOwners').textContent = uniqueOwners.size;
}

function renderPropertiesTable() {
    const tbody = document.getElementById('propertiesTableBody');
    tbody.innerHTML = '';
    
    if (allProperties.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No properties found</td></tr>';
        return;
    }
    
    allProperties.forEach(prop => {
        const hostName = prop.hosts ? (prop.hosts.business_name || prop.hosts.user_name) : 'Unknown';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight: 500">${prop.title}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary)">${prop.city}</div>
            </td>
            <td>${hostName}</td>
            <td style="text-transform: capitalize">${prop.property_type}</td>
            <td>₹${prop.monthly_rent}</td>
            <td><span class="status-badge status-${prop.status}">${prop.status}</span></td>
            <td>
                <button class="action-btn view" onclick="viewProperty('${prop.id}')"><i class="fas fa-eye"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function viewProperty(id) {
    const prop = allProperties.find(p => p.id === id);
    if (!prop) return;
    
    const modal = document.getElementById('propertyModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const actions = document.getElementById('modalActions');
    
    title.textContent = prop.title;
    
    const amenities = prop.amenities ? prop.amenities.join(', ') : 'None listed';
    const imagesHtml = prop.images && prop.images.length > 0 
        ? prop.images.map(img => `<img src="${img}" style="width:100px; height:100px; object-fit:cover; border-radius:8px; margin-right:10px;">`).join('')
        : '<p>No images</p>';

    body.innerHTML = `
        <div style="margin-bottom: 20px;">
            <strong>Host:</strong> ${prop.hosts ? (prop.hosts.business_name || prop.hosts.user_name) : 'Unknown'} <br>
            <strong>Contact:</strong> ${prop.contact_name} (${prop.contact_phone})<br>
            <strong>Location:</strong> ${prop.address}, ${prop.city} - ${prop.pincode}
        </div>
        <div style="margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Type:</strong> <span style="text-transform:capitalize">${prop.property_type}</span></div>
            <div><strong>Furnishing:</strong> <span style="text-transform:capitalize">${prop.furnishing_status}</span></div>
            <div><strong>Rent:</strong> ₹${prop.monthly_rent}</div>
            <div><strong>Deposit:</strong> ₹${prop.security_deposit}</div>
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Amenities:</strong> <br>
            ${amenities}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Description:</strong> <br>
            <p style="font-size:0.9rem; color:var(--text-secondary); margin-top:5px;">${prop.description}</p>
        </div>
        <div>
            <strong>Images:</strong> <br>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
                ${imagesHtml}
            </div>
        </div>
    `;

    if (prop.status === 'pending') {
        actions.innerHTML = `
            <button onclick="updateStatus('${prop.id}', 'rejected')" style="padding: 10px 20px; border:none; background:#ef4444; color:white; border-radius:6px; cursor:pointer;">Reject</button>
            <button onclick="updateStatus('${prop.id}', 'approved')" style="padding: 10px 20px; border:none; background:#10b981; color:white; border-radius:6px; cursor:pointer;">Approve</button>
        `;
    } else {
        actions.innerHTML = `
            <span class="status-badge status-${prop.status}">Currently ${prop.status.toUpperCase()}</span>
            <button onclick="updateStatus('${prop.id}', 'pending')" style="padding: 8px 15px; border:1px solid #ccc; background:transparent; color:var(--text-primary); border-radius:6px; cursor:pointer;">Move to Pending</button>
        `;
    }

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('propertyModal').style.display = 'none';
}

async function updateStatus(id, newStatus) {
    if(!confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;
    
    try {
        const response = await fetch(`${window.API_BASE_URL}/admin/properties/${id}/status`, {
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
            loadProperties(); 
            // Optional: show a toast notification here
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
