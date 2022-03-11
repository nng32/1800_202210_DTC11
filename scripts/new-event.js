function newEvent() {

    // check if user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("Retrieving data from " + user.uid);

            db.collection("users").doc(user.uid).collection("events").add({
                name: "",
                details: "",
                location: "",
                timestart: firebase.firestore.Timestamp.now(), // convert date object to seconds
                timeend: firebase.firestore.Timestamp.now(),
                priority: "3",
                category: "No Category"
            }).then(doc => {
                alert("Event has been added.");
                localStorage.setItem("eventID", doc.id)
                window.location.href = "../events/modify-details.html";
            })
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}