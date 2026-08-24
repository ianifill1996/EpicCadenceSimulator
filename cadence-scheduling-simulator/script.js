// ======================================================
// EPIC CADENCE SCHEDULING SIMULATOR
// September 2026 Pilot
// ======================================================


// ======================================================
// DEPARTMENT AND PROVIDER DATA
// ======================================================

const departments = {
    "General Medicine": [
        {
            id: 3,
            name: "Olivia Garcia",
            specialty: "Primary Care"
        }
    ],

    "Heart Center": [
        {
            id: 1,
            name: "Sarah Adams",
            specialty: "Cardiology"
        }
    ],

    "Bone Clinic": [
        {
            id: 4,
            name: "Daniel Nguyen",
            specialty: "Orthopedics"
        }
    ],

    "Skin Clinic": [
        {
            id: 2,
            name: "Brian Lee",
            specialty: "Dermatology"
        }
    ],

    "Diabetes Center": [
        {
            id: 5,
            name: "Sophia Patel",
            specialty: "Endocrinology"
        }
    ],

    "Children Clinic": [
        {
            id: 7,
            name: "Emily Scott",
            specialty: "Pediatrics"
        }
    ],

    "Digestive Health": [
        {
            id: 8,
            name: "David Turner",
            specialty: "Gastroenterology"
        }
    ],

    "Brain Center": [
        {
            id: 6,
            name: "Michael Clark",
            specialty: "Neurology"
        }
    ],

    "Women Health": [
        {
            id: 9,
            name: "Jessica Rivera",
            specialty: "Gynecology"
        }
    ],

    "Lung Center": [
        {
            id: 10,
            name: "Anthony Hall",
            specialty: "Pulmonology"
        }
    ]
};


// ======================================================
// SYSTEM SETTINGS
// ======================================================

const PILOT_YEAR = 2026;
const PILOT_MONTH = 8;

// JavaScript months:
// January = 0
// September = 8

const DAILY_APPOINTMENT_LIMIT = 10;
const WEEKLY_APPOINTMENT_LIMIT = 25;


// ======================================================
// WORKING HOURS
// ======================================================

const WORK_START_HOUR = 8;
const WORK_END_HOUR = 17;


// ======================================================
// PROTECTED TIMES
// ======================================================

const protectedTimes = [
    "10:30 AM", // Morning break

    "12:30 PM", // Lunch
    "1:00 PM",  // Lunch

    "3:00 PM"   // Afternoon break
];


// ======================================================
// BOOKED APPOINTMENTS
// ======================================================

// This array acts like our temporary database.
//
// Later this could be replaced with:
// MySQL
// PostgreSQL
// Epic database services
// API calls

const appointments = [];


// ======================================================
// HTML ELEMENTS
// ======================================================

const departmentSelect =
    document.getElementById("department");

const providerSelect =
    document.getElementById("provider");

const calendar =
    document.getElementById("calendar");

const appointmentForm =
    document.getElementById("appointment-form");

const patientNameInput =
    document.getElementById("patient-name");

const chiefComplaintInput =
    document.getElementById("chief-complaint");

const referralStatusSelect =
    document.getElementById("referral-status");

const medicalPrioritySelect =
    document.getElementById("medical-priority");

const appointmentDateInput =
    document.getElementById("appointment-date");

const appointmentTimeInput =
    document.getElementById("appointment-time");

const systemMessage =
    document.getElementById("system-message");


// ======================================================
// LOAD DEPARTMENTS
// ======================================================

function loadDepartments() {

    const departmentNames =
        Object.keys(departments);

    departmentNames.forEach(function (departmentName) {

        const option =
            document.createElement("option");

        option.value = departmentName;
        option.textContent = departmentName;

        departmentSelect.appendChild(option);
    });
}


// ======================================================
// LOAD PROVIDERS
// ======================================================

function loadProviders() {

    providerSelect.innerHTML =
        '<option value="">Select Provider</option>';

    const selectedDepartment =
        departmentSelect.value;

    clearAppointmentSelection();

    if (!selectedDepartment) {

        calendar.innerHTML =
            "<p>Select a department and provider to view availability.</p>";

        return;
    }

    const providerList =
        departments[selectedDepartment];

    providerList.forEach(function (provider) {

        const option =
            document.createElement("option");

        option.value = provider.id;

        option.textContent =
            `${provider.name} - ${provider.specialty}`;

        providerSelect.appendChild(option);
    });
}


