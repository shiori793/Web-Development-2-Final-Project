// URL to get all currency name
// https://api.freecurrencyapi.com/v1/currencies?apikey=<API_KEY>

// URL to get all currency rate 
https://api.freecurrencyapi.com/v1/latest?apikey=<API_KEY>&base_currency=<BASE_CURRENY>

// URL to get selected currency rate
// https://api.freecurrencyapi.com/v1/latest?apikey=<API_KEY>&currencies=<SELECTED_CURRENCY>%2C<SELECTED_CURRENCY>%2C<SELECTED_CURRENCY>&base_currency=CAD


// get user id from session storage and search data from local storage
// update localStorage
$( window ).load(function() {
    // Run code
});


// this function is executed when user entered the value user want to buy or sell
// return the value calculated based on current currency rate
function calculateCurrency(baseCurrency, calcCurrency, amount) {

}


// check user's amount and buy currency
function buy(user_id, baseCurrency, baseAmount, buyCurrency, buyAmount) {

}


// check user's amount and sell currency
function sell(user_id, baseCurrency, baseAmount, sellCurrency, sellAmount) {

}

// list up user's all currency and amount based on parameter object
function showMyCurrencyList(userOwnObject) {

}