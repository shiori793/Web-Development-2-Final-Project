// get user id from session storage and search data from local storage
// update localStorage
$( window ).on('load', function() {

    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) { // when session does'nt have user id
        $('#my-balance-table').remove();
        alert("Sorry, this is invalid session. Please login.");
    } else {
        let user_data = JSON.parse(localStorage.getItem(user_id));
        if (!user_data) { // when localStorage doesn't have user data
            alert("Sorry, you don't have your account. Please register.");
        } else {
            if(user_data.hasOwnProperty("userOwn")) { // check if userOwn object key exists
                showMyCurrencyList(user_data.userOwn);
            } else {
                $('#my-balance-table').remove();
                const noBalanceMsg =  $("<p></p>").text("No balance");
                $("#my-balance").append(noBalanceMsg);
            }
            const allCurrencies = getAllCurrencies();
            const currencyList = Object.keys(allCurrencies);
            createSelectCurrencyList(currencyList, user_data);
        }
    }
})


// this function is executed when user entered the value user want to buy or sell
// return the value calculated based on current currency rate
async function calculateCurrency(fromCurrency, toCurrency, amount) {
    const API_KEY = "2YMkb71wlxf9VlfYcXlpoOII3MPRHGopD7TGLsIk";
    const URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&currencies=${toCurrency}&base_currency=${fromCurrency}`;
    const response = await fetch(URL);
    if (!response.ok) {
        console.log(`An error has occured: ${response.status}`);
    } else {
        const responseJson = await response.json();
        const currentRate = responseJson.data[toCurrency];
        return amount * currentRate;
    }
}


// check user's amount and trade (buy and sell) currency
async function trade(user_id) {
    let user_data = JSON.parse(localStorage.getItem(user_id));
    const baseCurrency = $('#base-currency-select').val();
    const baseAmount = $('#base-currency-input').val();
    const changeCurrency = $('#change-currency-select').val();
    if (!user_data.userOwn) {
        alert("Insufficient balance");
        return false;
    } else {
        if(user_data.userOwn.hasOwnProperty(baseCurrency) && user_data.userOwn[baseCurrency] >= baseAmount) {
            const changeAmount = await calculateCurrency(baseCurrency, changeCurrency, baseAmount);
            user_data.userOwn[baseCurrency] -= baseAmount;
            if (user_data.userOwn.hasOwnProperty(changeCurrency)) {
                user_data.userOwn[changeCurrency] += changeAmount;
            } else {
                user_data.userOwn[changeCurrency] = changeAmount;
            }
            console.log(user_data);
            localStorage.setItem(user_id, JSON.stringify(user_data));
            return true;
        } else {
            alert("Insufficient balance");
            return false;
        }
    }
}

// trade is executed when buy or sell button is clicked
$('.trade-button').on('click', async function () {
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) { // when session does'nt have user id
        alert("Sorry, this is invalid session. Please login.");
    } else {
        if (await trade(user_id)) {
            $(location).attr('href', '../trade.html');
        }
    }
});

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

// get the currency list from API
// set each value in the select list
function createSelectCurrencyList(currencyList, user_data) {
    currencyList.forEach(currName => {
        const elem = $("<option></option>");
        elem.text(currName);
        elem.val(currName);
        $('#base-currency-select').append(elem);
        $('#change-currency-select').append(elem.clone());
    });
    $('#base-currency-select').val(user_data.mainCurrency);
    $('#change-currency-select').val(user_data.mainCurrency != 'USD' ? 'USD' : 'CAD');
}

// add event listener to input box change
$('#base-currency-select').on('change', async function (e) { 
    e.preventDefault();
    if ($('#base-currency-input').val() > 0) {
        let returnValue = await calculateCurrency($(this).val(), $('#change-currency-select').val(), $('#base-currency-input').val())
        $('#change-currency-input').val(returnValue);
    }
});

$('#base-currency-input').on('change', async function (e) { 
    e.preventDefault();
    if ($(this).val() > 0) {
        let returnValue = await calculateCurrency($('#base-currency-select').val(), $('#change-currency-select').val(), $(this).val());
        $('#change-currency-input').val(returnValue);
    }
});

$('#change-currency-select').on('change', async function (e) { 
    e.preventDefault();
    if ($('#base-currency-input').val() > 0) {
        let returnValue = await calculateCurrency($('#base-currency-select').val(), $(this).val(), $('#base-currency-input').val());
        $('#change-currency-input').val(returnValue);
    }
});

$('#change-currency-input').on('change', async function (e) { 
    e.preventDefault();
    if ($(this).val() > 0) {
        let returnValue = await calculateCurrency($('#base-currency-select').val(), $('#change-currency-select').val(), $(this).val());
        $('#base-currency-input').val(returnValue);
    }
});

async function getAllCurrencies() {
    const API_KEY = "2YMkb71wlxf9VlfYcXlpoOII3MPRHGopD7TGLsIk";
    const URL = `https://api.freecurrencyapi.com/v1/currencies?apikey=${API_KEY}`;
    let allCurrencies = localStorage.getItem("allCurrencies");
    if (allCurrencies == null) {
        const response = await fetch( URL );
        if (!response.ok) {
            console.log(`An error has occured: ${response.status}`);
        } else {
            const responseJson = await response.json();
            localStorage.setItem("allCurrencies", responseJson.data);
            return responseJson.data;
        }
    }
}