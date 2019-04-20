// ========================================= Variables =========================================

var weatherIndex = 0;
var weatherURL = "https://dataservice.accuweather.com/locations/v1/cities/search?apikey=";
var weatherAPI = ["Pw6sEtuGM1QQngSJFGOR9LFJLUtgnFhs", "X9amRPkYQjYDGGTYwGOq0VnljW2GJORA", "CcCG2hUBsdGosoMYp4UTzeMLh0VHSgsj", "uwu2fjRO7VYtbr9dCRkykSPy7wJOn3cF"];
var currencyURL = "https://free.currconv.com";
var currencyAPI = "a9b78f09163befb57ad2";
var restURL = "https://restcountries.eu/rest/v2/name/";

var currentCity;
var country;
var locationKey;
var currencyCode;
var currencySwitch = false;
var conversionOrder;
var amountEntered;
var conversionRate;
var mathResult;
var mymap = "";

//Variables for errors.
var jqXHR, textStatus, errorThrown;



$(function () {
  $("#modal").modal('show');
});

$('.menu-link').click(function () {
  $('.collapse').hide();
});
$('.navbar-toggler').click(function () {
  if ($(".collapse").is(":visible")) {
    $('.collapse').hide();
  }
  else {
    $('.collapse').show();
  }
});


// ---------------- AUTHENTICATION STUFF STARTS HERE ----------------- // 

var selectedFile;
var journalEntryInput = document.getElementById("journal-entry-text");
var locationInput = document.getElementById("location");

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

firebase.auth().onAuthStateChanged(function (user) {
  console.log(user);
  if (user) {
    console.log('We have a user');
    user.uid;
    console.log("user id is " + user.uid);
    var photoURL = $("<img>");
    photoURL.attr("src", user.photoURL);
    photoURL.attr("class", "google-avatar");
    photoURL.css({ "width": "7%", "height": "7%", "border-radius": "50%" });
    $("#user-avatar").append(photoURL);
    document.getElementById("journal").style.display = "block";
    document.getElementById("menu-journal").style.display = "block";
    document.getElementById("menu-login").style.display = "none";
    document.getElementById("menu-logout").style.display = "block";
    document.getElementById("user-avatar").style.display = "block";
    queryDatabase();
    updateDOM();



  } else {
    console.log("We don't have a user");
    $("#user-avatar").hide;
    document.getElementById("customs").style.display = "none";
    document.getElementById("journal").style.display = "none";
    document.getElementById("menu-journal").style.display = "none";
    document.getElementById("menu-logout").style.display = "none";
    document.getElementById("menu-login").style.display = "block";
    document.getElementById("user-avatar").style.display = "none";
  }
});



$("#menu-login").on('click', function () {
  console.log('this button works');
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  firebase.auth().signInWithPopup(provider)
    .then(function (user) {
      
      console.log(user);
    }).catch(function (error) {
      console.log(error);
    })
});

$("#menu-logout").on('click', function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  console.log('logout works');
  firebase.auth().signOut().then(function () {
    document.getElementById("customs").style.display = "none";
    document.getElementById("journal").style.display = "none";
    document.getElementById("menu-journal").style.display = "none";
    document.getElementById("menu-login").style.display = "block";
    location.reload();
    $("#user-avatar").empty;
  })
});


window.onload = function () {
  console.log("running");
  document.getElementById("customs").style.display = "none";
  document.getElementById("journal").style.display = "none";
  document.getElementById("menu-journal").style.display = "none";
  document.getElementById("upload").addEventListener('change', handleFileSelect, false);
  
}

$("#upload-journal-entry").on('click', function () {
  confirmUpload();
  updateDOM();
  
});


// ------------ AUTHENTICATION STUFF ENDS HERE -------- //

// ------------ JOURNAL STORAGE AND DATABASE STUFF STARTS HERE -------- //
var database = firebase.database();
function handleFileSelect(event) {
  selectedFile = event.target.files[0];
};

console.log("end of handleFile");


