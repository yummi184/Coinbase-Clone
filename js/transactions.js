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

  // Load transactions
  loadTransactions()

  // Filter tabs
  const filterTabs = document.querySelectorAll(".filter-tab")
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      filterTabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Filter transactions
      const filter = this.getAttribute("data-filter")
      filterTransactions(filter)
    })
  })

  // Transaction item click handler
  const transactionItems = document.querySelectorAll(".transaction-item")
  transactionItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Get transaction details
      const title = this.querySelector(".transaction-title").textContent
      const date = this.querySelector(".transaction-date").textContent
      const amount = this.querySelector(".transaction-value").textContent
      const status = this.querySelector(".transaction-status").textContent
      const isReceived = this.querySelector(".transaction-icon").classList.contains("received")

      // Show receipt
      showReceipt({
        title,
        date,
        amount,
        status,
        type: isReceived ? "received" : "sent",
      })
    })
  })

  // Close modals
  const closeModalButtons = document.querySelectorAll(".modal-close")
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.remove("active")
      })
    })
  })

  // Helper functions
  function loadTransactions() {
    fetch("/api/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.transactions.length > 0) {
          // Get the transaction list element
          const transactionsList = document.getElementById("transactionsList")
          if (!transactionsList) return

          // Clear existing items
          transactionsList.innerHTML = ""

          // Display transactions
          data.transactions.forEach((transaction) => {
            const transactionItem = createTransactionItem(transaction)
            transactionsList.appendChild(transactionItem)
          })
        }
      })
      .catch((error) => {
        console.error("Error loading transactions:", error)
      })
  }

  function createTransactionItem(transaction) {
    const div = document.createElement("div")
    div.className = "transaction-item"
    div.setAttribute("data-type", transaction.type)

    const isReceived = transaction.type === "received"
    const iconClass = isReceived ? "received" : "sent"
    const valueClass = isReceived ? "received" : "sent"
    const prefix = isReceived ? "+" : "-"

    div.innerHTML = `
      <div class="transaction-icon ${iconClass}">
        <i class="fas fa-arrow-${isReceived ? "down" : "up"}"></i>
      </div>
      <div class="transaction-info">
        <div class="transaction-title">${isReceived ? "Received" : "Sent"} ${transaction.token}</div>
        <div class="transaction-date">${formatDate(transaction.date)}</div>
      </div>
      <div class="transaction-amount">
        <div class="transaction-value ${valueClass}">${prefix}$${formatNumber(transaction.amount)}</div>
        <div class="transaction-status">${transaction.status}</div>
      </div>
    `

    // Add click event to show receipt
    div.addEventListener("click", () => {
      showReceipt({
        title: `${isReceived ? "Received" : "Sent"} ${transaction.token}`,
        date: formatDate(transaction.date),
        amount: `${prefix}$${formatNumber(transaction.amount)}`,
        status: transaction.status,
        type: transaction.type,
        from: transaction.from,
        to: transaction.to,
        txId: transaction.id,
      })
    })

    return div
  }

  function filterTransactions(filter) {
    const transactionItems = document.querySelectorAll(".transaction-item")

    transactionItems.forEach((item) => {
      if (filter === "all" || item.getAttribute("data-type") === filter) {
        item.style.display = "flex"
      } else {
        item.style.display = "none"
      }
    })
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString("default", { month: "short" })
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  function formatNumber(num) {
    if (num === undefined || num === null) return "0.00"
    return Number.parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  function showReceipt(transaction) {
    const receiptModal = document.getElementById("receiptModal")
    const receiptContent = document.getElementById("receiptContent")

    if (!receiptModal || !receiptContent) return

    receiptContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 48px; color: var(--${transaction.type === "received" ? "positive" : "negative"}-color);">
          <i class="fas fa-arrow-${transaction.type === "received" ? "down" : "up"}"></i>
        </div>
        <h2 style="margin: 12px 0;">${transaction.title}</h2>
        <div style="font-size: 24px; font-weight: 700; margin: 16px 0;">${transaction.amount}</div>
      </div>
      
      <div style="background-color: var(--card-color); border-radius: var(--border-radius); padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
          <div style="color: var(--text-secondary);">Date</div>
          <div>${transaction.date}</div>
        </div>
        ${
          transaction.from
            ? `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
          <div style="color: var(--text-secondary);">From</div>
          <div>${transaction.from}</div>
        </div>
        `
            : ""
        }
        ${
          transaction.to
            ? `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
          <div style="color: var(--text-secondary);">To</div>
          <div>${transaction.to}</div>
        </div>
        `
            : ""
        }
        ${
          transaction.txId
            ? `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
          <div style="color: var(--text-secondary);">Transaction ID</div>
          <div style="word-break: break-all;">${transaction.txId}</div>
        </div>
        `
            : ""
        }
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <div style="color: var(--text-secondary);">Status</div>
          <div>${transaction.status}</div>
        </div>
      </div>
    `

    receiptModal.classList.add("active")

    // Print receipt functionality
    const printReceiptBtn = document.getElementById("printReceiptBtn")
    if (printReceiptBtn) {
      printReceiptBtn.addEventListener("click", () => {
        const printWindow = window.open("", "", "width=600,height=600")
        printWindow.document.write("<html><head><title>Transaction Receipt</title>")
        printWindow.document.write(
          "<style>body { font-family: Arial, sans-serif; padding: 20px; } .receipt-header { text-align: center; margin-bottom: 20px; } .receipt-title { font-size: 18px; font-weight: bold; } .receipt-amount { text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; } .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; } .receipt-footer { text-align: center; margin-top: 20px; color: #666; }</style>",
        )
        printWindow.document.write("</head><body>")
        printWindow.document.write(`
          <div class="receipt-header">
            <h1 class="receipt-title">Transaction Receipt</h1>
            <p>${transaction.title}</p>
          </div>
          <div class="receipt-amount">${transaction.amount}</div>
          <div class="receipt-details">
            <div class="receipt-row">
              <div>Date</div>
              <div>${transaction.date}</div>
            </div>
            ${
              transaction.from
                ? `
            <div class="receipt-row">
              <div>From</div>
              <div>${transaction.from}</div>
            </div>
            `
                : ""
            }
            ${
              transaction.to
                ? `
            <div class="receipt-row">
              <div>To</div>
              <div>${transaction.to}</div>
            </div>
            `
                : ""
            }
            ${
              transaction.txId
                ? `
            <div class="receipt-row">
              <div>Transaction ID</div>
              <div>${transaction.txId}</div>
            </div>
            `
                : ""
            }
            <div class="receipt-row">
              <div>Status</div>
              <div>${transaction.status}</div>
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
  }
})

