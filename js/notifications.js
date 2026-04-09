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
});
