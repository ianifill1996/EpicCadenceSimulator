Cadence-Inspired Scheduling Workflow Simulation

Project Overview

This project is a Cadence-inspired healthcare scheduling workflow simulation designed to demonstrate systems analysis, application design, business-rule implementation, and front-end development.

The project simulates a healthcare organization testing a universal scheduling model across multiple outpatient departments located on one hospital campus.

The organization is conducting a September 2026 pilot to evaluate whether a standardized scheduling workflow could improve productivity, reduce scheduling inefficiencies, and create a more consistent scheduling process across departments.

Educational Portfolio Project: This project is not affiliated with or endorsed by Epic Systems and does not contain proprietary Epic software, code, or patient data.

Business Problem

The healthcare organization operates multiple specialty clinics and centers that require provider scheduling.

The organization wants to determine whether using one standardized scheduling workflow across departments could:

* Improve scheduling consistency
* Increase provider productivity
* Reduce scheduling inefficiencies
* Protect provider capacity
* Prevent scheduling conflicts
* Improve access to medically appropriate appointments
* Support future expansion across the organization

The pilot includes the following departments:

* General Medicine
* Heart Center
* Bone Clinic
* Skin Clinic
* Diabetes Center
* Children Clinic
* Digestive Health
* Brain Center
* Women Health
* Lung Center

Scheduling Workflow

The simulated workflow follows:

Select Department → Select Provider → View September Availability → Select Date → Select Available Time → Enter Appointment Information → Validate Scheduling Rules → Schedule Appointment → Update Provider Availability

Core Features

The application allows a scheduler to:

* Select a department
* View providers associated with that department
* View provider availability
* Select appointment dates
* View available 30-minute appointment slots
* Enter patient scheduling information
* Document a chief complaint
* Document referral status
* Select medical priority
* Schedule an appointment
* Receive scheduling confirmation
* Prevent already-booked slots from being selected again

Business Rules

The scheduling simulation enforces the following requirements:

* Appointments are scheduled in 30-minute increments
* Providers may have no more than 10 appointments per day
* Providers may have no more than 25 appointments per week
* Appointment times cannot overlap
* Mandatory breaks are protected from scheduling
* Mandatory lunch periods are protected from scheduling
* Booked appointment slots immediately become unavailable
* Provider availability is based on the selected department and provider
* The pilot scheduling period is September 2026

Medical Priority

The scheduling workflow includes medical-priority information to support appropriate outpatient scheduling.

Priority levels include:

* High
* Moderate
* Routine

Medical priority may be supported by information such as the patient’s chief complaint or referral.

Emergency, life-threatening, and urgent-care scenarios are outside the scope of this routine outpatient scheduling simulation.

System Architecture

The project was designed using object-oriented systems-analysis concepts.

Major system components include:

Entity

Parent class containing shared information used by system entities.

Department

Represents a healthcare department and its associated providers.

Provider

Represents an individual healthcare provider and their scheduling requirements.

Schedule

Manages provider availability, appointment slots, protected time, and capacity.

Appointment

Represents an individual scheduled appointment and its associated scheduling information.

User

Represents the office scheduler interacting with the scheduling workflow.

EpicCadenceService

Represents the service layer responsible for coordinating scheduling operations and applying business rules across departments, providers, schedules, and appointments.

Technologies Used

* HTML
* CSS
* JavaScript
* Visual Studio Code
* UML
* Excel
* Power BI

JavaScript Implementation

JavaScript provides the primary scheduling logic for the prototype.

The application uses JavaScript to:

* Populate departments
* Populate providers dynamically
* Generate the September calendar
* Generate 30-minute appointment slots
* Identify protected break and lunch periods
* Track provider appointment volume
* Validate daily capacity
* Validate weekly capacity
* Detect scheduling conflicts
* Process appointment submissions
* Store scheduled appointments during the active browser session
* Update availability after an appointment is scheduled

Data Storage

The current prototype uses a JavaScript array as temporary in-memory storage for scheduled appointments.

This means appointment information exists during the active browser session and resets when the application is refreshed.

A production implementation would use persistent database storage and secure application services rather than browser memory.

Systems Analysis

The project follows a systems-analysis and software-development workflow:

Business Problem → Requirements Analysis → Design Constraints → System Architecture → UML Modeling → Implementation → Testing → Validation → Presentation

Supporting project documentation includes:

* Business requirements
* Design constraints
* UML use case diagram
* UML class diagram
* System architecture analysis
* Power BI analysis
* Scheduling prototype

Testing

The prototype was tested for:

* Department/provider selection
* Calendar generation
* Appointment-slot generation
* Required fields
* 30-minute scheduling increments
* Protected break periods
* Protected lunch periods
* Duplicate appointment prevention
* Daily provider limits
* Weekly provider limits
* Appointment creation
* Availability updates
* Scheduling confirmation

Project Purpose

The purpose of this project is not to recreate Epic Cadence.

Instead, the project demonstrates how a healthcare application analyst can approach a scheduling-related business problem by:

1. Understanding the business request
2. Identifying requirements and constraints
3. Modeling the proposed system
4. Translating business rules into application logic
5. Building a functional prototype
6. Testing whether the solution satisfies the requirements
7. Documenting and presenting the proposed solution

Disclaimer

This is an independent educational and portfolio project inspired by general healthcare scheduling and systems-analysis concepts.

It is not an Epic Systems product, is not connected to Epic software, and uses only fictional/simulated information.