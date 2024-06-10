
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

    // Get the values from the form fields
    let sessionExerciseValue = inputSessionExercise.value;
    let sessionValue = inputSession.value;
    let exerciseValue = inputExercise.value;

    // currently the database table does not allow updating values to NULL
    // so we must abort if being bassed NULL for the below values

    if (isNaN(sessionValue) || isNaN(sessionExerciseValue)) 
    {
        return;
    }

    if (isNaN(exerciseValue) || isNaN(sessionExerciseValue)) 
        {
            return;
        }


    // Put our data we want to send in a javascript object
    let data = {
        sessionExercise: sessionExerciseValue,
        session: sessionValue,
        exercise: exerciseValue,
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