function confirmUpload() {
  var uid = firebase.auth().currentUser.uid;
  var metadata = {
    contentType: 'image',
    customMetadata: {
      'location': $("#location").val(),
      'entry': $("#journal-entry-text").val(),
    },
  };
  console.log("end of confirmupload");
  var storageRef = firebase.storage().ref('users/' + uid + '/travelImages/' + selectedFile.name);
  var uploadTask = storageRef.put(selectedFile, metadata);
  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', function (snapshot) {
    // Observe state change events such as progress, pause, and resume
    // See below for more detail
  }, function (error) {
    // Handle unsuccessful uploads
  }, function () {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    var postKey = database.ref('users/' + uid + '/Posts/').push().key;
    var downloadURL = uploadTask.snapshot.downloadURL;
    var urlPromise = storageRef.getDownloadURL().then(function (url) {
      console.log(url);
      var postData = {
        url, //we need to find a way to pass this, so that we can call it back later in the queryDatabase function
        journalEntry: $("#journal-entry-text").val().trim(),
        location: $("#location").val().trim()
      };
      $("#upload-journal-entry")[0].after("Upload successful! Refresh the page to see your post.");
      var updates = {};
      updates['users/' + uid + '/Posts/' + postKey] = postData;
      updateDOM(postData)
      return database.ref().update(updates);
    });
  });
}

function updateDOM(postData) {

}

console.log('does it work here?');

function queryDatabase() {
  
  var uid = firebase.auth().currentUser.uid;
  // $("#journal-display").html("");
  database.ref('users/' + uid + '/Posts/').once('value').then(function (snapshot) {
    var postObject = snapshot.val();
    console.log("postobject goes here " + postObject);
    var keys = Object.keys(postObject);
    console.log("keys go here " + keys);

    console.log("before for loop");
    for (var i = 0; i < keys.length; i++) {
      var locationRow = $("<div>").addClass("row location-row");
      var currentRow = $("<div>").addClass("row content-row");
      var currentObject = postObject[keys[i]];

      var colOdd = $("<div>").addClass("col-md-6 column-odd");
      var colEven = $("<div>").addClass("col-md-6 column-even");
      
      var travelImage = $("<img>");
      travelImage.css({
        "width":"90%",
        "height":"81%"
      
      })

      var travelDiv = $("<div>").html(currentObject.journalEntry);

      if (i % 2 === 0) {
        travelImage.addClass("contentImageEven");
        travelDiv.addClass("JournalcontentEven");
        colEven.append(travelImage);
        colOdd.append(travelDiv);
      } else {
        travelImage.addClass("contentImageOdd");
        travelDiv.addClass("JournalcontentOdd");
        colOdd.append(travelImage);
        colEven.append(travelDiv);
      }
      travelImage.attr("src", currentObject.url);
      var travelLocation = $("<p>").addClass("contentLocation").html(currentObject.location);
      
      locationRow.append(travelLocation);
      currentRow.append(colOdd);
      currentRow.append(colEven);
      locationRow.append(currentRow);
      $("#journal-display").append(locationRow);
      
    }


  });
  
}


// ------------------ JOURNAL STORAGE ENDS HERE ------------------- //