// ======================================================
// GET SELECTED PROVIDER
// ======================================================

function getSelectedProvider() {

    const selectedDepartment =
        departmentSelect.value;

    const providerId =
        Number(providerSelect.value);

    if (!selectedDepartment || !providerId) {
        return null;
    }

    return departments[selectedDepartment]
        .find(function (provider) {

            return provider.id === providerId;

        });
}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


// ======================================================
// DATABASE DATE FORMAT
// ======================================================

function getDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ======================================================
// GENERATE SEPTEMBER CALENDAR
// ======================================================

function generateCalendar() {

    const provider =
        getSelectedProvider();

    clearAppointmentSelection();

    if (!provider) {

        calendar.innerHTML =
            "<p>Select a provider to view availability.</p>";

        return;
    }

    calendar.innerHTML = "";

    const heading =
        document.createElement("h3");

    heading.textContent =
        `${provider.name} - September 2026`;

    calendar.appendChild(heading);


    // September has 30 days

    for (let day = 1; day <= 30; day++) {

        const date =
            new Date(
                PILOT_YEAR,
                PILOT_MONTH,
                day
            );

        const dayOfWeek =
            date.getDay();


        // Skip Saturday and Sunday

        if (
            dayOfWeek === 0 ||
            dayOfWeek === 6
        ) {
            continue;
        }


        const dateButton =
            document.createElement("button");

        dateButton.type = "button";

        dateButton.textContent =
            formatDate(date);

        dateButton.style.margin = "5px";
        dateButton.style.width = "auto";


        // Check provider daily capacity

        const dailyCount =
            getDailyAppointmentCount(
                provider.id,
                date
            );


        // Check provider weekly capacity

        const weeklyCount =
            getWeeklyAppointmentCount(
                provider.id,
                date
            );


        if (
            dailyCount >= DAILY_APPOINTMENT_LIMIT ||
            weeklyCount >= WEEKLY_APPOINTMENT_LIMIT
        ) {

            dateButton.disabled = true;

            dateButton.textContent +=
                " - Full";
        }


        dateButton.addEventListener(
            "click",
            function () {

                displayTimeSlots(date);

            }
        );


        calendar.appendChild(dateButton);
    }
}


// ======================================================
// GENERATE 30-MINUTE TIME SLOTS
// ======================================================

function generateTimeSlots() {

    const slots = [];

    for (
        let hour = WORK_START_HOUR;
        hour < WORK_END_HOUR;
        hour++
    ) {

        slots.push(
            convertTo12Hour(hour, 0)
        );

        slots.push(
            convertTo12Hour(hour, 30)
        );
    }

    return slots;
}


// ======================================================
// CONVERT TIME TO 12-HOUR FORMAT
// ======================================================

function convertTo12Hour(hour, minute) {

    const suffix =
        hour >= 12 ? "PM" : "AM";

    let displayHour =
        hour % 12;

    if (displayHour === 0) {
        displayHour = 12;
    }

    const displayMinute =
        minute === 0 ? "00" : "30";

    return `${displayHour}:${displayMinute} ${suffix}`;
}


// ======================================================
// DISPLAY AVAILABLE TIME SLOTS
// ======================================================

