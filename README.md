# Wedtile - Earn Money by Naam Jaap

## Features
- 🕉️ Earn coins by doing naam jaap (108 jaaps = 1 coin)
- 💰 Convert coins to real money (1000 coins = ₹1)
- 🎁 100 coins welcome bonus
- 👥 Referral system (100 coins per referral)
- 🙏 Donate to charity causes
- 💳 Razorpay payment integration
- 📊 Admin panel for management

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: Firebase Realtime Database
- Payment: Razorpay
- Hosting: Vercel

## Local Setup

1. Clone the repository
```bash
git clone <your-repo-url>
cd wedtile-app
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm start
```

4. Open browser at `http://localhost:3001`

## Deploy to Vercel

1. Push code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

## Environment Variables
No environment variables needed - Firebase config is in the code.

## Admin Panel
Access at: `/admin.html`

## Payment Gateway
- Test Mode: Razorpay test keys included
- For production: Replace with live keys

## Conversion Rate
- 1 coin = ₹0.001
- 1000 coins = ₹1
- Minimum withdrawal: ₹50 (50,000 coins)

## Registration Fee
- ₹51 mandatory payment after signup
- Required to unlock earning benefits
- Refundable in monthly lucky draw
