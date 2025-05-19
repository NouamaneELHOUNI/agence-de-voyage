import { create } from "zustand";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  startAfter,
  limit,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import useAuthStore from "./authStore";

const COLLECTION_NAME = "packages";

const initialState = {
  packages: [],
  currentPackage: null,
  lastVisible: null,
  loading: false,
  error: null,
};

const usePackageStore = create((set, get) => ({
  ...initialState,

  // Reset state
  reset: () => set(initialState),

  // Create a new package
  createPackage: async (packageData) => {
    set({ loading: true, error: null });
    try {
      // Get current user from auth store
      const user = useAuthStore.getState().user;

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...packageData,
        created_by: user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email,
            }
          : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newPackage = {
        id: docRef.id,
        ...packageData,
        created_by: user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email,
            }
          : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        packages: [newPackage, ...state.packages],
        loading: false,
      }));

      return { success: true, data: newPackage };
    } catch (error) {
      console.error("Error creating package:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء إنشاء الباقة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch a single package by ID
  fetchPackage: async (packageId) => {
    set({ loading: true, error: null, currentPackage: null });
    try {
      const docRef = doc(db, COLLECTION_NAME, packageId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const packageData = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
        };

        set({ currentPackage: packageData, loading: false });
        return { success: true, data: packageData };
      } else {
        set({
          loading: false,
          error: "لم يتم العثور على الباقة",
        });
        return { success: false, error: "لم يتم العثور على الباقة" };
      }
    } catch (error) {
      console.error("Error fetching package:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع بيانات الباقة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch multiple packages
  fetchPackages: async (pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      packages: resetPagination ? [] : state.packages,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let packagesQuery;

      if (lastVisible && !resetPagination) {
        packagesQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        packagesQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(packagesQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newPackages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        packages: resetPagination
          ? newPackages
          : [...state.packages, ...newPackages],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newPackages };
    } catch (error) {
      console.error("Error fetching packages:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة الباقات. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch packages by user ID
  fetchUserPackages: async (userId, pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      packages: resetPagination ? [] : state.packages,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let packagesQuery;

      if (lastVisible && !resetPagination) {
        packagesQuery = query(
          collection(db, COLLECTION_NAME),
          where("created_by.uid", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        packagesQuery = query(
          collection(db, COLLECTION_NAME),
          where("created_by.uid", "==", userId),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(packagesQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newPackages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        packages: resetPagination
          ? newPackages
          : [...state.packages, ...newPackages],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newPackages };
    } catch (error) {
      console.error("Error fetching user packages:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة الباقات. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Update a package
  updatePackage: async (packageId, packageData) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, packageId);
      await updateDoc(docRef, {
        ...packageData,
        updatedAt: serverTimestamp(),
      });

      const updatedPackage = {
        id: packageId,
        ...packageData,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        packages: state.packages.map((pkg) =>
          pkg.id === packageId ? { ...pkg, ...updatedPackage } : pkg
        ),
        currentPackage:
          state.currentPackage?.id === packageId
            ? { ...state.currentPackage, ...updatedPackage }
            : state.currentPackage,
        loading: false,
      }));

      return { success: true, data: updatedPackage };
    } catch (error) {
      console.error("Error updating package:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء تحديث بيانات الباقة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Delete a package
  deletePackage: async (packageId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, packageId);
      await deleteDoc(docRef);

      set((state) => ({
        packages: state.packages.filter((pkg) => pkg.id !== packageId),
        currentPackage:
          state.currentPackage?.id === packageId ? null : state.currentPackage,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting package:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء حذف الباقة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },
}));

export default usePackageStore;
