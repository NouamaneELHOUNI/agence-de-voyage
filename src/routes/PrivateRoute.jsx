import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";

export default function PrivateRoute() {
    const { user, loading } = useAuthStore();

    if (loading) return null; // Or a loading spinner
    if (!user) return <Navigate to="/login" replace />;
    return <Outlet />;
} 