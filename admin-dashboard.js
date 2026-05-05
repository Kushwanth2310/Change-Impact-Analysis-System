// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is admin
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    if (currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize user storage
    const userStorage = new UserStorage();
    
    // Update welcome message
    document.getElementById('adminWelcome').textContent = `Welcome, ${currentUser.fullname}`;
    
    // Load initial data
    loadDashboardData();
    
    // Add user form handler
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewUser();
    });

    // Add user show password toggle
    document.getElementById('addShowPassword').addEventListener('change', function() {
        const passwordInput = document.getElementById('addPassword');
        passwordInput.type = this.checked ? 'text' : 'password';
    });

    // Edit user form handler
    document.getElementById('editUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveUserChanges();
    });
});

// Load dashboard data
function loadDashboardData() {
    const userStorage = new UserStorage();
    
    // Get statistics
    const allUsers = userStorage.getUsers();
    const regularUsers = userStorage.getRegularUsers();
    const adminUsers = userStorage.getUsersByRole('admin');
    
    // Update statistics
    document.getElementById('totalUsers').textContent = allUsers.length;
    document.getElementById('regularUsers').textContent = regularUsers.length;
    document.getElementById('adminUsers').textContent = adminUsers.length;
    
    // Load users table
    loadUsersTable();
}

// Load users table
function loadUsersTable() {
    const userStorage = new UserStorage();
    const users = userStorage.getUsers();
    const tbody = document.getElementById('usersTableBody');
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Sort users by creation date (newest first)
    users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        const createdDate = new Date(user.createdAt).toLocaleDateString();
        const roleClass = user.role === 'admin' ? 'role-admin' : 'role-user';
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.fullname}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td><span class="user-role ${roleClass}">${user.role.toUpperCase()}</span></td>
            <td>${createdDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="editUser('${user.id}')">Edit</button>
                    ${user.role !== 'admin' ? `<button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Delete</button>` : ''}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Refresh users data
function refreshUsers() {
    hideMessages();
    loadDashboardData();
    showSuccess('Data refreshed successfully');
}

// Edit user
function editUser(userId) {
    const userStorage = new UserStorage();
    const users = userStorage.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        showError('User not found');
        return;
    }
    
    // Populate form
    document.getElementById('editFullname').value = user.fullname;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editRole').value = user.role;
    
    // Store user ID for form submission
    document.getElementById('editUserForm').dataset.userId = userId;
    
    // Show modal
    document.getElementById('editUserModal').style.display = 'block';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editUserModal').style.display = 'none';
    document.getElementById('editErrorMessage').style.display = 'none';
    document.getElementById('editUserForm').reset();
}

// Save user changes
function saveUserChanges() {
    const userStorage = new UserStorage();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const userId = document.getElementById('editUserForm').dataset.userId;
    
    const fullname = document.getElementById('editFullname').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const role = document.getElementById('editRole').value;
    
    // Validate inputs
    if (!fullname || !email) {
        showEditError('All fields are required');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showEditError('Please enter a valid email address');
        return;
    }
    
    // Get current user data
    const users = userStorage.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        showEditError('User not found');
        return;
    }
    
    // Check if email is already used by another user
    if (users.some(u => u.email === email && u.id !== userId)) {
        showEditError('Email already exists');
        return;
    }
    
    // Update user
    users[userIndex].fullname = fullname;
    users[userIndex].email = email;
    
    // Update role if changed
    if (users[userIndex].role !== role) {
        const roleResult = userStorage.updateUserRole(userId, role, currentUser);
        if (!roleResult.success) {
            showEditError(roleResult.message);
            return;
        }
    } else {
        // Save other changes
        if (!userStorage.saveUsers(users)) {
            showEditError('Failed to update user');
            return;
        }
    }
    
    // Close modal and refresh data
    closeEditModal();
    loadDashboardData();
    showSuccess('User updated successfully');
}

// Delete user
function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    const userStorage = new UserStorage();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const result = userStorage.deleteUser(userId, currentUser);
    
    if (result.success) {
        loadDashboardData();
        showSuccess('User deleted successfully');
    } else {
        showError(result.message);
    }
}

// Show add user modal
function showAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

// Close add user modal
function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
    document.getElementById('addErrorMessage').style.display = 'none';
    document.getElementById('addUserForm').reset();
}

// Add new user
function addNewUser() {
    const userStorage = new UserStorage();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    const fullname = document.getElementById('addFullname').value.trim();
    const email = document.getElementById('addEmail').value.trim();
    const username = document.getElementById('addUsername').value.trim();
    const password = document.getElementById('addPassword').value;
    const role = document.getElementById('addRole').value;
    
    // Validate inputs
    if (!fullname || !email || !username || !password || !role) {
        showAddError('All fields are required');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAddError('Please enter a valid email address');
        return;
    }
    
    // Username validation
    if (username.length < 3) {
        showAddError('Username must be at least 3 characters');
        return;
    }
    
    // Password validation
    if (password.length < 6) {
        showAddError('Password must be at least 6 characters');
        return;
    }
    
    // Create user data
    const userData = {
        fullname: fullname,
        email: email,
        username: username,
        password: password,
        role: role
    };
    
    const result = userStorage.addUser(userData);
    
    if (result.success) {
        closeAddUserModal();
        loadDashboardData();
        showSuccess('User created successfully');
    } else {
        showAddError(result.message || 'Failed to create user');
    }
}

// Show add modal error
function showAddError(message) {
    const errorDiv = document.getElementById('addErrorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Logout
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
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

// Show edit modal error
function showEditError(message) {
    const errorDiv = document.getElementById('editErrorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Hide all messages
function hideMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const editModal = document.getElementById('editUserModal');
    const addModal = document.getElementById('addUserModal');
    
    if (event.target === editModal) {
        closeEditModal();
    }
    
    if (event.target === addModal) {
        closeAddUserModal();
    }
}
