import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import logger from "../utils/logger";

const SHOPS_COLLECTION = "shops";

// Create a new shop
export const createShop = async (shopData) => {
  try {
    logger.info('Creating new shop:', shopData.name);
    
    const shopWithTimestamp = {
      ...shopData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, SHOPS_COLLECTION), shopWithTimestamp);
    logger.info('Shop created successfully with ID:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    logger.error('Error creating shop:', error.message);
    return { success: false, error: error.message };
  }
};

// Get all shops
export const getAllShops = async () => {
  try {
    logger.info('Fetching all shops');
    
    const querySnapshot = await getDocs(collection(db, SHOPS_COLLECTION));
    const shops = [];
    
    querySnapshot.forEach((doc) => {
      shops.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    logger.info('Shops fetched successfully, count:', shops.length);
    return { success: true, shops };
  } catch (error) {
    logger.error('Error fetching shops:', error.message);
    return { success: false, error: error.message };
  }
};

// Update a shop
export const updateShop = async (shopId, shopData) => {
  try {
    logger.info('Updating shop:', shopId);
    
    const shopWithTimestamp = {
      ...shopData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, SHOPS_COLLECTION, shopId), shopWithTimestamp);
    logger.info('Shop updated successfully:', shopId);
    
    return { success: true };
  } catch (error) {
    logger.error('Error updating shop:', error.message);
    return { success: false, error: error.message };
  }
};

// Delete a shop
export const deleteShop = async (shopId) => {
  try {
    logger.info('Deleting shop:', shopId);
    
    await deleteDoc(doc(db, SHOPS_COLLECTION, shopId));
    logger.info('Shop deleted successfully:', shopId);
    
    return { success: true };
  } catch (error) {
    logger.error('Error deleting shop:', error.message);
    return { success: false, error: error.message };
  }
}; 