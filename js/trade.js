// get user id from session storage and search data from local storage
// update localStorage
$( window ).on('load', async function() {

    // test data
    // sessionStorage.removeItem("user_id");
    // sessionStorage.setItem("user_id", "user_id");

    // localStorage.clear();
    // localStorage.setItem(
    //     'user_id',
    //     JSON.stringify({
    //         mainCurrency: 'CAD',
    //         userOwn: {
    //             USD: 10000,
    //             CAD: 10000
    //         }
    //     })
    // );

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
            await createSelectCurrencyList(user_data);
            await updateBitAndAskValue();
        }
    }
})

// get current rate from API
// calculate bit and ask rate with 0.5% spread
// return array of bitRate and askRate for base currency
async function getBitAndAskValue(baseCurrency, changeCurrency) {
    if (baseCurrency != changeCurrency) {
        const rowValue = await calculateCurrency(baseCurrency, changeCurrency, 1);
        const spread = 0.5 / 100;
        const bitRate = rowValue * (1 - spread);
        const askRate = rowValue * (1 + spread);
        return [bitRate, askRate];
    } else {
        return [1.000, 1.000];
    }
}

// add event listener to input box change
$('.currency-select').on('change', async function (e) { 
    e.preventDefault();
    await updateBitAndAskValue()
});

// update the value in trade buttons
async function updateBitAndAskValue() { 
    const currencyRates = await getBitAndAskValue($('#base-currency-select').val(), $('#change-currency-select').val());
    $('#bit-rate').text(currencyRates[0].toFixed(4));
    $('#ask-rate').text(currencyRates[1].toFixed(4));
}

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
async function trade(user_id, type) {
    let user_data = JSON.parse(localStorage.getItem(user_id));
    const baseCurrency = $('#base-currency-select').val();
    const lot = $('#lot-input').val();
    const baseAmount = lot * 10000;
    const changeCurrency = $('#change-currency-select').val();
    if (!user_data.userOwn) {
        alert("Insufficient balance");
        return false;
    } else {
        const currencyRates = await getBitAndAskValue(baseCurrency, changeCurrency);
        switch(type){
            case 'BIT':
            if(user_data.userOwn.hasOwnProperty(baseCurrency)) {
                const changeAmount = baseAmount * currencyRates[0];
                if (user_data.userOwn[baseCurrency] >= baseAmount) {
                user_data.userOwn[baseCurrency] -= baseAmount
                if (user_data.userOwn[baseCurrency] == 0) {
                    delete user_data.userOwn[baseCurrency];
                }
                if(user_data.userOwn.hasOwnProperty(changeCurrency)) {
                    user_data.userOwn[changeCurrency] += changeAmount;
                } else {
                    user_data.userOwn[changeCurrency] = changeAmount;
                }
                localStorage.setItem(user_id, JSON.stringify(user_data));
                return true;
                } else {
                alert("Insufficient balance");
                return false;
                }
            }
            break;
        case 'ASK':
            if(user_data.userOwn.hasOwnProperty(changeCurrency)) {
                const changeAmount = baseAmount * currencyRates[1];
                if (user_data.userOwn[changeCurrency] >= changeAmount) {
                user_data.userOwn[changeCurrency] -= changeAmount
                if (user_data.userOwn[changeCurrency] == 0) {
                    delete user_data.userOwn[changeCurrency];
                }
                if(user_data.userOwn.hasOwnProperty(baseCurrency)) {
                    user_data.userOwn[baseCurrency] += baseAmount;
                } else {
                    user_data.userOwn[baseCurrency] = baseAmount;
                }
                localStorage.setItem(user_id, JSON.stringify(user_data));
                return true;
                } else {
                alert("Insufficient balance");
                return false;
                }
            }
            break;
        }
        alert("Insufficient balance");
        return false;
    }
}

// trade is executed when buy or sell button is clicked
$('.trade-button').on('click', async function () {
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) { // when session does'nt have user id
        alert("Sorry, this is invalid session. Please login.");
    } else {
        if (await trade(user_id, $(this).val())) {
            $(location).attr('href', '../trade_update.html');
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
                    <td>${userOwnObject[key].toFixed(4)}</td>
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
async function createSelectCurrencyList(user_data) {
    const allCurrencies = await getAllCurrencies();
    const currencyList = Object.keys(allCurrencies);
    currencyList.forEach(currName => {
        const elem = $("<option></option>");
        elem.text(currName);
        elem.val(currName);
        $('#base-currency-select').append(elem);
        $('#change-currency-select').append(elem.clone());
    });
    $('#change-currency-select').val(user_data.mainCurrency);
    $('#base-currency-select').val(user_data.mainCurrency != 'USD' ? 'USD' : 'CAD');
}

// get all currency list from API
async function getAllCurrencies() {
    const API_KEY = "2YMkb71wlxf9VlfYcXlpoOII3MPRHGopD7TGLsIk";
    const URL = `https://api.freecurrencyapi.com/v1/currencies?apikey=${API_KEY}`;
    const response = await fetch( URL );
    if (!response.ok) {
        console.log(`An error has occured: ${response.status}`);
    } else {
        const responseJson = await response.json();
        return responseJson.data;
    }
}