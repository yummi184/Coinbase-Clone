document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Get token from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const tokenParam = urlParams.get("token")

  // Update UI with token name
  const tokenTypeSelect = document.getElementById("tokenType")
  const fundTokenTypeSelect = document.getElementById("fundTokenType")

  if (tokenParam && tokenTypeSelect) {
    tokenTypeSelect.value = tokenParam
  }

  if (tokenParam && fundTokenTypeSelect) {
    fundTokenTypeSelect.value = tokenParam
  }

  // Handle send tabs
  const sendTabs = document.querySelectorAll(".send-tab")
  const sendForms = document.querySelectorAll(".send-form")

  sendTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs and forms
      sendTabs.forEach((t) => t.classList.remove("active"))
      sendForms.forEach((form) => form.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Show corresponding form
      const formId = this.getAttribute("data-form")
      document.getElementById(formId).classList.add("active")
    })
  })

  // Token Form
  const tokenForm = document.getElementById("tokenForm")
  if (tokenForm) {
    tokenForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const tokenType = document.getElementById("tokenType").value
      const recipientAddress = document.getElementById("recipientAddress").value
      const amount = document.getElementById("tokenAmount").value
      const note = document.getElementById("tokenNote").value
      const errorElement = document.getElementById("sendTokenError")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate amount
      if (Number.parseFloat(amount) <= 0) {
        errorElement.textContent = "Amount must be greater than 0"
        return
      }

      // Make API request to send token
      fetch("/api/transactions/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientAddress,
          amount: Number.parseFloat(amount),
          tokenType,
          note,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Show success message
            alert(`Successfully sent ${amount} ${tokenType} to ${recipientAddress}`)

            // Redirect to dashboard
            window.location.href = "dashboard.html"
          } else {
            errorElement.textContent = data.message || "Failed to send funds"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Send funds error:", error)
        })
    })
  }

  // Main Wallet Form
  const mainWalletForm = document.getElementById("mainWalletForm")
  if (mainWalletForm) {
    mainWalletForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const recipientAddress = document.getElementById("mainRecipientAddress").value
      const amount = document.getElementById("mainAmount").value
      const note = document.getElementById("mainNote").value
      const errorElement = document.getElementById("mainSendError")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate amount
      if (Number.parseFloat(amount) <= 0) {
        errorElement.textContent = "Amount must be greater than 0"
        return
      }

      // Make API request to send funds from main wallet
      fetch("/api/transactions/send-main", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientAddress,
          amount: Number.parseFloat(amount),
          note,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Update the UI immediately
            const updatedUser = JSON.parse(localStorage.getItem("currentUser"))

            // Deduct from main balance
            updatedUser.balance -= Number.parseFloat(amount)

            // Update localStorage
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))

            // Show transaction receipt
            showTransactionReceipt({
              type: "main-to-main",
              amount: Number.parseFloat(amount),
              token: "MAIN",
              from: "My Main Wallet",
              to: recipientAddress,
              date: new Date().toISOString(),
              txId: data.transactionId || generateTxId(),
            })

            // Redirect to dashboard
            window.location.href = "dashboard.html"
          } else {
            errorElement.textContent = data.message || "Failed to send funds"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Send funds error:", error)
        })
    })
  }

  // Fund Token from Main Form
  const fundTokenForm = document.getElementById("fundTokenForm")
  if (fundTokenForm) {
    fundTokenForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const tokenType = document.getElementById("fundTokenType").value
      const amount = document.getElementById("fundAmount").value
      const note = document.getElementById("fundNote").value
      const errorElement = document.getElementById("fundTokenError")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate amount
      if (Number.parseFloat(amount) <= 0) {
        errorElement.textContent = "Amount must be greater than 0"
        return
      }

      // Make API request to fund token wallet from main wallet
      fetch("/api/transactions/fund-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tokenType,
          amount: Number.parseFloat(amount),
          note: note || `Funded ${tokenType} wallet from main wallet`,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Update the UI immediately
            const updatedUser = JSON.parse(localStorage.getItem("currentUser"))

            // Deduct from main balance
            updatedUser.balance -= Number.parseFloat(amount)

            // Add to token balance
            updatedUser[`${tokenType.toLowerCase()}Balance`] =
              (updatedUser[`${tokenType.toLowerCase()}Balance`] || 0) + Number.parseFloat(amount)

            // Update localStorage
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))

            // Show transaction receipt
            showTransactionReceipt({
              type: "main-to-token",
              amount: Number.parseFloat(amount),
              token: tokenType,
              from: "Main Wallet",
              to: `${tokenType} Wallet`,
              date: new Date().toISOString(),
              txId: data.transactionId || generateTxId(),
            })

            // Redirect to dashboard
            window.location.href = "dashboard.html"
          } else {
            errorElement.textContent = data.message || "Failed to fund token wallet"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Fund token error:", error)
        })
    })
  }

  // Close modals
  const closeModalButtons = document.querySelectorAll(".close-modal")
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.remove("active")
      })
    })
  })

  // Helper functions
  function generateTxId() {
    return "tx_" + Math.random().toString(36).substring(2, 15)
  }

  // Function to show transaction receipt
  function showTransactionReceipt(transaction) {
    // Create receipt modal
    const modal = document.createElement("div")
    modal.className = "modal active"
    modal.id = "receiptModal"

    const formattedDate = new Date(transaction.date).toLocaleString()

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Transaction Receipt</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div id="receiptContent">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="font-size: 48px; color: var(--primary-color);">
                <i class="fas fa-exchange-alt"></i>
              </div>
              <h2 style="margin: 12px 0;">${transaction.type === "main-to-token" ? "Fund Token Wallet" : "Send to Main Wallet"}</h2>
              <div style="font-size: 24px; font-weight: 700; margin: 16px 0;">${transaction.amount} ${transaction.token}</div>
            </div>
            
            <div style="background-color: var(--card-color); border-radius: var(--border-radius); padding: 16px; margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                <div style="color: var(--text-secondary);">Date</div>
                <div>${formattedDate}</div>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                <div style="color: var(--text-secondary);">From</div>
                <div>${transaction.from}</div>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                <div style="color: var(--text-secondary);">To</div>
                <div>${transaction.to}</div>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                <div style="color: var(--text-secondary);">Transaction ID</div>
                <div style="word-break: break-all;">${transaction.txId}</div>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <div style="color: var(--text-secondary);">Status</div>
                <div>Completed</div>
              </div>
            </div>
            
            <button id="printReceiptBtn" style="width: 100%; padding: 12px; background-color: var(--card-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; font-weight: 600;">
              <i class="fas fa-print"></i> Print Receipt
            </button>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listener to close modal
    const closeBtn = modal.querySelector(".modal-close")
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal)
      window.location.href = "dashboard.html"
    })

    // Print receipt functionality
    const printReceiptBtn = document.getElementById("printReceiptBtn")
    if (printReceiptBtn) {
      printReceiptBtn.addEventListener("click", () => {
        const receiptContent = document.getElementById("receiptContent")
        const printWindow = window.open("", "", "width=600,height=600")
        printWindow.document.write("<html><head><title>Transaction Receipt</title>")
        printWindow.document.write(
          "<style>body { font-family: Arial, sans-serif; padding: 20px; } .receipt-header { text-align: center; margin-bottom: 20px; } .receipt-title { font-size: 18px; font-weight: bold; } .receipt-amount { text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; } .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; } .receipt-footer { text-align: center; margin-top: 20px; color: #666; }</style>",
        )
        printWindow.document.write("</head><body>")
        printWindow.document.write(`
          <div class="receipt-header">
            <h1 class="receipt-title">Transaction Receipt</h1>
            <p>${transaction.type === "main-to-token" ? "Fund Token Wallet" : "Send to Main Wallet"}</p>
          </div>
          <div class="receipt-amount">${transaction.amount} ${transaction.token}</div>
          <div class="receipt-details">
            <div class="receipt-row">
              <div>Date</div>
              <div>${formattedDate}</div>
            </div>
            <div class="receipt-row">
              <div>From</div>
              <div>${transaction.from}</div>
            </div>
            <div class="receipt-row">
              <div>To</div>
              <div>${transaction.to}</div>
            </div>
            <div class="receipt-row">
              <div>Transaction ID</div>
              <div>${transaction.txId}</div>
            </div>
            <div class="receipt-row">
              <div>Status</div>
              <div>Completed</div>
            </div>
          </div>
          <div class="receipt-footer">
            <p>Thank you for using our service</p>
          </div>
        `)
        printWindow.document.write("</body></html>")
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      })
    }

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
        window.location.href = "dashboard.html"
      }
    })
  }
})

