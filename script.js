// Function to update current date and time display
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US');
}
setInterval(updateDateTime, 1000);

// Stopwatch functionality
let stopwatchIntervals = {};

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

function stopStopwatch(stopwatchId) {
    clearInterval(stopwatchIntervals[stopwatchId]);
    stopwatchIntervals[stopwatchId] = null;
}

function resetStopwatch(stopwatchId) {
    clearInterval(stopwatchIntervals[stopwatchId]);
    stopwatchIntervals[stopwatchId] = null;
    document.getElementById(`${stopwatchId}-display`).textContent = "00:00:00";
}

function restartStopwatch(stopwatchId) {
    resetStopwatch(stopwatchId);
    startStopwatch(stopwatchId);
}

// Timer creation and adjustment functionality
function changeTime(unit, increment) {
    const input = document.getElementById(unit);
    let value = parseInt(input.value) + increment;

    if (unit === "hours") {
        value = (value < 0) ? 23 : value % 24;
    } else {
        value = (value < 0) ? 59 : value % 60;
    }

    input.value = value;
}

function formatTimeForTitle(hours, minutes, seconds) {
    if (hours === 0) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    const hours = parseInt(document.getElementById("hours").value);
    const minutes = parseInt(document.getElementById("minutes").value);
    const seconds = parseInt(document.getElementById("seconds").value);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds > 0) {
        const timerName = document.getElementById("timer-name").value || formatTimeForTitle(hours, minutes, seconds);
        const endTime = new Date(Date.now() + totalSeconds * 1000);
        createCustomTimerCard(timerName, endTime, totalSeconds);
    }
}

function resetTimerFields() {
    document.getElementById("timer-name").value = "";
    document.getElementById("hours").value = 0;
    document.getElementById("minutes").value = 0;
    document.getElementById("seconds").value = 0;
}

