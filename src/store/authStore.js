import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { auth, db, storage } from "@/lib/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  login: async (email, password, rememberMe) => {
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user, error: null });
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, error: null });
      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    }
  },

  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      return false;
    }
  },
  deleteAccount: async (password) => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return { success: false, error: "لم يتم العثور على المستخدم" };
      }

      try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      } catch (authError) {
        let errorMessage;
        switch (authError.code) {
          case "auth/invalid-credential":
            errorMessage = "كلمة المرور غير صحيحة";
            break;
          case "auth/too-many-requests":
            errorMessage =
              "تم تجاوز عدد المحاولات المسموح به. يرجى المحاولة لاحقًا";
            break;
          default:
            errorMessage = "فشل في التحقق من كلمة المرور";
        }
        return { success: false, error: errorMessage };
      }

      // Delete Firestore document
      try {
        const userDocRef = doc(db, "users", user.uid);
        await deleteDoc(userDocRef);
      } catch (firestoreError) {
        console.error("Error deleting user document:", firestoreError);
        // Continue with account deletion even if document deletion fails
      }

      // Delete profile image
      try {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await deleteObject(storageRef);
      } catch (storageError) {
        console.log("No profile image found or error deleting:", storageError);
        // Continue with account deletion even if image deletion fails
      }

      // Delete user account
      await deleteUser(user);
      await useAuthStore.getState().logout();

      return { success: true };
    } catch (error) {
      console.error("Error in account deletion:", error);

      const errorMessage = "حدث خطأ أثناء حذف الحساب. يرجى المحاولة مرة أخرى";
      return { success: false, error: errorMessage };
    }
  },
  reset: () => set({ user: null, error: null }),
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});

export default useAuthStore;
