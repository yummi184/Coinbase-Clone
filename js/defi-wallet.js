document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // Load user data and balances
  loadUserData()
  loadTransactions()

  // Set up polling for balance updates - check every 10 seconds
  setInterval(() => {
    refreshBalances()
  }, 10000)

  // Tab switching
  const accountTab = document.getElementById("accountTab")
  if (accountTab) {
    accountTab.addEventListener("click", () => {
      window.location.href = "dashboard.html"
    })
  }

  // Deposit button click handler
  const depositBtn = document.getElementById("depositBtn")
  const depositCryptoBtn = document.getElementById("depositCryptoBtn")

  if (depositBtn) {
    depositBtn.addEventListener("click", () => {
      // Show token selection modal
      document.getElementById("tokenModal").classList.add("active")
    })
  }

  if (depositCryptoBtn) {
    depositCryptoBtn.addEventListener("click", () => {
      // Show token selection modal
      document.getElementById("tokenModal").classList.add("active")
    })
  }

  // Send button click handler
  const sendBtn = document.getElementById("sendBtn")
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      // Redirect directly to send.html
      window.location.href = "send.html"
    })
  }

  // Close token modal
  const closeTokenModal = document.getElementById("closeTokenModal")
  if (closeTokenModal) {
    closeTokenModal.addEventListener("click", () => {
      document.getElementById("tokenModal").classList.remove("active")
    })
  }

  // Token modal item click handler
  const tokenModalItems = document.querySelectorAll(".token-modal-item")
  tokenModalItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tokenType = this.getAttribute("data-token")
      document.getElementById("tokenModal").classList.remove("active")

      // Always go to receive page when selecting a token from deposit
      window.location.href = `receive.html?token=${tokenType}`
    })
  })

  // Toggle balance visibility
  const visibilityToggle = document.querySelector(".visibility-toggle")
  const portfolioAmount = document.querySelector(".portfolio-amount")
  let isBalanceHidden = false

  if (visibilityToggle && portfolioAmount) {
    visibilityToggle.addEventListener("click", toggleBalanceVisibility)
  }

  function toggleBalanceVisibility() {
    isBalanceHidden = !isBalanceHidden

    if (isBalanceHidden) {
      // Hide balance with asterisks
      portfolioAmount.innerHTML = `
        US$****
        <button class="visibility-toggle">
          <i class="far fa-eye-slash"></i>
        </button>
      `
    } else {
      // Show actual balance
      portfolioAmount.innerHTML = `
        US$${formatNumber(currentUser.balance || 0)}
        <button class="visibility-toggle">
          <i class="far fa-eye"></i>
        </button>
      `
    }

    // Re-attach event listener to the new button
    const newToggleBtn = portfolioAmount.querySelector(".visibility-toggle")
    if (newToggleBtn) {
      newToggleBtn.addEventListener("click", toggleBalanceVisibility)
    }
  }

  // Bottom navigation handlers
  const pricesBtn = document.getElementById("pricesBtn")
  const dexBtn = document.getElementById("dexBtn")
  const nftsBtn = document.getElementById("nftsBtn")
  const swapBtn = document.getElementById("swapBtn")
  const sellBtn = document.getElementById("sellBtn")

  const comingSoonModal = document
    .getElementById("comingSoonModal")

    [
      // Show coming soon modal for features not yet implemented
      (pricesBtn, dexBtn, nftsBtn, swapBtn, sellBtn)
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

    // Update portfolio amount
    const portfolioAmount = document.querySelector(".portfolio-amount")
    if (portfolioAmount) {
      portfolioAmount.innerHTML = `
        US$${formatNumber(currentUser.balance || 0)}
        <button class="visibility-toggle">
          <i class="far fa-eye"></i>
        </button>
      `

      // Attach event listener to the visibility toggle
      const visibilityToggle = portfolioAmount.querySelector(".visibility-toggle")
      if (visibilityToggle) {
        visibilityToggle.addEventListener("click", toggleBalanceVisibility)
      }
    }

    // Update token balances in modal
    updateTokenBalance("mainBalance", currentUser.balance || 0)
    updateTokenBalance("trxBalance", currentUser.trxBalance || 0)
    updateTokenBalance("usdtBalance", currentUser.usdtBalance || 0)
    updateTokenBalance("usdcBalance", currentUser.usdcBalance || 0)
    updateTokenBalance("bnbBalance", currentUser.bnbBalance || 0)
    updateTokenBalance("solBalance", currentUser.solBalance || 0)
    updateTokenBalance("ethBalance", currentUser.ethBalance || 0)
    updateTokenBalance("btcBalance", currentUser.btcBalance || 0)
    updateTokenBalance("polBalance", currentUser.polBalance || 0)
  }

  // Function to refresh balances from the server
  function refreshBalances() {
    fetch("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update the current user data in localStorage
          const updatedUser = data.user

          // Only update if there are actual changes to avoid unnecessary re-renders
          if (JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))

            // Update the UI with new balance if not hidden
            const totalBalanceElement = document.getElementById("totalBalance")
            if (totalBalanceElement) {
              totalBalanceElement.textContent = `US$${formatNumber(updatedUser.balance || 0)}`
            }

            // Update portfolio amount if not hidden
            const portfolioAmount = document.querySelector(".portfolio-amount")
            if (portfolioAmount && !isBalanceHidden) {
              portfolioAmount.innerHTML = `
                US$${formatNumber(updatedUser.balance || 0)}
                <button class="visibility-toggle">
                  <i class="far fa-eye"></i>
                </button>
              `

              // Re-attach event listener
              const newToggleBtn = portfolioAmount.querySelector(".visibility-toggle")
              if (newToggleBtn) {
                newToggleBtn.addEventListener("click", toggleBalanceVisibility)
              }
            }

            // Update token balances in modal
            updateTokenBalance("mainBalance", updatedUser.balance || 0)
            updateTokenBalance("trxBalance", updatedUser.trxBalance || 0)
            updateTokenBalance("usdtBalance", updatedUser.usdtBalance || 0)
            updateTokenBalance("usdcBalance", updatedUser.usdcBalance || 0)
            updateTokenBalance("bnbBalance", updatedUser.bnbBalance || 0)
            updateTokenBalance("solBalance", updatedUser.solBalance || 0)
            updateTokenBalance("ethBalance", updatedUser.ethBalance || 0)
            updateTokenBalance("btcBalance", updatedUser.btcBalance || 0)
            updateTokenBalance("polBalance", updatedUser.polBalance || 0)

            // Refresh transactions
            loadTransactions()
          }
        }
      })
      .catch((error) => {
        console.error("Error refreshing balances:", error)
      })
  }

  function updateTokenBalance(elementId, balance) {
    const element = document.getElementById(elementId)
    if (element) {
      element.textContent = `US$${formatNumber(balance)}`
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

