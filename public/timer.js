/**
 *
 * Gets saved time from server to continue timing where left off.
 */
window.onload = function () {
  // Declaring Time Display and Play/Pause Button
  output = document.getElementById("out");
  playpause = document.getElementById("play");
  count = 0;

  // Declaring Picture-in-Picture elements
  pipOut = document.getElementById("picture-in-picture-out");
  pipPlayPause = document.getElementById("picture-in-picture-play-pause");

  // Generate Static Options
  showSubjectOptions();
  showTagOptions();
  displayPreviousEntries();

  output.innerHTML = "00:00:00";
  pipOut.innerHTML = "00:00:00";
};

/**
 *
 * @returns notify user that if they proceed, time entry data may be lost.
 */
window.onbeforeunload = function () {
  if (count > 0) {
    return "unsaved time entry";
  }
};

/**
 *
 * @returns saves time entry when page is unloaded
 */
window.onunload = function () {
  if (count > 0) {
    stopTimer();
  }
  return "saved";
};

/**
 *
 * @param {String} id DOM ID of Div to toggle
 */
function toggleDiv(id) {
  if (id == "new-subject-menu") {
    if (document.getElementById("subject").value == "new") {
      let div = document.getElementById(id);
      div.style.display = div.style.display == "none" ? "block" : "none";
    }
  } else if (id == "new-assignment-menu") {
    if (document.getElementById("assignment").value == "new") {
      let div = document.getElementById(id);
      div.style.display = div.style.display == "none" ? "block" : "none";
    }
  } else if (id == "new-tag-menu") {
    if (document.getElementById("tag").value == "new") {
      let div = document.getElementById(id);
      div.style.display = div.style.display == "none" ? "block" : "none";
    }
  } else {
    let div = document.getElementById(id);
    div.style.display = div.style.display == "none" ? "block" : "none";
  }
}

/**
 * @async
 * @returns Time counting up displayed in 'output' element
 */
async function startTimer() {
  // Get values of entry name, subject, and assignment for validation
  let name = document.getElementById("timer").value;
  let subject = document.getElementById("subject").value;
  let assignment = document.getElementById("assignment").value;
  if (name != "" && subject != "subject" && assignment != "assignment") {
    let seconds = 0;
    if (timer) {
      clearInterval(timer);
      timer = null;

      // Change Timer Start button to a play symbol
      playpause.innerHTML =
        '<span class="material-symbols-outlined">play_arrow</span>';
      pipPlayPause.innerHTML =
        '<span class="material-symbols-outlined">play_arrow</span>';
      return;
    }

    // Change Timer Start button to a pause symbol
    playpause.innerHTML =
      '<span class="material-symbols-outlined">pause</span>';
    pipPlayPause.innerHTML =
      '<span class="material-symbols-outlined">pause</span>';

    timer = window.setInterval(function () {
      count++;
      seconds = count.toFixed(0);

      // Update document title to show current time
      document.title = `Verso - Timer (${convertSeconds(seconds)})`;

      // Update both outputs to show current time
      output.innerHTML = convertSeconds(seconds);
      pipOut.innerHTML = convertSeconds(seconds);
    }, 1000);
  } else {
    alert("Please ensure all fields are filled out");
  }
}

/**
 * Creates a new entry from input field data
 */
