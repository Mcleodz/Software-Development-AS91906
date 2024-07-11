window.onload = function() {
    displayGoals();
}

function toggleDiv(id) {
    let div = document.getElementById(id);
    toggleOtherDivs(id);
    div.style.display = div.style.display == "none" ? "block" : "none";
}

function toggleOtherDivs(id) {
    if(id == 'new-goal-master'){
        if(document.getElementById('remove-goal-master').style.display == "block"){
            document.getElementById('remove-goal-master').style.display = 'none';
        }
        else if(document.getElementById('edit-goal-master').style.display == "block"){
            document.getElementById('edit-goal-master').style.display = 'none';
        }
    }
    if(id == 'remove-goal-master'){
        if(document.getElementById('new-goal-master').style.display == "block"){
            document.getElementById('new-goal-master').style.display = 'none';
        }
        else if(document.getElementById('edit-goal-master').style.display == "block"){
            document.getElementById('edit-goal-master').style.display = 'none';
        }
    }
    if(id == 'edit-goal-master'){
        if(document.getElementById('remove-goal-master').style.display == "block"){
            document.getElementById('remove-goal-master').style.display = 'none';
        }
        else if(document.getElementById('new-goal-master').style.display == "block"){
            document.getElementById('new-goal-master').style.display = 'none';
        }
    }
}

function convertSeconds(duration){
    // Variable declarations
    let hours = Math.floor(duration / 3600);
    let minutes = Math.floor(duration % 3600 / 60);
    let seconds = duration-(minutes*60)-(hours*3600);
    let hours_display = 0;
    let minutes_display = 0;
    let seconds_display = 0;
    let output = "";
    
    // Convert times into string for formatting
    hours_display = hours.toString();
    minutes_display = minutes.toString();
    seconds_display = (duration-(minutes*60)-(hours*3600)).toString();

    // Check if total time will look ugly with mins and secs
    if (hours > 100){
        output = hours_display + "hrs "
    }
    // Check if total time is not 0
    else if (duration == ''){
        output = "0secs";
    }
    // Reformat total time if above conditions are not met
    else {
        if (hours > 0){
            output += (hours_display + "hrs ")
        }
        if (minutes > 0){
            output += (minutes_display + "mins ")
        }
        if (seconds > 0){
            output += (seconds_display + "secs ")
        }
    }
    return output;
}

async function displayGoals(){
    clearGoalDisplay();

    displaySubjectOptions();
    displayGoalOptions('edit');
    displayGoalOptions('remove');

    let goalMaster = document.getElementById("goal-master");

    let requestAddress = '';
    let timeRequestAddress = '';

    const colourDict = {
        "0" : "#8A3324",
        "1" : "#D5A021",
        "2" : "#d15d24",
        "3" : "#A49694",
        "total" : "#EDE7D9",
    }

    let goalsList = [];
    let totalGoalTime = 0

    requestAddress = "/get/goals/subjects";
    timeRequestAddress = "/get/times/goals/subjects";

    const response = await fetch(requestAddress);
    const responseObj = await response.json();

    for (i=0; i < responseObj.length; i++){
        let current = responseObj[i];
        
        // Gets time for current subject from server
        const currentTimeResponse = await fetch(timeRequestAddress + "/" + current);
        const currentTime = await currentTimeResponse.text();

        // Creates Time Card for current subject
        let newGoalCard = document.createElement('div');
        newGoalCard.id = current + "-goal";
        newGoalCard.className = 'goal-slave';
        newGoalCard.style.backgroundColor = colourDict[i];

        // Creates title for current subject card
        let newGoalCardName = document.createElement('p');
        newGoalCardName.innerText = "Goal for " + current;
        newGoalCardName.className = 'dashboard-slave-title-text';

        // Creates total for current subject card
        let newGoalCardTime = document.createElement('h3');
        newGoalCardTime.style.fontWeight = 800;
        newGoalCardTime.className = 'dashboard-slave-total-text';
        newGoalCardTime.innerText = convertSeconds(currentTime);

        // Displays current subject card
        goalMaster.appendChild(newGoalCard);
        newGoalCard.appendChild(newGoalCardName);
        newGoalCard.appendChild(newGoalCardTime);

        goalsList.push(currentTime);
        totalGoalTime += Number(currentTime)
    }

    let newGoalTotalCard = document.createElement('div');
    newGoalTotalCard.id = "total-goal";
    newGoalTotalCard.className = 'goal-slave';
    newGoalTotalCard.style.backgroundColor = colourDict.total;
    newGoalTotalCard.style.color = "#4B4237";

    // Creates title for current subject card
    let newGoalTotalCardName = document.createElement('p');
    newGoalTotalCardName.innerText = "Goals Total";
    newGoalTotalCardName.className = 'dashboard-slave-title-text';

    // Creates total for current subject card
    let newGoalTotalCardTime = document.createElement('h3');
    newGoalTotalCardTime.style.fontWeight = 800;
    newGoalTotalCardTime.className = 'dashboard-slave-total-text';
    newGoalTotalCardTime.innerText = convertSeconds(totalGoalTime);

    // Displays current subject card
    goalMaster.appendChild(newGoalTotalCard);
    newGoalTotalCard.appendChild(newGoalTotalCardName);
    newGoalTotalCard.appendChild(newGoalTotalCardTime);

    return goalsList;
}

