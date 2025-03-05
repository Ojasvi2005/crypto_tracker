document.addEventListener("DOMContentLoaded", async () => {
    const cryptoSelect = document.getElementById("crypto-select");
    const cryptoPrice = document.getElementById("crypto-price");
    const alertPriceInput = document.getElementById("alert-price");
    const setAlertButton = document.getElementById("set-alert");
    const alertMessage = document.getElementById("alert-message");
    const errorMessage = document.getElementById("error-message");
    let selectedCryptoId = null;
    let alertPrice = null;

    const top10Cryptos = [
        { id: "90", name: "Bitcoin" },
        { id: "80", name: "Ethereum" },
        { id: "58", name: "XRP" },
        { id: "518", name: "Tether" },
        { id: "2710", name: "Binance Coin" },
        { id: "48543", name: "Solana" },
        { id: "33285", name: "USD Coin" },
        { id: "257", name: "Cardano" },
        { id: "2", name: "Dogecoin" },
        { id: "2713", name: "TRON" }
    ];

    function populateDropdown() {
        cryptoSelect.innerHTML = "<option value=''>Select a cryptocurrency</option>";
        top10Cryptos.forEach(crypto => {
            const option = document.createElement("option");
            option.value = crypto.id;
            option.textContent = crypto.name;
            cryptoSelect.appendChild(option);
        });
    }

    populateDropdown();

    function checkAlert(price, alertPrice) {
        if (price >= alertPrice) {
            alertMessage.textContent = `Alert: ${selectedCryptoName} has reached or surpassed $${alertPrice}`;
            alertMessage.style.display = "block";  // Ensure the alert is shown
        } else {
            alertMessage.style.display = "none";  // Hide it when not triggered
        }
    }


    cryptoSelect.addEventListener("change", async () => {
        selectedCryptoId = cryptoSelect.value;
        if (!selectedCryptoId) return;

        try {
            const response = await fetch(`https://api.coinlore.net/api/ticker/?id=${selectedCryptoId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            cryptoPrice.textContent = parseFloat(data[0].price_usd).toFixed(2);
        } catch (error) {
            console.error("Error fetching crypto price:", error);
            errorMessage.textContent = "Failed to fetch cryptocurrency price.";
        }
    });

    setAlertButton.addEventListener("click", () => {
        alertPrice = parseFloat(alertPriceInput.value);
        if (isNaN(alertPrice) || alertPrice <= 0) {
            alertMessage.textContent = "Please enter a valid alert price.";
            return;
        }
        alertMessage.textContent = `Alert set at $${alertPrice.toFixed(2)}`;
    });

    setInterval(async () => {
        if (!selectedCryptoId || !alertPrice) return;

        try {
            const response = await fetch(`https://api.coinlore.net/api/ticker/?id=${selectedCryptoId}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const currentPrice = parseFloat(data[0].price_usd);
            cryptoPrice.textContent = currentPrice.toFixed(2);

            if (currentPrice >= alertPrice) {
                alertMessage.textContent = `🚨 Alert! ${cryptoSelect.options[cryptoSelect.selectedIndex].text} has reached $${currentPrice.toFixed(2)}`;
            }
        } catch (error) {
            console.error("Error checking cryptocurrency price:", error);
            errorMessage.textContent = "Error checking cryptocurrency price.";
        }
    }, 10000);
});
