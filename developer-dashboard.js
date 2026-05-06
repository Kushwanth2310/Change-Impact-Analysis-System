// Developer Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is developer
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const currentUserRole = currentUser.role?.toLowerCase().trim();
    if (currentUserRole !== 'developer') {
        alert('Access denied. Developer privileges required.');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize user storage
    const userStorage = new UserStorage();
    
    // Update user info header
    document.getElementById('userName').textContent = currentUser.fullname;
    document.getElementById('userRole').textContent = 'Developer';
    document.getElementById('userAvatarHeader').textContent = currentUser.fullname.charAt(0).toUpperCase();
    
    // Display user skills
    displayUserSkills(currentUser);
    
    // Load initial data
    loadDashboardData();
});

// Display user skills
function displayUserSkills(user) {
    const skillsContainer = document.getElementById('userSkills');
    const userStorage = new UserStorage();
    const users = userStorage.getUsers();
    const currentUser = users.find(u => u.id === user.id);
    
    if (currentUser && currentUser.skills && currentUser.skills.length > 0) {
        skillsContainer.innerHTML = currentUser.skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    } else {
        skillsContainer.innerHTML = '<span style="font-size: 11px; color: #95a5a6;">No skills assigned</span>';
    }
}

// Load dashboard data
function loadDashboardData() {
    clearAnalysisSection();
    const userStorage = new UserStorage();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Get all change requests
    const changeRequestManager = new ChangeRequestSystem();
    const allRequests = changeRequestManager.getChangeRequests();
    
    // Filter requests assigned to current developer
    const myRequests = allRequests.filter(request => 
        request.assignedTo === currentUser.id || 
        (request.assignedTo && request.assignedTo.includes(currentUser.id))
    );
    
    // Calculate statistics
    const stats = {
        assigned: myRequests.filter(r => r.status === 'assigned').length,
        acknowledged: myRequests.filter(r => r.status === 'acknowledged').length,
        inProgress: myRequests.filter(r => r.status === 'in_progress').length,
        completed: myRequests.filter(r => r.status === 'completed').length
    };
    
    // Update statistics
    document.getElementById('assignedTasks').textContent = stats.assigned + stats.acknowledged;
    document.getElementById('pendingTasks').textContent = stats.assigned;
    document.getElementById('inProgressTasks').textContent = stats.inProgress;
    document.getElementById('completedTasks').textContent = stats.completed;
    
    // Load requests table
    loadRequestsTable(myRequests);
}

