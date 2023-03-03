// fetch current currency rate by setting base currency as user's main currency and get currency list //NAMI

// calculate all amount user own and user's profit and show on the page (pass the currency list in the response data to function) //WORKING ON

$(window).on("load", async function () {
  // ------------   test data   -------------- //
  // sessionStorageのuser_idの値を削除しておく
  // sessionStorage.removeItem("user_id");
  // sessionStorageにテスト用のuser_id名、”user1”を設定する
  // sessionStorage.setItem("user_id", "user1"); //(第1引数:保存するデータのキー,第2引数:保存するデータの値を指定)

  // localStorage内のすべてのデータを削除しておく
  // localStorage.clear();

  // localStorageにテスト用のデータを設定する
  // localStorage.setItem(
  //   "user1",
    //JavaScriptオブジェクトをJSON文字列に変換
  //   JSON.stringify({
  //     mainCurrency: "CAD",
  //     userInput: {
  //       CAD: 1000,
  //       USD: 100,
  //     },
  //     userOwn: {
  //       CAD: 900,
  //       USD: 200,
  //     },
  //   })
  // );
  // ---------------------------------------- //

  // ユーザーIDをセッションから取得
  const user_id = sessionStorage.getItem("userID");
  if (!user_id) {
    // user_idがないとき
    alert("Sorry, this is invalid session. Please login.");
    window.location.href = "../login.html"
  } else {
    // user_idがあるとき
    // JSON形式の文字列をJavaScriptに変換する
    let user_data = JSON.parse(localStorage.getItem(user_id));
    // 取得したデータがuser_dataに代入されている
    console.log(user_data);

    if (!user_data) {
      // when localStorage doesn't have user data
      alert("Sorry, you don't have your account. Please register.");
      window.location.href = "../signup.html"
    } else {

      //localStorageからmainCurrency取得
      const mainCurrency = user_data.mainCurrency;
      const exchangeRates = await getCurrencyRates(mainCurrency);
      // const userInput = Object.values(user_data.userInput);
      // if (user_data.userInput == null) {
      //   user_data.userInput = {};
      // }
      // const userOwn = Object.values(user_data.userOwn);
      // if (user_data.userOwn == null) {
      //   user_data.userOwn = {};
      // }

      //localStorageからmainCurrencyの金額を取得
      // const userAmount = Object.values(user_data.userOwn)[0];

      // const moneySaved = document.querySelector(".moneySavedPrice");
      // moneySaved.innerHTML =
      displayDepositedAmount(user_data, exchangeRates);
      calculateProfit(user_data, exchangeRates);
      showCurrencyRateList(exchangeRates, mainCurrency);
      await getAPI();
    }
  }

  //  ----------------- Deposit Modal -----------------  //
  const deposit = document.querySelector(".deposit");
  const depositModal = document.querySelector(".depositModal");
  const userInput = document.getElementById("inputDeposit");
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

  //  ----------------- Deposit Function -----------------  //
  document.getElementById("deposit").onclick = function saveDeposit() {
    const depositData = parseFloat(
      document.getElementById("inputDeposit").value
    );

    user_data = JSON.parse(localStorage.getItem(user_id));
    const mainCurrency = user_data.mainCurrency;
    if (user_data.hasOwnProperty("userInput")) {
      if (user_data.userInput.hasOwnProperty(mainCurrency)) {
        user_data.userInput[mainCurrency] += depositData;
      } else {
        user_data.userInput[mainCurrency] = depositData;
      }
    }else {
      user_data.userInput = {};
      user_data.userInput[mainCurrency] = depositData;
    }

    if (user_data.hasOwnProperty("userOwn")) {
      if (user_data.userOwn.hasOwnProperty(mainCurrency)) {
        user_data.userOwn[mainCurrency] += depositData;
      } else {
        user_data.userOwn[mainCurrency] = depositData;
      }
    }else {
      user_data.userOwn = {};
      user_data.userOwn[mainCurrency] = depositData;
    }

    localStorage.setItem(user_id, JSON.stringify(user_data));

    displayDepositedAmount(user_data, mainCurrency);
    depositModal.classList.remove("active");
    overlay.classList.remove("active");
    $(location).attr("href", "../home.html");
  };
});

//  ----------------- Deposit Function -----------------  //

function calculateProfit(userObject, exchangeRates) {
  const revenueMade = document.querySelector(".revenueMadePrice");

  const revenueMadeAmount = userObject.hasOwnProperty("userInput")
    ? getSumInMainCurrency(
        userObject.userInput,
        exchangeRates,
        userObject.mainCurrency
      )
    : 0;
  const moneySavedAmount = userObject.hasOwnProperty("userOwn")
    ? getSumInMainCurrency(
        userObject.userOwn,
        exchangeRates,
        userObject.mainCurrency
      )
    : 0;

  revenueMade.innerHTML = `${userObject.mainCurrency} ${(
    moneySavedAmount - revenueMadeAmount
  ).toFixed(2)}`;
}

function displayDepositedAmount(userObject, exchangeRates) {
  const moneySaved = document.querySelector(".moneySavedPrice");
  const moneySavedAmount = userObject.hasOwnProperty("userOwn")
    ? getSumInMainCurrency(
        userObject.userOwn,
        exchangeRates,
        userObject.mainCurrency
      )
    : 0;
  moneySaved.innerHTML = `${userObject.mainCurrency} ${moneySavedAmount.toFixed(
    2
  )}`;
}

function getSumInMainCurrency(obj, exchangeRates, mainCurrency) {
  let sum = 0;
  for (curr in obj) {
    if (curr != mainCurrency) {
      sum += obj[curr] / exchangeRates[curr];
    } else {
      sum += obj[curr];
    }
  }
  return sum;
}

const apiKey = "ZTpECrZhl2AkmZ8570exASoWc5gHtFQ4pVXpWOLU";
let currency = ""; // Change the value everytime user choose a different currency

// parameter: Object including currency rate for user's main currency
// add list object to home.html
function showCurrencyRateList(exchangeRates, mainCurrency) {
  const listArea = document.querySelector(".rateList");
  const showCurrencyList = ["USD", "EUR", "GBP", "AUD", "NZD", "JPY", "TRY"];
  for (const item of showCurrencyList) {
    const exchangeRateItem = document.createElement("li");
    exchangeRateItem.className = `currencyList ${item}`;
    exchangeRateItem.textContent = `${mainCurrency} / ${item} ${exchangeRates[
      item
    ].toFixed(4)}`;
    listArea.appendChild(exchangeRateItem);
  }
}

async function getCurrencyRates(mainCurrency) {
  const apiURL = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${mainCurrency}`;
  const response = await fetch(apiURL);
  if (!response.ok) {
    console.log(`An error has occurred: ${response.status}`);
  } else {
    const responseJson = await response.json();
    return responseJson.data;
  }
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

$('#signout').on('click', function() {
  sessionStorage.removeItem('userID');
  window.location.href = "../login.html"
});