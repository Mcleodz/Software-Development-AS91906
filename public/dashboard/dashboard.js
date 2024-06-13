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

function getSubjects(entryObj){
    // Gets list of all subjects
    let subjectList = []
    for (let i=0; i < entryObj.length; i++){
        let currentSubject = entryObj[i].subject;
        if (subjectList.includes(currentSubject) == false){
            subjectList.push(currentSubject);
        }
    }
    return subjectList
}

function getAssignments(entryObj, subject){
    // Gets list of all assignments
    let assignmentList = []
    for (let i=0; i < entryObj.length; i++){
        if (entryObj[i].subject == subject){
            let currentAssignment = entryObj[i].assignment;
            if (assignmentList.includes(currentAssignment) == false){
                assignmentList.push(currentAssignment);
            }
        }
    }
    return assignmentList
}

function getTags(entryObj){
    // Gets list of all assignments
    let tagsList = []
    for (let i=0; i < entryObj.length; i++){
        let currentTag = entryObj[i].tag;
        if (tagsList.includes(currentTag) == false){
            tagsList.push(currentTag);
        }
    }
    return tagsList
}

function getAssignmentTime(entryObj, assignment, subject){
    // Gets total time for specified assignment
    let assignmentTotal = 0;
    for (let i=0; i < entryObj.length; i++){
        if (entryObj[i].assignment == assignment && entryObj[i].subject == subject){
            assignmentTotal += entryObj[i].duration;
        }
    }
    return convertSeconds(assignmentTotal);
}

function getSubjectTime(entryObj, subject){
    // Gets total time for specified subject
    let subjectTotal = 0;
    for (let i=0; i < entryObj.length; i++){
        if (entryObj[i].subject == subject){
            subjectTotal += entryObj[i].duration;
        }
    }
    return convertSeconds(subjectTotal);
}

function getTagTime(entryObj, tag){
    // Gets total time for specified subject
    let tagTotal = 0;
    for (let i=0; i < entryObj.length; i++){
        if (entryObj[i].tag == tag){
            tagTotal += entryObj[i].duration;
        }
    }
    return convertSeconds(tagTotal);
}

function getTotalTime(entryObj){
    // Gets total time for all entries
    let total = 0;
    for (let i=0; i < entryObj.length; i++){
        total += entryObj[i].duration;
    }
    return convertSeconds(total);
}

function dashboardFilter(){
    const filterSelector = document.getElementById('dashboard-filter');
    if (filterSelector.value == "Subject"){
        filterSelector.value = "Dashboard Filter";
        generateSubjectDashboard();
        filterSelected();
    }
    if (filterSelector.value == "Assignment"){

        clearOptions();

        let subjectChoice = document.getElementById('subject-choice');

        const response = fetch("http://localhost:2000/get/entries/list")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const subjects = getSubjects(data);

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
        })
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

function generateSubjectDashboard(){
    clearDashboard()

    document.title = 'Verso - Subject Dashboard';

    document.getElementById('header').innerText = 'Dashboard - Subject';

    let dashboardMaster = document.getElementById('dashboard-master');

    const colourDict = {
        "0" : "#8A3324",
        "1" : "#D5A021",
        "2" : "#d15d24",
        "3" : "#A49694",
        "4" : "#736B60",
        "5" : "#F0D087",
        "total" : "#EDE7D9",
    }
    const response = fetch("http://localhost:2000/get/entries/list")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let subjects = getSubjects(data)
            for (let i = 0; i < subjects.length; i++){
                // Generates cards to display each subject and respective time
                const subject = subjects[i];
                const totalDuration = getSubjectTime(data, subjects[i])

                let newSubjectCard = document.createElement('div');
                newSubjectCard.id = subject;
                newSubjectCard.className = 'dashboard-slave';
                newSubjectCard.style.backgroundColor = colourDict[i];

                let newSubjectCardName = document.createElement('p');
                newSubjectCardName.innerText = subject;
                newSubjectCardName.className = 'dashboard-slave-title-text';

                let newSubjectCardTotal = document.createElement('h3');
                newSubjectCardTotal.style.fontWeight = 800;
                newSubjectCardTotal.className = 'dashboard-slave-total-text';
                newSubjectCardTotal.innerText = totalDuration;

                dashboardMaster.appendChild(newSubjectCard);
                newSubjectCard.appendChild(newSubjectCardName);
                newSubjectCard.appendChild(newSubjectCardTotal);
            }
            // Creates display for total data
            let totalCard = document.createElement('div');
            totalCard.id = "total";
            totalCard.className = 'dashboard-slave';
            totalCard.style.backgroundColor = colourDict.total;
            totalCard.style.color = "#4B4237";

            let totalCardName = document.createElement('p');
            totalCardName.innerText = "Total";
            totalCardName.className = 'dashboard-slave-title-text';

            let totalCardTotal = document.createElement('h3');
            totalCardTotal.innerText = getTotalTime(data);
            totalCardTotal.className = 'dashboard-slave-total-text';
            totalCardTotal.style.fontWeight = 800;

            dashboardMaster.appendChild(totalCard);
            totalCard.appendChild(totalCardName);
            totalCard.appendChild(totalCardTotal);
        })
    toggleDiv('filter-master');
}