function stopTimer() {
  if (count > 0) {
    // Declaration of variables
    let name = document.getElementById("timer").value;
    let subject = document.getElementById("subject").value;
    let assignment = document.getElementById("assignment").value;
    let tag = document.getElementById("tag").value;
    let length = count.toFixed(0);

    // Converts entry length to be displayed to user
    let seconds = convertSeconds(length);

    // Reset Page Title.
    document.title = "Verso - Timer";

    // Format Time Data to save into json file
    const entryData = JSON.stringify({
      name: name,
      subject: subject,
      assignment: assignment,
      tag: tag,
      duration: length,
    });

    // Format Entry data to display to user
    const displayEntryData = JSON.stringify({
      name: name,
      subject: subject,
      assignment: assignment,
      tag: tag,
      duration: seconds,
    });

    // Send entry data to Server to save in json file
    fetch("/post/newEntry", {
      method: "POST",
      body: entryData,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    // Display user friendly formatted data
    displayEntry(displayEntryData);

    // Resets timer variable
    clearInterval(timer);

    // Reset timer for user
    count = 0;
    output.innerHTML = "00:00:00";
    pipOut.innerHTML = "00:00:00";

    // Set timer start button to Play Symbol
    playpause.innerHTML =
      '<span class="material-symbols-outlined">play_arrow</span>';
    pipPlayPause.innerHTML =
      '<span class="material-symbols-outlined">play_arrow</span>';

    timer = null;

    name = "";
    subject = "subject";
    assignment = "assignment";
    tag = "tag";
  } else {
    alert("Please begin an entry before ending one");
  }
}

/**
 *
 * @param {Number} duration Amount of time in Seconds
 * @returns {String} formatted to be displayed to user
 */
function convertSeconds(duration) {
  // Converts seconds to hours and minutes to display to user.
  var hours = Math.floor(duration / 3600);
  var minutes = Math.floor((duration % 3600) / 60);

  // Declaring Display Variables
  var hours_display = 0;
  var minutes_display = 0;
  var seconds_display = 0;

  // Set Display Variables
  hours_display = hours.toString().padStart(2, "0");
  minutes_display = minutes.toString().padStart(2, "0");
  seconds_display = (duration - minutes * 60 - hours * 3600)
    .toString()
    .padStart(2, "0");

  //Return formatted string
  return `${hours_display}:${minutes_display}:${seconds_display}`;
}

/**
 *
 * @param {JSON} entryDataJson JSON Object containing Data to be used in Entry being Displayed
 * @yields New entry is temporarily displayed to user
 *
 * Note: entryDataJson MUST contain name, subject, assignment, tag, and length data
 */
function displayEntry(entryDataJson) {
  let entryData = JSON.parse(entryDataJson);

  // Separating entry data
  const name = entryData.name;
  const subject = entryData.subject;
  const assignment = entryData.assignment;
  const tag = entryData.tag;
  const length = entryData.duration;

  // Displays new entry data on timer dashboard
  const entryDiv = document.getElementById("entry-display");
  const newEntry = document.createElement("p");
  const entryText = `${name} </br> <hr> Subject: ${subject} </br> Assignment: ${assignment} </br> Tags: ${tag} </br> Length: ${length}`;
  newEntry.innerHTML = entryText;
  newEntry.className = "entry-display-slave";
  newEntry.id = name;

  entryDiv.insertBefore(newEntry, entryDiv.childNodes[0]);
}

/**
 *
 * @yields Subject Options Displayed
 */
async function showSubjectOptions() {
  clearGeneratedOptions("created-subject");

  //Get list of subjects from Server
  const subjectSelector = document.getElementById("subject");
  const response = await fetch(`/get/subjects`);
  const subjectList = await response.json();

  // create option for each subject and add it to option menu
  for (i = 0; i < subjectList.length; i++) {
    let newOption = document.createElement("option");
    newOption.value = subjectList[i];
    newOption.innerText = subjectList[i];
    newOption.className = "created-subject";
    subjectSelector.appendChild(newOption);
  }

  // create "New option" option
  let newSubjectOption = document.createElement("option");
  newSubjectOption.value = "new";
  newSubjectOption.innerText = "+";
  newSubjectOption.className = "created-subject";
  subjectSelector.appendChild(newSubjectOption);
}

/**
 *
 * @async
 * @yields Tag Options Displayed
 */
async function showTagOptions() {
  clearGeneratedOptions("created-tag");

  // Get list of tags from server
  const tagSelector = document.getElementById("tag");
  const response = await fetch(`/get/tags`);
  const tagList = await response.json();

  // Create options for each tag and display it to user
  for (i = 0; i < tagList.length; i++) {
    let newOption = document.createElement("option");
    newOption.value = tagList[i];
    newOption.innerText = tagList[i];
    newOption.className = "created-tag";
    tagSelector.appendChild(newOption);
  }
  // Generating New Assignment Option
  let newTagOption = document.createElement("option");
  newTagOption.value = "new";
  newTagOption.innerText = "+";
  newTagOption.className = "created-tag";
  tagSelector.appendChild(newTagOption);
}

/**
 *
 * @async
 * @yields Assignment Options Displayed
 */
async function showAssignmentOptions() {
  // Clear any previously generated options
  clearGeneratedOptions("created-assignment");

  const assignmentSelector = document.getElementById("assignment");
  const subjectSelector = document.getElementById("subject");

  // Get list of assignments from selected subject from server
  const response = await fetch(`/get/assignments/${subjectSelector.value}`);
  const assignmentList = await response.json();

  // generate option for each assignment
  for (i = 0; i < assignmentList.length; i++) {
    let newOption = document.createElement("option");
    newOption.value = assignmentList[i];
    newOption.innerText = assignmentList[i];
    newOption.className = "created-assignment";
    assignmentSelector.appendChild(newOption);
  }
  // Generating New Assignment Option
  let newAssignmentOption = document.createElement("option");
  newAssignmentOption.value = "new";
  newAssignmentOption.innerText = "+";
  newAssignmentOption.className = "created-assignment";
  assignmentSelector.appendChild(newAssignmentOption);
}

/**
 *
 * @yields Removes any option with Class Name of 'created'
 */
function clearGeneratedOptions(className) {
  // clear any existing options that have been generated by program
  let generatedOptionsList = document.getElementsByClassName(className);

  while (generatedOptionsList.length > 0) {
    generatedOptionsList[0].remove();
  }
}

/**
 *
 * @yields new subject data saved to server-side JSON file
 */
function newSubject() {
  let subjectName = document.getElementById("new-subject-name").value;
  let subjectColour = document.getElementById("new-subject-colour").value;

  let newSubjectData = {
    name: subjectName,
    colour: subjectColour,
  };

  fetch("/post/newSubject", {
    method: "POST",
    body: JSON.stringify(newSubjectData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  subjectName = "";
  subjectColour = "";
  toggleDiv("new-subject-menu");

  showSubjectOptions();

  document.getElementById("subject").value = "subject";
}

/**
 *
 * @yields new tag data saved to server-side JSON file
 */
function newTag() {
  let tagName = document.getElementById("new-tag-name").value;
  let tagColour = document.getElementById("new-tag-colour").value;

  let newTagData = {
    name: tagName,
    colour: tagColour,
  };

  console.log(newTagData);

  fetch("/post/newTag", {
    method: "POST",
    body: JSON.stringify(newTagData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  tagName = "";
  tagColour = "";
  toggleDiv("new-tag-menu");

  showTagOptions();

  document.getElementById("tag").value = "tag";
}

/**
 *
 * @yields new assignment data saved to server-side JSON file
 */
function newAssignment() {
  let assignmentName = document.getElementById("new-assignment-name").value;
  let assignmentColour = document.getElementById("new-assignment-colour").value;
  const subject = document.getElementById("subject").value;

  console.log(assignmentName, assignmentColour, subject);

  let newAssignmentData = {
    name: assignmentName,
    colour: assignmentColour,
    subject: subject,
  };

  fetch("/post/newAssignment", {
    method: "POST",
    body: JSON.stringify(newAssignmentData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  assignmentName = "";
  assignmentColour = "";
  toggleDiv("new-assignment-menu");

  showAssignmentOptions();

  document.getElementById("assignment").value = "assignment";
}

/**
 *
 * @returns picture in picture window created
 */
async function togglePictureInPicture() {
  // Early return if there's already a Picture-in-Picture window open.
  if (window.documentPictureInPicture.window) {
    return;
  }

  // Open a Picture-in-Picture window.
  const pipWindow = await window.documentPictureInPicture.requestWindow({
    width: 10,
    height: 12,
  });

  // Move the timer to the Picture-in-Picture window.
  document.getElementById("timer-picture-in-picture").style.display = "block";
  pipWindow.document.body.append(
    document.getElementById("timer-picture-in-picture")
  );

  // Set styling for Picture-in-Picture window.
  const cssLink = document.createElement("link");
  const materialSymbols = document.createElement("link");

  materialSymbols.rel = "stylesheet";
  materialSymbols.href =
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";

  cssLink.rel = "stylesheet";
  cssLink.href = "/pip-styles";

  pipWindow.document.head.appendChild(cssLink);
  pipWindow.document.head.appendChild(materialSymbols);

  // Set Picture-in-Picture buttons to control timer
  pipWindow.document
    .getElementById("picture-in-picture-play-pause")
    .addEventListener("click", (event) => {
      startTimer();
    });
  pipWindow.document
    .getElementById("picture-in-picture-stop")
    .addEventListener("click", (event) => {
      stopTimer();
    });

  pipWindow.addEventListener("unload", (event) => {
    document.body.append(
      pipWindow.document.getElementById("timer-picture-in-picture")
    );
    document.getElementById("timer-picture-in-picture").style.display = "none";
  });
}
