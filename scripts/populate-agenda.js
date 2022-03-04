function displayCards() {
    let cardTemplate = document.getElementById("agenda-event-card");

    // user is currently hardcoded!!
    db.collection("users").doc("8WRf773RjVaETBZjvf6n97JVJOg2").collection("events").get().then(snap => {
        var i = 1;
        snap.forEach(doc => {
            var name = doc.data().name;
            var details = doc.data().details;
            var location = doc.data().location;
            var timestart = doc.data().timestart;
            var timeend = doc.data().timeend;
            let newcard = cardTemplate.content.cloneNode(true);

            newcard.querySelector('.card-title').innerHTML = name;
            newcard.querySelector('.card-location').innerHTML = location;
            newcard.querySelector('.card-text').innerHTML = details;

            // give unique ids to all elements for future use
            // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
            // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
            // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

            document.getElementById("events-container").appendChild(newcard);
            i++;
        })
    })
}

displayCards();