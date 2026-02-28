import { auth, database } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, get, update, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let currentUser = null;
let userCoins = 0;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    currentUser = user;
    loadBalance();
  }
});

async function loadBalance() {
  const userRef = ref(database, 'users/' + currentUser.uid);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    userCoins = snapshot.val().coins || 0;
    document.getElementById('availableCoins').textContent = userCoins.toLocaleString();
    document.getElementById('availableAmount').textContent = '₹' + (userCoins / 1000).toFixed(2);
  }
}

document.getElementById('paymentMethod').addEventListener('change', (e) => {
  const method = e.target.value;
  document.getElementById('upiId').style.display = method === 'upi' ? 'block' : 'none';
  document.getElementById('bankDetails').style.display = method === 'bank' ? 'block' : 'none';
  document.getElementById('paytmNumber').style.display = method === 'paytm' ? 'block' : 'none';
});

document.getElementById('withdrawForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  const requiredCoins = amount * 1000;
  
  if (amount < 50) {
    alert('Minimum withdrawal amount is ₹50');
    return;
  }
  
  if (requiredCoins > userCoins) {
    alert(`Insufficient balance! You need ${requiredCoins.toLocaleString()} coins but have only ${userCoins.toLocaleString()} coins`);
    return;
  }
  
  const paymentMethod = document.getElementById('paymentMethod').value;
  let paymentDetails = {};
  
  if (paymentMethod === 'upi') {
    paymentDetails.upiId = document.getElementById('upiId').value;
  } else if (paymentMethod === 'bank') {
    paymentDetails.accountName = document.getElementById('accountName').value;
    paymentDetails.accountNumber = document.getElementById('accountNumber').value;
    paymentDetails.ifscCode = document.getElementById('ifscCode').value;
    paymentDetails.bankName = document.getElementById('bankName').value;
  } else if (paymentMethod === 'paytm') {
    paymentDetails.paytmNumber = document.getElementById('paytmNumber').value;
  }
  
  const withdrawalRef = push(ref(database, 'withdrawals'));
  await set(withdrawalRef, {
    userId: currentUser.uid,
    amount: amount,
    coins: requiredCoins,
    paymentMethod: paymentMethod,
    paymentDetails: paymentDetails,
    status: 'pending',
    timestamp: Date.now()
  });
  
  const userRef = ref(database, 'users/' + currentUser.uid);
  const snapshot = await get(userRef);
  const userData = snapshot.val();
  await update(userRef, {
    coins: (userData.coins || 0) - requiredCoins
  });
  
  alert('Withdrawal request submitted successfully! You will receive payment in 2-3 business days.');
  window.location.href = 'wallet.html';
});
