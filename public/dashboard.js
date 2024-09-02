/**
 *
 * Generates Subject Dashboard as Default Dashboard
 */
window.onload = function () {
  generateDashboard("subject");
};

/**
 *
 * @param {String} id DOM ID of Div to toggle
 */
function toggleDiv(id) {
  let div = document.getElementById(id);
  div.style.display = div.style.display == "none" ? "block" : "none";
}

/**
 *
 * @param {Number} duration Amount of time in seconds
 * @returns {String} formatted to be displayed to user
 */
function convertSeconds(duration) {
  // Variable declarations
  let hours = Math.floor(duration / 3600);
  let minutes = Math.floor((duration % 3600) / 60);
  let seconds = duration - minutes * 60 - hours * 3600;
  let hours_display = 0;
  let minutes_display = 0;
  let seconds_display = 0;
  let output = "";

  // Convert times into string for formatting
  hours_display = hours.toString();
  minutes_display = minutes.toString();
  seconds_display = (duration - minutes * 60 - hours * 3600).toString();

  // Check if total time will look ugly with mins and secs
  // Check if total time is not 0
  if (duration == 0) {
    output = "0secs";
  } else if (hours > 100) {
    output = hours_display + "hrs";
  }
  // Reformat total time if above conditions are not met
  else {
    if (hours > 0) {
      output += hours_display + "hrs ";
    }
    if (minutes > 0) {
      output += minutes_display + "mins ";
    }
    if (seconds > 0 && seconds >= 10) {
      output += seconds_display + "secs ";
    }
  }
  return output;
}

async function dashboardFilter() {
  const filterSelector = document.getElementById("dashboard-filter");
  if (filterSelector.value == "Subject") {
    filterSelector.value = "Dashboard Filter";
    generateDashboard("subject");
    filterSelected();
  }
  if (filterSelector.value == "Assignment") {
    clearOptions("generated-option");

    let subjectChoice = document.getElementById("subject-choice");

    const response = await fetch("/get/subjects");
    const subjects = await response.json();

    subjectChoice.style.display = "block";
    document.getElementById("filter-master").style.marginLeft = "42.5%";

    for (let i = 0; i < subjects.length; i++) {
      let subject = subjects[i];

      let newSubjectChoice = document.createElement("option");
      newSubjectChoice.innerText = subject;
      newSubjectChoice.value = subject;
      newSubjectChoice.className = "generated-option";

      subjectChoice.appendChild(newSubjectChoice);
    }
  }
  if (filterSelector.value == "Tag") {
    filterSelector.value = "Dashboard Filter";
    generateDashboard("tag");
    filterSelected();
  }
}

/**
 *
 * @yields Removes any option tag with class 'generated-option'
 */
function clearOptions(generatedClass) {
  let options = document.getElementsByClassName(generatedClass);

  while (options.length > 0) {
    options[0].remove();
  }
}

function filterSelected() {
  let subjectChoice = document.getElementById("subject-choice");
  let dashboardSelector = document.getElementById("dashboard-filter");

  if (dashboardSelector.value == "Assignment") {
    generateDashboard("assignment", subjectChoice.value);
    subjectChoice.value = "Choose a Subject";
  }
  subjectChoice.style.display = "none";
  dashboardSelector.value = "Dashboard Filter";
  document.getElementById("filter-master").style.marginLeft = "50%";
}

/**
 *
 * @returns Blank Dashboard with required DOM Elements regenerated
 */
