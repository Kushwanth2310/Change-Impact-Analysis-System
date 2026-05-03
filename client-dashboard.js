// Client Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if required classes are loaded
    if (typeof ChangeRequestSystem === 'undefined') {
        console.error('ChangeRequestSystem class not found!');
        showError('System error: ChangeRequestSystem not loaded. Please refresh the page.');
        return;
    }
    
    // Check if user is logged in and is client
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    if (currentUser.role !== 'client') {
        alert('Access denied. Client privileges required.');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize systems
    const changeRequestSystem = new ChangeRequestSystem();
    
    // Update welcome message
    document.getElementById('clientWelcome').textContent = `Welcome, ${currentUser.fullname}`;
    
    // Set default values
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('submissionDate').value = today;
    document.getElementById('requestedBy').value = currentUser.fullname;
    
    // Load initial data
    loadDashboardData();
    
    // Change request form handler
    const form = document.getElementById('changeRequestForm');
    
    if (form) {
        console.log('Form element found, adding submit event listener...');
        form.addEventListener('submit', function(e) {
            console.log('SUBMIT EVENT FIRED!');
            
            // Show visible message on page
            const successDiv = document.getElementById('successMessage');
            successDiv.textContent = 'Form submission detected! Processing...';
            successDiv.style.display = 'block';
            
            e.preventDefault();
            
            // Add more debugging
            console.log('About to call submitChangeRequest...');
            try {
                submitChangeRequest();
                console.log('submitChangeRequest completed');
            } catch (error) {
                console.error('Error in submitChangeRequest:', error);
                showError('Error submitting request: ' + error.message);
            }
        });
        console.log('Submit event listener added successfully');
    } else {
        console.error('Form element not found!');
        showError('System error: Form not found. Please refresh the page.');
    }
});

// Load dashboard data
function loadDashboardData() {
    console.log('=== LOAD DASHBOARD DATA START ===');
    
    const changeRequestSystem = new ChangeRequestSystem();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    console.log('Loading data for user ID (type:', typeof currentUser.id, '):', currentUser.id);
    console.log('Loading data for user:', currentUser);
    
    // Load statistics
    console.log('DEBUG STATS INPUT userId:', currentUser.id, '(type:', typeof currentUser.id, ')');
    const stats = changeRequestSystem.getRequestStats(String(currentUser.id));
    console.log('User stats:', stats);
    
    document.getElementById('totalRequests').textContent = stats.total;
    document.getElementById('pendingRequests').textContent = stats.pending;
    document.getElementById('approvedRequests').textContent = stats.approved;
    
    // Load recent requests
    console.log('DEBUG RECENT INPUT userId:', currentUser.id, '(type:', typeof currentUser.id, ')');
    const recentRequests = changeRequestSystem.getRecentRequests(String(currentUser.id), 10);
    console.log('Recent requests (count:', recentRequests.length, '):', recentRequests);
    
    displayChangeRequests(recentRequests);
    console.log('=== LOAD DASHBOARD DATA END ===');
}

