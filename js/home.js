// URL to get all currency name
// https://api.freecurrencyapi.com/v1/currencies?apikey=<API_KEY>

// URL to get all currency rate 
// https://api.freecurrencyapi.com/v1/latest?apikey=<API_KEY>&base_currency=<BASE_CURRENY>

// URL to get selected currency rate
// https://api.freecurrencyapi.com/v1/latest?apikey=<API_KEY>&currencies=<SELECTED_CURRENCY>%2C<SELECTED_CURRENCY>%2C<SELECTED_CURRENCY>&base_currency=CAD


// get user id from session storage and search data from local storage
// fetch current currency rate by setting base currency as user's main currency and get currency list
// calculate all amount user own and user's profit and show on the page (pass the currency list in the response data to function)
// show current currency rate list on the page
// $( window ).load(function() {
    // Run code
// });


// parameter: userAmount object (userInput, userOwn), main currency
// convert all values in userAmount object to user's main currency based on inputted currentRateList(Object)
// return sum of all values
// function calculateAmount(userAmount, mainCurrency, currentRateList) {

// }

// parameter: userObject
// calculate sum value of user input (localStorage) and user own (localStorage) in main currency
// return difference between these values
// function calculateProfit(userObject, currentRateList) {

// }



// parameter: Object including currency rate for user's main currency
// add list object to home.html
// showCurrencyRateList
    const apiKey = "h9MxoIrQVMoJSCQCN9QyApxFaqqYZ0N9x5TNxWh2";
    const apiURL = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&currencies=USD%2CEUR%2CGBP%2CAUD%2CNZD%2CJPY%2CTRY&base_currency=CAD`;

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        const exchangeRates = data.data;
        const exchangeRateList = document.createElement('ul');
        for (const item in exchangeRates) {
        const exchangeRateItem = document.createElement('li');
        exchangeRateItem.textContent = `${item} ${exchangeRates[item]}`;
        exchangeRateList.appendChild(exchangeRateItem);
        }
        document.body.appendChild(exchangeRateList);
    })
    .catch(error => console.error('Error fetching exchange rates:', error));