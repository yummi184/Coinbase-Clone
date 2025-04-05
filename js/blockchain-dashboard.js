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

  // Load user data and balances
  loadUserData()
  loadTransactions()

  // DeFi Wallet tab click handler
  const defiWalletTab = document.getElementById("defiWalletTab")
  if (defiWalletTab) {
    defiWalletTab.addEventListener("click", () => {
      window.location.href = "defi-wallet.html"
    })
  }

  // Bottom navigation handlers
  const pricesBtn = document.getElementById("pricesBtn")
  const dexBtn = document.getElementById("dexBtn")
  const nftsBtn = document.getElementById("nftsBtn")

  const comingSoonModal = document
    .getElementById("comingSoonModal")

    [
      // Show coming soon modal for features not yet implemented
      (pricesBtn, dexBtn, nftsBtn)
    ].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault()
          comingSoonModal.classList.add("active")
        })
      }
    })

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
  function loadUserData() {
    // Update total balance
    const totalBalanceElement = document.getElementById("totalBalance")
    if (totalBalanceElement) {
      totalBalanceElement.textContent = `US$${formatNumber(currentUser.balance || 0)}`
    }
  }

  function loadTransactions() {
    fetch("/api/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.transactions.length > 0) {
          // Get the activity list element
          const activityList = document.getElementById("activityList")
          if (!activityList) return

          // Clear existing items
          activityList.innerHTML = ""

          // Display the most recent 3 transactions
          const recentTransactions = data.transactions.slice(0, 3)

          recentTransactions.forEach((transaction) => {
            const activityItem = createActivityItem(transaction)
            activityList.appendChild(activityItem)
          })
        }
      })
      .catch((error) => {
        console.error("Error loading transactions:", error)
      })
  }

  function createActivityItem(transaction) {
    const div = document.createElement("div")
    div.className = "activity-item"

    const isReceived = transaction.type === "received"
    const iconClass = isReceived ? "fa-arrow-down" : "fa-arrow-up"

    div.innerHTML = `
      <div class="activity-icon">
        <i class="fas ${iconClass}"></i>
      </div>
      <div class="activity-info">
        <div class="activity-type">${isReceived ? "Received" : "Sent"} ${transaction.token}</div>
        <div class="activity-date">${formatDate(transaction.date)}</div>
        <div class="activity-hash">${transaction.id}</div>
      </div>
      <div class="activity-amount">US$${formatNumber(transaction.amount)}</div>
    `

    return div
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
})

