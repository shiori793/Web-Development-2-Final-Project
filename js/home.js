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

window.onload = function() {
  const deposit = document.querySelector(".deposit");
  const depositModal = document.querySelector(".depositModal");
  const closeModal = document.querySelector(".closeModal");
  const overlay = document.querySelector(".overlay");
  
  deposit.addEventListener("click", () => {
    depositModal.classList.add("active");
    overlay.classList.add("active");
  });
  closeModal.addEventListener("click", () => {
    depositModal.classList.remove("active");
    overlay.classList.remove("active");
  });
};

//  ------------------ Deposit Modal ------------------  //
// function showModal(){
//   const modal = document.getElementById("depositModal");
//   const overlay = document.getElementById("overlay");
//   modal.classList.add("active");
//   overlay.classList.add("active");
// }
// function hideModal(){
//   const modal = document.getElementById("depositModal");
//   const overlay = document.getElementById("overlay");
//   modal.classList.remove("active");
//   overlay.classList.remove("active");
// }

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
    function showCurrencyRateList(){
    const apiKey = "h9MxoIrQVMoJSCQCN9QyApxFaqqYZ0N9x5TNxWh2";
    // const baseCurrency = mainCurrency;
    const apiURL = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&currencies=USD%2CEUR%2CGBP%2CAUD%2CNZD%2CJPY%2CTRY&base_currency=CAD`;

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        const exchangeRates = data.data;
        const listArea = document.querySelector(".rateList");
        for (const item in exchangeRates) {
        const exchangeRateItem = document.createElement('li');
        exchangeRateItem.textContent = `${item} ${exchangeRates[item]}`;
        listArea.appendChild(exchangeRateItem);
        }
    })
    .catch(error => console.error('Error fetching exchange rates:', error));
    }
    showCurrencyRateList();

//Chart.js

async function getAPI(
  yearsToSubtract = 0,
  monthsToSubtract = 0,
  daysToSubtract = 7,
  base_currency = "CAD",
  currency = "USD"
) {
  //  ------------------ Get date ------------------  //
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, 0);
  const day = `${today.getDate() - 1}`.padStart(2, 0);

  const pastDate = new Date(
    today.getFullYear() - yearsToSubtract,
    today.getMonth() - monthsToSubtract,
    today.getDate() - daysToSubtract
  );

  const date_to = `${year}-${month}-${day}`;
  const date_from = pastDate.toISOString().slice(0, 10);

  //  ---------------------------------------------  //

  // API
  const key = "ZTpECrZhl2AkmZ8570exASoWc5gHtFQ4pVXpWOLU";
  const url = `https://api.freecurrencyapi.com/v1/historical?apikey=${key}&date_from=${date_from}&date_to=${date_to}&base_currency=${base_currency}&currencies=${currency}`;
  const res = await fetch(url);
  const data = await res.json();

  const labels = []; // Rate
  const datas = []; // Date
  const apiDatas = data.data;
  const length = Object.keys(apiDatas).length;

  //1week & 1month
  if (length < 80) {
    for (const key in apiDatas) {
      if (apiDatas.hasOwnProperty(key)) {
        labels.push(key);
        datas.push(Object.values(apiDatas[key])[0]);
      }
    }
    showGraph(labels, datas);
    //3month
  } else if (length >= 80 && length < 100) {
    let i = 0;
    for (let key in apiDatas) {
      if (i % 3 === 0) {
        labels.push(key);
        datas.push(Object.values(apiDatas[key])[0]);
      }
      i++;
    }
    showGraph(labels, datas);
    //6month
  } else if (length >= 100 && length < 200) {
    let i = 0;
    for (let key in apiDatas) {
      if (i % 7 === 0) {
        labels.push(key);
        datas.push(Object.values(apiDatas[key])[0]);
      }
      i++;
    }
    showGraph(labels, datas);
    //1year
  } else if (length >= 200 && length > 400) {
    let i = 0;
    for (let key in apiDatas) {
      if (i % 30 === 0) {
        labels.push(key);
        datas.push(Object.values(apiDatas[key])[0]);
      }
      i++;
    }
    console.log(labels, datas);
    showGraph(labels, datas);
    //3year
  } else if (length >= 400 && length < 1100) {
    let i = 0;
    for (let key in apiDatas) {
      if (i % 60 === 0) {
        labels.push(key);
        datas.push(Object.values(apiDatas[key])[0]);
      }
      i++;
    }
    showGraph(labels, datas);
    //5year
  } else if (length >= 1100) {
    let i = 0;
    for (let key in apiDatas) {
      if (i % 90 === 0) {
        labels.push(key);
        datas.push(Object.values(apiDatas[key])[0]);
      }
      i++;
    }
    showGraph(labels, datas);
  }
}
getAPI();

//  ------------------------------ Chart --------------------------------  //
// function showGraph(labels, datas) {
//   const ctx = document.getElementById("chart");
//   const rateChart = new Chart(ctx, {
//     type: "line",
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           label: "Rate",
//           data: datas,
//           borderWidth: 1,
//         },
//       ],
//     },
    // options: {
    //   scales: {
    //     y: {
    //       beginAtZero: true,
    //     },
    //   },
    // },
  // });

  // Click to change the time span
  // $(".btn-1w").click(() => {
  //   rateChart.destroy();
  //   getAPI(0, 0, 7, "CAD", "USD");
  // });

  // $(".btn-1m").click(() => {
  //   rateChart.destroy();
  //   getAPI(0, 1, 0, "CAD", "USD");
  // });

  // $(".btn-3m").click(() => {
  //   rateChart.destroy();
  //   getAPI(0, 3, 0, "CAD", "USD");
  // });

  // $(".btn-6m").click(() => {
  //   rateChart.destroy();
  //   getAPI(0, 6, 0, "CAD", "USD");
  // });

  // $(".btn-1y").click(() => {
  //   rateChart.destroy();
  //   getAPI(1, 0, 0, "CAD", "USD");
  // });

  // $(".btn-3y").click(() => {
  //   rateChart.destroy();
  //   getAPI(3, 0, 0, "CAD", "USD");
  // });

  // $(".btn-5y").click(() => {
  //   rateChart.destroy();
  //   getAPI(5, 0, 0, "CAD", "USD");
  // });
// }

//ロードした時はデフォルトでUSD（今年分表示）
//各通貨を選択した場合、getGraphの引数currencyに通貨の名前を渡して関数を呼ぶ（今年分）
//期間を選択する場合　１週間、１ヶ月、３ヶ月、半年、1年、2年、3年、5年、10年
//getGraphの引数date_fromに今日から逆算した日にちを渡して関数を呼ぶ
//x軸とy軸の表示について考える

// const deposit = document.querySelector(".deposit");
// const depositModal = document.querySelector(".depositModal");
// const closeModal = document.querySelector(".closeModal");
// const overlay = document.querySelector(".overlay");

// deposit.addEventListener("click", () => {
//   depositModal.classList.add("active");
//   overlay.classList.add("active");
// });
// closeModal.addEventListener("click", () => {
//   depositModal.classList.remove("active");
//   overlay.classList.remove("active");
// });