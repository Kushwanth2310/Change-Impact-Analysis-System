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
    
    // Assignment form handler
    document.getElementById('assignmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        assignTask();
    });
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
        completed: requests.filter(r => r.status === 'approved' || r.status === 'in_progress').length,
        assigned: requests.filter(r => r.status === 'assigned').length,
        acknowledged: requests.filter(r => r.status === 'acknowledged').length,
        devInProgress: requests.filter(r => r.status === 'in_progress').length,
        devCompleted: requests.filter(r => r.status === 'completed').length
    };
    
    document.getElementById('totalRequests').textContent = stats.total;
    document.getElementById('pendingRequests').textContent = stats.pending;
    document.getElementById('inProgressRequests').textContent = stats.inProgress;
    document.getElementById('completedRequests').textContent = stats.completed;
    document.getElementById('assignedRequests').textContent = stats.assigned;
    document.getElementById('acknowledgedRequests').textContent = stats.acknowledged;
    document.getElementById('devInProgressRequests').textContent = stats.devInProgress;
    document.getElementById('devCompletedRequests').textContent = stats.devCompleted;
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
                <td>${getDeveloperStatus(request)}</td>
                <td>${getAssignedDeveloperDisplay(request)}</td>
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

// Get assigned developer display
function getAssignedDeveloperDisplay(request) {
    if (request.assignedTo && request.assignedToName) {
        return `<span class="assigned-developer">${request.assignedToName}</span>`;
    } else if (request.assignedTo) {
        // Fallback: get user name from storage
        const userStorage = new UserStorage();
        const users = userStorage.getUsers();
        const assignedUser = users.find(u => u.id === request.assignedTo);
        if (assignedUser) {
            return `<span class="assigned-developer">${assignedUser.fullname}</span>`;
        }
    }
    return '<span class="unassigned">Not assigned</span>';
}

function getDeveloperStatus(request) {
    switch (request.status) {
        case 'assigned':
            return request.assignedToName ? `Assigned to ${request.assignedToName}` : 'Assigned';
        case 'acknowledged':
            return 'Acknowledged';
        case 'in_progress':
            return 'Work Started';
        case 'completed':
            return 'Completed';
        case 'approved':
            return 'Awaiting assignment';
        case 'pending':
            return 'Awaiting acknowledgement';
        case 'rejected':
            return 'Rejected';
        default:
            return request.status ? formatStatus(request.status) : 'Unknown';
    }
}

function isRejectedStatus(status) {
    return String(status || '').toLowerCase().trim() === 'rejected';
}

