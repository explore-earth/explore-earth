$(function () {
  $("#modal").modal('show');
});

$('.menu-link').click(function () {
  $('.collapse').hide();
});
$('.navbar-toggler').click(function () {
  $('.collapse').show();
});
// Firebase authentication starts here
var config = {
  apiKey: "AIzaSyD1z4ChJJE8vLLLZ7MJYYoltlNrlTbzWjM",
  authDomain: "explore-earth.firebaseapp.com",
  databaseURL: "https://explore-earth.firebaseio.com",
  projectId: "explore-earth",
  storageBucket: "",
  messagingSenderId: "906400318574"
};
firebase.initializeApp(config);

/**
 * Function called when clicking the Login/Logout button.
 */
// [START buttoncallback]
function toggleSignIn() {
  if (!firebase.auth().currentUser) {
    // [START createprovider]
    var provider = new firebase.auth.GoogleAuthProvider();
    // [END createprovider]
    // [START addscopes]
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // [END addscopes]
    // [START signin]
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // [START_EXCLUDE]
      //           document.getElementById('quickstart-oauthtoken').textContent = token;
      // [END_EXCLUDE]
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // [START_EXCLUDE]
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
      // [END_EXCLUDE]
    });
    // [END signin]
  } else {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  }
  // [START_EXCLUDE]
  //       document.getElementById('quickstart-sign-in').disabled = true;
  // [END_EXCLUDE]
}
// [END buttoncallback]
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var photoURL = $("<img>");
      $("#user-avatar").attr("src", "user.photoURL");
      $("#user-avatar").append(photoURL);
      //           var email = user.email;
      //           var emailVerified = user.emailVerified;
      //           var photoURL = user.photoURL;
      //           var isAnonymous = user.isAnonymous;
      //           var uid = user.uid;
      //           var providerData = user.providerData;
      // [START_EXCLUDE]
      //           document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      //           document.getElementById('quickstart-sign-in').textContent = 'Sign out';
      //           document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
      // [END_EXCLUDE]
    } else {
      // User is signed out.
      // [START_EXCLUDE]
      $("#user-avatar").empty;
      // [END_EXCLUDE]
    }
    //         // [START_EXCLUDE]
    document.getElementById('modalSubmit').addEventListener('click', toggleSignIn, false);
  });
  window.onload = function () {
    initApp();
  }
}

// map starts here

$(document).on("click", "#searchButton", function(){
  event.preventDefault();
  var citySearch = $("#citySearch").val().trim();
  console.log(citySearch);
  var accuweatherAPIKey = "apikey=lue324tsUBanyvWs01vc8PzYvcl2CqAQ";
  var locationQueryURL = "https://dataservice.accuweather.com/locations/v1/cities/search?q=" + citySearch + "&" + accuweatherAPIKey;
  console.log(locationQueryURL)
  $.ajax({
    url: locationQueryURL,
    method: "GET"
  }) .then(function(response) {
    console.log(response)
    var latitude = response[0].GeoPosition.Latitude;
    var longitude = response[0].GeoPosition.Longitude;
    
    var mymap = L.map('mapid').setView([latitude, longitude], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiYXNoYW5ub24xOTkwIiwiYSI6ImNqdWg5d3E0bzB1bmE0NHMwMHB6eHphaXoifQ.gxpdB89rzE_fN7II-PhAiA'
    }).addTo(mymap);
})
})
$(document).on("click", "#dropdownSearchButton", function(){
  event.preventDefault();
  var citySearch = $("#dropdownCitySearch").val();
  console.log(citySearch);
  var accuweatherAPIKey = "apikey=lue324tsUBanyvWs01vc8PzYvcl2CqAQ";
  var locationQueryURL = "https://dataservice.accuweather.com/locations/v1/cities/search?q=" + citySearch + "&" + accuweatherAPIKey;
  $.ajax({
    url: locationQueryURL,
    method: "GET"
  }) .then(function(response) {
    console.log(response)
    var latitude = response[0].GeoPosition.Latitude;
    var longitude = response[0].GeoPosition.Longitude;
    
    var mymap = L.map('mapid').setView([latitude, longitude], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiYXNoYW5ub24xOTkwIiwiYSI6ImNqdWg5d3E0bzB1bmE0NHMwMHB6eHphaXoifQ.gxpdB89rzE_fN7II-PhAiA'
    }).addTo(mymap);
})
})