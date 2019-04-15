$(function () {
  $("#modal").modal('show');
});

$('.menu-link').click(function () {
  $('.collapse').hide();
});
$('.navbar-toggler').click(function () {
  $('.collapse').show();
});



// ---------------- AUTHENTICATION STUFF STARTS HERE ----------------- // 

$("#menu-login").click(toggleSignIn, function () {
  console.log("clicky");
});

// Firebase authentication starts here
var config = {
  apiKey: "AIzaSyBVduicjSagRcZbWga7LhS6zrCIq0OZYuw",
  authDomain: "daredevils-project.firebaseapp.com",
  databaseURL: "https://daredevils-project.firebaseio.com",
  projectId: "daredevils-project",
  storageBucket: "daredevils-project.appspot.com",
  messagingSenderId: "746048417171"
};
firebase.initializeApp(config);

/**
 * Function called when clicking the Login/Logout button.
 */
// [START buttoncallback]
function toggleSignIn() {
  console.log("something else");
  if (!firebase.auth().currentUser) {
    // [START createprovider]
    console.log("something");
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
      // document.getElementById('quickstart-oauthtoken').textContent = token;
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
  // document.getElementById('quickstart-sign-in').disabled = true;
  // [END_EXCLUDE]
}
// [END buttoncallback]
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  console.log("jjj");
  // Listening for auth state changes.
  // [START authstatelistener]

  firebase.auth().onAuthStateChanged(function (user) {
    console.log("test");
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      // $("#user-avatar").attr("src", "user.photoURL");
      $("#user-avatar").append(displayName);

      console.log(displayName);


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
      $("#user-avatar").hide;
      // [END_EXCLUDE]
    }
  });
    //         // [START_EXCLUDE]
    document.getElementById('menu-login').addEventListener('click', toggleSignIn, false);
  }


  window.onload = function () {
    console.log("running");
    initApp();
    document.getElementById("customs").style.display = "none";
    document.getElementById("journal").style.display = "none";
    document.getElementById("menu-journal").style.display = "none";
  }

  // ------------ AUTHENTICATION STUFF ENDS HERE -------- //

  var weatherURL = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=";
  var weatherAPI = "Pw6sEtuGM1QQngSJFGOR9LFJLUtgnFhs";
  var fixerURL;
  var fixerAPI;
  var unsplashURL;
  var unsplashAPI;
  var triposoURL;
  var triposoAPI;
  
  var currentCity;
  var country;
  var locationKey;
  
  // =============================== Functions ===============================
  // Get info for a city.
  function getInfo(cityName) {
      $.ajax({
          url: weatherURL + weatherAPI + "&q=" + cityName,
          method: "GET"
      }).then(function (response) {
          console.log(response);
  
          country = response[0].Country.EnglishName;
          console.log("country is " + country);
          // Check if country name has culture info.
          switch (country) {
              case "Brazil":
                  console.log("it's in brazil");
                  document.getElementById("customs").style.display = "block";
                  $("#content").load("ajax/customs.html div#brazil");
                  $('#curOne>option:eq(0)').prop('selected', true);
                  $('#curOne>option:eq(1)').prop('selected', true);
                  break;
              case "Japan":
                  console.log("it's in japan");
                  document.getElementById("customs").style.display = "block";
                  //$("#customs").load("ajax/customs.html div#japan");
                  $('#curOne>option:eq(0)').prop('selected', true);
                  $('#curOne>option:eq(3)').prop('selected', true);
                  break;
              case "United Arab Emirates":
                  console.log("it's in uae");
                  document.getElementById("customs").style.display = "block";
                  $("#customs").load("ajax/customs.html div#uae");
                  break;
              case "Russia":
                  console.log("it's in russia");
                  document.getElementById("customs").style.display = "block";
                  $("#customs").load("ajax/customs.html div#russia");
                  $('#curOne>option:eq(0)').prop('selected', true);
                  $('#curOne>option:eq(2)').prop('selected', true);
                  break;
              case "Spain":
                  console.log("it's in spain");
                  document.getElementById("customs").style.display = "block";
                  $("#customs").load("ajax/customs.html div#spain");
                  $('#curOne>option:eq(0)').prop('selected', true);
                  $('#curOne>option:eq(2)').prop('selected', true);
                  break;
              default:
                  console.log("default");
                  break;
  
          }
  
          locationKey = response[0].Key;
          console.log(locationKey);
  
          var latitude = response[0].GeoPosition.Latitude;
          var longitude = response[0].GeoPosition.Longitude;
  
  
          var mymap = L.map('mapid').setView([latitude, longitude], 13);
          L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
              attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
              maxZoom: 18,
              id: 'mapbox.streets',
              accessToken: 'pk.eyJ1IjoiYXNoYW5ub24xOTkwIiwiYSI6ImNqdWg5d3E0bzB1bmE0NHMwMHB6eHphaXoifQ.gxpdB89rzE_fN7II-PhAiA'
          }).addTo(mymap);
  
          $.ajax({
              url: "http://dataservice.accuweather.com/forecasts/v1/daily/1day/" + locationKey + "?apikey=Pw6sEtuGM1QQngSJFGOR9LFJLUtgnFhs",
              method: "GET"
          }).then(function (response) {
              console.log(response);
              $("#minMax").html(response.DailyForecasts[0].Temperature.Minimum.Value + " " + response.DailyForecasts[0].Temperature.Minimum.Unit + " / " + response.DailyForecasts[0].Temperature.Maximum.Value + " " + response.DailyForecasts[0].Temperature.Maximum.Unit);
              $("#chanceRain").html(response.DailyForecasts[0].Day.IconPhrase);
              console.log(response.DailyForecasts[0].Day.RainProbability);
          });
      });
  
  
  }


$("#searchButton").on("click", function () {
  event.preventDefault();
  currentCity = $("#citySearch").val();
  $("#citySearch").val("");
  console.log("current city is " + currentCity);
  getInfo(currentCity);
});

$("#minisearchButton").on("click", function () {
  event.preventDefault();
  currentCity = $("#minicitySearch").val();
  $("#minicitySearch").val("");
  console.log("current city is " + currentCity);
  getInfo(currentCity);
});