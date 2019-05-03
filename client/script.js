let annotate = null;
let text = null;
var globalEntities = []
var token = localStorage.getItem('wikwik_token')

let baseURL = 'http://localhost:3000'

function getData() {
    $.ajax({
        url : 'https://en.wikipedia.org/api/rest_v1/page/random/summary',
        method: 'GET'
    })
    .done(function(response) {
        console.log(response)
        annotate = response.title
        $("#extract-title").html(``);
        $("#extract-title").append(`${response.title}`);
        text = response.extract
        $("#extract-paragraph").html(``);
        $("#extract-paragraph").append(`${response.extract}`);
        $("#image").html(``);
        $("#image").append(`<img src=${response.thumbnail.source} class="rounded mx-auto d-block">`);

        getVideo()

        getTextEntities(response.extract)
    })
    .fail(function(jqXHR, textStatus) {
        console.log('request fail', textStatus)
        
    })
}

function searchData() {
    event.preventDefault()
    
    let query = $('#query').val()
    console.log(query,'===');
    
    $.ajax({
        url : `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`,
        method: 'GET'
    })
    .done(function(response) {
        console.log(response)
        annotate = response.title
        $("#extract-title").html(``);
        $("#extract-title").append(`${response.title}`);
        text = response.extract
        $("#extract-paragraph").html(``);
        $("#extract-paragraph").append(`${response.extract}`);
        $("#image").html(``);
        $("#image").append(`<img src=${response.thumbnail.source} class="rounded mx-auto d-block">`);

        getVideo()

        getTextEntities(response.extract)
    })
    .fail(function(jqXHR, textStatus) {
        console.log('request fail', textStatus)
    })
}

function getTextEntities(text) {
    $.ajax({
        url : 'http://localhost:3000/analyze',
        method: 'POST',
        data: {text: text},
    })
    .done(function(response) {
        console.log(response)
        globalEntities = []
        $('#entities').html('')
        response.forEach(res => {
            let template = 
            `<a href="https://www.google.com/search?q=${res.name}"><span class="m-1 badge badge-pill badge-dark">${res.name}</span></a>&nbsp`
            $('#entities').append(template)
            globalEntities.push(res.name)
        })
    })
    .fail(function(jqXHR, textStatus) {
        console.log('request fail', textStatus)
    })
}

function getVideo() {
    event.preventDefault();
   
    $.ajax({
        url: `${baseURL}/youtube`,
        method : 'GET',
        headers : {annotate}
    })
    .done( response => {
        console.log(response,'=====');
        
        $('#video').html(`
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${response.items[0].id.videoId}?autoplay=1"></iframe>`   
        )
    })
    .fail((err) => {
        console.log(err);
    })
}

function getTranslate(params) {
    event.preventDefault();
    let lang = $('#language').val()
    console.log(text,);
    
    $.ajax({
        url : `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190502T124126Z.73aca3f466fa052f.43c6bb553292f8cdd525d1af35c0b902ef401cf8&text=${text}&lang=en-${lang}`,
        method : 'GET'
    })
    .done( response => {
        let result = response.text[0];
        $("#extract-paragraph").html(``);
        $("#extract-paragraph").append(`${result}`);
    })
    .fail((err) => {
        console.log(err);
    })
    
}

$('#loginForm').on('submit', function() {
    event.preventDefault();

    let email = $('#email').val()
    let password = $('#password').val()

    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/signin',
        data: {
            email: email.trim(),
            password: password
        }
    })
    .done(function(data) {
       isToken()
       localStorage.setItem('wikwik_token', data.token)
        // $('#loginPanel').hide()
    })
    .fail(function(err) {
        console.log(err);
    })

})

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  
    var id_token = googleUser.getAuthResponse().id_token;
  
    $.ajax({
      url: "http://localhost:3000/gSignIn",
      method: "POST",
      data: {
        token: id_token
      }
    })
      .done(response => {
        console.log(response);
        localStorage.setItem("token", response);
        isToken();
      })
      .fail((jqXHR, textStatus) => {
        console.log(jqXHR, textStatus);
      });
}

function signout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log("User signed out.");
    });
    localStorage.clear()
    $('#loginPage').show()
    $('#main-content').hide()
    $('#signOut').hide()
    $('#signIn').show()
}

function isToken() {
    getData()
    $('#loginPage').hide()
    $('#signIn').hide()
    $('#signOut').show()
    $('#main-content').show()
}

$(document).ready(function () {
    if (token) {
        isToken()
    } else {
        $('#loginPage').show()
        $('#main-content').hide()
        $('#signOut').hide()
        $('#signIn').show()
    }
})


/***
 * FB LOGIN
 * 
 */
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else {
      // The person is not logged into your app or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '637176820060323',
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v3.3' // The Graph API version to use for the call
    });

    // Now that we've initialized the JavaScript SDK, we call 
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.

    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }