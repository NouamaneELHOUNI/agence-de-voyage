import React, { useState } from "react";

export default function LogoutDialog({ open, onClose, onConfirm }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
                <h2 className="text-lg font-bold mb-4">تأكيد تسجيل الخروج</h2>
                <p className="mb-6">هل أنت متأكد أنك تريد تسجيل الخروج؟</p>
                <div className="flex gap-2 justify-center">
                    <button
                        className="px-4 py-2 rounded bg-destructive text-white font-bold hover:bg-destructive/80"
                        onClick={onConfirm}
                    >
                        تأكيد تسجيل الخروج
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-muted text-gray-700 font-bold hover:bg-gray-300"
                        onClick={onClose}
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
} 