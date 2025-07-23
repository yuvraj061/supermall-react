import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./firebase";
import logger from "../utils/logger";

// Admin login function
export const adminLogin = async (email, password) => {
  try {
    logger.info('Admin login attempt:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    logger.info('Admin login successful:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    logger.error('Admin login failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Admin logout function
export const adminLogout = async () => {
  try {
    logger.info('Admin logout attempt');
    await signOut(auth);
    logger.info('Admin logout successful');
    return { success: true };
  } catch (error) {
    logger.error('Admin logout failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      logger.info('User authenticated:', user.email);
    } else {
      logger.info('User signed out');
    }
    callback(user);
  });
}; 

// User signup function
export const userSignup = async (email, password) => {
  try {
    logger.info('User signup attempt:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    logger.info('User signup successful:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    logger.error('User signup failed:', error.message);
    return { success: false, error: error.message };
  }
}; 