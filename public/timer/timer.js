window.onload = function() {
  output = document.getElementById('out');
  playpause = document.getElementById('play');

  timer;
  count = 0;
}

function startTimer(){
  let seconds = 0;
    if (timer) {
        clearInterval(timer);
        timer = null;
        playpause.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
        return;
    }
    playpause.innerHTML = '<span class="material-symbols-outlined">pause</span>';
    timer = window.setInterval(function(){
        count++;
        seconds = count.toFixed(0);
        document.title = `Verso - Timer (${convertSeconds(seconds)})`;
        output.innerHTML = convertSeconds(seconds);
    }, 1000);
};


function stopTimer(){
    let name = document.getElementById('timer').value;
    let assignment = document.getElementById('assignment').value;
    let subject = document.getElementById('subject').value;
    let length = (count).toFixed(0);
    let seconds = convertSeconds(length);

    document.title = 'Verso - Timer';
    
    // Data Validation:
    if (name == ''){
      alert("Please name this time entry");
    }
    else if (subject == ''){
      alert("Please set a subject for this time entry");
    }
    else if (assignment == ''){
      alert("Please set an assignment for this time entry");
    }

    else{
      // Saving entry data to database
      saveEntry(name, subject, assignment, length);

      // Display new entry on timer dashboard
      displayEntry(name, subject, assignment, seconds);

      // Reset timer
      clearInterval(timer);

      count = 0;
      output.innerHTML = "00:00:00";
      timer = null;
      playpause.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';

      document.getElementById('timer').value = '';
      document.getElementById('assignment').value = '';
      document.getElementById('subject').value = '';
      return;
    }
};

function convertSeconds(seconds){
  // Converts seconds to hours and minutes to display to user.
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor(seconds % 3600 / 60);

  var hours_display = 0;
  var minutes_display = 0;
  var seconds_display = 0;

    hours_display = hours.toString().padStart(2,"0");
  
    minutes_display = minutes.toString().padStart(2,"0");

    seconds_display = (seconds-(minutes*60)-(hours*3600)).toString().padStart(2,"0");

  return `${hours_display}:${minutes_display}:${seconds_display}`
}

function saveEntry(name, subject, assignment, length=0){
  //Sends entry data to server to save to database
  fetch(`http://localhost:2000/post/entries/${name}/${subject}/${assignment}/${length}`)
    .then((response) => (response.json()))
    .then((json) => console.log(json));
}

function displayEntry(name, subject, assignment, length){
  // Displays new entry data on timer dashboard
  const entryDiv = document.getElementById('entry-display');
  const newEntry = document.createElement('p');
  const entryText = `${name} </br> <hr> Subject: ${subject} </br> Assignment: ${assignment} </br> Length: ${length}`;
  newEntry.innerHTML = entryText;
  newEntry.className = 'entry-display-slave';
  newEntry.id = name;

  entryDiv.appendChild(newEntry);
  return 200
}