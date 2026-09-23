// Get all the elements we need from the page
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");

// Attendance goal
const maxCount = 50;

// Load saved data from localStorage (or start at 0 if nothing is saved)
let count = parseInt(localStorage.getItem("count")) || 0;
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0,
};
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

// Full team names for messages
const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

// Show saved data when the page first loads
updatePage();
if (count >= maxCount) {
  showCelebration();
}

// Run this code every time someone checks in
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Stop the page from refreshing

  // Get the name and team
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  // Increase the total count and the team count
  count++;
  teamCounts[team]++;

  // Add the attendee to the list
  attendees.push({ name: name, teamName: teamName });

  // Save everything so it stays after a refresh
  saveProgress();

  // Update the page
  updatePage();

  // Show a personalized greeting
  greeting.textContent = `🎉 Welcome, ${name} from ${teamName}!`;
  greeting.className = "success-message";
  greeting.style.display = "block";

  // Celebrate if we reached the goal
  if (count >= maxCount) {
    showCelebration();
  }

  // Clear the form for the next attendee
  form.reset();
});

// Update the count, progress bar, team counts, and attendee list
function updatePage() {
  attendeeCountSpan.textContent = count;

  let percentage = Math.round((count / maxCount) * 100);
  if (percentage > 100) {
    percentage = 100;
  }
  progressBar.style.width = `${percentage}%`;

  document.getElementById("waterCount").textContent = teamCounts.water;
  document.getElementById("zeroCount").textContent = teamCounts.zero;
  document.getElementById("powerCount").textContent = teamCounts.power;

  attendeeList.innerHTML = "";
  for (let i = 0; i < attendees.length; i++) {
    const item = document.createElement("li");
    item.innerHTML = `<span>${attendees[i].name}</span><span>${attendees[i].teamName}</span>`;
    attendeeList.appendChild(item);
  }
}

// Find the winning team and show a celebration message
function showCelebration() {
  let winner = "water";
  if (teamCounts.zero > teamCounts[winner]) {
    winner = "zero";
  }
  if (teamCounts.power > teamCounts[winner]) {
    winner = "power";
  }

  const celebration = document.getElementById("celebration");
  celebration.textContent = `🏆 Goal reached! ${teamNames[winner]} wins with ${teamCounts[winner]} attendees!`;
  celebration.style.display = "block";

  // Highlight the winning team's card
  document.querySelector(`.team-card.${winner}`).classList.add("winner");
}

// Save counts and attendees to localStorage
function saveProgress() {
  localStorage.setItem("count", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}
