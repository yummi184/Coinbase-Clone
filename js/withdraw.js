document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Destination select handling
  const destinationSelect = document.getElementById("destination")
  const walletAddressGroup = document.getElementById("walletAddressGroup")
  const walletAddressLabel = document.getElementById("walletAddressLabel")
  const walletAddressInput = document.getElementById("walletAddress")

  if (destinationSelect) {
    destinationSelect.addEventListener("change", function () {
      const selectedValue = this.value

      if (selectedValue) {
        walletAddressGroup.classList.remove("hidden")

        // Update label based on selection
        if (selectedValue === "bank") {
          walletAddressLabel.textContent = "Account Number"
          walletAddressInput.placeholder = "Enter account number"
        } else if (selectedValue === "paypal") {
          walletAddressLabel.textContent = "PayPal Email"
          walletAddressInput.placeholder = "Enter PayPal email"
        } else {
          walletAddressLabel.textContent = "Wallet Address"
          walletAddressInput.placeholder = "Enter wallet address"
        }
      } else {
        walletAddressGroup.classList.add("hidden")
      }
    })
  }

  // Withdraw form handling
  const withdrawForm = document.getElementById("withdrawForm")
  if (withdrawForm) {
    withdrawForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const amount = document.getElementById("amount").value
      const destination = document.getElementById("destination").value
      const walletAddress = document.getElementById("walletAddress").value
      const errorElement = document.getElementById("withdrawError")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate amount
      if (Number.parseFloat(amount) <= 0) {
        errorElement.textContent = "Amount must be greater than 0"
        return
      }

      // Validate wallet address
      if (!walletAddress) {
        errorElement.textContent = "Please enter a valid address"
        return
      }

      // Make API request to withdraw money
      fetch("/api/transactions/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          destination,
          address: walletAddress,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Show success message and redirect
            alert(`Successfully withdrew $${amount} to  {
                    // Show success message and redirect
                    alert(\`Successfully withdrew $${amount} to your ${destination}`)
            window.location.href = "dashboard.html"
          } else {
            errorElement.textContent = data.message || "Failed to withdraw funds"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Withdraw error:", error)
        })
    })
  }
})