function displayTimeSlots(date) {

    const provider =
        getSelectedProvider();

    if (!provider) {
        return;
    }


    const existingSlotContainer =
        document.getElementById(
            "time-slot-container"
        );

    if (existingSlotContainer) {
        existingSlotContainer.remove();
    }


    const container =
        document.createElement("div");

    container.id =
        "time-slot-container";


    const heading =
        document.createElement("h3");

    heading.textContent =
        `Available Times - ${formatDate(date)}`;

    container.appendChild(heading);


    // Check capacity before showing slots

    const dailyCount =
        getDailyAppointmentCount(
            provider.id,
            date
        );

    const weeklyCount =
        getWeeklyAppointmentCount(
            provider.id,
            date
        );


    if (
        dailyCount >= DAILY_APPOINTMENT_LIMIT
    ) {

        const message =
            document.createElement("p");

        message.textContent =
            "Provider has reached the daily appointment limit.";

        container.appendChild(message);

        calendar.appendChild(container);

        return;
    }


    if (
        weeklyCount >= WEEKLY_APPOINTMENT_LIMIT
    ) {

        const message =
            document.createElement("p");

        message.textContent =
            "Provider has reached the weekly appointment limit.";

        container.appendChild(message);

        calendar.appendChild(container);

        return;
    }


    const timeSlots =
        generateTimeSlots();


    timeSlots.forEach(function (time) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.textContent = time;

        button.style.margin = "5px";
        button.style.width = "auto";


        // Break or lunch

        if (
            protectedTimes.includes(time)
        ) {

            button.disabled = true;

            button.textContent =
                `${time} - Protected`;

        }


        // Already booked

        if (
            isSlotBooked(
                provider.id,
                date,
                time
            )
        ) {

            button.disabled = true;

            button.textContent =
                `${time} - Booked`;

        }


        button.addEventListener(
            "click",
            function () {

                appointmentDateInput.value =
                    getDateKey(date);

                appointmentTimeInput.value =
                    time;

                systemMessage.textContent =
                    `Selected ${formatDate(date)} at ${time}.`;

            }
        );


        container.appendChild(button);
    });


    calendar.appendChild(container);
}


// ======================================================
// CHECK WHETHER SLOT IS BOOKED
// ======================================================

function isSlotBooked(
    providerId,
    date,
    time
) {

    const dateKey =
        getDateKey(date);

    return appointments.some(
        function (appointment) {

            return (
                appointment.providerId === providerId &&
                appointment.date === dateKey &&
                appointment.time === time &&
                appointment.status === "Scheduled"
            );

        }
    );
}


// ======================================================
// DAILY APPOINTMENT COUNT
// ======================================================

function getDailyAppointmentCount(
    providerId,
    date
) {

    const dateKey =
        getDateKey(date);

    return appointments.filter(
        function (appointment) {

            return (
                appointment.providerId === providerId &&
                appointment.date === dateKey &&
                appointment.status === "Scheduled"
            );

        }
    ).length;
}


// ======================================================
// FIND MONDAY OF WEEK
// ======================================================

function getStartOfWeek(date) {

    const start =
        new Date(date);

    const day =
        start.getDay();

    const difference =
        day === 0
            ? -6
            : 1 - day;

    start.setDate(
        start.getDate() + difference
    );

    start.setHours(
        0,
        0,
        0,
        0
    );

    return start;
}


// ======================================================
// WEEKLY APPOINTMENT COUNT
// ======================================================

function getWeeklyAppointmentCount(
    providerId,
    date
) {

    const startOfWeek =
        getStartOfWeek(date);

    const endOfWeek =
        new Date(startOfWeek);

    endOfWeek.setDate(
        startOfWeek.getDate() + 6
    );


    return appointments.filter(
        function (appointment) {

            if (
                appointment.providerId !== providerId ||
                appointment.status !== "Scheduled"
            ) {

                return false;
            }


            const appointmentDate =
                new Date(
                    appointment.date +
                    "T00:00:00"
                );


            return (
                appointmentDate >= startOfWeek &&
                appointmentDate <= endOfWeek
            );

        }
    ).length;
}


// ======================================================
// MEDICAL PRIORITY MESSAGE
// ======================================================

function getPriorityMessage(priority) {

    if (priority === "high") {

        return "High medical priority documented. Earlier appropriate availability should be considered.";

    }

    if (priority === "moderate") {

        return "Moderate medical priority documented.";

    }

    return "Routine scheduling priority documented.";
}


// ======================================================
// VALIDATE APPOINTMENT
// ======================================================

function validateAppointment() {

    const provider =
        getSelectedProvider();


    if (!departmentSelect.value) {

        return {
            valid: false,
            message:
                "Please select a department."
        };
    }


    if (!provider) {

        return {
            valid: false,
            message:
                "Please select a provider."
        };
    }


    if (
        patientNameInput.value.trim() === ""
    ) {

        return {
            valid: false,
            message:
                "Please enter the patient name."
        };
    }


    if (
        chiefComplaintInput.value.trim() === ""
    ) {

        return {
            valid: false,
            message:
                "Please enter the chief complaint."
        };
    }


    if (
        referralStatusSelect.value === ""
    ) {

        return {
            valid: false,
            message:
                "Please select the referral status."
        };
    }


    if (
        medicalPrioritySelect.value === ""
    ) {

        return {
            valid: false,
            message:
                "Please select the medical priority."
        };
    }


    if (
        appointmentDateInput.value === "" ||
        appointmentTimeInput.value === ""
    ) {

        return {
            valid: false,
            message:
                "Please select an appointment date and time."
        };
    }


    return {
        valid: true
    };
}


