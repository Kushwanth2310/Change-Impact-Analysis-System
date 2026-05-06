# CIAS Project

## Overview
CIAS is a client-focused information and change analysis system built using plain HTML, CSS, and JavaScript. It provides login-based access for different user roles, including admin, client, reviewer, project manager, and developer dashboards.

## Project Description
- Login page for authentication.
- Role-based dashboards for admin, client, reviewer, project manager, and developer users.
- Local storage support for user management, change requests, artifacts, and dependency data.
- Admin dashboard includes user management features and role assignment controls.
- The project is implemented as a static web application and runs entirely in the browser.

## Dependencies
This project does not require any external libraries or package manager dependencies.

Required runtime:
- Modern web browser (Chrome, Edge, Firefox, Safari)

Files used:
- `index.html` — login page
- `style.css` — global styling
- `script.js` — login handling and validation
- `security.js` — security-related utilities
- `userStorage.js` — local storage user management
- Dashboard HTML/JS files for each role

## Usage
1. Open `index.html` in your web browser.
2. Enter login credentials.
3. After successful login, the application will redirect to the appropriate dashboard based on user role.
4. The admin dashboard is available only to users with the admin role.

## Admin Login
Use the default admin credentials below to access the admin dashboard:

- Username: `admin`
- Password: `admin123`

> Note: The admin user is automatically created in browser local storage if it does not already exist.

## Additional Notes
- User accounts are stored in browser `localStorage` under the key `cias_users`.
- Session data is stored in `sessionStorage` under the key `currentUser`.
- If the local storage is cleared, the default admin account will be recreated automatically.
- This application is a static front-end prototype and does not include a backend server.
