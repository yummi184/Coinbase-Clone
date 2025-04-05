document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const token = localStorage.getItem("token")

  if (!currentUser || !token) {
    // Redirect to login if not logged in
    window.location.href = "index.html"
    return
  }

  // DOM elements
  const walletsList = document.getElementById("walletsList")
  const walletsLoading = document.getElementById("walletsLoading")
  const noWallets = document.getElementById("noWallets")
  const addWalletBtn = document.getElementById("addWalletBtn")
  const addFirstWalletBtn = document.getElementById("addFirstWalletBtn")
  const addWalletForm = document.getElementById("addWalletForm")
  const walletForm = document.getElementById("walletForm")
  const cancelAddWallet = document.getElementById("cancelAddWallet")

  // Show add wallet form
  function showAddWalletForm() {
    addWalletForm.classList.remove("hidden")
    addWalletBtn.disabled = true
  }

  // Hide add wallet form
  function hideAddWalletForm() {
    addWalletForm.classList.add("hidden")
    addWalletBtn.disabled = false
    walletForm.reset()
  }

  // Add event listeners for buttons
  if (addWalletBtn) {
    addWalletBtn.addEventListener("click", showAddWalletForm)
  }

  if (addFirstWalletBtn) {
    addFirstWalletBtn.addEventListener("click", showAddWalletForm)
  }

  if (cancelAddWallet) {
    cancelAddWallet.addEventListener("click", hideAddWalletForm)
  }

  // Load wallets
  function loadWallets() {
    fetch("/api/wallets", {
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
      })
  }

  // Create wallet item
  function createWalletItem(wallet) {
    const div = document.createElement("div")
    div.className = "wallet-item"
    div.innerHTML = `
            <div class="wallet-header">
                <div class="wallet-info">
                    <h4>${wallet.label || `My ${wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)} Wallet`}</h4>
                    <div class="wallet-type">${wallet.type}</div>
                </div>
                <button class="btn-icon delete-btn" data-id="${wallet.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="wallet-address">${wallet.address}</div>
        `

    // Add event listener for delete button
    const deleteBtn = div.querySelector(".delete-btn")
    deleteBtn.addEventListener("click", function () {
      const walletId = this.getAttribute("data-id")
      deleteWallet(walletId)
    })

    return div
  }

  // Delete wallet
  function deleteWallet(walletId) {
    if (confirm("Are you sure you want to delete this wallet?")) {
      fetch(`/api/wallets/${walletId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Reload wallets
            loadWallets()
          } else {
            alert(data.message || "Failed to delete wallet")
          }
        })
        .catch((error) => {
          console.error("Error deleting wallet:", error)
          alert("An error occurred. Please try again.")
        })
    }
  }

  // Add wallet form handling
  if (walletForm) {
    walletForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const walletType = document.getElementById("walletType").value
      const walletAddress = document.getElementById("walletAddress").value
      const walletLabel = document.getElementById("walletLabel").value

      // Make API request to add wallet
      fetch("/api/wallets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: walletType,
          address: walletAddress,
          label: walletLabel,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Hide form and reload wallets
            hideAddWalletForm()
            noWallets.classList.add("hidden")
            loadWallets()
          } else {
            alert(data.message || "Failed to add wallet")
          }
        })
        .catch((error) => {
          console.error("Error adding wallet:", error)
          alert("An error occurred. Please try again.")
        })
    })
  }

  // Load wallets on page load
  loadWallets()
})