// =============================== Functions ===============================
// Get info for a city.
function getInfo(cityName) {
  $.ajax({
    url: weatherURL + weatherAPI[weatherIndex] + "&q=" + cityName,
    method: "GET"
  }).then(function (response) {
    console.log(response);

    country = response[0].Country.EnglishName;
    console.log("country is " + country);
    // Check if country name has culture info.
    switch (country) {
      case "Brazil":
        console.log("it's in brazil");
        // Show customs
        document.getElementById("customs").style.display = "block";

        // Show customs for Brazil while hiding others
        document.getElementById("brazil").style.display = "inline";
        document.getElementById("japan").style.display = "none";
        document.getElementById("uae").style.display = "none";
        document.getElementById("russia").style.display = "none";
        document.getElementById("spain").style.display = "none";


        break;
      case "Japan":
        console.log("it's in japan");
        // Show customs
        document.getElementById("customs").style.display = "block";

        // Show customs for Japan while hiding others
        document.getElementById("brazil").style.display = "none";
        document.getElementById("japan").style.display = "inline";
        document.getElementById("uae").style.display = "none";
        document.getElementById("russia").style.display = "none";
        document.getElementById("spain").style.display = "none";

        break;
      case "United Arab Emirates":
        console.log("it's in uae");
        // Show customs
        document.getElementById("customs").style.display = "block";

        // Show customs for UAE while hiding others
        document.getElementById("brazil").style.display = "none";
        document.getElementById("japan").style.display = "none";
        document.getElementById("uae").style.display = "block";
        document.getElementById("russia").style.display = "none";
        document.getElementById("spain").style.display = "none";

        break;
      case "Russia":
        console.log("it's in russia");

        // Show customs
        document.getElementById("customs").style.display = "block";

        // Show customs for Russia while hiding others
        document.getElementById("brazil").style.display = "none";
        document.getElementById("japan").style.display = "none";
        document.getElementById("uae").style.display = "none";
        document.getElementById("russia").style.display = "block";
        document.getElementById("spain").style.display = "none";

        break;
      case "Spain":
        console.log("it's in spain");
        // Show customs
        document.getElementById("customs").style.display = "block";


        // Show customs for Spain while hiding others
        document.getElementById("brazil").style.display = "none";
        document.getElementById("japan").style.display = "none";
        document.getElementById("uae").style.display = "none";
        document.getElementById("russia").style.display = "none";
        document.getElementById("spain").style.display = "block";

        break;
      default:
        console.log("default");
        // Hide customs
        document.getElementById("customs").style.display = "none";

        break;

    }

    locationKey = response[0].Key;
    console.log(locationKey);

    latitude = response[0].GeoPosition.Latitude;
    longitude = response[0].GeoPosition.Longitude;

    console.log("Long = " + longitude + " and Lat = " + latitude);

    if (mymap === "") {
      console.log("No map. Making one.")
      mymap = L.map('mapid').setView([latitude, longitude], 13);
      L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=XdhgrAfqYi4JNSz69hFd', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYXNoYW5ub24xOTkwIiwiYSI6ImNqdWg5d3E0bzB1bmE0NHMwMHB6eHphaXoifQ.gxpdB89rzE_fN7II-PhAiA'
      }).addTo(mymap);
    }
    else {
      console.log("Map exists.")
      mymap.panTo([latitude, longitude])
    }
    console.log("Post map log");


    // Get currency code and set up the calculator.
    $.ajax({
      url: restURL + country,
      method: "GET"
    }).then(function (response) {
      currencyCode = response[0].currencies[0].code;
      $("#resultCurrency").text(currencyCode);
      $("#enteredCurrency").text("USD");
      currencySwitch = false;
      console.log("currency code is " + currencyCode);
    });

    $.ajax({
      url: "https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locationKey + "?apikey=" + weatherAPI[weatherIndex],
      method: "GET"
    }).then(function (response) {
      console.log(response);



      $("#icon0").html("<img src='assets/images/" + response.DailyForecasts[0].Day.Icon + ".png'>");
      $("#minMax0").html(response.DailyForecasts[0].Temperature.Maximum.Value + " " + response.DailyForecasts[0].Temperature.Maximum.Unit + " / " + response.DailyForecasts[0].Temperature.Minimum.Value + " " + response.DailyForecasts[0].Temperature.Minimum.Unit);
      $("#chanceRain0").html(response.DailyForecasts[0].Day.IconPhrase);
      console.log(response.DailyForecasts[0].Day.RainProbability);


      $("#icon1").html("<img src='assets/images/" + response.DailyForecasts[1].Day.Icon + ".png'>");
      $("#minMax1").html(response.DailyForecasts[1].Temperature.Maximum.Value + " " + response.DailyForecasts[1].Temperature.Maximum.Unit + " / " + response.DailyForecasts[1].Temperature.Minimum.Value + " " + response.DailyForecasts[1].Temperature.Minimum.Unit);
      $("#chanceRain1").html(response.DailyForecasts[1].Day.IconPhrase);
      console.log(response.DailyForecasts[1].Day.RainProbability);

      var date2 = response.DailyForecasts[2].Date.slice(5, 10);
      $("#icon2").html("<img src='assets/images/" + response.DailyForecasts[2].Day.Icon + ".png'>");
      $("#date-2").html(date2);
      $("#minMax2").html(response.DailyForecasts[2].Temperature.Maximum.Value + " " + response.DailyForecasts[2].Temperature.Maximum.Unit + " / " + response.DailyForecasts[2].Temperature.Minimum.Value + " " + response.DailyForecasts[2].Temperature.Minimum.Unit);
      $("#chanceRain2").html(response.DailyForecasts[2].Day.IconPhrase);
      console.log(response.DailyForecasts[2].Day.RainProbability);

    });
  }).fail(function (jqXHR, textStatus, errorThrown) {
      if(textStatus != undefined){
      weatherIndex++;
      getInfo(currentCity);
      console.log("Error: " + textStatus + " : " + errorThrown) ;
      }
      else{
        console.log("Error is undefined, searched for a city that doesn't exist!")
      }
    });


}


