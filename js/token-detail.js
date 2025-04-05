document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Get token type from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const tokenType = urlParams.get("token") || "BNB"

  // Token data mapping
  const tokenData = {
    BNB: {
      name: "BNB price",
      price: 597.12,
      change: 8.91,
      changePercent: 1.51,
      about:
        "Binance Coin is a cryptocurrency used to pay fees on the Binance cryptocurrency exchange. Fees paid in Binance Coin on the exchange receive a discount.",
      balanceField: "bnbBalance",
      color: "#F3BA2F",
      network: "BNB (Binance Smart) Chain",
    },
    TRX: {
      name: "TRX price",
      price: 0.2517,
      change: 0.0015,
      changePercent: 0.06,
      about:
        "TRON is a blockchain-based decentralized platform that aims to build a free, global digital content entertainment system with distributed storage technology.",
      balanceField: "trxBalance",
      color: "#FF0000",
      network: "TRON Network",
    },
    USDT: {
      name: "USDT price",
      price: 1.0,
      change: 0.0,
      changePercent: 0.0,
      about:
        "Tether (USDT) is a stablecoin pegged to the US dollar, providing individuals with a stable alternative to the high volatility of other cryptocurrencies.",
      balanceField: "usdtBalance",
      color: "#26A17B",
      network: "Multiple Networks",
    },
    USDC: {
      name: "USDC price",
      price: 1.01,
      change: 0.0001,
      changePercent: 0.01,
      about: "USD Coin (USDC) is a stablecoin that is pegged to the US dollar and runs on multiple blockchains.",
      balanceField: "usdcBalance",
      color: "#2775CA",
      network: "Multiple Networks",
    },
    SOL: {
      name: "SOL price",
      price: 126.54,
      change: 1.76,
      changePercent: 1.41,
      about:
        "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.",
      balanceField: "solBalance",
      color: "#9945FF",
      network: "Solana Network",
    },
    ETH: {
      name: "ETH price",
      price: 3452.78,
      change: 144.12,
      changePercent: 4.35,
      about:
        "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.",
      balanceField: "ethBalance",
      color: "#627EEA",
      network: "Ethereum Network",
    },
    BTC: {
      name: "BTC price",
      price: 65432.21,
      change: 2032.4,
      changePercent: 3.2,
      about:
        "Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network.",
      balanceField: "btcBalance",
      color: "#F7931A",
      network: "Bitcoin Network",
    },
    POL: {
      name: "POL price",
      price: 0.78,
      change: -0.0075,
      changePercent: -0.96,
      about:
        "Polygon (formerly Matic Network) is a protocol and a framework for building and connecting Ethereum-compatible blockchain networks.",
      balanceField: "polBalance",
      color: "#8247E5",
      network: "Polygon Network",
    },
  }

  // Get token data
  const data = tokenData[tokenType] || tokenData["BNB"]

  // Update UI with token data
  document.getElementById("tokenName").textContent = data.name
  document.getElementById("tokenPrice").textContent = `$${data.price.toLocaleString()}`

  // Update price change
  const priceChangeElement = document.getElementById("priceChange")
  const priceChangeAmountElement = document.getElementById("priceChangeAmount")

  if (data.changePercent < 0) {
    priceChangeElement.classList.add("negative")
    priceChangeElement.querySelector("i").className = "fas fa-arrow-down"
  } else {
    priceChangeElement.classList.remove("negative")
    priceChangeElement.querySelector("i").className = "fas fa-arrow-up"
  }

  priceChangeAmountElement.textContent = `$${Math.abs(data.change).toLocaleString()} (${Math.abs(data.changePercent)}%)`

  // Update token icon
  document.getElementById("tokenImg").src = `img/${tokenType.toLowerCase()}.png`
  document.getElementById("tokenImg").alt = tokenType

  // Update balance
  const balanceField = data.balanceField
  const balance = currentUser[balanceField] || 0
  const balanceUsd = balance * data.price

  document.getElementById("balanceUsd").textContent = `$${balanceUsd.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
  document.getElementById("balanceToken").textContent = `${balance} ${tokenType}`

  // Update about section
  document.getElementById("aboutTitle").textContent = `About ${tokenType}`
  document.getElementById("aboutContent").textContent = data.about

  // Update network banner
  const networkBanner = document.querySelector(".network-banner")
  networkBanner.querySelector("div:last-child").textContent = `This asset is on ${data.network}`

  // Add event listeners for action buttons
  document.querySelectorAll(".action-item").forEach((item) => {
    item.addEventListener("click", function () {
      const action = this.querySelector(".action-label").textContent.toLowerCase()

      switch (action) {
        case "send":
          window.location.href = `send.html?token=${tokenType}`
          break
        case "receive":
          window.location.href = `receive.html?token=${tokenType}`
          break
        case "buy":
        case "swap":
        case "bridge":
        case "cash out":
        case "text send":
        case "share":
          alert(`${action.charAt(0).toUpperCase() + action.slice(1)} functionality coming soon!`)
          break
      }
    })
  })
})

