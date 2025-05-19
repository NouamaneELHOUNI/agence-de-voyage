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

const COLLECTION_NAME = "flights";

const initialState = {
  flights: [],
  currentFlight: null,
  lastVisible: null,
  loading: false,
  error: null,
};

const useFlightStore = create((set, get) => ({
  ...initialState,

  // Reset state
  reset: () => set(initialState),

  // Create a new flight
  createFlight: async (flightData) => {
    set({ loading: true, error: null });
    try {
      // Get current user from auth store
      const user = useAuthStore.getState().user;

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...flightData,
        createdBy: user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email,
            }
          : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newFlight = {
        id: docRef.id,
        ...flightData,
        createdBy: user
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
        flights: [newFlight, ...state.flights],
        loading: false,
      }));

      return { success: true, data: newFlight };
    } catch (error) {
      console.error("Error creating flight:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء إنشاء الرحلة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch a single flight by ID
  fetchFlight: async (flightId) => {
    set({ loading: true, error: null, currentFlight: null });
    try {
      const docRef = doc(db, COLLECTION_NAME, flightId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const flightData = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
        };

        set({ currentFlight: flightData, loading: false });
        return { success: true, data: flightData };
      } else {
        set({
          loading: false,
          error: "لم يتم العثور على الرحلة",
        });
        return { success: false, error: "لم يتم العثور على الرحلة" };
      }
    } catch (error) {
      console.error("Error fetching flight:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع بيانات الرحلة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch multiple flights
  fetchFlights: async (pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      flights: resetPagination ? [] : state.flights,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let flightsQuery;

      if (lastVisible && !resetPagination) {
        flightsQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        flightsQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(flightsQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newFlights = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        flights: resetPagination
          ? newFlights
          : [...state.flights, ...newFlights],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newFlights };
    } catch (error) {
      console.error("Error fetching flights:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة الرحلات. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch flights by user ID
  fetchUserFlights: async (userId, pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      flights: resetPagination ? [] : state.flights,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let flightsQuery;

      if (lastVisible && !resetPagination) {
        flightsQuery = query(
          collection(db, COLLECTION_NAME),
          where("createdBy.uid", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        flightsQuery = query(
          collection(db, COLLECTION_NAME),
          where("createdBy.uid", "==", userId),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(flightsQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newFlights = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        flights: resetPagination
          ? newFlights
          : [...state.flights, ...newFlights],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newFlights };
    } catch (error) {
      console.error("Error fetching user flights:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة الرحلات. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Update a flight
  updateFlight: async (flightId, flightData) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, flightId);
      await updateDoc(docRef, {
        ...flightData,
        updatedAt: serverTimestamp(),
      });

      const updatedFlight = {
        id: flightId,
        ...flightData,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        flights: state.flights.map((flight) =>
          flight.id === flightId ? { ...flight, ...updatedFlight } : flight
        ),
        currentFlight:
          state.currentFlight?.id === flightId
            ? { ...state.currentFlight, ...updatedFlight }
            : state.currentFlight,
        loading: false,
      }));

      return { success: true, data: updatedFlight };
    } catch (error) {
      console.error("Error updating flight:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء تحديث بيانات الرحلة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Delete a flight
  deleteFlight: async (flightId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, flightId);
      await deleteDoc(docRef);

      set((state) => ({
        flights: state.flights.filter((flight) => flight.id !== flightId),
        currentFlight:
          state.currentFlight?.id === flightId ? null : state.currentFlight,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting flight:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء حذف الرحلة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },
}));

export default useFlightStore;
