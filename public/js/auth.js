import { auth, database } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const googleProvider = new GoogleAuthProvider();
let isLoginMode = true;

const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const referralCodeInput = document.getElementById('referralCode');
const submitBtn = document.getElementById('submitBtn');
const authTitle = document.getElementById('authTitle');
const toggleText = document.getElementById('toggleText');
const toggleLink = document.getElementById('toggleLink');

toggleLink.addEventListener('click', (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  
  if (isLoginMode) {
    authTitle.textContent = 'Welcome Back';
    submitBtn.textContent = 'Login';
    toggleText.textContent = "Don't have an account?";
    toggleLink.textContent = 'Sign Up';
    confirmPasswordInput.style.display = 'none';
    referralCodeInput.style.display = 'none';
  } else {
    authTitle.textContent = 'Create Account';
    submitBtn.textContent = 'Sign Up';
    toggleText.textContent = 'Already have an account?';
    toggleLink.textContent = 'Login';
    confirmPasswordInput.style.display = 'block';
    referralCodeInput.style.display = 'block';
  }
});

function generateReferralCode() {
  return 'WED' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value;
  const password = passwordInput.value;
  
  if (isLoginMode) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'index.html';
    } catch (error) {
      alert(error.message);
    }
  } else {
    const confirmPassword = confirmPasswordInput.value;
    const referralCode = referralCodeInput.value.trim();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const myReferralCode = generateReferralCode();
      
      let referredBy = null;
      if (referralCode) {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const users = snapshot.val();
          const referrer = Object.entries(users).find(([id, user]) => user.referralCode === referralCode);
          if (referrer) {
            referredBy = referrer[0];
            await update(ref(database, 'users/' + referredBy), {
              coins: (referrer[1].coins || 0) + 100,
              referralCount: (referrer[1].referralCount || 0) + 1,
              referralEarnings: (referrer[1].referralEarnings || 0) + 100
            });
          }
        }
      }
      
      await set(ref(database, 'users/' + uid), {
        email: email,
        name: email.split('@')[0],
        coins: 100,
        totalEarnings: 0,
        totalViews: 0,
        postsCount: 0,
        watchEarnings: 0,
        uploadEarnings: 0,
        referralEarnings: 0,
        dailyEarnings: 0,
        totalDonated: 0,
        donationCount: 0,
        blessingsEarned: 0,
        referralCode: myReferralCode,
        referredBy: referredBy,
        referralCount: 0,
        paymentVerified: false,
        joinedAt: Date.now()
      });
      
      alert('Account created! Please complete payment to unlock benefits.');
      window.location.href = 'payment.html';
    } catch (error) {
      alert(error.message);
    }
  }
});

document.getElementById('googleBtn').addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userRef = ref(database, 'users/' + user.uid);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      await set(userRef, {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        coins: 100,
        totalEarnings: 0,
        totalViews: 0,
        postsCount: 0,
        watchEarnings: 0,
        uploadEarnings: 0,
        referralEarnings: 0,
        dailyEarnings: 0,
        totalDonated: 0,
        donationCount: 0,
        blessingsEarned: 0,
        referralCode: generateReferralCode(),
        referredBy: null,
        referralCount: 0,
        paymentVerified: false,
        joinedAt: Date.now()
      });
      alert('Account created! Please complete payment to unlock benefits.');
      window.location.href = 'payment.html';
    } else {
      window.location.href = 'index.html';
    }
  } catch (error) {
    alert(error.message);
  }
});
