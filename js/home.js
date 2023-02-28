// URL to get all currency name
// https://api.freecurrencyapi.com/v1/currencies?apikey=<API_KEY>

// URL to get all currency rate
//api.freecurrencyapi.com/v1/latest?apikey=<API_KEY>&base_currency=<BASE_CURRENY>

// URL to get selected currency rate
// https://api.freecurrencyapi.com/v1/latest?apikey=<API_KEY>&currencies=<SELECTED_CURRENCY>%2C<SELECTED_CURRENCY>%2C<SELECTED_CURRENCY>&base_currency=CAD

// get user id from session storage and search data from local storage
// fetch current currency rate by setting base currency as user's main currency and get currency list
// calculate all amount user own and user's profit and show on the page (pass the currency list in the response data to function)
// show current currency rate list on the page
https: $(window).on("load", function () {
  // Run code
});

// parameter: userAmount object (userInput, userOwn), main currency
// convert all values in userAmount object to user's main currency based on inputted currentRateList(Object)
// return sum of all values
function calculateAmount(userAmount, mainCurrency, currentRateList) {}

// parameter: userObject
// calculate sum value of user input (localStorage) and user own (localStorage) in main currency
// return difference between these values
function calculateProfit(userObject, currentRateList) {}

// parameter: Object including currency rate for user's main currency
// add list object to home.html
function showCurrencyRateList(currencyListObject) {}

//Chart.js

async function showGraph(date_from, currency, base_currency) {
  // Get date
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const day = `${now.getDate() - 1}`.padStart(2, 0);
  date_to = `${year}-${month}-${day}`;

  //  -------------------   Sample ------------------- 　//
  date_from = `${year}-${month}-${day - 7}`; //１週間前
  currency = "USD";
  base_currency = "CAD";
  //  ------------------------------------------------ //

  // API
  const key = "ZTpECrZhl2AkmZ8570exASoWc5gHtFQ4pVXpWOLU";
  const url = `https://api.freecurrencyapi.com/v1/historical?apikey=${key}&date_from=${date_from}&date_to=${date_to}&base_currency=${base_currency}&currencies=${currency}`;
  const res = await fetch(url);
  const data = await res.json();

  const datas = []; // Date
  const labels = []; // Rate
  const apiDatas = data.data;
  for (const key in apiDatas) {
    if (apiDatas.hasOwnProperty(key)) {
      labels.push(key);
      datas.push(Object.values(apiDatas[key])[0]);
    }
  }

  const ctx = document.getElementById("chart");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Rate",
          data: datas,
          borderWidth: 1,
        },
      ],
    },
    // options: {
    //   scales: {
    //     y: {
    //       beginAtZero: true,
    //     },
    //   },
    // },
  });
}
showGraph();

//ロードした時はデフォルトでUSD（今年分表示）
//各通貨を選択した場合、getGraphの引数currencyに通貨の名前を渡して関数を呼ぶ（今年分）
//期間を選択する場合　１週間、１ヶ月、３ヶ月、半年、1年、2年、3年、5年、10年
//getGraphの引数date_fromに今日から逆算した日にちを渡して関数を呼ぶ
//x軸とy軸の表示について考える
