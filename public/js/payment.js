import { auth, database } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let currentUser = null;

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
  if (snapshot.exists() && snapshot.val().paymentVerified) {
    window.location.href = 'index.html';
  }
}

window.initiatePayment = function() {
  const options = {
    key: 'rzp_test_SGJUmP9bvuaVCY',
    amount: 5100,
    currency: 'INR',
    name: 'Wedtile',
    description: 'Registration Fee',
    image: 'https://via.placeholder.com/100',
    handler: function(response) {
      verifyPayment(response);
    },
    prefill: {
      email: currentUser.email
    },
    theme: {
      color: '#00ff88'
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
}

async function verifyPayment(response) {
  const userRef = ref(database, 'users/' + currentUser.uid);
  await update(userRef, {
    paymentVerified: true,
    paymentId: response.razorpay_payment_id,
    paymentDate: Date.now()
  });
  
  alert('Payment successful! You can now start earning coins. 🎉');
  window.location.href = 'index.html';
}
