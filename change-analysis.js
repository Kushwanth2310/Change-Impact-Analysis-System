// Change Analysis Page JavaScript

let artifactManager;
let dependencyVisualizer;
let changeRequestId;

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Check if user has appropriate role (reviewer, project manager, admin, or developer)
    if (!['reviewer', 'project_manager', 'admin', 'developer'].includes(currentUser.role)) {
        alert('Access denied. You do not have permission to view change analysis.');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize systems
    artifactManager = new ArtifactManager();
    dependencyVisualizer = new DependencyVisualizer();
    
    // Get change request ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    changeRequestId = urlParams.get('requestId');
    
    if (!changeRequestId) {
        showError('No change request ID provided');
        return;
    }
    
    // Load change request analysis
    loadChangeAnalysis();
});

// Load change request analysis
function loadChangeAnalysis() {
    const changeRequestSystem = new ChangeRequestSystem();
    
    // Get change request
    const requests = changeRequestSystem.getChangeRequests();
    const changeRequest = requests.find(r => r.id === changeRequestId);
    
    if (!changeRequest) {
        showError('Change request not found');
        return;
    }
    
    // Display change request info
    displayChangeRequestInfo(changeRequest);
    
    // Perform impact analysis
    const analysis = artifactManager.analyzeImpact(changeRequest);
    
    // Display analysis results
    displayTechnicalEffect(analysis.technicalEffect);
    displayCostEstimation(analysis.costEstimation);
    displayEffortEstimation(analysis.effortEstimation);
    displayRiskEvaluation(analysis.riskEvaluation);
    displayAffectedArtifacts(analysis.detectedArtifacts);
    displayDependencyGraph(analysis.detectedArtifacts);
    
    console.log('Change analysis loaded:', analysis);
}

