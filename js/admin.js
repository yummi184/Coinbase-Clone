document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in and is admin
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token || !currentUser.isAdmin) {
    // Redirect to login if not logged in or not admin
    window.location.href = "index.html"
    return
  }

  // Apply dark mode if enabled
  const isDarkMode = localStorage.getItem("darkMode") === "true"
  if (isDarkMode) {
    document.body.classList.add("dark-mode")
  }

  // Display admin token balances
  const adminTrxBalance = document.getElementById("adminTrxBalance")
  const adminUsdtBalance = document.getElementById("adminUsdtBalance")
  const adminUsdcBalance = document.getElementById("adminUsdcBalance")
  const adminBnbBalance = document.getElementById("adminBnbBalance")
  const adminSolBalance = document.getElementById("adminSolBalance")
  const adminEthBalance = document.getElementById("adminEthBalance")
  const adminBtcBalance = document.getElementById("adminBtcBalance")
  const adminPolBalance = document.getElementById("adminPolBalance")

  if (adminTrxBalance && currentUser.trxBalance) {
    adminTrxBalance.textContent = formatNumber(currentUser.trxBalance)
  }

  if (adminUsdtBalance && currentUser.usdtBalance) {
    adminUsdtBalance.textContent = formatNumber(currentUser.usdtBalance)
  }

  if (adminUsdcBalance && currentUser.usdcBalance) {
    adminUsdcBalance.textContent = formatNumber(currentUser.usdcBalance)
  }

  if (adminBnbBalance && currentUser.bnbBalance) {
    adminBnbBalance.textContent = formatNumber(currentUser.bnbBalance)
  }

  if (adminSolBalance && currentUser.solBalance) {
    adminSolBalance.textContent = formatNumber(currentUser.solBalance)
  }

  if (adminEthBalance && currentUser.ethBalance) {
    adminEthBalance.textContent = formatNumber(currentUser.ethBalance)
  }

  if (adminBtcBalance && currentUser.btcBalance) {
    adminBtcBalance.textContent = formatNumber(currentUser.btcBalance)
  }

  if (adminPolBalance && currentUser.polBalance) {
    adminPolBalance.textContent = formatNumber(currentUser.polBalance)
  }

  // Dark mode toggle
  const darkModeToggleAdmin = document.getElementById("darkModeToggleAdmin")
  if (darkModeToggleAdmin) {
    darkModeToggleAdmin.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode")
      const isDarkMode = document.body.classList.contains("dark-mode")
      localStorage.setItem("darkMode", isDarkMode.toString())
    })
  }

  // Logout button
  const logoutBtnAdmin = document.getElementById("logoutBtnAdmin")
  if (logoutBtnAdmin) {
    logoutBtnAdmin.addEventListener("click", () => {
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

  // Bottom nav buttons
  const adminFundBtn = document.getElementById("adminFundBtn")
  const adminUsersBtn = document.getElementById("adminUsersBtn")
  const adminSettingsBtn = document.getElementById("adminSettingsBtn")

  if (adminFundBtn) {
    adminFundBtn.addEventListener("click", () => {
      document.getElementById("fundUserModal").classList.add("active")
    })
  }

  if (adminUsersBtn) {
    adminUsersBtn.addEventListener("click", () => {
      // Switch to users tab
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      document.querySelector('[data-tab="users"]').classList.add("active")
      document.getElementById("users-tab").classList.add("active")
    })
  }

  if (adminSettingsBtn) {
    adminSettingsBtn.addEventListener("click", () => {
      alert("Settings functionality coming soon!")
    })
  }

  // Action buttons
  const fundUserBtn = document.getElementById("fundUserBtn")
  const fundMainAccountBtn = document.getElementById("fundMainAccountBtn")
  const viewUsersBtn = document.getElementById("viewUsersBtn")
  const viewTransactionsBtn = document.getElementById("viewTransactionsBtn")

  if (fundUserBtn) {
    fundUserBtn.addEventListener("click", () => {
      document.getElementById("fundUserModal").classList.add("active")
    })
  }

  if (fundMainAccountBtn) {
    fundMainAccountBtn.addEventListener("click", () => {
      document.getElementById("fundMainAccountModal").classList.add("active")
    })
  }

  if (viewUsersBtn) {
    viewUsersBtn.addEventListener("click", () => {
      // Switch to users tab
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      document.querySelector('[data-tab="users"]').classList.add("active")
      document.getElementById("users-tab").classList.add("active")
    })
  }

  if (viewTransactionsBtn) {
    viewTransactionsBtn.addEventListener("click", () => {
      // Switch to transactions tab
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      document.querySelector('[data-tab="transactions"]').classList.add("active")
      document.getElementById("transactions-tab").classList.add("active")
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

  // Load users
  loadUsers()

  // Load transactions
  loadTransactions()

  // Load wallets
  loadWallets()

  // Fund user form
  const fundUserForm = document.getElementById("fundUserForm")
  if (fundUserForm) {
    fundUserForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const recipientAddress = document.getElementById("recipientAddress").value
      const fundAmount = document.getElementById("fundAmount").value
      const tokenType = document.getElementById("tokenType").value

      // Call the new function instead of the inline code
      fundUser(recipientAddress, fundAmount, tokenType)
    })
  }

  function fundUser(recipientAddress, fundAmount, tokenType) {
    const errorElement = document.getElementById("fundError")

    // Clear previous errors
    if (errorElement) {
      errorElement.textContent = ""
    }

    // Validate amount
    if (Number.parseFloat(fundAmount) <= 0) {
      if (errorElement) {
        errorElement.textContent = "Amount must be greater than 0"
      }
      return
    }

    // Make API request to fund user
    fetch("/api/admin/fund-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipientAddress,
        amount: Number.parseFloat(fundAmount),
        tokenType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Close modal
          document.getElementById("fundUserModal").classList.remove("active")

          // Show receipt
          showReceipt({
            type: "admin-funding",
            amount: Number.parseFloat(fundAmount),
            token: tokenType,
            recipient: recipientAddress,
            date: new Date().toISOString(),
            txId: data.transactionId || generateTxId(),
          })

          // Reload users to show updated balance
          loadUsers()
          // Reload transactions to show the funding transaction
          loadTransactions()

          // Send notification to the user
          sendNotificationToUser(recipientAddress, tokenType, fundAmount)
        } else {
          if (errorElement) {
            errorElement.textContent = data.message || "Failed to fund user"
          }
        }
      })
      .catch((error) => {
        if (errorElement) {
          errorElement.textContent = "An error occurred. Please try again."
        }
        console.error("Fund user error:", error)
      })
  }

  // Fund Main Account form
  const fundMainAccountForm = document.getElementById("fundMainAccountForm")
  if (fundMainAccountForm) {
    fundMainAccountForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const recipientAddress = document.getElementById("mainAccountAddress").value
      const fundAmount = document.getElementById("mainAmount").value
      const errorElement = document.getElementById("mainFundError")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate amount
      if (Number.parseFloat(fundAmount) <= 0) {
        errorElement.textContent = "Amount must be greater than 0"
        return
      }

      // Make API request to fund main account
      fetch("/api/admin/fund-main-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientAddress,
          amount: Number.parseFloat(fundAmount),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Close modal
            document.getElementById("fundMainAccountModal").classList.remove("active")

            // Show receipt
            showReceipt({
              type: "admin-funding-main",
              amount: Number.parseFloat(fundAmount),
              token: "MAIN",
              recipient: recipientAddress,
              date: new Date().toISOString(),
              txId: data.transactionId || generateTxId(),
            })

            // Reload users to show updated balance
            loadUsers()
            // Reload transactions to show the funding transaction
            loadTransactions()

            // Send notification to the user
            sendNotificationToUser(recipientAddress, "MAIN", fundAmount)
          } else {
            errorElement.textContent = data.message || "Failed to fund main account"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Fund main account error:", error)
        })
    })
  }

  // Add this function to send a notification to the user
  function sendNotificationToUser(recipientAddress, tokenType, amount) {
    fetch("/api/notifications/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipientAddress,
        tokenType,
        amount,
        message: `You have received ${amount} ${tokenType} from Admin`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Notification sent:", data)
      })
      .catch((error) => {
        console.error("Error sending notification:", error)
      })
  }

  // Fund Bitcoin form
  const fundBitcoinForm = document.getElementById("fundBitcoinForm")
  if (fundBitcoinForm) {
    fundBitcoinForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const bitcoinAddress = document.getElementById("bitcoinAddress").value
      const btcAmount = document.getElementById("btcAmount").value
      const errorElement = document.getElementById("btcFundError")

      // Clear previous errors
      errorElement.textContent = ""

      // Validate amount
      if (Number.parseFloat(btcAmount) <= 0) {
        errorElement.textContent = "Amount must be greater than 0"
        return
      }

      // Make API request to fund Bitcoin wallet
      fetch("/api/admin/fund-bitcoin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: bitcoinAddress,
          amount: Number.parseFloat(btcAmount),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Close modal
            document.getElementById("fundBitcoinModal").classList.remove("active")

            // Show receipt
            showReceipt({
              type: "bitcoin-funding",
              amount: Number.parseFloat(btcAmount),
              token: "BTC",
              recipient: bitcoinAddress,
              date: new Date().toISOString(),
              txId: data.transactionId || generateTxId(),
            })

            // Reload wallets
            loadWallets()
          } else {
            errorElement.textContent = data.message || "Failed to fund Bitcoin wallet"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Fund Bitcoin error:", error)
        })
    })
  }

  // Edit user form
  const editUserForm = document.getElementById("editUserForm")
  if (editUserForm) {
    editUserForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const userId = document.getElementById("editUserId").value
      const name = document.getElementById("editUserName").value
      const email = document.getElementById("editUserEmail").value
      const status = document.getElementById("editUserStatus").value
      const errorElement = document.getElementById("editUserError")

      // Clear previous errors
      errorElement.textContent = ""

      // Make API request to update user
      fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          status,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Close modal
            document.getElementById("userEditModal").classList.remove("active")

            // Reload users
            loadUsers()
          } else {
            errorElement.textContent = data.message || "Failed to update user"
          }
        })
        .catch((error) => {
          errorElement.textContent = "An error occurred. Please try again."
          console.error("Edit user error:", error)
        })
    })
  }

  // Search functionality
  const userSearch = document.getElementById("userSearch")
  if (userSearch) {
    userSearch.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const userItems = document.querySelectorAll(".user-item")

      userItems.forEach((item) => {
        const name = item.querySelector(".user-name").textContent.toLowerCase()
        const email = item.querySelector(".user-email").textContent.toLowerCase()

        if (name.includes(searchTerm) || email.includes(searchTerm)) {
          item.style.display = ""
        } else {
          item.style.display = "none"
        }
      })
    })
  }

  const transactionSearch = document.getElementById("transactionSearch")
  if (transactionSearch) {
    transactionSearch.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const transactionItems = document.querySelectorAll(".transaction-item")

      transactionItems.forEach((item) => {
        const type = item.querySelector(".transaction-type").textContent.toLowerCase()
        const from = item.querySelector(".transaction-parties div:first-child").textContent.toLowerCase()
        const to = item.querySelector(".transaction-parties div:last-child").textContent.toLowerCase()

        if (type.includes(searchTerm) || from.includes(searchTerm) || to.includes(searchTerm)) {
          item.style.display = ""
        } else {
          item.style.display = "none"
        }
      })
    })
  }

  const walletSearch = document.getElementById("walletSearch")
  if (walletSearch) {
    walletSearch.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const walletItems = document.querySelectorAll(".wallet-item")

      walletItems.forEach((item) => {
        const type = item.querySelector(".wallet-type").textContent.toLowerCase()
        const address = item.querySelector(".wallet-address").textContent.toLowerCase()

        if (type.includes(searchTerm) || address.includes(searchTerm)) {
          item.style.display = ""
        } else {
          item.style.display = "none"
        }
      })
    })
  }

  // Helper functions
  function loadUsers() {
    const usersList = document.getElementById("usersList")
    const usersLoading = document.getElementById("usersLoading")
    const noUsers = document.getElementById("noUsers")

    if (!usersList || !usersLoading || !noUsers) return

    fetch("/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Hide loading spinner
        usersLoading.classList.add("hidden")

        if (data.success && data.users.length > 0) {
          // Render users
          usersList.innerHTML = ""
          data.users.forEach((user) => {
            if (!user.isAdmin) {
              // Don't show admin in the list
              const userItem = createUserItem(user)
              usersList.appendChild(userItem)
            }
          })
        } else {
          // Show no users message
          noUsers.classList.remove("hidden")
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error)
        usersLoading.classList.add("hidden")

        // Try to load users from localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        if (users.length > 0) {
          usersList.innerHTML = ""
          users.forEach((user) => {
            if (!user.isAdmin) {
              const userItem = createUserItem(user)
              usersList.appendChild(userItem)
            }
          })
        } else {
          noUsers.classList.remove("hidden")
        }
      })
  }

  function loadTransactions() {
    const transactionsList = document.getElementById("adminTransactionsList")
    const transactionsLoading = document.getElementById("adminTransactionsLoading")
    const noTransactions = document.getElementById("noAdminTransactions")

    if (!transactionsList || !transactionsLoading || !noTransactions) return

    fetch("/api/admin/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Hide loading spinner
        transactionsLoading.classList.add("hidden")

        if (data.success && data.transactions.length > 0) {
          // Render transactions
          transactionsList.innerHTML = ""
          data.transactions.forEach((transaction) => {
            const transactionItem = createTransactionItem(transaction)
            transactionsList.appendChild(transactionItem)
          })
        } else {
          // Show no transactions message
          noTransactions.classList.remove("hidden")
        }
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error)
        transactionsLoading.classList.add("hidden")
        noTransactions.classList.remove("hidden")

        // Add mock transactions for demo
        const mockTransactions = [
          {
            id: "1",
            type: "admin-funding",
            amount: 500,
            fromName: "Admin",
            toName: "John Doe",
            createdAt: "2025-03-28T10:00:00.000Z",
            status: "completed",
          },
          {
            id: "2",
            type: "transfer",
            amount: 100,
            fromName: "Jane Smith",
            toName: "Bob Johnson",
            createdAt: "2025-03-27T15:30:00.000Z",
            status: "completed",
          },
          {
            id: "3",
            type: "withdrawal",
            amount: 200,
            fromName: "John Doe",
            toName: "Bitcoin Wallet",
            createdAt: "2025-03-26T09:15:00.000Z",
            status: "completed",
          },
        ]

        transactionsList.innerHTML = ""
        mockTransactions.forEach((transaction) => {
          const transactionItem = createTransactionItem(transaction)
          transactionsList.appendChild(transactionItem)
        })
      })
  }

  function loadWallets() {
    const walletsList = document.getElementById("adminWalletsList")
    const walletsLoading = document.getElementById("walletsLoading")
    const noWallets = document.getElementById("noWallets")

    if (!walletsList || !walletsLoading || !noWallets) return

    fetch("/api/admin/wallets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Hide loading spinner
        walletsLoading.classList.add("hidden")

        if (data.success && data.wallets.length > 0) {
          // Render wallets
          walletsList.innerHTML = ""
          data.wallets.forEach((wallet) => {
            const walletItem = createWalletItem(wallet)
            walletsList.appendChild(walletItem)
          })
        } else {
          // Show no wallets message
          noWallets.classList.remove("hidden")
        }
      })
      .catch((error) => {
        console.error("Error fetching wallets:", error)
        walletsLoading.classList.add("hidden")
        noWallets.classList.remove("hidden")

        // Add mock wallets for demo
        const mockWallets = [
          {
            id: "1",
            type: "bitcoin",
            address: "bc1qh3xu3xfvf62jagscag5xxsh7ltv3zksmqksw4q",
            balance: 0.5,
            userName: "John Doe",
          },
          { id: "2", type: "ethereum", address: "0x6156e3b5b287b88d3", balance: 2.3, userName: "Jane Smith" },
          { id: "3", type: "tron", address: "TMp7cs...sPUPfj", balance: 1000, userName: "Bob Johnson" },
        ]

        walletsList.innerHTML = ""
        mockWallets.forEach((wallet) => {
          const walletItem = createWalletItem(wallet)
          walletsList.appendChild(walletItem)
        })
      })
  }

  function createUserItem(user) {
    const div = document.createElement("div")
    div.className = "user-item"
    div.innerHTML = `
   <div class="user-header">
     <div class="user-info">
       <div class="user-name">${user.name}</div>
       <div class="user-email">${user.email}</div>
       <div class="user-balance">$${formatNumber(user.balance)}</div>
       <div class="user-status status-${user.status}">${user.status}</div>
     </div>
   </div>
   <div class="user-wallets">
     <div>Main: ${formatWalletAddress(user.mainWalletAddress)}</div>
     <div>TRX: ${formatWalletAddress(user.trxWalletAddress)}</div>
     <div>USDT: ${formatWalletAddress(user.usdtWalletAddress)}</div>
     <div>USDC: ${formatWalletAddress(user.usdcWalletAddress)}</div>
     <div>BNB: ${formatWalletAddress(user.bnbWalletAddress)}</div>
     <div>SOL: ${formatWalletAddress(user.solWalletAddress)}</div>
     <div>ETH: ${formatWalletAddress(user.ethWalletAddress)}</div>
     <div>BTC: ${formatWalletAddress(user.btcWalletAddress)}</div>
     <div>POL: ${formatWalletAddress(user.polWalletAddress)}</div>
   </div>
   <div class="user-actions">
     <button class="user-action-btn view" data-id="${user.id}" title="View User">
       <i class="fas fa-eye"></i>
     </button>
     <button class="user-action-btn edit" data-id="${user.id}" title="Edit User">
       <i class="fas fa-edit"></i>
     </button>
     <button class="user-action-btn delete" data-id="${user.id}" title="Delete User">
       <i class="fas fa-trash"></i>
     </button>
   </div>
 `

    // Add event listeners for action buttons
    const viewBtn = div.querySelector(".view")
    const editBtn = div.querySelector(".edit")
    const deleteBtn = div.querySelector(".delete")

    viewBtn.addEventListener("click", function () {
      const userId = this.getAttribute("data-id")
      viewUser(userId)
    })

    editBtn.addEventListener("click", function () {
      const userId = this.getAttribute("data-id")
      editUser(userId)
    })

    deleteBtn.addEventListener("click", function () {
      const userId = this.getAttribute("data-id")
      deleteUser(userId)
    })

    return div
  }

  function createTransactionItem(transaction) {
    const div = document.createElement("div")
    div.className = "transaction-item"

    div.innerHTML = `
     <div class="transaction-info">
       <div class="transaction-details">
         <h4>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</h4>
         <div class="transaction-date">${formatDate(transaction.createdAt)}</div>
         <div class="transaction-type">${transaction.type}</div>
         <div class="transaction-parties">
           <div>From: ${transaction.fromName || "N/A"}</div>
           <div>To: ${transaction.toName || "N/A"}</div>
         </div>
       </div>
     </div>
     <div class="transaction-meta">
       <div class="transaction-amount">$${formatNumber(transaction.amount)}</div>
       <div class="transaction-status">${transaction.status}</div>
     </div>
   `

    // Add click event to show receipt
    div.addEventListener("click", () => {
      showReceipt({
        type: transaction.type,
        amount: Number.parseFloat(transaction.amount),
        token: transaction.token || "USD",
        sender: transaction.fromName,
        recipient: transaction.toName,
        date: transaction.createdAt,
        txId: transaction.id,
      })
    })

    return div
  }

  function createWalletItem(wallet) {
    const div = document.createElement("div")
    div.className = "wallet-item"

    div.innerHTML = `
     <div class="wallet-info">
       <div class="wallet-icon">
         <i class="fab fa-${wallet.type.toLowerCase()}"></i>
       </div>
       <div class="wallet-details">
         <div class="wallet-type">${wallet.type.toUpperCase()}</div>
         <div class="wallet-address">${wallet.address}</div>
         <div>Owner: ${wallet.userName}</div>
       </div>
     </div>
     <div class="wallet-balance">${formatNumber(wallet.balance)} ${wallet.type.toUpperCase()}</div>
   `

    return div
  }

  function viewUser(userId) {
    fetch(`/api/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(`User Details:
Name: ${data.user.name}
Email: ${data.user.email}
Balance: $${formatNumber(data.user.balance)}
Status: ${data.user.status}
Main Address: ${data.user.mainWalletAddress}
TRX Address: ${data.user.trxWalletAddress}
USDT Address: ${data.user.usdtWalletAddress}
USDC Address: ${data.user.usdcWalletAddress}
BNB Address: ${data.user.bnbWalletAddress}
SOL Address: ${data.user.solWalletAddress}
ETH Address: ${data.user.ethWalletAddress}
BTC Address: ${data.user.btcWalletAddress}
POL Address: ${data.user.polWalletAddress}`)
        } else {
          alert(data.message || "Failed to load user details")
        }
      })
      .catch((error) => {
        console.error("Error viewing user:", error)
        alert("An error occurred. Please try again.")
      })
  }

  function editUser(userId) {
    // For demo, we'll use mock data
    const usersList = document.getElementById("usersList")
    const userItem = usersList.querySelector(`.user-action-btn[data-id="${userId}"]`).closest(".user-item")

    const name = userItem.querySelector(".user-name").textContent
    const email = userItem.querySelector(".user-email").textContent
    const status = userItem.querySelector(".user-status").textContent

    // Populate edit form
    document.getElementById("editUserId").value = userId
    document.getElementById("editUserName").value = name
    document.getElementById("editUserEmail").value = email
    document.getElementById("editUserStatus").value = status

    // Show edit modal
    document.getElementById("userEditModal").classList.add("active")
  }

  function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Reload users
            loadUsers()
          } else {
            alert(data.message || "Failed to delete user")
          }
        })
        .catch((error) => {
          console.error("Error deleting user:", error)

          // For demo, remove the user from the DOM
          const usersList = document.getElementById("usersList")
          const userItem = usersList.querySelector(`.user-action-btn[data-id="${userId}"]`).closest(".user-item")
          userItem.remove()
        })
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  function generateTxId() {
    return "tx_" + Math.random().toString(36).substring(2, 15)
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

  function showReceipt(transaction) {
    const receiptModal = document.getElementById("receiptModal")
    const receiptContent = document.getElementById("receiptContent")

    if (!receiptModal || !receiptContent) return

    const date = new Date(transaction.date)
    const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString()

    receiptContent.innerHTML = `
     <div class="receipt-header">
       <div class="receipt-logo"><i class="fas fa-receipt"></i></div>
       <div class="receipt-title">Transaction Receipt</div>
       <div class="receipt-subtitle">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</div>
     </div>
     
     <div class="receipt-amount">
       <div class="receipt-amount-value">$${formatNumber(transaction.amount)} ${transaction.token}</div>
     </div>
     
     <div class="receipt-details">
       <div class="receipt-row">
         <div class="receipt-label">Date</div>
         <div class="receipt-value">${formattedDate}</div>
       </div>
       <div class="receipt-row">
         <div class="receipt-label">From</div>
         <div class="receipt-value">${transaction.sender || "Admin"}</div>
       </div>
       <div class="receipt-row">
         <div class="receipt-label">To</div>
         <div class="receipt-value">${transaction.recipient}</div>
       </div>
       <div class="receipt-row">
         <div class="receipt-label">Token</div>
         <div class="receipt-value">${transaction.token}</div>
       </div>
       <div class="receipt-row">
         <div class="receipt-label">Transaction ID</div>
         <div class="receipt-value">${transaction.txId}</div>
       </div>
       <div class="receipt-row">
         <div class="receipt-label">Status</div>
         <div class="receipt-value">Completed</div>
       </div>
     </div>
     
     <div class="receipt-footer">
       <p>Thank you for using our service</p>
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
          "<style>body { font-family: Arial, sans-serif; padding: 20px; } .receipt { padding: 20px; border: 1px solid #ddd; } .receipt-header { text-align: center; margin-bottom: 20px; } .receipt-title { font-size: 18px; font-weight: bold; } .receipt-amount { text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; } .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; } .receipt-footer { text-align: center; margin-top: 20px; color: #666; }</style>",
        )
        printWindow.document.write("</head><body>")
        printWindow.document.write(receiptContent.innerHTML)
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

