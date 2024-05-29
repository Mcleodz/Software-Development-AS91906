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
    timer = setInterval(function(){
        count++;
        seconds = (count/100).toFixed(0);

        output.innerHTML = convertSeconds(seconds);
        playpause.innerHTML = '<span class="material-symbols-outlined">pause</span>';
    }, 10);
};

function stopTimer(){
    let name = document.getElementById('timer').value;
    let assignment = document.getElementById('assignment').value;
    let subject = document.getElementById('subject').value;
    let length = (count/100).toFixed(0);
    
    saveEntry(name, subject, assignment, length);
    displayEntry(name, subject, assignment, convertSeconds(length));
    clearInterval(timer);

    count = 0;
    output.innerHTML = "00:00:00";
    timer = null;
    playpause.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';

    document.getElementById('timer').value = '';
    document.getElementById('assignment').value = '';
    document.getElementById('subject').value = '';
    return;
};

function convertSeconds(seconds){
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

function saveEntry(name, subject, assignment, length){
  const entriesObj = window.localStorage;

  const entryData = {
    'subject' : subject,
    'assignment' : assignment,
    'length' : length
    }
  entriesObj.setItem(name, JSON.stringify(entryData));
  return 200
}

function displayEntry(name, subject, assignment, length){
  const entryDiv = document.getElementById('entry-display');
  const newEntry = document.createElement('p');
  const entryText = `${name} </br> <hr> Subject: ${subject} </br> Assignment: ${assignment} </br> Length: ${length}`;
  newEntry.innerHTML = entryText;
  newEntry.className = 'entry-display-slave';
  newEntry.id = name;

  entryDiv.appendChild(newEntry);
  return 200
}