document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }


  // Toggle balance visibility
  const toggleBalanceBtn = document.getElementById("toggleBalanceBtn")
  if (toggleBalanceBtn) {
    toggleBalanceBtn.addEventListener("click", () => {
      if (balanceAmount.textContent === "****") {
        loadBalance()
        toggleBalanceBtn.innerHTML = '<i class="fas fa-eye"></i>'
      } else {
        balanceAmount.textContent = "****"
        toggleBalanceBtn.innerHTML = '<i class="fas fa-eye-slash"></i>'
      }
    })
  }



  // Manage tokens button
  const manageTokensBtn = document.getElementById("manageTokensBtn")
  if (manageTokensBtn) {
    manageTokensBtn.addEventListener("click", () => {
      comingSoonModal.classList.add("active")
    })
  }

  // Helper functions
  function loadBalance() {
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
  }

 
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
  function showTokenActions(tokenSymbol) {
    // Create modal for token actions
    const modal = document.createElement("div")
    modal.className = "modal active"
    modal.id = "tokenActionsModal"

    modal.innerHTML = `
<div class="modal-content">
  <div class="modal-header">
    <h3>${tokenSymbol} Actions</h3>
    <button class="close-modal">&times;</button>
  </div>
  <div class="modal-body">
    <div class="token-actions-container">
      <a href="send.html?token=${tokenSymbol}" class="token-action-btn">
        <i class="fas fa-arrow-up"></i>
        <span>Send ${tokenSymbol}</span>
      </a>
      <a href="receive.html?token=${tokenSymbol}" class="token-action-btn">
        <i class="fas fa-arrow-down"></i>
        <span>Receive ${tokenSymbol}</span>
      </a>
      <a href="#" class="token-action-btn fund-token-btn" data-token="${tokenSymbol}">
        <i class="fas fa-wallet"></i>
        <span>Fund from Main</span>
      </a>
    </div>
  </div>
</div>
`

    document.body.appendChild(modal)

    // Add event listener to close modal
    const closeBtn = modal.querySelector(".close-modal")
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    // Add event listener for fund token button
    const fundTokenBtn = modal.querySelector(".fund-token-btn")
    if (fundTokenBtn) {
      fundTokenBtn.addEventListener("click", (e) => {
        e.preventDefault()
        showFundTokenModal(tokenSymbol)
      })
    }

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })
  }

  // Add function to show fund token modal
  function showFundTokenModal(tokenSymbol) {
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
    <h3>Fund ${tokenSymbol} Wallet</h3>
    <button class="close-modal">&times;</button>
  </div>
  <div class="modal-body">
    <form id="fundTokenForm">
      <input type="hidden" id="tokenType" value="${tokenSymbol}">
      <div class="form-group">
        <label for="fundAmount">Amount</label>
        <div class="input-with-icon">
          <i class="fas fa-dollar-sign"></i>
          <input type="number" id="fundAmount" min="0.01" step="0.01" placeholder="0.00" required>
        </div>
      </div>
      
      <div class="form-error" id="fundTokenError"></div>
      
      <button type="submit" class="btn btn-primary btn-block">
        <i class="fas fa-wallet"></i> Fund ${tokenSymbol} Wallet
      </button>
    </form>
  </div>
</div>
`

    document.body.appendChild(modal)

    // Add event listener to close modal
    const closeBtn = modal.querySelector(".close-modal")
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

              // Reload page to update balances
              window.location.reload()
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
})

// Add refresh tokens functionality
document.addEventListener("DOMContentLoaded", () => {
  // Refresh tokens button
  const refreshTokensBtn = document.getElementById("refreshTokensBtn")
  if (refreshTokensBtn) {
    refreshTokensBtn.addEventListener("click", () => {
      loadTokens()
    })
  }
})

