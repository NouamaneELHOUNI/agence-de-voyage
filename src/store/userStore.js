import { create } from "zustand";
import { doc, getDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";
import useAuthStore from "./authStore";

const useUserStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  // Fetch user profile data
  fetchUserProfile: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        set({ profile: userDoc.data(), loading: false });
      } else {
        set({ profile: null, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      console.error("No authenticated user found");
      return { success: false, error: "No authenticated user" };
    }

    console.log("Updating profile with data:", profileData);
    console.log("Current user:", user.uid);

    set({ loading: true, error: null });
    try {
      const userDocRef = doc(db, "users", user.uid);

      // First check if the document exists
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.log("User document doesn't exist, creating new document");
        // If document doesn't exist, we need to create it first
        await setDoc(userDocRef, {
          ...profileData,
          email: user.email, // Ensure email is set from auth
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        console.log("Updating existing user document");
        await updateDoc(userDocRef, {
          ...profileData,
          updatedAt: new Date().toISOString(),
        });
      }

      // Update local state
      set((state) => ({
        profile: { ...state.profile, ...profileData },
        loading: false,
      }));

      console.log("Profile updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Upload profile image
  uploadProfileImage: async (file) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: "No authenticated user" };

    set({ loading: true, error: null });
    try {
      // Validate file
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }
      if (file.size > 3 * 1024 * 1024) {
        // 3MB limit
        throw new Error("File size must be less than 3MB");
      }

      const storageRef = ref(storage, `profileImages/${user.uid}`);

      // Upload file
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile with new image URL
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        profileImage: downloadURL,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      set((state) => ({
        profile: { ...state.profile, profileImage: downloadURL },
        loading: false,
      }));

      return { success: true, imageUrl: downloadURL };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Remove profile image
  removeProfileImage: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false, error: "No authenticated user" };

    set({ loading: true, error: null });
    try {
      const storageRef = ref(storage, `profileImages/${user.uid}`);

      // Delete image from storage
      await deleteObject(storageRef);

      // Update user profile to remove image URL
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        profileImage: null,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      set((state) => ({
        profile: { ...state.profile, profileImage: null },
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      // If the error is because the file doesn't exist, we can still consider it a success
      if (error.code === "storage/object-not-found") {
        set((state) => ({
          profile: { ...state.profile, profileImage: null },
          loading: false,
        }));
        return { success: true };
      }

      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Reset store state
  reset: () => set({ profile: null, loading: false, error: null }),
}));

export default useUserStore;
