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

const COLLECTION_NAME = "services";

const initialState = {
  services: [],
  currentService: null,
  lastVisible: null,
  loading: false,
  error: null,
};

const useServiceStore = create((set, get) => ({
  ...initialState,

  // Reset state
  reset: () => set(initialState),

  // Create a new service
  createService: async (serviceData) => {
    set({ loading: true, error: null });
    try {
      // Get current user from auth store
      const user = useAuthStore.getState().user;

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...serviceData,
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

      const newService = {
        id: docRef.id,
        ...serviceData,
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
        services: [newService, ...state.services],
        loading: false,
      }));

      return { success: true, data: newService };
    } catch (error) {
      console.error("Error creating service:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء إنشاء الخدمة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch a single service by ID
  fetchService: async (serviceId) => {
    set({ loading: true, error: null, currentService: null });
    try {
      const docRef = doc(db, COLLECTION_NAME, serviceId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const serviceData = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
        };

        set({ currentService: serviceData, loading: false });
        return { success: true, data: serviceData };
      } else {
        set({
          loading: false,
          error: "لم يتم العثور على الخدمة",
        });
        return { success: false, error: "لم يتم العثور على الخدمة" };
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع بيانات الخدمة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch multiple services
  fetchServices: async (pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      services: resetPagination ? [] : state.services,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let servicesQuery;

      if (lastVisible && !resetPagination) {
        servicesQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        servicesQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(servicesQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newServices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        services: resetPagination
          ? newServices
          : [...state.services, ...newServices],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newServices };
    } catch (error) {
      console.error("Error fetching services:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة الخدمات. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch services by user ID
  fetchUserServices: async (userId, pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      services: resetPagination ? [] : state.services,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let servicesQuery;

      if (lastVisible && !resetPagination) {
        servicesQuery = query(
          collection(db, COLLECTION_NAME),
          where("created_by.uid", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        servicesQuery = query(
          collection(db, COLLECTION_NAME),
          where("created_by.uid", "==", userId),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(servicesQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newServices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        services: resetPagination
          ? newServices
          : [...state.services, ...newServices],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newServices };
    } catch (error) {
      console.error("Error fetching user services:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة الخدمات. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Update a service
  updateService: async (serviceId, serviceData) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, serviceId);
      await updateDoc(docRef, {
        ...serviceData,
        updatedAt: serverTimestamp(),
      });

      const updatedService = {
        id: serviceId,
        ...serviceData,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        services: state.services.map((service) =>
          service.id === serviceId ? { ...service, ...updatedService } : service
        ),
        currentService:
          state.currentService?.id === serviceId
            ? { ...state.currentService, ...updatedService }
            : state.currentService,
        loading: false,
      }));

      return { success: true, data: updatedService };
    } catch (error) {
      console.error("Error updating service:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء تحديث بيانات الخدمة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Delete a service
  deleteService: async (serviceId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, serviceId);
      await deleteDoc(docRef);

      set((state) => ({
        services: state.services.filter((service) => service.id !== serviceId),
        currentService:
          state.currentService?.id === serviceId ? null : state.currentService,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting service:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء حذف الخدمة. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },
}));

export default useServiceStore;
