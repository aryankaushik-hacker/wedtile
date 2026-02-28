import { auth, database } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    loadWalletData(user.uid);
  }
});

function loadWalletData(uid) {
  const userRef = ref(database, 'users/' + uid);
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      document.getElementById('coinBalance').textContent = data.coins || 0;
      document.getElementById('totalCoins').textContent = data.coins || 0;
      document.getElementById('totalRupees').textContent = ((data.coins || 0) / 1000).toFixed(2);
      document.getElementById('watchEarnings').textContent = data.watchEarnings || 0;
      document.getElementById('uploadEarnings').textContent = data.uploadEarnings || 0;
      document.getElementById('referralEarnings').textContent = data.referralEarnings || 0;
      document.getElementById('totalViews').textContent = data.totalViews || 0;
    }
  });
}

window.withdraw = function() {
  const coins = parseInt(document.getElementById('totalCoins').textContent);
  const rupees = coins / 1000;
  
  if (rupees < 50) {
    alert('Minimum withdrawal is ₹50 (50,000 coins)');
  } else {
    alert('Withdrawal request submitted! Amount: ₹' + rupees.toFixed(2));
  }
}