function clearDashboard() {
  let body = document.body;

  let oldDashboardMaster = document.getElementById("dashboard-master");
  oldDashboardMaster.remove();

  let oldGraphMaster = document.getElementById("graph-master");
  oldGraphMaster.remove();

  let oldGoalMaster = document.getElementById("goal-master");
  oldGoalMaster.remove();

  let oldGoalTitle = document.getElementById("goal-title");
  oldGoalTitle.remove();

  let oldGoalOptions = document.getElementById("goal-options");
  oldGoalOptions.remove();

  let newDashboardMaster = document.createElement("div");
  newDashboardMaster.id = "dashboard-master";
  newDashboardMaster.className = "dashboard-master";

  let newGraphMaster = document.createElement("div");
  newGraphMaster.id = "graph-master";
  newGraphMaster.className = "graph-master";

  let newGraphLeftMaster = document.createElement("div");
  newGraphLeftMaster.id = "graph-left-master";
  newGraphLeftMaster.className = "graph-slave";

  let leftGraphTitle = document.createElement("p");
  leftGraphTitle.className = "dashboard-slave-title-text";
  leftGraphTitle.id = "graph-left-title";
  leftGraphTitle.style.color = "#4B4237";
  newGraphLeftMaster.appendChild(leftGraphTitle);

  let newGraphLeft = document.createElement("canvas");
  newGraphLeft.id = "graph-left";

  let newGraphRightMaster = document.createElement("div");
  newGraphRightMaster.id = "graph-right-master";
  newGraphRightMaster.className = "graph-slave";

  let rightGraphTitle = document.createElement("p");
  rightGraphTitle.className = "dashboard-slave-title-text";
  rightGraphTitle.id = "graph-right-title";
  rightGraphTitle.style.color = "#4B4237";
  newGraphRightMaster.appendChild(rightGraphTitle);

  let newGraphRight = document.createElement("canvas");
  newGraphRight.id = "graph-right";

  let newGoalMaster = document.createElement("div");
  newGoalMaster.id = "goal-master";
  newGoalMaster.className = "goal-master";
  newGoalMaster.style.display = "none";

  let newGoalOptions = document.createElement("div");
  newGoalOptions.id = "goal-options";
  newGoalOptions.className = "goal-options";
  newGoalOptions.style.display = "none";

  let newGoalOption = document.createElement("button");
  newGoalOption.id = "new-goal";
  newGoalOption.className = "goal-menu-option";
  newGoalOption.innerHTML = "New Goal";
  newGoalOption.onclick = function () {
    showNewGoalOptions("new-goal-select");
    document.getElementById("remove-goal-menu").style.display = "none";
    document.getElementById("edit-goal-menu").style.display = "none";
    toggleDiv("new-goal-menu");
  };

  let editGoalOption = document.createElement("button");
  editGoalOption.id = "edit-goal";
  editGoalOption.className = "goal-menu-option";
  editGoalOption.innerHTML = "Edit Goal";
  editGoalOption.onclick = function () {
    showGoalOptions("edit-goal-select");
    document.getElementById("remove-goal-menu").style.display = "none";
    document.getElementById("new-goal-menu").style.display = "none";
    toggleDiv("edit-goal-menu");
  };

  let removeGoalOption = document.createElement("button");
  removeGoalOption.id = "remove-goal";
  removeGoalOption.className = "goal-menu-option";
  removeGoalOption.innerHTML = "Remove Goal";
  removeGoalOption.onclick = function () {
    showGoalOptions("remove-goal-select");
    document.getElementById("edit-goal-menu").style.display = "none";
    document.getElementById("new-goal-menu").style.display = "none";
    toggleDiv("remove-goal-menu");
  };

  let newGoalTitle = document.createElement("div");
  newGoalTitle.id = "goal-title";
  newGoalTitle.className = "goal-heading";
  newGoalTitle.innerHTML = "Goals";
  newGoalTitle.style.display = "none";

  body.appendChild(newDashboardMaster);
  body.appendChild(newGraphMaster);
  body.appendChild(newGoalTitle);
  body.appendChild(newGoalOptions);
  body.appendChild(newGoalMaster);

  newGoalOptions.appendChild(newGoalOption);
  newGoalOptions.appendChild(editGoalOption);
  newGoalOptions.appendChild(removeGoalOption);

  newGraphLeftMaster.appendChild(newGraphLeft);
  newGraphRightMaster.appendChild(newGraphRight);

  newGraphMaster.appendChild(newGraphLeftMaster);
  newGraphMaster.appendChild(newGraphRightMaster);
}

/**
 *
 * @param {String} title String indicating the Graph Title
 * @param {Array} labels Array containing subject/tag/assignment names
 * @param {Array} times Array containing times for each subject/tag/assignment (should be ordered to match labels)
 * @param {Number} totalTime Total of Times used to calculate percentage values
 * @param {String} graphID DOM ID for graph to be generated from
 * @returns Chart.JS doughnut chart
 */
