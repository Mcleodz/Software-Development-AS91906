window.onload = function(){
    generateSubjectDashboard()
}

function toggleDiv(id) {
    var div = document.getElementById(id);
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
    else if (output == seconds){
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

function getAssignmentTime(entryObj, assignment){
    // Gets total time for specified assignment
    let assignmentTotal = 0;
    for (let i=0; i < entryObj.length; i++){
        if (entryObj[i].assignment == assignment){
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

function generateSubjectDashboard(){
    clearDashboard()

    document.title = 'Verso - Subject Dashboard';

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
                console.log(subjects[i], totalDuration);

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

function generateAssignmentDashboard(){

    let subject = document.getElementById('filter-assignment').value;

    if (subject == ''){
        alert('please select a subject to view');
        return `404 ${subject} not found`;
    }

    clearDashboard()

    let dashboardMaster = document.getElementById('dashboard-master');
    document.getElementById('filter-assignment').value = '';

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
                const totalDuration = getAssignmentTime(data, assignment)
                console.log(assignments[i], totalDuration);

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
                console.log(tag, totalDuration);

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