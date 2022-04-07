let nav = 0;
let clicked = null;
/*let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];*/



const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];




function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);


  document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;


  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');


    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }


    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);
  }
}


function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('quickaddButton').addEventListener('click', () => { window.location.href = "/events/modify-details.html" });
  document.getElementById('todayButton').addEventListener('click', () => { window.location.href = "/main.html" });

}



initButtons();
load();

function getuserevent() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      console.log(user.uid);

      currentUser = db.collection("users").doc(user.uid).collection("events").doc(eventID).get().then(events => {
        var eventtime = events.data().timestart;
        var eventname = events.data().name;
        console.log(eventtime, eventname)
        })
    } else {
      alert("Failed to retrieve data. Please check to make sure you are signed in.");
    }
  });
}
getuserevent();