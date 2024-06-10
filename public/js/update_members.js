/*
    Citation for the following function:
    Date: 06/07/2024
    Copied from 
    nodejs starter app on github for crud
    source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    Authors: George Kochera, Cortona1, currym-osu, dmgs11
*/

// Get the objects we need to modify
let updateMember = document.getElementById('update-person-form-ajax');

// Modify the objects we need
updateMember.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullname = document.getElementById("mySelect");
    let inputFirstName = document.getElementById("input-fname-update");
    let inputLastName = document.getElementById("input-lname-update");
    let inputEmail = document.getElementById("input-email-update");
    let inputAddress = document.getElementById("input-address-update");
    let inputPhone = document.getElementById("input-phone-update");
    let inputTrainerID = document.getElementById("input-trainer-id-update");

    // Get the values from the form fields
    let fullnameValue = inputFullname.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let emailValue = inputEmail.value;
    let addressValue = inputAddress.value;
    let phoneValue = inputPhone.value;
    let trainerIDValue = inputTrainerID.value;

    // Ensure member ID is valid
    if (isNaN(fullnameValue)) {
        console.log("Invalid member ID");
        return;
    }



    let data = {
        member_id: fullnameValue,
        first_name: firstNameValue,
        last_name: lastNameValue,
        email: emailValue,
        address: addressValue,
        phone: phoneValue,
        trainer_id: trainerIDValue
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-member-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(data, fullnameValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

function updateRow(data, memberID) {
    let parsedData = data;

    let table = document.getElementById("members-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == memberID) {
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let firstNameTd = updateRowIndex.getElementsByTagName("td")[1];
            let lastNameTd = updateRowIndex.getElementsByTagName("td")[2];
            let emailTd = updateRowIndex.getElementsByTagName("td")[3];
            let addressTd = updateRowIndex.getElementsByTagName("td")[4];
            let phoneTd = updateRowIndex.getElementsByTagName("td")[5];
            let trainerTd = updateRowIndex.getElementsByTagName("td")[6];

            firstNameTd.innerHTML = parsedData.first_name;
            lastNameTd.innerHTML = parsedData.last_name;
            emailTd.innerHTML = parsedData.email;
            addressTd.innerHTML = parsedData.address;
            phoneTd.innerHTML = parsedData.phone;
            trainerTd.innerHTML = parsedData.trainer_id ? parsedData.trainer_id : "No Trainer";
        }
    }
    location.reload();
}
