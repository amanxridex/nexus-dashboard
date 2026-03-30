let currentBookings = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchBookings();
});

async function fetchBookings() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem;">Loading bookings...</td></tr>';

    try {
        const res = await fetch(`${window.API_BASE_URL}/admin/bookings`);
        const data = await res.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        currentBookings = data.bookings || [];
        renderBookings();
    } catch (err) {
        console.error('Failed to load bookings:', err);
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem; color:red;">Failed to load bookings</td></tr>';
    }
}

function renderBookings() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (currentBookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem;">No bookings found</td></tr>';
        return;
    }

    tbody.innerHTML = currentBookings.map(b => `
        <tr>
            <td><input type="checkbox"></td>
            <td>
                <div style="font-weight: 500">${b.attendee_name || 'N/A'}</div>
            </td>
            <td>${b.attendee_email || 'N/A'}</td>
            <td>
                <div>${b.event_name || 'Unknown Event'}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${b.college_name || 'Unknown College'}</div>
            </td>
            <td>${new Date(b.created_at).toLocaleDateString()}</td>
            <td>${b.ticket_quantity || 0}</td>
            <td>₹${b.total_amount || 0}</td>
            <td>
                <span class="status-badge status-${(b.payment_status || 'pending').toLowerCase()}">${b.payment_status || 'Pending'}</span>
            </td>
        </tr>
    `).join('');

    // Update counts
    const selectedCount = document.getElementById('selectedCount');
    const totalCount = document.getElementById('totalCount');
    const showingCount = document.getElementById('showingCount');

    if (totalCount) totalCount.innerText = currentBookings.length;
    if (showingCount) showingCount.innerText = currentBookings.length;
}

// Global actions
function toggleSelectAll() {}
function bulkDelete() {}
function bulkEmail() {}
function changePage() {}
