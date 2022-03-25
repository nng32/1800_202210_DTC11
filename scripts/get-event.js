let eventID = localStorage.getItem("eventID");

function postEvent() {
    var eventName = $('#eventName').val();
    var eventDetails = $('#details').val();
    var eventLocation = $('#location').val();
    var eventTimestart = new Date($('#time-start').val()); // initialize a date object using the input field's value
    var eventTimeend = new Date($('#time-end').val());
    var eventPriority = $('input[type="radio"][name="btnradio"]:checked').val();
    var eventCategory = $('#category').val();

    // check if user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("Retrieving data from " + user.uid);

            $('#form-submit').attr("value", "Saving");

            db.collection("users").doc(user.uid).collection("events").doc(eventID).update({
                name: eventName,
                details: eventDetails,
                location: eventLocation,
                timestart: firebase.firestore.Timestamp.fromDate(eventTimestart), // convert date object to seconds
                timeend: firebase.firestore.Timestamp.fromDate(eventTimeend),
                priority: eventPriority,
                category: eventCategory
            }).then(() => {
                alert("Events have been updated.");
                window.location.href = "../main.html";
            })
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}

function retrieveEvent() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("events").doc(eventID).get().then(events => {
                $('#eventName').val(events.data().name);
                $('#details').val(events.data().details);
                $('#location').val(events.data().location);
                $('#time-start').val(events.data().timestart.toDate().toISOString().slice(0, 16));
                $('#time-end').val(events.data().timeend.toDate().toISOString().slice(0, 16));
                $(`#btnradio${events.data().priority}`).prop("checked", true);
                $('#category').val(events.data().category);
            })
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}

function deleteEvent() {
    $('#btn-delete').attr("value", "Deleting");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("events").doc(eventID).delete().then(() => {
                alert("Event has been deleted.");
                window.location.href="../main.html"
            })
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}

function getEventDetails() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).collection("events").doc(eventID).get().then(events => {
                $('#eventName').html(events.data().name);
                $('#details').html(events.data().details);
                $('#location').html(events.data().location);
                $('#time').html(`${events.data().timestart.toDate().getHours()}:${events.data().timestart.toDate().getMinutes()}-${events.data().timeend.toDate().getHours()}:${events.data().timeend.toDate().getMinutes()}`);
                $('#category').html(events.data().category);
            })
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}

function getOfficialEventDetails() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("events").doc(eventID).get().then(events => {
                $('#eventName').html(events.data().name);
                $('#details').html(events.data().details);
                $('#location').html(events.data().location);
                $('#time').html(`${events.data().timestart.toDate().getHours()}:${events.data().timestart.toDate().getMinutes()}-${events.data().timeend.toDate().getHours()}:${events.data().timeend.toDate().getMinutes()}`);
                $('#category').html(events.data().category);
            })
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}

function copyEventToPersonal() {

    // check if user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("Retrieving data from " + user.uid);

            db.collection("events").doc(eventID).get().then(toRetrieve => {
                db.collection("users").doc(user.uid).collection("events").add({
                    name: toRetrieve.data().name,
                    details: toRetrieve.data().details,
                    location: toRetrieve.data().location,
                    timestart: toRetrieve.data().timestart,
                    timeend: toRetrieve.data().timeend,
                    priority: "3",
                    category: toRetrieve.data().category
                }).then(doc => {
                    alert("Event has been retrieved.");
                    localStorage.setItem("eventID", doc.id)
                    window.location.href = "../events/modify-details.html";
                })                
            });
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}