// Submit change request
function submitChangeRequest() {
    console.log('=== SUBMIT CHANGE REQUEST START ===');
    
    const changeRequestSystem = new ChangeRequestSystem();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    console.log('Current user ID (type:', typeof currentUser.id, '):', currentUser.id);
    console.log('Current user:', currentUser);
    
    // Get form data
    const requestData = {
        changeType: document.getElementById('changeType').value,
        description: document.getElementById('description').value.trim(),
        priority: document.getElementById('priority').value,
        requestedBy: document.getElementById('requestedBy').value.trim(),
        dateOfSubmission: document.getElementById('submissionDate').value,
        userId: String(currentUser.id)  // Ensure string for consistency
    };
    console.log('Saving request with userId (type:', typeof requestData.userId, '):', requestData.userId);
    
    console.log('Form data collected:', requestData);
    
    // Validate data
    const validation = changeRequestSystem.validateRequestData(requestData);
    console.log('Validation result:', validation);
    
    if (!validation.isValid) {
        console.log('Validation failed:', validation.errors);
        showError(validation.errors.join(', '));
        return;
    }
    
    // Submit request
    console.log('Attempting to add change request...');
    const result = changeRequestSystem.addChangeRequest(requestData);
    console.log('Add request result:', result);
    
    // DEBUG: Verify data persisted
    const allRequestsAfter = changeRequestSystem.getChangeRequests();
    const userRequestsAfter = changeRequestSystem.getUserChangeRequests(String(currentUser.id));
    console.log('All requests after submit (count:', allRequestsAfter.length, '):', allRequestsAfter);
    console.log('User requests after submit (count:', userRequestsAfter.length, '):', userRequestsAfter);
    
    if (result.success) {
        console.log('Request submitted successfully, refreshing dashboard...');
        showSuccess('Change request submitted successfully!');
        clearForm();
        
        // Add timeout for localStorage consistency
        setTimeout(() => {
            loadDashboardData();
            console.log('Dashboard refreshed after submit');
        }, 100);
        console.log('=== SUBMIT CHANGE REQUEST END ===');
    } else {
        console.log('Request submission failed:', result.message);
        showError(result.message || 'Failed to submit change request');
    }
}

// Display change requests
function displayChangeRequests(requests) {
    const requestsList = document.getElementById('requestsList');
    const changeRequestSystem = new ChangeRequestSystem();
    
    if (requests.length === 0) {
        requestsList.innerHTML = '<p style="text-align: center; color: #666;">No change requests found.</p>';
        return;
    }
    
    const requestsHTML = requests.map(request => {
        const priorityClass = changeRequestSystem.getPriorityClass(request.priority);
        const formattedDate = changeRequestSystem.formatDate(request.dateOfSubmission);
        const formattedDateTime = changeRequestSystem.formatDateTime(request.createdAt);
        
        // Add withdraw button for pending requests
        const withdrawButton = request.status === 'pending' ? 
            `<button onclick="withdrawRequest('${request.id}')" style="background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-top: 5px;">Withdraw</button>` 
            : '';
        
        return `
            <div class="request-item ${priorityClass}">
                <div class="request-header">
                    <span class="request-id">${request.id}</span>
                    <span class="request-priority ${priorityClass}">${request.priority.toUpperCase()}</span>
                </div>
                <div class="request-meta">
                    <strong>Type:</strong> ${formatChangeType(request.changeType)} | 
                    <strong>Submitted:</strong> ${formattedDate} | 
                    <strong>Status:</strong> ${formatStatus(request.status)}
                </div>
                <div class="request-description">
                    ${request.description}
                </div>
                <div class="request-meta" style="margin-top: 10px; font-size: 11px;">
                    <strong>Created:</strong> ${formattedDateTime}
                    ${withdrawButton}
                </div>
            </div>
        `;
    }).join('');
    
    requestsList.innerHTML = requestsHTML;
}

// Format change type for display
function formatChangeType(type) {
    const types = {
        'feature': 'New Feature',
        'bug_fix': 'Bug Fix',
        'enhancement': 'Enhancement',
        'documentation': 'Documentation',
        'security': 'Security',
        'performance': 'Performance',
        'other': 'Other'
    };
    return types[type] || type;
}

// Format status for display
function formatStatus(status) {
    const statuses = {
        'pending': '⏳ Pending',
        'approved': '✅ Approved',
        'rejected': '❌ Rejected',
        'in_progress': '🔄 In Progress'
    };
    return statuses[status] || status;
}

// Clear form
function clearForm() {
    document.getElementById('changeRequestForm').reset();
    
    // Reset default values
    const today = new Date().toISOString().split('T')[0];
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    document.getElementById('submissionDate').value = today;
    document.getElementById('requestedBy').value = currentUser.fullname;
    
    // Clear messages
    hideMessages();
}