function generateGraph(title, colours, labels, times, totalTime, graphID) {
  const graph = document.getElementById(graphID + "-title");
  graph.innerHTML = title;

  let timeDisplay = [];

  for (i = 0; i < times.length; i++) {
    let currentTime = ((times[i] / totalTime) * 100).toFixed();
    timeDisplay.push(currentTime);
  }

  new Chart(graphID, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          backgroundColor: colours,
          data: timeDisplay,
        },
      ],
    },
    options: {
      legend: false,
    },
  });
}

/**
 *
 * @param {String} type String indicating type of dashboard to generate
 * @param {String} subject Optional parameter used to specify a subject for an assignment dashboard
 *
 * Generates a Dashboard of given type with data from entries.json
 */
async function generateDashboard(type, subject = "") {
  // Resets previous dashboard
  clearDashboard();

  let dashboardMaster = document.getElementById("dashboard-master");

  // List of times for totals Doughnut Chart
  let timesList = [];
  let totalTime = 0;

  let displayGoalsBool = false;

  // Declaring Request Addresses
  let requestAddress = "";
  let timeRequestAddress = "";
  let colourRequestAddress = "";

  if (type == "subject") {
    // If subject dashboard, use subject specific data for subject dashboard
    document.title = "Verso - Subject Dashboard";
    document.getElementById("header").innerText = "Dashboard - Subject";
    requestAddress = "/get/subjects";
    timeRequestAddress = "/get/times/subject";
    colourRequestAddress = "/get/subjects/colours";
    leftGraphTitle = "Total time breakdown by subject (%)";
    displayGoalsBool = true;
  } else if (type == "assignment") {
    // If assignment dashboard, use assignment specific data for assignment dashboard
    document.title = "Verso - Assignment Dashboard";
    document.getElementById("header").innerText = `Dashboard - ${subject}`;
    requestAddress = "/get/assignments/" + subject;
    timeRequestAddress = "/get/times/assignment/" + subject;
    colourRequestAddress = "/get/assignments/colours/" + subject;
    leftGraphTitle = `Total time breakdown by assignment for ${subject} (%)`;
  } else if (type == "tag") {
    // If tag dashboard, use tag specific data for tag dashboard
    document.title = "Verso - Tag Dashboard";
    document.getElementById("header").innerText = "Dashboard - Tag";
    requestAddress = "/get/tags";
    timeRequestAddress = "/get/times/tag";
    colourRequestAddress = "/get/tags/colours";
    leftGraphTitle = "Total time breakdown by tag (%)";
  } else {
    // If invalid dashboard, return error
    alert("Please select a valid dashboard type to generate");
    return false;
  }

  // Gets list of subjects from server
  const response = await fetch(requestAddress);
  const responseObj = await response.json();

  // Get list of dashboard colours
  const colourResponse = await fetch(colourRequestAddress);
  const colourResponseObj = await colourResponse.json();

  // Set width of dashboard cards to scale depending on number of cards
  let cardWidth = `${Math.floor(83 / (responseObj.length + 1))}%`;

  for (let i = 0; i < responseObj.length; i++) {
    let current = responseObj[i];

    // Gets time for current subject from server
    const currentTimeResponse = await fetch(timeRequestAddress + "/" + current);
    const currentTime = await currentTimeResponse.text();

    // Current Time Added to Times List for Graphs
    timesList.push(Number(currentTime));

    // Current Time Added to Total Time
    totalTime += Number(currentTime);

    // Creates Time Card for current subject
    let newCard = document.createElement("div");
    newCard.id = current;
    newCard.className = "dashboard-slave";
    newCard.style.backgroundColor = colourResponseObj[i];
    newCard.style.width = cardWidth;

    // Creates title for current subject card
    let newCardName = document.createElement("p");
    newCardName.innerText = current;
    newCardName.className = "dashboard-slave-title-text";

    // Creates total for current subject card
    let newCardTotal = document.createElement("h3");
    newCardTotal.style.fontWeight = 800;
    newCardTotal.className = "dashboard-slave-total-text";
    newCardTotal.innerText = convertSeconds(currentTime);

    // Displays current subject card
    dashboardMaster.appendChild(newCard);
    newCard.appendChild(newCardName);
    newCard.appendChild(newCardTotal);
  }

  // Total Card is made
  let totalCard = document.createElement("div");
  totalCard.id = "total";
  totalCard.className = "dashboard-slave";
  totalCard.style.backgroundColor = "#EDE7D9";
  totalCard.style.color = "#4B4237";
  totalCard.style.width = cardWidth;

  // Creates title for current subject card
  let totalCardName = document.createElement("p");
  totalCardName.innerText = "Total";
  totalCardName.className = "dashboard-slave-title-text";

  // Creates total for current subject card
  let totalCardTotal = document.createElement("h3");
  totalCardTotal.style.fontWeight = 800;
  totalCardTotal.className = "dashboard-slave-total-text";
  totalCardTotal.innerText = convertSeconds(totalTime);

  // Displays current subject card
  dashboardMaster.appendChild(totalCard);
  totalCard.appendChild(totalCardName);
  totalCard.appendChild(totalCardTotal);

  // Resets Filter Div
  toggleDiv("filter-master");

  // Generate left graph
  generateGraph(
    leftGraphTitle,
    colourResponseObj,
    responseObj,
    timesList,
    totalTime,
    "graph-left"
  );
  generateGoalsGraph("graph-right");

  if (displayGoalsBool == true) {
    // If subject dashboard, display goals
    displayGoals();
    toggleDiv("goal-master");
    toggleDiv("goal-options");
    toggleDiv("goal-title");
  }
}

