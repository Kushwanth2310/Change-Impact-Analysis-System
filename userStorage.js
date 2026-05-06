// User Storage System - manages user data using localStorage

class UserStorage {
    constructor() {
        this.storageKey = 'cias_users';
        this.security = new SecuritySystem();
        this.initializeStorage();
    }

    normalizeRole(role) {
        return String(role || '').toLowerCase().trim();
    }

    // Initialize localStorage and ensure admin user exists
    initializeStorage() {
        let users = [];
        
        // Try to get existing users
        const existingUsers = localStorage.getItem(this.storageKey);
        if (existingUsers) {
            try {
                users = JSON.parse(existingUsers).map(user => ({
                    ...user,
                    role: this.normalizeRole(user.role)
                }));
            } catch (error) {
                console.error('Error parsing existing users:', error);
                users = [];
            }
        }

        // Check if admin user exists
        const adminExists = users.some(user => user.username === 'admin' && user.role === 'admin');
        
        if (!adminExists) {
            // Add admin user if it doesn't exist
            const adminUser = {
                id: 'admin_001',
                fullname: 'System Administrator',
                email: 'admin@cias.com',
                username: 'admin',
                password: this.security.hashPassword('admin123'), // Hash the password
                role: this.normalizeRole('admin'),
                createdAt: new Date().toISOString()
            };
            
            users.push(adminUser);
            console.log('Admin user created successfully');
            
            // Log admin creation
            this.security.logAction(adminUser.id, adminUser.username, 'ADMIN_USER_CREATED', 'Default admin user created during initialization');
        }
        
        // Save users if admin was created
        if (!adminExists) {
            localStorage.setItem(this.storageKey, JSON.stringify(users));
        }
    }

