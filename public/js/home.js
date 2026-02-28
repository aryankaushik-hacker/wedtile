import { auth, database } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, get, update, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let currentUser = null;
let jaapCount = 0;
let targetCount = 108;
let earnedCoins = 0;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    currentUser = user;
    checkPaymentStatus();
  }
});

async function checkPaymentStatus() {
  const userRef = ref(database, 'users/' + currentUser.uid);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    if (!snapshot.val().paymentVerified) {
      window.location.href = 'payment.html';
    } else {
      loadUserData();
    }
  }
}

async function loadUserData() {
  const userRef = ref(database, 'users/' + currentUser.uid);
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      document.getElementById('coinBalance').textContent = snapshot.val().coins || 0;
    }
  });
}

document.getElementById('jaapBtn').addEventListener('click', () => {
  jaapCount++;
  document.getElementById('jaapCount').textContent = jaapCount;
  
  const progress = (jaapCount / targetCount) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
  
  if (jaapCount % 108 === 0) {
    const userRef = ref(database, 'users/' + currentUser.uid);
    const snapshot = await get(userRef);
    if (snapshot.exists() && snapshot.val().paymentVerified) {
      earnedCoins += 1;
      updateUserCoins(1);
      showToast('🙏 +1 coin earned for 108 jaaps!');
    } else {
      showToast('⚠️ Complete payment to earn coins!');
    }
  }
  
  if (jaapCount === targetCount) {
    showToast('🎉 Target completed!');
  }
});

async function updateUserCoins(coins = 1) {
  const userRef = ref(database, 'users/' + currentUser.uid);
  const snapshot = await get(userRef);
  const userData = snapshot.val();
  
  await update(userRef, {
    coins: (userData.coins || 0) + coins,
    totalViews: (userData.totalViews || 0) + 1,
    watchEarnings: (userData.watchEarnings || 0) + coins
  });
}

window.setTarget = function(target) {
  targetCount = target;
  document.getElementById('targetCount').textContent = target;
  const progress = (jaapCount / targetCount) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
}

window.resetCounter = function() {
  jaapCount = 0;
  earnedCoins = 0;
  document.getElementById('jaapCount').textContent = 0;
  document.getElementById('progressFill').style.width = '0%';
  showToast('Counter reset!');
}

window.selectMantra = function(mantra, meaning) {
  document.getElementById('mantraText').textContent = mantra;
  document.querySelector('.mantra-meaning').textContent = meaning;
  
  document.querySelectorAll('.mantra-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