async function displayGoals() {
  // Get list of goals from server
  const goalsResponse = await fetch("/get/goalsDict");
  const goalsResponseObj = await goalsResponse.json();

  // Get total time for goals from server
  const goalsTotalResponse = await fetch("/get/goalsTotal");
  const goalsTotalResponseObj = await goalsTotalResponse.text();

  // Declare goal div
  const goalMaster = document.getElementById("goal-master");

  // Set width of dashboard cards to scale depending on number of cards
  let cardWidth = `${Math.floor(83 / (goalsResponseObj.length + 1))}%`;

  for (let i = 0; i < goalsResponseObj.length; i++) {
    // Creates Time Card for current subject
    let newCard = document.createElement("div");
    newCard.id = `${goalsResponseObj[i].goalSubject} - Goal`;
    newCard.className = "dashboard-slave";
    newCard.style.backgroundColor = goalsResponseObj[i].goalColour;
    newCard.style.width = cardWidth;

    // Creates title for current subject card
    let newCardName = document.createElement("p");
    newCardName.innerText = "Goal for " + goalsResponseObj[i].goalSubject;
    newCardName.className = "dashboard-slave-title-text";

    // Creates total for current subject card
    let newCardTotal = document.createElement("h3");
    newCardTotal.style.fontWeight = 800;
    newCardTotal.className = "dashboard-slave-total-text";
    newCardTotal.innerText = convertSeconds(goalsResponseObj[i].goalDuration);

    // Displays current subject card
    goalMaster.appendChild(newCard);
    newCard.appendChild(newCardName);
    newCard.appendChild(newCardTotal);
  }
  // Total Card is made
  let totalCard = document.createElement("div");
  totalCard.id = "total";
  totalCard.className = "dashboard-slave";
  totalCard.style.backgroundColor = "#EDE7D9";
  totalCard.style.color = "#4B4237";
  totalCard.style.width = cardWidth

  // Creates title for current subject card
  let totalCardName = document.createElement("p");
  totalCardName.innerText = "Goals Total";
  totalCardName.className = "dashboard-slave-title-text";

  // Creates total for current subject card
  let totalCardTotal = document.createElement("h3");
  totalCardTotal.style.fontWeight = 800;
  totalCardTotal.className = "dashboard-slave-total-text";
  totalCardTotal.innerText = convertSeconds(Number(goalsTotalResponseObj));

  // Displays current subject card
  goalMaster.appendChild(totalCard);
  totalCard.appendChild(totalCardName);
  totalCard.appendChild(totalCardTotal);

  // Generate Bar Graph with Goals
  generateGoalsGraph("graph-right");
}