// Load requests table
function loadRequestsTable(requests) {
    const tbody = document.getElementById('requestsTableBody');
    const userStorage = new UserStorage();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Sort requests by date (newest first)
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply filter if selected
    const statusFilter = document.getElementById('statusFilter').value;
    const filteredRequests = statusFilter === 'all' 
        ? requests 
        : requests.filter(r => r.status === statusFilter);
    
    if (filteredRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No change requests found</td></tr>';
        return;
    }
    
    filteredRequests.forEach(request => {
        const row = document.createElement('tr');
        
        const createdDate = new Date(request.createdAt).toLocaleDateString();
        const priorityClass = `priority-${request.priority}`;
        const statusClass = `status-${request.status}`;
        
        // Get assigned by user name
        const assignedByUser = userStorage.getUserByUsername(request.createdBy);
        const assignedByName = assignedByUser ? assignedByUser.fullname : request.createdBy;
        
        row.innerHTML = `
            <td class="request-id">${request.id}</td>
            <td class="request-type">${request.changeType || request.type}</td>
            <td class="request-description" title="${request.description}">${request.description}</td>
            <td><span class="request-priority ${priorityClass}">${request.priority}</span></td>
            <td>${assignedByName}</td>
            <td>${createdDate}</td>
            <td><span class="status-badge ${statusClass}">${formatStatus(request.status)}</span></td>
            <td>
                <div class="action-buttons">
                    ${getActionButtons(request)}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Format status for display
function formatStatus(status) {
    return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Get action buttons based on request status
function getActionButtons(request) {
    let buttons = '';
    
    // Always show view button
    buttons += `<button class="action-btn view-btn" onclick="viewRequestDetails('${request.id}')">View</button>`;
    buttons += `<button class="action-btn view-analysis-btn" onclick="openAnalysis('${request.id}')">Analysis</button>`;
    
    // Action buttons based on status
    if (request.status === 'assigned') {
        buttons += `<button class="action-btn acknowledge-btn" onclick="acknowledgeRequest('${request.id}')">Acknowledge</button>`;
    } else if (request.status === 'acknowledged') {
        buttons += `<button class="action-btn start-btn" onclick="startProgress('${request.id}')">Start Work</button>`;
    } else if (request.status === 'in_progress') {
        buttons += `<button class="action-btn complete-btn" onclick="completeRequest('${request.id}')">Complete</button>`;
    }
    
    return buttons;
}

// Acknowledge request
function acknowledgeRequest(requestId) {
    if (!confirm('Are you sure you want to acknowledge this change request?')) {
        return;
    }
    
    const changeRequestManager = new ChangeRequestSystem();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    const result = changeRequestManager.updateRequestStatus(requestId, 'acknowledged', {
        acknowledgedBy: currentUser.id,
        acknowledgedAt: new Date().toISOString()
    });
    
    if (result.success) {
        showSuccess('Change request acknowledged successfully');
        loadDashboardData();
    } else {
        showError(result.message || 'Failed to acknowledge request');
    }
}

// Start progress on request
function startProgress(requestId) {
    if (!confirm('Are you sure you want to start working on this change request?')) {
        return;
    }
    
    const changeRequestManager = new ChangeRequestSystem();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    const result = changeRequestManager.updateRequestStatus(requestId, 'in_progress', {
        startedBy: currentUser.id,
        startedAt: new Date().toISOString()
    });
    
    if (result.success) {
        showSuccess('Work started on change request');
        loadDashboardData();
    } else {
        showError(result.message || 'Failed to start work');
    }
}

// Complete request
function completeRequest(requestId) {
    if (!confirm('Are you sure you want to mark this change request as completed?')) {
        return;
    }
    
    const changeRequestManager = new ChangeRequestSystem();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    const result = changeRequestManager.updateRequestStatus(requestId, 'completed', {
        completedBy: currentUser.id,
        completedAt: new Date().toISOString()
    });
    
    if (result.success) {
        showSuccess('Change request completed successfully');
        loadDashboardData();
    } else {
        showError(result.message || 'Failed to complete request');
    }
}

// View request details
function viewRequestDetails(requestId) {
    const changeRequestManager = new ChangeRequestSystem();
    const request = changeRequestManager.getChangeRequest(requestId);
    
    if (!request) {
        showError('Change request not found');
        return;
    }
    
    // Create a modal to show request details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.margin = '5% auto';
    modalContent.style.padding = '30px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.maxHeight = '85vh';
    modalContent.style.overflowY = 'auto';
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3 style="margin: 0; color: #333; margin-bottom: 20px;">Change Request Details</h3>
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Request ID:</strong> ${request.id}
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Type:</strong> ${request.changeType || request.type}
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Description:</strong> ${request.description}
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Priority:</strong> <span class="request-priority priority-${request.priority}">${request.priority}</span>
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Status:</strong> <span class="status-badge status-${request.status}">${formatStatus(request.status)}</span>
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Created By:</strong> ${request.createdBy}
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Created At:</strong> ${new Date(request.createdAt).toLocaleString()}
        </div>
        ${request.impactAnalysis ? `
        <div style="margin-bottom: 15px;">
            <strong>Impact Analysis:</strong> ${request.impactAnalysis}
        </div>
        ` : ''}
        <div style="margin-top: 20px; text-align: right;">
            <button onclick="this.closest('.modal').remove()" style="background: #95a5a6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    };
}

function showAnalysisSection(requestId) {
    const changeRequestManager = new ChangeRequestSystem();
    const request = changeRequestManager.getChangeRequest(requestId);
    const analysisSection = document.getElementById('analysisSection');
    const analysisArtifactsCount = document.getElementById('analysisArtifactsCount');
    const analysisRisk = document.getElementById('analysisRisk');
    const analysisEffort = document.getElementById('analysisEffort');
    const analysisCost = document.getElementById('analysisCost');
    const analysisDetails = document.getElementById('analysisDetails');
    
    if (!request) {
        showError('Change request not found');
        return;
    }
    
    const artifactManager = new ArtifactManager();
    const analysis = artifactManager.analyzeImpact(request);
    
    analysisArtifactsCount.textContent = analysis.totalArtifacts || 0;
    analysisRisk.textContent = analysis.riskAssessment || analysis.riskEvaluation || 'Unknown';
    analysisEffort.textContent = analysis.effortEstimation || 'Unknown';
    analysisCost.textContent = analysis.costEstimation || 'Unknown';

    const artifactList = analysis.detectedArtifacts && analysis.detectedArtifacts.length > 0
        ? analysis.detectedArtifacts.map(a => `<li>${a.name} (${a.type}) - ${a.detectionReason || 'Detected'}</li>`).join('')
        : '<li>No affected artifacts detected</li>';

    analysisDetails.innerHTML = `
        <div class="analysis-detail-card">
            <h4>Technical Effect</h4>
            <p>${analysis.technicalEffect || 'No technical effect estimated.'}</p>
        </div>
        <div class="analysis-detail-card">
            <h4>Risk Evaluation</h4>
            <p>${analysis.riskEvaluation || analysis.riskAssessment || 'No risk information available.'}</p>
        </div>
        <div class="analysis-detail-card">
            <h4>Impact Artifacts</h4>
            <ul>${artifactList}</ul>
        </div>
    `;
    
    analysisSection.style.display = 'block';
}

function clearAnalysisSection() {
    const analysisSection = document.getElementById('analysisSection');
    analysisSection.style.display = 'none';
}

// Filter requests
function filterRequests() {
    clearAnalysisSection();
    loadDashboardData();
}

// Open analysis for a specific request
function openAnalysis(requestId) {
    console.log("Opening analysis for: " + requestId);
    // Navigate to the change analysis page
    window.location.href = `change-analysis.html?requestId=${requestId}`;
}

// Refresh requests data
function refreshRequests() {
    hideMessages();
    clearAnalysisSection();
    loadDashboardData();
    showSuccess('Data refreshed successfully');
}

// Logout
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Hide error message
    document.getElementById('errorMessage').style.display = 'none';
    
    // Auto hide after 3 seconds
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
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Hide all messages
function hideMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}
