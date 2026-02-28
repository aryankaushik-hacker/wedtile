import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRlNHcRxpda91lbjX5UXosUhI5utCux0E",
  authDomain: "wedtile.firebaseapp.com",
  databaseURL: "https://wedtile-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wedtile",
  storageBucket: "wedtile.firebasestorage.app",
  messagingSenderId: "685849573152",
  appId: "1:685849573152:web:6ec9360f591a7c39fe4945",
  measurementId: "G-3VCYX4Q9EP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);
