# SuperMall Project Report

## Problem Statement
Modern shopping malls and rural marketplaces need a digital platform to manage merchant counters, stalls, products, and offers, enabling both consumers and admins to interact seamlessly and securely.

## Solution Summary
SuperMall is a full-stack digital marketplace platform with:
- Real-time shop, product, and offer management
- Role-based access (admin, user)
- Mobile-friendly, modern UI
- Secure authentication and data storage (Firebase)

## Key Features
- User authentication (Firebase Auth)
- Admin panel for shop, offer, and category management
- Product info updater for merchants
- Global search, notifications, FAQ, and profile modals
- Dark mode, responsive design, and branding

## User Flows
- **User:** Login/Signup → Browse/Search → View Products/Offers → Update Product Info (if merchant)
- **Admin:** Login → Admin Panel → Manage Shops/Offers/Categories → Add Rural Data

## Design Decisions
- **React + Tailwind:** Fast, modern, and responsive UI
- **Firebase:** Real-time, scalable backend with secure auth
- **Role-based UI:** Only admins see admin features
- **Modular Components:** Easy to extend and maintain

## Optimizations
- **Code:** Modular, reusable components, error boundaries, and hooks
- **Architecture:** Real-time updates, role-based access, scalable Firestore structure
- **UI:** Lazy loading, skeletons, and optimized images

## Challenges
- Ensuring real-time, secure role-based access
- Handling Firestore data consistency and seeding
- Making the UI beautiful and accessible on all devices

## Test Cases

### 1. Authentication
- Login (Success): User can log in with valid credentials.
- Login (Failure): User sees error with invalid credentials.
- Signup (Success): User can register with a new email.
- Signup (Failure): User sees error for existing email or weak password.
- Logout: User is logged out and redirected to home.

### 2. Role-Based Access
- Admin Panel Access: Only users with `role: admin` see and can access the Admin Panel.
- User Access: Regular users cannot access admin features.

### 3. Admin Features
- Add Shop: Admin can add a new shop (all required fields, image upload).
- Edit Shop: Admin can edit shop details.
- Delete Shop: Admin can delete a shop.
- Add Offer: Admin can add a new offer.
- Edit Offer: Admin can edit offer details.
- Delete Offer: Admin can delete an offer.
- Add Category/Floor: Admin can add/edit/delete categories and floors.

### 4. User Features
- Browse Products: User can view all products.
- Search: User can search for shops, products, or offers.
- View Shop Details: User can view detailed info for a shop.
- View Product Details: User can view detailed info for a product.
- Update Product Info: (If merchant) User can update product info.

### 5. UI/UX
- Dark Mode Toggle: UI switches between light and dark mode.
- Responsive Design: App works on mobile, tablet, and desktop.
- Modals: Login, signup, profile, about, FAQ, and notifications modals open and close correctly.

### 6. Notifications & FAQ
- Notifications Modal: Opens and displays notifications (or “No new notifications”).
- FAQ Modal: Opens and displays frequently asked questions.

### 7. Error Handling
- Invalid Input: User sees error messages for invalid form input.
- Network Error: User sees error if network is lost or backend is unavailable.

### 8. Persistence
- Session Persistence: User stays logged in after page reload (unless logged out).

---

#### (Optional) Automated Test Suggestions
- Use Jest/React Testing Library for:
  - Rendering components (header, modals, cards)
  - Simulating user actions (click, input, submit)
  - Checking role-based rendering (admin/user)
  - Mocking Firebase Auth and Firestore for unit tests

---

**Project by Yuvraj Singh** 