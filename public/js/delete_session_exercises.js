function deleteSessionExercise(session_exercises_id) {
    let link = '/delete-session-exercise-ajax/';
    let data = {
      session_exercises_id: session_exercises_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(session_exercises_id);
      }
    });
  }
  
  function deleteRow(session_exercises_id){
      let table = document.getElementById("session-exercises-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == session_exercises_id) {
              table.deleteRow(i);
              deleteDropDownMenu(session_exercises_id);
              break;
         }
      }
  }

  function deleteDropDownMenu(session_exercises_id){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(session_exercises_id)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }