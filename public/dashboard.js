window.onload = function(){
    generateSubjectDashboard()
}

function toggleDiv(id) {
    let div = document.getElementById(id);
    div.style.display = div.style.display == "none" ? "block" : "none";

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
    else if (output == '0'){
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

async function dashboardFilter(){
    const filterSelector = document.getElementById('dashboard-filter');
    if (filterSelector.value == "Subject"){
        filterSelector.value = "Dashboard Filter";
        generateSubjectDashboard();
        filterSelected();
    }
    if (filterSelector.value == "Assignment"){

        clearOptions();

        let subjectChoice = document.getElementById('subject-choice');

        const response = await fetch("/get/subjects")
        const subjects = await response.json();

        subjectChoice.style.display = 'block';
        document.getElementById('filter-master').style.marginLeft = '35.6%';

        for (let i = 0; i < subjects.length; i++){
            let subject = subjects[i];

            let newSubjectChoice = document.createElement('option');
            newSubjectChoice.innerText = subject;
            newSubjectChoice.value = subject;
            newSubjectChoice.className = 'generated-option';
            
            subjectChoice.appendChild(newSubjectChoice);
        }
    }
    if (filterSelector.value == "Tag"){
        filterSelector.value = "Dashboard Filter";
        generateTagDashboard();
        filterSelected();
    }
}

function clearOptions() {
    let options = document.getElementsByClassName('generated-option');

    while (options.length > 0){
        options[0].remove();
    }
}

function filterSelected(){ 
    let subjectChoice = document.getElementById('subject-choice');
    let dashboardSelector = document.getElementById('dashboard-filter');

    if (dashboardSelector.value == 'Assignment'){
        generateAssignmentDashboard(subjectChoice.value);
        subjectChoice.value = 'Choose a Subject';
    }
    subjectChoice.style.display = 'none';
    dashboardSelector.value = 'Dashboard Filter';
    document.getElementById('filter-master').style.marginLeft = '45%';
}

function clearDashboard() {
    let body = document.body

    let oldDashboardMaster = document.getElementById('dashboard-master');
    oldDashboardMaster.remove();

    let oldGraphMaster = document.getElementById('graph-master');
    oldGraphMaster.remove();

    let newDashboardMaster = document.createElement('div');
    newDashboardMaster.id = 'dashboard-master';
    newDashboardMaster.className = 'dashboard-master';
    
    let newgraphMaster = document.createElement('div');
    newgraphMaster.id = 'graph-master';
    newgraphMaster.className = 'graph-master';

    let newgraphLeft = document.createElement('div');
    newgraphLeft.id = 'graph-led';
    newgraphLeft.className = 'graph-slave';
    
    let newgraphRight = document.createElement('div');
    newgraphRight.id = 'graph-right';
    newgraphRight.className = 'graph-slave';

    body.appendChild(newDashboardMaster);
    body.appendChild(newgraphMaster);

    newgraphMaster.appendChild(newgraphLeft);
    newgraphMaster.appendChild(newgraphRight);

    return 200
}

async function generateSubjectDashboard(){

    // Resets previous dashboard
    clearDashboard()
    document.title = 'Verso - Subject Dashboard';
    document.getElementById('header').innerText = 'Dashboard - Subject';
    let dashboardMaster = document.getElementById('dashboard-master');

    // Colours to use
    const colourDict = {
        "0" : "#8A3324",
        "1" : "#D5A021",
        "2" : "#d15d24",
        "3" : "#A49694",
        "total" : "#EDE7D9",
    }

    // Gets list of subjects from server
    const response = await fetch("/get/subjects");
    const subjects = await response.json();

    for (i=0; i < subjects.length; i++){
        let currentSubject = subjects[i];
        
        // Gets time for current subject from server
        const currentSubjectTimeResponse = await fetch(`/get/times/subject/${currentSubject}`);
        const currentSubjectTime = await currentSubjectTimeResponse.text();

        // Creates Time Card for current subject
        let newSubjectCard = document.createElement('div');
        newSubjectCard.id = currentSubject;
        newSubjectCard.className = 'dashboard-slave';
        newSubjectCard.style.backgroundColor = colourDict[i];

        // Creates title for current subject card
        let newSubjectCardName = document.createElement('p');
        newSubjectCardName.innerText = currentSubject;
        newSubjectCardName.className = 'dashboard-slave-title-text';

        // Creates total for current subject card
        let newSubjectCardTotal = document.createElement('h3');
        newSubjectCardTotal.style.fontWeight = 800;
        newSubjectCardTotal.className = 'dashboard-slave-total-text';
        newSubjectCardTotal.innerText = convertSeconds(currentSubjectTime);

        // Displays current subject card
        dashboardMaster.appendChild(newSubjectCard);
        newSubjectCard.appendChild(newSubjectCardName);
        newSubjectCard.appendChild(newSubjectCardTotal);
    }

    // Gets total time for Total Time Card
    const totalTimeResponse = await fetch('/get/times/total');
    const totalTime = await totalTimeResponse.text()

    // Creates Total Time Card 
    let totalCard = document.createElement('div');
    totalCard.id = "total";
    totalCard.className = 'dashboard-slave';
    totalCard.style.backgroundColor = colourDict.total;
    totalCard.style.color = "#4B4237";

    // Creates Title for Total Time Card
    let totalCardName = document.createElement('p');
    totalCardName.innerText = "Total";
    totalCardName.className = 'dashboard-slave-title-text';

    // Creates Time text for Total Time Card
    let totalCardTotal = document.createElement('h3');
    totalCardTotal.innerText = convertSeconds(totalTime);
    totalCardTotal.className = 'dashboard-slave-total-text';
    totalCardTotal.style.fontWeight = 800;

    // Displays Total Card Text
    dashboardMaster.appendChild(totalCard);
    totalCard.appendChild(totalCardName);
    totalCard.appendChild(totalCardTotal);

    // Resets Filter Div
    toggleDiv('filter-master');
}

async function generateAssignmentDashboard(subject){

    // Resets previous dashboard
    clearDashboard()
    document.title = `Verso - Assignment Dashboard for ${subject}`;
    document.getElementById('header').innerText = `Dashboard - ${subject}'s Assignments`;
    let dashboardMaster = document.getElementById('dashboard-master');

    // Colours to use
    const colourDict = {
        "0" : "#8A3324",
        "1" : "#D5A021",
        "2" : "#d15d24",
        "3" : "#A49694",
        "total" : "#EDE7D9",
    }

    // Gets list of Assignments from server
    const response = await fetch(`/get/assignments/${subject}`);
    const assignments = await response.json();

    for (i=0; i < assignments.length; i++){
        let currentAssignment = assignments[i];
        
        // Gets time for current Assignment from server
        const currentAssignmentTimeResponse = await fetch(`/get/times/assignment/${subject}/${currentAssignment}`);
        const currentAssignmentTime = await currentAssignmentTimeResponse.text();

        // Creates Time Card for Assignment subject
        let newAssignmentCard = document.createElement('div');
        newAssignmentCard.id = currentAssignment;
        newAssignmentCard.className = 'dashboard-slave';
        newAssignmentCard.style.backgroundColor = colourDict[i];

        // Creates title for current Assignment card
        let newAssignmentCardName = document.createElement('p');
        newAssignmentCardName.innerText = currentAssignment;
        newAssignmentCardName.className = 'dashboard-slave-title-text';

        // Creates total for current Assignment card
        let newAssignmentCardTotal = document.createElement('h3');
        newAssignmentCardTotal.style.fontWeight = 800;
        newAssignmentCardTotal.className = 'dashboard-slave-total-text';
        newAssignmentCardTotal.innerText = convertSeconds(currentAssignmentTime);

        // Displays current Assignment card
        dashboardMaster.appendChild(newAssignmentCard);
        newAssignmentCard.appendChild(newAssignmentCardName);
        newAssignmentCard.appendChild(newAssignmentCardTotal);
    }

    // Gets total time for Total Time Card
    const totalTimeResponse = await fetch(`/get/times/subject/${subject}`);
    const totalTime = await totalTimeResponse.text()

    // Creates Total Time Card 
    let totalCard = document.createElement('div');
    totalCard.id = "total";
    totalCard.className = 'dashboard-slave';
    totalCard.style.backgroundColor = colourDict.total;
    totalCard.style.color = "#4B4237";

    // Creates Title for Total Time Card
    let totalCardName = document.createElement('p');
    totalCardName.innerText = "Total";
    totalCardName.className = 'dashboard-slave-title-text';

    // Creates Time text for Total Time Card
    let totalCardTotal = document.createElement('h3');
    totalCardTotal.innerText = convertSeconds(totalTime);
    totalCardTotal.className = 'dashboard-slave-total-text';
    totalCardTotal.style.fontWeight = 800;

    // Displays Total Card Text
    dashboardMaster.appendChild(totalCard);
    totalCard.appendChild(totalCardName);
    totalCard.appendChild(totalCardTotal);

    // Resets Filter Div
    toggleDiv('filter-master');
}

async function generateTagDashboard(){

    // Resets previous dashboard
    clearDashboard()
    document.title = `Verso - Tag Dashboard`;
    document.getElementById('header').innerText = `Dashboard - Tags`;
    let dashboardMaster = document.getElementById('dashboard-master');

    // Colours to use
    const colourDict = {
        "0" : "#8A3324",
        "1" : "#D5A021",
        "2" : "#d15d24",
        "3" : "#A49694",
        "total" : "#EDE7D9",
    }

    // Gets list of Assignments from server
    const response = await fetch(`/get/tags`);
    const tags = await response.json();

    for (i=0; i < tags.length; i++){
        let currentTag = tags[i];
        
        // Gets time for current Assignment from server
        const currentTagTimeResponse = await fetch(`/get/times/tag/${currentTag}`);
        const currentTagTime = await currentTagTimeResponse.text();

        // Creates Time Card for Assignment subject
        let newTagCard = document.createElement('div');
        newTagCard.id = currentTag;
        newTagCard.className = 'dashboard-slave';
        newTagCard.style.backgroundColor = colourDict[i];

        // Creates title for current Assignment card
        let newTagCardName = document.createElement('p');
        newTagCardName.innerText = currentTag;
        newTagCardName.className = 'dashboard-slave-title-text';

        // Creates total for current Assignment card
        let newTagCardTotal = document.createElement('h3');
        newTagCardTotal.style.fontWeight = 800;
        newTagCardTotal.className = 'dashboard-slave-total-text';
        newTagCardTotal.innerText = convertSeconds(currentTagTime);

        // Displays current Assignment card
        dashboardMaster.appendChild(newTagCard);
        newTagCard.appendChild(newTagCardName);
        newTagCard.appendChild(newTagCardTotal);
    }

    // Gets total time for Total Time Card
    const totalTimeResponse = await fetch(`/get/times/total`);
    const totalTime = await totalTimeResponse.text()

    // Creates Total Time Card 
    let totalCard = document.createElement('div');
    totalCard.id = "total";
    totalCard.className = 'dashboard-slave';
    totalCard.style.backgroundColor = colourDict.total;
    totalCard.style.color = "#4B4237";

    // Creates Title for Total Time Card
    let totalCardName = document.createElement('p');
    totalCardName.innerText = "Total";
    totalCardName.className = 'dashboard-slave-title-text';

    // Creates Time text for Total Time Card
    let totalCardTotal = document.createElement('h3');
    totalCardTotal.innerText = convertSeconds(totalTime);
    totalCardTotal.className = 'dashboard-slave-total-text';
    totalCardTotal.style.fontWeight = 800;

    // Displays Total Card Text
    dashboardMaster.appendChild(totalCard);
    totalCard.appendChild(totalCardName);
    totalCard.appendChild(totalCardTotal);

    // Resets Filter Div
    toggleDiv('filter-master');
}