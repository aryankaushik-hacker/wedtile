import { auth, database } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let allUsers = [];
let allWithdrawals = [];
let allDonations = [];

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    loadAllData();
  }
});

async function loadAllData() {
  await loadUsers();
  await loadWithdrawals();
  await loadDonations();
  calculateStats();
}

async function loadUsers() {
  const usersRef = ref(database, 'users');
  const snapshot = await get(usersRef);
  if (snapshot.exists()) {
    allUsers = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
    displayUsers();
  }
}

function displayUsers() {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';
  allUsers.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.name || 'N/A'}</td>
      <td>${user.email}</td>
      <td>${user.coins || 0}</td>
      <td>${user.totalViews || 0}</td>
      <td>${user.referralCount || 0}</td>
      <td>${new Date(user.joinedAt).toLocaleDateString()}</td>
      <td><button class="action-btn" onclick="viewUser('${user.id}')">View</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadWithdrawals() {
  const withdrawalsRef = ref(database, 'withdrawals');
  const snapshot = await get(withdrawalsRef);
  if (snapshot.exists()) {
    allWithdrawals = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
    displayWithdrawals();
  }
}


function displayWithdrawals() {
  const tbody = document.getElementById('withdrawalsTableBody');
  tbody.innerHTML = '';
  allWithdrawals.forEach(w => {
    const user = allUsers.find(u => u.id === w.userId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user?.name || 'Unknown'}</td>
      <td>₹${w.amount}</td>
      <td>${w.coins}</td>
      <td>${w.paymentMethod}</td>
      <td>${JSON.stringify(w.paymentDetails).substring(0, 30)}...</td>
      <td><span class="status-${w.status}">${w.status}</span></td>
      <td>${new Date(w.timestamp).toLocaleDateString()}</td>
      <td>
        <button class="action-btn" onclick="approveWithdrawal('${w.id}')">Approve</button>
        <button class="action-btn reject" onclick="rejectWithdrawal('${w.id}')">Reject</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadDonations() {
  const donationsRef = ref(database, 'donations');
  const snapshot = await get(donationsRef);
  if (snapshot.exists()) {
    allDonations = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
    displayDonations();
  }
}

function displayDonations() {
  const tbody = document.getElementById('donationsTableBody');
  tbody.innerHTML = '';
  allDonations.forEach(d => {
    const user = allUsers.find(u => u.id === d.userId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user?.name || 'Unknown'}</td>
      <td>${d.cause}</td>
      <td>${d.amount}</td>
      <td>${new Date(d.timestamp).toLocaleDateString()}</td>
    `;
    tbody.appendChild(tr);
  });
}

function calculateStats() {
  document.getElementById('totalUsers').textContent = allUsers.length;
  document.getElementById('totalCoinsIssued').textContent = allUsers.reduce((sum, u) => sum + (u.coins || 0), 0);
  document.getElementById('totalJaaps').textContent = allUsers.reduce((sum, u) => sum + (u.totalViews || 0), 0);
  document.getElementById('totalWithdrawals').textContent = '₹' + allWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
  document.getElementById('totalDonations').textContent = allDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  document.getElementById('totalReferrals').textContent = allUsers.reduce((sum, u) => sum + (u.referralCount || 0), 0);
}

window.showTab = function(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById(tab + 'Tab').classList.add('active');
}

window.approveWithdrawal = async function(id) {
  await update(ref(database, 'withdrawals/' + id), { status: 'approved' });
  alert('Withdrawal approved!');
  loadWithdrawals();
}

window.rejectWithdrawal = async function(id) {
  await update(ref(database, 'withdrawals/' + id), { status: 'rejected' });
  alert('Withdrawal rejected!');
  loadWithdrawals();
}

window.searchUsers = function() {
  const query = document.getElementById('userSearch').value.toLowerCase();
  const filtered = allUsers.filter(u => 
    u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query)
  );
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';
  filtered.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.name || 'N/A'}</td>
      <td>${user.email}</td>
      <td>${user.coins || 0}</td>
      <td>${user.totalViews || 0}</td>
      <td>${user.referralCount || 0}</td>
      <td>${new Date(user.joinedAt).toLocaleDateString()}</td>
      <td><button class="action-btn" onclick="viewUser('${user.id}')">View</button></td>
    `;
    tbody.appendChild(tr);
  });
}

window.viewUser = function(id) {
  const user = allUsers.find(u => u.id === id);
  alert(JSON.stringify(user, null, 2));
}