function generateAssignmentDashboard(subject){

    clearDashboard()

    document.getElementById('header').innerText = `Dashboard - ${subject}'s Assignments`;

    let dashboardMaster = document.getElementById('dashboard-master');

    document.title = `Verso - Assignment Dashboard for ${subject}` ;

    const colourDict = {
        "0" : "#8A3324",
        "1" : "#D5A021",
        "2" : "#d15d24",
        "3" : "#A49694",
        "4" : "#736B60",
        "5" : "#F0D087",
        "total" : "#EDE7D9",
    }
    const response = fetch("http://localhost:2000/get/entries/list")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let assignments = getAssignments(data, subject)
            for (let i = 0; i < assignments.length; i++){
                // Generates cards to display each subject and respective time
                const assignment = assignments[i];
                const totalDuration = getAssignmentTime(data, assignment, subject);

                let newAssignmentCard = document.createElement('div');
                newAssignmentCard.id = assignment;
                newAssignmentCard.className = 'dashboard-slave';
                newAssignmentCard.style.backgroundColor = colourDict[i];

                let newAssignmentCardName = document.createElement('p');
                newAssignmentCardName.innerText = assignment;
                newAssignmentCardName.className = 'dashboard-slave-title-text';

                let newAssignmentCardTotal = document.createElement('h3');
                newAssignmentCardTotal.style.fontWeight = 800;
                newAssignmentCardTotal.className = 'dashboard-slave-total-text';
                newAssignmentCardTotal.innerText = totalDuration;

                dashboardMaster.appendChild(newAssignmentCard);
                newAssignmentCard.appendChild(newAssignmentCardName);
                newAssignmentCard.appendChild(newAssignmentCardTotal);
            }
            // Creates display for total data
            let totalCard = document.createElement('div');
            totalCard.id = "total";
            totalCard.className = 'dashboard-slave';
            totalCard.style.backgroundColor = colourDict.total;
            totalCard.style.color = "#4B4237";

            let totalCardName = document.createElement('p');
            totalCardName.innerText = "Total";
            totalCardName.className = 'dashboard-slave-title-text';

            let totalCardTotal = document.createElement('h3');
            totalCardTotal.innerText = getSubjectTime(data, subject);
            totalCardTotal.className = 'dashboard-slave-total-text';
            totalCardTotal.style.fontWeight = 800;

            dashboardMaster.appendChild(totalCard);
            totalCard.appendChild(totalCardName);
            totalCard.appendChild(totalCardTotal);
        })
    toggleDiv('filter-master');
}

function generateTagDashboard(){
    clearDashboard()

    document.title = 'Verso - Tag Dashboard';

    document.getElementById('header').innerText = 'Dashboard - Tags';

    let dashboardMaster = document.getElementById('dashboard-master');

    const colourDict = {
        "0" : "#8A3324",
        "1" : "#D5A021",
        "2" : "#d15d24",
        "3" : "#A49694",
        "4" : "#736B60",
        "5" : "#F0D087",
        "total" : "#EDE7D9",
    }
    const response = fetch("http://localhost:2000/get/entries/list")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let tags = getTags(data);
            for (let i = 0; i < tags.length; i++){
                // Generates cards to display each subject and respective time
                const tag = tags[i];
                const totalDuration = getTagTime(data, tag)

                let newTagCard = document.createElement('div');
                newTagCard.id = tag;
                newTagCard.className = 'dashboard-slave';
                newTagCard.style.backgroundColor = colourDict[i];

                let newTagCardName = document.createElement('p');
                newTagCardName.innerText = tag;
                newTagCardName.className = 'dashboard-slave-title-text';

                let newTagCardTotal = document.createElement('h3');
                newTagCardTotal.style.fontWeight = 800;
                newTagCardTotal.className = 'dashboard-slave-total-text';
                newTagCardTotal.innerText = totalDuration;

                dashboardMaster.appendChild(newTagCard);
                newTagCard.appendChild(newTagCardName);
                newTagCard.appendChild(newTagCardTotal);
            }
            // Creates display for total data
            let totalCard = document.createElement('div');
            totalCard.id = "total";
            totalCard.className = 'dashboard-slave';
            totalCard.style.backgroundColor = colourDict.total;
            totalCard.style.color = "#4B4237";

            let totalCardName = document.createElement('p');
            totalCardName.innerText = "Total";
            totalCardName.className = 'dashboard-slave-title-text';

            let totalCardTotal = document.createElement('h3');
            totalCardTotal.innerText = getTotalTime(data);
            totalCardTotal.className = 'dashboard-slave-total-text';
            totalCardTotal.style.fontWeight = 800;

            dashboardMaster.appendChild(totalCard);
            totalCard.appendChild(totalCardName);
            totalCard.appendChild(totalCardTotal);
        })
    toggleDiv('filter-master');
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