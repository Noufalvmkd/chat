// Add this script in your HTML file


function updateBusinessHours() {
    
    // Convert to Abu Dhabi time (UTC+4)
    const abuDhabiTime = new Date(new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dubai"
    }));
    
    const currentHour = abuDhabiTime.getHours();
    const currentMinute = abuDhabiTime.getMinutes();
    const currentDay = abuDhabiTime.getDay();
   
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Adjust these values according to your business hours
    const workingHours = {
        // Monday to Friday
        workDays: [1, 2, 3, 4, 5], // Monday-Friday
        openHour: 9,  // 9 AM
        closeHour: 18, // 6 PM
        // Saturday
        saturdayOpen: 10,
        saturdayClose: 14,
        // Sunday closed
    };

    let isOpen = false;
    let statusElement = document.getElementById('openStatus');

    // Check current day
    if (workingHours.workDays.includes(currentDay)) {
        // Check weekday hours
        isOpen = currentHour >= workingHours.openHour && 
                currentHour < workingHours.closeHour;
    } else if (currentDay === 6) { // Saturday
        isOpen = currentHour >= workingHours.saturdayOpen && 
                currentHour < workingHours.saturdayClose;
    }

    // Update status display
    if (statusElement) {
        statusElement.innerHTML = isOpen ? 
            '<span class="text-success">● Now Open</span>' : 
            '<span class="text-danger">● Closed</span>';
    }
}

// Run on page load and every minute
window.addEventListener('load', () => {
    updateBusinessHours();
    // Update every minute
    setInterval(updateBusinessHours, 60000);
});


//time

function updateAbuDhabiTime() {
    const options = {
        timeZone: 'Asia/Dubai',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const dateOptions = {
        timeZone: 'Asia/Dubai',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const now = new Date();
    
    // Format time
    const timeString = now.toLocaleTimeString('en-US', options);
    document.getElementById('abuDhabiClock').textContent = timeString;
    
    // Format date
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById('abuDhabiDate').textContent = dateString;
}

// Update immediately and then every second
updateAbuDhabiTime();
setInterval(updateAbuDhabiTime, 1000);