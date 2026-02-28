import { auth, database } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, get, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    currentUser = user;
    loadProfile();
  }
});

function loadProfile() {
  const userRef = ref(database, 'users/' + currentUser.uid);
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      document.getElementById('userName').textContent = data.name || 'User';
      document.getElementById('userEmail').textContent = data.email;
      document.getElementById('totalJaaps').textContent = (data.totalViews || 0).toLocaleString();
      document.getElementById('totalCoins').textContent = (data.coins || 0).toLocaleString();
      document.getElementById('totalEarnings').textContent = '₹' + ((data.coins || 0) / 1000).toFixed(2);
      document.getElementById('totalDonated').textContent = (data.totalDonated || 0).toLocaleString();
      document.getElementById('referralCount').textContent = data.referralCount || 0;
      document.getElementById('referralEarnings').textContent = (data.referralEarnings || 0).toLocaleString();
      
      const level = Math.floor((data.totalViews || 0) / 1000) + 1;
      document.getElementById('userLevel').textContent = level;
      
      if (data.joinedAt) {
        const date = new Date(data.joinedAt);
        document.getElementById('joinedDate').textContent = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }
      
      updateAchievements(data);
    }
  });
}

function updateAchievements(data) {
  const achievements = document.querySelectorAll('.achievement-badge');
  
  if (data.totalViews >= 1) {
    achievements[0].classList.remove('locked');
    achievements[0].querySelector('i').className = 'fas fa-om';
  }
  
  if (data.totalViews >= 108) {
    achievements[1].classList.remove('locked');
    achievements[1].querySelector('i').className = 'fas fa-star';
  }
  
  if (data.totalViews >= 1008) {
    achievements[2].classList.remove('locked');
    achievements[2].querySelector('i').className = 'fas fa-crown';
  }
  
  if (data.totalDonated >= 1) {
    achievements[3].classList.remove('locked');
    achievements[3].querySelector('i').className = 'fas fa-heart';
  }
  
  if (data.blessingsEarned >= 100) {
    achievements[4].classList.remove('locked');
    achievements[4].querySelector('i').className = 'fas fa-hands-helping';
  }
  
  if (data.totalDonated >= 1000) {
    achievements[5].classList.remove('locked');
    achievements[5].querySelector('i').className = 'fas fa-gift';
  }
}

window.copyReferral = function() {
  const refCode = document.getElementById('refCode').value;
  navigator.clipboard.writeText(refCode);
  alert('Referral code copied to clipboard!');
}

window.logout = function() {
  signOut(auth).then(() => {
    window.location.href = 'login.html';
  });
}
