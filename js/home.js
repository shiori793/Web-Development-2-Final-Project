// URL to get all currency name
// https://api.freecurrencyapi.com/v1/currencies?apikey=<API_KEY>

// URL to get all currency rate 
https://api.freecurrencyapi.com/v1/latest?apikey=<API_KEY>&base_currency=<BASE_CURRENY>

// URL to get selected currency rate
// https://api.freecurrencyapi.com/v1/latest?apikey=<API_KEY>&currencies=<SELECTED_CURRENCY>%2C<SELECTED_CURRENCY>%2C<SELECTED_CURRENCY>&base_currency=CAD


// get user id from session storage and search data from local storage
// fetch current currency rate by setting base currency as user's main currency and get currency list
// calculate all amount user own and user's profit and show on the page (pass the currency list in the response data to function)
// show current currency rate list on the page
$( window ).load(function() {
    // Run code
});


// parameter: userAmount object (userInput, userOwn), main currency
// convert all values in userAmount object to user's main currency based on inputted currentRateList(Object)
// return sum of all values
function calculateAmount(userAmount, mainCurrency, currentRateList) {

}

// parameter: userObject
// calculate sum value of user input (localStorage) and user own (localStorage) in main currency
// return difference between these values
function calculateProfit(userObject, currentRateList) {

}



// parameter: Object including currency rate for user's main currency
// add list object to home.html
function showCurrencyRateList(currencyListObject) {

}