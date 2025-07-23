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

const CATEGORIES_COLLECTION = "categories";

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    logger.info('Creating new category:', categoryData.name);
    
    const categoryWithTimestamp = {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), categoryWithTimestamp);
    logger.info('Category created successfully with ID:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    logger.error('Error creating category:', error.message);
    return { success: false, error: error.message };
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    logger.info('Fetching all categories');
    
    const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const categories = [];
    
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    logger.info('Categories fetched successfully, count:', categories.length);
    return { success: true, categories };
  } catch (error) {
    logger.error('Error fetching categories:', error.message);
    return { success: false, error: error.message };
  }
};

// Update a category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    logger.info('Updating category:', categoryId);
    
    const categoryWithTimestamp = {
      ...categoryData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, CATEGORIES_COLLECTION, categoryId), categoryWithTimestamp);
    logger.info('Category updated successfully:', categoryId);
    
    return { success: true };
  } catch (error) {
    logger.error('Error updating category:', error.message);
    return { success: false, error: error.message };
  }
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  try {
    logger.info('Deleting category:', categoryId);
    
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
    logger.info('Category deleted successfully:', categoryId);
    
    return { success: true };
  } catch (error) {
    logger.error('Error deleting category:', error.message);
    return { success: false, error: error.message };
  }
}; 