async function showNewGoalOptions(goalOptionMasterID) {
  clearOptions("generated-subject-options");

  // Gets list of subjects from server
  const response = await fetch("/get/subjects");
  const responseObj = await response.json();

  // Gets list of goals from server
  const goalsResponse = await fetch("/get/goalsDict");
  const goalsResponseObj = await goalsResponse.json();

  // Declares new goal option dropdown
  const goalOptionMaster = document.getElementById(goalOptionMasterID);

  // Appends each goal subject to goalsList
  let goalsList = [];
  for (let i = 0; i < goalsResponseObj.length; i++) {
    goalsList.push(goalsResponseObj[i].goalSubject);
  }

  // Creates new option for each subject without an existing goal
  for (let i = 0; i < responseObj.length; i++) {
    if (goalsList.includes(responseObj[i]) == false) {
      let newOption = document.createElement("option");
      newOption.value = responseObj[i];
      newOption.innerText = responseObj[i];
      newOption.className = "generated-subject-options";
      goalOptionMaster.appendChild(newOption);
    }
  }
}

async function showGoalOptions(goalOptionMasterID) {
  clearOptions("generated-goal-options");

  // Gets list of subjects from server
  const response = await fetch("/get/goalsDict");
  const responseObj = await response.json();

  // Declares new goal option dropdown
  const goalOptionMaster = document.getElementById(goalOptionMasterID);

  // Creates new option for each existing goal
  for (let i = 0; i < responseObj.length; i++) {
    let newOption = document.createElement("option");
    newOption.value = responseObj[i].goalSubject;
    newOption.innerText = responseObj[i].goalSubject;
    newOption.className = "generated-goal-options";
    goalOptionMaster.appendChild(newOption);
  }
}

