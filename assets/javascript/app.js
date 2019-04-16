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
firebase.auth().onAuthStateChanged(function(user){
console.log(user);
if(user){
      console.log('We have a user');
      var photoURL = $("<img>");
      photoURL.attr("src", user.photoURL);
      photoURL.attr("class","google-avatar");
      photoURL.css({"width":"7%","height":"7%","border-radius":"50%"});
      $("#user-avatar").append(photoURL);
      // var displayName = user.displayName;
      // $("#user-avatar").append(displayName); //this does not work yet
      document.getElementById("customs").style.display = "block";
      document.getElementById("journal").style.display = "block";
      document.getElementById("menu-journal").style.display = "block";
      document.getElementById("menu-login").style.display = "none";
      document.getElementById("menu-logout").style.display = "block";

      
  
}else{
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

$("#menu-login").on('click',function(){
console.log('this button works');
var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
firebase.auth().signInWithPopup(provider)
.then(function(user){
  console.log(user);
}).catch(function(error){
  console.log(error);
})
});

$("#menu-logout").on('click',function(){
	var provider = new firebase.auth.GoogleAuthProvider();
	console.log('logout works');
	firebase.auth().signOut().then(function(){
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
              url: "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locationKey + "?apikey=X9amRPkYQjYDGGTYwGOq0VnljW2GJORA",
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