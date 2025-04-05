document.addEventListener("DOMContentLoaded", () => {
  console.log("Send BTC Page Initialized")

  // Handle next button
  const nextButtons = document.querySelectorAll(".next-button, .next-button-large")

  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Check if we have an address
      const addressElement = document.querySelector(".recipient-address")
      if (addressElement) {
        window.location.href = "send-amount.html"
      } else {
        alert("Please enter a Bitcoin address")
      }
    })
  })

  // Handle clipboard paste suggestion
  const clipboardSuggestion = document.querySelector(".clipboard-suggestion")
  if (clipboardSuggestion) {
    clipboardSuggestion.addEventListener("click", () => {
      const address = document.querySelector(".clipboard-address").textContent
      window.location.href = "send-btc-address.html"
    })
  }
})