function addTimer() {
    const hours = parseInt(document.getElementById("hours").value);
    const minutes = parseInt(document.getElementById("minutes").value);
    const seconds = parseInt(document.getElementById("seconds").value);
    const timerName = document.getElementById("timer-name").value || formatTimeForTitle(hours, minutes, seconds);

    const timerButtonContainer = document.createElement("div");
    timerButtonContainer.className = "timer-button-container";

    const addButton = document.createElement("button");
    addButton.textContent = timerName;
    addButton.classList.add("timer-btn");
    addButton.onclick = () => startTimerFromButton(hours, minutes, seconds, timerName);
    timerButtonContainer.appendChild(addButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = () => timerButtonContainer.remove();
    timerButtonContainer.appendChild(deleteButton);

    document.getElementById("added-timers").appendChild(timerButtonContainer);
    resetTimerFields(); // Reset fields after adding a timer
}

function startTimerFromButton(hours, minutes, seconds, timerName) {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const endTime = new Date(Date.now() + totalSeconds * 1000);
    createCustomTimerCard(timerName, endTime, totalSeconds);
}

function createCustomTimerCard(title, targetTime, duration) {
    const timerCard = document.createElement('div');
    timerCard.className = 'timer-card custom-timer';

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    timerCard.appendChild(titleElement);

    const targetInfo = document.createElement('p');
    const targetString = targetTime.toLocaleTimeString('en-US');
    targetInfo.textContent = `Target time: ${formatDuration(duration)} (${targetString})`;
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
        targetInfo.textContent = `Target time: ${formatDuration(newDuration)} (${newTargetTime.toLocaleTimeString('en-US')})`;
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

function startCountdown(targetTime, countdownElement) {
    const timerCard = countdownElement.parentElement; // Get the parent timer card for color changes

    return setInterval(() => {
        const now = new Date();
        const remainingTime = targetTime - now;

        if (remainingTime <= 0) {
            countdownElement.textContent = "Time's up!";
            timerCard.style.backgroundColor = ""; // Reset background color
            clearInterval(this);
        } else {
            const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Change background color based on the remaining time
            if (remainingTime <= 10 * 1000) { // 10 seconds or less
                timerCard.style.backgroundColor = "#f2dede"; // Red
            } else if (remainingTime <= 15 * 1000) { // 15 seconds or less
                timerCard.style.backgroundColor = "#fcf8e3"; // Orange
            } else if (remainingTime <= 30 * 1000) { // 30 seconds or less
                timerCard.style.backgroundColor = "#dff0d8"; // Green
            } else if (remainingTime <= 60 * 1000) { // 1 minute or less
                timerCard.style.backgroundColor = "#d9edf7"; // Blue
            } else {
                timerCard.style.backgroundColor = ""; // Default background
            }
        }
    }, 1000);
}

// Modal for editing timer
function openEditModal(timerCard, timeOrDuration, type, onSave) {
    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Edit Timer';
    modalContent.appendChild(modalTitle);

    if (type === 'custom') {
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = timerCard.querySelector('h3').textContent;
        nameInput.placeholder = 'Timer Name';
        modalContent.appendChild(nameInput);

        // Time Input Row
        const timeRow = document.createElement('div');
        timeRow.className = 'dial-container';

        // Hours Input
        const hoursDial = document.createElement('div');
        hoursDial.className = 'dial';
        hoursDial.innerHTML = `
            <div class="button-group">
                <button class="small-btn" onclick="changeTime('hours', 10)">+10</button>
                <button class="small-btn" onclick="changeTime('hours', 1)">+1</button>
            </div>
            <input type="number" id="edit-hours" min="0" max="23" value="${Math.floor(timeOrDuration / 3600)}">
            <div class="button-group">
                <button class="small-btn" onclick="changeTime('hours', -1)">-1</button>
                <button class="small-btn" onclick="changeTime('hours', -10)">-10</button>
            </div>
        `;
        timeRow.appendChild(hoursDial);

        // Separator
        const separator1 = document.createElement('span');
        separator1.className = 'separator';
        separator1.textContent = ':';
        timeRow.appendChild(separator1);

        // Minutes Input
        const minutesDial = document.createElement('div');
        minutesDial.className = 'dial';
        minutesDial.innerHTML = `
            <div class="button-group">
                <button class="small-btn" onclick="changeTime('minutes', 10)">+10</button>
                <button class="small-btn" onclick="changeTime('minutes', 1)">+1</button>
            </div>
            <input type="number" id="edit-minutes" min="0" max="59" value="${Math.floor((timeOrDuration % 3600) / 60)}">
            <div class="button-group">
                <button class="small-btn" onclick="changeTime('minutes', -1)">-1</button>
                <button class="small-btn" onclick="changeTime('minutes', -10)">-10</button>
            </div>
        `;
        timeRow.appendChild(minutesDial);

        // Separator
        const separator2 = document.createElement('span');
        separator2.className = 'separator';
        separator2.textContent = ':';
        timeRow.appendChild(separator2);

        // Seconds Input
        const secondsDial = document.createElement('div');
        secondsDial.className = 'dial';
        secondsDial.innerHTML = `
            <div class="button-group">
                <button class="small-btn" onclick="changeTime('seconds', 10)">+10</button>
                <button class="small-btn" onclick="changeTime('seconds', 1)">+1</button>
            </div>
            <input type="number" id="edit-seconds" min="0" max="59" value="${timeOrDuration % 60}">
            <div class="button-group">
                <button class="small-btn" onclick="changeTime('seconds', -1)">-1</button>
                <button class="small-btn" onclick="changeTime('seconds', -10)">-10</button>
            </div>
        `;
        timeRow.appendChild(secondsDial);

        modalContent.appendChild(timeRow);

        // Save and Cancel Buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'modal-buttons';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'modal-action-btn';
        saveButton.onclick = () => {
            const newDuration = parseInt(document.getElementById('edit-hours').value) * 3600 +
                                parseInt(document.getElementById('edit-minutes').value) * 60 +
                                parseInt(document.getElementById('edit-seconds').value);
            onSave(newDuration);
            timerCard.querySelector('h3').textContent = nameInput.value || formatTimeForTitle(
                parseInt(document.getElementById('edit-hours').value),
                parseInt(document.getElementById('edit-minutes').value),
                parseInt(document.getElementById('edit-seconds').value)
            );
            modal.remove();
        };
        buttonContainer.appendChild(saveButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'modal-action-btn';
        cancelButton.onclick = () => modal.remove();
        buttonContainer.appendChild(cancelButton);

        modalContent.appendChild(buttonContainer);
    }

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}
function createIncrementDecrementInput(labelText, defaultValue, min, max) {
    const container = document.createElement('div');
    container.className = 'increment-decrement-container';

    const label = document.createElement('span');
    label.textContent = labelText;
    container.appendChild(label);

    const decrementButton = document.createElement('button');
    decrementButton.textContent = '-10';
    decrementButton.onclick = () => {
        let value = parseInt(input.value) - 10;
        input.value = value < min ? max + value + 1 : value;
    };
    container.appendChild(decrementButton);

    const decrementOneButton = document.createElement('button');
    decrementOneButton.textContent = '-1';
    decrementOneButton.onclick = () => {
        let value = parseInt(input.value) - 1;
        input.value = value < min ? max : value;
    };
    container.appendChild(decrementOneButton);

    const input = document.createElement('input');
    input.type = 'number';
    input.value = defaultValue;
    input.min = min;
    input.max = max;
    container.appendChild(input);

    const incrementOneButton = document.createElement('button');
    incrementOneButton.textContent = '+1';
    incrementOneButton.onclick = () => {
        let value = parseInt(input.value) + 1;
        input.value = value > max ? min : value;
    };
    container.appendChild(incrementOneButton);

    const incrementButton = document.createElement('button');
    incrementButton.textContent = '+10';
    incrementButton.onclick = () => {
        let value = parseInt(input.value) + 10;
        input.value = value > max ? value - max - 1 : value;
    };
    container.appendChild(incrementButton);

    return { container, input };
}

function togglePreset(sectionId) {
    const presetSection = document.getElementById(`${sectionId}-presets`);
    if (presetSection) {
        presetSection.style.display = presetSection.style.display === 'none' ? 'flex' : 'none';
    }
}

// Function to create a preset-specific timer card
function createPresetTimerCard(label, targetTime, duration) {
    const timerCard = document.createElement('div');
    timerCard.className = 'timer-card preset-timer';

    const titleElement = document.createElement('h3');
    titleElement.textContent = label;
    titleElement.style.fontWeight = 'bold';
    timerCard.appendChild(titleElement);

    const targetInfo = document.createElement('p');
    targetInfo.textContent = `Target Time: ${targetTime.toLocaleTimeString('en-US')}`;
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
    editButton.onclick = () => openPresetEditModal(timerCard, targetTime, (newTargetTime) => {
        clearInterval(intervalId);
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
    document.getElementById("active-timers").appendChild(timerCard);
}

// Function to start a timer with a preset label and target time
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

// Function to open the edit modal specifically for preset timers
function openPresetEditModal(timerCard, initialTargetTime, onSave) {
    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Edit Preset Timer';
    modalContent.appendChild(modalTitle);

    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.value = initialTargetTime.toLocaleTimeString('en-US', { hour12: false });
    modalContent.appendChild(timeInput);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => {
        const [newHours, newMinutes] = timeInput.value.split(':').map(Number);
        const newTargetTime = new Date();
        newTargetTime.setHours(newHours, newMinutes, 0, 0);

        if (newTargetTime < new Date()) {
            newTargetTime.setDate(newTargetTime.getDate() + 1);
        }

        onSave(newTargetTime);
        modal.remove();
    };
    modalContent.appendChild(saveButton);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => modal.remove();
    modalContent.appendChild(cancelButton);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

updateDateTime();
