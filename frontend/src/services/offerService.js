import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";
import { db } from "./firebase";
import logger from "../utils/logger";

const OFFERS_COLLECTION = "offers";

// Create a new offer
export const createOffer = async (offerData) => {
  try {
    logger.info('Creating new offer:', offerData.title);
    
    const offerWithTimestamp = {
      ...offerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, OFFERS_COLLECTION), offerWithTimestamp);
    logger.info('Offer created successfully with ID:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    logger.error('Error creating offer:', error.message);
    return { success: false, error: error.message };
  }
};

// Get all offers
export const getAllOffers = async () => {
  try {
    logger.info('Fetching all offers');
    
    const querySnapshot = await getDocs(collection(db, OFFERS_COLLECTION));
    const offers = [];
    
    querySnapshot.forEach((doc) => {
      offers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    logger.info('Offers fetched successfully, count:', offers.length);
    return { success: true, offers };
  } catch (error) {
    logger.error('Error fetching offers:', error.message);
    return { success: false, error: error.message };
  }
};

// Get offers by shop ID
export const getOffersByShop = async (shopId) => {
  try {
    logger.info('Fetching offers for shop:', shopId);
    
    const q = query(collection(db, OFFERS_COLLECTION), where("shopId", "==", shopId));
    const querySnapshot = await getDocs(q);
    const offers = [];
    
    querySnapshot.forEach((doc) => {
      offers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    logger.info('Shop offers fetched successfully, count:', offers.length);
    return { success: true, offers };
  } catch (error) {
    logger.error('Error fetching shop offers:', error.message);
    return { success: false, error: error.message };
  }
};

// Update an offer
export const updateOffer = async (offerId, offerData) => {
  try {
    logger.info('Updating offer:', offerId);
    
    const offerWithTimestamp = {
      ...offerData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, OFFERS_COLLECTION, offerId), offerWithTimestamp);
    logger.info('Offer updated successfully:', offerId);
    
    return { success: true };
  } catch (error) {
    logger.error('Error updating offer:', error.message);
    return { success: false, error: error.message };
  }
};

// Delete an offer
export const deleteOffer = async (offerId) => {
  try {
    logger.info('Deleting offer:', offerId);
    
    await deleteDoc(doc(db, OFFERS_COLLECTION, offerId));
    logger.info('Offer deleted successfully:', offerId);
    
    return { success: true };
  } catch (error) {
    logger.error('Error deleting offer:', error.message);
    return { success: false, error: error.message };
  }
}; 