import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUpGrWtSa70ITHLyZyCWoGhhlfpBMCGFc",
  authDomain: "chegram-9e96c.firebaseapp.com",
  databaseURL: "https://chegram-9e96c-default-rtdb.firebaseio.com",
  projectId: "chegram-9e96c",
  storageBucket: "chegram-9e96c.firebasestorage.app",
  messagingSenderId: "663001258398",
  appId: "1:663001258398:web:67ce064f5fb8563926de8f",
  measurementId: "G-1RJ7WN11YM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const loginForm = document.getElementById('login');
const registerForm = document.getElementById('register');

window.login = function() {
    document.getElementById('login').style.left = '0';
    document.getElementById('register').style.left = '100%';
    document.getElementById('btn').style.left = '0';
}

window.register = function() {
    document.getElementById('login').style.left = '-100%';
    document.getElementById('register').style.left = '0';
    document.getElementById('btn').style.left = '50%';
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Wrong password. Try again or click "Forgot Password?"');
    }
});

window.resetPassword = async function() {
    const email = loginForm.querySelector('input[type="email"]').value;
    if (!email) {
        alert('Please enter your email first');
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent! Check your inbox.');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await set(ref(database, 'users/' + userCredential.user.uid), {
            name: name,
            email: email
        });
        alert('Registration successful!');
        login();
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            alert('Email already registered. Switching to login...');
            login();
        } else if (error.code === 'auth/weak-password') {
            alert('Password should be at least 6 characters.');
        } else {
            alert(error.message);
        }
    }
});
