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

const COLLECTION_NAME = "hotels";

const initialState = {
  hotels: [],
  currentHotel: null,
  lastVisible: null,
  loading: false,
  error: null,
};

const useHotelStore = create((set, get) => ({
  ...initialState,

  // Reset state
  reset: () => set(initialState),

  // Create a new hotel
  createHotel: async (hotelData) => {
    set({ loading: true, error: null });
    try {
      // Get current user from auth store
      const user = useAuthStore.getState().user;

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...hotelData,
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

      const newHotel = {
        id: docRef.id,
        ...hotelData,
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
        hotels: [newHotel, ...state.hotels],
        loading: false,
      }));

      return { success: true, data: newHotel };
    } catch (error) {
      console.error("Error creating hotel:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء إنشاء الفندق. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch a single hotel by ID
  fetchHotel: async (hotelId) => {
    set({ loading: true, error: null, currentHotel: null });
    try {
      const docRef = doc(db, COLLECTION_NAME, hotelId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const hotelData = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
        };

        set({ currentHotel: hotelData, loading: false });
        return { success: true, data: hotelData };
      } else {
        set({
          loading: false,
          error: "لم يتم العثور على الفندق",
        });
        return { success: false, error: "لم يتم العثور على الفندق" };
      }
    } catch (error) {
      console.error("Error fetching hotel:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع بيانات الفندق. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch multiple hotels
  fetchHotels: async (pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      hotels: resetPagination ? [] : state.hotels,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let hotelsQuery;

      if (lastVisible && !resetPagination) {
        hotelsQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        hotelsQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(hotelsQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newHotels = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        hotels: resetPagination ? newHotels : [...state.hotels, ...newHotels],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newHotels };
    } catch (error) {
      console.error("Error fetching hotels:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة الفنادق. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch hotels by user ID
  fetchUserHotels: async (userId, pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      hotels: resetPagination ? [] : state.hotels,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let hotelsQuery;

      if (lastVisible && !resetPagination) {
        hotelsQuery = query(
          collection(db, COLLECTION_NAME),
          where("created_by.uid", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        hotelsQuery = query(
          collection(db, COLLECTION_NAME),
          where("created_by.uid", "==", userId),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(hotelsQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newHotels = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        hotels: resetPagination ? newHotels : [...state.hotels, ...newHotels],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newHotels };
    } catch (error) {
      console.error("Error fetching user hotels:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة الفنادق. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Update a hotel
  updateHotel: async (hotelId, hotelData) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, hotelId);
      await updateDoc(docRef, {
        ...hotelData,
        updatedAt: serverTimestamp(),
      });

      const updatedHotel = {
        id: hotelId,
        ...hotelData,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        hotels: state.hotels.map((hotel) =>
          hotel.id === hotelId ? { ...hotel, ...updatedHotel } : hotel
        ),
        currentHotel:
          state.currentHotel?.id === hotelId
            ? { ...state.currentHotel, ...updatedHotel }
            : state.currentHotel,
        loading: false,
      }));

      return { success: true, data: updatedHotel };
    } catch (error) {
      console.error("Error updating hotel:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء تحديث بيانات الفندق. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Delete a hotel
  deleteHotel: async (hotelId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, hotelId);
      await deleteDoc(docRef);

      set((state) => ({
        hotels: state.hotels.filter((hotel) => hotel.id !== hotelId),
        currentHotel:
          state.currentHotel?.id === hotelId ? null : state.currentHotel,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting hotel:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء حذف الفندق. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },
}));

export default useHotelStore;
