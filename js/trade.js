// URL to get all currency name
// https://api.freecurrencyapi.com/v1/currencies?apikey=<API_KEY>

// URL to get all currency rate 
https://api.freecurrencyapi.com/v1/latest?apikey=<API_KEY>&base_currency=<BASE_CURRENY>

// URL to get selected currency rate
// https://api.freecurrencyapi.com/v1/latest?apikey=<API_KEY>&currencies=<SELECTED_CURRENCY>%2C<SELECTED_CURRENCY>%2C<SELECTED_CURRENCY>&base_currency=CAD

// get user id from session storage and search data from local storage
// update localStorage
$( window ).on('load', function() {

    // test data
    sessionStorage.removeItem("user_id");
    sessionStorage.setItem("user_id", "user_id");
    localStorage.clear();
    localStorage.setItem(
        'user_id', JSON.stringify({
            userOwn: {
                USD: 100,
                CAD: 100
            }
        })
    );

    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) { // when session does'nt have user id
        $('#my-balance-table').remove();
        alert("Sorry, this is invalid session. Please login.");
    } else {
        let user_data = JSON.parse(localStorage.getItem(user_id));
        if (!user_data) { // when localStorage doesn't have user data
            alert("Sorry, you dont't have your account. Please register.");
        } else {
            if(user_data.hasOwnProperty("userOwn")) { // check if userOwn object key exists
                showMyCurrencyList(user_data.userOwn);
            } else {
                $('#my-balance-table').remove();
                const noBalanceMsg =  $("<p></p>").text("No balance");
                $("#my-balance").append(noBalanceMsg);
            }
        }
    }



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
    $('#my-balance-table').remove();
    if(Object.keys(userOwnObject).length > 0) { //when userOwn object has data
        const myBalanceTable = $("<table class='table table-striped mx-3' id='my-balance-table'></table>");
        const thead = $("<thead><tr><th scope='col'>Currency</th><th scope='col'>Amount</th></tr></thead>");
        const tbody = $("<tbody></tbody");
        for(let key in userOwnObject){
            let eachData = `
                <tr>
                    <th scope="row">${key}</th>
                    <td>${userOwnObject[key]}</td>
                </tr>`;
            tbody.append(eachData);
        }
        myBalanceTable.append(thead, tbody);
        $("#my-balance").append(myBalanceTable);
    } else { //when userOwn object doesn't have data
        const noBalanceMsg =  $("<p></p>").text("No balance");
        $("#my-balance").append(noBalanceMsg);
    }
}