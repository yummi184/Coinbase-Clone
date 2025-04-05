document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Deposit form handling
  const depositForm = document.getElementById("depositForm")
  if (depositForm) {
    depositForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const amount = document.getElementById("amount").value
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value
      const errorElement = document.getElementById("depositError")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate amount
      if (Number.parseFloat(amount) <= 0) {
        errorElement.textContent = "Amount must be greater than 0"
        return
      }

      // Make API request to deposit money
      fetch("/api/transactions/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          method: paymentMethod,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Show success message and redirect
            alert(`Successfully deposited $${amount} via ${paymentMethod}`)
            window.location.href = "dashboard.html"
          } else {
            errorElement.textContent = data.message || "Failed to deposit funds"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Deposit error:", error)
        })
    })
  }
})

