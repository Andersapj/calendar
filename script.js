document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const monthAndYear = document.getElementById("monthyear");
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
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
  const submitButton = document.getElementById("submit");
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();

  // Retrieve session data
  const username = sessionStorage.getItem("username");
  const email = sessionStorage.getItem("email");

  if (username && email) {
    console.log(`Username: ${username}, Email: ${email}`);
    // You can use the retrieved data as needed
  } else {
    // Redirect to login page if session data is not available
    window.location.href = "login.html";
  }

  function renderCalendar() {
    calendar.innerHTML = "";
    monthAndYear.innerHTML = "";

    // Create month and year header
    const header = document.createElement("div");
    header.classList.add("buttons");
    header.textContent = `${year} - ${monthNames[month]}`;
    monthAndYear.appendChild(header);

    // Create header
    daysOfWeek.forEach((day) => {
      const headerCell = document.createElement("div");
      headerCell.classList.add("header");
      headerCell.textContent = day;
      calendar.appendChild(headerCell);
    });

    // Get first day of the month
    const firstDay = new Date(year, month, 1).getDay();

    // Get number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill in the days
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("empty");
      calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement("div");
      dayCell.classList.add("day");
      dayCell.textContent = day;
      dayCell.addEventListener("click", () => {
        document.querySelectorAll(".day");
        dayCell.classList.toggle("selected");
      });
      calendar.appendChild(dayCell);
    }

    // Fill in the empty cells for the days after the last day of the month
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("empty");
        calendar.appendChild(emptyCell);
      }
    }
  }

  // Initial render
  renderCalendar();

  // Handle previous button click
  prevButton.addEventListener("click", () => {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    renderCalendar();
  });

  // Handle next button click
  nextButton.addEventListener("click", () => {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    renderCalendar();
  });

  // handle submit button click
  submitButton.addEventListener("click", () => {
    const selectedDays = [];
    document.querySelectorAll(".day.selected").forEach((day) => {
      const dayNumber = day.textContent;
      const formattedDate = `${dayNumber}-${month + 1}-${year}`;
      selectedDays.push(formattedDate);
    });
    console.log(selectedDays);
    submitbox.style.display = "block";
    const span = document.getElementsByClassName("close")[0];
    const modalText = document.getElementById("modaltext");
    modalText.textContent = `You have selected ${selectedDays} days. Do you want to submit?`;
    span.onclick = function () {
      submitbox.style.display = "none";
    };
    const submitmodal = document.getElementById("submit-modal");
    submitmodal.onclick = function () {
      window.location.href = "confirmation.html";
    };

    // Send selected days to the server
    fetch("http://localhost:3000/api/selected-days", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, selectedDays }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  const span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    submitbox.style.display = "none";
  };
});
