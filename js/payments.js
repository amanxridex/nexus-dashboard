let currentPayments = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchPayments();
});

async function fetchPayments() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem;">Loading payments...</td></tr>';

    try {
        const res = await fetch(`${window.API_BASE_URL}/admin/payments`);
        const data = await res.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        currentPayments = data.payments || [];
        renderPayments();
    } catch (err) {
        console.error('Failed to load payments:', err);
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem; color:red;">Failed to load payments</td></tr>';
    }
}

function renderPayments() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (currentPayments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem;">No transaction history found</td></tr>';
        return;
    }

    tbody.innerHTML = currentPayments.map(p => `
        <tr>
            <td><input type="checkbox"></td>
            <td>
                <div style="font-weight: 500">${p.attendee_name || 'N/A'}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${p.event_name || 'Unknown Event'}</div>
            </td>
            <td style="font-family: monospace; font-size: 0.9rem;">${p.razorpay_order_id || 'N/A'}</td>
            <td style="font-family: monospace; font-size: 0.9rem;">${p.razorpay_payment_id || 'N/A'}</td>
            <td>${new Date(p.created_at).toLocaleString()}</td>
            <td style="color: var(--green); font-weight: 600;">₹${p.total_amount || 0}</td>
            <td style="color: var(--text-muted);">₹${p.platform_fee || 0}</td>
            <td>
                <span class="status-badge status-${(p.payment_status || 'completed').toLowerCase()}">${p.payment_status || 'Completed'}</span>
            </td>
        </tr>
    `).join('');

    // Update counts
    const totalCount = document.getElementById('totalCount');
    const showingCount = document.getElementById('showingCount');

    if (totalCount) totalCount.innerText = currentPayments.length;
    if (showingCount) showingCount.innerText = currentPayments.length;
}

// Global actions
function toggleSelectAll() {}
function bulkDelete() {}
function bulkEmail() {}
function exportUsers() { alert('Exporting data...'); }
