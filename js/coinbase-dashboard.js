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
  if (!isDarkMode) {
    document.body.classList.remove("dark-mode")
  }

  // Update time in status bar
  updateTime()
  setInterval(updateTime, 60000) // Update time every minute

  // Load user data and balances
  loadUserData()

  // Set up polling for balance updates - check every 10 seconds
  setInterval(() => {
    refreshBalances()
  }, 10000)

  // Token item click handler
  const tokenItems = document.querySelectorAll(".token-item")
  tokenItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tokenType = this.getAttribute("data-token")
      showTokenActions(tokenType)
    })
  })

  // Helper functions
  function updateTime() {
    const timeElement = document.querySelector(".time")
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const timeString = `${hours}:${minutes}`

    if (timeElement) {
      timeElement.textContent = timeString
    }
  }

  function loadUserData() {
    // Update wallet address
    const walletId = document.querySelector(".wallet-id")
    if (walletId && currentUser.mainWalletAddress) {
      const address = currentUser.mainWalletAddress
      walletId.textContent = `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
    }

    // Update balance display
    const balanceAmount = document.getElementById("balanceAmount")
    if (balanceAmount) {
      balanceAmount.textContent = formatCurrency(currentUser.balance || 0)
    }

    // Update token balances
    updateTokenBalances()
  }

  function updateTokenBalances() {
    const tokenItems = document.querySelectorAll(".token-item")

    tokenItems.forEach((item) => {
      const tokenType = item.getAttribute("data-token")
      const balanceField = `${tokenType.toLowerCase()}Balance`
      const valueElement = item.querySelector(".token-value")
      const amountElement = item.querySelector(".token-amount")

      if (valueElement && amountElement && currentUser[balanceField]) {
        // For demo purposes, we'll use fixed prices
        const prices = {
          TRX: 0.2517,
          USDT: 1.0,
          USDC: 1.01,
          BNB: 610.38,
          SOL: 126.54,
          ETH: 3452.78,
          BTC: 65432.21,
        }

        const price = prices[tokenType] || 1
        const value = currentUser[balanceField] * price

        // Update value and amount
        valueElement.textContent = formatCurrency(value)
        amountElement.textContent = `${currentUser[balanceField]} ${tokenType}`
      }
    })
  }

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

            // Update the UI with new balance
            const balanceAmount = document.getElementById("balanceAmount")
            if (balanceAmount) {
              balanceAmount.textContent = formatCurrency(updatedUser.balance || 0)
            }

            // Update token balances
            updateTokenBalances()
          }
        }
      })
      .catch((error) => {
        console.error("Error refreshing balances:", error)
      })
  }

  function formatCurrency(amount) {
    // Format as currency with commas
    return (
      "$" +
      amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    )
  }

  function showTokenActions(tokenType) {
    // Create modal for token actions
    const modal = document.createElement("div")
    modal.className = "modal active"
    modal.id = "tokenActionsModal"

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">${tokenType} Actions</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="action-buttons">
            <a href="send.html?token=${tokenType}" class="action-btn primary">
              <i class="fas fa-arrow-up"></i> Send
            </a>
            <a href="receive.html?token=${tokenType}" class="action-btn secondary">
              <i class="fas fa-arrow-down"></i> Receive
            </a>
          </div>
          <div class="action-buttons" style="margin-top: 16px;">
            <a href="#" class="action-btn secondary fund-token-btn" data-token="${tokenType}">
              <i class="fas fa-wallet"></i> Fund from Main
            </a>
            <a href="#" class="action-btn secondary">
              <i class="fas fa-exchange-alt"></i> Swap
            </a>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listener to close modal
    const closeBtn = modal.querySelector(".modal-close")
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    // Add event listener for fund token button
    const fundTokenBtn = modal.querySelector(".fund-token-btn")
    if (fundTokenBtn) {
      fundTokenBtn.addEventListener("click", (e) => {
        e.preventDefault()
        showFundTokenModal(tokenType)
      })
    }

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  function showFundTokenModal(tokenType) {
    // Remove existing token actions modal
    const existingModal = document.getElementById("tokenActionsModal")
    if (existingModal) {
      document.body.removeChild(existingModal)
    }

    // Create fund token modal
    const modal = document.createElement("div")
    modal.className = "modal active"
    modal.id = "fundTokenModal"

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Fund ${tokenType} Wallet</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="fundTokenForm">
            <input type="hidden" id="tokenType" value="${tokenType}">
            <div class="form-group">
              <label for="fundAmount" class="form-label">Amount</label>
              <input type="number" id="fundAmount" class="form-input" min="0.01" step="0.01" placeholder="0.00" required>
            </div>
            
            <div id="fundTokenError" class="form-error"></div>
            
            <button type="submit" class="auth-btn">
              <i class="fas fa-wallet"></i> Fund ${tokenType} Wallet
            </button>
          </form>
        </div>
      </div>
    `

    document.body.appendChild(modal)

    // Add event listener to close modal
    const closeBtn = modal.querySelector(".modal-close")
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    // Add event listener for fund token form
    const fundTokenForm = document.getElementById("fundTokenForm")
    if (fundTokenForm) {
      fundTokenForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const tokenType = document.getElementById("tokenType").value
        const amount = document.getElementById("fundAmount").value
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
              // Close modal
              document.body.removeChild(modal)

              // Update the UI immediately
              const updatedUser = JSON.parse(localStorage.getItem("currentUser"))
              updatedUser.balance -= Number.parseFloat(amount)
              updatedUser[`${tokenType.toLowerCase()}Balance`] =
                (updatedUser[`${tokenType.toLowerCase()}Balance`] || 0) + Number.parseFloat(amount)
              localStorage.setItem("currentUser", JSON.stringify(updatedUser))

              // Update the balance display
              const balanceAmount = document.getElementById("balanceAmount")
              if (balanceAmount) {
                balanceAmount.textContent = formatCurrency(updatedUser.balance)
              }

              // Update token balances
              updateTokenBalances()

              // Show success message
              alert(`Successfully funded ${tokenType} wallet with ${amount}`)
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

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }
})

