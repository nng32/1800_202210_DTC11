var currentUser

function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {

        if (user) {


            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
                .then(userDoc => {

                    var userName = userDoc.data().name;
                    var userSchool = userDoc.data().school;
                    var userCity = userDoc.data().city;


                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                })
        } else {

            console.log("No user is signed in");
        }
    });
}


populateInfo();

function saveUserInfo() {
    userName = document.getElementById('nameInput').value;
    userSchool = document.getElementById('schoolInput').value;
    userCity = document.getElementById('cityInput').value;
    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity
    })
        .then(() => {
            console.log("Document successfully updated!");
        })

    document.getElementById('personalInfoFields').disabled = true;

}