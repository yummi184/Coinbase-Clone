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

  // Set up polling for balance updates - check every 10 seconds
  setInterval(() => {
    refreshBalances()
  }, 10000)

  // DeFi Wallet tab click handler
  const defiWalletTab = document.getElementById("defiWalletTab")
  if (defiWalletTab) {
    defiWalletTab.addEventListener("click", () => {
      window.location.href = "defi-wallet.html"
    })
  }

  // Assets button click handler
  const assetsBtn = document.querySelector('.nav-item[href="#"]')
  if (assetsBtn) {
    assetsBtn.addEventListener("click", () => {
      window.location.href = "defi-wallet.html"
    })
  }

  // Load user data
  const walletName = document.getElementById("walletName")
  const trxWalletAddress = document.getElementById("trxWalletAddress")
  const usdtWalletAddress = document.getElementById("usdtWalletAddress")
  const usdcWalletAddress = document.getElementById("usdcWalletAddress")
  const balanceAmount = document.getElementById("balanceAmount")

  if (walletName) {
    walletName.textContent = "My wallet"
  }

  // Display wallet addresses
  if (trxWalletAddress && currentUser.trxWalletAddress) {
    trxWalletAddress.textContent = formatWalletAddress(currentUser.trxWalletAddress)
  }

  if (usdtWalletAddress && currentUser.usdtWalletAddress) {
    usdtWalletAddress.textContent = formatWalletAddress(currentUser.usdtWalletAddress)
  }

  if (usdcWalletAddress && currentUser.usdcWalletAddress) {
    usdcWalletAddress.textContent = formatWalletAddress(currentUser.usdcWalletAddress)
  }

  // Add main wallet address display
  const mainWalletAddress = document.getElementById("mainWalletAddress")
  if (mainWalletAddress && currentUser.mainWalletAddress) {
    mainWalletAddress.textContent = formatWalletAddress(currentUser.mainWalletAddress)
  }

  // Copy address buttons
  const copyButtons = document.querySelectorAll(".copy-btn")
  copyButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const addressType = this.getAttribute("data-address")
      let addressToCopy

      switch (addressType) {
        case "main":
          addressToCopy = currentUser.mainWalletAddress
          break
        case "trx":
          addressToCopy = currentUser.trxWalletAddress
          break
        case "usdt":
          addressToCopy = currentUser.usdtWalletAddress
          break
        case "usdc":
          addressToCopy = currentUser.usdcWalletAddress
          break
        case "bnb":
          addressToCopy = currentUser.bnbWalletAddress
          break
        case "sol":
          addressToCopy = currentUser.solWalletAddress
          break
        case "eth":
          addressToCopy = currentUser.ethWalletAddress
          break
        case "btc":
          addressToCopy = currentUser.btcWalletAddress
          break
        case "pol":
          addressToCopy = currentUser.polWalletAddress
          break
        default:
          addressToCopy = ""
      }

      if (addressToCopy) {
        navigator.clipboard
          .writeText(addressToCopy)
          .then(() => {
            alert("Address copied to clipboard!")
          })
          .catch((err) => {
            console.error("Could not copy text: ", err)
          })
      }
    })
  })

  // Load balance
  //loadBalance()

  // Load tokens
  /*function loadTokens() {
    const tokenList = document.getElementById("tokenList")
    if (!tokenList) return

    fetch("/api/users/tokens", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.tokens.length > 0) {
          tokenList.innerHTML = ""
          data.tokens.forEach((token) => {
            const tokenItem = createTokenItem(token)
            tokenList.appendChild(tokenItem)
          })
        } else {
          // Add default tokens
          const defaultTokens = [
            { symbol: "TRX", name: "TRON", balance: 0, price: 0.2517, change: 0.06 },
            { symbol: "USDT", name: "Tether", balance: 0, price: 1.0, change: 0.0 },
            { symbol: "USDC", name: "USD Coin", balance: 0, price: 1.01, change: 42.81 },
            { symbol: "BNB", name: "BNB Smart Chain", balance: 0, price: 610.38, change: 0.73 },
            { symbol: "SOL", name: "Solana", balance: 0, price: 126.54, change: 1.41 },
            { symbol: "ETH", name: "Ethereum", balance: 0, price: 1902.43, change: 4.35 },
            { symbol: "BTC", name: "Bitcoin", balance: 0, price: 85143.49, change: 3.2 },
            { symbol: "POL", name: "Polygon", balance: 0, price: 0.2, change: -0.96 },
          ]

          tokenList.innerHTML = ""
          defaultTokens.forEach((token) => {
            const tokenItem = createTokenItem(token)
            tokenList.appendChild(tokenItem)
          })
        }
      })
      .catch((error) => {
        console.error("Error loading tokens:", error)

        // Add default tokens on error
        const defaultTokens = [
          { symbol: "TRX", name: "TRON", balance: 0, price: 0.2517, change: 0.06 },
          { symbol: "USDT", name: "Tether", balance: 0, price: 1.0, change: 0.0 },
          { symbol: "USDC", name: "USD Coin", balance: 0, price: 1.01, change: 42.81 },
          { symbol: "BNB", name: "BNB Smart Chain", balance: 0, price: 610.38, change: 0.73 },
          { symbol: "SOL", name: "Solana", balance: 0, price: 126.54, change: 1.41 },
          { symbol: "ETH", name: "Ethereum", balance: 0, price: 1902.43, change: 4.35 },
          { symbol: "BTC", name: "Bitcoin", balance: 0, price: 85143.49, change: 3.2 },
          { symbol: "POL", name: "Polygon", balance: 0, price: 0.2, change: -0.96 },
        ]

        tokenList.innerHTML = ""
        defaultTokens.forEach((token) => {
          const tokenItem = createTokenItem(token)
          tokenList.appendChild(tokenItem)
        })
      })
  }*/

  // Toggle balance visibility
  const toggleBalanceBtn = document.getElementById("toggleBalanceBtn")
  if (toggleBalanceBtn) {
    toggleBalanceBtn.addEventListener("click", () => {
      if (balanceAmount.textContent === "****") {
        //loadBalance()
        toggleBalanceBtn.innerHTML = '<i class="fas fa-eye"></i>'
      } else {
        balanceAmount.textContent = "****"
        toggleBalanceBtn.innerHTML = '<i class="fas fa-eye-slash"></i>'
      }
    })
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Clear user data from localStorage
      localStorage.removeItem("currentUser")
      localStorage.removeItem("token")

      // Redirect to login page
      window.location.href = "index.html"
    })
  }

  // Tab switching
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Show corresponding tab content
      const tabId = this.getAttribute("data-tab") + "-tab"
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Coming soon features
  const earnBtn = document.getElementById("earnBtn")
  const getGasBtn = document.getElementById("getGasBtn")
  const marketsBtn = document.getElementById("marketsBtn")
  const tradeBtn = document.getElementById("tradeBtn")
  const discoverBtn = document.getElementById("discoverBtn")
  const pricesBtn = document.getElementById("pricesBtn")
  const dexBtn = document.getElementById("dexBtn")
  const nftsBtn = document.getElementById("nftsBtn")
  const comingSoonModal = document.getElementById("comingSoonModal")

  const comingSoonFeatures = [earnBtn, getGasBtn, marketsBtn, tradeBtn, discoverBtn]

  comingSoonFeatures
    .forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault()
          comingSoonModal.classList.add("active")
        })
      }
    })

    [
      // Bottom navigation handlers
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

  // Backup button
  const backupBtn = document.getElementById("backupBtn")
  if (backupBtn) {
    backupBtn.addEventListener("click", () => {
      comingSoonModal.classList.add("active")
    })
  }

  // Manage tokens button
  const manageTokensBtn = document.getElementById("manageTokensBtn")
  if (manageTokensBtn) {
    manageTokensBtn.addEventListener("click", () => {
      comingSoonModal.classList.add("active")
    })
  }

  // Token item click handler
  const tokenItems = document.querySelectorAll(".token-item")
  tokenItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tokenType = this.getAttribute("data-token")
      window.location.href = "defi-wallet.html"
    })
  })

  // Helper functions
  /*function loadBalance() {
    if (!balanceAmount) return

    fetch("/api/users/balance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          balanceAmount.textContent = `$${formatNumber(data.balance)}`
        } else {
          balanceAmount.textContent = "$0.00"
        }
      })
      .catch((error) => {
        console.error("Error loading balance:", error)
        balanceAmount.textContent = "$0.00"
      })
  }*/

  function createTokenItem(token) {
    const div = document.createElement("div")
    div.className = "crypto-item"
    div.setAttribute("data-token", token.symbol)

    const changeClass = token.change >= 0 ? "positive" : "negative"
    const changePrefix = token.change >= 0 ? "+" : ""

    div.innerHTML = `
  <div class="crypto-icon ${token.symbol.toLowerCase()}">
    <img src="img/${token.symbol.toLowerCase()}.png" alt="${token.name}" onerror="this.src='img/default-token.png'">
  </div>
  <div class="crypto-info">
    <div class="crypto-name">${token.symbol}</div>
    <div class="crypto-network">${token.name}</div>
    <div class="crypto-price">$${token.price.toFixed(2)} <span class="crypto-change ${changeClass}">${changePrefix}${token.change}%</span></div>
  </div>
  <div class="crypto-amount">
    <div class="crypto-balance">${formatNumber(token.balance)}</div>
    <div class="crypto-value">$${formatNumber(token.balance * token.price)}</div>
  </div>
`

    // Add click event to show token actions
    div.addEventListener("click", () => {
      showTokenActions(token.symbol)
    })

    return div
  }

  // Add this function to show token actions
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
          <div class="token-actions">
            <a href="send.html?token=${tokenType}" class="token-action-btn">
              <div class="token-action-icon">
                <i class="fas fa-arrow-up"></i>
              </div>
              <div class="token-action-label">Send</div>
            </a>
            <a href="receive.html?token=${tokenType}" class="token-action-btn">
              <div class="token-action-icon">
                <i class="fas fa-arrow-down"></i>
              </div>
              <div class="token-action-label">Receive</div>
            </a>
            <a href="#" class="token-action-btn fund-token-btn" data-token="${tokenType}">
              <div class="token-action-icon">
                <i class="fas fa-wallet"></i>
              </div>
              <div class="token-action-label">Fund from Main</div>
            </a>
            <a href="#" class="token-action-btn">
              <div class="token-action-icon">
                <i class="fas fa-exchange-alt"></i>
              </div>
              <div class="token-action-label">Swap</div>
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
            <div class="form-group mb-16">
              <label for="fundAmount" style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Amount</label>
              <input type="number" id="fundAmount" min="0.01" step="0.01" placeholder="0.00" required
                style="width: 100%; padding: 12px; background-color: var(--card-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color);">
            </div>
            
            <div id="fundTokenError" style="color: var(--negative-color); margin-bottom: 16px; min-height: 20px;"></div>
            
            <button type="submit" style="width: 100%; padding: 12px; background-color: var(--primary-color); color: #000; border: none; border-radius: 8px; font-weight: 600;">
              Fund ${tokenType} Wallet
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

              // Show success message
              alert(`Successfully funded ${tokenType} wallet with $${amount}`)

              // Refresh balances
              refreshBalances()
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

  function formatWalletAddress(address) {
    if (!address) return "Not available"
    if (address.length <= 12) return address
    return address.substring(0, 10) + "..." + address.substring(address.length - 6)
  }

  // Format number with commas
  function formatNumber(num) {
    if (num === undefined || num === null) return "0.00"
    return Number.parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Helper functions
  function loadUserData() {
    // Update balance display
    const balanceValue = document.getElementById("balanceValue")
    if (balanceValue) {
      if (currentUser.balance > 0) {
        balanceValue.textContent = formatNumber(currentUser.balance)
      } else {
        balanceValue.textContent = "<0.00001"
      }
    }
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

            // Update the UI with new balance
            const balanceValue = document.getElementById("balanceValue")
            if (balanceValue) {
              if (updatedUser.balance > 0) {
                balanceValue.textContent = formatNumber(updatedUser.balance)
              } else {
                balanceValue.textContent = "<0.00001"
              }
            }

            // Update token prices if they exist
            updateTokenPrices()
          }
        }
      })
      .catch((error) => {
        console.error("Error refreshing balances:", error)
      })
  }

  function updateTokenPrices() {
    // Update token prices in the token list
    const tokenItems = document.querySelectorAll(".token-item")
    tokenItems.forEach((item) => {
      const tokenType = item.getAttribute("data-token")
      const balanceField = `${tokenType.toLowerCase()}Balance`

      if (currentUser[balanceField]) {
        const priceElement = item.querySelector(".price-value")
        if (priceElement) {
          // This is just a placeholder - in a real app, you'd get the actual price
          // For now, we'll just show the balance
          const balance = currentUser[balanceField]
          if (balance > 0) {
            const balanceElement = item.querySelector(".token-market .market-cap")
            if (balanceElement) {
              balanceElement.textContent = `$${formatNumber(balance)}`
            }
          }
        }
      }
    })
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
})

// Add refresh tokens functionality
document.addEventListener("DOMContentLoaded", () => {
  // Refresh tokens button
  const refreshTokensBtn = document.getElementById("refreshTokensBtn")
  if (refreshTokensBtn) {
    refreshTokensBtn.addEventListener("click", () => {
      //loadTokens()
    })
  }
})

