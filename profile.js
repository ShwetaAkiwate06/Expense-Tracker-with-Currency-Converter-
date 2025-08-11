// new js file. profile.js
document.addEventListener('DOMContentLoaded', function() {
    const updateProfileDisplay = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const profileIcon = document.getElementById('profile-icon');
        const profileName = document.getElementById('profile-username');

        if (loggedInUser && profileIcon && profileName) {
            // Set the first letter of username as icon
            profileIcon.textContent = loggedInUser.charAt(0).toUpperCase();
            // Set full username
            profileName.textContent = loggedInUser;
        }
    };

    // Update on page load
    updateProfileDisplay();

    // Also update when storage changes (in case of multi-tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'loggedInUser') {
            updateProfileDisplay();
        }
    });
});