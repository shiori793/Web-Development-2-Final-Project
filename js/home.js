// fetch current currency rate by setting base currency as user's main currency and get currency list //NAMI

// calculate all amount user own and user's profit and show on the page (pass the currency list in the response data to function) //WORKING ON

$(window).on("load", async function () {
  // ------------   test data   -------------- //
  //sessionStorageのuser_idの値を削除しておく
  sessionStorage.removeItem("user_id");
  //sessionStorageにテスト用のuser_idを設定する
  sessionStorage.setItem("user_id", "user1"); //(第1引数:保存するデータのキー,第2引数:保存するデータの値を指定)

  //localStorage内のすべてのデータを削除しておく
  localStorage.clear();

  //localStorageにテスト用のデータを設定する
  localStorage.setItem(
    "user1",
    JSON.stringify({
      //JavaScriptオブジェクトをJSON文字列に変換
      mainCurrency: "CAD",
      userInput: {
        CAD: 1000,
      },
      userOwn: {
        CAD: 10000,
      },
    })
  );
  // ---------------------------------------- //

  // ユーザーIDをセッションから取得
  const user_id = sessionStorage.getItem("user_id");
  // localStorageでデータを検索する
  const userData = JSON.parse(localStorage.getItem(user_id));
  // 取得したデータがuserDataに代入されている
  console.log(userData);

  if (!user_id) {
    //user_idがないとき
    $(".price").innerHTML = "Please login!";
    alert("Sorry, this is invalid session. Please login.");
  } else {
    // あるとき
    let user_data = JSON.parse(localStorage.getItem(user_id));
    // When the page load, call functions to show rate lists and chart
    showCurrencyRateList();
    await getAPI();
    if (!user_data) {
      // when localStorage doesn't have user data
      alert("Sorry, you don't have your account. Please register.");
    } else {
      if (user_data.hasOwnProperty("userOwn")) {
        // check if userOwn object key exists
      } else {
      }
    }
  }

  //  ----------------- Deposit Modal -----------------  //
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
  //  ------------------------------------------------  //
});

// parameter: userAmount object (userInput, userOwn), main currency

// convert all values in userAmount object to user's main currency based on inputted currentRateList(Object)

// return sum of all values
function calculateAmount(userAmount, mainCurrency, currentRateList) {}

// parameter: userObject
// calculate sum value of user input (localStorage) and user own (localStorage) in main currency
// return difference between these values
// function calculateProfit(userObject, currentRateList) {

// }

const apiKey = "ZTpECrZhl2AkmZ8570exASoWc5gHtFQ4pVXpWOLU";
let currency = ""; // Change the value everytime user choose a different currency

// parameter: Object including currency rate for user's main currency
// add list object to home.html
function showCurrencyRateList() {
  // const apiKey = "h9MxoIrQVMoJSCQCN9QyApxFaqqYZ0N9x5TNxWh2";
  const baseCurrency = "CAD";
  const apiURL = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&currencies=USD%2CEUR%2CGBP%2CAUD%2CNZD%2CJPY%2CTRY&base_currency=CAD`;

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      const exchangeRates = data.data;
      const listArea = document.querySelector(".rateList");
      for (const item in exchangeRates) {
        const exchangeRateItem = document.createElement("li");
        exchangeRateItem.className = `currencyList ${item}`;
        exchangeRateItem.textContent = `${baseCurrency} / ${item} ${exchangeRates[item]}`;
        listArea.appendChild(exchangeRateItem);
      }
    })
    .catch((error) => console.error("Error fetching exchange rates:", error));
}

//Chart.js
async function getAPI(
  yearsToSubtract = 0,
  monthsToSubtract = 0,
  daysToSubtract = 7,
  base_currency = "CAD",
  target_currency = "USD"
) {
  //  ------------------ Get date ------------------  //
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, 0);
  const day = `${today.getDate() - 2}`.padStart(2, 0);

  const pastDate = new Date(
    today.getFullYear() - yearsToSubtract,
    today.getMonth() - monthsToSubtract,
    today.getDate() - daysToSubtract
  );

  currency = target_currency;
  // const date_to = `${year}-${month}-${day}`;
  const date_to = "2023-2-28";
  const date_from = pastDate.toISOString().slice(0, 10);

  //  ---------------------------------------------  //

  // API
  // const key = "ZTpECrZhl2AkmZ8570exASoWc5gHtFQ4pVXpWOLU";
  const url = `https://api.freecurrencyapi.com/v1/historical?apikey=${apiKey}&date_from=${date_from}&date_to=${date_to}&base_currency=${base_currency}&currencies=${target_currency}`;
  const res = await fetch(url);
  const data = await res.json();

  const labels = []; // Rate
  const datas = []; // Date
  const apiDatas = data.data;
  const length = Object.keys(apiDatas).length;

  // Adjust X axis day and call showGraph function;
  function adjustLabelsAndDatas(day) {
    let i = 0;
    for (let key in apiDatas) {
      if (i % day === 0) {
        labels.push(key);
        datas.push(Object.values(apiDatas[key])[0]);
      }
      i++;
    }
    showGraph(labels, datas);
  }

  //1week & 1month
  if (length < 80) {
    adjustLabelsAndDatas(1);
    //3month
  } else if (length >= 80 && length < 100) {
    adjustLabelsAndDatas(3);
    //6month
  } else if (length >= 100 && length < 200) {
    adjustLabelsAndDatas(7);
    //1year
  } else if (length >= 200 && length > 400) {
    adjustLabelsAndDatas(30);
    //3year
  } else if (length >= 400 && length < 1100) {
    adjustLabelsAndDatas(90);
    //5year
  } else if (length >= 1100) {
    adjustLabelsAndDatas(183);
  }
}

//  ------------------------------ Chart --------------------------------  //
function showGraph(labels, datas) {
  const currencies = document.querySelectorAll(".currencyList");
  const currencyName = document.querySelector(".currency-name");
  const ctx = document.getElementById("chart");

  const rateChart = new Chart(ctx, {
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
  });

  // Click to change the time span
  $(".btn-1w").click(() => {
    rateChart.destroy();
    // console.log(currency);
    getAPI(0, 0, 7, "CAD", currency);
  });

  $(".btn-1m").click(() => {
    rateChart.destroy();
    // console.log(currency);
    getAPI(0, 1, 0, "CAD", currency);
  });

  $(".btn-3m").click(() => {
    rateChart.destroy();
    // console.log(currency);
    getAPI(0, 3, 0, "CAD", currency);
  });

  $(".btn-6m").click(() => {
    rateChart.destroy();
    // console.log(currency);
    getAPI(0, 6, 0, "CAD", currency);
  });

  currencies.forEach((cur) =>
    cur.addEventListener("click", (e) => {
      rateChart.destroy();
      const className = e.target.classList.item(1);
      currencyName.innerHTML = `CAD/${className}`;
      currency = className;
      getAPI(0, 0, 7, "CAD", currency);
    })
  );
}
