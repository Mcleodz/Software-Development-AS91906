window.onload = function() {
    let dashboardMaster = document.getElementById('dashboard-master');
    const COLOURDICT = {
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
                newSubjectCard.style.backgroundColor = COLOURDICT[i];

                let newSubjectCardName = document.createElement('p');
                newSubjectCardName.innerText = subject;

                let newSubjectCardTotal = document.createElement('h3');
                newSubjectCardTotal.style.fontWeight = 800;
                if (totalDuration < 2){
                    newSubjectCardTotal.innerText = totalDuration + "hr";
                }

                else{
                    newSubjectCardTotal.innerText = totalDuration + "hrs"
                }

                dashboardMaster.appendChild(newSubjectCard);
                newSubjectCard.appendChild(newSubjectCardName);
                newSubjectCard.appendChild(newSubjectCardTotal);
            }
            // Creates display for total data
            let totalCard = document.createElement('div');
            totalCard.id = "total";
            totalCard.className = 'dashboard-slave';
            totalCard.style.backgroundColor = COLOURDICT.total;
            totalCard.style.color = "#4B4237";

            let totalCardName = document.createElement('p');
            totalCardName.innerText = "Total";

            let totalCardTotal = document.createElement('h3');
            totalCardTotal.innerText = getTotalTime(data) + "hrs";
            totalCardTotal.style.fontWeight = 800;

            dashboardMaster.appendChild(totalCard);
            totalCard.appendChild(totalCardName);
            totalCard.appendChild(totalCardTotal);
        })
}

function convertSecondsToHours(seconds){
    // Converts seconds to hours and minutes to display to user.
    var hours = Math.floor(seconds / 3600);
  
    return hours
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

function getAssignments(entryObj){
    // Gets list of all assignments
    let assignmentList = []
    for (let i=0; i < entryObj.length; i++){
        let currentAssignment = entryObj[i].assignment;
        if (assignmentList.includes(currentAssignment) == false){
            assignmentList.push(currentAssignment);
        }
    }
    return assignmentList
}

function getAssignmentTime(entryObj, assignment){
    // Gets total time for specified assignment
    let assignmentTotal = 0;
    for (let i=0; i < entryObj.length; i++){
        if (entryObj[i].assignment == assignment){
            assignmentTotal += entryObj[i].duration;
        }
    }
    return convertSecondsToHours(assignmentTotal);
}

function getSubjectTime(entryObj, subject){
    // Gets total time for specified subject
    let subjectTotal = 0;
    for (let i=0; i < entryObj.length; i++){
        if (entryObj[i].subject == subject){
            subjectTotal += entryObj[i].duration;
        }
    }
    return convertSecondsToHours(subjectTotal);
}

function getTotalTime(entryObj){
    // Gets total time for all entries
    let total = 0;
    for (let i=0; i < entryObj.length; i++){
        total += entryObj[i].duration;
    }
    return convertSecondsToHours(total);
}