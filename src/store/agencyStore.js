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

const COLLECTION_NAME = "agencies";

const initialState = {
  agencies: [],
  currentAgency: null,
  lastVisible: null,
  loading: false,
  error: null,
};

const useAgencyStore = create((set, get) => ({
  ...initialState,

  // Reset state
  reset: () => set(initialState),

  // Create a new agency
  createAgency: async (agencyData) => {
    set({ loading: true, error: null });
    try {
      // Get current user from auth store
      const user = useAuthStore.getState().user;

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...agencyData,
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

      const newAgency = {
        id: docRef.id,
        ...agencyData,
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
        agencies: [newAgency, ...state.agencies],
        loading: false,
      }));

      return { success: true, data: newAgency };
    } catch (error) {
      console.error("Error creating agency:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء إنشاء الوكالة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch a single agency by ID
  fetchAgency: async (agencyId) => {
    set({ loading: true, error: null, currentAgency: null });
    try {
      const docRef = doc(db, COLLECTION_NAME, agencyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const agencyData = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
        };

        set({ currentAgency: agencyData, loading: false });
        return { success: true, data: agencyData };
      } else {
        set({
          loading: false,
          error: "لم يتم العثور على الوكالة",
        });
        return { success: false, error: "لم يتم العثور على الوكالة" };
      }
    } catch (error) {
      console.error("Error fetching agency:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع بيانات الوكالة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch multiple agencies
  fetchAgencies: async (pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      agencies: resetPagination ? [] : state.agencies,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let agenciesQuery;

      if (lastVisible && !resetPagination) {
        agenciesQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        agenciesQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(agenciesQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newAgencies = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        agencies: resetPagination
          ? newAgencies
          : [...state.agencies, ...newAgencies],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newAgencies };
    } catch (error) {
      console.error("Error fetching agencies:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة الوكالات. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch agencies by user ID
  fetchUserAgencies: async (userId, pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      agencies: resetPagination ? [] : state.agencies,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let agenciesQuery;

      if (lastVisible && !resetPagination) {
        agenciesQuery = query(
          collection(db, COLLECTION_NAME),
          where("created_by.uid", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        agenciesQuery = query(
          collection(db, COLLECTION_NAME),
          where("created_by.uid", "==", userId),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(agenciesQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newAgencies = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        agencies: resetPagination
          ? newAgencies
          : [...state.agencies, ...newAgencies],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newAgencies };
    } catch (error) {
      console.error("Error fetching user agencies:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة الوكالات. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Update an agency
  updateAgency: async (agencyId, agencyData) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, agencyId);
      await updateDoc(docRef, {
        ...agencyData,
        updatedAt: serverTimestamp(),
      });

      const updatedAgency = {
        id: agencyId,
        ...agencyData,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        agencies: state.agencies.map((agency) =>
          agency.id === agencyId ? { ...agency, ...updatedAgency } : agency
        ),
        currentAgency:
          state.currentAgency?.id === agencyId
            ? { ...state.currentAgency, ...updatedAgency }
            : state.currentAgency,
        loading: false,
      }));

      return { success: true, data: updatedAgency };
    } catch (error) {
      console.error("Error updating agency:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء تحديث بيانات الوكالة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Delete an agency
  deleteAgency: async (agencyId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, agencyId);
      await deleteDoc(docRef);

      set((state) => ({
        agencies: state.agencies.filter((agency) => agency.id !== agencyId),
        currentAgency:
          state.currentAgency?.id === agencyId ? null : state.currentAgency,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting agency:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء حذف الوكالة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },
}));

export default useAgencyStore;
