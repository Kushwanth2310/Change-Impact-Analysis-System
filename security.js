// Security System - Password Hashing and Role-Based Access Control

class SecuritySystem {
    constructor() {
        this.auditLogKey = 'cias_audit_log';
        this.initializeAuditLog();
    }

    // Simple password hashing (in production, use bcrypt or similar)
    hashPassword(password) {
        // This is a simple hash for demonstration. In production, use proper hashing
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        // Add salt and convert to string
        const salt = 'cias_salt_2024';
        return btoa(hash.toString() + salt).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
    }

    // Verify password against hash
    verifyPassword(password, hash) {
        const hashedPassword = this.hashPassword(password);
        return hashedPassword === hash;
    }

    // Role definitions and permissions
    getRolePermissions() {
        return {
            'admin': {
                name: 'Administrator',
                permissions: [
                    'user_create', 'user_read', 'user_update', 'user_delete',
                    'role_assign', 'audit_view', 'system_config', 'approve_all'
                ],
                level: 4
            },
            'project_manager': {
                name: 'Project Manager',
                permissions: [
                    'user_read', 'project_create', 'project_update', 'project_delete',
                    'team_manage', 'approve_project', 'audit_view_limited'
                ],
                level: 3
            },
            'reviewer': {
                name: 'Reviewer',
                permissions: [
                    'user_read', 'review_submit', 'review_approve', 'review_reject',
                    'audit_view_own', 'comment_create'
                ],
                level: 2
            },
            'developer': {
                name: 'Developer',
                permissions: [
                    'user_read', 'task_create', 'task_update', 'task_complete',
                    'comment_create', 'audit_view_own'
                ],
                level: 1
            },
            'client': {
                name: 'Client',
                permissions: [
                    'user_read', 'project_view', 'task_view', 'comment_create',
                    'audit_view_own'
                ],
                level: 0
            }
        };
    }

    // Check if user has specific permission
    hasPermission(userRole, permission) {
        const rolePermissions = this.getRolePermissions();
        const userRoleData = rolePermissions[userRole];
        
        if (!userRoleData) {
            return false;
        }
        
        return userRoleData.permissions.includes(permission);
    }

    // Check if user can access functionality
    canAccess(userRole, functionality) {
        const accessRules = {
            'user_management': ['admin'],
            'role_assignment': ['admin'],
            'system_configuration': ['admin'],
            'project_management': ['admin', 'project_manager'],
            'review_management': ['admin', 'project_manager', 'reviewer'],
            'task_management': ['admin', 'project_manager', 'reviewer', 'developer'],
            'audit_logs': ['admin', 'project_manager'],
            'approval_authority': ['admin', 'reviewer'],
            'project_viewing': ['admin', 'project_manager', 'reviewer', 'developer', 'client'],
            'task_viewing': ['admin', 'project_manager', 'reviewer', 'developer', 'client']
        };
        
        const allowedRoles = accessRules[functionality] || [];
        return allowedRoles.includes(userRole);
    }

    // Initialize audit log
    initializeAuditLog() {
        if (!localStorage.getItem(this.auditLogKey)) {
            localStorage.setItem(this.auditLogKey, JSON.stringify([]));
        }
    }

    // Log user action
    logAction(userId, username, action, details = null, ipAddress = null) {
        const auditLog = this.getAuditLog();
        
        const logEntry = {
            id: Date.now().toString(),
            userId: userId,
            username: username,
            action: action,
            details: details,
            ipAddress: ipAddress || this.getClientIP(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            sessionId: this.getSessionId()
        };
        
        auditLog.push(logEntry);
        
        // Keep only last 1000 entries to prevent storage bloat
        if (auditLog.length > 1000) {
            auditLog.splice(0, auditLog.length - 1000);
        }
        
        localStorage.setItem(this.auditLogKey, JSON.stringify(auditLog));
        
        console.log('Audit log:', logEntry);
    }

    // Get audit log
    getAuditLog() {
        try {
            return JSON.parse(localStorage.getItem(this.auditLogKey)) || [];
        } catch (error) {
            console.error('Error reading audit log:', error);
            return [];
        }
    }

    // Get audit log for specific user
    getUserAuditLog(userId) {
        const allLogs = this.getAuditLog();
        return allLogs.filter(log => log.userId === userId);
    }

    // Get audit log for specific action type
    getActionAuditLog(action) {
        const allLogs = this.getAuditLog();
        return allLogs.filter(log => log.action === action);
    }

    // Get recent audit logs
    getRecentAuditLog(limit = 50) {
        const allLogs = this.getAuditLog();
        return allLogs
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    // Clear audit log (admin only)
    clearAuditLog() {
        localStorage.setItem(this.auditLogKey, JSON.stringify([]));
    }

    // Get client IP (simplified - in production, get from server)
    getClientIP() {
        // This is a placeholder - in production, get real IP from server
        return 'client_ip_' + Math.random().toString(36).substr(2, 9);
    }

    // Get session ID
    getSessionId() {
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    // Validate password strength
    validatePasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const score = Object.values(checks).filter(Boolean).length;
        
        return {
            score: score,
            maxScore: 5,
            checks: checks,
            strength: this.getPasswordStrengthLabel(score),
            isValid: score >= 3
        };
    }

    // Get password strength label
    getPasswordStrengthLabel(score) {
        if (score <= 2) return 'Weak';
        if (score <= 3) return 'Medium';
        if (score <= 4) return 'Strong';
        return 'Very Strong';
    }

    // Generate secure random password
    generateSecurePassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        return password;
    }

    // Encrypt sensitive data (basic implementation)
    encryptData(data) {
        // This is a simple XOR cipher for demonstration
        // In production, use proper encryption like AES
        const key = 'cias_encryption_key_2024';
        let encrypted = '';
        
        for (let i = 0; i < data.length; i++) {
            encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        
        return btoa(encrypted);
    }

    // Decrypt sensitive data
    decryptData(encryptedData) {
        const key = 'cias_encryption_key_2024';
        let decrypted = '';
        
        try {
            const data = atob(encryptedData);
            
            for (let i = 0; i < data.length; i++) {
                decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            
            return decrypted;
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }
}

// Export for use in other files
window.SecuritySystem = SecuritySystem;
