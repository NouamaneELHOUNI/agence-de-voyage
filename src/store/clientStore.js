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

const COLLECTION_NAME = "clients";

const initialState = {
  clients: [],
  currentClient: null,
  lastVisible: null,
  loading: false,
  error: null,
};

const useClientStore = create((set, get) => ({
  ...initialState,

  // Reset state
  reset: () => set(initialState),

  // Create a new client
  createClient: async (clientData) => {
    set({ loading: true, error: null });
    try {
      // Get current user from auth store
      const user = useAuthStore.getState().user;

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...clientData,
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

      const newClient = {
        id: docRef.id,
        ...clientData,
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
        clients: [newClient, ...state.clients],
        loading: false,
      }));

      return { success: true, data: newClient };
    } catch (error) {
      console.error("Error creating client:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء إنشاء العميل. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch a single client by ID
  fetchClient: async (clientId) => {
    set({ loading: true, error: null, currentClient: null });
    try {
      const docRef = doc(db, COLLECTION_NAME, clientId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const clientData = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
        };

        set({ currentClient: clientData, loading: false });
        return { success: true, data: clientData };
      } else {
        set({
          loading: false,
          error: "لم يتم العثور على العميل",
        });
        return { success: false, error: "لم يتم العثور على العميل" };
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع بيانات العميل. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch multiple clients
  fetchClients: async (pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      clients: resetPagination ? [] : state.clients,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let clientsQuery;

      if (lastVisible && !resetPagination) {
        clientsQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        clientsQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(clientsQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newClients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        clients: resetPagination
          ? newClients
          : [...state.clients, ...newClients],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newClients };
    } catch (error) {
      console.error("Error fetching clients:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة العملاء. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch clients by user ID
  fetchUserClients: async (userId, pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      clients: resetPagination ? [] : state.clients,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let clientsQuery;

      if (lastVisible && !resetPagination) {
        clientsQuery = query(
          collection(db, COLLECTION_NAME),
          where("created_by.uid", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        clientsQuery = query(
          collection(db, COLLECTION_NAME),
          where("created_by.uid", "==", userId),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(clientsQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newClients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        clients: resetPagination
          ? newClients
          : [...state.clients, ...newClients],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newClients };
    } catch (error) {
      console.error("Error fetching user clients:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة العملاء. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Update a client
  updateClient: async (clientId, clientData) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, clientId);
      await updateDoc(docRef, {
        ...clientData,
        updatedAt: serverTimestamp(),
      });

      const updatedClient = {
        id: clientId,
        ...clientData,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === clientId ? { ...client, ...updatedClient } : client
        ),
        currentClient:
          state.currentClient?.id === clientId
            ? { ...state.currentClient, ...updatedClient }
            : state.currentClient,
        loading: false,
      }));

      return { success: true, data: updatedClient };
    } catch (error) {
      console.error("Error updating client:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء تحديث بيانات العميل. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Delete a client
  deleteClient: async (clientId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, clientId);
      await deleteDoc(docRef);

      set((state) => ({
        clients: state.clients.filter((client) => client.id !== clientId),
        currentClient:
          state.currentClient?.id === clientId ? null : state.currentClient,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting client:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء حذف العميل. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },
}));

export default useClientStore;
