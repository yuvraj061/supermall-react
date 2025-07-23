# SuperMall

![SuperMall Logo](./frontend/public/logo192.png)

**India’s Digital Marketplace**

---

## Overview
SuperMall is a modern, full-stack digital marketplace platform for managing merchant counters, stalls, products, and offers. It features a seamless user experience for consumers and admins, with real-time updates, role-based access, and a beautiful, responsive UI.

---

## Features
- 🛒 Browse shops, products, and offers
- 🔍 Global search with instant results
- 🌙 Dark mode toggle
- 👤 User authentication (Firebase Auth)
- 🛡️ Role-based admin panel
- 🏪 Shop, offer, and category management (admin)
- 📝 Product info updater for merchants
- 🖼️ Images for categories, shops, and products
- 🛎️ Notifications, profile, and FAQ modals
- 📱 Fully responsive and mobile-friendly

---

## Tech Stack
- **Frontend:** React, Tailwind CSS, Lucide/Bootstrap Icons
- **Backend/DB:** Firebase Firestore, Firebase Auth
- **Deployment:** Vercel/Netlify (frontend), Firebase Hosting (optional)

---

## Setup & Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/supermall.git
   cd supermall
   ```
2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
3. **Configure Firebase:**
   - Copy your Firebase config to `frontend/src/services/firebase.js` (already set up for demo).
   - Enable Email/Password Auth in Firebase Console.
4. **Run the app:**
   ```bash
   npm start
   ```
5. **(Optional) Seed Firestore data:**
   - Use the Admin Panel or Data Seeder to populate sample data.

---

## Usage
- **User:** Browse, search, and view products/offers. Update product info (if merchant).
- **Admin:** Access Admin Panel for shop/offer/category management. Add rural data, manage users.
- **Login/Signup:** Use the header menu. Admins are assigned via Firestore (`/users/{uid}` with `role: admin`).

---

## Deployment
- **Frontend:** Deploy `frontend/` to Vercel or Netlify.
- **Backend:** Firebase Hosting (optional) for static files.
- **Environment:** Set up Firebase config in your deployment environment.

---

## Screenshots
> _Add screenshots of your dashboard, product page, admin panel, and modals here._

---

## Testing
- Manual test cases:
  - Login/Signup/Logout
  - Admin Panel access (role-based)
  - CRUD for shops, offers, categories
  - Product info update
  - Dark mode toggle
  - Search, notifications, FAQ, and profile modals
- (Optional) Add automated tests with Jest/React Testing Library

---

## License
MIT

---

## Contact
- Project by Yuvraj Singh
- For support, open an issue or contact the project owner.
