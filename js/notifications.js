document.addEventListener('DOMContentLoaded', () => {
    const targetSelect = document.getElementById('targetAudience');
    const specificContainer = document.getElementById('specificUidContainer');
    const specificInput = document.getElementById('specificUid');

    targetSelect.addEventListener('change', () => {
        if (targetSelect.value === 'specific') {
            specificContainer.style.display = 'block';
            specificInput.required = true;
        } else {
            specificContainer.style.display = 'none';
            specificInput.required = false;
        }
    });

    const form = document.getElementById('notificationForm');
    const submitBtn = document.getElementById('submitBtn');
    const responseMsg = document.getElementById('responseMsg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        responseMsg.innerText = '';
        responseMsg.style.color = 'var(--text-color)';

        const payload = {
            targetAudience: targetSelect.value,
            specificUid: specificInput.value,
            title: document.getElementById('title').value,
            body: document.getElementById('body').value,
            type: document.getElementById('type').value
        };

        try {
            const response = await fetch(`${window.API_BASE_URL}/admin/notifications/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                responseMsg.style.color = '#10b981'; // Green
                let msg = data.message;
                if (data.pushResult) {
                     msg += ` (Pushed: ${data.pushResult.successCount} success, ${data.pushResult.failureCount} failed)`;
                }
                responseMsg.innerText = msg;
                form.reset();
                specificContainer.style.display = 'none';
                loadHistory(); // Refresh table
            } else {
                responseMsg.style.color = '#ef4444'; // Red
                responseMsg.innerText = data.message || 'Failed to send notification.';
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            responseMsg.style.color = '#ef4444';
            responseMsg.innerText = 'Network error occurred while sending.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Shoot Notification';
        }
    });

    const loadHistory = async () => {
        const tbody = document.getElementById('historyTableBody');
        try {
            const res = await fetch(`${window.API_BASE_URL}/admin/notifications/history?t=${new Date().getTime()}`);
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                tbody.innerHTML = '';
                data.data.forEach(n => {
                    const date = new Date(n.created_at).toLocaleString();
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = '1px solid var(--border-color)';
                    
                    let linkHtml = '';
                    if (n.broadcast_id && n.count > 1) {
                         linkHtml = `<br><a href="notification-details.html?id=${encodeURIComponent(n.broadcast_id)}" style="color:var(--primary-color); text-decoration:none; font-size:11px; margin-top:4px; display:inline-block;"><i class="fas fa-external-link-alt"></i> View Details</a>`;
                    }

                    tr.innerHTML = `
                        <td style="padding: 12px; font-size: 13px;">${date}</td>
                        <td style="padding: 12px;"><strong>${n.title}</strong><div style="font-size:12px;color:var(--text-muted);">${n.body.length > 50 ? n.body.substring(0,50)+'...' : n.body}</div></td>
                        <td style="padding: 12px;"><span style="background:var(--primary-color);color:white;padding:3px 8px;border-radius:12px;font-size:11px;">${n.audience}</span></td>
                        <td style="padding: 12px; font-size: 13px;">${n.type || 'system'}</td>
                        <td style="padding: 12px; font-size: 12px; font-family: monospace;">
                            ${n.target || 'N/A'}
                            ${linkHtml}
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted);">No notifications sent yet.</td></tr>';
            }
        } catch (e) {
            console.error("Failed to load history", e);
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #ef4444;">Failed to load history.</td></tr>';
        }
    };

    const refreshBtn = document.getElementById('refreshHistoryBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            loadHistory().then(() => refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh');
        });
    }

    loadHistory();
});
