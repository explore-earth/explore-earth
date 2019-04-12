
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBVduicjSagRcZbWga7LhS6zrCIq0OZYuw",
    authDomain: "daredevils-project.firebaseapp.com",
    databaseURL: "https://daredevils-project.firebaseio.com",
    projectId: "daredevils-project",
    storageBucket: "daredevils-project.appspot.com",
    messagingSenderId: "746048417171"
  };
  firebase.initializeApp(config);

  //onclick function to start authentication
$("#modalSubmit").on("click", function() {
        
    firebase.auth().getRedirectResult() //this is the response from firebase.auth().signInWithRedirect(provider). 
        .then(signInSucceed)
        .catch(signInError);
});

function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithRedirect(provider) //We are redirecting rather than using a popup. If we decide to use a popup instead, change signInWithRedirect to signInWithPopup
            .then(signInSucceed)
            .catch(signInError);
}

function signInSucceed(result) {
    if (result.credential) {
        googleAccountToken = result.credential.accessToken;
        user = result.user;

        // Here we can choose what to show on the UI and where, for example:
            // $("#photo").attr("src", user.photoURL);
            // $("#displayName").html(user.displayName);
            // $("#email").html(user.email);
            // $("#refreshToken").html(user.refreshToken);
            // $("#uid").html(user.uid);

    }
}

function signInError(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;

    var errmsg = errorCode + " " + errorMessage;

    if(typeof(email) != 'undefined') {
        errmsg += "<br />";
        errmsg += "Cannot sign in with your google account: " + email;
    }

    if(typeof(credential) != 'undefined') {
        errmsg += "<br />";
        errmsg += credential;
    }

    
    $("#error #errmsg").html(errmsg);
    $("#error").show();
    $("#signIn").hide();
    return;
}


// TO DO:
    // should we add a "SIGN OUT" on the main menu?
    // after we authenticate, I think we need a function to direct the user back to the website. I'm not sure yet how to do this
    // We don't have a place on the HTML to show the user's signed in Avatar. It would be nice to have it. Kinda like how Firebase has your Avatar at the top right-hand corner.s
