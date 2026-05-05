// Change Request Management System

class ChangeRequestSystem {
    constructor() {
        this.storageKey = 'cias_change_requests';
        this.security = new SecuritySystem();
        this.initializeStorage();
    }

    // Initialize storage
    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
            this.createSampleChangeRequests();
        }
    }

    // Create sample change requests for testing
    createSampleChangeRequests() {
        const sampleRequests = [
            {
                id: 'CR-SAMPLE-001',
                changeType: 'security',
                description: 'Implement user authentication and authorization system with secure password handling',
                priority: 'high',
                requestedBy: 'john_client',
                dateOfSubmission: '2026-05-01T10:00:00Z',
                userId: 'client_001',
                status: 'pending',
                createdAt: '2026-05-01T10:00:00Z',
                updatedAt: '2026-05-01T10:00:00Z'
            },
            {
                id: 'CR-SAMPLE-002',
                changeType: 'feature',
                description: 'Add payment processing functionality with multiple payment gateway support',
                priority: 'medium',
                requestedBy: 'jane_client',
                dateOfSubmission: '2026-05-02T14:30:00Z',
                userId: 'client_002',
                status: 'pending',
                createdAt: '2026-05-02T14:30:00Z',
                updatedAt: '2026-05-02T14:30:00Z'
            },
            {
                id: 'CR-SAMPLE-003',
                changeType: 'performance',
                description: 'Optimize database queries and implement caching for better system performance',
                priority: 'medium',
                requestedBy: 'bob_client',
                dateOfSubmission: '2026-05-03T09:15:00Z',
                userId: 'client_003',
                status: 'pending',
                createdAt: '2026-05-03T09:15:00Z',
                updatedAt: '2026-05-03T09:15:00Z'
            }
        ];
        
        localStorage.setItem(this.storageKey, JSON.stringify(sampleRequests));
    }

    // Generate unique change ID
    generateChangeId() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `CR-${timestamp}-${random}`;
    }

    // Get all change requests
    getChangeRequests() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch (error) {
            console.error('Error reading change requests:', error);
            return [];
        }
    }

    // Get change requests by user
    getUserChangeRequests(userId) {
        const allRequests = this.getChangeRequests();
        return allRequests.filter(request => request.userId === userId);
    }

    // Add new change request
    addChangeRequest(requestData) {
        const requests = this.getChangeRequests();
        
        const newRequest = {
            id: this.generateChangeId(),
            changeType: requestData.changeType,
            description: requestData.description,
            priority: requestData.priority,
            requestedBy: requestData.requestedBy,
            dateOfSubmission: requestData.dateOfSubmission,
            userId: requestData.userId,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        requests.push(newRequest);
        
        if (this.saveRequests(requests)) {
            this.security.logAction(
                requestData.requestedBy || 'client',
                requestData.requestedBy || 'CLIENT',
                'CHANGE_REQUEST_SUBMITTED',
                `Change request submitted: ${newRequest.id} - ${requestData.changeType}`
            );
            return { success: true, request: newRequest };
        } else {
            return { success: false, message: 'Failed to save change request' };
        }
    }

    // Update change request status
    updateRequestStatus(requestId, newStatus, updatedBy = null) {
        const requests = this.getChangeRequests();
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex === -1) {
            return { success: false, message: 'Change request not found' };
        }

        const oldStatus = requests[requestIndex].status;
        requests[requestIndex].status = newStatus;
        requests[requestIndex].updatedAt = new Date().toISOString();

        if (this.saveRequests(requests)) {
            this.security.logAction(
                updatedBy?.id || 'system',
                updatedBy?.username || 'SYSTEM',
                'CHANGE_REQUEST_STATUS_UPDATED',
                `Request ${requestId} status changed from ${oldStatus} to ${newStatus}`
            );
            return { success: true, message: 'Request status updated successfully' };
        } else {
            return { success: false, message: 'Failed to update request status' };
        }
    }

    // Delete change request
    deleteChangeRequest(requestId, deletedBy = null) {
        const requests = this.getChangeRequests();
        const filteredRequests = requests.filter(r => r.id !== requestId);
        
        if (filteredRequests.length === requests.length) {
            return { success: false, message: 'Change request not found' };
        }
        
        if (this.saveRequests(filteredRequests)) {
            this.security.logAction(
                deletedBy?.id || 'system',
                deletedBy?.username || 'SYSTEM',
                'CHANGE_REQUEST_DELETED',
                `Change request deleted: ${requestId}`
            );
            return { success: true, message: 'Change request deleted successfully' };
        } else {
            return { success: false, message: 'Failed to delete change request' };
        }
    }

    // Withdraw change request
    withdrawChangeRequest(requestId, reason, withdrawnBy = null) {
        const requests = this.getChangeRequests();
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex === -1) {
            return { success: false, message: 'Change request not found' };
        }
        
        const request = requests[requestIndex];
        
        // Only allow withdrawal of pending requests
        if (request.status !== 'pending') {
            return { success: false, message: 'Can only withdraw pending change requests' };
        }
        
        // Update request status to withdrawn
        request.status = 'withdrawn';
        request.withdrawnReason = reason;
        request.withdrawnAt = new Date().toISOString();
        request.updatedAt = new Date().toISOString();
        
        requests[requestIndex] = request;
        
        if (this.saveRequests(requests)) {
            this.security.logAction(
                withdrawnBy?.id || 'system',
                withdrawnBy?.username || 'SYSTEM',
                'CHANGE_REQUEST_WITHDRAWN',
                `Change request withdrawn: ${requestId} - Reason: ${reason}`
            );
            return { success: true, message: 'Change request withdrawn successfully' };
        } else {
            return { success: false, message: 'Failed to withdraw change request' };
        }
    }

    // Save requests to storage
    saveRequests(requests) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(requests));
            return true;
        } catch (error) {
            console.error('Error saving change requests:', error);
            return false;
        }
    }

    // Get request statistics
    getRequestStats(userId = null) {
        const requests = userId ? this.getUserChangeRequests(userId) : this.getChangeRequests();
        
        return {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            approved: requests.filter(r => r.status === 'approved').length,
            rejected: requests.filter(r => r.status === 'rejected').length,
            inProgress: requests.filter(r => r.status === 'in_progress').length
        };
    }

    // Get recent requests
    getRecentRequests(userId = null, limit = 10) {
        const requests = userId ? this.getUserChangeRequests(userId) : this.getChangeRequests();
        return requests
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    }

    // Validate change request data
    validateRequestData(data) {
        const errors = [];

        if (!data.changeType) {
            errors.push('Change type is required');
        }

        if (!data.description || data.description.trim().length < 10) {
            errors.push('Description must be at least 10 characters long');
        }

        if (!data.priority) {
            errors.push('Priority is required');
        }

        if (!data.requestedBy || data.requestedBy.trim().length < 2) {
            errors.push('Requested by must be at least 2 characters long');
        }

        if (!data.dateOfSubmission) {
            errors.push('Date of submission is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Format date-time for display
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Get priority color class
    getPriorityClass(priority) {
        switch (priority) {
            case 'high':
                return 'priority-high';
            case 'medium':
                return 'priority-medium';
            case 'low':
                return 'priority-low';
            default:
                return 'priority-medium';
        }
    }

    // Get status color class
    getStatusClass(status) {
        switch (status) {
            case 'approved':
                return 'status-approved';
            case 'rejected':
                return 'status-rejected';
            case 'in_progress':
                return 'status-in-progress';
            case 'pending':
                return 'status-pending';
            default:
                return 'status-pending';
        }
    }

    // Check if user can access functionality
    canAccess(userRole, functionality) {
        const accessRules = {
            'view_all': ['admin'],
            'view_own': ['admin', 'project_manager', 'reviewer', 'developer', 'client'],
            'view_all_pending': ['admin', 'reviewer', 'project_manager'],
            'approve': ['admin', 'reviewer'],
            'manage_status': ['admin', 'project_manager']
        };
        
        return accessRules[functionality] && accessRules[functionality].includes(userRole);
    }

    // Check if user can change request status
    canChangeRequestStatus(userRole, requestStatus, currentUserId, requestUserId) {
        // Admin can change any status
        if (userRole === 'admin') {
            return true;
        }
        
        // Reviewer can approve/reject
        if (userRole === 'reviewer') {
            return ['approved', 'rejected'].includes(requestStatus);
        }
        
        // Project Manager can approve/reject and manage
        if (userRole === 'project_manager') {
            return ['approved', 'rejected', 'in_progress'].includes(requestStatus);
        }
        
        // Other roles can only view their own requests
        return userRole === 'developer' || userRole === 'client' ? 
               (currentUserId === requestUserId && ['approved', 'rejected', 'withdrawn'].includes(requestStatus)) : false;
    }

    // Search change requests
    searchRequests(query, userId = null) {
        const requests = userId ? this.getUserChangeRequests(userId) : this.getChangeRequests();
        const searchTerm = query.toLowerCase();
        
        return requests.filter(request => 
            request.id.toLowerCase().includes(searchTerm) ||
            request.changeType.toLowerCase().includes(searchTerm) ||
            request.description.toLowerCase().includes(searchTerm) ||
            request.requestedBy.toLowerCase().includes(searchTerm)
        );
    }

    // Filter change requests
    filterRequests(filters, userId = null) {
        const requests = userId ? this.getUserChangeRequests(userId) : this.getChangeRequests();
        
        return requests.filter(request => {
            // Filter by status
            if (filters.status && filters.status !== 'all' && request.status !== filters.status) {
                return false;
            }
            
            // Filter by priority
            if (filters.priority && filters.priority !== 'all' && request.priority !== filters.priority) {
                return false;
            }
            
            // Filter by change type
            if (filters.changeType && filters.changeType !== 'all' && request.changeType !== filters.changeType) {
                return false;
            }
            
            // Filter by date range
            if (filters.dateFrom) {
                const requestDate = new Date(request.dateOfSubmission);
                const fromDate = new Date(filters.dateFrom);
                if (requestDate < fromDate) {
                    return false;
                }
            }
            
            if (filters.dateTo) {
                const requestDate = new Date(request.dateOfSubmission);
                const toDate = new Date(filters.dateTo);
                if (requestDate > toDate) {
                    return false;
                }
            }
            
            return true;
        });
    }
}

// Export for use in other files
window.ChangeRequestSystem = ChangeRequestSystem;
