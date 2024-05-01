document.addEventListener("DOMContentLoaded", function () {
  const monthYearElement = document.querySelector(".date h1");
  const daysElement = document.querySelector(".days");
  const eventForm = document.getElementById("eventForm");
  const eventNameInput = eventForm.querySelector("input[name='eventName']");
  const eventDateInput = eventForm.querySelector("input[name='eventDate']");
  const eventDescriptionInput = eventForm.querySelector("textarea[name='eventDescription']");
  const addEventBtn = document.getElementById("addEventBtn");

  let currentDate = new Date();
  let selectedDate = null;

  // Function to update the calendar with the specified month and year
  function updateCalendar(month, year) {
    currentDate = new Date(year, month, 1);
    monthYearElement.textContent = `${getMonthName(month)} ${year}`;
    daysElement.innerHTML = "";

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    // Add empty placeholders for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("prev-date");
      daysElement.appendChild(dayElement);
    }

    // Add days of the month
    for (let i = 1; i <= numDaysInMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.textContent = i;
      dayElement.addEventListener("click", () => {
        selectedDate = new Date(year, month, i);
        eventDateInput.value = formatDate(selectedDate);
        eventForm.style.display = "block";
      });
      if (selectedDate && selectedDate.getDate() === i) {
        dayElement.classList.add("today");
      }
      daysElement.appendChild(dayElement);
    }

    // Add empty placeholders for days after the last day of the month
    const numPlaceholders = 7 - (daysElement.children.length % 7);
    for (let i = 0; i < numPlaceholders; i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("next-date");
      daysElement.appendChild(dayElement);
    }
  }

  // Function to get the name of the month
  function getMonthName(month) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month];
  }

  // Function to format date as YYYY-MM-DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Initial calendar render
  updateCalendar(currentDate.getMonth(), currentDate.getFullYear());

  // Event listener for next month
  document.querySelector(".next").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar(currentDate.getMonth(), currentDate.getFullYear());
  });

  // Event listener for previous month
  document.querySelector(".prev").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar(currentDate.getMonth(), currentDate.getFullYear());
  });

  // Event listener for form submission (just for demonstration)
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Event Name:", eventNameInput.value);
    console.log("Event Date:", eventDateInput.value);
    console.log("Event Description:", eventDescriptionInput.value);
    // You can add your logic to handle the form submission here
    eventForm.style.display = "none"; // Hide the form after submission

    const formData = new FormData(eventForm);

    // Generate ICS file
    generateICSFile(formData);

    // Write form data to file
    writeFormDataToFile(formData);

    fetch("add_event.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the response from the server
      // Optionally, update the calendar after adding the event
      updateCalendar(currentDate.getMonth(), currentDate.getFullYear());
    })
    .catch(error => console.error("Error:", error));
  });

  // Event listener for Add Event button
  addEventBtn.addEventListener("click", () => {
    eventForm.style.display = "block";
  });
});

// Function to generate ICS file
function generateICSFile(formData) {
  const eventName = formData.get("eventName");
  const eventDate = formData.get("eventDate");
  const eventDescription = formData.get("eventDescription");

  const formattedEventDate = new Date(eventDate);
  const year = formattedEventDate.getFullYear();
  const month = (formattedEventDate.getMonth() + 1).toString().padStart(2, "0");
  const day = formattedEventDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}${month}${day}`;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventName}
DESCRIPTION:${eventDescription}
DTSTART;VALUE=DATE:${formattedDate}
DTEND;VALUE=DATE:${formattedDate}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "event.ics";
  downloadLink.click();
}

// Function to write form data to a text file
function writeFormDataToFile(formData) {
  const entries = [...formData.entries()];
  const formattedData = entries.map(([key, value]) => `${key}: ${value}`).join("\n");

  // Debugging: Log formatted data to console
  console.log("Formatted Form Data:", formattedData);

  // Write data to file using fetch
  fetch("write_to_file.php", {
    method: "POST",
    body: formattedData
  })
  .then(response => response.text())
  .then(data => console.log("Data written to file:", data))
  .catch(error => console.error("Error writing to file:", error));
}
