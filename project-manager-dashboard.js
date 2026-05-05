// Project Manager Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is project manager
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    if (currentUser.role !== 'project_manager') {
        alert('Access denied. Project Manager privileges required.');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize systems
    const changeRequestSystem = new ChangeRequestSystem();
    
    // Update user info in header
    document.getElementById('userName').textContent = currentUser.fullname;
    document.getElementById('userRole').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1).replace('_', ' ');
    
    // Set user avatar with first letter of name
    const userAvatarHeader = document.getElementById('userAvatarHeader');
    userAvatarHeader.textContent = currentUser.fullname.charAt(0).toUpperCase();
    
    // Load initial data
    loadRequests();
    
    // Filter change handler
    document.getElementById('statusFilter').addEventListener('change', filterRequests);
});

// Load change requests
function loadRequests() {
    console.log('=== LOADING REQUESTS IN PROJECT MANAGER DASHBOARD ===');
    
    // Check if ChangeRequestSystem class is available
    if (typeof ChangeRequestSystem === 'undefined') {
        console.error('ChangeRequestSystem class not found!');
        alert('Error: ChangeRequestSystem not loaded. Please refresh the page.');
        return;
    }
    
    const changeRequestSystem = new ChangeRequestSystem();
    const allRequests = changeRequestSystem.getChangeRequests();
    
    console.log('All requests found:', allRequests);
    console.log('Number of requests:', allRequests.length);
    
    // Project Managers can see all requests from all users
    displayRequests(allRequests);
    
    // Update stats
    updateStats(allRequests);
    
    console.log('=== REQUESTS LOADING COMPLETED ===');
}

// Update statistics
function updateStats(requests) {
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        inProgress: requests.filter(r => r.status === 'in_progress').length,
        completed: requests.filter(r => r.status === 'approved' || r.status === 'in_progress').length
    };
    
    document.getElementById('totalRequests').textContent = stats.total;
    document.getElementById('pendingRequests').textContent = stats.pending;
    document.getElementById('inProgressRequests').textContent = stats.inProgress;
    document.getElementById('completedRequests').textContent = stats.completed;
}

// Filter requests
function filterRequests() {
    const statusFilter = document.getElementById('statusFilter').value;
    const changeRequestSystem = new ChangeRequestSystem();
    const allRequests = changeRequestSystem.getChangeRequests();
    
    let filteredRequests = allRequests;
    
    if (statusFilter !== 'all') {
        filteredRequests = allRequests.filter(r => r.status === statusFilter);
    }
    
    displayRequests(filteredRequests);
    updateStats(filteredRequests);
}

// Display change requests

function displayRequests(requests) {
    console.log('=== DISPLAYING REQUESTS IN PROJECT MANAGER DASHBOARD ===');
    const changeRequestSystem = new ChangeRequestSystem();
    console.log('Requests to display:', requests);

    
    const requestsTableBody = document.getElementById('requestsTableBody');
    
    if (!requestsTableBody) {
        console.error('requestsTableBody element not found!');
        return;
    }
    
    if (requests.length === 0) {
        console.log('No requests found, showing empty message');
        requestsTableBody.innerHTML = '<tr><td colspan="9" class="empty-state">No change requests found.</td></tr>';
        return;
    }
    
    console.log('Building HTML for', requests.length, 'requests');
    
    const requestsHTML = requests.map(request => {
        const priorityClass = changeRequestSystem.getPriorityClass(request.priority);
        const formattedDate = changeRequestSystem.formatDate(request.dateOfSubmission);
        const formattedDateTime = changeRequestSystem.formatDateTime(request.createdAt);
        
        console.log('Processing request:', request.id, request.status);
        
        return `
            <tr class="request-item">
                <td class="request-id">${request.id}</td>
                <td class="request-type">${formatChangeType(request.changeType)}</td>
                <td class="request-description" title="${request.description}">${request.description}</td>
                <td><span class="request-priority ${priorityClass}">${request.priority.toUpperCase()}</span></td>
                <td>${request.requestedBy}</td>
                <td>${formattedDate}</td>
                <td><span class="status-badge status-${request.status}">${formatStatus(request.status)}</span></td>
                <td>
                    <button class="view-analysis-btn" onclick="openAnalysis('${request.id}')">
                        View Analysis 
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                        </svg>
                    </button>
                </td>
                <td>
                    ${getRequestActionButtons(request)}
                </td>
            </tr>
        `;
    }).join('');
    
    console.log('Setting innerHTML with', requestsHTML.length, 'characters');
    requestsTableBody.innerHTML = requestsHTML;
    
    console.log('=== REQUESTS DISPLAY COMPLETED ===');
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
        'in_progress': '🔄 In Progress',
        'withdrawn': '🔙 Withdrawn'
    };
    return statuses[status] || status;
}

// Get action buttons for request
function getRequestActionButtons(request) {
    let actionButtons = '';
    
    // Approve button for pending requests
    if (request.status === 'pending') {
        actionButtons = `
            <button class="btn btn-approve" onclick="updateRequestStatus('${request.id}', 'approved')">Approve</button>
            <button class="btn btn-reject" onclick="updateRequestStatus('${request.id}', 'rejected')">Reject</button>
        `;
    }
    
    // In Progress button for approved requests
    else if (request.status === 'approved') {
        actionButtons = `
            <button class="btn btn-in-progress" onclick="updateRequestStatus('${request.id}', 'in_progress')">Start Progress</button>
        `;
    }
    
    // No actions for other statuses
    else {
        actionButtons = '<span style="color: #666;">No actions available</span>';
    }
    
    return actionButtons;
}

// Update request status
function updateRequestStatus(requestId, newStatus) {
    const changeRequestSystem = new ChangeRequestSystem();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    const result = changeRequestSystem.updateRequestStatus(requestId, newStatus, currentUser);
    
    if (result.success) {
        showSuccess(`Request ${newStatus} successfully!`);
        loadRequests();
    } else {
        showError(result.message || 'Failed to update request status');
    }
}

// Refresh requests
function refreshRequests() {
    loadRequests();
    showSuccess('Requests refreshed!');
}

// Open analysis for a specific request
function openAnalysis(requestId) {
    console.log("Opening analysis for: " + requestId);
    // Navigate to the change analysis page
    window.location.href = `change-analysis.html?requestId=${requestId}`;
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Hide error message
    document.getElementById('errorMessage').style.display = 'none';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Hide success message
    document.getElementById('successMessage').style.display = 'none';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Logout
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
