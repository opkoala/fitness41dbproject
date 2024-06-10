/*
    Citation for the following function:
    Date: 06/07/2024
    Copied from 
    nodejs starter app on github for crud
    source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    Authors: George Kochera, Cortona1, currym-osu, dmgs11
    --}}
*/

// Get the objects we need to modify
let updateSessionExercise = document.getElementById('update-session-exercises-form-ajax');

// Modify the objects we need
updateSessionExercise.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSessionExercise = document.getElementById("input-session-exercise-update");
    let inputSession = document.getElementById("input-session-update");
    let inputExercise = document.getElementById("input-exercise-update");
    let inputSetNumber = document.getElementById("input-set-number-update");
    let inputSetRep = document.getElementById("input-set-rep-update");

    // Get the values from the form fields
    let sessionExerciseValue = inputSessionExercise.value;
    let sessionValue = inputSession.value;
    let exerciseValue = inputExercise.value;
    let setNumValue = inputSetNumber.value;
    let setRepValue = inputSetRep.value;

    // currently the database table does not allow updating values to NULL
    // so we must abort if being bassed NULL for the below values

    if (isNaN(sessionValue) || isNaN(sessionExerciseValue)) 
    {
        return;
    }

    let data = {
        sessionExercise: sessionExerciseValue,
        session: sessionValue,
        exercise: exerciseValue,
        setNum: setNumValue,
        setRep: setRepValue
    }

        // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-session-exercise-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, sessionExerciseValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, sessionExerciseID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("session-exercises-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == sessionExerciseID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let sessionTd = updateRowIndex.getElementsByTagName("td")[1];
            let exerciseTd = updateRowIndex.getElementsByTagName("td")[2];
            let setNumTd = updateRowIndex.getElementsByTagName("td")[4];
            let setRepTd = updateRowIndex.getElementsByTagName("td")[5];

            sessionTd.innerHTML = parsedData.session;
            exerciseTd.innerHTML = parsedData.exercise;
            setNumTd.innerHTML = parsedData.set_num;
            setRepTd.innerHTML = parsedData.set_rep;
        }
    }
    location.reload()
}