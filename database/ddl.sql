-- DDL file that will correspond to the CS340 Portfolio Project deliverables.

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
-- Create Trainers table
CREATE OR REPLACE TABLE Trainers (
    trainer_id INT NOT NULL AUTO_INCREMENT,
    trainer_first_name VARCHAR(255) NOT NULL,
    trainer_last_name VARCHAR(255) NOT NULL,
    experience INT,
    title VARCHAR(255) NOT NULL,
    PRIMARY KEY(trainer_id)
);

-- Inserting data into Trainers table
INSERT INTO Trainers (
    trainer_first_name,
    trainer_last_name,
    experience,
    title
)
VALUES
('Gilbert', 'Arenas', 1, 'Physio'),
('Shannon', 'Sharpe', 2, 'Nutrition'),
('Skip', 'Bayless', 10, 'Stamina');

-- Create Members table
CREATE OR REPLACE TABLE Members (
    member_id INT NOT NULL AUTO_INCREMENT,
    member_first_name VARCHAR(255) NOT NULL,
    member_last_name VARCHAR(255) NOT NULL,
    member_email VARCHAR(255)  NOT NULL,
    member_address VARCHAR(255) NOT NULL,
    member_phone VARCHAR(255) NOT NULL,
    trainer_id INT,
    FOREIGN KEY (trainer_id) REFERENCES Trainers(trainer_id),
    PRIMARY KEY(member_id)
);

-- Inserting data into Members table
INSERT INTO Members (
    member_first_name,
    member_last_name,
    member_email,
    member_address,
    member_phone,
    trainer_id
)
VALUES
    ('Lebron', 'James', 'kingjames23@gmail.com', '1543 Orchard Park', '4084255679', (SELECT trainer_id FROM Trainers WHERE trainer_first_name = 'Gilbert' AND trainer_last_name = 'Arenas')),
    ('Kevin', 'Durant', 'kevindurantsuns@gmail.com', '4581 Westfield Way', '4155151254', (SELECT trainer_id FROM Trainers WHERE trainer_first_name = 'Shannon' AND trainer_last_name = 'Sharpe')),
    ('Stephen', 'Curry', 'WardenCurry30@gmail.com', '5415 Westfield Way', '4156543451', (SELECT trainer_id FROM Trainers WHERE trainer_first_name = 'Shannon' AND trainer_last_name = 'Sharpe')),
    ('Kenny', 'G', 'saxophoneman24@gmail.com', '5430 instrumental way', '4156343491', NULL);
-- Create Exercises table
CREATE OR REPLACE TABLE Exercises (
    exercise_id INT NOT NULL AUTO_INCREMENT,
    exercise_name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(225) NOT NULL,
    PRIMARY KEY(exercise_id)
);

-- Inserting data into Exercises table
INSERT INTO Exercises (exercise_name, description)
VALUES
    ('Bench Press', 'You would lie on your back on a bench, lift the barbell up to chest level and go back down.'),
    ('Arm Curls', 'You would rest your arm down with the dumbbells, raise them up at the same time, and slowly go down.'),
    ('Barbell Squats', 'You would first position the barbell on your back and shoulders, and go as low as possible.'),
    ('Deadlifts', 'You would first have the barbell sitting between your legs and then lift up, making sure that you are upright.'),
    ('Dumbbell Shoulder Press', 'You would first hold the dumbbells at shoulder height and then lift them up and down, making sure your arms are not straight. Your bench should be at a 90 degree angle.');

-- Create Training_Sessions table
CREATE OR REPLACE TABLE Training_Sessions (
    session_id INT NOT NULL AUTO_INCREMENT,
    member_id INT NOT NULL,
    training_length INT,
    trainer_id INT NOT NULL, 
    FOREIGN KEY (member_id) REFERENCES Members(member_id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES Trainers(trainer_id),
    PRIMARY KEY(session_id)
);

-- Inserting data into Training_Sessions table
INSERT INTO Training_Sessions (
    member_id, 
    training_length,
    trainer_id
)
VALUES 
    ((SELECT member_id FROM Members WHERE member_first_name = 'Lebron' AND member_last_name = 'James'), 60, (SELECT trainer_id FROM Trainers WHERE trainer_first_name = 'Gilbert' AND trainer_last_name = 'Arenas')),
    ((SELECT member_id FROM Members WHERE member_first_name = 'Kevin' AND member_last_name = 'Durant'), 65, (SELECT trainer_id FROM Trainers WHERE trainer_first_name = 'Gilbert' AND trainer_last_name = 'Arenas')),
    ((SELECT member_id FROM Members WHERE member_first_name = 'Stephen' AND member_last_name = 'Curry'), 70, (SELECT trainer_id FROM Trainers WHERE trainer_first_name = 'Shannon' AND trainer_last_name = 'Sharpe'));

-- Create Session_Exercises table for Many-to-Many relationship between Exercises and Training_Sessions
CREATE OR REPLACE TABLE Session_Exercises (
    session_exercises_id INT NOT NULL AUTO_INCREMENT,
    session_id INT NOT NULL,
    exercise_id INT NOT NULL,
    set_num INT,
    set_rep INT,
    FOREIGN KEY(session_id) REFERENCES Training_Sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY(exercise_id) REFERENCES Exercises(exercise_id) ON DELETE CASCADE,
    PRIMARY KEY(session_exercises_id)
);

-- Inserting data into Session_Exercises table
INSERT INTO Session_Exercises (session_id, exercise_id, set_num, set_rep)
VALUES
    ((SELECT session_id FROM Training_Sessions WHERE member_id = (SELECT member_id FROM Members WHERE member_first_name = 'Lebron' AND member_last_name = 'James') AND training_length = 60), (SELECT exercise_id FROM Exercises WHERE exercise_name = 'Bench Press'), 5, 5),
    ((SELECT session_id FROM Training_Sessions WHERE member_id = (SELECT member_id FROM Members WHERE member_first_name = 'Kevin' AND member_last_name = 'Durant') AND training_length = 65), (SELECT exercise_id FROM Exercises WHERE exercise_name = 'Arm Curls'), 3, 12),
    ((SELECT session_id FROM Training_Sessions WHERE member_id = (SELECT member_id FROM Members WHERE member_first_name = 'Stephen' AND member_last_name = 'Curry') AND training_length = 70), (SELECT exercise_id FROM Exercises WHERE exercise_name = 'Barbell Squats'), 1, 20),
    ((SELECT session_id FROM Training_Sessions WHERE member_id = (SELECT member_id FROM Members WHERE member_first_name = 'Lebron' AND member_last_name = 'James') AND training_length = 60), (SELECT exercise_id FROM Exercises WHERE exercise_name = 'Dumbbell Shoulder Press'), 4, 10),
    ((SELECT session_id FROM Training_Sessions WHERE member_id = (SELECT member_id FROM Members WHERE member_first_name = 'Kevin' AND member_last_name = 'Durant') AND training_length = 65), (SELECT exercise_id FROM Exercises WHERE exercise_name = 'Deadlifts'), 3, 8);
   

SET FOREIGN_KEY_CHECKS=1;
COMMIT;