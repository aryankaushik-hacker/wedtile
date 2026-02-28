import { auth, database } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, get, update, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    currentUser = user;
    loadUserData();
  }
});

async function loadUserData() {
  const userRef = ref(database, 'users/' + currentUser.uid);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    document.getElementById('coinBalance').textContent = data.coins || 0;
    document.getElementById('totalDonated').textContent = data.totalDonated || 0;
    document.getElementById('donationCount').textContent = data.donationCount || 0;
    document.getElementById('blessingsEarned').textContent = data.blessingsEarned || 0;
  }
}

window.donate = async function(cause, amount) {
  const userRef = ref(database, 'users/' + currentUser.uid);
  const snapshot = await get(userRef);
  const userData = snapshot.val();
  const currentCoins = userData.coins || 0;
  
  if (currentCoins < amount) {
    alert(`Insufficient coins! You have ${currentCoins} coins but need ${amount} coins.`);
    return;
  }
  
  const options = {
    key: 'rzp_test_SGJUmP9bvuaVCY',
    amount: Math.floor((amount / 1000) * 100),
    currency: 'INR',
    name: 'Wedtile Donation',
    description: `Donate to ${cause}`,
    handler: async function(response) {
      const donationRef = push(ref(database, 'donations'));
      await set(donationRef, {
        userId: currentUser.uid,
        cause: cause,
        amount: amount,
        paymentId: response.razorpay_payment_id,
        timestamp: Date.now()
      });
      
      await update(userRef, {
        coins: currentCoins - amount,
        totalDonated: (userData.totalDonated || 0) + amount,
        donationCount: (userData.donationCount || 0) + 1,
        blessingsEarned: (userData.blessingsEarned || 0) + Math.floor(amount / 10)
      });
      
      showToast(`🙏 Thank you! ${amount} coins donated to ${cause}. You earned ${Math.floor(amount / 10)} blessings!`);
      loadUserData();
    },
    theme: {
      color: '#00ff88'
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
}

window.customDonate = async function(cause) {
  const amount = prompt('Enter donation amount in coins:');
  if (amount && !isNaN(amount) && amount > 0) {
    await donate(cause, parseInt(amount));
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
