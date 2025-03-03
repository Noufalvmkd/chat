var myVar;

function myFunction() {
  myVar = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

// Business Hours Configuration
const businessHours = {
    regular: {
        title: "Regular Business Hours",
        weekdays: {
            day: "Monday - Thursday, Saturday",
            shifts: [
                { open: "08:30", close: "14:30" },
                { open: "16:30", close: "21:30" }
            ],
            breaks: [{ type: "Lunch", start: "14:30", end: "16:30" }]
        },
        friday: {
            day: "Friday",
            shifts: [
                { open: "08:30", close: "12:00" },
                { open: "16:30", close: "21:30" }
            ],
            breaks: [{ type: "Prayer", start: "12:00", end: "16:30" }]
        }
    },
    ramadan: {
        title: "Ramadan Business Hours",
        weekdays: {
            day: "Monday - Thursday, Saturday",
            shifts: [
                { open: "09:00", close: "17:00" },
                { open: "20:00", close: "23:00" }
            ],
            breaks: [{ type: "Break", start: "17:00", end: "20:00" }]
        },
        friday: {
            day: "Friday",
            shifts: [
                { open: "09:00", close: "12:00" },
                { open: "20:00", close: "23:00" }
            ],
            breaks: [{ type: "Prayer", start: "12:00", end: "20:00" }]
        }
    }
};

// DOM Elements
const currentDateTimeEl = document.getElementById("current-date-time");
const businessStatusEl = document.getElementById("business-status");
const ramadanToggleEl = document.getElementById("ramadan-toggle");
const toggleLabel = document.getElementById("toggle-label"); // New: Toggle text label
const container = document.querySelector(".business-hours-container");

// Initialize variables (Ramadan is default)
let isRamadan = true;
let currentTimingMode = "ramadan";

// Convert time to minutes
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
}

// Convert 24-hour time to 12-hour format with AM/PM
function convertTo12HourFormat(timeStr) {
    let [hour, minute] = timeStr.split(":").map(Number);
    let period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}

// Check business status
function checkBusinessStatus() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" }));
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentTimeInMinutes = timeToMinutes(now.toTimeString().slice(0, 5));

    const timingData = businessHours[currentTimingMode];
    let dayData;

    if (currentDay === 0) {
        setBusinessStatus("closed", "Closed Today");
        return;
    } else if (currentDay === 5) {
        dayData = timingData.friday;
    } else {
        dayData = timingData.weekdays;
    }

    let isOpen = false;
    let statusText = "Closed";

    // Check if within business hours
    for (const shift of dayData.shifts) {
        if (currentTimeInMinutes >= timeToMinutes(shift.open) && currentTimeInMinutes < timeToMinutes(shift.close)) {
            isOpen = true;
            statusText = "Open Now";
            break;
        }
    }

    // Check if it's break time
    for (const breakPeriod of dayData.breaks) {
        if (currentTimeInMinutes >= timeToMinutes(breakPeriod.start) && currentTimeInMinutes < timeToMinutes(breakPeriod.end)) {
            statusText = breakPeriod.type === "Prayer" ? "Closed for Prayer" : "Break Time";
            setBusinessStatus("break", statusText);
            return;
        }
    }

    setBusinessStatus(isOpen ? "open" : "closed", statusText);
}

// Set the business status display
function setBusinessStatus(status, text) {
    businessStatusEl.className = "badge rounded-pill " + status;
    businessStatusEl.textContent = text;
}

// Update the current date and time display (12-hour format with AM/PM)
function updateDateTime() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" }));
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true // Ensure 12-hour format with AM/PM
    };

    currentDateTimeEl.textContent = now.toLocaleString("en-US", options);
}

// Function to update business hours display dynamically
function updateBusinessHoursDisplay() {
    const timingData = businessHours[currentTimingMode];
    document.getElementById("business-title").textContent = timingData.title;

    // Generate weekday hours
    let weekdaysHTML = timingData.weekdays.shifts.map(shift =>
        `<span>${convertTo12HourFormat(shift.open)} - ${convertTo12HourFormat(shift.close)}</span>`
    ).join("<br>");

    weekdaysHTML += `<br><span style="color: #dc3545;">${
        timingData.weekdays.breaks.map(breakTime => 
            `(${breakTime.type}: ${convertTo12HourFormat(breakTime.start)} - ${convertTo12HourFormat(breakTime.end)})`
        ).join("<br>")
    }</span>`;

    // Generate Friday hours
    let fridayHTML = timingData.friday.shifts.map(shift =>
        `<span>${convertTo12HourFormat(shift.open)} - ${convertTo12HourFormat(shift.close)}</span>`
    ).join("<br>");

    fridayHTML += `<br><span style="color: #dc3545;">${
        timingData.friday.breaks.map(breakTime => 
            `(${breakTime.type}: ${convertTo12HourFormat(breakTime.start)} - ${convertTo12HourFormat(breakTime.end)})`
        ).join("<br>")
    }</span>`;

    // Update UI
    document.getElementById("weekdays-hours").innerHTML = weekdaysHTML;
    document.getElementById("friday-hours").innerHTML = fridayHTML;
}

// Accordion Toggle Logic
document.querySelectorAll(".accordion-button").forEach(button => {
    button.addEventListener("click", function () {
        this.parentElement.classList.toggle("active");
    });
});



// Toggle between Regular and Ramadan hours (With Label Update)
ramadanToggleEl.addEventListener("change", function () {
    isRamadan = this.checked;
    currentTimingMode = isRamadan ? "ramadan" : "regular";

    // Update the toggle label text
    toggleLabel.textContent = isRamadan ? "Switch to Regular Hours" : "Switch to Ramadan Hours";

    updateBusinessHoursDisplay();
    checkBusinessStatus();
    console.log("Ramadan Mode:", isRamadan);
});

// Initialize the page
function init() {
    ramadanToggleEl.checked = true; // Ensure Ramadan mode is active by default
    toggleLabel.textContent = "Switch to Regular Hours"; // Set initial label text
    updateDateTime();
    updateBusinessHoursDisplay();
    checkBusinessStatus();
    setInterval(() => {
        updateDateTime();
        checkBusinessStatus();
    }, 1000);
}

init();
