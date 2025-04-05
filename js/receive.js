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
  const tokenSelect = document.getElementById("tokenSelect")
  const selectedTokenName = document.getElementById("selectedTokenName")

  if (tokenParam && tokenSelect) {
    tokenSelect.value = tokenParam
  }

  if (selectedTokenName) {
    selectedTokenName.textContent = tokenSelect.value
  }

  // Generate QR code for the selected token
  generateQRCode(getWalletAddress(tokenSelect.value))

  // Update display address
  updateDisplayAddress(tokenSelect.value)

  // Token select change handler
  if (tokenSelect) {
    tokenSelect.addEventListener("change", function () {
      const selectedToken = this.value

      // Update selected token name
      if (selectedTokenName) {
        selectedTokenName.textContent = selectedToken
      }

      // Generate QR code for the selected token
      generateQRCode(getWalletAddress(selectedToken))

      // Update display address
      updateDisplayAddress(selectedToken)
    })
  }

  // Copy address button
  const copyAddressBtn = document.getElementById("copyAddressBtn")
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener("click", () => {
      const displayAddress = document.getElementById("displayAddress")
      const addressToCopy = displayAddress.textContent.trim()

      if (addressToCopy && addressToCopy !== "Select a token to view address") {
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
  }

  // Share address button
  const shareAddressBtn = document.getElementById("shareAddressBtn")
  if (shareAddressBtn) {
    shareAddressBtn.addEventListener("click", () => {
      const displayAddress = document.getElementById("displayAddress")
      const addressToShare = displayAddress.textContent.trim()
      const tokenType = tokenSelect.value

      if (addressToShare && addressToShare !== "Select a token to view address") {
        if (navigator.share) {
          navigator
            .share({
              title: `My ${tokenType} Wallet Address`,
              text: `Here's my ${tokenType} wallet address: ${addressToShare}`,
            })
            .catch((err) => {
              console.error("Share failed:", err)
            })
        } else {
          alert("Web Share API not supported in your browser. Please copy the address manually.")
        }
      }
    })
  }

  // Helper functions
  function getWalletAddress(tokenType) {
    const walletAddressField = `${tokenType.toLowerCase()}WalletAddress`
    return currentUser[walletAddressField] || "Address not available"
  }

  function updateDisplayAddress(tokenType) {
    const displayAddress = document.getElementById("displayAddress")
    if (displayAddress) {
      displayAddress.textContent = getWalletAddress(tokenType)
    }
  }

  function generateQRCode(address) {
    const qrCode = document.getElementById("qrCode")
    if (!qrCode) return

    // Clear previous QR code
    qrCode.innerHTML = ""

    // Create QR code
    try {
      const qr = qrcode(0, "L")
      qr.addData(address)
      qr.make()
      qrCode.innerHTML = qr.createImgTag(5)
    } catch (error) {
      console.error("Error generating QR code:", error)
      qrCode.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff3b30;">Error generating QR code</div>`
    }
  }
})

