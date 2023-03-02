
// User Constructor
class newUser {
    constructor(email, password, firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        // this.mainCurrency = mainCurrency;
    }
}

$("#register").submit(function(event) {
    event.preventDefault();
    
    let email = $("#email").val();
    let password = $("#password").val();
    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();
    // let mainCurrency = $("#")
    
    let checkEmail = localStorage.getItem(`${email}`);
    console.log(checkEmail);
    if (checkEmail === null) {
       let User = new newUser(email, password, firstName, lastName);
       localStorage.setItem(`${email}`, JSON.stringify(User));
       let retrievedObject = localStorage.getItem(`${email}`);
       console.log(retrievedObject);
    } else {
        console.log("Error, this email is already in use");
    }
})

function validateEmail(email) {
    let regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
}
