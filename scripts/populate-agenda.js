function displayCards() {
    let cardTemplate = document.getElementById("agenda-event-card");

    // check if user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("Retrieving data from " + user.uid);

            db.collection("users").doc(user.uid).collection("events").get().then(snap => {
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

displayCards();