$("#searchButton").on("click", function () {
  event.preventDefault();
  currentCity = $("#citySearch").val();
  $("#citySearch").val("");
  console.log("current city is " + currentCity);
  getInfo(currentCity);
});

$("#dropdownSearchButton").on("click", function () {
  event.preventDefault();
  currentCity = $("#dropdownCitySearch").val();
  $("#dropdownCitySearch").val("");
  console.log("current city is " + currentCity);
  getInfo(currentCity);
});


$("#modal .input-group button").on("click", function () {
  event.preventDefault();
  currentCity = $("#modal #modalcitySearch").val();
  $("#modal #modalcitySearch").val("");
  console.log("current city is " + currentCity);
  getInfo(currentCity);
});



// Calculate the currency conversion.
$("#currencyCalc").on("click", function () {
  event.preventDefault();
  var currencyOne, currencyTwo;
  currencyOne = $("#enteredCurrency").text();
  currencyTwo = $("#resultCurrency").text();

  // Get currancy exchanges from api.
  $.ajax({
    url: currencyURL + "/api/v7/convert?q=" + currencyOne + "_" + currencyTwo + "," + currencyTwo + "_" + currencyOne + "&compact=ultra&apiKey=" + currencyAPI,
    method: "GET"
  }).then(function (response) {
    conversionOrder = currencyOne + "_" + currencyTwo;
    amountEntered = (parseFloat($("#inputCurrency").val()));
    conversionRate = response[conversionOrder];
    mathResult = amountEntered * conversionRate;
    $("#resultLabel").text(mathResult);
  });
});

// Switch the currency labels.
$("#currencySwitch").on("click", function () {
  event.preventDefault();
  currencySwitch = !currencySwitch;
  if (currencySwitch) {
    $("#resultCurrency").text("USD");
    $("#enteredCurrency").text(currencyCode);
  }
  else {
    $("#resultCurrency").text(currencyCode);
    $("#enteredCurrency").text("USD");
  }

  $("#currencyCalc").trigger("click");
});

var fourSQAPIkey = "HJK3OU0TNHXQVAXAQXHQIGVD4RCLOG0BKRHWPETP3BPOCK5T"
var secretFourSQKey = "IKHAACA1DLO31ZYDKUSMPPJHEFHJ1ORHPISRKAUUNLFJMZY4";
$("#restaurantSearchBtn").on("click", function(){
  
  event.preventDefault();
  var searchQuery = $("#restaurantSearch").val()
  console.log(currentCity)
  $.ajax({
    url: "https://api.foursquare.com/v2/venues/search?client_id=" + fourSQAPIkey + "&client_secret=" + secretFourSQKey + "&ll=" + latitude + "," + longitude + "&query=" + searchQuery + "&v=20190419",
    method: "GET"
  }).then(function (response) {
    console.log(response);
    console.log(response.response.venues[0].location.lat);
    var marker1 = L.marker([response.response.venues[0].location.lat, response.response.venues[0].location.lng]).addTo(mymap);
    var marker2 = L.marker([response.response.venues[1].location.lat, response.response.venues[1].location.lng]).addTo(mymap);
    var marker3 = L.marker([response.response.venues[2].location.lat, response.response.venues[2].location.lng]).addTo(mymap);
    var marker4 = L.marker([response.response.venues[3].location.lat, response.response.venues[3].location.lng]).addTo(mymap);
    var marker5 = L.marker([response.response.venues[4].location.lat, response.response.venues[4].location.lng]).addTo(mymap);
     marker1.bindPopup(response.response.venues[0].name + "<br> Address: " + response.response.venues[0].location.formattedAddress).openPopup();
    marker2.bindPopup(response.response.venues[1].name + "<br> Address: " + response.response.venues[1].location.formattedAddress);
    marker3.bindPopup(response.response.venues[2].name + "<br> Address: " + response.response.venues[2].location.formattedAddress);
    marker4.bindPopup(response.response.venues[3].name + "<br> Address: " + response.response.venues[3].location.formattedAddress);
    marker5.bindPopup(response.response.venues[4].name + "<br> Address: " + response.response.venues[4].location.formattedAddress);
    
   
})
  searchQuery = $("#restaurantSearch").val("");
})