// Withdraw change request
function withdrawRequest(requestId) {
    const reason = prompt('Please enter reason for withdrawing this change request:');
    
    if (!reason || reason.trim() === '') {
        showError('Withdrawal reason is required');
        return;
    }
    
    const changeRequestSystem = new ChangeRequestSystem();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    const result = changeRequestSystem.withdrawChangeRequest(requestId, reason, currentUser);
    
    if (result.success) {
        showSuccess('Change request withdrawn successfully!');
        loadDashboardData();
    } else {
        showError(result.message || 'Failed to withdraw change request');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Hide success message
    document.getElementById('successMessage').style.display = 'none';
    
    // Auto-hide after 5 seconds
    setTimeout(hideMessages, 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Hide error message
    document.getElementById('errorMessage').style.display = 'none';
    
    // Auto-hide after 5 seconds
    setTimeout(hideMessages, 5000);
}

// Hide all messages
function hideMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// Logout
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}


// Refresh dashboard
function refreshDashboard() {
    loadDashboardData();
    showSuccess('Dashboard refreshed!');
}

// Export change request (for future use)
function exportChangeRequests() {
    const changeRequestSystem = new ChangeRequestSystem();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const requests = changeRequestSystem.getUserChangeRequests(currentUser.id);
    
    // Create CSV content
    const headers = ['Change ID', 'Change Type', 'Description', 'Priority', 'Requested By', 'Date of Submission', 'Status', 'Created At'];
    const csvContent = [
        headers.join(','),
        ...requests.map(request => [
            request.id,
            formatChangeType(request.changeType),
            `"${request.description.replace(/"/g, '""')}"`, // Escape quotes in CSV
            request.priority,
            request.requestedBy,
            request.dateOfSubmission,
            request.status,
            request.createdAt
        ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `change_requests_${currentUser.username}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showSuccess('Change requests exported successfully!');
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const form = document.getElementById('changeRequestForm');
        if (form.checkValidity()) {
            submitChangeRequest();
        }
    }
    
    // Ctrl/Cmd + R to refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshDashboard();
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        clearForm();
    }
});

// Add form validation feedback
document.getElementById('changeRequestForm').addEventListener('input', function(e) {
    const target = e.target;
    
    // Clear error on input
    if (target.style.borderColor) {
        target.style.borderColor = '';
    }
    
    // Validate description length
    if (target.id === 'description') {
        const charCount = target.value.length;
        if (charCount < 10) {
            target.style.borderColor = '#e74c3c';
        } else if (charCount >= 10) {
            target.style.borderColor = '#27ae60';
        }
    }
});


// Auto-save draft functionality
let autoSaveTimer;
document.getElementById('changeRequestForm').addEventListener('input', function() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        const formData = {
            changeType: document.getElementById('changeType').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            requestedBy: document.getElementById('requestedBy').value,
            dateOfSubmission: document.getElementById('submissionDate').value
        };
        
        sessionStorage.setItem('changeRequestDraft', JSON.stringify(formData));
        console.log('Draft saved automatically');
    }, 2000);
});

// Restore draft on page load
window.addEventListener('load', function() {
    const draft = sessionStorage.getItem('changeRequestDraft');
    if (draft) {
        try {
            const formData = JSON.parse(draft);
            
            // Only restore if form is empty
            if (!document.getElementById('changeType').value) {
                document.getElementById('changeType').value = formData.changeType || '';
                document.getElementById('description').value = formData.description || '';
                document.getElementById('requestedBy').value = formData.requestedBy || '';
                document.getElementById('submissionDate').value = formData.dateOfSubmission || '';
                
                if (formData.priority) {
                    document.getElementById('priority').value = formData.priority;
                }
                
                console.log('Draft restored');
            }
        } catch (error) {
            console.error('Error restoring draft:', error);
        }
    }
});

// Clear draft when form is submitted
document.getElementById('changeRequestForm').addEventListener('submit', function() {
    sessionStorage.removeItem('changeRequestDraft');
});
