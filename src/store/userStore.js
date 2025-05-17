import { create } from "zustand";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  startAfter,
  limit,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import useAuthStore from "./authStore";

const COLLECTION_NAME = "users";

const initialState = {
  users: [],
  deletedUsers: [],
  currentUser: null,
  lastVisible: null,
  lastVisibleDeleted: null,
  loading: false,
  error: null,
};

// User roles with different access levels
export const USER_ROLES = {
  ADMIN: "admin", // Full access to everything
  MANAGER: "manager", // Can manage most things except other admins
  AGENT: "agent", // Limited access to client management
  USER: "user", // Basic access
};

export const ACCOUNT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING: "pending",
};

const useUserStore = create((set, get) => ({
  ...initialState,

  // Reset state
  reset: () => set(initialState),

  // Create a new user with Firebase Auth and store additional data in Firestore
  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const currentUser = useAuthStore.getState().user;
      const currentUserRole = currentUser?.role || "";
      
      // Role validation - can only create users with the same role or lower
      if (
        (userData.userRole === USER_ROLES.ADMIN && currentUserRole !== USER_ROLES.ADMIN) ||
        (userData.userRole === USER_ROLES.MANAGER && 
          ![USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(currentUserRole))
      ) {
        set({
          loading: false,
          error: "لا تملك الصلاحية لإنشاء مستخدم بهذه الرتبة.",
        });
        return { success: false, error: "لا تملك الصلاحية لإنشاء مستخدم بهذه الرتبة." };
      }

      // Create user in Firebase Auth
      const authResult = await createUserWithEmailAndPassword(
        auth,
        userData.userEmail,
        userData.password // Temporary password
      );

      const user = authResult.user;
      
      // Update display name in Auth profile
      await updateProfile(user, {
        displayName: `${userData.first_name} ${userData.last_name}`,
      });

      // Create a complete user object with all fields for Firestore
      const completeUserData = {
        uid: user.uid,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        username: userData.username || "",
        userEmail: userData.userEmail || "",
        userTel: userData.userTel || "",
        userRole: userData.userRole || USER_ROLES.USER,
        accountStatus: userData.accountStatus || ACCOUNT_STATUS.ACTIVE,
        avatar: userData.avatar || "",
        email_status: userData.email_status || "verified",
        created_by: currentUser?.uid || "",
        date_created: serverTimestamp(),
        date_updated: serverTimestamp(),
        date_deleted: null,
        is_deleted_u: false,
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), completeUserData);
      
      // Get the complete document with server timestamps
      const docSnap = await getDoc(docRef);
      
      const newUser = {
        id: docRef.id,
        ...docSnap.data(),
        // Convert Firestore timestamps to JS Dates consistently
        date_created: docSnap.data().date_created?.toDate?.() || new Date(),
        date_updated: docSnap.data().date_updated?.toDate?.() || new Date(),
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
        error: error.message || "حدث خطأ أثناء إنشاء المستخدم",
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
          date_created: docSnap.data().date_created?.toDate?.() || new Date(),
          date_updated: docSnap.data().date_updated?.toDate?.() || new Date(),
          date_deleted: docSnap.data().date_deleted?.toDate?.() || null,
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

  // Fetch active users with pagination (not soft-deleted)
  fetchUsers: async (pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      users: resetPagination ? [] : state.users,
      lastVisible: resetPagination ? null : state.lastVisible,
    }));

    try {
      // For development, we'll use a simple query without composite indexes
      // to avoid the need to create Firestore indexes immediately
      const usersRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(usersRef);

      // Filter active users in memory
      const activeUsers = querySnapshot.docs
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
        .filter(user => !user.is_deleted_u)
        .sort((a, b) => b.date_created - a.date_created);

      set({
        users: activeUsers,
        loading: false,
      });

      return { success: true, data: activeUsers };
    } catch (error) {
      console.error("Error fetching users:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة المستخدمين. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Fetch deleted users with pagination
  fetchDeletedUsers: async (pageSize = 10, resetPagination = false) => {
    set((state) => ({
      loading: true,
      error: null,
      deletedUsers: resetPagination ? [] : state.deletedUsers,
      lastVisibleDeleted: resetPagination ? null : state.lastVisibleDeleted,
    }));

    try {
      // For development, we'll use a simple query without composite indexes
      const usersRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(usersRef);

      // Filter deleted users in memory
      const deletedUsers = querySnapshot.docs
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
        .filter(user => user.is_deleted_u)
        .sort((a, b) => (b.date_deleted || b.date_updated) - (a.date_deleted || a.date_updated));

      set({
        deletedUsers: deletedUsers,
        loading: false,
      });

      return { success: true, data: deletedUsers };
    } catch (error) {
      console.error("Error fetching deleted users:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء استرجاع قائمة المستخدمين المحذوفين. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Search users
  searchUsers: async (searchTerm, includeDeleted = false) => {
    set({ loading: true, error: null });

    try {
      // Get all users
      const usersRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(usersRef);

      const searchTermLower = searchTerm.toLowerCase();

      const matchingUsers = querySnapshot.docs
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
        .filter((user) => {
          // Filter by deleted status if not including deleted
          if (!includeDeleted && user.is_deleted_u) {
            return false;
          }

          // Search in various fields
          const firstNameMatch = user.first_name?.toLowerCase().includes(searchTermLower);
          const lastNameMatch = user.last_name?.toLowerCase().includes(searchTermLower);
          const usernameMatch = user.username?.toLowerCase().includes(searchTermLower);
          const emailMatch = user.userEmail?.toLowerCase().includes(searchTermLower);
          const telMatch = user.userTel?.includes(searchTerm);
          const roleMatch = user.userRole?.toLowerCase().includes(searchTermLower);

          return firstNameMatch || lastNameMatch || usernameMatch || 
                 emailMatch || telMatch || roleMatch;
        })
        .sort((a, b) => b.date_created - a.date_created);

      // Update state based on whether we're including deleted users
      if (includeDeleted) {
        const activeUsers = matchingUsers.filter(user => !user.is_deleted_u);
        const deletedMatchingUsers = matchingUsers.filter(user => user.is_deleted_u);
        
        set({ 
          users: activeUsers, 
          deletedUsers: deletedMatchingUsers,
          loading: false 
        });
        
        return { 
          success: true, 
          data: { 
            active: activeUsers, 
            deleted: deletedMatchingUsers 
          } 
        };
      } else {
        set({ users: matchingUsers, loading: false });
        return { success: true, data: matchingUsers };
      }
    } catch (error) {
      console.error("Error searching users:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء البحث عن المستخدمين. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Update a user
  updateUser: async (userId, userData) => {
    set({ loading: true, error: null });

    try {
      const currentUser = useAuthStore.getState().user;
      const currentUserRole = currentUser?.role || "";
      
      // Get the current user to check roles
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        set({
          loading: false,
          error: "لم يتم العثور على المستخدم",
        });
        return { success: false, error: "لم يتم العثور على المستخدم" };
      }
      
      const existingUserData = docSnap.data();
      
      // Role validation - can only update users with lower roles or same role if admin
      if (
        (existingUserData.userRole === USER_ROLES.ADMIN && currentUserRole !== USER_ROLES.ADMIN) ||
        (userData.userRole === USER_ROLES.ADMIN && currentUserRole !== USER_ROLES.ADMIN) ||
        (existingUserData.userRole === USER_ROLES.MANAGER && 
          ![USER_ROLES.ADMIN, USER_ROLES.MANAGER].includes(currentUserRole))
      ) {
        set({
        loading: false,
          error: "لا تملك الصلاحية لتعديل هذا المستخدم.",
        });
        return { success: false, error: "لا تملك الصلاحية لتعديل هذا المستخدم." };
      }
      
      // Prepare update data
      const updateData = {
        ...userData,
        date_updated: serverTimestamp(),
      };
      
      await updateDoc(docRef, updateData);

      // Format user data for state update
      const updatedUser = {
        id: userId,
        ...userData,
        date_updated: new Date(),
      };

      // Update state based on deletion status
      set((state) => {
        // If user is being marked as deleted
        if (userData.is_deleted_u === true) {
          return {
            // Remove from active users
            users: state.users.filter((user) => user.id !== userId),
            // Add to deleted users if not already there
            deletedUsers: state.deletedUsers.some(user => user.id === userId) 
              ? state.deletedUsers.map(user => 
                  user.id === userId ? { ...user, ...updatedUser } : user
                )
              : [updatedUser, ...state.deletedUsers],
            currentUser:
              state.currentUser?.id === userId
                ? { ...state.currentUser, ...updatedUser }
                : state.currentUser,
            loading: false,
          };
        } 
        // If user is being restored from deleted
        else if (userData.is_deleted_u === false) {
          return {
            // Add to active users if not already there
            users: state.users.some(user => user.id === userId)
              ? state.users.map(user => 
                  user.id === userId ? { ...user, ...updatedUser } : user
                )
              : [updatedUser, ...state.users],
            // Remove from deleted users
            deletedUsers: state.deletedUsers.filter((user) => user.id !== userId),
            currentUser:
              state.currentUser?.id === userId
                ? { ...state.currentUser, ...updatedUser }
                : state.currentUser,
            loading: false,
          };
        } 
        // Regular update without changing deletion status
        else {
          return {
            users: state.users.map((user) =>
              user.id === userId ? { ...user, ...updatedUser } : user
            ),
            deletedUsers: state.deletedUsers.map((user) =>
              user.id === userId ? { ...user, ...updatedUser } : user
            ),
            currentUser:
              state.currentUser?.id === userId
                ? { ...state.currentUser, ...updatedUser }
                : state.currentUser,
            loading: false,
          };
        }
      });

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

  // Soft delete a user (mark as deleted)
  softDeleteUser: async (userId) => {
    set({ loading: true, error: null });

    try {
      const currentUser = useAuthStore.getState().user;
      const currentUserRole = currentUser?.role || "";
      
      // Get the current user to check roles
      const docRef = doc(db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        set({
          loading: false,
          error: "لم يتم العثور على المستخدم",
        });
        return { success: false, error: "لم يتم العثور على المستخدم" };
      }
      
      const existingUserData = docSnap.data();
      
      // Role validation - can only delete users with lower roles
      if (
        (existingUserData.userRole === USER_ROLES.ADMIN && currentUserRole !== USER_ROLES.ADMIN) ||
        (existingUserData.userRole === USER_ROLES.MANAGER && 
          ![USER_ROLES.ADMIN].includes(currentUserRole))
      ) {
        set({
          loading: false,
          error: "لا تملك الصلاحية لحذف هذا المستخدم.",
        });
        return { success: false, error: "لا تملك الصلاحية لحذف هذا المستخدم." };
      }
      
      // Mark as deleted with timestamp
      await updateDoc(docRef, {
        is_deleted_u: true,
        date_deleted: serverTimestamp(),
      });

      // Update local state
      set((state) => ({
        // Remove from active users
        users: state.users.filter((user) => user.id !== userId),
        // Get the user data before removing
        deletedUsers: [
          ...state.deletedUsers,
          {
            ...state.users.find((user) => user.id === userId),
            is_deleted_u: true,
            date_deleted: new Date(),
          },
        ].filter(Boolean), // Remove undefined if user not found
        currentUser:
          state.currentUser?.id === userId ? null : state.currentUser,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error soft-deleting user:", error);
      set({
        loading: false,
        error: "حدث خطأ أثناء حذف المستخدم. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },

  // Restore a deleted user
  restoreUser: async (userId) => {
    set({ loading: true, error: null });

    try {
      const docRef = doc(db, COLLECTION_NAME, userId);
      
      // Mark as not deleted and clear deletion date
      await updateDoc(docRef, {
        is_deleted_u: false,
        date_deleted: null,
      });

      // Update local state
      set((state) => {
        // Get the user data before removing from deleted
        const restoredUser = state.deletedUsers.find((user) => user.id === userId);
        
        if (!restoredUser) {
          return { loading: false };
        }
        
        return {
          // Add to active users
          users: [
            { ...restoredUser, is_deleted_u: false, date_deleted: null },
            ...state.users,
          ],
          // Remove from deleted users
          deletedUsers: state.deletedUsers.filter((user) => user.id !== userId),
        loading: false,
        };
      });

      return { success: true };
    } catch (error) {
      console.error("Error restoring user:", error);
      set({
          loading: false,
        error: "حدث خطأ أثناء استعادة المستخدم. يرجى المحاولة مرة أخرى.",
      });
      return { success: false, error: error.message };
    }
  },
}));

export default useUserStore;
