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
                //        `<td>${response.BackgroundImage}</td>`+
                //        `</tr>`;

                //statsHTML+=`</table>`;
                //console.log(statsHTML);

                // takes the image name from the JSON string and adds it to the URL of the <body></body> tag
                document.getElementById('body').style.backgroundImage = 'url(img/'+response.BackgroundImage+')';
            }
        });
}

function rungame(){
    let locations = [
        {
            name: "Entrance hall",
            description: "You are standing in the main entrance hall of the museum. There is\n" +
                "a huge skeleton of a whale hanging from the ceiling. A grand set of\n" +
                "stairs extends up towards the spacious upper galleries. Corridors\n" +
                "extend towards the left and right. On a wide visitor desk in front\n" +
                "of you are some guidebooks. Towards the back of the hall is a large\n" +
                "wooden door with a sign reading 'staff only'. On the floor near the\n" +
                "door there is a brass coloured key.",
            directions: [
                {
                    label: "Left corridor",
                    destination: "Dinosaurs room",
                    requirement: null
                },
                {
                    label: "Right corridor",
                    destination: "Insects room",
                    requirement: null
                },
                {
                    label: "Up the stairs",
                    destination: "Gemstones room",
                    requirement: null
                },
                {
                    label: "Through the large wooden door",
                    destination: "Exhibit stores",
                    requirement: "Brass key"
                },
            ],
            items: [
                {
                    name: "Guidebook",
                    announcement: "You pick up a guidebook, the map inside could be helpful.",
                    collected: false
                },
                {
                    name: "Brass key",
                    announcement: "You pick up the brass key from the floor, you wonder who dropped it.",
                    collected: false
                },
            ]
        },

        {
            name: "Dinosaurs room",
            description: "You are greated by the roar of a mechanical T-rex that towers above\n" +
                "you as you enter. The room is filled with impressive specimins, but\n" +
                "there is nothing that furthers your quest.",
            directions: [
                {
                    label: "Back to entrance hall",
                    destination: "Entrance hall",
                    requirement: null
                },
            ],
            items: [
            ]
        },

        {
            name: "Insects room",
            description: "Amidst all the preserved beatles and elegent butterfly specimins is\n" +
                "a curious looking plastic box in the middle of the floor. It is laying on its\n" +
                "side and the lid, if there ever was one, is nowhere to be seen.",
            directions: [
                {
                    label: "Back to entrance hall",
                    destination: "Entrance hall",
                    requirement: null
                },
            ],
            items: [
                {
                    name: "Plastic box",
                    announcement: "You pick up the box. It smells musty and is slightly damp inside.",
                    collected: false
                },
            ]
        },

        {
            name: "Exhibit stores",
            description: "The key makes a satisfying sound as it turns heavily in the lock. The\n" +
                "door opens easily now, although it makes a creaking sound that\n" +
                "echos through the room beyond. You step into the room and start looking\n" +
                "around. Several minutes into your exploration, you hear footsteps.\n" +
                "You realise there is no way you can make it to the door without your\n" +
                "own footsteps being heard so you crouch down behind one of the\n" +
                "storage units with its countless wooden drawers. You think you might have\n" +
                "got away with your intrusion, but then with a sinking heart you feel a \n" +
                "strong hand grip your shoulder. You have been caught!",
            directions: [
            ],
            items: [
            ]
        },

        {
            name: "Gemstones room",
            description: "The room you find yourself in is quite dark. You can see the\n" +
                "twinkle and glisten of many gemstones in their display units, but\n" +
                "it is hard to make out which way to go next. Perhaps if you had\n" +
                "a guidebook, you could use the little light that there is from behind\n" +
                "you to make out the next route to take.",
            directions: [
                {
                    label: "Onwards into the dark",
                    destination: "Dark halls",
                    requirement: "Guidebook"
                },
                {
                    label: "Retrace your footsteps",
                    destination: "Entrance hall",
                    requirement: null
                },
            ],
            items: [
            ]
        },

        {
            name: "Dark halls",
            description: "You make it a significant way through the dark halls, thanks to what you\n" +
                "memorised from the guidebook's map earlier. You can smell the cakes\n" +
                "and coffee from the cafe on the floor below. Suddenly, a tarantula is\n" +
                "illuminated by a beam of light coming through an open window! If only you\n" +
                "had something to catch it in!",
            directions: [
                {
                    label: "Capture Tarantula",
                    destination: "Cafe",
                    requirement: "Plastic box"
                },
                {
                    label: "Flee through the window",
                    destination: "Wheely bins",
                    requirement: null
                },
            ],
            items: [
            ]
        },

        {
            name: "Cafe",
            description: "You capture the tarantula under the plastic box. With a sigh of relief you\n" +
                "continue onwards to the Cafe and enjoy a cup off coffee and a cake.\n" +
                "Congratulations, your quest ends in victory!",
            directions: [
            ],
            items: [
            ]
        },

        {
            name: "Wheely bins",
            description: "You dive out through the window and fall into the wheely bins outside.\n" +
                "Your adventure ends here!",
            directions: [
            ],
            items: [
            ]
        },



    ];

    let currentLocation = "Entrance hall";

    let inventory = [];

    main:
        while (true) {

            console.log("Current location: " + currentLocation);

            if (inventory.length > 0) {
                console.log("Inventory:");
                for (let i = 0; i < inventory.length; i++) {
                    console.log(" - " + inventory[i]);
                }
            }

            console.log("---------------------------------------------");

            for (let i = 0; i < locations.length; i++) {
                if (locations[i].name.toLowerCase() == currentLocation.toLowerCase()) {

                    console.log(locations[i].description);
                    console.log();

                    let option = 0;


                    if (locations[i].directions.length > 0) {
                        console.log("Directions:")
                        for (let j = 0; j < locations[i].directions.length; j++) {
                            option++;
                            console.log(option + ") " + locations[i].directions[j].label);
                        }
                        console.log();
                    }

                    if (locations[i].items.length > 0) {
                        console.log("Items:")
                        for (let j = 0; j < locations[i].items.length; j++) {
                            option++;
                            if (locations[i].items[j].collected) {
                                console.log(option + ") " + locations[i].items[j].name + " [Already collected]");
                            } else {
                                console.log(option + ") " + locations[i].items[j].name);
                            }
                        }
                        console.log();
                    }

                    if (option == 0) {
                        console.log("You have no options - Game over!");
                        break main;
                    }

                    let choice = Number(prompt("Please pick an option: "));

                    if (isNaN(choice)) {

                        console.log("Please enter a valid number!");

                    } else if (choice <= 0 || choice > option) {

                        console.log("Please enter a number between 1 and " + option);

                    } else if (choice > 0 && choice <= locations[i].directions.length) {

                        let requirement = locations[i].directions[choice - 1].requirement;

                        if (requirement != null) {

                            let requirementMet = false;

                            for (j = 0; j < inventory.length; j++) {
                                if (inventory[j].toLowerCase() == requirement.toLowerCase()) {
                                    requirementMet = true;
                                }
                            }

                            if (!requirementMet) {
                                console.log("You require " + requirement + " for that.");
                                console.log();
                                continue main;
                            }

                        }

                        currentLocation = locations[i].directions[choice - 1].destination;

                    } else {

                        let item = choice - locations[i].directions.length - 1;
                        if (!locations[i].items[item].collected) {

                            console.log(locations[i].items[item].announcement);
                            inventory.push(locations[i].items[item].name);
                            locations[i].items[item].collected = true;

                        } else {

                            console.log("You've already collected that item!");

                        }

                    }

                    console.log();

                    continue main;

                }
            }

            console.log("Location details not found - Game over!");
            break main;

        }
}



