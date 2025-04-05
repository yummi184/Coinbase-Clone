document.addEventListener("DOMContentLoaded", () => {
  console.log("Send Amount Page Initialized")

  // Handle keypad input
  const keypadKeys = document.querySelectorAll(".keypad-key")
  const amountNumber = document.getElementById("amount-number")
  let currentAmount = amountNumber.textContent

  keypadKeys.forEach((key) => {
    key.addEventListener("click", function () {
      const keyValue = this.textContent.trim().charAt(0)

      // Handle delete key
      if (this.classList.contains("delete-key")) {
        if (currentAmount.length > 1) {
          currentAmount = currentAmount.slice(0, -1)
        } else {
          currentAmount = "0"
        }
      }
      // Handle decimal point
      else if (keyValue === "." && !currentAmount.includes(".")) {
        currentAmount += "."
      }
      // Handle numbers
      else if (!isNaN(keyValue)) {
        if (currentAmount === "0") {
          currentAmount = keyValue
        } else {
          currentAmount += keyValue
        }
      }

      // Update display
      amountNumber.textContent = currentAmount

      // Update USD value
      updateUsdValue(currentAmount)

      // Check if amount is valid
      validateAmount(currentAmount)
    })
  })

  // Handle max button
  const maxButton = document.querySelector(".max-button")
  if (maxButton) {
    maxButton.addEventListener("click", () => {
      const availableAmount = document.querySelector(".available-amount").textContent
      const match = availableAmount.match(/[\d.]+/)
      if (match) {
        currentAmount = match[0]
        amountNumber.textContent = currentAmount
        updateUsdValue(currentAmount)
        validateAmount(currentAmount)
      }
    })
  }

  // Handle next button
  const nextButton = document.querySelector(".next-button")
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (validateAmount(currentAmount)) {
        alert(`Transaction of ${currentAmount} BTC initiated!`)
        window.location.href = "index.html"
      }
    })
  }

  // Initialize
  updateUsdValue(currentAmount)
  validateAmount(currentAmount)
})

function updateUsdValue(btcAmount) {
  const amountUsd = document.querySelector(".amount-usd")
  const btcPrice = 82994.1 // Example BTC price in USD

  const usdValue = Number.parseFloat(btcAmount) * btcPrice
  amountUsd.textContent = `~$${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function validateAmount(btcAmount) {
  const amountNumber = document.getElementById("amount-number")
  const errorMessage = document.querySelector(".error-message")
  const nextButton = document.querySelector(".next-button")

  // Check if amount is greater than available balance
  const availableAmount = document.querySelector(".available-amount").textContent
  const match = availableAmount.match(/[\d.]+/)
  const availableBtc = match ? Number.parseFloat(match[0]) : 0

  if (Number.parseFloat(btcAmount) > availableBtc) {
    amountNumber.classList.add("error")
    if (errorMessage) {
      errorMessage.textContent = "⊘ Insufficient balance"
      errorMessage.style.display = "block"
    }
    if (nextButton) {
      nextButton.disabled = true
    }
    return false
  } else {
    amountNumber.classList.remove("error")
    if (errorMessage) {
      errorMessage.style.display = "none"
    }
    if (nextButton) {
      nextButton.disabled = false
    }
    return true
  }
}

