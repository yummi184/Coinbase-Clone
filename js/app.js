document.addEventListener("DOMContentLoaded", () => {
  // Initialize the app
  console.log("Crypto Wallet App Initialized")

  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    name: "Account 1",
    balance: 0,
    cryptos: [
      { name: "Solana", symbol: "SOL", amount: 0, value: 0 },
      { name: "Ethereum", symbol: "ETH", amount: 0, value: 0 },
      { name: "Ethereum", symbol: "ETH", amount: 0, value: 0, badge: true },
      { name: "Polygon", symbol: "POL", amount: 0, value: 0 },
      { name: "Bitcoin", symbol: "BTC", amount: 0, value: 0 },
    ],
  }

  // Set current time in status bar
  updateTime()
  setInterval(updateTime, 60000) // Update time every minute

  // Handle navigation
  setupNavigation()

  // Handle token selection
  setupTokenSelection()

  // Handle modals
  setupModals()
})

function updateTime() {
  const timeElements = document.querySelectorAll(".time")
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, "0")
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const timeString = `${hours}:${minutes}`

  timeElements.forEach((el) => {
    el.textContent = timeString
  })
}

function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item")

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      // Remove active class from all items
      navItems.forEach((i) => i.classList.remove("active"))

      // Add active class to clicked item
      this.classList.add("active")
    })
  })

  // Handle back buttons
  const backButtons = document.querySelectorAll(".back-button")
  backButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.history.back()
    })
  })

  // Handle close buttons
  const closeButtons = document.querySelectorAll(".close-button")
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  })
}

function setupTokenSelection() {
  const tokenItems = document.querySelectorAll(".token-item")

  tokenItems.forEach((item) => {
    item.addEventListener("click", function () {
      const token = this.getAttribute("data-token")
      if (token === "bitcoin") {
        window.location.href = "send-btc.html"
      } else {
        // Handle other tokens
        alert(`${token.charAt(0).toUpperCase() + token.slice(1)} sending coming soon!`)
      }
    })
  })
}

function setupModals() {
  // Video overlay play button
  const playButtons = document.querySelectorAll(".play-button")
  playButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Video playback is not available in this demo.")
    })
  })
}

