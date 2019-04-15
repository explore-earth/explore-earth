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
  
//   $("#menu-login").click(toggleSignIn, function () {
//     console.log("clicky");
//   });
  
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
        var displayName = user.displayName;
        document.getElementById("customs").style.display = "block";
        document.getElementById("journal").style.display = "block";
        document.getElementById("menu-journal").style.display = "block";
        $("#user-avatar").append(displayName);
		
	}else{
		console.log("We don't have a user");
        $("#user-avatar").hide;
        document.getElementById("customs").style.display = "none";
        document.getElementById("journal").style.display = "none";
        document.getElementById("menu-journal").style.display = "none";
	}
});

$("#menu-login").on('click',function(){
	console.log('funciona boton');
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
	firebase.auth().signInWithPopup(provider)
	.then(function(user){
		console.log(user);
	}).catch(function(error){
		console.log(error);
	})
});

