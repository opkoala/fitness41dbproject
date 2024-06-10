/*
    SETUP
*/ 

/*
    Citation for the following function:
    Date: 06/07/2024
    Copied from 
    nodejs starter app on github for crud
    source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    Authors: George Kochera, Cortona1, currym-osu, dmgs11
    --}}
*/

/*
    SETUP
*/
//Express
var express = require('express'); 
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
PORT = 9489;

// app.js

const { 
    engine 
} = require('express-handlebars');
var exphbs = require('express-handlebars'); // Import express-handlebars
app.engine('.hbs', engine({
  extname: ".hbs"
})); // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs'); // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// app.js - SETUP section

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
//app.use(express.static('public'))
app.use(express.static(__dirname + '/public')); // this is needed to allow for the form to use the ccs style sheet


//GET ROUTES

// Route for the home page
app.get('/', function (req, res) {
        res.render('index');
    });

// Route for the trainers page
app.get('/trainers', function (req, res) {
    let query1 = "SELECT * FROM Trainers;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('trainers', { data: rows });
    });
});

// Add Route for the trainers page
app.post('/add-trainer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NUll Values
    let experience = parseInt(data['input-experience']);
    if (isNaN(experience))
    {
        experience = 'NULL'
    }

    // Create the query and run it on the database
    let query1 = `INSERT INTO Trainers (trainer_first_name, trainer_last_name, experience, title) VALUES ('${data['input-fname']}', '${data['input-lname']}',  ${experience}, '${data['input-title']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, we redirect back to our trainers route
            res.redirect('/trainers');
        }
    });
});




// Route for the members page
app.get('/members', function (req, res) {
    let query1 = `
        SELECT 
            Members.member_id,
            Members.member_first_name,
            Members.member_last_name,
            Members.member_email,
            Members.member_address,
            Members.member_phone,
            Trainers.trainer_first_name,
            Trainers.trainer_last_name
        FROM 
            Members
        LEFT JOIN 
            Trainers ON Members.trainer_id = Trainers.trainer_id;
    `;

    let query2 = "SELECT trainer_id, trainer_first_name, trainer_last_name FROM Trainers;";

    db.pool.query(query1, function (error, members) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(query2, function (error, trainers) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.render('members', {
                        data: members,
                        trainers: trainers
                    });
                }
            });
        }
    });
});

// Add Route for the add member form
app.post('/add-member-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL Values
    let first_name = data['input-first-name'];
    if (!first_name) {
        first_name = 'NULL';
    }

    let last_name = data['input-last-name'];
    if (!last_name) {
        last_name = 'NULL';
    }

    let email = data['input-email'];
    if (!email) {
        email = 'NULL';
    }

    let address = data['input-address'];
    if (!address) {
        address = 'NULL';
    }

    let phone = data['input-phone'];
    if (!phone) {
        phone = 'NULL';
    }

    let trainer_id = parseInt(data['input-trainer-id']);
    if (isNaN(trainer_id) || trainer_id === "") {
        trainer_id = 'NULL';
    }

    // Create the query and run it on the database
    let query1 = `
        INSERT INTO Members (member_first_name, member_last_name, member_email, member_address, member_phone, trainer_id) 
        VALUES ('${first_name}', '${last_name}', '${email}', '${address}', '${phone}', ${trainer_id})
    `;

    db.pool.query(query1, function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, we redirect back to our members route
            res.redirect('/members');
        }
    });
});


// Update Route for updating a member's information

app.put('/update-member-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture values
    let member_id = parseInt(data['member_id']);
    if (isNaN(member_id)) {
        res.sendStatus(400);
        return;
    }

    let first_name = data['first_name'];
    let last_name = data['last_name'];
    let email = data['email'];
    let address = data['address'];
    let phone = data['phone'];
    let trainer_id = data['trainer_id'] === '' ? 'NULL' : parseInt(data['trainer_id']);
    if (isNaN(trainer_id)) {
        trainer_id = 'NULL';
    }

    // Create the query and run it on the database
    let query1 = `
        UPDATE Members 
        SET 
            member_first_name = '${first_name}', 
            member_last_name = '${last_name}', 
            member_email = '${email}', 
            member_address = '${address}', 
            member_phone = '${phone}', 
            trainer_id = ${trainer_id}
        WHERE 
            member_id = ${member_id}
    `;

    db.pool.query(query1, function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, send the updated data back to the client
            res.send(data);
        }
    });
});






// Get Route for the Exercises page
app.get('/exercises', function (req, res) {
    let query1 = "SELECT * FROM Exercises;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('exercises', { data: rows });
    });
});

// Add Route for the exercises page
app.post('/add-exercise-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    let query1 = `INSERT INTO Exercises (exercise_name, description) VALUES ('${data['input-ename']}', '${data['input-description']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, we redirect back to our exercises route
            res.redirect('/exercises');
        }
    });
});

// Route for Training_sessions page
app.get('/training_sessions', (req, res) => {
    let query1 = `
        SELECT 
            Training_Sessions.session_id,
            Members.member_id,
            Members.member_first_name,
            Members.member_last_name,
            Training_Sessions.training_length,
            Training_Sessions.trainer_id,
            Trainers.trainer_first_name,
            Trainers.trainer_last_name
        FROM 
            Training_Sessions
        JOIN 
            Members ON Training_Sessions.member_id = Members.member_id
        JOIN 
            Trainers ON Training_Sessions.trainer_id = Trainers.trainer_id;
    `;

    let query2 = "SELECT member_id, member_first_name, member_last_name FROM Members;";
    let query3 = "SELECT trainer_id, trainer_first_name, trainer_last_name FROM Trainers;";

    db.pool.query(query1, function (error, sessions) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(query2, function (error, members) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    db.pool.query(query3, function (error, trainers) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.render('training_sessions', {
                                data: sessions,
                                members: members,
                                trainers: trainers
                            });
                        }
                    });
                }
            });
        }
    });
});


