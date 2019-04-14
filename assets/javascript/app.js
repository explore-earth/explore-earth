// =============================== Variables ===============================
// Initialize connection with firebase.
var config = {
    apiKey: "AIzaSyBVduicjSagRcZbWga7LhS6zrCIq0OZYuw",
    authDomain: "daredevils-project.firebaseapp.com",
    databaseURL: "https://daredevils-project.firebaseio.com",
    projectId: "daredevils-project",
    storageBucket: "",
    messagingSenderId: "746048417171"
};
firebase.initializeApp(config);

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
// =============================== Main ===============================

$(function () {
    $("#modal").modal('show');
});

// Hide elements on load
window.onload = function () {
    console.log("Onload");
    document.getElementById("customs").style.display = "none";
    document.getElementById("journal").style.display = "none";
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

