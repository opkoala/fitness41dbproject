
-------------------------------------------
-- Trainers Crud Operations 
-------------------------------------------

-- Select Trainers  
SELECT * FROM Trainers;

-- Insert Trainer 
INSERT INTO Trainers (
    trainer_first_name, 
    trainer_last_name, 
    experience,
     title) 
VALUES
 (:input-fname, :input-lname,  :experience, :input-title);
    



-------------------------------------------
-- Members crud Operations
-------------------------------------------
-- Select Members and Trainers
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

SELECT trainer_id, trainer_first_name, trainer_last_name FROM Trainers;

-- Insert a new member  
INSERT INTO Members (
    member_first_name, 
    member_last_name, 
    member_email, 
    member_address, 
    member_phone, 
    trainer_id) 
VALUES
 (:first_name,:last_name, :email, :address, :phone, :trainer_id);


 -- Delete a member
DELETE FROM Members WHERE member_id = :member_id_input

 -- Update members information 
 UPDATE Members 
        SET 
            member_first_name = :first_name, 
            member_last_name = :last_name, 
            member_email = :email, 
            member_address = :address, 
            member_phone = :phone, 
            trainer_id = :trainer_id
        WHERE 
            member_id = :member_id


-------------------------------------------
-- Exercises crud operations
-------------------------------------------

-- Select a new exercise 
SELECT * FROM Exercises; 

-- Insert a new Exercise
INSERT INTO Exercises (
    exercise_name,
     description) 
     VALUES 
     (:input-ename, :input-description);


-------------------------------------------
--Training_Sessions crud operations 
-------------------------------------------

-- Select Training_Sessions, member_id, and trainer_id
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

SELECT 
member_id, 
member_first_name,
member_last_name FROM Members;

SELECT 
trainer_id, 
trainer_first_name, 
trainer_last_name FROM Trainers;


-- Insert into Training_Sessions
INSERT INTO Training_Sessions (
    member_id,
    training_length,
    trainer_id) 
VALUES member_id, training_length, trainer_id;


-------------------------------------------
-- Session_Exercises crud operations: many to many relationship
-------------------------------------------

-- Select Session_Exercises, exercise_id, and session_id
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

  SELECT 
   exercise_id, exercise_name 
  FROM Exercises

  SELECT session_id 
  FROM Training_Sessions


-- Insert into Session_Exercises

INSERT INTO Session_Exercises (
    session_id, 
    exercise_id,
     set_num, 
     set_rep) 
VALUES session_id, :exercise_id, :set_num, :set_rep


--Delete Session_Exercises
 DELETE FROM Session_Exercises 
    WHERE session_exercises_id = session_exercises_id_input

--Update Session_Exercises
 UPDATE Session_Exercises 
    SET session_id = session_id_input, exercise_id = exercise_id_input, set_num = set_num_input, set_rep = set_rep_input
    WHERE session_exercises_id = session_exercises_id_input;

--Update Session_Exercises to include exercise_name
SELECT 
    Session_Exercises.session_id AS session, 
    Session_Exercises.exercise_id AS exercise, 
    Exercises.exercise_name, 
    Session_Exercises.set_num, 
    Session_Exercises.set_rep 
FROM 
    Session_Exercises
JOIN 
    Exercises 
ON 
    Session_Exercises.exercise_id = Exercises.exercise_id
WHERE 
    Session_Exercises.session_exercises_id = session_exercises_id_input;




