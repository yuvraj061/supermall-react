# SuperMall System Architecture (Wireframe)

```mermaid
graph TD
  User[User (Browser)]
  Admin[Admin (Browser)]
  Frontend[React Frontend (Vercel/Netlify)]
  Firebase[Firebase Backend]
  Auth[Firebase Auth]
  Firestore[Firestore DB]
  Storage[Firebase Storage]

  User -- UI/API --> Frontend
  Admin -- UI/API --> Frontend
  Frontend -- Auth API --> Auth
  Frontend -- Data API --> Firestore
  Frontend -- File Uploads --> Storage
  Auth -- User Session --> Frontend
  Firestore -- Real-time Data --> Frontend
```

**Explanation:**
- Users and admins interact with the React frontend, deployed on Vercel/Netlify.
- The frontend communicates with Firebase Auth for authentication and Firestore for real-time data.
- All images/files are stored in Firebase Storage.
- Role-based access is enforced in the frontend and Firestore security rules. 