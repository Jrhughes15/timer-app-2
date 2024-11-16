// -------------------------------
// 1. Date and Time Display
// -------------------------------


// ------ Updates the date and time displayed on the page every second.
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US');
}
setInterval(updateDateTime, 1000);


// -------------------------------
// 2. Stopwatch Functionality
// -------------------------------


// ------ Stores interval IDs for each stopwatch
let stopwatchIntervals = {};


// ------ Starts the stopwatch for a given ID.
function startStopwatch(stopwatchId) {
    if (stopwatchIntervals[stopwatchId]) return;

    const display = document.getElementById(`${stopwatchId}-display`);
    let time = 0;

    stopwatchIntervals[stopwatchId] = setInterval(() => {
        time += 1;
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}


// ------ Stops the stopwatch for a given ID.
function stopStopwatch(stopwatchId) {
    clearInterval(stopwatchIntervals[stopwatchId]);
    stopwatchIntervals[stopwatchId] = null;
}


// ------ Resets the stopwatch to 00:00:00.
function resetStopwatch(stopwatchId) {
    clearInterval(stopwatchIntervals[stopwatchId]);
    stopwatchIntervals[stopwatchId] = null;
    document.getElementById(`${stopwatchId}-display`).textContent = "00:00:00";
}


// ------ Restarts the stopwatch from 00:00:00.
function restartStopwatch(stopwatchId) {
    resetStopwatch(stopwatchId);
    startStopwatch(stopwatchId);
}


// -------------------------------
// 3. Timer Input Handling
// -------------------------------


// ------ Formats a numeric input as HH:MM:SS.
function formatTimeInput(value) {
    const digits = value.replace(/\D/g, ''); // Remove non-digit characters
    const totalDigits = digits.length;

    if (totalDigits === 0) return ""; // Empty input

    // Parse digits into hours, minutes, and seconds
    let seconds = 0, minutes = 0, hours = 0;

    if (totalDigits <= 2) {
        seconds = parseInt(digits, 10); // Only seconds
        return `${seconds}`;
    } else if (totalDigits <= 4) {
        seconds = parseInt(digits.slice(-2), 10); // Last two digits are seconds
        minutes = parseInt(digits.slice(0, -2), 10); // Remaining digits are minutes
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
        seconds = parseInt(digits.slice(-2), 10); // Last two digits are seconds
        minutes = parseInt(digits.slice(-4, -2), 10); // Next two digits are minutes
        hours = parseInt(digits.slice(0, -4), 10); // Remaining digits are hours
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}


// ------ Add a digit to the timer input and format it
function appendDigit(digit) {
    const timerInput = document.getElementById("timer-input");
    const currentValue = timerInput.value.replace(/:/g, ""); // Remove colons for raw digit manipulation
    const newValue = currentValue + digit;

    if (newValue.length <= 6) { // Limit to 6 digits
        timerInput.value = formatTimeInput(newValue);
    }
}

// ------ Clear the timer input field
function clearTimerInput() {
    const timerInput = document.getElementById("timer-input");
    timerInput.value = "";
}


// ------ Remove the last digit from the timer input field
function backspaceTimerInput() {
    const timerInput = document.getElementById("timer-input");
    const currentValue = timerInput.value.replace(/:/g, ""); // Remove colons
    const newValue = currentValue.slice(0, -1); // Remove the last digit
    timerInput.value = formatTimeInput(newValue);
}

// ------ Helper function to parse the formatted input into total seconds
function parseTimeInput(value) {
    const digits = value.replace(/:/g, ""); // Remove colons to get raw digits
    const totalDigits = digits.length;

    if (totalDigits === 0) return 0; // No input, return 0 seconds

    let seconds = 0, minutes = 0, hours = 0;

    if (totalDigits <= 2) {
        seconds = parseInt(digits, 10); // Only seconds
    } else if (totalDigits <= 4) {
        seconds = parseInt(digits.slice(-2), 10); // Last two digits are seconds
        minutes = parseInt(digits.slice(0, -2), 10); // Remaining digits are minutes
    } else {
        seconds = parseInt(digits.slice(-2), 10); // Last two digits are seconds
        minutes = parseInt(digits.slice(-4, -2), 10); // Next two digits are minutes
        hours = parseInt(digits.slice(0, -4), 10); // Remaining digits are hours
    }

    // Convert everything to seconds
    return hours * 3600 + minutes * 60 + seconds;
}

// Helper function to format total seconds into HH:MM:SS
function formatDurationFromSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${seconds}`;
    }
}


// -------------------------------
// 4. Timer Creation and Management
// -------------------------------


// ------ Starts a timer with the provided input.
function startTimer() {
    const timeInput = document.getElementById("timer-input").value;
    const totalSeconds = parseTimeInput(timeInput);

    if (totalSeconds > 0) {
        const formattedTitle = formatDurationFromSeconds(totalSeconds); // Format title correctly
        const timerName = document.getElementById("timer-name").value || formattedTitle;
        const endTime = new Date(Date.now() + totalSeconds * 1000);

        createCustomTimerCard(timerName, endTime, totalSeconds);
        resetTimerFields(); // Reset fields after starting the timer
    }
}


// ------ Resets the timer creation fields.
function resetTimerFields() {
    document.getElementById("timer-name").value = "";
    document.getElementById("timer-input").value = "";
}


// ------ Adds a timer button with a delete option.
function addTimer() {
    const timeInput = document.getElementById("timer-input").value;
    const totalSeconds = parseTimeInput(timeInput);
    const formattedTitle = formatDurationFromSeconds(totalSeconds); // Format title correctly
    const timerName = document.getElementById("timer-name").value || formattedTitle;

    if (totalSeconds > 0) {
        const timerButtonContainer = document.createElement("div");
        timerButtonContainer.className = "timer-button-container";

        const addButton = document.createElement("button");
        addButton.textContent = timerName; // Correctly formatted title
        addButton.classList.add("timer-btn");
        addButton.onclick = () => startTimerFromButton(totalSeconds, timerName);
        timerButtonContainer.appendChild(addButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = () => timerButtonContainer.remove();
        timerButtonContainer.appendChild(deleteButton);

        document.getElementById("added-timers").appendChild(timerButtonContainer);
        resetTimerFields(); // Reset fields after adding a timer
    }
}

// ------ Starts a timer from a button click.
function startTimerFromButton(totalSeconds, timerName) {
    const endTime = new Date(Date.now() + totalSeconds * 1000);
    createCustomTimerCard(timerName, endTime, totalSeconds);
}


// -------------------------------
// 5. Custom Timer Cards
// -------------------------------


// ------ Creates a custom timer card with worded-out duration.
function createCustomTimerCard(title, targetTime, duration) {
    const timerCard = document.createElement('div');
    timerCard.className = 'timer-card custom-timer';

    const titleElement = document.createElement('h3');
    titleElement.textContent = title; // Use formatted title
    timerCard.appendChild(titleElement);

    const targetInfo = document.createElement('p');
    const targetString = targetTime.toLocaleTimeString('en-US');
    const wordedDuration = formatDuration(duration); // Worded out duration
    targetInfo.textContent = `Target Time: ${wordedDuration} (${targetString})`;
    timerCard.appendChild(targetInfo);

    const countdownElement = document.createElement('p');
    countdownElement.className = 'countdown';
    timerCard.appendChild(countdownElement);

    let intervalId = startCountdown(targetTime, countdownElement);

    const timerActions = document.createElement('div');
    timerActions.className = 'timer-actions';

    // Edit Button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => openEditModal(timerCard, duration, 'custom', (newDuration) => {
        clearInterval(intervalId);
        const newTargetTime = new Date(Date.now() + newDuration * 1000);
        intervalId = startCountdown(newTargetTime, countdownElement);
        targetInfo.textContent = `Target Time: ${formatDuration(newDuration)} (${newTargetTime.toLocaleTimeString('en-US')})`;
    });
    timerActions.appendChild(editButton);

    // Clear Button
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.onclick = () => {
        clearInterval(intervalId);
        timerCard.remove();
    };
    timerActions.appendChild(clearButton);

    timerCard.appendChild(timerActions);
    document.getElementById("active-timers").appendChild(timerCard);
}


// ------ Formats the duration into a readable string.
function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let result = '';
    if (hours > 0) result += `${hours} hour `;
    if (minutes > 0) result += `${minutes} min `;
    result += `${seconds} secs`;
    return result;
}

// ------ Starts the countdown for a timer card.
function startCountdown(targetTime, countdownElement) {
    const timerCard = countdownElement.parentElement;

    return setInterval(() => {
        const now = new Date();
        const remainingTime = targetTime - now;

        if (remainingTime <= 0) {
            countdownElement.textContent = "Time's up!";
            timerCard.style.backgroundColor = "";
            clearInterval(this);
        } else {
            const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Change background color based on the remaining time
            if (remainingTime <= 10 * 1000) { // 10 seconds or less
                timerCard.style.backgroundColor = "#f2dede"; // Red
            } else if (remainingTime <= 15 * 1000) { // 15 seconds or less
                timerCard.style.backgroundColor = "#fcf8e3"; // Orange
            } else if (remainingTime <= 30 * 1000) {
                timerCard.style.backgroundColor = "#dff0d8"; // Green
            } else if (remainingTime <= 60 * 1000) {
                timerCard.style.backgroundColor = "#d9edf7"; // Blue
            } else {
                timerCard.style.backgroundColor = ""; // Default background
            }
        }
    }, 1000);
}


// -------------------------------
// 6. Modals and Utilities
// -------------------------------


// ------ Opens an edit modal for timers.
function openEditModal(timerCard, duration, type, onSave) {
    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalTitle = document.createElement('h3');
    modalTitle.textContent = type === 'custom' ? 'Edit Custom Timer' : 'Edit Preset Timer';
    modalContent.appendChild(modalTitle);

    if (type === 'custom') {
        // Title Input
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = timerCard.querySelector('h3').textContent;
        titleInput.placeholder = 'Timer Name';
        titleInput.style.fontSize = '1.2em';
        titleInput.style.marginBottom = '10px';
        titleInput.style.width = '100%';
        titleInput.style.textAlign = 'center';
        modalContent.appendChild(titleInput);

        // Duration Input (Number Pad Style)
        const durationInput = document.createElement('input');
        durationInput.type = 'text';
        durationInput.placeholder = 'Enter time (e.g., 23026 for 2:30:26)';
        durationInput.maxLength = 6;
        durationInput.value = formatTimeInput(duration.toString());
        durationInput.addEventListener('input', function () {
            this.value = formatTimeInput(this.value);
        });
        durationInput.style.fontSize = '1.2em';
        durationInput.style.marginBottom = '10px';
        durationInput.style.width = '100%';
        durationInput.style.textAlign = 'center';
        modalContent.appendChild(durationInput);

        // Save Button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.padding = '10px 20px';
        saveButton.style.fontSize = '1.2em';
        saveButton.onclick = () => {
            const newDuration = parseTimeInput(durationInput.value);
            const newTitle = titleInput.value || formatTimeForTitle(newDuration);
            onSave(newDuration, newTitle);
            modal.remove();
        };
        modalContent.appendChild(saveButton);

    } else if (type === 'preset') {
        // Preset Timer Edit Modal
        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.value = new Date(Date.now() + duration * 1000)
            .toLocaleTimeString('en-US', { hour12: false });
        timeInput.style.fontSize = '1.2em';
        timeInput.style.marginBottom = '10px';
        timeInput.style.width = '100%';
        timeInput.style.textAlign = 'center';
        modalContent.appendChild(timeInput);

        // Save Button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.padding = '10px 20px';
        saveButton.style.fontSize = '1.2em';
        saveButton.onclick = () => {
            const [newHours, newMinutes] = timeInput.value.split(':').map(Number);
            const newTargetTime = new Date();
            newTargetTime.setHours(newHours, newMinutes, 0, 0);

            if (newTargetTime < new Date()) {
                newTargetTime.setDate(newTargetTime.getDate() + 1);
            }

            const newDuration = Math.floor((newTargetTime - Date.now()) / 1000);
            onSave(newDuration, timerCard.querySelector('h3').textContent);
            modal.remove();
        };
        modalContent.appendChild(saveButton);
    }

    // Cancel Button (for both modals)
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '10px 20px';
    cancelButton.style.fontSize = '1.2em';
    cancelButton.style.marginTop = '10px';
    cancelButton.onclick = () => modal.remove();
    modalContent.appendChild(cancelButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}


// -------------------------------
// 7. Preset Timer Cards
// -------------------------------


// ------ Function to start a timer with a preset label and target time
function startPresetTimer(label, time) {
    const [hours, minutes, seconds, period] = time.split(/[: ]/);
    let hour = parseInt(hours);
    const minute = parseInt(minutes);
    const second = parseInt(seconds);

    // Convert to 24-hour format if necessary
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const now = new Date();
    const targetTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        second
    );

    if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const remainingTimeInSeconds = Math.floor((targetTime - now) / 1000);

    // Create a new card for preset timers
    createPresetTimerCard(label, targetTime, remainingTimeInSeconds);
}


// ------ Creates a preset timer card.
function createPresetTimerCard(label, targetTime, duration) {
    const timerCard = document.createElement('div');
    timerCard.className = 'timer-card preset-timer';

    // Title of the Timer
    const titleElement = document.createElement('h3');
    titleElement.textContent = label;
    titleElement.style.fontWeight = 'bold';
    timerCard.appendChild(titleElement);

    // Fixed Target Time
    const targetInfo = document.createElement('p');
    targetInfo.textContent = `Target Time: ${targetTime.toLocaleTimeString('en-US')}`;
    timerCard.appendChild(targetInfo);

    // Countdown Display
    const countdownElement = document.createElement('p');
    countdownElement.className = 'countdown';
    timerCard.appendChild(countdownElement);

    // Start the countdown
    let intervalId = startCountdown(targetTime, countdownElement);

    // Timer Action Buttons (Edit and Clear)
    const timerActions = document.createElement('div');
    timerActions.className = 'timer-actions';

    // Edit Button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => openEditModal(timerCard, Math.floor((targetTime - new Date()) / 1000), 'preset', (newDuration) => {
        clearInterval(intervalId);
        const newTargetTime = new Date(Date.now() + newDuration * 1000);
        intervalId = startCountdown(newTargetTime, countdownElement);
        targetInfo.textContent = `Target Time: ${newTargetTime.toLocaleTimeString('en-US')}`;
    });
    timerActions.appendChild(editButton);

    // Clear Button
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.onclick = () => {
        clearInterval(intervalId);
        timerCard.remove();
    };
    timerActions.appendChild(clearButton);

    timerCard.appendChild(timerActions);

    // Append the card to the active timers section
    document.getElementById("active-timers").appendChild(timerCard);
}

function togglePreset(sectionId) {
    const presetSection = document.getElementById(`${sectionId}-presets`);
    if (presetSection) {
        presetSection.style.display = 
            presetSection.style.display === 'none' ? 'flex' : 'none';
    }
}

// -------------------------------
// 8. Initialization
// -------------------------------


// ------ Initializes the date and time updates.
updateDateTime();