// Display change request information
function displayChangeRequestInfo(changeRequest) {
    document.getElementById('requestTitle').textContent = `Change Request: ${changeRequest.id}`;
    
    const detailsHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div><strong>Type:</strong> ${formatChangeType(changeRequest.changeType)}</div>
            <div><strong>Priority:</strong> ${changeRequest.priority.toUpperCase()}</div>
            <div><strong>Status:</strong> ${formatStatus(changeRequest.status)}</div>
            <div><strong>Requested By:</strong> ${changeRequest.requestedBy}</div>
            <div><strong>Date:</strong> ${formatDate(changeRequest.dateOfSubmission)}</div>
        </div>
        <div style="margin-top: 15px;">
            <strong>Description:</strong><br>
            <p style="margin: 5px 0; color: #666;">${changeRequest.description}</p>
        </div>
    `;
    
    document.getElementById('requestDetails').innerHTML = detailsHTML;
}

// Display technical effect estimation
function displayTechnicalEffect(technicalEffect) {
    const effectColors = {
        'Low': '#27ae60',
        'Medium': '#f39c12',
        'High': '#e74c3c'
    };
    
    const effectColor = effectColors[technicalEffect.level] || '#95a5a6';
    
    const html = `
        <div class="metric-card">
            <div class="metric-title">Technical Complexity</div>
            <div class="metric-value" style="color: ${effectColor};">${technicalEffect.score}</div>
            <div class="metric-description">${technicalEffect.description}</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Effect Level</div>
            <div class="metric-value">
                <span class="risk-level risk-${technicalEffect.level.toLowerCase()}">${technicalEffect.level}</span>
            </div>
            <div class="metric-description">Overall impact assessment</div>
        </div>
        <div class="metric-card">
            <div class="metric-title">Affected Systems</div>
            <div class="metric-value">${technicalEffect.affectedSystems.length}</div>
            <div class="metric-description">${technicalEffect.affectedSystems.join(', ')}</div>
        </div>
    `;
    
    document.getElementById('technicalEffect').innerHTML = html;
}

// Display cost estimation
function displayCostEstimation(costEstimation) {
    const html = `
        <div class="metric-card">
            <div class="metric-title">Total Cost</div>
            <div class="metric-value">$${costEstimation.totalCost.toLocaleString()}</div>
            <div class="metric-description">Based on ${costEstimation.estimatedHours} hours at $${costEstimation.hourlyRate}/hour</div>
        </div>
        <table class="estimation-table">
            <thead>
                <tr>
                    <th>Artifact</th>
                    <th>Type</th>
                    <th>Hours</th>
                    <th>Cost</th>
                </tr>
            </thead>
            <tbody>
                ${costEstimation.breakdown.map(item => `
                    <tr>
                        <td>${item.artifact}</td>
                        <td>${formatArtifactType(item.type)}</td>
                        <td>${item.hours}</td>
                        <td>$${item.cost.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('costEstimation').innerHTML = html;
}

// Display effort estimation
function displayEffortEstimation(effortEstimation) {
    const html = `
        <div class="metric-card">
            <div class="metric-title">Total Effort</div>
            <div class="metric-value">${effortEstimation.totalPersonDays} hours</div>
            <div class="metric-description">Estimated ${effortEstimation.estimatedDays} days with ${effortEstimation.recommendedTeamSize} team members</div>
        </div>
        <table class="estimation-table">
            <thead>
                <tr>
                    <th>Artifact</th>
                    <th>Type</th>
                    <th>Person Days</th>
                </tr>
            </thead>
            <tbody>
                ${effortEstimation.breakdown.map(item => `
                    <tr>
                        <td>${item.artifact}</td>
                        <td>${formatArtifactType(item.type)}</td>
                        <td>${item.personDays}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('effortEstimation').innerHTML = html;
}

// Display risk evaluation
function displayRiskEvaluation(riskEvaluation) {
    const html = `
        <div class="metric-card">
            <div class="metric-title">Risk Level</div>
            <div class="metric-value">
                <span class="risk-level risk-${riskEvaluation.level.toLowerCase()}">${riskEvaluation.level}</span>
            </div>
            <div class="metric-description">Risk Score: ${riskEvaluation.score}</div>
        </div>
        <div style="margin-top: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Risk Factors</h3>
            <ul class="mitigation-list">
                ${riskEvaluation.factors.map(factor => `<li>${factor}</li>`).join('')}
            </ul>
        </div>
        <div style="margin-top: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Mitigation Strategies</h3>
            <ul class="mitigation-list">
                ${riskEvaluation.mitigation.map(strategy => `<li>${strategy}</li>`).join('')}
            </ul>
        </div>
    `;
    
    document.getElementById('riskEvaluation').innerHTML = html;
}

// Display affected artifacts
function displayAffectedArtifacts(artifacts) {
    if (artifacts.length === 0) {
        document.getElementById('affectedArtifacts').innerHTML = '<p style="text-align: center; color: #666;">No artifacts detected as affected by this change.</p>';
        return;
    }
    
    const html = artifacts.map(artifact => {
        const typeColors = {
            'requirement': '#3498db',
            'design_module': '#9b59b6',
            'source_code': '#2ecc71',
            'test_case': '#f39c12',
            'documentation': '#e74c3c'
        };
        
        const color = typeColors[artifact.type] || '#95a5a6';
        
        return `
            <div class="artifact-card">
                <div class="artifact-name">${artifact.name}</div>
                <div class="artifact-type" style="background: ${color};">${formatArtifactType(artifact.type)}</div>
                <div class="artifact-description">${artifact.description}</div>
                <div class="artifact-meta">Version: ${artifact.version} | Status: ${artifact.status}</div>
                <div class="detection-reason">Detected: ${artifact.detectionReason}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('affectedArtifacts').innerHTML = html;
}

// Display dependency graph
function displayDependencyGraph(artifacts) {
    if (artifacts.length === 0) {
        document.getElementById('dependencyGraph').innerHTML = '<p style="text-align: center; color: #666;">No dependencies to display.</p>';
        return;
    }
    
    // Generate dependency graph
    const artifactIds = artifacts.map(a => a.id);
    const dependencyGraph = artifactManager.generateDependencyView(artifactIds);
    
    // Create container for dependency graph
    const container = document.getElementById('dependencyGraph');
    container.innerHTML = '<div id="dependencyGraphContainer" style="width: 100%; height: 400px;"></div>';
    
    // Render dependency graph
    dependencyVisualizer.createDependencyGraph('dependencyGraphContainer', dependencyGraph);
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

// Format artifact type for display
function formatArtifactType(type) {
    const types = {
        'requirement': 'Requirements',
        'design_module': 'Design Modules',
        'source_code': 'Source Code',
        'test_case': 'Test Cases',
        'documentation': 'Documentation'
    };
    return types[type] || type;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show error message
function showError(message) {
    const container = document.querySelector('.analysis-container');
    container.innerHTML = `
        <div style="background: #fee; color: #c00; padding: 20px; border-radius: 10px; text-align: center;">
            <h2>Error</h2>
            <p>${message}</p>
            <a href="javascript:history.back()" style="background: #95a5a6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">← Go Back</a>
        </div>
    `;
}
