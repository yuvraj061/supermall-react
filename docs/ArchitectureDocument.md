# SuperMall Architecture Document

## System Components
- **Frontend:** React app (Vercel/Netlify)
- **Backend:** Firebase (Firestore, Auth, Storage)
- **Database:** Firestore (NoSQL)
- **Authentication:** Firebase Auth (email/password)
- **Storage:** Firebase Storage (images)

## Data Flow
1. User/admin logs in via Firebase Auth
2. Frontend fetches user role from Firestore
3. Users browse/search products, offers, shops
4. Admins manage shops, offers, categories, floors
5. All data is read/written in Firestore, with real-time updates
6. Images are uploaded to Firebase Storage

## Technology Choices
- **React:** Fast, component-based UI
- **Tailwind CSS:** Modern, utility-first styling
- **Firebase:** Real-time, scalable, secure backend
- **Lucide/Bootstrap Icons:** Clean, modern icons

## Scalability
- Firestore supports real-time, scalable data for thousands of users
- Frontend is statically deployed and scales automatically
- Modular codebase for easy feature addition

## Security
- Firebase Auth for secure login
- Firestore security rules for role-based access
- No sensitive data in frontend code
- Input validation and error handling

## Extensibility
- Add more user roles (merchant, moderator, etc.)
- Integrate payment gateways or analytics
- Add push notifications or chat
- Modular component structure for new features

---

**Architecture by Yuvraj Singh** 