// ======================================================
// SCHEDULE APPOINTMENT
// ======================================================

function scheduleAppointment(event) {

    event.preventDefault();


    const validation =
        validateAppointment();


    if (!validation.valid) {

        systemMessage.textContent =
            validation.message;

        return;
    }


    const provider =
        getSelectedProvider();


    const appointmentDate =
        new Date(
            appointmentDateInput.value +
            "T00:00:00"
        );


    // --------------------------------------
    // CHECK SLOT CONFLICT
    // --------------------------------------

    if (
        isSlotBooked(
            provider.id,
            appointmentDate,
            appointmentTimeInput.value
        )
    ) {

        systemMessage.textContent =
            "This appointment slot is no longer available.";

        generateCalendar();

        return;
    }


    // --------------------------------------
    // CHECK DAILY LIMIT
    // --------------------------------------

    const dailyCount =
        getDailyAppointmentCount(
            provider.id,
            appointmentDate
        );


    if (
        dailyCount >= DAILY_APPOINTMENT_LIMIT
    ) {

        systemMessage.textContent =
            "Provider has reached the maximum of 10 appointments for this day.";

        return;
    }


    // --------------------------------------
    // CHECK WEEKLY LIMIT
    // --------------------------------------

    const weeklyCount =
        getWeeklyAppointmentCount(
            provider.id,
            appointmentDate
        );


    if (
        weeklyCount >= WEEKLY_APPOINTMENT_LIMIT
    ) {

        systemMessage.textContent =
            "Provider has reached the maximum of 25 appointments for this week.";

        return;
    }


    // --------------------------------------
    // CREATE APPOINTMENT OBJECT
    // --------------------------------------

    const newAppointment = {

        appointmentId:
            appointments.length + 1,

        patientName:
            patientNameInput.value.trim(),

        department:
            departmentSelect.value,

        providerId:
            provider.id,

        providerName:
            provider.name,

        specialty:
            provider.specialty,

        date:
            appointmentDateInput.value,

        time:
            appointmentTimeInput.value,

        duration:
            30,

        chiefComplaint:
            chiefComplaintInput.value.trim(),

        referralStatus:
            referralStatusSelect.value,

        medicalPriority:
            medicalPrioritySelect.value,

        status:
            "Scheduled",

        createdAt:
            new Date()
    };


    // --------------------------------------
    // STORE APPOINTMENT
    // --------------------------------------

    appointments.push(
        newAppointment
    );


    console.log(
        "Appointment Scheduled:",
        newAppointment
    );


    console.table(
        appointments
    );


    // --------------------------------------
    // SUCCESS MESSAGE
    // --------------------------------------

    const priorityMessage =
        getPriorityMessage(
            newAppointment.medicalPriority
        );


    systemMessage.textContent =
        `Appointment successfully scheduled with ${provider.name} on ${newAppointment.date} at ${newAppointment.time}. ${priorityMessage}`;


    // --------------------------------------
    // CLEAR PATIENT FORM
    // --------------------------------------

    patientNameInput.value = "";

    chiefComplaintInput.value = "";

    referralStatusSelect.value = "";

    medicalPrioritySelect.value = "";

    appointmentDateInput.value = "";

    appointmentTimeInput.value = "";


    // --------------------------------------
    // REFRESH CALENDAR
    // --------------------------------------

    generateCalendar();
}


// ======================================================
// CLEAR SELECTED APPOINTMENT
// ======================================================

function clearAppointmentSelection() {

    appointmentDateInput.value = "";
    appointmentTimeInput.value = "";
}


// ======================================================
// EVENT LISTENERS
// ======================================================

departmentSelect.addEventListener(
    "change",
    loadProviders
);


providerSelect.addEventListener(
    "change",
    generateCalendar
);


appointmentForm.addEventListener(
    "submit",
    scheduleAppointment
);


// ======================================================
// START APPLICATION
// ======================================================

loadDepartments();