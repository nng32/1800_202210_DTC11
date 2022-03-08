function postEvent() {
    var name = $('.eventName').val();
    var details = $('.details').val();
    var location = $('.location').val();
    var timestart = $('.time-start').val();
    var timeend = $('.time-end').val();
    var priority = $('.priority').val();
    var category = $('.category').val();

    // check if user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("Retrieving data from " + user.uid);

            db.collection("users").doc(user.uid).collection("events").get().then(snap => {
                
            })
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}