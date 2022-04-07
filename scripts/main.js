function storeEventData(id) {
    localStorage.setItem("eventID", id);
    console.log(`Data for ${id} has been stored.`)
}

function displayUserName() {
    // check if user is signed in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).get().then(userDoc => {
                $('#notifier').html(`Welcome, ${userDoc.data().name}!`);
                console.log(userDoc.data().name);
            })
        }
        else {
            alert("Failed to retrieve data. Please check to make sure you are signed in.");
        }
    })
}