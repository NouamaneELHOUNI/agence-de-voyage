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

const COLLECTION_NAME = "users";

const initialState = {
  users: [],
  currentUser: null,
  lastVisible: null,
  loading: false,
  error: null,
};

const useUsersStore = create((set, get) => ({
  ...initialState,

  // Reset state
  reset: () => set(initialState),

  // Create a new user
  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      // Get current user from auth store
      const user = useAuthStore.getState().user;

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...userData,
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

      const newUser = {
        id: docRef.id,
        ...userData,
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
        users: [newUser, ...state.users],
        loading: false,
      }));

      return { success: true, data: newUser };
    } catch (error) {
      console.error("Error creating user:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء إنشاء المستخدم. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch a single user by ID
  fetchUser: async (userId) => {
    set({ loading: true, error: null, currentUser: null });
    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
        };

        set({ currentUser: userData, loading: false });
        return { success: true, data: userData };
      } else {
        set({
          loading: false,
          error: "لم يتم العثور على المستخدم",
        });
        return { success: false, error: "لم يتم العثور على المستخدم" };
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع بيانات المستخدم. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch multiple users
  fetchUsers: async (pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      users: resetPagination ? [] : state.users,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let usersQuery;

      if (lastVisible && !resetPagination) {
        usersQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        usersQuery = query(
          collection(db, COLLECTION_NAME),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(usersQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        users: resetPagination ? newUsers : [...state.users, ...newUsers],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newUsers };
    } catch (error) {
      console.error("Error fetching users:", error);
      set({
        loading: false,
        error:
          "حدث خطأ أثناء استرجاع قائمة المستخدمين. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch users by role
  fetchUsersByRole: async (role, pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      users: resetPagination ? [] : state.users,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      const { lastVisible } = get();

      let usersQuery;

      if (lastVisible && !resetPagination) {
        usersQuery = query(
          collection(db, COLLECTION_NAME),
          where("userRole", "==", role),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        usersQuery = query(
          collection(db, COLLECTION_NAME),
          where("userRole", "==", role),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const querySnapshot = await getDocs(usersQuery);

      if (querySnapshot.empty && resetPagination) {
        set({ loading: false });
        return { success: true, data: [] };
      }

      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      const newUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        users: resetPagination ? newUsers : [...state.users, ...newUsers],
        lastVisible: lastVisibleDoc,
        loading: false,
      }));

      return { success: true, data: newUsers };
    } catch (error) {
      console.error("Error fetching users by role:", error);
      set({
        loading: false,
        error:
          "حدث خطأ أثناء استرجاع قائمة المستخدمين. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Update a user
  updateUser: async (userId, userData) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });

      const updatedUser = {
        id: userId,
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? { ...user, ...updatedUser } : user
        ),
        currentUser:
          state.currentUser?.id === userId
            ? { ...state.currentUser, ...updatedUser }
            : state.currentUser,
        loading: false,
      }));

      return { success: true, data: updatedUser };
    } catch (error) {
      console.error("Error updating user:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء تحديث بيانات المستخدم. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Delete a user
  deleteUser: async (userId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      await deleteDoc(docRef);

      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        currentUser:
          state.currentUser?.id === userId ? null : state.currentUser,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء حذف المستخدم. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },
}));

export default useUsersStore;