// Get action buttons for request
function getRequestActionButtons(request) {
    let actionButtons = '';
    
    if (isRejectedStatus(request.status)) {
        actionButtons = '<span style="color: #666;">No actions available</span>';
    }
    // Approve button for pending requests
    else if (request.status === 'pending') {
        actionButtons = `
            <button class="btn btn-approve" onclick="updateRequestStatus('${request.id}', 'approved')">Approve</button>
            <button class="btn btn-reject" onclick="updateRequestStatus('${request.id}', 'rejected')">Reject</button>
        `;
    }
    
    // In Progress and Assign button for approved requests
    else if (request.status === 'approved') {
        actionButtons = `
            <button class="btn btn-in-progress" onclick="updateRequestStatus('${request.id}', 'in_progress')">Start Progress</button>
            <button class="action-btn assign-btn" onclick="openAssignmentModal('${request.id}')">Assign</button>
        `;
    }
    
    // Assign button for in_progress requests if not assigned
    else if (request.status === 'in_progress' && !request.assignedTo) {
        actionButtons = `
            <button class="action-btn assign-btn" onclick="openAssignmentModal('${request.id}')">Assign</button>
        `;
    }
    
    // Show assigned status for already assigned requests
    else if (request.status === 'assigned') {
        const assignedLabel = request.assignedToName ? `Assigned to ${request.assignedToName}` : 'Assigned';
        actionButtons = `<span style="color: #2c3e50; font-weight: 600;">${assignedLabel}</span>`;
    }
    
    // No actions for other statuses
    else if (!actionButtons) {
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

// Open assignment modal
function openAssignmentModal(requestId) {
    const changeRequestSystem = new ChangeRequestSystem();
    const request = changeRequestSystem.getChangeRequest(requestId);
    
    if (!request) {
        showError('Change request not found');
        return;
    }
    
    if (isRejectedStatus(request.status)) {
        showAssignmentError('Cannot assign a rejected request');
        return;
    }
    
    // Populate request info
    const requestInfo = document.getElementById('requestInfo');
    requestInfo.innerHTML = `
        <strong>Request ID:</strong> ${request.id}<br>
        <strong>Type:</strong> ${formatChangeType(request.changeType)}<br>
        <strong>Description:</strong> ${request.description}<br>
        <strong>Priority:</strong> ${request.priority.toUpperCase()}<br>
        <strong>Status:</strong> ${formatStatus(request.status)}<br>
        ${request.status === 'assigned' && request.assignedToName ? `<strong>Assigned To:</strong> ${request.assignedToName}<br>` : ''}
    `;
    
    // Store request ID for form submission
    document.getElementById('assignmentForm').dataset.requestId = requestId;
    
    // Load developers
    loadDevelopers();
    
    // Show modal
    document.getElementById('assignmentModal').style.display = 'block';
}

// Close assignment modal
function closeAssignmentModal() {
    document.getElementById('assignmentModal').style.display = 'none';
    document.getElementById('assignmentErrorMessage').style.display = 'none';
    document.getElementById('assignmentForm').reset();
}

// Load developers into select
function loadDevelopers() {
    const userStorage = new UserStorage();
    const developers = userStorage.getDevelopersWithSkills();
    const developerSelect = document.getElementById('developerSelect');
    
    // Clear existing options except the first one
    while (developerSelect.children.length > 1) {
        developerSelect.removeChild(developerSelect.lastChild);
    }
    
    // Add developers with their skills
    developers.forEach(dev => {
        const option = document.createElement('option');
        option.value = dev.id;
        option.textContent = `${dev.fullname} (${dev.skills.join(', ')})`;
        option.dataset.skills = JSON.stringify(dev.skills);
        developerSelect.appendChild(option);
    });
}

// Filter developers by skill
function filterDevelopers() {
    const skillFilter = document.getElementById('skillFilter').value;
    const developerSelect = document.getElementById('developerSelect');
    
    // Show all developers if no skill filter
    if (!skillFilter) {
        Array.from(developerSelect.options).forEach(option => {
            option.style.display = 'block';
        });
        return;
    }
    
    // Filter developers by selected skill
    Array.from(developerSelect.options).forEach(option => {
        if (option.value === '') {
            option.style.display = 'block'; // Keep the "Choose a developer" option
            return;
        }
        
        const skills = JSON.parse(option.dataset.skills || '[]');
        const hasSkill = skills.includes(skillFilter);
        option.style.display = hasSkill ? 'block' : 'none';
    });
}

// Assign task to developer
function assignTask() {
    const requestId = document.getElementById('assignmentForm').dataset.requestId;
    const developerId = document.getElementById('developerSelect').value;
    const assignmentNotes = document.getElementById('assignmentNotes').value.trim();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Validate inputs
    if (!developerId) {
        showAssignmentError('Please select a developer');
        return;
    }
    
    // Get developer info
    const userStorage = new UserStorage();
    const users = userStorage.getUsers();
    const developer = users.find(u => u.id === developerId);
    
    if (!developer) {
        showAssignmentError('Developer not found');
        return;
    }
    
    const changeRequestSystem = new ChangeRequestSystem();
    const request = changeRequestSystem.getChangeRequest(requestId);
    if (!request || isRejectedStatus(request.status)) {
        showAssignmentError('Cannot assign a rejected or invalid request');
        return;
    }
    
    // Update change request with assignment
    const result = changeRequestSystem.assignRequest(requestId, developerId, developer.fullname, {
        assignedBy: currentUser.id,
        assignedAt: new Date().toISOString(),
        notes: assignmentNotes
    });
    
    if (result.success) {
        closeAssignmentModal();
        showSuccess(`Task assigned to ${developer.fullname} successfully!`);
        loadRequests();
    } else {
        showAssignmentError(result.message || 'Failed to assign task');
    }
}

// Show assignment modal error
function showAssignmentError(message) {
    const errorDiv = document.getElementById('assignmentErrorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const assignmentModal = document.getElementById('assignmentModal');
    if (event.target === assignmentModal) {
        closeAssignmentModal();
    }
}