async function createNewGoal() {
  // Declaring variables
  let subject = document.getElementById("new-goal-select").value;
  let duration = document.getElementById("new-goal-length").value;

  // Gets list of subjects from server
  const response = await fetch("/get/subjects");
  const responseObj = await response.json();

  // Gets index of user-specified subject
  const index = responseObj.indexOf(subject);

  // Gets list of subject colours
  const colourResponse = await fetch("/get/subjects/colours");
  const colourResponseObj = await colourResponse.json();

  // Sets new goal colour to subject's colour
  let colour = colourResponseObj[index];

  // Data validation
  // Check a goal subject has been selected
  if (subject == "none-selected"){
    alert("Please choose a subject to set a goal for");
  }
  // Check a set goal is less than 360 hours
  /*
    * 360 hours max set as universities recommend 10hrs per point
    * Each class typically has 15 points but set cap allows for 30 point classes
  */
  else if(Number(duration) > 360){
    alert("Goals must be set for less than 360 hours of study");
  }
  // Check goal duration has been set
  else if(Number(duration) < 1){
    alert("Goals must be set for more than an hour of study");
  }
  else{
    // Makes POST request to server to add goal 
    fetch("/post/newGoal", {
      method: "POST",
      body: JSON.stringify({
        subjectName: subject,
        goalDuration: duration,
        goalColour: colour,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }

  // Un-toggles goal menu
  toggleDiv("new-goal-menu");

  // Re displays updated goals
  clearGoals();
  displayGoals();

  // Clears goal menus
  document.getElementById("new-goal-select").value = "none-selected";
  document.getElementById("new-goal-length").value = "";
}

async function editGoal() {
  // Declaring Variables
  let subject = document.getElementById("edit-goal-select").value;
  let duration = document.getElementById("updated-goal-length").value;
  
  // Data validation
  // Check a goal subject has been selected
  if (subject == "none-selected"){
    alert("Please choose a subject to set a goal for");
  }
  // Check a set goal is less than 360 hours
  /*
    * 360 hours max set as universities recommend 10hrs per point
    * Each class typically has 15 points but set cap allows for 30 point classes
  */
  else if(Number(duration) > 360){
    alert("Please enter a goal duration less than 360 hours");
  }
  // Check goal duration has been set
  else if(Number(duration) < 1){
    alert("Goals must be set for more than an hour of study");
  }
  else{
    // Makes POST request to server to update user-specified goal
    fetch("/post/editGoal", {
      method: "POST",
      body: JSON.stringify({
        subjectName: subject,
        goalDuration: duration,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    // Un-toggles goal menu
    toggleDiv("edit-goal-menu");

    // Re displays updated goals
    clearGoals();
    displayGoals();

    // Clears goal menus
    document.getElementById("edit-goal-select").value = "none-selected";
    document.getElementById("updated-goal-length").value = "";
  }
}

function removeGoal() {
  // Declaring Subject
  let subject = document.getElementById("remove-goal-select").value;
  
  // Data validation
  // Check a goal subject has been selected
  if (subject == "none-selected"){
    alert("Please choose a subject to set a goal for");
  }
  else{
    // Makes POST request to server to remove user-specified goal
    fetch("/post/removeGoal", {
      method: "POST",
      body: JSON.stringify({
        subjectName: subject,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    // Un-toggles goal menu
    toggleDiv("new-goal-menu");

    // Re displays updated goals
    clearGoals();
    displayGoals();

    // Clears goal menu
    document.getElementById("remove-goal-select").value = "none-selected";
  }
}

function clearGoals() {
  // Declaring variables
  const goalMaster = document.getElementById("goal-master");
  const body = document.body;

  // Removes goals div
  goalMaster.remove();

  // Creates new goals div
  let newGoalMaster = document.createElement("div");
  newGoalMaster.id = "goal-master";
  newGoalMaster.className = "goal-master";

  // Appends new goals div to page
  body.appendChild(newGoalMaster);
}

async function generateGoalsGraph(ID) {
  // Declaring Graph 
  let graphTitle = document.getElementById(ID + "-title");
  let oldGraph = document.getElementById(ID);

  // Removes old graph
  oldGraph.remove();

  // Creates new canvas for graph
  let graph = document.createElement("canvas");
  graph.id = ID;

  // Appends new graph to goals Div
  document.getElementById(ID + "-master").appendChild(graph);

  graphTitle.innerText = "Progression towards subject goals (%)";

  // Gets goals data
  const goalsResponse = await fetch("/get/goalsDict");
  const goalsDict = await goalsResponse.json();

  // Declaring Variables
  let times = [];
  let timesDifference = [];
  let goalNames = [];
  let goalColours = [];
  let remainderColours = [];

  // Declaring Colours for remaining amount of time
  let remainderColourDict = {
    "#8A3324": "rgba(138, 51, 36, 0.25)",
    "#D5A021": "rgba(213, 160, 33, 0.25)",
    "#d15d24": "rgba(209, 93, 36, 0.25)",
    "#A49694": "rgba(164, 150, 148, 0.25)",
    "#181716": "rgba(24, 23, 22, 0.25)"
  };

  for (let i = 0; i < goalsDict.length; i++) {
    // Adds each goal name, colour, and remainder colour to respective list
    goalNames.push(goalsDict[i].goalSubject);
    goalColours.push(goalsDict[i].goalColour);
    remainderColours.push(remainderColourDict[goalsDict[i].goalColour]);

    // Gets list of subject times from server
    const subjectTimeResponse = await fetch(
      "/get/times/subject/" + goalsDict[i].goalSubject
    );
    const subjectTimeResponseObj = await subjectTimeResponse.text();

    // Gets progression towards subject goals and converts to %
    let fractionalDifference =
      Number(subjectTimeResponseObj) / Number(goalsDict[i].goalDuration);
    let percentageDifference = Math.round(fractionalDifference * 100);

    // If goal is accomplished, only display 100% completion
    if (percentageDifference < 100){
      times.push(percentageDifference);
    }
    else{
      times.push(100);
    }

    // If goal is accomplished, do not display remainder
    if ((100 - percentageDifference) > 0){
      timesDifference.push(100 - percentageDifference);
    }
    else{
      timesDifference.push(0);
    }
  }

  // Convert canvas to Chart.js Graph
  new Chart(ID, {
    type: "bar",
    data: {
      labels: goalNames,
      datasets: [
        {
          backgroundColor: goalColours,
          data: times,
        },
        {
          backgroundColor: remainderColours,
          data: timesDifference,
          borderWidth: 2,
          borderSkip: "middle",
          borderDash: true,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              max: 100,
              beginAtZero: true,
            },
            stacked: true,
          },
        ],
        xAxes: [
          {
            stacked: true,
          },
        ],
      },
    },
  });
}
