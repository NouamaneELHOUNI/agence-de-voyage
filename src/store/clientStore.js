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
  deletedClients: [],
  currentClient: null,
  lastVisible: null,
  lastVisibleDeleted: null,
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
      const currentUser = useAuthStore.getState().user;
      
      // Create a complete client object with all fields
      const completeClientData = {
        clients_name: clientData.clients_name || "",
        clients_tel: clientData.clients_tel || "",
        clients_email: clientData.clients_email || "",
        clients_adresse: clientData.clients_adresse || "",
        clients_status: clientData.clients_status || "active",
        clients_passport: clientData.clients_passport || "",
        clients_cin: clientData.clients_cin || "",
        clients_sex: clientData.clients_sex || "",
        clients_dob: clientData.clients_dob || null,
        clients_city: clientData.clients_city || "",
        clients_country: clientData.clients_country || "",
        created_by_user: currentUser?.uid || "",
        date_created: serverTimestamp(),
        date_updated: serverTimestamp(),
        date_deleted: null,
        is_deleted: false,
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), completeClientData);
      
      // Get the complete document with server timestamps
      const docSnap = await getDoc(docRef);
      
      const newClient = {
        id: docRef.id,
        ...docSnap.data(),
        // Convert Firestore timestamps to JS Dates consistently
        date_created: docSnap.data().date_created?.toDate?.() || new Date(),
        date_updated: docSnap.data().date_updated?.toDate?.() || new Date(),
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
          date_created: docSnap.data().date_created?.toDate?.() || new Date(),
          date_updated: docSnap.data().date_updated?.toDate?.() || new Date(),
          date_deleted: docSnap.data().date_deleted?.toDate?.() || null,
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

  // Fetch active clients with pagination (not soft-deleted)
  fetchClients: async (pageSize = 10, resetPagination = false) => {
    console.log("fetchClients called with pageSize:", pageSize, "resetPagination:", resetPagination);
    set((state) => ({
      loading: true,
      error: null,
      clients: resetPagination ? [] : state.clients,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();
      console.log("Current lastVisible:", lastVisible);

      // TEMPORARY SOLUTION: Use a simple query without composite index requirements
      // This can be replaced once you create the proper indexes in Firestore
      console.log("Using temporary simple query without index requirements");
      const clientsQuery = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(clientsQuery);
      console.log("Query complete. Size:", querySnapshot.size);

      // Filter active clients in memory
      const newClients = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date_created: data.date_created?.toDate?.() || new Date(),
            date_updated: data.date_updated?.toDate?.() || new Date(),
            date_deleted: data.date_deleted?.toDate?.() || null,
          };
        })
        .filter(client => !client.is_deleted) // Filter active clients
        .sort((a, b) => b.date_created - a.date_created); // Sort by date desc
      
      console.log("Filtered active clients:", newClients.length);

      set({
        clients: newClients,
        loading: false,
      });

      return { success: true, data: newClients };
    } catch (error) {
      console.error("Error fetching clients:", error);
      console.log("Error details:", error.code, error.message);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة العملاء. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch deleted clients with pagination
  fetchDeletedClients: async (pageSize = 10, resetPagination = false) => {
    console.log("fetchDeletedClients called with pageSize:", pageSize, "resetPagination:", resetPagination);
    set((state) => ({
      loading: true,
      error: null,
      deletedClients: resetPagination ? [] : state.deletedClients,
      lastVisibleDeleted: resetPagination ? null : state.lastVisibleDeleted,
    }));

    try {
      const { lastVisibleDeleted } = get();
      console.log("Current lastVisibleDeleted:", lastVisibleDeleted);

      // TEMPORARY SOLUTION: Use a simple query without composite index requirements
      // This can be replaced once you create the proper indexes in Firestore
      console.log("Using temporary simple query without index requirements for deleted clients");
      const clientsQuery = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(clientsQuery);
      console.log("Query complete. Size:", querySnapshot.size);

      // Filter deleted clients in memory
      const deletedClients = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date_created: data.date_created?.toDate?.() || new Date(),
            date_updated: data.date_updated?.toDate?.() || new Date(),
            date_deleted: data.date_deleted?.toDate?.() || null,
          };
        })
        .filter(client => client.is_deleted) // Filter deleted clients
        .sort((a, b) => (b.date_deleted || b.date_updated) - (a.date_deleted || a.date_updated)); // Sort by date desc
      
      console.log("Filtered deleted clients:", deletedClients.length);

      set({
        deletedClients: deletedClients,
        loading: false,
      });

      return { success: true, data: deletedClients };
    } catch (error) {
      console.error("Error fetching deleted clients:", error);
      console.log("Error details:", error.code, error.message);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة العملاء المحذوفين. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Search clients - includes option to search deleted or active clients
  searchClients: async (searchTerm, includeDeleted = false) => {
    set({ loading: true, error: null, clients: [] });

    try {
      // Get all clients
      const clientsRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(clientsRef);

      const searchTermLower = searchTerm.toLowerCase();

      const matchingClients = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date_created: doc.data().date_created?.toDate?.() || new Date(),
          date_updated: doc.data().date_updated?.toDate?.() || new Date(),
          date_deleted: doc.data().date_deleted?.toDate?.() || null,
        }))
        .filter((client) => {
          // Filter by deleted status if not including deleted
          if (!includeDeleted && client.is_deleted) {
            return false;
          }

          // Search in various fields
          const nameMatch = client.clients_name
            ?.toLowerCase()
            .includes(searchTermLower);
          const emailMatch = client.clients_email
            ?.toLowerCase()
            .includes(searchTermLower);
          const phoneMatch = client.clients_tel?.includes(searchTerm);
          const addressMatch = client.clients_adresse
            ?.toLowerCase()
            .includes(searchTermLower);
          const passportMatch = client.clients_passport
            ?.toLowerCase()
            .includes(searchTermLower);
          const cinMatch = client.clients_cin
            ?.toLowerCase()
            .includes(searchTermLower);
          const cityMatch = client.clients_city
            ?.toLowerCase()
            .includes(searchTermLower);
          const countryMatch = client.clients_country
            ?.toLowerCase()
            .includes(searchTermLower);

          return nameMatch || emailMatch || phoneMatch || addressMatch || 
                 passportMatch || cinMatch || cityMatch || countryMatch;
        })
        .sort((a, b) => b.date_created - a.date_created);

      // Update the appropriate state based on whether we're including deleted clients
      if (includeDeleted) {
        const activeClients = matchingClients.filter(client => !client.is_deleted);
        const deletedClients = matchingClients.filter(client => client.is_deleted);
        
        set({ 
          clients: activeClients, 
          deletedClients: deletedClients,
          loading: false 
        });
        return { 
          success: true, 
          data: { 
            active: activeClients, 
            deleted: deletedClients 
          } 
        };
      } else {
        set({ clients: matchingClients, loading: false });
        return { success: true, data: matchingClients };
      }
    } catch (error) {
      console.error("Error searching clients:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء البحث عن العملاء. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Update a client
  updateClient: async (clientId, clientData) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, clientId);
      
      // Prepare update data
      const updateData = {
        ...clientData,
        date_updated: serverTimestamp(),
      };
      
      await updateDoc(docRef, updateData);

      // Format client data for state update
      const updatedClient = {
        id: clientId,
        ...clientData,
        date_updated: new Date().toISOString(),
      };

      // Update state based on deletion status
      set((state) => {
        // If client is being marked as deleted
        if (clientData.is_deleted === true) {
          return {
            // Remove from active clients
            clients: state.clients.filter((client) => client.id !== clientId),
            // Add to deleted clients if not already there
            deletedClients: state.deletedClients.some(client => client.id === clientId) 
              ? state.deletedClients.map(client => 
                  client.id === clientId ? { ...client, ...updatedClient } : client
                )
              : [updatedClient, ...state.deletedClients],
            currentClient:
              state.currentClient?.id === clientId
                ? { ...state.currentClient, ...updatedClient }
                : state.currentClient,
            loading: false,
          };
        } 
        // If client is being restored from deleted
        else if (clientData.is_deleted === false) {
          return {
            // Add to active clients if not already there
            clients: state.clients.some(client => client.id === clientId)
              ? state.clients.map(client => 
                  client.id === clientId ? { ...client, ...updatedClient } : client
                )
              : [updatedClient, ...state.clients],
            // Remove from deleted clients
            deletedClients: state.deletedClients.filter((client) => client.id !== clientId),
            currentClient:
              state.currentClient?.id === clientId
                ? { ...state.currentClient, ...updatedClient }
                : state.currentClient,
            loading: false,
          };
        } 
        // Regular update without changing deletion status
        else {
          return {
            clients: state.clients.map((client) =>
              client.id === clientId ? { ...client, ...updatedClient } : client
            ),
            deletedClients: state.deletedClients.map((client) =>
              client.id === clientId ? { ...client, ...updatedClient } : client
            ),
            currentClient:
              state.currentClient?.id === clientId
                ? { ...state.currentClient, ...updatedClient }
                : state.currentClient,
            loading: false,
          };
        }
      });

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

  // Soft delete a client (mark as deleted)
  softDeleteClient: async (clientId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, clientId);
      
      // Mark as deleted with timestamp
      await updateDoc(docRef, {
        is_deleted: true,
        date_deleted: serverTimestamp(),
      });

      // Update local state
      set((state) => ({
        // Remove from active clients
        clients: state.clients.filter((client) => client.id !== clientId),
        // Get the client data before removing
        deletedClients: [
          ...state.deletedClients,
          {
            ...state.clients.find((client) => client.id === clientId),
            is_deleted: true,
            date_deleted: new Date().toISOString(),
          },
        ].filter(Boolean), // Remove undefined if client not found
        currentClient:
          state.currentClient?.id === clientId ? null : state.currentClient,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error soft-deleting client:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء حذف العميل. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Restore a deleted client
  restoreClient: async (clientId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, clientId);
      
      // Mark as not deleted and clear deletion date
      await updateDoc(docRef, {
        is_deleted: false,
        date_deleted: null,
      });

      // Update local state
      set((state) => {
        // Get the client data before removing from deleted
        const restoredClient = state.deletedClients.find((client) => client.id === clientId);
        
        if (!restoredClient) {
          return { loading: false };
        }
        
        return {
          // Add to active clients
          clients: [
            { ...restoredClient, is_deleted: false, date_deleted: null },
            ...state.clients,
          ],
          // Remove from deleted clients
          deletedClients: state.deletedClients.filter((client) => client.id !== clientId),
          loading: false,
        };
      });

      return { success: true };
    } catch (error) {
      console.error("Error restoring client:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استعادة العميل. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Hard delete a client (permanent deletion from database)
  hardDeleteClient: async (clientId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, clientId);
      await deleteDoc(docRef);

      set((state) => ({
        clients: state.clients.filter((client) => client.id !== clientId),
        deletedClients: state.deletedClients.filter((client) => client.id !== clientId),
        currentClient:
          state.currentClient?.id === clientId ? null : state.currentClient,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error permanently deleting client:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء الحذف النهائي للعميل. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Debug function to fetch all clients without filters
  debugFetchAllClients: async () => {
    console.log("DEBUG: Fetching all clients without filters");
    try {
      // Simple query with no filters
      const simpleFetch = await getDocs(collection(db, COLLECTION_NAME));
      
      console.log("DEBUG: Total documents in collection:", simpleFetch.size);
      
      // Log all documents
      simpleFetch.forEach(doc => {
        console.log("DEBUG: Document ID:", doc.id);
        console.log("DEBUG: Document data:", doc.data());
      });
      
      return { 
        success: true, 
        count: simpleFetch.size 
      };
    } catch (error) {
      console.error("DEBUG: Error in simple fetch:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },
}));

export default useClientStore;
