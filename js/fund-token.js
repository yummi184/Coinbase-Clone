document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Apply dark mode if enabled
  const isDarkMode = localStorage.getItem("darkMode") === "true"
  if (isDarkMode) {
    document.body.classList.add("dark-mode")
  }

  // Get token from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const tokenParam = urlParams.get("token")

  // Set token in dropdown if provided in URL
  if (tokenParam) {
    const tokenTypeSelect = document.getElementById("tokenType")
    if (tokenTypeSelect && tokenTypeSelect.querySelector(`option[value="${tokenParam}"]`)) {
      tokenTypeSelect.value = tokenParam
    }
  }

  // Fund token form handling
  const fundTokenForm = document.getElementById("fundTokenForm")
  if (fundTokenForm) {
    fundTokenForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const tokenType = document.getElementById("tokenType").value
      const amount = document.getElementById("amount").value
      const errorElement = document.getElementById("fundTokenError")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate amount
      if (Number.parseFloat(amount) <= 0) {
        errorElement.textContent = "Amount must be greater than 0"
        return
      }

      // Make API request to fund token wallet
      fetch("/api/transactions/fund-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tokenType,
          amount: Number.parseFloat(amount),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Show success message and redirect
            alert(`Successfully funded ${tokenType} wallet with $${amount}`)
            window.location.href = "dashboard.html"
          } else {
            errorElement.textContent = data.message || "Failed to fund wallet"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Fund token error:", error)
        })
    })
  }
})

