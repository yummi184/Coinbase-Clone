document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Fund user form handling
  const fundUserForm = document.getElementById("fundUserForm")
  if (fundUserForm) {
    fundUserForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const recipientEmail = document.getElementById("recipientEmail").value
      const amount = document.getElementById("amount").value
      const fundSource = document.querySelector('input[name="fundSource"]:checked').value
      const note = document.getElementById("note").value
      const errorElement = document.getElementById("fundError")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate amount
      if (Number.parseFloat(amount) <= 0) {
        errorElement.textContent = "Amount must be greater than 0"
        return
      }

      // Determine API endpoint based on fund source
      const endpoint = fundSource === "bitcoin" ? "/api/transactions/fund-from-bitcoin" : "/api/transactions/send"

      // Make API request to fund user
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientEmail,
          amount: Number.parseFloat(amount),
          note,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Show success message and redirect
            alert(`Successfully sent $${amount} to ${recipientEmail}`)
            window.location.href = "dashboard.html"
          } else {
            errorElement.textContent = data.message || "Failed to send money"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Fund user error:", error)
        })
    })
  }
})

