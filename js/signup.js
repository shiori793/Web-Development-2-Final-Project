$( window ).on('load', async function() {
// User Constructor
class newUser {
    constructor(email, password, firstName, lastName, mainCurrency) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.mainCurrency = mainCurrency;
    }
}

$("#register").submit(function(event) {
    event.preventDefault();
    
    let email = $("#email").val();
    let password = $("#password").val();
    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();
    let mainCurrency = $("#mainCurrency").val();

    if (!validateEmail(email) || (!validateForm(password, firstName, lastName, mainCurrency))) {
        window.history.back();
    }
    
    validateForm()
    let checkEmail = localStorage.getItem(`${email}`);
    if (checkEmail === null) {
       let User = new newUser(email, password, firstName, lastName, mainCurrency);
       localStorage.setItem(`${email}`, JSON.stringify(User));
       let retrievedObject = localStorage.getItem(`${email}`);
       console.log(retrievedObject);
       window.location.href = "../login.html";
    } else {
        alert("Error, this email is already in use");
    }
})

function validateEmail(email) {
    let regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
}

function validateForm(password, firstName, lastName, mainCurrency) {
    if (password === "" || firstName === "" || lastName === "" || mainCurrency === "") {
        return false;
    }
}

async function createSelectCurrencyList() {
    const allCurrencies = await getAllCurrencies();
    const currencyList = Object.keys(allCurrencies);
    currencyList.forEach(currName => {
        const elem = $("<option></option>");
        elem.text(currName);
        elem.val(currName);
        $('#mainCurrency').append(elem);
    });
    $('#mainCurrency').val("CAD");
}

// get all currency list from API
async function getAllCurrencies() {
    const API_KEY = "2YMkb71wlxf9VlfYcXlpoOII3MPRHGopD7TGLsIk";
    const URL = `https://api.freecurrencyapi.com/v1/currencies?apikey=${API_KEY}`;
    const response = await fetch( URL );
    if (!response.ok) {
        console.log(`An error has occurred: ${response.status}`);
    } else {
        const responseJson = await response.json();
        return responseJson.data;
    }
}
createSelectCurrencyList();
})