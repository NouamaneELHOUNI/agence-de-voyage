import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";

export default function PublicRoute() {
    const { user, loading } = useAuthStore();

    if (loading) return null; // Or a loading spinner
    if (user) return <Navigate to="/dashboard" replace />;
    return <Outlet />;
} 