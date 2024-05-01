const date = new Date();

const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div>${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
  }

  monthDays.innerHTML = days; // Moved this line outside the loop to prevent overwriting

  // Add event listener to the form for submitting event data
  const eventForm = document.getElementById("eventForm");
  eventForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Debugging: Log form data to console
    console.log("Form Data:", formData);

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
      renderCalendar();
    })
    .catch(error => console.error("Error:", error));
  });
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

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