async function displaySubjectOptions(){
    clearOption();

    const subjectList = await fetch('/get/subjects');
    const subjectListObj = await subjectList.json();

    for (i=0; i < subjectListObj.length; i++){
        let newOption = document.createElement('option');
        newOption.id = subjectListObj[i];
        newOption.className = 'option';
        newOption.value = subjectListObj[i];
        newOption.innerText = subjectListObj[i];
        document.getElementById('new-goal-list').appendChild(newOption)
    }
}

async function displayGoalOptions(type){
    const goals = await fetch('/get/goals/subjects');
    const goalsObj = await goals.json();

    let master = '';

    if(type == 'edit'){
        master = document.getElementById('edit-goal-list');
    }

    else if(type == 'remove'){
        master = document.getElementById('remove-goal-list');
    }
    
    for (i=0; i < goalsObj.length; i++){
        let newOption = document.createElement('option');
        newOption.id = goalsObj[i] + "-" +  type;
        newOption.value = goalsObj[i];
        newOption.innerText = goalsObj[i];
        newOption.className = 'option'
        master.appendChild(newOption)
    }
}

function removeGoal(){
    let subject = document.getElementById('remove-goal-list');

    let subjectChoice = subject.value;

    subject.value = 'goal';

    fetch("/post/removeGoal",{
        method:"POST",
        body:JSON.stringify({
            goal:subjectChoice
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    })

    displayGoals();
}

function createGoal(){
    let subject = document.getElementById('new-goal-list');
    let duration = document.getElementById('new-goal-duration');

    let subjectChoice = subject.value;
    let durationChoice = duration.value;

    subject.value = 'goal';
    duration.value = '';

    fetch("/post/newGoal",{
        method:"POST",
        body:JSON.stringify({
            subject:subjectChoice,
            duration:durationChoice
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    })

    displayGoals();
}

function editGoal(){
    let subject = document.getElementById('edit-goal-list');
    let newDuration = document.getElementById('edit-goal-duration');

    let subjectChoice = subject.value;
    let newDurationChoice = newDuration.value;

    subject.value = 'goal';
    newDuration.value = '';

    fetch("/post/editGoal",{
        method:"POST",
        body:JSON.stringify({
            subject:subjectChoice,
            newDuration:newDurationChoice
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
    })

    displayGoals();
}

function clearGoalDisplay(){
    let goalDisplayList = document.getElementsByClassName('goal-slave');

    while (goalDisplayList.length > 0){
        goalDisplayList[0].remove();
    }
}

function clearOption(){
    let goalOptionList = document.getElementsByClassName('option');

    while (goalOptionList.length > 0){
        goalOptionList[0].remove();
    }   
}