// Add Route for the training sessions page
app.post('/add-training-session-form', function(req, res){
    let data = req.body;

    let member_id = parseInt(data['input-member-id']);
    if (isNaN(member_id)) {
        member_id = 'NULL';
    }

    let training_length = parseInt(data['input-training-length']);
    if (isNaN(training_length)) {
        training_length = 'NULL';
    }

    let trainer_id = parseInt(data['input-trainer-id']);
    if (isNaN(trainer_id)) {
        trainer_id = 'NULL';
    }

    let query1 = `INSERT INTO Training_Sessions (member_id, training_length, trainer_id) VALUES (${member_id}, ${training_length}, ${trainer_id})`;

    db.pool.query(query1, function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, we redirect back to our training sessions route
            res.redirect('/training_sessions');
        }
    });
});





// Route for the Session Exercises page
app.get('/session_exercises', function (req, res) {
    let query1 = `
        SELECT 
            Session_Exercises.session_exercises_id,
            Training_Sessions.session_id,
            Exercises.exercise_id,
            Exercises.exercise_name,
            Session_Exercises.set_num,
            Session_Exercises.set_rep
        FROM 
            Session_Exercises
        INNER JOIN 
            Exercises ON Session_Exercises.exercise_id = Exercises.exercise_id
        INNER JOIN 
            Training_Sessions ON Session_Exercises.session_id = Training_Sessions.session_id;
    `;
    let query2 = "SELECT exercise_id, exercise_name FROM Exercises;";
    let query3 = "SELECT session_id FROM Training_Sessions;";

    db.pool.query(query1, function (error, session_exercises) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(query2, function (error, exercises) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    db.pool.query(query3, function (error, sessions) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.render('session_exercises', {
                                data: session_exercises,
                                exercises: exercises,
                                sessions: sessions,
                            });
                        }
                    });
                }
            });
        }
    });
});



// Add Route for the session exercises page
app.post('/add-session-exercises-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL Values
    let session_id = parseInt(data['input-session-id']);
    if (isNaN(session_id)) {
        session_id = 'NULL';
    }

    let exercise_id = parseInt(data['input-exercise-id']);
    if (isNaN(exercise_id)) {
        exercise_id = 'NULL';
    }

    let set_num = parseInt(data['input-set-number']);
    if (isNaN(set_num)) {
        set_num = 'NULL';
    }
    let set_rep = parseInt(data['input-set-rep']);
    if (isNaN(set_rep)) {
        set_rep = 'NULL';
    }
 

    // Create the query and run it on the database
    let query1 = `INSERT INTO Session_Exercises (session_id, exercise_id, set_num, set_rep) VALUES (${session_id},${exercise_id}, ${set_num}, ${set_rep})`;

    db.pool.query(query1, function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, we redirect back to our exercise members route
            res.redirect('/session_exercises');
        }
    });
});


// Delete route for the session exercise page
app.delete('/delete-session-exercise-ajax/', function(req,res,next) {
    let data = req.body;
    let session_exercises_id = parseInt(data.session_exercises_id);

    let deleteSessionExercise = `
        DELETE FROM Session_Exercises 
        WHERE session_exercises_id = ?
    `;

    // run query 
    db.pool.query(deleteSessionExercise, [session_exercises_id], function(error, rows, fields) {
        if (error) {
            // log error on terminal and send 400 status
            console.log(error);
            res.sendStatus(400); 
        } else {
            // send 200 success status
            res.sendStatus(200); 
        }
  })});

// Update route for the session exercise page
app.put('/put-session-exercise-ajax', function(req, res, next) {
    let data = req.body;

    let sessionExercise = parseInt(data.sessionExercise);
    let session = parseInt(data.session);
    let exercise = parseInt(data.exercise);
    let setNum = parseInt(data.setNum);
    let setRep = parseInt(data.setRep);

    let queryUpdateSessionExercise = `
        UPDATE Session_Exercises 
        SET session_id = ?, exercise_id = ?, set_num = ?, set_rep = ? 
        WHERE session_exercises_id = ?`;
    
    // Updated SELECT query to include exercise_name
    let selectUpdatedSessionExercise = `
        SELECT Session_Exercises.session_id AS session, Session_Exercises.exercise_id AS exercise, Exercises.exercise_name, Session_Exercises.set_num, Session_Exercises.set_rep 
        FROM Session_Exercises
        JOIN Exercises ON Session_Exercises.exercise_id = Exercises.exercise_id
        WHERE Session_Exercises.session_exercises_id = ?`;

    // Run the 1st query
    db.pool.query(queryUpdateSessionExercise, [session, exercise, setNum, setRep, sessionExercise], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the second query
            db.pool.query(selectUpdatedSessionExercise, [sessionExercise], function(error, exerciseRows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(exerciseRows[0]); 
                }
            });
        }
    });
});





app.delete('/delete-person-ajax/', function (req, res, next) {
    let data = req.body;
    let personID = parseInt(data.id);
    let deleteMember = `DELETE FROM Members WHERE member_id = ?`; 

    // Run the deleteMember query
    db.pool.query(deleteMember, [personID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});


  
  

  
/*
    LISTENER
*/
app.listen(PORT, function () { // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});



  
  