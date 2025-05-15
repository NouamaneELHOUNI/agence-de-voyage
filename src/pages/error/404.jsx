import { Link } from "react-router-dom";

export default function NotFound404() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ marginBottom: '1rem' }}>Page Not Found / الصفحة غير موجودة</h2>
            <p style={{ marginBottom: '2rem' }}>
                The page you are looking for does not exist.<br />
                الصفحة التي تبحث عنها غير موجودة.
            </p>
            <Link to="/" style={{ padding: '0.75rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
                Go Home / العودة للرئيسية
            </Link>
        </div>
    );
} 