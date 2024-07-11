
/**
 * 
 * Generates Subject Dashboard as Default Dashboard
 */
window.onload = function(){
    generateDashboard('subject')
}

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

async function dashboardFilter(){
    const filterSelector = document.getElementById('dashboard-filter');
    if (filterSelector.value == "Subject"){
        filterSelector.value = "Dashboard Filter";
        generateDashboard("subject");
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
        generateDashboard("tag");
        filterSelected();
    }
}

/**
 * 
 * @yields Removes any option tag with class 'generated-option'
 */
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
        generateDashboard("assignment", subjectChoice.value);
        subjectChoice.value = 'Choose a Subject';
    }
    subjectChoice.style.display = 'none';
    dashboardSelector.value = 'Dashboard Filter';
    document.getElementById('filter-master').style.marginLeft = '45%';
}

/**
 * 
 * @returns Blank Dashboard with required DOM Elements regenerated
 */
function clearDashboard() {
    let body = document.body

    let oldDashboardMaster = document.getElementById('dashboard-master');
    oldDashboardMaster.remove();

    let oldGraphMaster = document.getElementById('graph-master');
    oldGraphMaster.remove();

    let newDashboardMaster = document.createElement('div');
    newDashboardMaster.id = 'dashboard-master';
    newDashboardMaster.className = 'dashboard-master';
    
    let newGraphMaster = document.createElement('div');
    newGraphMaster.id = 'graph-master';
    newGraphMaster.className = 'graph-master';

    let newGraphLeftMaster = document.createElement('div');
    newGraphLeftMaster.id = 'graph-left-master';
    newGraphLeftMaster.className = 'graph-slave';

    let leftGraphTitle = document.createElement("p");
    leftGraphTitle.className = 'dashboard-slave-title-text';
    leftGraphTitle.id = "graph-left-title";
    leftGraphTitle.style.color = "#4B4237";
    newGraphLeftMaster.appendChild(leftGraphTitle);

    let newGraphLeft = document.createElement('canvas');
    newGraphLeft.id = 'graph-left';
    
    let newGraphRightMaster = document.createElement('div');
    newGraphRightMaster.id = 'graph-right-master';
    newGraphRightMaster.className = 'graph-slave';

    let rightGraphTitle = document.createElement("p");
    rightGraphTitle.className = 'dashboard-slave-title-text';
    rightGraphTitle.id = "right-graph-title";
    rightGraphTitle.style.color = "#4B4237";
    newGraphRightMaster.appendChild(rightGraphTitle);

    let newGraphRight = document.createElement('canvas');
    newGraphRight.id = 'graph-right';

    body.appendChild(newDashboardMaster);
    body.appendChild(newGraphMaster);

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
function generateGraph(title, labels, times, totalTime, graphID){
    const graph = document.getElementById(graphID+"-title");
    graph.innerHTML = title;
    
    let timeDisplay = [];

    for(i=0; i < times.length; i++){
        let currentTime = ((times[i] / totalTime)*100).toFixed();
        timeDisplay.push(currentTime);
    }

    new Chart(graphID, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: ["#8A3324","#D5A021","#d15d24","#A49694"],
                data: timeDisplay
            }]
        },
        options: {
            legend: false,
        }
    });
}

/**
 * 
 * @param {String} type String indicating type of dashboard to generate
 * @param {String} subject Optional parameter used to specify a subject for an assignment dashboard
 * 
 * Generates a Dashboard of given type with data from entries.json
 */
async function generateDashboard(type, subject=''){
    // Resets previous dashboard
    clearDashboard();

    let dashboardMaster = document.getElementById('dashboard-master');

    // Colours to use
    const colourDict = {
        "0" : "#8A3324",
        "1" : "#D5A021",
        "2" : "#d15d24",
        "3" : "#A49694",
        "total" : "#EDE7D9",
    }

    // List of times for totals Doughnut Chart
    let timesList = [];
    let totalTime = 0

    // Declaring Request Addresses
    let requestAddress = '';
    let timeRequestAddress = '';

    if (type == "subject"){
        document.title = 'Verso - Subject Dashboard';
        document.getElementById('header').innerText = 'Dashboard - Subject';
        requestAddress = "/get/subjects";
        timeRequestAddress = "/get/times/subject";
        leftGraphTitle = "Total time breakdown by subject";
    }

    if(type == "assignment"){
        document.title = 'Verso - Assignment Dashboard';
        document.getElementById('header').innerText = 'Dashboard - Assignment';
        requestAddress = "/get/assignments/" + subject;
        timeRequestAddress = "/get/times/assignment/" + subject;
        leftGraphTitle = 'Total time breakdown by assignment for ' + subject;
    }

    if(type == "tag"){
        document.title = 'Verso - Tag Dashboard';
        document.getElementById('header').innerText = 'Dashboard - Tag';
        requestAddress = "/get/tags";
        timeRequestAddress = "/get/times/tag";
    }

    // Gets list of subjects from server
    const response = await fetch(requestAddress);
    const responseObj = await response.json();

    for (i=0; i < responseObj.length; i++){
        let current = responseObj[i];
        
        // Gets time for current subject from server
        const currentTimeResponse = await fetch(timeRequestAddress + "/" + current);
        const currentTime = await currentTimeResponse.text();

        // Current Time Added to Times List for Graphs
        timesList.push(Number(currentTime));

        // Current Time Added to Total Time
        totalTime += Number(currentTime);

        // Creates Time Card for current subject
        let newCard = document.createElement('div');
        newCard.id = current;
        newCard.className = 'dashboard-slave';
        newCard.style.backgroundColor = colourDict[i];

        // Creates title for current subject card
        let newCardName = document.createElement('p');
        newCardName.innerText = current;
        newCardName.className = 'dashboard-slave-title-text';

        // Creates total for current subject card
        let newCardTotal = document.createElement('h3');
        newCardTotal.style.fontWeight = 800;
        newCardTotal.className = 'dashboard-slave-total-text';
        newCardTotal.innerText = convertSeconds(currentTime);

        // Displays current subject card
        dashboardMaster.appendChild(newCard);
        newCard.appendChild(newCardName);
        newCard.appendChild(newCardTotal);
    }

    // Total Card is made
    let totalCard = document.createElement('div');
    totalCard.id = 'total';
    totalCard.className = 'dashboard-slave';
    totalCard.style.backgroundColor = colourDict.total;
    totalCard.style.color = "#4B4237"

    // Creates title for current subject card
    let totalCardName = document.createElement('p');
    totalCardName.innerText = "Total";
    totalCardName.className = 'dashboard-slave-title-text';

    // Creates total for current subject card
    let totalCardTotal = document.createElement('h3');
    totalCardTotal.style.fontWeight = 800;
    totalCardTotal.className = 'dashboard-slave-total-text';
    totalCardTotal.innerText = convertSeconds(totalTime);
    
    // Displays current subject card
    dashboardMaster.appendChild(totalCard);
    totalCard.appendChild(totalCardName);
    totalCard.appendChild(totalCardTotal);

    // Resets Filter Div
    toggleDiv('filter-master');

    // Generate left graph 
    generateGraph("Total time breakdown by subject (%)", responseObj, timesList, totalTime, "graph-left");
}