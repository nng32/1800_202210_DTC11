function toISODate(date) {
    return `${date.getFullYear()}-${toTwoDigits(date.getMonth() + 1)}-${toTwoDigits(date.getDate())}`;
}

function toTwoDigits(number) {
    return number.toString().padStart(2, 0);
}

function displayCards() {
    let cardTemplate = document.getElementById("agenda-event-card");
    let category = $('#category').val();
    let showPast = $('input[type="radio"][name="btnradio"]:checked').val() == 'show-past';
    let dates = [];

    if (category == "Show All") {
        filter = ["No Category", "Event", "Training", "Ceremony"];
    }
    else {
        filter = [category]
    }

    // check if user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("Retrieving data from " + user.uid);

            db.collection("users").doc(user.uid).collection("events").orderBy("timestart").get().then(snap => {
                $("#events-group-container").empty();
                
                var i = 1;
                snap.forEach(doc => {
                    if (filter.includes(doc.data().category)) {
                        var name = doc.data().name;
                        var details = doc.data().details;
                        var location = doc.data().location;
                        var eventTimestart = doc.data().timestart.toDate();
                        var eventTimeend = doc.data().timeend.toDate();
                        var repeat = doc.data().repeat;
                        var id = doc.id;
                        console.log("Retrieved event " + id);
                        let newcard = cardTemplate.content.cloneNode(true);

                        newcard.querySelector('.card-title').innerHTML = name;
                        newcard.querySelector('.card-location').innerHTML = location;
                        newcard.querySelector('.card-text').innerHTML = details;
                        newcard.querySelector('.card-subtitle').innerHTML = `${toTwoDigits(eventTimestart.getHours())}:${toTwoDigits(eventTimestart.getMinutes())}-${toTwoDigits(eventTimeend.getHours())}:${toTwoDigits(eventTimeend.getMinutes())}`;

                        newcard.querySelector('a').onclick = () => {
                            storeEventData(id);
                        }

                        // give unique ids to all elements for future use
                        // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                        // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                        // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                        today = new Date;
                        updateDatabase = false;

                        while (toISODate(eventTimestart) < toISODate(today) && repeat != 'none') {
                            switch (repeat) {
                                case "daily":
                                    eventTimestart.setDate(eventTimestart.getDate() + 1);
                                    eventTimeend.setDate(eventTimeend.getDate() + 1);
                                    break;
                                case "weekly":
                                    eventTimestart.setDate(eventTimestart.getDate() + 7);
                                    eventTimeend.setDate(eventTimeend.getDate() + 7);
                                    break;
                                case "monthly":
                                    eventTimestart.setMonth(eventTimestart.getMonth() + 1);
                                    eventTimeend.setMonth(eventTimeend.getMonth() + 1);
                                    break;
                            }
                            updateDatabase = true;
                        }

                        if (updateDatabase) {
                            db.collection("users").doc(user.uid).collection("events").doc(doc.id).update({
                                timestart: firebase.firestore.Timestamp.fromDate(eventTimestart),
                                timeend: firebase.firestore.Timestamp.fromDate(eventTimeend)
                            })
                        }

                        if (toISODate(eventTimestart) >= toISODate(today) || showPast) {
                            // if there is no header for the event's date, create a new one
                            if (dates.includes(toISODate(eventTimestart)) == false) {
                                let newcat = document.getElementById('events-group').content.cloneNode(true);
                                newcat.querySelector('#agenda-date-header-xxxx-xx-xx').id = `agenda-date-header-${toISODate(eventTimestart)}`;
                                newcat.querySelector('#agenda-date-xxxx-xx-xx').id = `agenda-date-${toISODate(eventTimestart)}`;

                                if (toISODate(today) == toISODate(eventTimestart)) {
                                    newcat.querySelector('.events-group-date').innerHTML = 'Today';
                                }
                                else {
                                    newcat.querySelector('.events-group-date').innerHTML = `${toISODate(eventTimestart)}`;
                                }
                                document.getElementById('events-group-container').appendChild(newcat);

                                dates.push(toISODate(eventTimestart));
                            }
                        document.getElementById(`agenda-date-${toISODate(eventTimestart)}`).appendChild(newcard);
                        }
                    }
                    else {
                        console.log(`Event category ${doc.data().category} is not in ${filter}`);
                    }
                    i++;
                })
            })
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}

function displayOfficialCards() {
    let cardTemplate = document.getElementById("agenda-event-card");

    // check if user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("Retrieving data from " + user.uid);

            db.collection("events").get().then(snap => {
                var i = 1;
                snap.forEach(doc => {
                    var name = doc.data().name;
                    var details = doc.data().details;
                    var location = doc.data().location;
                    var timestart = doc.data().timestart.toDate();
                    var timeend = doc.data().timeend.toDate();
                    var id = doc.id;
                    console.log("Retrieved event " + id);
                    let newcard = cardTemplate.content.cloneNode(true);

                    newcard.querySelector('.card-title').innerHTML = name;
                    newcard.querySelector('.card-location').innerHTML = location;
                    newcard.querySelector('.card-text').innerHTML = details;
                    newcard.querySelector('.card-subtitle').innerHTML = `${timestart.getHours()}:${timestart.getMinutes()}-${timeend.getHours()}:${timeend.getMinutes()}`;

                    newcard.querySelector('a').onclick = () => {
                        storeEventData(id);
                    }

                    // give unique ids to all elements for future use
                    // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                    // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                    // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                    document.getElementById("events-container").appendChild(newcard);
                    i++;
                })
            })
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}