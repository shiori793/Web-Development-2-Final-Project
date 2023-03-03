// get user input value
// find email from all user data and check password
// if user input correct value, set user id in session storage nad navigate to home.html
// if not, alert tell user to type correct value
function login(email, password) {
    let checkEmail = localStorage.getItem(`${email}`);
    if (checkEmail === null) {
        alert("Email or password is incorrect");
    } else {
        let userData = JSON.parse(checkEmail);
        if (userData.password !== password) {
            alert("Email or password is incorrect");
        } else {
            // console.log(`Matches: ${userData}`);
            sessionStorage.setItem(`userID`, email);
            window.location.href = "../home.html";
        }
    }
}

$('#login-button').click(function (e) { 
    e.preventDefault();
    let email = $("#email").val();
    let password = $("#password").val();
    login(email, password);
});

// get user input value
// register first name, last name, email, password to local storage with created new user id
// set user id in session storage
// navigate to home.html
// function register() {
    
// }

// $('register-button').click(function (e) { 
//     e.preventDefault();
//     register();
// });