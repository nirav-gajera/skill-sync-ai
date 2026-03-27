import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden',
            padding: '24px 16px',
        }}>

            {/* Grid background */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)
                `,
                backgroundSize: '56px 56px',
            }} />

            {/* Top glow */}
            <div style={{
                position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '800px', height: '400px', zIndex: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56,189,248,0.09) 0%, transparent 70%)',
            }} />

            {/* Bottom-right glow */}
            <div style={{
                position: 'fixed', bottom: 0, right: 0,
                width: '500px', height: '400px', zIndex: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 70%)',
            }} />

            {/* Panel */}
            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 13,
                            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(14,165,233,0.30)',
                        }}>
                            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                                <path d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5"/>
                                <circle cx="9" cy="9" r="2.5" fill="white"/>
                            </svg>
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
                            Skill<span style={{ color: '#38bdf8' }}>Sync</span>.ai
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div style={{
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 20,
                    padding: '36px 32px',
                    boxShadow: '0 24px 60px rgba(0,0,0,0.40)',
                }}>
                    {children}
                </div>

                {/* Footer */}
                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#334155' }}>
                    © {new Date().getFullYear()} SkillSync.ai — All rights reserved
                </p>
            </div>

            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>
        </div>
    );
}