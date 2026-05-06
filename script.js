// Login form handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('showPassword');
    
    // Initialize user storage
    const userStorage = new UserStorage();

    // Demo credentials for testing (fallback if no users exist)
    const demoCredentials = {
        username: 'admin',
        password: 'password123'
    };

    // Form submission handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Clear previous errors
        clearErrors();

        // Validate inputs
        if (!validateInputs(username, password)) {
            return;
        }

        // Check credentials against stored users first
        const authResult = userStorage.authenticateUser(username, password);
        
        // Debug: Log authentication attempt
        console.log('Login attempt:', { username, role: authResult.user?.role, success: authResult.success });
        
        if (authResult.success) {
            const normalizedRole = authResult.user.role?.toLowerCase().trim();
            const roleMessage = normalizedRole === 'admin' ? 'Admin login successful!' : 'Login successful!';
            showSuccess(roleMessage + ' Redirecting...');
            
            const currentUser = {
                ...authResult.user,
                role: normalizedRole
            };

            // Store current user session
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Simulate redirect after 1.5 seconds
            setTimeout(() => {
                console.log('Redirecting to dashboard...');
                console.log('Logged in user:', currentUser);
                
                // Redirect based on normalized role
                if (normalizedRole === 'admin') {
                    console.log('Redirecting to admin dashboard...');
                    window.location.href = 'admin-dashboard.html';
                } else if (normalizedRole === 'client') {
                    console.log('Redirecting to client dashboard...');
                    window.location.href = 'client-dashboard.html';
                } else if (normalizedRole === 'reviewer') {
                    console.log('Redirecting to reviewer dashboard...');
                    window.location.href = 'reviewer-dashboard.html';
                } else if (normalizedRole === 'project_manager') {
                    console.log('Redirecting to project manager dashboard...');
                    window.location.href = 'project-manager-dashboard.html';
                } else if (normalizedRole === 'developer') {
                    console.log('Redirecting to developer dashboard...');
                    window.location.href = 'developer-dashboard.html';
                } else {
                    console.log('Redirecting to user dashboard...');
                    showSuccess('Login successful! User dashboard coming soon...');
                }
            }, 1500);
        } else {
            // Check demo credentials as fallback
            if (checkCredentials(username, password)) {
                showSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    console.log('Redirecting to dashboard...');
                    // Here you would typically redirect:
                    // window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                // Invalid credentials
                showError('Invalid username or password');
            }
        }
    });

    // Input validation
    function validateInputs(username, password) {
        let isValid = true;

        if (!username) {
            showInputError(usernameInput, 'Username is required');
            isValid = false;
        } else if (username.length < 3) {
            showInputError(usernameInput, 'Username must be at least 3 characters');
            isValid = false;
        }

        if (!password) {
            showInputError(passwordInput, 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showInputError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    }

    // Check credentials against demo data
    function checkCredentials(username, password) {
        return username === demoCredentials.username && 
               password === demoCredentials.password;
    }

    // Show error message
    function showError(message) {
        // Remove existing error message if any
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = message;

        // Insert before form
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
    }

    // Clear all errors
    function clearErrors() {
        // Remove error message
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }

        // Remove input error styles
        usernameInput.style.borderColor = '';
        passwordInput.style.borderColor = '';
    }

    // Show input-specific error
    function showInputError(input, message) {
        input.style.borderColor = '#c00';
        // Could add a small error text below input here
    }

    // Show success message
    function showSuccess(message) {
        // Remove existing error message if any
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'error-message';
        successDiv.style.background = '#efe';
        successDiv.style.color = '#060';
        successDiv.style.display = 'block';
        successDiv.textContent = message;

        // Insert before form
        loginForm.insertBefore(successDiv, loginForm.firstChild);
    }

    // Clear error on input change
    usernameInput.addEventListener('input', function() {
        this.style.borderColor = '';
    });

    passwordInput.addEventListener('input', function() {
        this.style.borderColor = '';
    });

    // Show password toggle
    showPasswordCheckbox.addEventListener('change', function() {
        passwordInput.type = this.checked ? 'text' : 'password';
    });
});
