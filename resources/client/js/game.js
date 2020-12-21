function getProgress(){
        console.log("Invoked getProgress()");     //console.log your BFF for debugging client side
        //const UserID = document.getElementById("UserID").value;  //get the UserId from the HTML element with id=UserID
    //let UserID = 1; 			  //You could hard code it if you have problems
        //debugger;				  //debugger statement to allow you to step through the code in console dev F12
        const url = "/Users/getProgress/";       // API method on webserver
        fetch(url, {                // UserID as a path parameter
            method: "POST",
        }).then(response => {
            return response.json();                         //return response to JSON
        }).then(response => {
            if (response.hasOwnProperty("Error")) {         //checks if response from server has an "Error"
                alert(JSON.stringify(response));            // if it does, convert JSON object to string and alert
            } else {
                //document.getElementById("DisplayOneUser").innerHTML = response.UserID + " " + response.UserName;  //output data

                // this builds the HTML to be displayed on the page in the <div></div>
                // block with an ID 'stats'
                //statsHTML = `<table>`;
                //statsHTML += `<tr><th>Health</th><th>Stamina</th><th>Score</th><th>Image</th>`
                //statsHTML += `<tr>`+
                //        `<td>${response.Health}</td>`+
                //        `<td>${response.Stamina}</td>`+
                //        `<td>${response.Score}</td>`+
                //        `<td>${response.ImageName}</td>`+
                //        `</tr>`;

                //statsHTML+=`</table>`;
                //console.log(statsHTML);
                document.getElementById('body').style.backgroundImage = 'url(img/'+response.ImageName+')';
            }
        });
}

