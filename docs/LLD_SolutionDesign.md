# SuperMall Solution Design (LLD)

## Component Breakdown
- **App.js:** Main routing and state management
- **UserHome.js:** User dashboard, navigation, and modals
- **SuperMallHeader.js:** Header with logo, search, user menu, notifications
- **LoginModal.js / SignupModal.js:** Auth modals
- **ProfileModal.js / AboutModal.js / FAQModal.js / NotificationsModal.js:** Info modals
- **UserProductList.js / UserProductDetails.js:** Product browsing
- **Admin Panel (dashboard view):** Shop, offer, category, and floor management
- **DataSeeder.js:** Firestore seeding utility

## Data Models
- **User:** `{ uid, email, name, avatar, role }` (role: 'admin' or 'user')
- **Shop:** `{ id, name, description, categoryId, floorId, image, ... }`
- **Product:** `{ id, name, description, price, shopId, categoryId, image, ... }`
- **Offer:** `{ id, title, description, shopId, productId, validFrom, validTo, ... }`
- **Category:** `{ id, name, image }`
- **Floor:** `{ id, level, name, image }`

## User Roles & Permissions
- **Admin:** Full access to admin panel, CRUD for all entities, data seeding
- **User:** Browse/search, update product info (if merchant), view offers

## Firestore Structure
- `/users/{uid}`: User profile and role
- `/shops/{shopId}`: Shop details
- `/products/{productId}`: Product details
- `/offers/{offerId}`: Offer details
- `/categories/{categoryId}`: Category details
- `/floors/{floorId}`: Floor details

## UI/UX Patterns
- Responsive grids, modals, dropdowns, and skeleton loaders
- Dark mode via Tailwind's 'dark' class
- Accessible forms and navigation

---

**LLD by Yuvraj Singh** 