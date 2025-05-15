import { Link } from "react-router-dom";

export default function ServerError500() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>500</h1>
            <h2 style={{ marginBottom: '1rem' }}>Server Error / خطأ في الخادم</h2>
            <p style={{ marginBottom: '2rem' }}>
                Something went wrong on our end.<br />
                حدث خطأ في الخادم. يرجى المحاولة لاحقًا.
            </p>
            <Link to="/" style={{ padding: '0.75rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
                Go Home / العودة للرئيسية
            </Link>
        </div>
    );
} 