    // Get all users from storage
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch (error) {
            console.error('Error reading users from storage:', error);
            return [];
        }
    }

    // Save users to storage
    saveUsers(users) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Error saving users to storage:', error);
            return false;
        }
    }

    // Add a new user
    addUser(userData) {
        const users = this.getUsers();
        
        // Check if username already exists
        if (users.some(user => user.username === userData.username)) {
            this.security.logAction('system', 'SYSTEM', 'USER_REGISTRATION_FAILED', `Username already exists: ${userData.username}`);
            return { success: false, message: 'Username already exists' };
        }
        
        // Check if email already exists
        if (users.some(user => user.email === userData.email)) {
            this.security.logAction('system', 'SYSTEM', 'USER_REGISTRATION_FAILED', `Email already registered: ${userData.email}`);
            return { success: false, message: 'Email already registered' };
        }

        // Validate role
        const validRoles = ['admin', 'project_manager', 'reviewer', 'developer', 'client'];
        const userRole = this.normalizeRole(userData.role || 'client'); // Default to client
        
        if (!validRoles.includes(userRole)) {
            return { success: false, message: 'Invalid role specified' };
        }

        // Create new user object
        const newUser = {
            id: Date.now().toString(), // Simple ID generation
            fullname: userData.fullname,
            email: userData.email,
            username: userData.username,
            password: this.security.hashPassword(userData.password), // Hash the password
            role: userRole,
            skills: userRole === 'developer' ? (userData.skills || []) : [],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        
        if (this.saveUsers(users)) {
            this.security.logAction(newUser.id, newUser.username, 'USER_REGISTERED', `New user registered with role: ${userRole}`);
            return { success: true, message: 'User registered successfully' };
        } else {
            return { success: false, message: 'Failed to save user data' };
        }
    }

    // Find user by username and password
    authenticateUser(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username);
        
        if (!user) {
            this.security.logAction('system', 'SYSTEM', 'LOGIN_FAILED', `Username not found: ${username}`);
            return { success: false, message: 'Invalid username or password' };
        }
        
        // Verify password against hash
        if (this.security.verifyPassword(password, user.password)) {
            this.security.logAction(user.id, user.username, 'LOGIN_SUCCESS', `User logged in with role: ${user.role}`);
            return { 
                success: true, 
                user: { 
                    id: user.id, 
                    fullname: user.fullname, 
                    email: user.email, 
                    username: user.username,
                    role: user.role
                } 
            };
        } else {
            this.security.logAction(user.id, user.username, 'LOGIN_FAILED', 'Invalid password attempt');
            return { success: false, message: 'Invalid username or password' };
        }
    }

    // Check if username exists
    usernameExists(username) {
        const users = this.getUsers();
        return users.some(user => user.username === username);
    }

    // Check if email exists
    emailExists(email) {
        const users = this.getUsers();
        return users.some(user => user.email === email);
    }

    // Get user by username
    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username);
    }

    // Clear all users (for testing purposes)
    clearAllUsers() {
        return this.saveUsers([]);
    }

    // Get total user count
    getUserCount() {
        return this.getUsers().length;
    }

    // Delete user by ID (admin only)
    deleteUser(userId, deletedByUser = null) {
        const users = this.getUsers();
        const userToDelete = users.find(u => u.id === userId);
        
        if (!userToDelete) {
            this.security.logAction(deletedByUser?.id || 'system', deletedByUser?.username || 'SYSTEM', 'USER_DELETE_FAILED', 'User not found');
            return { success: false, message: 'User not found' };
        }
        
        // Prevent deletion of admin users
        if (userToDelete.role === 'admin') {
            this.security.logAction(deletedByUser?.id || 'system', deletedByUser?.username || 'SYSTEM', 'USER_DELETE_FAILED', `Attempt to delete admin user: ${userToDelete.username}`);
            return { success: false, message: 'Cannot delete admin users' };
        }
        
        const filteredUsers = users.filter(u => u.id !== userId);
        
        if (this.saveUsers(filteredUsers)) {
            this.security.logAction(deletedByUser?.id || 'system', deletedByUser?.username || 'SYSTEM', 'USER_DELETED', `User deleted: ${userToDelete.username} (${userToDelete.role})`);
            return { success: true, message: 'User deleted successfully' };
        } else {
            this.security.logAction(deletedByUser?.id || 'system', deletedByUser?.username || 'SYSTEM', 'USER_DELETE_FAILED', 'Failed to save user data');
            return { success: false, message: 'Failed to delete user' };
        }
    }

    // Update user role (admin only)
    updateUserRole(userId, newRole, updatedByUser = null) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            this.security.logAction(updatedByUser?.id || 'system', updatedByUser?.username || 'SYSTEM', 'ROLE_UPDATE_FAILED', 'User not found');
            return { success: false, message: 'User not found' };
        }
        
        const user = users[userIndex];
        const oldRole = user.role;
        
        // Prevent role changes for admin users
        if (user.role === 'admin') {
            this.security.logAction(updatedByUser?.id || 'system', updatedByUser?.username || 'SYSTEM', 'ROLE_UPDATE_FAILED', `Attempt to modify admin user role: ${user.username}`);
            return { success: false, message: 'Cannot modify admin user roles' };
        }
        
        // Validate role
        const validRoles = ['admin', 'project_manager', 'reviewer', 'developer', 'client'];
        const normalizedNewRole = this.normalizeRole(newRole);
        if (!validRoles.includes(normalizedNewRole)) {
            this.security.logAction(updatedByUser?.id || 'system', updatedByUser?.username || 'SYSTEM', 'ROLE_UPDATE_FAILED', `Invalid role specified: ${newRole}`);
            return { success: false, message: 'Invalid role' };
        }
        
        users[userIndex].role = normalizedNewRole;
        
        if (this.saveUsers(users)) {
            this.security.logAction(updatedByUser?.id || 'system', updatedByUser?.username || 'SYSTEM', 'ROLE_UPDATED', `User role updated: ${user.username} from ${oldRole} to ${newRole}`);
            return { success: true, message: 'User role updated successfully' };
        } else {
            this.security.logAction(updatedByUser?.id || 'system', updatedByUser?.username || 'SYSTEM', 'ROLE_UPDATE_FAILED', 'Failed to save user data');
            return { success: false, message: 'Failed to update user role' };
        }
    }

    // Get users by role
    getUsersByRole(role) {
        const users = this.getUsers();
        return users.filter(u => u.role === role);
    }

    // Get non-admin users
    getRegularUsers() {
        return this.getUsersByRole('user');
    }

    // Check if user is admin
    isAdmin(userId) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        return user && user.role === 'admin';
    }

    // Get developers by skills
    getDevelopersBySkill(skill) {
        const developers = this.getUsersByRole('developer');
        return developers.filter(dev => dev.skills && dev.skills.includes(skill));
    }

    // Get all developers with their skills
    getDevelopersWithSkills() {
        const developers = this.getUsersByRole('developer');
        return developers.map(dev => ({
            id: dev.id,
            fullname: dev.fullname,
            username: dev.username,
            email: dev.email,
            skills: dev.skills || []
        }));
    }

    // Update developer skills
    updateDeveloperSkills(userId, skills, updatedByUser = null) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            this.security.logAction(updatedByUser?.id || 'system', updatedByUser?.username || 'SYSTEM', 'SKILLS_UPDATE_FAILED', 'User not found');
            return { success: false, message: 'User not found' };
        }
        
        const user = users[userIndex];
        
        if (user.role !== 'developer') {
            this.security.logAction(updatedByUser?.id || 'system', updatedByUser?.username || 'SYSTEM', 'SKILLS_UPDATE_FAILED', `User is not a developer: ${user.username}`);
            return { success: false, message: 'Only developers can have skills assigned' };
        }
        
        users[userIndex].skills = skills;
        
        if (this.saveUsers(users)) {
            this.security.logAction(updatedByUser?.id || 'system', updatedByUser?.username || 'SYSTEM', 'SKILLS_UPDATED', `Developer skills updated: ${user.username}`);
            return { success: true, message: 'Developer skills updated successfully' };
        } else {
            this.security.logAction(updatedByUser?.id || 'system', updatedByUser?.username || 'SYSTEM', 'SKILLS_UPDATE_FAILED', 'Failed to save user data');
            return { success: false, message: 'Failed to update developer skills' };
        }
    }
}

// Export for use in other files
window.UserStorage = UserStorage;
