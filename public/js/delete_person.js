/*
    Citation for the following function:
    Date: 06/07/2024
    Copied from 
    nodejs starter app on github for crud
    source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    Authors: George Kochera, Cortona1, currym-osu, dmgs11
    --}}
*/

// code for deletePerson function using jQuery
function deletePerson(personID) {
    let link = '/delete-person-ajax/';
    let data = {
      id: personID
    };
  
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            deleteRow(personID);
        }
    });
  }
  
  
  
  // //  code for deletePerson using regular javascript/xhttp
  // function deletePerson(personID) {
  //     // Put our data we want to send in a javascript object
  //     let data = {
  //         id: personID
  //     };
      
      // Setup our AJAX request
      var xhttp = new XMLHttpRequest();
      xhttp.open("DELETE", "/delete-person-ajax", true);
      xhttp.setRequestHeader("Content-type", "application/json");
  
      // Tell our AJAX request how to resolve
      xhttp.onreadystatechange = () => {
          if (xhttp.readyState == 4 && xhttp.status == 204) {
  
              // Add the new data to the table
              deleteRow(personID);
  
          }
          else if (xhttp.readyState == 4 && xhttp.status != 204) {
              console.log("There was an error with the input.")
          }
      }
      // Send the request and wait for the response
      xhttp.send(JSON.stringify(data));
  
  
  
  function deleteRow(personID) {
    let table = document.getElementById("members-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
         //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == personID) {
            table.deleteRow(i);
            break;
        }
    }
  }