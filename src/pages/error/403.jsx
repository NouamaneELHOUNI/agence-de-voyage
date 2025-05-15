import { Link } from "react-router-dom";

export default function Forbidden403() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>403</h1>
            <h2 style={{ marginBottom: '1rem' }}>Access Denied / ليس لديك صلاحية الوصول</h2>
            <p style={{ marginBottom: '2rem' }}>
                You do not have permission to view this page.<br />
                ليس لديك إذن لعرض هذه الصفحة.
            </p>
            <Link to="/" style={{ padding: '0.75rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
                Go Home / العودة للرئيسية
            </Link>
        </div>
    );
} 