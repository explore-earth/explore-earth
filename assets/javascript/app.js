// ========================================= Varriables =========================================

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
  $('.collapse').show();
});



// ---------------- AUTHENTICATION STUFF STARTS HERE ----------------- // 

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
    var photoURL = $("<img>");
    photoURL.attr("src", user.photoURL);
    photoURL.attr("class", "google-avatar");
    photoURL.css({ "width": "7%", "height": "7%", "border-radius": "50%" });
    $("#user-avatar").append(photoURL);
    // var displayName = user.displayName;
    // $("#user-avatar").append(displayName); //this does not work yet
    document.getElementById("journal").style.display = "block";
    document.getElementById("menu-journal").style.display = "block";
    document.getElementById("menu-login").style.display = "none";
    document.getElementById("menu-logout").style.display = "block";



  } else {
    console.log("We don't have a user");
    $("#user-avatar").hide; ////this does not work yet
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
  })
});


window.onload = function () {
  console.log("running");
  document.getElementById("customs").style.display = "none";
  document.getElementById("journal").style.display = "none";
  document.getElementById("menu-journal").style.display = "none";
}

// ------------ AUTHENTICATION STUFF ENDS HERE -------- //

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

    var latitude = response[0].GeoPosition.Latitude;
    var longitude = response[0].GeoPosition.Longitude;

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
      url: "https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locationKey + "?apikey=Pw6sEtuGM1QQngSJFGOR9LFJLUtgnFhs",
      method: "GET"
    }).then(function (response) {
      console.log(response);



      $("#icon0").html("<img src='assets/images/" + response.DailyForecasts[0].Day.Icon + ".png'>");
      $("#minMax0").html(response.DailyForecasts[0].Temperature.Minimum.Value + " " + response.DailyForecasts[0].Temperature.Minimum.Unit + " / " + response.DailyForecasts[0].Temperature.Maximum.Value + " " + response.DailyForecasts[0].Temperature.Maximum.Unit);
      $("#chanceRain0").html(response.DailyForecasts[0].Day.IconPhrase);
      console.log(response.DailyForecasts[0].Day.RainProbability);


      $("#icon1").html("<img src='assets/images/" + response.DailyForecasts[1].Day.Icon + ".png'>");
      $("#minMax1").html(response.DailyForecasts[1].Temperature.Minimum.Value + " " + response.DailyForecasts[1].Temperature.Minimum.Unit + " / " + response.DailyForecasts[1].Temperature.Maximum.Value + " " + response.DailyForecasts[1].Temperature.Maximum.Unit);
      $("#chanceRain1").html(response.DailyForecasts[1].Day.IconPhrase);
      console.log(response.DailyForecasts[1].Day.RainProbability);

      var date2 = response.DailyForecasts[2].Date.slice(0, 10);
      $("#icon2").html("<img src='assets/images/" + response.DailyForecasts[2].Day.Icon + ".png'>");
      $("#date-2").html(date2);
      $("#minMax2").html(response.DailyForecasts[2].Temperature.Minimum.Value + " " + response.DailyForecasts[2].Temperature.Minimum.Unit + " / " + response.DailyForecasts[2].Temperature.Maximum.Value + " " + response.DailyForecasts[2].Temperature.Maximum.Unit);
      $("#chanceRain2").html(response.DailyForecasts[2].Day.IconPhrase);
      console.log(response.DailyForecasts[2].Day.RainProbability);

    });
  })
    .fail(function (jqXHR, textStatus, errorThrown) {
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
