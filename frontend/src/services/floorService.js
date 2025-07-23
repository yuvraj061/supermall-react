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

const FLOORS_COLLECTION = "floors";

// Create a new floor
export const createFloor = async (floorData) => {
  try {
    logger.info('Creating new floor:', floorData.name);
    
    const floorWithTimestamp = {
      ...floorData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, FLOORS_COLLECTION), floorWithTimestamp);
    logger.info('Floor created successfully with ID:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    logger.error('Error creating floor:', error.message);
    return { success: false, error: error.message };
  }
};

// Get all floors
export const getAllFloors = async () => {
  try {
    logger.info('Fetching all floors');
    
    const querySnapshot = await getDocs(collection(db, FLOORS_COLLECTION));
    const floors = [];
    
    querySnapshot.forEach((doc) => {
      floors.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    logger.info('Floors fetched successfully, count:', floors.length);
    return { success: true, floors };
  } catch (error) {
    logger.error('Error fetching floors:', error.message);
    return { success: false, error: error.message };
  }
};

// Update a floor
export const updateFloor = async (floorId, floorData) => {
  try {
    logger.info('Updating floor:', floorId);
    
    const floorWithTimestamp = {
      ...floorData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, FLOORS_COLLECTION, floorId), floorWithTimestamp);
    logger.info('Floor updated successfully:', floorId);
    
    return { success: true };
  } catch (error) {
    logger.error('Error updating floor:', error.message);
    return { success: false, error: error.message };
  }
};

// Delete a floor
export const deleteFloor = async (floorId) => {
  try {
    logger.info('Deleting floor:', floorId);
    
    await deleteDoc(doc(db, FLOORS_COLLECTION, floorId));
    logger.info('Floor deleted successfully:', floorId);
    
    return { success: true };
  } catch (error) {
    logger.error('Error deleting floor:', error.message);
    return { success: false, error: error.message };
  }
}; 