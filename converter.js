
// const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// Populate dropdowns with only supported currencies
for (let select of dropdowns) {
    for (let currCode in supportedCurrencies) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updateExchangeRate();
    });
}
const BASE_URL = "https://api.frankfurter.app/latest";

const updateExchangeRate = async () => {
    let amtVal = parseFloat(amountInput.value);
    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amountInput.value = "1";
    }
    
    try {
        const URL = `${BASE_URL}?from=${fromCurr.value}&to=${toCurr.value}`;
        let response = await fetch(URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data = await response.json();
        let rate = data.rates[toCurr.value];

        if (!rate) {
            throw new Error("Exchange rate not found in response");
        }

        let finalAmount = (amtVal * rate).toFixed(4);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Error fetching exchange rate. Please try again.";
    }
};

// Update flag image using supported currencies
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = supportedCurrencies[currCode];
    if (countryCode) {
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        let img = element.parentElement.querySelector("img");
        img.src = newSrc;
    }
};

// Event listeners
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

amountInput.addEventListener("input", () => {
    updateExchangeRate();
});

// Initialize on page load
window.addEventListener("load", () => {
    updateExchangeRate();
});